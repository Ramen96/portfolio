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

      // Tiles
      const dirtTextures = []; // add later
      const surfaceTextures = [loadedTextures.ground2, loadedTextures.ground1]; 
      const brickTextures = [loadedTextures.brick, loadedTextures.brickWall];

      // Create tiling background sprite
      const bgTileSize = 64;
      const cols = Math.ceil(app.screen.width / bgTileSize);
      const rows = Math.ceil(app.screen.height / bgTileSize);

      // Probabilities / tuning
      const BASE_BRICK_PROB = 0.10;      // 10% base chance for a brick
      const INC_PER_NEIGHBOR = 0.18;     // increase per brick neighbor (15-20% range -> 0.18)
      const MAX_BRICK_PROB = 0.90;       // cap at 90% when surrounded

      // First pass: random placement using base probability
      const bgGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bgGrid[r][c] = Math.random() < BASE_BRICK_PROB;
        }
      }

      // Second pass: grow clusters by re-evaluating tiles based on neighbors
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (bgGrid[r][c]) continue; // already a brick
          let neighbors = 0;
          if (r > 0 && bgGrid[r - 1][c]) neighbors++;        // north
          if (r < rows - 1 && bgGrid[r + 1][c]) neighbors++;  // south
          if (c > 0 && bgGrid[r][c - 1]) neighbors++;        // west
          if (c < cols - 1 && bgGrid[r][c + 1]) neighbors++;  // east

          const prob = Math.min(BASE_BRICK_PROB + neighbors * INC_PER_NEIGHBOR, MAX_BRICK_PROB);
          if (Math.random() < prob) bgGrid[r][c] = true;
        }
      }

      // Draw base blank-wall layer (tiled) and then place brick sprites where bgGrid is true.
      const baseLayer = new TilingSprite({
        texture: loadedTextures.blankWall,
        width: app.screen.width,
        height: app.screen.height
      });
      app.stage.addChild(baseLayer);

      const brickBgContainer = new Container();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!bgGrid[r][c]) continue;
          const s = new Sprite(randomChoice(brickTextures));
          s.width = bgTileSize;
          s.height = bgTileSize;
          s.position.set(c * bgTileSize, r * bgTileSize);
          brickBgContainer.addChild(s);
        }
      }
      app.stage.addChild(brickBgContainer);

      // level generation
      const levelWidth = Math.ceil(app.screen.width / TILE_SIZE);
      const levelHeight = Math.ceil(app.screen.height / TILE_SIZE);
      const levelGenerator = new LevelGenerator(levelWidth, levelHeight);
      const levelGrid = levelGenerator.generateCave();

      // Create container for level tiles
      const levelContainer = new Container();
      app.stage.addChild(levelContainer);

      function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      const MAX_DARKEN = 0.6; 
      const DARKEN_PER_LAYER = 0.08; 

      for (let x = 0; x < levelWidth; x++) {
        let depthCounter = 0;
        for (let y = 0; y < levelHeight; y++) {
          if (levelGrid[y][x] === 1) {
            // determine if this is a surface tile (tile above is empty)
            const isSurface = (y > 0 && levelGrid[y - 1][x] === 0);
            if (isSurface) {
              depthCounter = 1;
            } else {
              depthCounter = depthCounter > 0 ? depthCounter + 1 : 1;
            }

            // choose texture
            let texture;
            if (
              (y > 0 && levelGrid[y - 1][x] === 0) ||
              ((x > 0 && levelGrid[y][x - 1] === 0) || (x < levelWidth - 1 && levelGrid[y][x + 1] === 0))
            ) {
              if ((y > 0 && x > 0 && levelGrid[y - 1][x - 1] === 0) || (y > 0 && x < levelWidth - 1 && levelGrid[y - 1][x + 1] === 0)) {
                texture = loadedTextures.ground2;
              } else {
                texture = randomChoice(surfaceTextures);
              }
            } else {
              texture = loadedTextures.blankWall;
            }

            const tile = new Sprite(texture);
            tile.width = TILE_SIZE;
            tile.height = TILE_SIZE;
            tile.position.set(x * TILE_SIZE, y * TILE_SIZE);

            // apply tint for tiles below the surface
            const depthBelow = Math.max(0, depthCounter - 1);
            if (depthBelow > 0) {
              const darken = Math.min(depthBelow * DARKEN_PER_LAYER, MAX_DARKEN);
              const factor = 1 - darken; // brightness multiplier
              const c = Math.round(255 * factor);
              tile.tint = (c << 16) | (c << 8) | c;
            } else {
              tile.tint = 0xFFFFFF; // surface tile: no tint
            }

            levelContainer.addChild(tile);
          } else {
            depthCounter = 0; // reset when encountering empty space
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