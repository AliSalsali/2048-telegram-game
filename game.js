// 2048 Game Logic - Bug-Fixed Version

class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.hasWon = false;
        this.gameOver = false;
        this.gridSize = 4;
        this.tiles = new Map(); // Track tiles by unique ID
        this.tileIdCounter = 0;
        this.animating = false;

        this.init();
    }

    init() {
        // Initialize empty grid
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(null));
        this.score = 0;
        this.hasWon = false;
        this.gameOver = false;
        this.tiles.clear();
        this.tileIdCounter = 0;

        // Clear DOM
        const gridTiles = document.getElementById('grid-tiles');
        if (gridTiles) {
            gridTiles.innerHTML = '';
        }

        // Spawn initial tiles
        this.spawnTile();
        this.spawnTile();

        // FIX 1: Render the initial tiles immediately
        this.renderGrid();
        this.updateDisplay();
    }

    // Create a unique tile object
    createTile(row, col, value) {
        const id = `tile-${this.tileIdCounter++}`;
        const tile = {
            id,
            value,
            row,
            col,
            isNew: true,
            isMerged: false,
            element: null
        };

        this.tiles.set(id, tile);
        this.grid[row][col] = tile;
        return tile;
    }

    // Spawn a new tile (2 or 4) in a random empty cell
    spawnTile() {
        const emptyCells = [];

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) return false;

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;

        this.createTile(randomCell.row, randomCell.col, value);
        return true;
    }

    // Move tiles in specified direction
    async move(direction) {
        if (this.gameOver || this.animating) return false;

        this.animating = true;

        // Clear merge/new flags from ALL tiles before move
        this.tiles.forEach(tile => {
            tile.isNew = false;
            tile.isMerged = false;
        });

        // Save old grid state for comparison
        const oldGrid = this.gridToValues();

        // Perform the move
        let moved = false;
        switch (direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }

        // Check if anything actually moved
        const newGrid = this.gridToValues();
        const gridChanged = JSON.stringify(oldGrid) !== JSON.stringify(newGrid);

        if (gridChanged && moved) {
            // Render with movement
            this.renderGrid();

            // Wait for slide animation
            await this.sleep(150);

            // Clean up merged tiles
            this.cleanupMergedTiles();

            // FIX 2: Spawn ONLY ONE new tile after cleanup
            this.spawnTile();

            // Render the new tile
            this.renderGrid();

            this.updateDisplay();

            // Wait for spawn animation
            await this.sleep(200);

            // Check win condition
            if (!this.hasWon && this.checkWin()) {
                this.hasWon = true;
                this.showVictory();
            }

            // Check game over
            if (this.checkGameOver()) {
                this.gameOver = true;
                setTimeout(() => this.showGameOver(), 300);
            }
        }

        this.animating = false;
        return gridChanged && moved;
    }

    // Helper to get grid values for comparison
    gridToValues() {
        return this.grid.map(row =>
            row.map(tile => tile ? tile.value : 0)
        );
    }

    // Helper to sleep for animations
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Clean up tiles that were merged
    cleanupMergedTiles() {
        const tilesToRemove = [];

        this.tiles.forEach((tile, id) => {
            // Remove tiles that were merged but are no longer in the grid
            if (tile.isMerged && this.grid[tile.row] && this.grid[tile.row][tile.col] !== tile) {
                tilesToRemove.push(id);
            }
        });

        tilesToRemove.forEach(id => {
            const tile = this.tiles.get(id);
            if (tile.element && tile.element.parentNode) {
                tile.element.parentNode.removeChild(tile.element);
            }
            this.tiles.delete(id);
        });
    }

    // Movement logic - LEFT
    moveLeft() {
        let moved = false;

        for (let row = 0; row < this.gridSize; row++) {
            const tiles = this.grid[row].filter(tile => tile !== null);
            const newRow = Array(this.gridSize).fill(null);
            let targetCol = 0;
            let i = 0;

            while (i < tiles.length) {
                const currentTile = tiles[i];

                // Check if we can merge with next tile
                if (i < tiles.length - 1 &&
                    currentTile.value === tiles[i + 1].value &&
                    !currentTile.isMerged &&
                    !tiles[i + 1].isMerged) {

                    // Merge: keep current tile, double its value
                    currentTile.value *= 2;
                    currentTile.isMerged = true;
                    this.score += currentTile.value;

                    // Mark second tile for removal
                    tiles[i + 1].isMerged = true;

                    // Place merged tile
                    currentTile.row = row;
                    currentTile.col = targetCol;
                    newRow[targetCol] = currentTile;

                    targetCol++;
                    i += 2; // Skip both tiles
                    moved = true;
                } else {
                    // Just move tile
                    if (currentTile.row !== row || currentTile.col !== targetCol) {
                        moved = true;
                    }
                    currentTile.row = row;
                    currentTile.col = targetCol;
                    newRow[targetCol] = currentTile;
                    targetCol++;
                    i++;
                }
            }

            this.grid[row] = newRow;
        }

        return moved;
    }

    // Movement logic - RIGHT
    moveRight() {
        let moved = false;

        for (let row = 0; row < this.gridSize; row++) {
            const tiles = this.grid[row].filter(tile => tile !== null).reverse();
            const newRow = Array(this.gridSize).fill(null);
            let targetCol = this.gridSize - 1;
            let i = 0;

            while (i < tiles.length) {
                const currentTile = tiles[i];

                if (i < tiles.length - 1 &&
                    currentTile.value === tiles[i + 1].value &&
                    !currentTile.isMerged &&
                    !tiles[i + 1].isMerged) {

                    currentTile.value *= 2;
                    currentTile.isMerged = true;
                    this.score += currentTile.value;
                    tiles[i + 1].isMerged = true;

                    currentTile.row = row;
                    currentTile.col = targetCol;
                    newRow[targetCol] = currentTile;

                    targetCol--;
                    i += 2;
                    moved = true;
                } else {
                    if (currentTile.row !== row || currentTile.col !== targetCol) {
                        moved = true;
                    }
                    currentTile.row = row;
                    currentTile.col = targetCol;
                    newRow[targetCol] = currentTile;
                    targetCol--;
                    i++;
                }
            }

            this.grid[row] = newRow;
        }

        return moved;
    }

    // Movement logic - UP
    moveUp() {
        let moved = false;

        for (let col = 0; col < this.gridSize; col++) {
            const tiles = [];
            for (let row = 0; row < this.gridSize; row++) {
                if (this.grid[row][col] !== null) {
                    tiles.push(this.grid[row][col]);
                }
            }

            let targetRow = 0;
            let i = 0;

            while (i < tiles.length) {
                const currentTile = tiles[i];

                if (i < tiles.length - 1 &&
                    currentTile.value === tiles[i + 1].value &&
                    !currentTile.isMerged &&
                    !tiles[i + 1].isMerged) {

                    currentTile.value *= 2;
                    currentTile.isMerged = true;
                    this.score += currentTile.value;
                    tiles[i + 1].isMerged = true;

                    currentTile.row = targetRow;
                    currentTile.col = col;
                    this.grid[targetRow][col] = currentTile;

                    targetRow++;
                    i += 2;
                    moved = true;
                } else {
                    if (currentTile.row !== targetRow || currentTile.col !== col) {
                        moved = true;
                    }
                    currentTile.row = targetRow;
                    currentTile.col = col;
                    this.grid[targetRow][col] = currentTile;
                    targetRow++;
                    i++;
                }
            }

            // Clear empty spaces
            for (let row = targetRow; row < this.gridSize; row++) {
                this.grid[row][col] = null;
            }
        }

        return moved;
    }

    // Movement logic - DOWN
    moveDown() {
        let moved = false;

        for (let col = 0; col < this.gridSize; col++) {
            const tiles = [];
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.grid[row][col] !== null) {
                    tiles.push(this.grid[row][col]);
                }
            }

            let targetRow = this.gridSize - 1;
            let i = 0;

            while (i < tiles.length) {
                const currentTile = tiles[i];

                if (i < tiles.length - 1 &&
                    currentTile.value === tiles[i + 1].value &&
                    !currentTile.isMerged &&
                    !tiles[i + 1].isMerged) {

                    currentTile.value *= 2;
                    currentTile.isMerged = true;
                    this.score += currentTile.value;
                    tiles[i + 1].isMerged = true;

                    currentTile.row = targetRow;
                    currentTile.col = col;
                    this.grid[targetRow][col] = currentTile;

                    targetRow--;
                    i += 2;
                    moved = true;
                } else {
                    if (currentTile.row !== targetRow || currentTile.col !== col) {
                        moved = true;
                    }
                    currentTile.row = targetRow;
                    currentTile.col = col;
                    this.grid[targetRow][col] = currentTile;
                    targetRow--;
                    i++;
                }
            }

            // Clear empty spaces
            for (let row = targetRow; row >= 0; row--) {
                this.grid[row][col] = null;
            }
        }

        return moved;
    }

    // Check if player has won (reached 2048)
    checkWin() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const tile = this.grid[row][col];
                if (tile && tile.value === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if game is over (no valid moves)
    checkGameOver() {
        // Check for empty cells
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === null) {
                    return false;
                }
            }
        }

        // Check for possible merges horizontally
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 1; col++) {
                const tile1 = this.grid[row][col];
                const tile2 = this.grid[row][col + 1];
                if (tile1 && tile2 && tile1.value === tile2.value) {
                    return false;
                }
            }
        }

        // Check for possible merges vertically
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 1; row++) {
                const tile1 = this.grid[row][col];
                const tile2 = this.grid[row + 1][col];
                if (tile1 && tile2 && tile1.value === tile2.value) {
                    return false;
                }
            }
        }

        return true;
    }

    // Update display (scores and tiles)
    updateDisplay() {
        // Update scores
        document.getElementById('score').textContent = this.score;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
        document.getElementById('best-score').textContent = this.bestScore;
    }

    // Render the grid tiles with smooth animations
    renderGrid() {
        const gridTiles = document.getElementById('grid-tiles');
        if (!gridTiles) return;

        const cellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size')) || 70;
        const cellGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-gap')) || 12;

        // Update existing tiles and create new ones
        this.tiles.forEach((tile, id) => {
            // Calculate position FIRST
            const top = tile.row * (cellSize + cellGap);
            const left = tile.col * (cellSize + cellGap);

            if (!tile.element) {
                // PROPER FIX: Create element with COMBINED transform (position + initial scale)
                const element = document.createElement('div');
                element.className = 'tile';
                element.setAttribute('data-value', tile.value);
                element.textContent = tile.value;
                element.id = id;

                // Critical: Set COMBINED transform with position AND initial animation state
                // This prevents the tile from EVER appearing at (0,0)
                if (tile.isNew) {
                    // Start invisible and scaled down AT THE CORRECT POSITION
                    element.style.transform = `translate(${left}px, ${top}px) scale(0) rotate(-5deg)`;
                    element.style.opacity = '0';
                } else if (tile.isMerged) {
                    // Start at normal state for merge animation
                    element.style.transform = `translate(${left}px, ${top}px)`;
                } else {
                    // Normal positioning for existing tiles
                    element.style.transform = `translate(${left}px, ${top}px)`;
                }

                // Append to DOM - tile is now at correct position (not 0,0)
                gridTiles.appendChild(element);
                tile.element = element;

                // Force reflow to ensure initial state is applied
                void element.offsetHeight;

                // Now animate to final state
                if (tile.isNew) {
                    // Animate from scale(0) to scale(1) AT THE CORRECT POSITION
                    requestAnimationFrame(() => {
                        element.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease-out';
                        element.style.transform = `translate(${left}px, ${top}px) scale(1) rotate(0deg)`;
                        element.style.opacity = '1';
                    });
                }
            } else {
                // Update existing tile position
                tile.element.setAttribute('data-value', tile.value);
                tile.element.textContent = tile.value;

                // Update position (smooth slide for moved tiles)
                tile.element.style.transform = `translate(${left}px, ${top}px)`;

                // Merge animation for existing tiles
                if (tile.isMerged) {
                    // Pulse animation
                    tile.element.style.transition = 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)';
                    tile.element.style.transform = `translate(${left}px, ${top}px) scale(1.15)`;

                    setTimeout(() => {
                        if (tile.element) {
                            tile.element.style.transform = `translate(${left}px, ${top}px) scale(1)`;
                        }
                    }, 125);
                }
            }
        });
    }

    // Show game over modal
    showGameOver() {
        const modal = document.getElementById('game-over-modal');
        const finalScore = document.getElementById('final-score');
        const modalBestScore = document.getElementById('modal-best-score');

        finalScore.textContent = this.score;
        modalBestScore.textContent = this.bestScore;

        modal.classList.add('show');
    }

    // Show victory modal
    showVictory() {
        const modal = document.getElementById('victory-modal');
        const victoryScore = document.getElementById('victory-score');

        victoryScore.textContent = this.score;

        modal.classList.add('show');
    }

    // Hide modals
    hideModals() {
        document.getElementById('game-over-modal').classList.remove('show');
        document.getElementById('victory-modal').classList.remove('show');
    }

    // Reset game
    reset() {
        this.hideModals();
        this.init();
    }

    // Continue playing after winning
    continueGame() {
        document.getElementById('victory-modal').classList.remove('show');
    }

    // localStorage methods
    loadBestScore() {
        const saved = localStorage.getItem('2048-best-score');
        return saved ? parseInt(saved, 10) : 0;
    }

    saveBestScore() {
        localStorage.setItem('2048-best-score', this.bestScore.toString());
    }
}

// Initialize game
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game2048();

    // New game button
    document.getElementById('new-game-btn').addEventListener('click', () => {
        game.reset();
    });

    // Try again button
    document.getElementById('try-again-btn').addEventListener('click', () => {
        game.reset();
    });

    // Keep playing button
    document.getElementById('keep-playing-btn').addEventListener('click', () => {
        game.continueGame();
    });

    // Share score button (use Telegram if available)
    document.getElementById('share-score-btn').addEventListener('click', () => {
        shareScore(game.score);
    });

    // Share achievement button
    document.getElementById('share-achievement-btn').addEventListener('click', () => {
        shareAchievement(game.score);
    });

    // Keyboard controls (for desktop testing)
    document.addEventListener('keydown', (e) => {
        if (game.gameOver || game.animating) return;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                game.move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                game.move('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                game.move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                game.move('right');
                break;
        }
    });
});

// Share functions (will use Telegram if available)
function shareScore(score) {
    const message = `I scored ${score} points in 2048! Can you beat my score? 🎮`;

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`);
    } else {
        if (navigator.share) {
            navigator.share({
                title: '2048 Game',
                text: message,
                url: window.location.href
            });
        } else {
            alert(message);
        }
    }
}

function shareAchievement(score) {
    const message = `I reached 2048! 🏆 Final score: ${score} points! 🎉`;

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`);
    } else {
        if (navigator.share) {
            navigator.share({
                title: '2048 Victory!',
                text: message,
                url: window.location.href
            });
        } else {
            alert(message);
        }
    }
}
