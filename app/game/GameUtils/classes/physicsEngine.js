import { Point } from 'pixi.js';

const GRAVITY = 0.98;
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

    update(delta) {
        this.applyGravity(delta);
        this.handleHorizontalMovement(delta);
        this.handleJumping();
        this.applyVelocity(delta);
        this.checkBoundaries();
        this.updateCharacterVisuals();
    }

    applyGravity(delta) {
        // Apply gravity to y velocity
        this.character.velocity.y += GRAVITY * delta;
        
        // Limit max fall speed
        if (this.character.velocity.y > MAX_FALL_SPEED) {
            this.character.velocity.y = MAX_FALL_SPEED;
        }
    }

    // need to add check for left/right movement input on the ground vs in air
    // this is causing left/right movement to swap directions unexpectedly, such that when the player
    // is back on the ground after a jump, left/right inputs are inverted
    handleHorizontalMovement(delta) { 
        const movement = this.character.movement;
        
        if (movement.left) {
            this.character.velocity.x = -this.moveSpeed;
            this.character.setDirection('left'); 
        } else if (movement.right) {
            this.character.velocity.x = this.moveSpeed;
            this.character.setDirection('right');
        } else if (movement.onGround) {
            // Apply friction when on ground and no input
            this.character.velocity.x *= GROUND_FRICTION;
            if (Math.abs(this.character.velocity.x) < 0.1) {
                this.character.velocity.x = 0;
            }
        } else {
            // Apply air drag
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
            movement.jump = false;
        }
    }

    applyVelocity(delta) {
        // Update character position based on velocity
        this.character.x += this.character.velocity.x * delta;
        this.character.y += this.character.velocity.y * delta;
        
        // Update sprite positions
        this.character.setPosition(this.character.x, this.character.y);
    }

    checkBoundaries() {
        const char = this.character;
        const groundY = this.screenHeight - char.characterDimensions.height;

        // Ground collision
        if (char.y >= groundY) {
            char.y = groundY;
            char.velocity.y = 0;
            
            // Just landed
            if (!char.movement.onGround) {
                char.movement.onGround = true;
                char.movement.canDoubleJump = true;
            }
        } else {
            // In the air
            if (char.movement.onGround) {
                char.movement.onGround = false;
            }
        }
        
        // Left wall collision
        if (char.x < 0) {
            char.x = 0;
            char.velocity.x = 0;
        } 
        else if (char.x - char.characterDimensions.width > this.screenWidth) {
            char.x = this.screenWidth - char.characterDimensions.width;
            char.velocity.x = 0;
        }
        
        // Update sprite positions after boundary corrections
        char.setPosition(char.x, char.y);
    }

    updateCharacterVisuals() {
        const char = this.character;
        const isMovingHorizontally = Math.abs(char.velocity.x) > 0.1;

        if (char.movement.onGround) {
            if (isMovingHorizontally) {
                char.playAnimation('walk');
            } else {
                char.playAnimation('idle');
            }
        } else {
            // In air
            if (char.velocity.y < 0) {
                char.playAnimation('jump'); // Going up
            } else {
                char.playAnimation('fall'); // Going down
            }
        }
    }
}