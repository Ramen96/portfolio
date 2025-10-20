import { AnimatedSprite, Assets, Spritesheet, Point, Sprite } from 'pixi.js';

export class Character {
  constructor() {
    this.animations = {};
    this.currentAnimation = null;
    this.velocity = new Point(0);
    this.mass = 3;
    this.facing = 'right';

    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false,
      canDoubleJump: true,
      onGround: false,
    };

    this.inAirMovement = {
      left: false,
      right: false,
    };

    this.characterDimensions = {
      height: 100,
    }
  }

  async loadAnimations(animationData, screenWidth, screenHeight) {
    for (const [name, data] of Object.entries(animationData)) {
      try {
        const texture = await Assets.load(data.sprite);
        const spritesheet = new Spritesheet(texture, data.json);
        await spritesheet.parse();

        let displayObject;

        // Check if this is a multi-frame animation or single sprite
        if (spritesheet.animations && spritesheet.animations[data.animationKey]) {
          // Multi-frame animation - use AnimatedSprite
          displayObject = new AnimatedSprite(spritesheet.animations[data.animationKey]);
          displayObject.animationSpeed = data.speed;
        } else {
          // Single frame - use regular Sprite
          const frameKey = Object.keys(data.json.frames)[0];
          displayObject = new Sprite(spritesheet.textures[frameKey]);
        }

        // Common properties for both Sprite and AnimatedSprite
        displayObject.visible = false;
        texture.baseTexture.scaleMode = 'nearest';

        this.animations[name] = displayObject;

        console.log(`Loaded ${name} as ${displayObject instanceof AnimatedSprite ? 'AnimatedSprite' : 'Sprite'}`);

      } catch (error) {
        console.error(`Failed to load animation "${name}":`, error);
        continue;
      }
    }

    // Set initial animation if available
    if (this.animations.idle) {
      this.playAnimation('idle');
      this.updateCharacterScale();
      this.setInitialPosition(screenWidth, screenHeight);
      this.checkBoundaries(screenWidth, screenHeight);
    }
  }

  updateCharacterScale() {
    if (this.currentAnimation) {
      const desiredHeight = this.characterDimensions.height;
      const scale = desiredHeight / this.currentAnimation.height;
      this.currentAnimation.scale.set(scale);
    }
  }

  setInitialPosition(screenWidth, screenHeight) {
    if (this.currentAnimation) {
      const actualHeight = this.currentAnimation.height * this.currentAnimation.scale.y;
      this.setPosition(
        screenWidth / 2,
        screenHeight - actualHeight / 2
      );
    }
  }

  setGravityEffect(gravity, delta) {
    this.velocity.x += gravity.x * this.mass * delta;
    this.velocity.y += gravity.y * this.mass * delta;
    this.x += this.velocity.x * delta;
    this.y += this.velocity.y * delta;
  }

  checkBoundaries(screenWidth, screenHeight) {
    if (this.y < 0 || this.y > screenHeight - this.height) {
      this.y = Math.max(0, Math.min(this.y, screenHeight - this.height));
      this.movement.onGround = true;
      this.movement.canDoubleJump = true;
      this.velocity.y = 0;
    }

    if (this.x < 0 || this.x > screenWidth - this.width) {
      this.x = Math.max(0, Math.min(this.x, screenWidth - this.width));
    }
  }

  playAnimation(animationName) {
    if (this.currentAnimation) {
      this.currentAnimation.visible = false;
      // Only stop if it's an AnimatedSprite
      if (this.currentAnimation instanceof AnimatedSprite) {
        this.currentAnimation.stop();
      }
    }

    this.currentAnimation = this.animations[animationName];
    if (!this.currentAnimation) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }

    this.currentAnimation.visible = true;
    // Only play if it's an AnimatedSprite
    if (this.currentAnimation instanceof AnimatedSprite) {
      this.currentAnimation.play();
    }
  }

  setPosition(x, y) {
    for (const animation of Object.values(this.animations)) {
      animation.position.set(x, y);
    }
  }

  setScale(scale) {
    for (const animation of Object.values(this.animations)) {
      animation.scale.set(scale);
    }
  }

  setDirection(direction) {
    if (this.facing !== direction) {
      this.facing = direction;
      for (const animation of Object.values(this.animations)) {
        animation.scale.x *= -1;
      }
    }
  }

  handleMovement(delta, bounds) {
    

    // Handle boundaries and ground status
    if (this.y < 0 || this.y > bounds.bottom - this.height) {
      this.currentAnimation.y = Math.max(bounds.top, Math.min(this.y, bounds.bottom - this.height));
      this.movement.onGround = true;
      this.movement.canDoubleJump = true;
      this.velocity.y = 0;
    }

    if (this.x < bounds.left || this.x > bounds.right - this.width) {
      this.currentAnimation.x = Math.max(bounds.left, Math.min(this.x, bounds.right - this.width));
    }

    this.updatePosition(delta);
  }

  updatePosition(delta) {

  }
}