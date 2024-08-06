const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;

let snake = [{ x: 100, y: 100 }];
let direction = { x: gridSize, y: 0 };
let food = { x: getRandomPosition(), y: getRandomPosition() };
let gameOver = false;

function getRandomPosition() {
    return Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));
}

function drawFood() {
    drawRect(food.x, food.y, 'red');
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = { x: getRandomPosition(), y: getRandomPosition() };
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function update() {
    if (gameOver) {
        alert("Game Over");
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollision();

    setTimeout(update, 100);
}

document.addEventListener("keydown", event => {
    const keyMap = {
        ArrowUp: { x: 0, y: -gridSize },
        ArrowDown: { x: 0, y: gridSize },
        ArrowLeft: { x: -gridSize, y: 0 },
        ArrowRight: { x: gridSize, y: 0 },
    };

    const newDirection = keyMap[event.key];
    if (newDirection) {
        // Prevent snake from reversing
        if (newDirection.x !== -direction.x && newDirection.y !== -direction.y) {
            direction = newDirection;
        }
    }
});

update();
