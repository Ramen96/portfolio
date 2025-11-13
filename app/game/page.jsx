"use client";
import { useEffect } from "react";
import { Application, Container, Sprite, Assets, TilingSprite, Texture, Rectangle, Graphics } from 'pixi.js';
import { Player } from "./GameUtils/classes/player.js"; 
import { InputManager } from "./GameUtils/classes/inputManager.js";
import { PhysicsEngine } from "./GameUtils/classes/physicsEngine.js";
import { playerAnimations } from "./GameUtils/Animations/player.js";
import LevelGenerator from "./GameUtils/levelGenerator.js";
import { tileTextures } from "./GameUtils/tileset/tileset.js";

export default function Game() {
  useEffect(() => {
    let app, player, inputManager, physicsEngine, levelGraphics;
    const TILE_SIZE = 32;

    (async () => {
      // Application setup
      app = new Application();
      await app.init({ resizeTo: window });
      document.body.appendChild(app.canvas);

      // Load all textures first
      const loadedTextures = {};
      for (const [key, path] of Object.entries(tileTextures)) {
        loadedTextures[key] = await Assets.load(path);
      }

      // Create tiling background sprite
      const baseLayer = new TilingSprite({
        texture: loadedTextures.brick,
        width: app.screen.width,
        height: app.screen.height
      });

      app.stage.addChild(baseLayer);

      const variationLayer = new TilingSprite({
        texture: loadedTextures.blankWall,
        width: app.screen.width,
        height: app.screen.height,
      });

      const mask = new Graphics();
      const bgTileSize = 64;

      for (let y = 0; y < app.screen.height; y++) {
        for (let x = 0; x < app.screen.width; x++) {
          if (Math.random() < 0.7) { // Goal is to print a blank wall more than 70% of the time
            mask.rect(x, y, bgTileSize, bgTileSize);
          }
        }
      }

      mask.fill(0xffffff);
      variationLayer.mask = mask;

      // level generation
      const levelWidth = Math.ceil(app.screen.width / TILE_SIZE);
      const levelHeight = Math.ceil(app.screen.height / TILE_SIZE);
      const levelGenerator = new LevelGenerator(levelWidth, levelHeight);
      const levelGrid = levelGenerator.generateCave();

      // Create container for level tiles
      const levelContainer = new Container();
      app.stage.addChild(levelContainer);

      // Draw the level using tiles
      const dirtTextures = []; // add later
      const surfaceTextures = [loadedTextures.ground2, loadedTextures.ground1]; 
      const brickTextures = [loadedTextures.brick, loadedTextures.brickWall];

      function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      for (let y = 0; y < levelHeight; y++) {
        for (let x = 0; x < levelWidth; x++) {
          if (levelGrid[y][x] === 1) {
            let texture;
            let depth = 0;

            if (y > 0 && levelGrid[y - 1][x] === 0) {
              if ((x > 0 && levelGrid[y - 1][x - 1] === 0) || (x < levelWidth - 1 && levelGrid[y - 1][x + 1] === 0 )) {
                texture = loadedTextures.ground2;
              } else {
                texture = randomChoice(surfaceTextures);
              }
            } 

            else {
              for (let dy = y - 1; dy >= 0; dy--) {
                if (levelGrid[dy][x] === 1) depth++;
                else break;
              }

              if (depth < 3) {
                texture = loadedTextures.ground2;
              } else {
                texture = loadedTextures.blankWall;
              }
            }

            const tile = new Sprite(texture);
            tile.width = TILE_SIZE;
            tile.height = TILE_SIZE;
            tile.position.set(x * TILE_SIZE, y * TILE_SIZE);

            // add tint based on depth
            let tintAmount = Math.min(depth * 0x111111, 0x666666); 
            tile.tint = 0xFFFFFF - tintAmount;
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
      app.ticker.maxFPS = 240;
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