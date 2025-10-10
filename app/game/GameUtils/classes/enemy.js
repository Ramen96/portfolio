import { Character } from './character';

export class Enemy extends Character {
  constructor() {
    super();
    this.target = null;
    this.detectionRange = 200; 
  }

  setTarget(target) {
    this.target = target;
  }

  updatePosition(delta) {
    if (!this.target) return;

    // Example AI behavior
    const distanceToTarget = Math.abs(this.x - this.target.x);

    if (distanceToTarget < this.detectionRange) {
      // Move towards target
      if (this.x < this.target.x) {
        this.movement.right = true;
        this.movement.left = false;
      } else {
        this.movement.left = true;
        this.movement.right = false;
      }

      // Simple jump logic
      if (this.movement.onGround && this.target.y < this.y) {
        this.movement.jump = true;
      }
    }

    // Use the same movement physics as the player
    if (this.movement.left) {
      this.x -= 10 * delta;
    }
    if (this.movement.right) {
      this.x += 10 * delta;
    }

    // Handle jumping
    if (this.movement.jump) {
      if (this.movement.onGround) {
        this.velocity.y = -20;
        this.movement.onGround = false;
      }
      this.movement.jump = false;
    }
  }
}