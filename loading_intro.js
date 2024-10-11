window.onload = function () {
    const canvas = document.getElementById('loadingCanvas');
    const ctx = canvas.getContext('2d');

    const videoElement = document.getElementById('introVideo');
    videoElement.src = "assets/intro.mp4";

    const endImage = new Image();
    endImage.src = "assets/intro screen.png";

    const buttons = [
        { text: 'Play', x: 0, y: 0, width: 100, height: 50 },
        { text: 'Options', x: 0, y: 0, width: 100, height: 50 },
        { text: 'Quit', x: 0, y: 0, width: 100, height: 50 }
    ];
    let selectedButton = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let loaded = 0;
    let total = 100;
    const progressBarWidth = canvas.width * 0.6;
    const progressBarHeight = 30;
    const progressBarX = (canvas.width - progressBarWidth) / 2;
    const progressBarY = canvas.height - canvas.height * 0.2;

    let loadingComplete = false;

    function drawLoadingScreen(progress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("LOADING..", canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillStyle = "#333";
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(progressBarX, progressBarY, (progress / total) * progressBarWidth, progressBarHeight);
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.fillText(`${Math.floor(progress)}%`, canvas.width / 2, progressBarY + progressBarHeight / 1.5);
        if (loadingComplete) {
            ctx.fillStyle = "#fff";
            ctx.font = "24px Arial";
            ctx.fillText("Press Enter to Start", canvas.width / 2, progressBarY + progressBarHeight + 40);
        }
    }

    function loadGameAssets() {
        let loadInterval = setInterval(function () {
            if (loaded < total) {
                loaded += 1;  
                drawLoadingScreen(loaded);
            } else {
                clearInterval(loadInterval);
                loadingComplete = true;
                drawLoadingScreen(loaded);
                window.addEventListener('keydown', handleStartVideo);
            }
        }, 50);
    }

    function handleStartVideo(event) {
        if (loadingComplete && event.key === 'Enter') {
            playVideo();
            window.removeEventListener('keydown', handleStartVideo);
        }
    }

    function playVideo() {
        videoElement.style.display = 'block';
        videoElement.play();
        canvas.style.display = 'none';
        window.addEventListener('keydown', function (e) {
            if (e.key === "Enter") {
                skipVideo();
            }
        });
        videoElement.onended = function () {
            showImageScreen();
        };
    }

    function skipVideo() {
        videoElement.pause();
        videoElement.style.display = 'none';
        showImageScreen();
    }

    function showImageScreen() {
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(endImage, 0, 0, canvas.width, canvas.height);
        drawControlBox();
    }

    function drawControlBox() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        const boxWidth = 200;
        const boxHeight = buttons.length * 50 + 20;
        const boxX = (canvas.width - boxWidth) / 2 + 100;
        const boxY = (canvas.height - boxHeight) / 2;

        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        ctx.font = "24px Arial";
        ctx.textAlign = "left";

        buttons.forEach((button, index) => {
            button.x = boxX + 20;
            button.y = boxY + 30 + index * 50;

            if (index === selectedButton) {
                ctx.fillStyle = "#ff0000";
            } else {
                ctx.fillStyle = "#ffffff";
            }

            ctx.fillText(button.text, button.x, button.y);
        });

        canvas.addEventListener('click', handleButtonClick);
        window.addEventListener('keydown', handleKeyPress);
    }

    function handleButtonClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        buttons.forEach((button, index) => {
            if (mouseX >= button.x && mouseX <= button.x + button.width &&
                mouseY >= button.y - 20 && mouseY <= button.y) {
                handleButtonAction(index);
            }
        });
    }

    function handleKeyPress(event) {
        if (event.key === 'ArrowDown') {
            selectedButton = (selectedButton + 1) % buttons.length;
            drawControlBox();
        } else if (event.key === 'ArrowUp') {
            selectedButton = (selectedButton - 1 + buttons.length) % buttons.length;
            drawControlBox();
        } else if (event.key === 'Enter') {
            handleButtonAction(selectedButton);
        }
    }

    function handleButtonAction(index) {
        switch (index) {
            case 0:
                break;
            case 1:
                alert("Options clicked!");
                break;
            case 2:
                alert("Quit clicked!");
                break;
            default:
                break;
        }
    }

    loadGameAssets();

    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (loaded < total) drawLoadingScreen(loaded);
        else drawControlBox();
    };
};
