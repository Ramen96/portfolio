import { AnimatedSprite, Assets, Spritesheet, Point, Sprite } from 'pixi.js';

export class Character {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.animations = {};
    this.currentAnimation = null;
    this.velocity = new Point(0, 0);
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
      width: 80
    }
  }

  async loadAnimations(animationData) {
    for (const [name, data] of Object.entries(animationData)) {
      try {
        const texture = await Assets.load(data.sprite);
        const spritesheet = new Spritesheet(texture, data.json);
        await spritesheet.parse();

        let displayObject;

        if (spritesheet.animations && spritesheet.animations[data.animationKey]) {
          displayObject = new AnimatedSprite(spritesheet.animations[data.animationKey]);
          displayObject.animationSpeed = data.speed;
        } else {
          const frameKey = Object.keys(data.json.frames)[0];
          displayObject = new Sprite(spritesheet.textures[frameKey]);
        }

        displayObject.visible = false;
        texture.baseTexture.scaleMode = 'nearest';

        this.animations[name] = displayObject;

        console.log(`Loaded ${name} as ${displayObject instanceof AnimatedSprite ? 'AnimatedSprite' : 'Sprite'}`);

      } catch (error) {
        console.error(`Failed to load animation "${name}":`, error);
        continue;
      }
    }

    if (this.animations.idle) {
      this.playAnimation('idle');
      this.updateCharacterScale();
    }
  }

  updateCharacterScale() {
    if (this.currentAnimation) {
      const characterHeight = this.characterDimensions.height;
      const scale = characterHeight / this.currentAnimation.height;
      this.currentAnimation.scale.set(scale);
      
      // Update width based on actual scaled sprite dimensions
      this.characterDimensions.width = this.currentAnimation.width * Math.abs(scale);
    }
  }

  playAnimation(animationName) {
    if (!this.animations[animationName]) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }

    if (this.currentAnimation === this.animations[animationName]) {
      return;
    }

    // Stop and hide previous animation
    if (this.currentAnimation) {
      if (this.currentAnimation instanceof AnimatedSprite) {
        this.currentAnimation.stop();
      }
      this.currentAnimation.visible = false;
    }

    // Start new animation
    this.currentAnimation = this.animations[animationName];
    this.currentAnimation.visible = true;

    if (this.currentAnimation instanceof AnimatedSprite) {
      this.currentAnimation.play();
    }

    this.updateCharacterScale();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    
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
    // if (this.x > 0 && direction === 'left' || this.x < 0 && direction === 'right') {
    //   this.direction = !direction; 
    // }

    // this doesn't seem to be working as intended but committing for now to save progress
    switch (direction) {
      case this.velocity.x > 0 && direction === 'left':
      case this.velocity.x < 0 && direction === 'right':
        this.direction = !direction;
        break;
      default:
        break;
    }
    if (this.facing !== direction) {
      this.facing = direction;
      for (const animation of Object.values(this.animations)) {
        animation.scale.x *= -1;
      }
    }
  }
}