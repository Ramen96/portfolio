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
      attack: false,
      canDoubleJump: true,
      onGround: false,
    };

    // Attack state management
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackCooldownTime = 500; // ms between attacks

    this.inAirMovement = {
      left: false,
      right: false,
    };

    this.characterDimensions = {
      height: 100,
      width: 80
    }
  }

  updateAttack(delta) {
    // Update cooldown timer
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta * 1000; // Convert delta to ms
    }

    // Check if attack input is pressed and we can attack
    if (this.movement.attack) {
      if (!this.isAttacking && this.attackCooldown <= 0) {
        this.performAttack();
      }
      // Always reset attack flag after checking
      this.movement.attack = false;
    }
  }

  performAttack() {
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownTime;
    this.playAnimation('attack');

    // You can override this in Player or Enemy classes for specific behavior
    this.onAttackStart();
  }

  // Hook for subclasses to override
  onAttackStart() {
    // Override in Player or Enemy for specific attack logic
  }

  // Call this when attack animation completes
  onAttackComplete() {
    this.isAttacking = false;
    // Return to appropriate idle/walk/jump animation
    if (this.movement.onGround) {
      const isMoving = Math.abs(this.velocity.x) > 0.1;
      this.playAnimation(isMoving ? 'walk' : 'idle');
    } else {
      this.playAnimation('jump');
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
        // texture.baseTexture.scaleMode = 'nearest';
        texture.source.scaleMode = 'nearest';

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
      const characterWidth = characterHeight * (this.currentAnimation.width / this.currentAnimation.height); // calculate width based on aspect ratio
      this.currentAnimation.setSize(characterWidth, characterHeight);
    }
  }

  checkCharacterScale() {
    if (this.currentAnimation) {
      const characterHeight = this.characterDimensions.height;
      const expectedScale = characterHeight / this.currentAnimation.height;
      if (this.currentAnimation.scale.x !== expectedScale) {
        this.updateCharacterScale();
      }
    }
  }

  stopAnimation() {
    if (!this.currentAnimation) return false;

    if (this.currentAnimation instanceof AnimatedSprite) {
      this.currentAnimation.stop();
      this.currentAnimation.onComplete = null;
    }

    this.currentAnimation.visible = false;
    this.currentAnimation = null;
    return true;
  }

  playAnimation(animationName) {
    if (!this.animations[animationName]) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }

    // Special handling for attack - always allow replaying
    const isAttackReplay = (animationName === 'attack' && this.currentAnimation === this.animations[animationName]);

    if (this.currentAnimation === this.animations[animationName] && !isAttackReplay) {
      return;
    }

    // Stop and hide previous animation
    if (this.currentAnimation && !isAttackReplay) {
      if (this.currentAnimation instanceof AnimatedSprite) {
        this.currentAnimation.stop();
        this.currentAnimation.onComplete = null; // Clear old listeners
      }
      this.currentAnimation.visible = false;
    }

    // Start new animation (or restart if attack replay)
    if (!isAttackReplay) {
      this.currentAnimation = this.animations[animationName];
      this.checkCharacterScale();
      this.currentAnimation.visible = true;
    }

    if (this.currentAnimation instanceof AnimatedSprite) {
      // Set up completion handler for attack animation
      if (animationName === 'attack') {
        this.currentAnimation.loop = false;
        this.currentAnimation.gotoAndPlay(0); // Reset to first frame
        this.currentAnimation.onComplete = () => {
          this.onAttackComplete();
        };
      } else {
        this.currentAnimation.loop = true;
        this.currentAnimation.onComplete = null;
        this.currentAnimation.play();
      }
    }
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
    if (this.facing !== direction) {
      this.facing = direction;
      for (const animation of Object.values(this.animations)) {
        animation.scale.x *= -1;
      }
    }
  }
}