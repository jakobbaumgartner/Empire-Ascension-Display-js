// Creating a new PixiJS application
const app = new PIXI.Application({
    width: window.innerWidth, // Set the width to the window's width
    height: window.innerHeight, // Set the height to the window's height
    resolution: window.devicePixelRatio || 1, // Set the resolution to the device's pixel ratio
});

// Adding the PixiJS canvas to the hexCanvas div
document.getElementById('hexCanvas').appendChild(app.view);

// Creating a container to hold the hexagons
var hexContainer = new PIXI.Container();
app.stage.addChild(hexContainer);

// Load the background image
PIXI.Loader.shared.add('background', 'static/images/background.jpg').load((loader, resources) => {
    const background = new PIXI.Sprite(resources.background.texture);

    // background.scale.set(scale); // Set the scale of the background image
    background.x = 0; // Position the background image at the top-left corner
    background.y = 0;

    // Create a blur filter
    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 10; // Adjust the blur amount (increase for more blur)

    // Apply the filter to the background
    background.filters = [blurFilter];

    app.stage.addChildAt(background, 0); // Add the background image to the stage
});

// ----------------- Dragging and zooming -----------------

let isDragging = false; // Flag to check if dragging is in progress
let dragStartX, dragStartY; // Variables to store drag start positions

hexContainer.interactive = true;

// Handle the mousedown event on the hexContainer
hexContainer.on('mousedown', (event) => {
    const mouseEvent = event.data.originalEvent;
    // Check if middle button is clicked
    if (mouseEvent.button == 1) {
            isDragging = true; // Start dragging
    }

    // Store the initial position of the mouse relative to the hexContainer
    dragStartX = event.data.global.x - hexContainer.x;
    dragStartY = event.data.global.y - hexContainer.y;

});

// Stop dragging on mouseup event
hexContainer.on('mouseup', () => {
    isDragging = false;
});

// Handle mousemove event to drag the hexContainer
hexContainer.on('mousemove', (event) => {
    if (isDragging) {
        // Calculate the new position of the hexContainer based on the mouse movement
        hexContainer.x = event.data.global.x - dragStartX;
        hexContainer.y = event.data.global.y - dragStartY;
    }
});

// Handle zoom in/out using the mouse wheel
document.addEventListener('wheel', (event) => {
    // event.preventDefault(); // Prevent the default scrolling behavior

    const mousePos = app.renderer.plugins.interaction.mouse.global; // Get the global mouse position
    const worldPosBeforeZoom = hexContainer.toLocal(mousePos); // Get the world position before zoom

    // Determine the zoom factor based on the scroll direction
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    hexContainer.scale.x *= zoomFactor; // Scale the hexContainer
    hexContainer.scale.y *= zoomFactor;

    const worldPosAfterZoom = hexContainer.toLocal(mousePos); // Get the world position after zoom
    // Adjust the position of the hexContainer to maintain the mouse position
    hexContainer.x += (worldPosAfterZoom.x - worldPosBeforeZoom.x) * hexContainer.scale.x;
    hexContainer.y += (worldPosAfterZoom.y - worldPosBeforeZoom.y) * hexContainer.scale.y;
});

// Handle window resize to adjust the PixiJS renderer size
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

