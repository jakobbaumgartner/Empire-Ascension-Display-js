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

// Create a Simplex noise generator instance
const noise = new SimplexNoise();

// Function to determine the terrain type based on noise value
function getTerrainType(noiseValue) {
    if (noiseValue < -0.3) return 'water'; // If noise value is less than -0.3, it's water
    if (noiseValue < -0.1) return 'beach'; // If noise value is less than -0.1, it's beach
    if (noiseValue < 0.2) return 'grass'; // If noise value is less than 0.2, it's grass
    if (noiseValue < 0.5) return 'forest'; // If noise value is less than 0.5, it's forest
    return 'mountain'; // Otherwise, it's a mountain
}

// Function to create a hexagon graphic at a given position with axial coordinates (i, j, k)
function createHexagon(x, y, i, j, k, terrain) {
    const hexagon = new PIXI.Graphics(); // Create a new PIXI Graphics object for the hexagon
    // const noiseValue = noise.noise2D(i * 0.05, j * 0.05); // Get noise value based on position
    // const terrain = getTerrainType(noiseValue); // Determine terrain type based on noise value

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
    hexagon.terrain = terrain; // Store the terrain type for the hexagon

    // Make the hexagon interactive and set its initial clicked state to false
    hexagon.interactive = true;
    hexagon.buttonMode = true; // Change cursor on hover to indicate interactivity
    hexagon.clicked = false;

    return hexagon; // Return the created hexagon
}

// Function to create a hexagonal grid data structure
function createHexagonalGridData() {
    const hexGrid = new Map();

    // Loop through each row and column to create hexagons
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            // Calculate the position of the hexagon
            const x = col * hexWidth * 0.75; // Horizontal position with 75% overlap for adjacent columns
            const y = row * hexHeight + (col % 2) * (hexHeight / 2); // Vertical position with offset for staggered rows
            // Calculate the axial coordinates (i, j, k)
            const i = col;
            const j = row - Math.floor(col / 2);
            const k = -i - j;

            // Get noise value and terrain type for the hexagon
            const noiseValue = noise.noise2D(i * 0.05, j * 0.05); // Get noise value based on position
            const terrain = getTerrainType(noiseValue); // Determine terrain type based on noise value

            // Create a unique hex_id or use i,j,k coordinates as an identifier
            const hex_id = `${i},${j},${k}`;

            // Example data for each hexagon
            const hexData = {
                hex_id: hex_id,
                hex_cartesian: { x, y }, // Store the cartesian coordinates,
                axial_coordinates: { i, j, k }, // Store the axial coordinates
                terrain_type: terrain, // Store the terrain type
                state_hash: null, // Placeholder for state_hash
                timestamp: Date.now(), // Example timestamp
                buildings: [] // Placeholder for buildings, can be an array
            };

            // Store the hexData in the map
            hexGrid.set(`${i},${j}`, hexData);
        }
    }

    return hexGrid;
}

// Function to display the hexagonal grid on the screen
function displayHexagonalGrid(hexContainer, hexGrid) {
    hexGrid.forEach((hexData, key) => {
        i = hexData.axial_coordinates.i;
        j = hexData.axial_coordinates.j;
        k = hexData.axial_coordinates.k;

        x = hexData.hex_cartesian.x;
        y = hexData.hex_cartesian.y;

        terrain = hexData.terrain_type;        

        // Create the hexagon
        const hexagon = createHexagon(x, y, i, j, k, terrain);

        // Add the hexagon to the container
        hexContainer.addChild(hexagon);
    });
}

