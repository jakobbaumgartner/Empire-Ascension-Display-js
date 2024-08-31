// Creating a new PixiJS application
const app = new PIXI.Application({
    width: window.innerWidth, // Set the width to the window's width
    height: window.innerHeight, // Set the height to the window's height
    resolution: window.devicePixelRatio || 1, // Set the resolution to the device's pixel ratio
});

// Adding the PixiJS canvas to the hexCanvas div
document.getElementById('hexCanvas').appendChild(app.view);

// Creating a container to hold the hexagons
const hexContainer = new PIXI.Container();
app.stage.addChild(hexContainer);

// Load the background image
PIXI.Loader.shared.add('background', 'background.jpg').load((loader, resources) => {
    const background = new PIXI.Sprite(resources.background.texture);
    // Scale the background image to fit the screen
    const scaleX = app.renderer.width / background.texture.width;
    const scaleY = app.renderer.height / background.texture.height;
    const scale = Math.min(scaleX, scaleY);

    background.scale.set(scale); // Set the scale of the background image
    background.x = 0; // Position the background image at the top-left corner
    background.y = 0;

    // Create a blur filter
    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 10; // Adjust the blur amount (increase for more blur)

    // Apply the filter to the background
    background.filters = [blurFilter];

    app.stage.addChildAt(background, 0); // Add the background image to the stage
});

// Create a hexagonal grid with the specified width and height
const hexGridData = createHexagonalGridData(gridWidth, gridHeight);
console.log(hexGridData);
// Display the hexagonal grid on the screen
displayHexagonalGrid(hexContainer, hexGridData, hexWidth, hexHeight);



let lastHighlighted = null; // To keep track of the last highlighted hexagon

// Make the hexContainer interactive
hexContainer.interactive = true;
hexContainer.on('mousemove', (event) => {
    // Get the local position of the mouse relative to the hexContainer
    const pos = event.data.getLocalPosition(hexContainer);
    // console.log(pos);
    // Calculate the column and row of the hexagon under the mouse
    const col = Math.round(pos.x / (hexWidth * 0.75));
    const row = Math.round((pos.y - (col % 2) * (hexHeight / 2)) / hexHeight);
    
    // Check if the calculated position is within the grid bounds
    if (col >= 0 && col < gridWidth && row >= 0 && row < gridHeight) {
        const index = row * gridWidth + col;
        const hexagon = hexContainer.children[index];

        // If there is a previously highlighted hexagon, reset its tint
        if (lastHighlighted && lastHighlighted !== hexagon && !lastHighlighted.clicked) {
            lastHighlighted.tint = 0xffffff;
        }

        // Highlight the hexagon under the mouse
        if (!hexagon.clicked) {
            hexagon.tint = 0xff0000;
        }

        lastHighlighted = hexagon; // Update the last highlighted hexagon
    }
});

let isDragging = false; // Flag to check if dragging is in progress
let dragStartX, dragStartY; // Variables to store drag start positions

// Handle the mousedown event on the hexContainer
hexContainer.on('mousedown', (event) => {
    isDragging = true; // Start dragging
    // Store the initial position of the mouse relative to the hexContainer
    dragStartX = event.data.global.x - hexContainer.x;
    dragStartY = event.data.global.y - hexContainer.y;

    // Load the soldier images and place a random soldier sprite on the hexagon grid
    // loader.load((loader, resources) => {
    //     const randomSoldier = soldiers[Math.floor(Math.random() * soldiers.length)];
    //     const soldier = new PIXI.Sprite(resources[randomSoldier].texture);

    //     soldier.scale.set(0.2, 0.2); // Scale the soldier sprite

    //     const localPos = event.data.getLocalPosition(hexContainer); // Get the position of the click relative to the hexContainer
    //     soldier.x = localPos.x;
    //     soldier.y = localPos.y;
    //     soldier.anchor.set(0.5, 0.5); // Set the anchor point to the center of the sprite

    //     hexContainer.addChild(soldier); // Add the soldier sprite to the hexContainer
    // });
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