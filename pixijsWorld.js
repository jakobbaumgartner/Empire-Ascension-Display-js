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
const hexGridData = createHexagonalGridData();
// Display the hexagonal grid on the screen
displayHexagonalGrid(hexContainer, hexGridData, hexWidth, hexHeight);

// ----------------- Dragging and zooming -----------------

let isDragging = false; // Flag to check if dragging is in progress
let dragStartX, dragStartY; // Variables to store drag start positions

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




// ----------------- Other functions -----------------

let lastHighlighted = null; // To keep track of the last highlighted hexagon
let selectedHexagon = null;
let selectedSoldier = null;

// Make the hexContainer marked 
hexContainer.interactive = true;
hexContainer.on('mousemove', (event) => {
    const pos = event.data.getLocalPosition(hexContainer);
    const col = Math.round(pos.x / (hexWidth * 0.75));
    const row = Math.round((pos.y - (col % 2) * (hexHeight / 2)) / hexHeight);
    
    if (col >= 0 && col < gridWidth && row >= 0 && row < gridHeight) {
        const index = row * gridWidth + col;
        const hexagon = hexContainer.children[index];

        if (lastHighlighted && lastHighlighted !== hexagon && !lastHighlighted.clicked) {
            lastHighlighted.tint = 0xffffff;
        }

        if (!hexagon.clicked) {
            hexagon.tint = 0x000000;
        }

        lastHighlighted = hexagon;
    }
});

// Hexagon click handler
hexContainer.on('mousedown', (event) => {
    const mouseEvent = event.data.originalEvent;
    
    if (mouseEvent.button === 0) {
        const clickPosition = event.data.getLocalPosition(hexContainer);
        
        // If unit is selected, place it on the hexagon
        if (selected) {
        loader.load((loader, resources) => {
            // Call createSoldier with the new parameters
            const soldier = createSoldier(resources, selected, hexContainer, clickPosition, false); // or false for exact placement
        });

        // Deselect the unit after placing it
        selected = null
        // Remove stats from the selection container
        emptyStats();

    }
    else {
        const pos = event.data.getLocalPosition(hexContainer);
        const col = Math.round(pos.x / (hexWidth * 0.75));
        const row = Math.round((pos.y - (col % 2) * (hexHeight / 2)) / hexHeight);
        
        if (col >= 0 && col < gridWidth && row >= 0 && row < gridHeight) {
            const index = row * gridWidth + col;
            const hexagon = hexContainer.children[index];

            console.log(`Hexagon clicked: ${col}, ${row}`);
            console.log(hexagon);
            displayHexagonStats(hexagon) // Display hexagon stats in the selection container
            
            if (selectedHexagon && selectedHexagon !== hexagon) {
                selectedHexagon.tint = 0xFFFFFF;
            }
            
            // if (hexagon.clicked) {
            //     hexagon.tint = 0xFFFFFF;
            //     selectedHexagon = null;
            //     console.log("Hexagon deselected");
            // } else {
            //     hexagon.tint = 0x00FF00;
            //     selectedHexagon = hexagon;
            //     console.log("Hexagon selected");
            // }

    }
        
}}
});



function createSoldier(resources, selected, hexContainer, clickPosition, centerOnHexagon) {
    console.log("Creating soldier...");
    const soldier = new PIXI.Sprite(resources[selected].texture);
    soldier.scale.set(0.2, 0.2);
    soldier.anchor.set(0.4, 0.9);
    
    // Soldier placement location

    if (centerOnHexagon) {
        // Calculate the center of the clicked hexagon
        soldier.anchor.set(0.7, 1); // TODO: Different units should have different anchor points 
        const col = Math.round(clickPosition.x / (hexWidth * 0.75));
        const row = Math.round((clickPosition.y - (col % 2) * (hexHeight / 2)) / hexHeight);
        soldier.x = col * hexWidth * 0.75 + hexWidth / 2;
        soldier.y = row * hexHeight + (col % 2) * (hexHeight / 2) + hexHeight / 2;
    } else {
        // Place the soldier at the exact click position
        soldier.anchor.set(0.4, 0.9); // Anchor point for the soldier sprite
        soldier.x = clickPosition.x;
        soldier.y = clickPosition.y;
    }
    
    soldier.interactive = true;
    soldier.buttonMode = true;
    
    soldier.on('mousedown', (event) => {
        event.stopPropagation();
        
        // If another soldier is selected, deselect it
        if (selectedSoldier && selectedSoldier !== soldier) {
            selectedSoldier.tint = 0xFFFFFF;
        }
        
        // If the soldier is already selected, deselect it
        if (selectedSoldier === soldier) {
            soldier.tint = 0xFFFFFF;
            selectedSoldier = null;
            console.log("Soldier deselected");

        // Otherwise, select the soldier
        } else {
            soldier.tint = 0x00FF00;
            selectedSoldier = soldier;
            console.log("Soldier selected");
        }
    });
    
    hexContainer.addChild(soldier);
    return soldier;
}
