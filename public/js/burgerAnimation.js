// Canvas setup
const canvas = document.getElementById("burgerCanvas");
canvas.width = 150;
canvas.height = 200;
const ctx = canvas.getContext("2d");
// Burger layers setup (image sources)
const layerImages = [
    { src: 'https://prod-burgerhut.s3.eu-north-1.amazonaws.com/topBun.png', y: -100 },   // Top bun
    { src: 'https://prod-burgerhut.s3.eu-north-1.amazonaws.com/lettuce.png', y: -150 },   // Lettuce
    { src: 'https://prod-burgerhut.s3.eu-north-1.amazonaws.com/tomato.png', y: -200 },    // Tomato
    { src: 'https://prod-burgerhut.s3.eu-north-1.amazonaws.com/patty.png', y: -250 },     // Patty
    { src: 'https://prod-burgerhut.s3.eu-north-1.amazonaws.com/bottomBun.png', y: -300 }  // Bottom bun
];

const targetY = [50, 80, 100, 120, 150]; // Target Y positions for each layer
const speed = 2; // Speed at which layers fall
const layerWidth = 80; // Fixed width for each layer
const layerHeight = 20; // Fixed height for each layer

// Load images and animate
const loadedImages = [];

layerImages.forEach((layer, index) => {
    const img = new Image();
    img.src = layer.src;
    img.onload = () => {
        loadedImages[index] = { img: img, y: layer.y };
        if (loadedImages.length === layerImages.length) {
            requestAnimationFrame(animateBurger);
        }
    };
});

// Animation function
function animateBurger() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    let animationComplete = true;

    loadedImages.forEach((layer, index) => {
        if (layer.y < targetY[index]) {
            layer.y += speed;
            animationComplete = false;
        }
        ctx.drawImage(layer.img, 40, layer.y, layerWidth, layerHeight);
        });

    // Loop animation if not complete
    if (!animationComplete) {
        requestAnimationFrame(animateBurger);
    }
}
