"use client";
import React, { use, useEffect, useState } from "react";
import { Application, Assets, Point, Sprite } from 'pixi.js';
import darkKnight from './GameAssets/DarkKnight.png';
import knightPNG from './GameAssets/knight.png';

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

      const knight = new Sprite(texture);
      knight.position.set(app.screen.width / 2, app.screen.height / 2);
      knight.height = 115;
      knight.width = 115;
      knight.velocity = new Point(0);
      knight.mass = 3;

      console.log(app.stage.width)
      const movement = {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
        doubleJump: false,
        canDoubleJump: true,
        onGround: false,
      };

      // Listen for frame updates
      app.ticker.add((time) => {
        const delta = time.deltaTime;

        const gravity = new Point(0, 0.98);
        knight.velocity.x += gravity.x * delta;
        knight.velocity.y += gravity.y * delta;

        knight.x += knight.velocity.x * delta;
        knight.y += knight.velocity.y * delta;

        function jump() {
          if (knight.y >= app.screen.height - knight.height) {
            knight.velocity.y = -25;
            knight.y = app.screen.height - knight.height; // Reset position to ground level
          }
        }

        if (movement.up) knight.y -= 3 * delta;
        if (movement.down) knight.y += 10 * delta;
        if (movement.left) knight.x -= 10 * delta;
        if (movement.right) knight.x += 10 * delta;
        if (movement.jump) jump();

        if (movement.onGround && movement.jump) {
          jump();
          movement.onGround = false;
        }

        if (movement.jump && !movement.onGround && movement.canDoubleJump) {
          knight.velocity.y = -7.5;
          movement.canDoubleJump = false;
        }

        if (knight.y < 0 || knight.y > app.screen.height - knight.height) {
          knight.y = Math.max(0, Math.min(knight.y, app.screen.height - knight.height));
        }

        if (knight.x < 0 || knight.x > app.screen.width - knight.width) {
          knight.x = Math.max(0, Math.min(knight.x, app.screen.width - knight.width));
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

      app.stage.addChild(knight);

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