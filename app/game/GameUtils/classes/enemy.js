import { Character } from './character';

export class Enemy extends Character {
  constructor() {
    super();
    this.target = null;
    this.detectionRange = 200;
    this.attackRange = 80; // How close enemy needs to be to attack
    this.isEnemy = true; // Flag to identify enemies
  }

  setTarget(target) {
    this.target = target;
  }

  updateAI(delta) {
    if (!this.target) return;

    const distanceToTarget = Math.abs(this.x - this.target.x);

    // Reset movement flags
    this.movement.left = false;
    this.movement.right = false;

    if (distanceToTarget < this.detectionRange) {
      // Check if in attack range
      if (distanceToTarget < this.attackRange) {
        // Stop moving and attack
        this.movement.attack = true;
      } else {
        // Move towards target
        if (this.x < this.target.x) {
          this.movement.right = true;
        } else {
          this.movement.left = true;
        }
      }

      // Simple jump logic - jump if target is above
      if (this.movement.onGround && this.target.y < this.y - 50) {
        this.movement.jump = true;
      }
    }
  }

  onAttackStart() {
    // Enemy-specific attack behavior
    console.log("Enemy attacks!");
    
    // Check if player is still in range and facing them
    if (this.target) {
      const distanceToTarget = Math.abs(this.x - this.target.x);
      const facingTarget = 
        (this.facing === 'right' && this.target.x > this.x) ||
        (this.facing === 'left' && this.target.x < this.x);
      
      if (distanceToTarget < this.attackRange && facingTarget) {
        // Deal damage to player
        // this.target.takeDamage(10);
        console.log("Hit player!");
      }
    }
  }
}