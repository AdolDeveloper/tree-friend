document.addEventListener("DOMContentLoaded", function () {
    // Inicia la animación de nieve
    $('#background').snowfall({
        flakeCount: 100,
        maxSpeed: 5,
        maxSize: 5,
        flakeColor: '#ffffff'  // Color blanco
    });

    openPopup();
    initCarousel();
    setTimeout(() => {
        closePopup();
        animateChristmasTree("ALEXANDRA");
        // Inicia la animación de fuegos artificiales después de que se crea el árbol
        setTimeout(() => {
            initFireworks();
            drawFireworks();
            // Después de 7 segundos, muestra el modal
            setTimeout(() => {
                showPopup("Por ser una gran amiga", "https://youtu.be/13jQjFQmTFw?si=m2DBKGNZkUdcOM51");
            }, 3000);
        }, 10000);
        
    }, 11000); // Cerrar automáticamente después de 8 segundos
});

function openPopup() {
    document.getElementById("popupContainer").style.display = "block";
    document.querySelector(".background").style.display = "none";
}

function closePopup() {
    document.getElementById("popupContainer").style.display = "none";
    document.querySelector(".background").style.display = "block";
}

function initCarousel() {
    const carousel = document.getElementById("imageCarousel");
    let currentIndex = 0;
    const images = carousel.getElementsByTagName("img");

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }, 3000);

    function updateCarousel() {
        const translateValue = -currentIndex * 100 + "%";
        carousel.style.transform = "translateX(" + translateValue + ")";
    }
}

function animateChristmasTree(name) {
    const treeContainer = document.getElementById("christmasTree");
    const treeHeight = 10; // Numero de letras

    // Star
    const star = document.createElement("div");
    star.className = "star";
    star.innerHTML = "&#9733;"; // Código de entidad para el símbolo de estrella
    treeContainer.appendChild(star);

    function addTreeLayer(i) {
        setTimeout(() => {
            const treeLayer = document.createElement("div");
            treeLayer.textContent = name.substr(0, i + 1);
            treeContainer.appendChild(treeLayer);
        }, i * 1000); // Ajusta el tiempo según sea necesario
    }

    // Retrasa el inicio de la animación después de cerrar el popup
    setTimeout(() => {
        for (let i = 0; i < treeHeight; i++) {
            addTreeLayer(i);
        }
    }, 1000); // Ajusta el tiempo según sea necesario
}

// Codigo fuegos artificiales

var rnd = Math.random,
    flr = Math.floor;

let canvasFireworks = document.createElement('canvas');
document.getElementsByTagName('body')[0].appendChild(canvasFireworks);
canvasFireworks.style.position = 'absolute';
canvasFireworks.style.width = '100%';
canvasFireworks.style.height = '100%';
canvasFireworks.style.zIndex = '1'; // Asegura que los fuegos artificiales estén detrás de la nieve y el árbol
canvasFireworks.style.pointerEvents = 'none'; // Permite hacer clic a través del canvas
canvasFireworks.style.backgroundColor = 'transparent'; // Hace el fondo del canvas transparente

canvasFireworks.width = canvasFireworks.clientWidth;
canvasFireworks.height = canvasFireworks.clientHeight;

let ctxFireworks = canvasFireworks.getContext('2d');

function rndNum(num) {
    return rnd() * num + 1;
}

function vector(x, y) {
    this.x = x;
    this.y = y;

    this.add = function (vec2) {
        this.x = this.x + vec2.x;
        this.y = this.y + vec2.y;
    }
}

function particle(pos, vel) {
    this.pos = new vector(pos.x, pos.y);
    this.vel = vel;
    this.dead = false;
    this.start = 0;

    this.update = function (time) {
        let timeSpan = time - this.start;

        if (timeSpan > 500) {
            this.dead = true;
        }

        if (!this.dead) {
            this.pos.add(this.vel);
            this.vel.y = this.vel.y + gravity;
        }
    };

    this.draw = function () {
        if (!this.dead) {
            drawDot(this.pos.x, this.pos.y, 1);
        }
    }
}

function firework(x, y) {
    this.pos = new vector(x, y);
    this.vel = new vector(0, -rndNum(10) - 3);
    this.color = 'hsl(' + rndNum(360) + ', 100%, 50%)'
    this.size = 4;
    this.dead = false;
    this.start = 0;
    let exParticles = [],
        exPLen = 100;

    let rootShow = true;

    this.update = function (time) {
        if (this.dead) {
            return;
        }

        rootShow = this.vel.y < 0;

        if (rootShow) {
            this.pos.add(this.vel);
            this.vel.y = this.vel.y + gravity;
        } else {
            if (exParticles.length === 0) {
                flash = true;
                for (let i = 0; i < exPLen; i++) {
                    exParticles.push(new particle(this.pos, new vector(-rndNum(10) + 5, -rndNum(10) + 5)));
                    exParticles[exParticles.length - 1].start = time;
                }
            }
            let numOfDead = 0;
            for (let i = 0; i < exPLen; i++) {
                let p = exParticles[i];
                p.update(time);
                if (p.dead) {
                    numOfDead++;
                }
            }

            if (numOfDead === exPLen) {
                this.dead = true;
            }
        }
    }

    this.draw = function () {
        if (this.dead) {
            return;
        }

        ctxFireworks.fillStyle = this.color;
        if (rootShow) {
            drawDot(this.pos.x, this.pos.y, this.size);
        } else {
            for (let i = 0; i < exPLen; i++) {
                let p = exParticles[i];
                p.draw();
            }
        }
    }
}

function drawDot(x, y, size) {
    ctxFireworks.beginPath();
    ctxFireworks.arc(x, y, size, 0, Math.PI * 2);
    ctxFireworks.fill();
    ctxFireworks.closePath();
}

var fireworks = [],
    gravity = 0.2,
    snapTime = 0,
    flash = false;

function initFireworks() {
    let numOfFireworks = 20;
    for (let i = 0; i < numOfFireworks; i++) {
        fireworks.push(new firework(rndNum(canvasFireworks.width), canvasFireworks.height));
    }
}

function updateFireworks(time) {
    for (let i = 0, len = fireworks.length; i < len; i++) {
        let p = fireworks[i];
        p.update(time);
    }
}

function drawFireworks(time) {
    updateFireworks(time);

    ctxFireworks.fillStyle = 'rgba(0,0,0,0.3)';
    if (flash) {
        flash = false;
    }
    ctxFireworks.fillRect(0, 0, canvasFireworks.width, canvasFireworks.height);

    ctxFireworks.fillStyle = 'white';
    ctxFireworks.font = "30px Arial";
    let newTime = time - snapTime;
    snapTime = time;

    ctxFireworks.fillStyle = 'blue';
    for (let i = 0, len = fireworks.length; i < len; i++) {
        let p = fireworks[i];
        if (p.dead) {
            fireworks[i] = new firework(rndNum(canvasFireworks.width), canvasFireworks.height);
            p = fireworks[i];
            p.start = time;
        }
        p.draw();
    }

    window.requestAnimationFrame(drawFireworks);
}

window.addEventListener('resize', function () {
    canvasFireworks.width = canvasFireworks.clientWidth;
    canvasFireworks.height = canvasFireworks.clientHeight;
});

// Añadido: Inicia los fuegos artificiales después de 7 segundos
setTimeout(() => {
    initFireworks();
    drawFireworks();
}, 30000);

function showPopup(message, link) {
    Swal.fire({
        title: 'Mensaje Especial',
        html: message,
        icon: 'info',
        confirmButtonText: 'Ver Canción'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = link;
        }
    });
}

