"use client";
import React, { use, useEffect, useState } from "react";
import { Application, Assets, Point, Sprite, Spritesheet, AnimatedSprite } from 'pixi.js';
import darkKnight from './GameAssets/DarkKnight.png';
import knightPNG from './GameAssets/knight.png';
import knightWalking from './GameAssets/KnightPixelArt/Spritesheet/walk-fames/knight-walk.png';
import knightWalkingJSON from './GameAssets/KnightPixelArt/Spritesheet/walk-fames/knight-walk.json';

export default function Game() {
  useEffect(() => {
    (async () => {
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background: '#1099bb', resizeTo: window });

      // Append the application canvas to the document body
      document.body.appendChild(app.canvas);

      // Load the texture
      let texture;
      try {
        texture = await Assets.load(knightPNG.src);
      } catch (error) {
        console.error('Failed to load texture:', error);
        texture = await Assets.load('https://pixijs.com/assets/bunny.png');
      }

      // Load player textures for animation
      const playerTextures = await Assets.load(knightWalking.src);
      const playerSpriteSheet = new Spritesheet(playerTextures, knightWalkingJSON);
      await playerSpriteSheet.parse();

      const playerWalkAnimation = new AnimatedSprite(playerSpriteSheet.animations['knight-walk']);
      playerWalkAnimation.animationSpeed = 0.1;
      playerWalkAnimation.play();
      playerWalkAnimation.height = 115;
      playerWalkAnimation.width = 115;
      playerWalkAnimation.position.set(app.screen.width / 2, app.screen.height - playerWalkAnimation.height);

      // Create the knight sprite
      const knight = new Sprite(texture);
      knight.height = 115;
      knight.width = 115;
      knight.velocity = new Point(0);
      knight.mass = 3;
      knight.position.set(app.screen.width / 2, app.screen.height - knight.height);

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

      // Spawn the knight
      app.stage.addChild(knight);
      app.stage.addChild(playerWalkAnimation);

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