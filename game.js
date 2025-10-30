// Snake Game - JavaScript Logic
// Game Configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const levelEl = document.getElementById('level');
const difficultySelect = document.getElementById('difficulty');

// Grid Configuration
const GRID_SIZE = 20;
const TILE_SIZE = canvas.width / GRID_SIZE;

// Game State
let snake = [];
let food = {};
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let level = 1;
let gameRunning = false;
let gamePaused = false;
let gameSpeed = 100;
let gameLoop = null;

// Difficulty Settings
const DIFFICULTY_SETTINGS = {
    easy: { speed: 150, speedIncrease: 5, pointsPerLevel: 50 },
    medium: { speed: 100, speedIncrease: 8, pointsPerLevel: 30 },
    hard: { speed: 70, speedIncrease: 10, pointsPerLevel: 20 },
    extreme: { speed: 50, speedIncrease: 12, pointsPerLevel: 15 }
};

// Colors
const COLORS = {
    background: '#1a1a2e',
    grid: '#16213e',
    snake: {
        head: '#38ef7d',
        body: '#11998e',
        gradient: true
    },
    food: '#ff6b6b',
    foodGlow: '#ff9999'
};

// Initialize Game
function init() {
    highScoreEl.textContent = highScore;
    updateScore(0);
    updateLevel(1);
    drawGrid();
}

// Start Game
function startGame() {
    // Reset game state
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    level = 1;
    
    // Get difficulty settings
    const difficulty = difficultySelect.value;
    const settings = DIFFICULTY_SETTINGS[difficulty];
    gameSpeed = settings.speed;
    
    updateScore(0);
    updateLevel(1);
    generateFood();
    
    gameRunning = true;
    gamePaused = false;
    overlay.classList.add('hidden');
    pauseButton.disabled = false;
    difficultySelect.disabled = true;
    
    // Start game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

// Update Game State
function update() {
    if (!gameRunning || gamePaused) return;
    
    // Update direction
    direction = { ...nextDirection };
    
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        eatFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw game
    draw();
}

// Draw Game
function draw() {
    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw food with glow effect
    drawFood();
    
    // Draw snake
    drawSnake();
}

// Draw Grid
function drawGrid() {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
    }
}

// Draw Snake
function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * TILE_SIZE;
        const y = segment.y * TILE_SIZE;
        
        if (index === 0) {
            // Draw head with special style
            const gradient = ctx.createRadialGradient(
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2,
                x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE
            );
            gradient.addColorStop(0, COLORS.snake.head);
            gradient.addColorStop(1, COLORS.snake.body);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            
            // Draw eyes
            ctx.fillStyle = '#1a1a2e';
            const eyeSize = 3;
            const eyeOffset = 6;
            
            if (direction.x === 1) { // Right
                ctx.fillRect(x + TILE_SIZE - eyeOffset, y + 5, eyeSize, eyeSize);
                ctx.fillRect(x + TILE_SIZE - eyeOffset, y + TILE_SIZE - 8, eyeSize, eyeSize);
            } else if (direction.x === -1) { // Left
                ctx.fillRect(x + eyeOffset - eyeSize, y + 5, eyeSize, eyeSize);
                ctx.fillRect(x + eyeOffset - eyeSize, y + TILE_SIZE - 8, eyeSize, eyeSize);
            } else if (direction.y === 1) { // Down
                ctx.fillRect(x + 5, y + TILE_SIZE - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(x + TILE_SIZE - 8, y + TILE_SIZE - eyeOffset, eyeSize, eyeSize);
            } else if (direction.y === -1) { // Up
                ctx.fillRect(x + 5, y + eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(x + TILE_SIZE - 8, y + eyeOffset - eyeSize, eyeSize, eyeSize);
            }
        } else {
            // Draw body with gradient
            const alpha = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = COLORS.snake.body + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        }
    });
}

// Draw Food
function drawFood() {
    const x = food.x * TILE_SIZE;
    const y = food.y * TILE_SIZE;
    
    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.foodGlow;
    
    // Food circle
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner circle
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + TILE_SIZE / 2 - 2, y + TILE_SIZE / 2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

// Generate Food
function generateFood() {
    let newFood;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        attempts++;
    } while (
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
        attempts < maxAttempts
    );
    
    food = newFood;
}

// Eat Food
function eatFood() {
    const difficulty = difficultySelect.value;
    const settings = DIFFICULTY_SETTINGS[difficulty];
    
    // Increase score
    const points = 10 * level;
    updateScore(score + points);
    
    // Check for level up
    if (score >= level * settings.pointsPerLevel) {
        levelUp();
    }
    
    // Generate new food
    generateFood();
    
    // Play sound effect (visual feedback)
    canvas.classList.add('game-over-animation');
    setTimeout(() => canvas.classList.remove('game-over-animation'), 100);
}

// Level Up
function levelUp() {
    const difficulty = difficultySelect.value;
    const settings = DIFFICULTY_SETTINGS[difficulty];
    
    level++;
    updateLevel(level);
    
    // Increase speed
    gameSpeed = Math.max(30, gameSpeed - settings.speedIncrease);
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

// Update Score
function updateScore(newScore) {
    score = newScore;
    currentScoreEl.textContent = score;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

// Update Level
function updateLevel(newLevel) {
    level = newLevel;
    levelEl.textContent = level;
}

// Game Over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Show game over overlay
    overlayTitle.textContent = '💀 GAME OVER';
    overlayMessage.textContent = `Puntuación Final: ${score}`;
    
    if (score >= highScore) {
        overlayMessage.textContent += ' 🏆 ¡Nuevo Récord!';
    }
    
    overlay.classList.remove('hidden');
    pauseButton.disabled = true;
    difficultySelect.disabled = false;
    
    // Animation effect
    canvas.classList.add('game-over-animation');
    setTimeout(() => canvas.classList.remove('game-over-animation'), 1500);
}

// Pause Game
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        pauseButton.innerHTML = '<span class="btn-icon">▶</span> REANUDAR';
        overlayTitle.textContent = '⏸ PAUSA';
        overlayMessage.textContent = 'Presiona ESPACIO o el botón para continuar';
        overlay.classList.remove('hidden');
    } else {
        pauseButton.innerHTML = '<span class="btn-icon">⏸</span> PAUSAR';
        overlay.classList.add('hidden');
    }
}

// Reset Game
function resetGame() {
    if (gameLoop) clearInterval(gameLoop);
    gameRunning = false;
    gamePaused = false;
    
    overlayTitle.textContent = 'Snake Game';
    overlayMessage.textContent = 'Presiona START para comenzar';
    startButton.innerHTML = '<span class="btn-icon">▶</span> INICIAR JUEGO';
    overlay.classList.remove('hidden');
    pauseButton.disabled = true;
    pauseButton.innerHTML = '<span class="btn-icon">⏸</span> PAUSAR';
    difficultySelect.disabled = false;
    
    // Reset visuals
    updateScore(0);
    updateLevel(1);
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

// Handle Keyboard Input
function handleKeyPress(e) {
    // Prevent default arrow key behavior
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    
    // Pause/Resume or Start Game
    if (e.code === 'Space') {
        if (!gameRunning) {
            // Si el juego no está corriendo, iniciarlo
            startGame();
        } else if (gameRunning) {
            // Si ya está corriendo, pausar/reanudar
            togglePause();
        }
        return;
    }
    
    if (!gameRunning || gamePaused) return;
    
    // Direction changes
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
    }
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (gamePaused) {
        togglePause();
    } else {
        startGame();
    }
});

pauseButton.addEventListener('click', togglePause);
resetButton.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeyPress);

// Initialize game on load
init();
