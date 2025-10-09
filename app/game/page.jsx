"use client";
import { useEffect } from "react";
import { Application, Point } from 'pixi.js';
import { Character } from "./GameUtils/classes/character";
import { knightAnimations } from "./GameUtils/Animations/playerKnight";

export default function Game() {
  useEffect(() => {
    (async () => {
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background: '#1099bb', resizeTo: window });

      // Append the application canvas to the document body
      document.body.appendChild(app.canvas);

      // Create the player sprite
      const knight = new Character();

      await knight.loadAnimations(knightAnimations);

      const knightHeight = 100;
      const scale = knightHeight / knight.animations.idle.height;
      knight.setScale(scale);

      knight.setPosition(
        app.screen.width / 2, 
        app.screen.height - knightHeight
      );

      // Spawn the player
      Object.values(knight.animations).forEach(animation => {
        app.stage.addChild(animation);
      });

      // Movement state
      const movement = {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
        canDoubleJump: true,
        onGround: false,
      };

      // In air movement state
      const inAirMovement = {
        left: false,
        right: false,
      };

      // Listen for frame updates
      app.ticker.add((time) => {
        const delta = time.deltaTime;

        // Apply gravity
        const gravity = new Point(0, 0.98);
        knight.velocity.x += gravity.x * delta;
        knight.velocity.y += gravity.y * delta;
        knight.x += knight.velocity.x * delta;
        knight.y += knight.velocity.y * delta;

        // Prevent knight from going out of bounds and set onGround status
        if (knight.y < 0 || knight.y > app.screen.height - knight.height) {
          knight.y = Math.max(0, Math.min(knight.y, app.screen.height - knight.height));
          movement.onGround = true;
          movement.canDoubleJump = true;
          knight.velocity.y = 0;
        }

        if (knight.x < 0 || knight.x > app.screen.width - knight.width) {
          knight.x = Math.max(0, Math.min(knight.x, app.screen.width - knight.width));
        }

        // Handle movement
        if (movement.onGround === false) {
          if (movement.left) { 
            inAirMovement.left = true; 
          } else if (movement.right) { 
            inAirMovement.right = true; 
          }
        } else {
          if (movement.left) { 
            knight.x -= 10 * delta; 
          }
          if (movement.right) { 
            knight.x += 10 * delta; 
          }
        }

        if (inAirMovement.left || inAirMovement.right) {
          // If both are pressed reset horizontal movement
          if (inAirMovement.left && inAirMovement.right) {
            inAirMovement.left = false;
            inAirMovement.right = false;
          } 

          if (inAirMovement.left) {
            knight.x -= 9 * delta; 
          }
          if (inAirMovement.right) {
            knight.x += 9 * delta; 
          }
        }

        // Commented out for now, might add back later for downward attack mechanic
        // if (movement.down) knight.y += 10 * delta;

        // Reset in-air movement when landing
        if (movement.onGround) {
          inAirMovement.left = false;
          inAirMovement.right = false;
        }

        // Handle jumping
        if (movement.jump) {
          if (movement.onGround) {
            knight.velocity.y = -20; 
            movement.onGround = false;
          } else if (movement.canDoubleJump) {
            knight.velocity.y = -15; 
            movement.canDoubleJump = false; 
          }
          movement.jump = false;   
        }
      
      });

      // Handle keyboard input
      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'w':
          case 'ArrowUp':
            movement.up = true;
            break;
          case 's':
          case 'ArrowDown':
            movement.down = true;
            break;
          case 'a':
          case 'ArrowLeft':
            movement.left = true;
            break;
          case 'd':
          case 'ArrowRight':
            movement.right = true;
            break;
          case ' ':
            movement.jump = true;
            break;
        }
      };

      const handleKeyUp = (event) => {
        switch (event.key) {
          case 'w':
          case 'ArrowUp':
            movement.up = false;
            break;
          case 's':
          case 'ArrowDown':
            movement.down = false;
            break;
          case 'a':
          case 'ArrowLeft':
            movement.left = false;
            break;
          case 'd':
          case 'ArrowRight':
            movement.right = false;
            break;
          case ' ':
            movement.jump = false;
            break;
        }
      };

      // Add event listeners for keyboard input
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      // Clean up event listeners when component unmounts
      return () => {
        document.removeEventListener('keydown', handleKeyDown, { once: true });
        document.removeEventListener('keyup', handleKeyUp, { once: true });
        app.destroy();
      };
    })();
  });
}