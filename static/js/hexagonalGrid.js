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
    mountain: 0xA28B55 // Brown color for mountains
};

// Function to create a hexagon graphic at a given position with axial coordinates (i, j, k)
function createHexagon(x, y, i, j, k, terrain) {
    const hexagon = new PIXI.Graphics(); // Create a new PIXI Graphics object for the hexagon

    // Begin drawing the hexagon with the appropriate terrain color
    hexagon.beginFill(terrainTypes[terrain]);
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
    hexagon.i = i; // Store the axial coordinate i
    hexagon.j = j; // Store the axial coordinate j
    hexagon.k = k; // Store the axial coordinate k
    // hexagon.terrain = terrain; // Store the terrain type for the hexagon

    // Make the hexagon interactive and set its initial clicked state to false
    hexagon.interactive = true;
    hexagon.buttonMode = true; // Change cursor on hover to indicate interactivity
    hexagon.clicked = false;

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

    console.log(hexGrid);
    return hexGrid;
}

// Function to display the hexagonal grid on the screen
function displayHexagonalGrid(hexContainer, hexGrid) {
    console.log(hexGrid)
    console.log("Displaying Hex Grid")
    hexGrid.forEach((hexData, key) => {
        const { q, r, s } = hexData.axial_coordinates;
        const { x, y } = hexData.hex_cartesian;
        const terrain = hexData.terrain_type;

        // Create the hexagon (function needs to use the x, y positions and other properties)
        const hexagon = createHexagon(x, y, q, r, s, terrain);

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

// Function to get the sprite of a hexagon based on its axial coordinates
function getHexagonSprite(q, r) {
    const hex_id = `${q},${r}`;
    const hexData = hexGrid.get(hex_id);
    
    if (hexData) {
        return hexData.sprite;
    }
    
    return null;
}

// -------- Hexagonal Grid Functions --------
function axial_to_oddq(hex) {
    var col = hex.q;
    var row = hex.r + (hex.q - (hex.q&1)) / 2;
    return { col, row };
}

function oddq_to_axial(hex) {
    var q = hex.col;
    var r = hex.row - (hex.col - (hex.col&1)) / 2;
    return { q, r, s: -q-r };
}

// Add this conversion function
function oddq_offset_to_pixel(hex) {
    var x = hexRadius * 3/2 * hex.col;
    var y = hexRadius * Math.sqrt(3) * (hex.row + 0.5 * (hex.col&1));
    return { x, y };
}

// Function to convert pixel coordinates to flat-top hexagon coordinates
function pixel_to_flat_hex(x, y) {
    const q = (2/3 * x) / hexRadius;
    const r = (-1/3 * x + Math.sqrt(3)/3 * y) / hexRadius;
    return axial_round({q, r});
}

// Helper function to round axial coordinates
function axial_round({q, r}) {
    let s = -q - r;
    let qi = Math.round(q);
    let ri = Math.round(r);
    let si = Math.round(s);
    
    const q_diff = Math.abs(qi - q);
    const r_diff = Math.abs(ri - r);
    const s_diff = Math.abs(si - s);
    
    if (q_diff > r_diff && q_diff > s_diff) {
        qi = -ri - si;
    } else if (r_diff > s_diff) {
        ri = -qi - si;
    } else {
        si = -qi - ri;
    }
    
    return {q: qi, r: ri, s: si};
}