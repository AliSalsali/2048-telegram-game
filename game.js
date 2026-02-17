// 2048 Game Logic

class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.hasWon = false;
        this.gameOver = false;
        this.gridSize = 4;

        this.init();
    }

    init() {
        // Initialize empty grid
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.hasWon = false;
        this.gameOver = false;

        // Spawn initial tiles
        this.spawnTile();
        this.spawnTile();

        this.updateDisplay();
    }

    // Spawn a new tile (2 or 4) in a random empty cell
    spawnTile() {
        const emptyCells = [];

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) return false;

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;

        this.grid[randomCell.row][randomCell.col] = value;
        return true;
    }

    // Move tiles in specified direction
    move(direction) {
        if (this.gameOver) return false;

        let moved = false;
        const oldGrid = JSON.stringify(this.grid);

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

        const newGrid = JSON.stringify(this.grid);
        moved = oldGrid !== newGrid;

        if (moved) {
            this.spawnTile();
            this.updateDisplay();

            // Check win condition
            if (!this.hasWon && this.checkWin()) {
                this.hasWon = true;
                setTimeout(() => this.showVictory(), 300);
            }

            // Check game over
            if (this.checkGameOver()) {
                this.gameOver = true;
                setTimeout(() => this.showGameOver(), 300);
            }
        }

        return moved;
    }

    // Movement logic for each direction
    moveLeft() {
        let moved = false;

        for (let row = 0; row < this.gridSize; row++) {
            const newRow = this.mergeLine(this.grid[row]);
            if (JSON.stringify(newRow) !== JSON.stringify(this.grid[row])) {
                moved = true;
            }
            this.grid[row] = newRow;
        }

        return moved;
    }

    moveRight() {
        let moved = false;

        for (let row = 0; row < this.gridSize; row++) {
            const reversed = this.grid[row].slice().reverse();
            const newRow = this.mergeLine(reversed).reverse();
            if (JSON.stringify(newRow) !== JSON.stringify(this.grid[row])) {
                moved = true;
            }
            this.grid[row] = newRow;
        }

        return moved;
    }

    moveUp() {
        let moved = false;

        for (let col = 0; col < this.gridSize; col++) {
            const column = this.grid.map(row => row[col]);
            const newColumn = this.mergeLine(column);
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
            }
            for (let row = 0; row < this.gridSize; row++) {
                this.grid[row][col] = newColumn[row];
            }
        }

        return moved;
    }

    moveDown() {
        let moved = false;

        for (let col = 0; col < this.gridSize; col++) {
            const column = this.grid.map(row => row[col]);
            const reversed = column.slice().reverse();
            const newColumn = this.mergeLine(reversed).reverse();
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
            }
            for (let row = 0; row < this.gridSize; row++) {
                this.grid[row][col] = newColumn[row];
            }
        }

        return moved;
    }

    // Merge a single line (row or column)
    mergeLine(line) {
        // Remove zeros
        let newLine = line.filter(cell => cell !== 0);

        // Merge adjacent equal tiles
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                this.score += newLine[i];
                newLine.splice(i + 1, 1);
            }
        }

        // Fill with zeros
        while (newLine.length < this.gridSize) {
            newLine.push(0);
        }

        return newLine;
    }

    // Check if player has won (reached 2048)
    checkWin() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === 2048) {
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
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }

        // Check for possible merges horizontally
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 1; col++) {
                if (this.grid[row][col] === this.grid[row][col + 1]) {
                    return false;
                }
            }
        }

        // Check for possible merges vertically
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 1; row++) {
                if (this.grid[row][col] === this.grid[row + 1][col]) {
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

        // Update grid tiles
        this.renderGrid();
    }

    // Render the grid tiles
    renderGrid() {
        const gridTiles = document.getElementById('grid-tiles');
        gridTiles.innerHTML = '';

        const cellSize = 70;
        const cellGap = 12;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const value = this.grid[row][col];

                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.setAttribute('data-value', value);
                    tile.textContent = value;

                    const top = row * (cellSize + cellGap);
                    const left = col * (cellSize + cellGap);

                    tile.style.top = `${top}px`;
                    tile.style.left = `${left}px`;

                    gridTiles.appendChild(tile);
                }
            }
        }
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
        if (game.gameOver) return;

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
        // Use Telegram share if available
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`);
    } else {
        // Fallback to Web Share API
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
