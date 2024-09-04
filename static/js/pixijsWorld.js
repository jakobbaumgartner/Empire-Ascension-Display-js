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
// hexContainer.on('mousemove', (event) => {
//     const pos = event.data.getLocalPosition(hexContainer);
//     const col = Math.round(pos.x / (hexWidth * 0.75));
//     const row = Math.round((pos.y - (col % 2) * (hexHeight / 2)) / hexHeight);
    
//     if (col >= 0 && col < gridWidth && row >= 0 && row < gridHeight) {
//         const index = row * gridWidth + col;
//         const hexagon = hexContainer.children[index];

//         if (lastHighlighted && lastHighlighted !== hexagon && !lastHighlighted.clicked) {
//             lastHighlighted.tint = 0xffffff;
//         }

//         if (!hexagon.clicked) {
//             hexagon.tint = 0x000000;
//         }

//         lastHighlighted = hexagon;
//     }
// });

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
        }
    }
}
});

function createSoldier(resources, selected, hexContainer, clickPosition, centerOnHexagon) {
    console.log("Creating soldier...");
    
    const soldierContainer = new PIXI.Container();
    
    // Create the glow sprite
    const glowTexture = createGlowTexture();
    const glow = new PIXI.Sprite(glowTexture);
    glow.anchor.set(0.5, 0.5);
    glow.scale.set(1.2);
    glow.alpha = 0; // Start with the glow invisible
    soldierContainer.addChild(glow);
    
    // Create the soldier sprite
    const soldier = new PIXI.Sprite(resources[selected].texture);
    soldier.scale.set(0.2, 0.2);
    soldier.anchor.set(0.4, 0.9);
    
    soldierContainer.addChild(soldier);
    
    // Soldier placement logic
    if (centerOnHexagon) {
        const col = Math.round(clickPosition.x / (hexWidth * 0.75));
        const row = Math.round((clickPosition.y - (col % 2) * (hexHeight / 2)) / hexHeight);
        soldierContainer.x = col * hexWidth * 0.75 + hexWidth / 2;
        soldierContainer.y = row * hexHeight + (col % 2) * (hexHeight / 2) + hexHeight / 2;
    } else {
        soldierContainer.x = clickPosition.x;
        soldierContainer.y = clickPosition.y;
    }
    
    // Set the hit area to match only the soldier sprite, not the glow
    const hitAreaSize = Math.max(soldier.width, soldier.height);
    soldierContainer.hitArea = new PIXI.Circle(0, 0, hitAreaSize / 2);
    
    soldierContainer.interactive = true;
    soldierContainer.buttonMode = true;
    
    soldierContainer.on('mousedown', (event) => {
        event.stopPropagation();
        
        if (selectedSoldier && selectedSoldier !== soldierContainer) {
            deselectSoldier(selectedSoldier);
        }
        
        if (selectedSoldier === soldierContainer) {
            deselectSoldier(soldierContainer);
            selectedSoldier = null;
            console.log("Soldier deselected");
        } else {
            selectSoldier(soldierContainer);
            selectedSoldier = soldierContainer;
            console.log("Soldier selected");
        }
    });
    
    hexContainer.addChild(soldierContainer);

    // Add smoother placement animation
    soldier.y = 10; // Start the soldier slightly above its final position
    soldier.alpha = 0; // Start with the soldier invisible

    gsap.to(soldier, {
        y: 0,
        alpha: 1,
        duration: 0.3,
        ease: "power2.out"
    });

    return soldierContainer;
}

function selectSoldier(soldierContainer) {
    const soldier = soldierContainer.getChildAt(1); // The soldier is now at index 1
    const glow = soldierContainer.getChildAt(0); // The glow is at index 0
    
    // Smooth jump animation
    gsap.to(soldier, {
        y: -10, // Height of the jump
        duration: 0.3, // Duration of the upward motion
        ease: "power1.inOut", // Smoother easing function
        onComplete: () => {
            gsap.to(soldier, {
                y: 0, // Return to original position
                duration: 0.3, // Duration of the downward motion
                ease: "power1.inOut" // Smoother easing function
            });
        }
    });
    
    // Fade in the glow and add white tint to soldier
    gsap.to(glow, {
        alpha: 1,
        duration: 0.3,
        ease: "power1.inOut"
    });
    
    gsap.to(soldier, {
        tint: 0xFFFFFF, // White tint
        brightness: 1.5, // Increase brightness
        duration: 0.3,
        ease: "power1.inOut"
    });
}

function deselectSoldier(soldierContainer) {
    const soldier = soldierContainer.getChildAt(1);
    const glow = soldierContainer.getChildAt(0);
    
    // Ensure the soldier returns to original position
    gsap.to(soldier, {
        y: 0,
        duration: 0.3,
        ease: "power1.inOut"
    });
    
    // Fade out the glow and remove white tint from soldier
    gsap.to(glow, {
        alpha: 0,
        duration: 0.3,
        ease: "power1.inOut"
    });
    
    gsap.to(soldier, {
        tint: 0xFFFFFF, // Reset tint
        brightness: 1, // Reset brightness
        duration: 0.3,
        ease: "power1.inOut"
    });
}

// Creates a radial gradient texture for the glow effect around selected soldiers   
function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; // Reduced from 256 to 128
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 100, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 0, 0.3)'); // Added an intermediate stop
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    return PIXI.Texture.from(canvas);
}