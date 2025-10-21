"use client";
import { useEffect } from "react";
import { Application } from 'pixi.js';
import { Player } from "./GameUtils/classes/player.js"; 
import { InputManager } from "./GameUtils/classes/inputManager.js";
import { PhysicsEngine } from "./GameUtils/classes/physicsEngine.js";
import { knightAnimations } from "./GameUtils/Animations/playerKnight.js";

export default function Game() {
  useEffect(() => {
    let app, knight, inputManager, physicsEngine;

    (async () => {
      // Application setup
      app = new Application();
      await app.init({ background: '#1099bb', resizeTo: window });
      document.body.appendChild(app.canvas);

      // input setup
      inputManager = new InputManager();
      inputManager.startListening();

      // character setup
      knight = new Player();
      await knight.loadAnimations(knightAnimations);
      
      const groundY = app.screen.height - knight.characterDimensions.height;
      
      // Set the internal position property and update sprite positions
      knight.setPosition(app.screen.width / 2, groundY); 
      knight.x = app.screen.width / 2;
      knight.y = groundY; 

      // physics engine setup
      // Pass app.screen.width directly to the PhysicsEngine
      physicsEngine = new PhysicsEngine(
        knight, 
        app.screen.height,
        app.screen.width 
      );

      // Link InputManager to the Player's movement properties
      const updateMovementState = (keys) => {
          Object.assign(knight.movement, keys);
      };
      inputManager.subscribe(updateMovementState);
      
      // stage setup: Add the player's animated sprites to the stage
      Object.values(knight.animations).forEach(animation => {
        app.stage.addChild(animation);
      });
      
      // main game loop 
      app.ticker.add((time) => {
        // Normalize delta time for consistent physics, regardless of frame rate
        const delta = time.deltaTime / 60; 

        // Update Physics Engine
        physicsEngine.update(delta);
      });

    })();

    // clean up function
    return () => {
      if (inputManager) {
          inputManager.stopListening();
          // Remove subscription here if necessary, though it usually cleans up when objects are destroyed
      }
      if (app) {
          app.destroy();
      }
    };
  }, []);
  
  return null;
}
