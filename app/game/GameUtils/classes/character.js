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
  }

  async loadAnimations(animationData) {
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
    // Apply gravity
    const gravity = new Point(0, 0.98);
    this.velocity.x += gravity.x * delta;
    this.velocity.y += gravity.y * delta;
    this.currentAnimation.x += this.velocity.x * delta;
    this.currentAnimation.y += this.velocity.y * delta;

    // Handle boundries and ground status
    if (this.y < bounds.top || this.y > bounds.bottom - this.height) {
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





