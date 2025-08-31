"use client";
import React, { use, useEffect, useState } from "react";
import { Application, Assets, Container, Sprite } from 'pixi.js';



export default function Game() {
  useEffect(() => {
    (async () => {
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background: '#1099bb', resizeTo: window });

      // Append the application canvas to the document body
      document.body.appendChild(app.canvas);

      // Create and add a container to the stage
      const container = new Container();

      app.stage.addChild(container);

      // Load the bunny texture
      const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

      // Create a 5x5 grid of bunnies in the container
      for (let i = 0; i < 25; i++) {
        const bunny = new Sprite(texture);

        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        container.addChild(bunny);
      }

      // Move the container to the center
      container.x = app.screen.width / 2;
      container.y = app.screen.height / 2;

      // Center the bunny sprites in local container coordinates
      container.pivot.x = container.width / 2;
      container.pivot.y = container.height / 2;

      // Create movement state object
      const movement = {
        up: false,
        down: false,
        left: false,
        right: false,
        rotating: false
      };

      // Listen for frame updates
      app.ticker.add((time) => {
        if (movement.up) container.y -= 5 * time.deltaTime;
        if (movement.down) container.y += 5 * time.deltaTime;
        if (movement.left) container.x -= 5 * time.deltaTime;
        if (movement.right) container.x += 5 * time.deltaTime;
        if (movement.rotating) container.rotation += 0.01 * time.deltaTime;
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
            movement.rotating = true;
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
            movement.rotating = false;
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      // Clean up event listeners when component unmounts
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        app.destroy();
      };
    })();
  });
}