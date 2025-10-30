class LevelGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        // Initialize grid immediately in constructor
        this.initializeGrid();
    }

    initializeGrid() {
        // Create a 2D array filled with 1s (solid blocks)
        this.grid = Array(this.height).fill().map(() => 
            Array(this.width).fill(1)
        );
    }

    walker(startX, startY, steps) {
        let x = startX;
        let y = startY;

        for (let i = 0; i < steps; i++) {
            // Carve current position
            this.grid[y][x] = 0;

            // carve a small area around the walker
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let newX = x + dx;
                    let newY = y + dy;
                    if (this.isInBounds(newX, newY)) {
                        this.grid[newY][newX] = 0;
                    }
                }
            }

            // Choose random direction
            const direction = Math.floor(Math.random() * 4);
            switch (direction) {
                case 0: y = Math.max(1, y - 1); break; // Up
                case 1: y = Math.min(this.height - 2, y + 1); break; // Down
                case 2: x = Math.max(1, x - 1); break; // Left
                case 3: x = Math.min(this.width - 2, x + 1); break; // Right
            }
        }
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.width && 
               y >= 0 && y < this.height;
    }

    smoothMap() {
        const tempGrid = JSON.parse(JSON.stringify(this.grid));
        
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                const solidNeighbors = this.countSolidNeighbors(x, y);
                if (solidNeighbors >= 5) tempGrid[y][x] = 1;
                else if (solidNeighbors <= 3) tempGrid[y][x] = 0;
            }
        }
        
        this.grid = tempGrid;
    }

    countSolidNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                if (this.grid[y + dy][x + dx] === 1) count++;
            }
        }
        return count;
    }

    addPlatforms() {
        const platformSpacing = 6;
        
        for (let y = this.height - 2; y >= 2; y -= platformSpacing) {
            const platformLength = Math.floor(Math.random() * 5) + 3;
            const startX = Math.floor(Math.random() * (this.width - platformLength));
            
            for (let x = startX; x < startX + platformLength; x++) {
                if (x < this.width) {
                    this.grid[y][x] = 1;
                }
            }
        }
    }

    generateCave() {
        // Grid is already initialized in constructor
        
        // Create multiple walkers
        const numWalkers = 2;
        const stepsPerWalker = 3000;
        
        for (let i = 0; i < numWalkers; i++) {
            // Start from middle
            const startX = Math.floor(this.width / 2);
            const startY = Math.floor(this.height / 2);
            this.walker(startX, startY, stepsPerWalker);
        }
        
        // Smooth the cave
        this.smoothMap();
        
        // Add platforms
        this.addPlatforms();
        
        return this.grid;
    }
}

export default LevelGenerator;