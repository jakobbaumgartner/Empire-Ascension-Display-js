// Constants for hexagon dimensions
const hexRadius = 15; // Radius of each hexagon
const hexHeight = hexRadius * Math.sqrt(3); // Height of a hexagon
const hexWidth = hexRadius * 2; // Width of a hexagon

// Grid dimensions in terms of the number of hexagons
const gridWidth = 250; // Number of hexagons horizontally
const gridHeight = 100; // Number of hexagons vertically

// Color codes for different terrain types
const terrainTypes = {
    water: 0x5B99C2, // Blue color for water
    beach: 0xF9DBBA, // Beige color for beach
    grass: 0xCBE2B5, // Light green color for grass
    forest: 0x86AB89, // Darker green for forest
    mountain: 0xA28B55, // Brown color for mountains
    road: 0x505050 // Darker gray color for roads
};

// Variable to store the grid hash
let gridHash = 0;

// Function to create a hexagon graphic at a given position with axial coordinates (i, j, k)
function createHexagon(x, y, hexData) {
    const hexagon = new PIXI.Graphics(); // Create a new PIXI Graphics object for the hexagon

    // Begin drawing the hexagon with the appropriate terrain color
    hexagon.beginFill(terrainTypes[hexData.terrain_type]);
    // hexagon.lineStyle(1, 0xCCCCCC, 1); // Set the border color to light gray
    hexagon.lineStyle(1, 0x000000, 0.2); // Set the border color to black with 20% transparency


    // Draw the hexagon using a polygon
    hexagon.drawPolygon([
        -hexRadius, 0,
        -hexRadius / 2, hexHeight / 2,
        hexRadius / 2, hexHeight / 2,
        hexRadius, 0,
        hexRadius / 2, -hexHeight / 2,
        -hexRadius / 2, -hexHeight / 2
    ]);

    hexagon.endFill(); // End the fill operation
    hexagon.x = x; // Set the x position of the hexagon
    hexagon.y = y; // Set the y position of the hexagon

    // Make the hexagon interactive and set its initial clicked state to false
    hexagon.interactive = true;
    hexagon.buttonMode = true; // Change cursor on hover to indicate interactivity
    hexagon.clicked = false;

    // Add popup display functionality to the hexagon
    hexagon.on('mousedown', (event) => {
        if (event.data.originalEvent.button === 0) { // Check if the left mouse button is pressed
            showHexagonPopup(event.data.originalEvent, hexData); // Show the hexagon popup
        }
    });
    hexagon.on('mouseout', hideHexagonPopup);

    // Add hexagon visual effects on mouseover and mouseout
    hexagon.on('mouseout', (event) => {
        hexagon.clear();
        hexagon.beginFill(terrainTypes[hexData.terrain_type]);
        hexagon.lineStyle(1, 0x000000, 0.2);
        hexagon.drawPolygon([
            -hexRadius, 0,
            -hexRadius / 2, hexHeight / 2,
            hexRadius / 2, hexHeight / 2,
            hexRadius, 0,
            hexRadius / 2, -hexHeight / 2,
            -hexRadius / 2, -hexHeight / 2
        ]);
        hexagon.endFill();
    });
    hexagon.on('mouseover', (event) => {
        hexagon.clear();
        hexagon.beginFill(terrainTypes[hexData.terrain_type], 0.5); // Apply shadow effect with 50% opacity
        hexagon.lineStyle(1, 0x000000, 0.2);
        hexagon.drawPolygon([
            -hexRadius, 0,
            -hexRadius / 2, hexHeight / 2,
            hexRadius / 2, hexHeight / 2,
            hexRadius, 0,
            hexRadius / 2, -hexHeight / 2,
            -hexRadius / 2, -hexHeight / 2
        ]);
        hexagon.endFill();
    });

    return hexagon; // Return the created hexagon
}

// Function to show the popup with hexagon specs
function showHexagonPopup(event, hexData) {
    console.log(hexData)
    // const hexData = hexGrid.get(hexId); // Fetch data from hexGrid using hexId
    console.log(event)
    const popup = document.createElement('div');
    popup.className = 'hex-popup';
    popup.innerHTML = `
    <div class="hex-popup-inner">
        <div class="hex-popup-content">
            <img src="static/images/${hexData.terrain_type}.webp" alt="Hexagon Info" class="hex-popup-full-height-image">
            <div class="hex-popup-text">
                <div class="hex-popup-title">${hexData.terrain_type.charAt(0).toUpperCase() + hexData.terrain_type.slice(1)}</div>
                <div class="hex-popup-item"><strong>Description:</strong> ${hexData.description}</div>
                <div class="hex-popup-item"><strong>Axial coordinates:</strong> [q: ${hexData.axial_coordinates.q}, r: ${hexData.axial_coordinates.r}]</div>
                <div class="hex-popup-item"><strong>Cartesian coordinates:</strong> [x: ${hexData.hex_cartesian.x.toFixed(2)}, y: ${hexData.hex_cartesian.y.toFixed(2)}]</div>
                <div class="hex-popup-item"><strong>Movement cost:</strong> ${hexData.movement_cost}</div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(popup);

    // Get screen width and height
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Check if the mouse is on the right side of the screen
    if (event.clientX > screenWidth / 2) {
        // Position the popup to the left of the mouse cursor
        popup.style.left = `${event.clientX - popup.offsetWidth - 10}px`;
    } else {
        // Position the popup to the right of the mouse cursor
        popup.style.left = `${event.clientX + 10}px`;
    }

    // Check if the mouse is on the bottom half of the screen
    if (event.clientY > screenHeight / 2) {
        // Position the popup above the mouse cursor
        popup.style.top = `${event.clientY - popup.offsetHeight - 10}px`;
    } else {
        // Position the popup below the mouse cursor
        popup.style.top = `${event.clientY + 10}px`;
    }
}

// Function to hide the popup
function hideHexagonPopup() {
    const popup = document.querySelector('.hex-popup');
    if (popup) {
        popup.remove();
    }
}

// Function to display the hexagonal grid on the screen
function displayHexagonalGrid(hexContainer, gridData) {
    console.log("Creating and Displaying Hex Grid Data");

    // Clear the hexContainer before adding new hexagons
    hexContainer.removeChildren();

    // Loop through each hexagon data from the server
    gridData.forEach(hexData => {
        const { hex_id, description, hex_cartesian, axial_coordinates, terrain_type, state_hash, timestamp, buildings, sprite, movement_cost } = hexData;

        // Create the hexagon (function needs to use the x, y positions and other properties)
        const hexagon = createHexagon(hex_cartesian.x, hex_cartesian.y, hexData);

        // Store the hexagon data as a property of the hexagon graphic object
        hexagon.hexData = {
            hex_id: hex_id,
            description: description,
            hex_cartesian: hex_cartesian,
            axial_coordinates: axial_coordinates,
            terrain_type: terrain_type,
            state_hash: state_hash,
            timestamp: timestamp,
            buildings: buildings,
            sprite: sprite,
            movement_cost: movement_cost
        };

        // Add coordinate text to the hexagon for debugging
        if (0) {
            // Create text for coordinates
            const coordText = new PIXI.Text(`${axial_coordinates.q},${axial_coordinates.r}`, {
                fontFamily: 'Arial',
                fontSize: 8,
                fill: 0x000000
            });
            coordText.anchor.set(0.5);
            coordText.position.set(0, 0);

            // Add the coordinate text to the hexagon
            hexagon.addChild(coordText);
        }

        // Add the hexagon to the container
        hexContainer.addChild(hexagon);
    });

    console.log("Displaying Hex Grid");
}

// Function to set the grid hash value
function setGridHash(hash) {
    gridHash = hash;
}

// Function to update a specific hexagon in the grid
function updateHex(hexData) {
    const { hex_id, hex_cartesian, terrain_type, state_hash } = hexData;

    // Find the hexagon in the container by its hex_id
    const hexagon = hexContainer.children.find(child => child.hexData.hex_id === hex_id);

    if (hexagon) {
        // Update the hexagon's properties
        hexagon.hexData = hexData;

        // Clear the existing graphics and redraw the hexagon with the new terrain type
        hexagon.clear();
        hexagon.beginFill(terrainTypes[terrain_type]);
        hexagon.lineStyle(1, 0x000000, 0.2);
        hexagon.drawPolygon([
            -hexRadius, 0,
            -hexRadius / 2, hexHeight / 2,
            hexRadius / 2, hexHeight / 2,
            hexRadius, 0,
            hexRadius / 2, -hexHeight / 2,
            -hexRadius / 2, -hexHeight / 2
        ]);
        hexagon.endFill();

        // Update the grid hash
        gridHash += state_hash;
        console.log(`Updated grid hash: ${gridHash}`);
    }
}