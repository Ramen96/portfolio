"use client";
import { useEffect } from "react";
import { Application } from 'pixi.js';
import { Player } from "./GameUtils/classes/player.js"; 
import { InputManager } from "./GameUtils/classes/inputManager.js";
import { PhysicsEngine } from "./GameUtils/classes/physicsEngine.js";
import { playerAnimations } from "./GameUtils/Animations/player.js";

export default function Game() {
  useEffect(() => {
    let app, player, inputManager, physicsEngine;

    (async () => {
      // Application setup
      app = new Application();
      await app.init({ background: '#1099bb', resizeTo: window });
      document.body.appendChild(app.canvas);

      // input setup
      inputManager = new InputManager();
      inputManager.startListening();

      // character setup
      player = new Player();
      await player.loadAnimations(playerAnimations);
      
      const groundY = app.screen.height - player.characterDimensions.height;
      
      // Set spawn position
      player.setPosition(app.screen.width / 2, groundY); 

      // physics engine setup
      physicsEngine = new PhysicsEngine(
        player, 
        app.screen.height,
        app.screen.width 
      );

      // Link InputManager to the Player's movement properties
      const updateMovementState = (keys) => {
          Object.assign(player.movement, keys);
      };
      inputManager.subscribe(updateMovementState);
      
      // stage setup: Add the player's animated sprites to the stage
      Object.values(player.animations).forEach(animation => {
        app.stage.addChild(animation);
      });
      
      // main game loop 
      app.ticker.maxFPS = 120;
      app.ticker.add((time) => {
        const delta = time.deltaTime;

        // Update Physics Engine
        physicsEngine.update(delta);
      });

    })();

    // clean up function
    return () => {
      if (inputManager) {
          inputManager.stopListening();
      }
      if (app) {
        app.destroy(true, { children: true });
      }
    };
  }, []);
  
  return null;
}