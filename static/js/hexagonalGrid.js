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
            showHexagonPopup(event.data.originalEvent, hexData.hex_id); // Show the hexagon popup
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

var hexGrid = new Map(); // Initialize the hex grid data structure

// Function to create a hexagonal grid data structure
function createHexagonalGridData(gridData) {
    console.log("Creating Hex Grid Data");
    hexGrid.clear(); // Clear the global hexGrid to ensure it's empty before populating

    // Loop through each hexagon data from the server
    gridData.forEach(hexData => {
        const { hex_id, description, hex_cartesian, axial_coordinates, terrain_type, state_hash, timestamp, buildings, sprite, movement_cost } = hexData;

        // Create a new hexData object with the received data
        const newHexData = {
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

        // Store the newHexData in the map
        hexGrid.set(hex_id, newHexData);
    });

    return hexGrid;
}

// Function to show the popup with hexagon specs
function showHexagonPopup(event, hexId) {
    console.log(hexId)
    const hexData = hexGrid.get(hexId); // Fetch data from hexGrid using hexId
    console.log(hexData)
    const popup = document.createElement('div');
    popup.className = 'hex-popup';
    popup.innerHTML = `
    <div class="hex-popup-inner">
        <div class="hex-popup-content">
            <img src="static/images/${hexData.terrain_type}.webp" alt="Hexagon Info" class="hex-popup-full-height-image">
            <div class="hex-popup-text">
                <div class="hex-popup-title"><strong>Terrain type:</strong> ${hexData.terrain_type}</div>
                <div class="hex-popup-item"><strong>Description:</strong> ${hexData.description}</div>
                <div class="hex-popup-item"><strong>Axial coordinates:</strong> [q: ${hexData.axial_coordinates.q}, r: ${hexData.axial_coordinates.r}]</div>
                <div class="hex-popup-item"><strong>Cartesian coordinates:</strong> [x: ${hexData.hex_cartesian.x.toFixed(2)}, y: ${hexData.hex_cartesian.y.toFixed(2)}]</div>
                <div class="hex-popup-item"><strong>Movement cost:</strong> ${hexData.movement_cost}</div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(popup);

    // Position the popup next to the mouse cursor
    popup.style.left = `${event.clientX + 10}px`;
    popup.style.top = `${event.clientY + 10}px`;
}

// Function to hide the popup
function hideHexagonPopup() {
    const popup = document.querySelector('.hex-popup');
    if (popup) {
        popup.remove();
    }
}

// Function to display the hexagonal grid on the screen
function displayHexagonalGrid(hexContainer, hexGrid) {
    console.log(hexGrid)
    console.log("Displaying Hex Grid")
    hexGrid.forEach((hexData, key) => {
        const { q, r, s } = hexData.axial_coordinates;
        const { x, y } = hexData.hex_cartesian;
        var terrain = hexData.terrain_type;
        const buildings = hexData.buildings

        if (buildings && buildings.includes('road')) {
            console.log(`Road found at (${q}, ${r}, ${s})`); // Log the road position
            terrain = 'road'; // Set the terrain type to 'road' for hexagons with roads
        }

        // Create the hexagon (function needs to use the x, y positions and other properties)
        const hexagon = createHexagon(x, y, hexData);

        // Store the hexagon sprite in the hexData object
        hexData.sprite = hexagon;

        // Add coordinate text to the hexagon for debugging
        if (0) {
            // Create text for coordinates
            const coordText = new PIXI.Text(`${q},${r}`, {
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
}

