import { Character } from "./character";

export class Player extends Character {
  constructor() {
    super();
  }

  handleInput(key, isPressed) {
    switch (key) {
      case 'ArrowUp':
      case 'w':
        this.movement.up = isPressed;
        break;
      case 'ArrowDown':
      case 's':
        this.movement.down = isPressed;
        break;
      case 'ArrowLeft':
      case 'a':
        this.movement.left = isPressed;
        break;
      case 'ArrowRight':
      case 'd':
        this.movement.right = isPressed;
        break;
      case ' ':
        this.movement.jump = isPressed;
        break;
      default:
        break;
    }
  }

  updatePosition(delta) {
    if (this.movement.onGround) {

      if (this.movement.left) {
        this.inAirMovement.left = true;
      }

      else if (this.movement.right) {
        this.inAirMovement.right = true;
      }
      else {
        if (this.inAirMovement.left) {
          this.x -= 10 * delta;
        }
        if (this.inAirMovement.right) {
          this.x += 10 * delta;
        }
      }

      if (this.inAirMovement.left || this.inAirMovement.right) {
        if (this.inAirMovement.left && this.inAirMovement.right) {
          this.inAirMovement.left = false;
          this.inAirMovement.right = false;
        }

        if (this.inAirMovement.left) {
          this.x -= 9 * delta;
        }
        if (this.inAirMovement.right) {
          this.x += 9 * delta;
        }

        if (this.movement.jump) {
          if (this.movement.onGround) {
            this.velocity.y = -20;
            this.movement.onGround = false;
          }
          else if (this.movement.canDoubleJump) {
            this.velocity.y = -15;
            this.movement.canDoubleJump = false;
          }
          this.movement.jump = false;
        }
      }
    }
  }
}