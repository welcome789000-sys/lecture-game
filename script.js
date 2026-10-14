const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// إعدادات الشخصية واللعبة
let player = {
    x: 50,
    y: 450,
    width: 40,
    height: 50,
    dy: 0,
    jumpPower: -12,
    gravity: 0.6,
    grounded: true,
    color: "#ff5722"
};

let obstacles = [];
let score = 0;
let gameSpeed = 4;
let isGameOver = false;
let frameCount = 0;

// التحكم باللمس أو النقر
document.addEventListener("keydown", function(e) {
    if (e.code === "Space") jump();
});

canvas.addEventListener("click", function() {
    jump();
});

function jump() {
    if (player.grounded && !isGameOver) {
        player.dy = player.jumpPower;
        player.grounded = false;
    } else if (isGameOver) {
        resetGame();
    }
}

function resetGame() {
    obstacles = [];
    score = 0;
    gameSpeed = 4;
    frameCount = 0;
    isGameOver = false;
    loop();
}

// توليد العقبات (الكتب)
function spawnObstacle() {
    let obstacleHeight = Math.random() * 30 + 30;
    obstacles.push({
        x: canvas.width,
        y: 500 - obstacleHeight,
        width: 30,
        height: obstacleHeight,
        color: "#d32f2f"
    });
}

function update() {
    if (isGameOver) return;

    // حركة اللاعب الجاذبية
    player.dy += player.gravity;
    player.y += player.dy;

    // الاصطدام بالأرض
    if (player.y > 450) {
        player.y = 450;
        player.dy = 0;
        player.grounded = true;
    }

    // زيادة السرعة والنقاط مع الوقت
    frameCount++;
    if (frameCount % 100 === 0) {
        spawnObstacle();
        score += 10;
        gameSpeed += 0.2;
    }

    // تحريك العقبات وفحص الاصطدام
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;

        // فحص الاصطدام (Game Over)
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            isGameOver = true;
        }

        // إزالة العقبات التي خرجت من الشاشة
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function draw() {
    // مسح الشاشة
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الأرض
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, 500, canvas.width, 100);

    // رسم اللاعب (الطالب)
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // رسم رأس اللاعب
    ctx.fillStyle = "#ffe0b2";
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y - 10, 15, 0, Math.PI * 2);
    ctx.fill();

    // رسم العقبات (الكتب)
    for (let obs of obstacles) {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // رسم النقاط
    ctx.fillStyle = "#fff";
    ctx.font = "20px Tahoma";
    ctx.textAlign = "left";
    ctx.fillText("النقاط: " + score, 20, 40);

    // شاشة الخسارة
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = "30px Tahoma";
        ctx.textAlign = "center";
        ctx.fillText("قفل باب المحاضرة! 📚", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = "18px Tahoma";
        ctx.fillText("انقر لإعادة المحاولة", canvas.width / 2, canvas.height / 2 + 30);
        ctx.textAlign = "left";
    }
}

function loop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(loop);
    }
}

// بدء اللعبة
loop();
