const canvas = document.getElementById('gameCanvas');
canvas.width = 1362; // ancho
canvas.height = 720; // altura


const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const notification = document.getElementById('notification'); // Notificación de nivel



let score = 0;
let level = 1;
const scorePerLevel = 5;
let angle = 0;
let power = 100;
let isPowerIncreasing = true;


const cannon = { x: 50, y: canvas.height - 50, width: 70, height: 50, image: new Image(), isLoaded: false };
cannon.image.src = 'img/cañon.png';

const balls = [];
const basket = { x: canvas.width - 150, y: canvas.height / 2 - 100, width: 160, height: 120, image: new Image() };
basket.image.src = 'https://images.vexels.com/content/149489/preview/basketball-basket-cartoon-9b8a0f.png';

// Precarga de la imagen de madera
const obstacleImage = new Image();
obstacleImage.src = 'img/madera.png';

// Configuración de obstáculos con imagen de textura de madera
const obstacles = [
    // width = ancho,  height = alto,  x = a los lados, y = arriba abajo
    //para que sea horizontal w tiene que ser mayor a h
 // Rotating windmill-like central obstacle
 { x: 400, y: 200, width: 20, height: 150, image: obstacleImage, rotating: true, rotationSpeed: 0.02 },
    
 // Angled wooden planks creating a zigzag path
 { x: 200, y: 100, width: 120, height: 20, image: obstacleImage, angle: Math.PI / 4 },
 { x: 500, y: 300, width: 120, height: 20, image: obstacleImage, angle: -Math.PI / 4 },
 
 // Narrow vertical obstacles creating a narrow passage
 { x: 300, y: 50, width: 30, height: 200, image: obstacleImage },
 { x: 600, y: 250, width: 30, height: 200, image: obstacleImage }
];

// Función para dibujar el cañón
function drawCannon() {
    ctx.save();
    ctx.translate(cannon.x, cannon.y);
    ctx.rotate(angle);
    ctx.drawImage(cannon.image, -cannon.width / 6, -cannon.height / 3.9, cannon.width, cannon.height);
    ctx.restore();
}

// Función para dibujar las pelotas
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.closePath();
    });
}

// Función para dibujar la canasta
function drawBasket() {
    ctx.drawImage(basket.image, basket.x, basket.y, basket.width, basket.height);
}

// Función para dibujar los obstáculos usando las imágenes precargadas
function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.image.complete) {
            ctx.save();
            ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            
            // Handle rotation if specified
            if (obstacle.rotating) {
                obstacle.rotationAngle = (obstacle.rotationAngle || 0) + obstacle.rotationSpeed;
                ctx.rotate(obstacle.rotationAngle);
            } else if (obstacle.angle) {
                ctx.rotate(obstacle.angle);
            }
            
            ctx.drawImage(
                obstacle.image, 
                -obstacle.width / 2, 
                -obstacle.height / 2, 
                obstacle.width, 
                obstacle.height
            );
            
            ctx.restore();
        }
    });
}
// Función para mostrar la barra de fuerza
function drawPowerMeter() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 119, 25);
    ctx.fillStyle = `rgb(${255 - power * 2.55}, ${power * 2.55}, 0)`;
    ctx.fillRect(12, 12, power, 20);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(10, 10, 120, 25);
}

// Función para verificar colisiones entre la pelota y los obstáculos
// Enhanced collision detection for rotated and angled obstacles
function checkCollision(ball, obstacle) {
    // More complex collision detection logic would be needed here
    // This is a simplified version that might need further refinement
    if (!obstacle.rotating && !obstacle.angle) {
        return (
            ball.x + ball.radius > obstacle.x &&
            ball.x - ball.radius < obstacle.x + obstacle.width &&
            ball.y + ball.radius > obstacle.y &&
            ball.y - ball.radius < obstacle.y + obstacle.height
        );
    } 
  // Para obstáculos rotados, usamos una transformación inversa
  const centerX = obstacle.x + obstacle.width / 2;
  const centerY = obstacle.y + obstacle.height / 2;
 // Calcular el ángulo de rotación (para obstáculos rotatorios o con ángulo fijo)
 const rotationAngle = obstacle.rotating 
 ? (obstacle.rotationAngle || 0) 
 : (obstacle.angle || 0);

// Transformar la posición de la pelota al sistema de coordenadas del obstáculo rotado
const dx = ball.x - centerX;
const dy = ball.y - centerY;

// Rotación inversa
const rotatedX = 
 dx * Math.cos(-rotationAngle) - dy * Math.sin(-rotationAngle);
const rotatedY = 
 dx * Math.sin(-rotationAngle) + dy * Math.cos(-rotationAngle);

// Verificar colisión en el sistema de coordenadas no rotado
const withinWidth = 
 Math.abs(rotatedX) < obstacle.width / 2 + ball.radius;
const withinHeight = 
 Math.abs(rotatedY) < obstacle.height / 2 + ball.radius;

// Si hay colisión, aplicar un rebote más suave
if (withinWidth && withinHeight) {
 // Calcular el punto de colisión y ajustar la dirección de rebote
 const collisionAngle = Math.atan2(rotatedY, rotatedX);
 
 // Descomponer la velocidad de la pelota
 const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
 
 // Rebotar con un factor de amortiguación
 ball.dx *= -0.7;
 ball.dy *= -0.7;

 return true;
}

return false;
}

// Modificar la función moveBalls para usar la nueva detección de colisión
function moveBalls() {
balls.forEach((ball, index) => {
 ball.x += ball.dx;
 ball.y += ball.dy;
 ball.dy += 0.2; // Gravedad

 // Colisión con bordes
 if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -0.8;
 if (ball.y + ball.radius > canvas.height) balls.splice(index, 1);

 // Colisión con obstáculos
 let collision = false;
 obstacles.forEach(obstacle => {
     if (checkCollision(ball, obstacle)) {
         collision = true;
     }
 });

 // Colisión con canasta
 if (ball.x > basket.x && ball.x < basket.x + basket.width &&
     ball.y > basket.y && ball.y < basket.y + basket.height) {
     score++;
     scoreDisplay.textContent = `Puntuación: ${score}`;
     balls.splice(index, 1);

     if (score % scorePerLevel === 0) {
         level++;
         setupLevel();
         showNotification(`¡Siguiente nivel! Nivel actual: ${level}`);
     }
 }
});
}// Función para mostrar la notificación de nivel
function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';

    // Oculta la notificación después de 2 segundos
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Función para configurar el nivel
function setupLevel() {
    levelDisplay.textContent = `Nivel: ${level}`;
    //ajustar la dificultad del juego (ej., aumentar velocidad, cambiar obstáculos)
}

// Función para actualizar la barra de poder
function updatePower() {
    if (isPowerIncreasing) power += 1.5;
    else power -= 1.5;

    if (power >= 120 || power <= 0) isPowerIncreasing = !isPowerIncreasing;
}


// Bucle del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCannon();
    drawBalls();
    drawBasket();
    drawObstacles();
    drawPowerMeter();
    moveBalls();
    updatePower();
    requestAnimationFrame(gameLoop);
}

// Ajuste de ángulo del cañón con el ratón
document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    angle = Math.atan2(e.clientY - rect.top - cannon.y, e.clientX - rect.left - cannon.x);
});

// Disparo al hacer clic en el lienzo
canvas.addEventListener('click', () => {
    const speed = power / 3.5;
    balls.push({
        x: cannon.x + Math.cos(angle) * cannon.width,
        y: cannon.y + Math.sin(angle) * cannon.width,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        radius: 12
    });
});
// Evento del botón para volver al menú
document.getElementById('menuButton').addEventListener('click', () => {
    window.location.href = 'menu.html'; // Cambia 'menu.html' por la ruta de tu menú
});
gameLoop();
