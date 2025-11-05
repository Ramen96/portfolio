"use client";
import { useEffect } from "react";
import { Application, Container, Sprite, Assets, Texture, Rectangle } from 'pixi.js';
import { Player } from "./GameUtils/classes/player.js"; 
import { InputManager } from "./GameUtils/classes/inputManager.js";
import { PhysicsEngine } from "./GameUtils/classes/physicsEngine.js";
import { playerAnimations } from "./GameUtils/Animations/player.js";
import LevelGenerator from "./GameUtils/levelGenerator.js";
import tilesPNG from './GameAssets/tilesets/tiles.png';
import tilesAtlas from './GameAssets/tilesets/tiles.json';

export default function Game() {
  useEffect(() => {
    let app, player, inputManager, physicsEngine, levelGraphics;
    const TILE_SIZE = 32;

    (async () => {
      // Application setup
      app = new Application();
      await app.init({ background: '#1099bb', resizeTo: window });
      document.body.appendChild(app.canvas);

      // level generation
      const levelWidth = Math.ceil(app.screen.width / TILE_SIZE);
      const levelHeight = Math.ceil(app.screen.height / TILE_SIZE);
      const levelGenerator = new LevelGenerator(levelWidth, levelHeight);
      const levelGrid = levelGenerator.generateCave();

      // Create container for level tiles
      const levelContainer = new Container();
      app.stage.addChild(levelContainer);

      // Load the tile texture
      const tileTexture = await Assets.load(tilesPNG);
      
      // Draw the level using tiles
      for (let y = 0; y < levelHeight; y++) {
        for (let x = 0; x < levelWidth; x++) {
          if (levelGrid[y][x] === 1) {
            const tile = new Sprite(tileTexture);
            tile.width = TILE_SIZE;
            tile.height = TILE_SIZE;
            tile.position.set(x * TILE_SIZE, y * TILE_SIZE);
            levelContainer.addChild(tile);
          }
        }
      }

      // find spawn position
      let spawnX = app.screen.width / 2;
      let spawnY = 0;
      const spawnGridX = Math.floor(spawnX / TILE_SIZE);

      // Search for a valid spawn point (empty space with solid ground below)
      for (let y = 0; y < levelHeight - 1; y++) {  // Stop one row before the end
        if (levelGrid[y][spawnGridX] === 0 && levelGrid[y + 1][spawnGridX] === 1) {
          spawnY = y * TILE_SIZE;
          break;
        }
      }

      // If no valid spawn point found, use a default position
      if (spawnY === 0) {
        spawnY = TILE_SIZE * 2; // Place a bit below the top of the screen
      }

      // input setup
      inputManager = new InputManager();
      inputManager.startListening();

      // character setup
      player = new Player();
      await player.loadAnimations(playerAnimations);
      
      // Set spawn position
      player.setPosition(spawnX, spawnY); 

      // physics engine setup
      physicsEngine = new PhysicsEngine(
        player, 
        app.screen.height,
        app.screen.width,
        levelGrid,
        TILE_SIZE
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