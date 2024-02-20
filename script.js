// Definindo elementos HTML
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

const gameOverContainer = document.getElementById('game-over-container');
const newRecordContainer = document.getElementById('new-record-container');

// Definindo variáveis
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'stop';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Desenhando mapa, cobra, comida
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Desenhando a cobra
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Criando elemento do jogo
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Definindo posição da cobra ou comida
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Desenhando a comida do jogo
function drawFood () {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Gerando a comida
function generateFood () {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// move the snake
function move() {
    const head = {...snake[0] };
    switch (direction) {
        case 'up':
        head.y--;
        break;
        case 'down':
        head.y++;
        break;
        case 'right':
        head.x++;
        break;
        case 'left':
        head.x--;
        break;
    }
    snake.unshift (head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
           move();
           checkCollision();
           draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// Start Game
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    board.innerHTML = '';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft': 
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];
    const currentScore = snake.length - 1;
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        if (currentScore > highScore) {
            newRecord();
        }
        gameOver();
        return;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    const gameOverMessage = document.querySelector('.game-over-message');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
    const newRecordMessage = document.querySelector('.new-record-message');
    if (newRecordMessage) {
        newRecordMessage.remove();
    }
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        highScoreText.style.display = 'block';
    }
}

document.addEventListener('keydown', handleKeyPress);

//Adicionais
function gameOver() {
    clearInterval(gameInterval);
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'Game Over! Pontuação: ' + (snake.length - 1);
    gameOverMessage.classList.add('game-over-message');
    gameOverContainer.appendChild(gameOverMessage);

    if (snake.length - 1 > highScore) {
        setTimeout(() => {
            newRecord();
        }, 2000);
    } else {
        setTimeout(() => {
            resetGame(); 
            gameOverMessage.remove();
        }, 2000);
    }
}

function newRecord() {
    clearInterval(gameInterval);
    const newRecordMessage = document.createElement('div');
    newRecordMessage.textContent = 'New-record! Pontuação: ' + (snake.length - 1);
    newRecordMessage.classList.add('new-record-message');
    gameOverContainer.appendChild(newRecordMessage);

    setTimeout(() => {
        newRecordMessage.remove();
        resetGame(); 
    }, 2000);
}
