import { Point } from 'pixi.js';

const GRAVITY = new Point(0, 0.98);
const GROUND_FRICTION = 0.85;
const AIR_DRAG = 0.98;
const MAX_FALL_SPEED = 20;

export class PhysicsEngine {
    constructor(character, screenHeight, screenWidth) { 
        this.character = character;
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.moveSpeed = 8;
        this.jumpPower = 20;
        this.doubleJumpPower = 15;
    }

    // This is the primary function run in the game loop
    update(delta) {
        this.applyGravity(delta);
        this.handleHorizontalMovement(delta);
        this.handleJumping();
        this.applyVelocity(delta);
        this.checkBoundaries();
        this.updateCharacterVisuals(); // Includes state transitions for animation
    }

    applyGravity(delta) {
        // Apply gravity
        this.character.velocity.x += GRAVITY.x * delta;
        this.character.velocity.y += GRAVITY.y * delta;
        
        // Limit max fall speed
        if (this.character.velocity.y > MAX_FALL_SPEED) {
            this.character.velocity.y = MAX_FALL_SPEED;
        }
    }

    handleHorizontalMovement(delta) {
        const movement = this.character.movement;
        
        if (movement.left) {
            this.character.velocity.x = -this.moveSpeed;
            // FIX: Set direction immediately when the key is down
            this.character.setDirection('left'); 
        } else if (movement.right) {
            this.character.velocity.x = this.moveSpeed;
            // FIX: Set direction immediately when the key is down
            this.character.setDirection('right');
        } else if (this.character.movement.onGround) {
            // Apply friction/deceleration when on the ground and no key is pressed
            this.character.velocity.x *= GROUND_FRICTION;
            if (Math.abs(this.character.velocity.x) < 0.1) {
                this.character.velocity.x = 0;
            }
        } else {
            // Apply drag when in the air
            this.character.velocity.x *= AIR_DRAG;
        }
    }

    handleJumping() {
        const movement = this.character.movement;
        
        if (movement.jump) {
            if (movement.onGround) {
                this.character.velocity.y = -this.jumpPower; 
                movement.onGround = false;
            } else if (movement.canDoubleJump) {
                this.character.velocity.y = -this.doubleJumpPower; 
                movement.canDoubleJump = false; 
            }
            // Consumed the jump input for this frame (important for single-frame trigger)
            movement.jump = false;
        }
    }

    applyVelocity(delta) {
        // Apply final calculated velocity to the internal position (x, y)
        this.character.x += this.character.velocity.x * delta;
        this.character.y += this.character.velocity.y * delta;
        
        // Use the setPosition function in Character to update all PIXI display objects
        this.character.setPosition(this.character.x, this.character.y);
    }

    checkBoundaries() {
        const char = this.character;
        const groundY = this.screenHeight - char.characterDimensions.height;

        // Vertical Boundary Check (Ground)
        if (char.y >= groundY) {
            char.y = groundY;
            char.velocity.y = 0;
            
            // State transition: If they just landed
            if (!char.movement.onGround) {
                char.movement.onGround = true;
                char.movement.canDoubleJump = true;
            }
        }
        
        // Horizontal Boundaries (Walls)
        const screenWidth = this.screenWidth; 
        
        if (char.x < 0) {
            char.x = 0;
            char.velocity.x = 0;
        } else if (char.x > screenWidth - char.characterDimensions.width) {
            char.x = screenWidth - char.characterDimensions.width;
            char.velocity.x = 0;
        }
    }

    // Handles setting the appropriate animation based on current state
    updateCharacterVisuals() {
        const char = this.character;
        // If the character is moving horizontally (velocity magnitude is greater than a small threshold)
        const isMovingHorizontally = Math.abs(char.velocity.x) > 0.1;

        if (char.movement.onGround) {
            // If the character is moving (even if friction is slowing them down)
            if (isMovingHorizontally) {
                char.playAnimation('run');
            } else {
                // Not moving, so idle
                char.playAnimation('idle');
            }
        } else {
            // Check for falling/jumping state
            if (char.velocity.y < 0) {
                char.playAnimation('jump'); // Ascending
            } else {
                char.playAnimation('fall'); // Descending
            }
        }
    }
}
