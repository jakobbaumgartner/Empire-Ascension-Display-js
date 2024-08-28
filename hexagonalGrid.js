// hexagonalGrid.js

const hexRadius = 15;
const hexHeight = hexRadius * Math.sqrt(3);
const hexWidth = hexRadius * 2;

const gridWidth = 250;
const gridHeight = 100;

const terrainTypes = {
    water: 0x5B99C2,
    beach: 0xF9DBBA,
    grass: 0xCBE2B5,
    forest: 0x86AB89,
    mountain: 0xA28B55
};

const noise = new SimplexNoise();

function getTerrainType(noiseValue) {
    if (noiseValue < -0.3) return 'water';
    if (noiseValue < -0.1) return 'beach';
    if (noiseValue < 0.2) return 'grass';
    if (noiseValue < 0.5) return 'forest';
    return 'mountain';
}

function createHexagon(x, y, i, j, k) {
    const hexagon = new PIXI.Graphics();
    const noiseValue = noise.noise2D(i * 0.05, j * 0.05);
    const terrain = getTerrainType(noiseValue);
    hexagon.beginFill(terrainTypes[terrain]);
    hexagon.lineStyle(1, 0x000000);
    hexagon.drawPolygon([
        -hexRadius, 0,
        -hexRadius / 2, hexHeight / 2,
        hexRadius / 2, hexHeight / 2,
        hexRadius, 0,
        hexRadius / 2, -hexHeight / 2,
        -hexRadius / 2, -hexHeight / 2
    ]);
    hexagon.endFill();
    hexagon.x = x;
    hexagon.y = y;
    hexagon.i = i;
    hexagon.j = j;
    hexagon.k = k;
    hexagon.terrain = terrain;

    hexagon.interactive = true;
    hexagon.buttonMode = true;
    hexagon.clicked = false;

    return hexagon;
}

function createHexagonalGrid(hexContainer) {
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            const x = col * hexWidth * 0.75;
            const y = row * hexHeight + (col % 2) * (hexHeight / 2);
            const i = col;
            const j = row - Math.floor(col / 2);
            const k = -i - j;
            const hexagon = createHexagon(x, y, i, j, k);
            hexContainer.addChild(hexagon);
        }
    }
}
