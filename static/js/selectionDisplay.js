var selected = null;

// JavaScript function
function displayUnitStats(unit) {
    const statsDisplay = document.getElementById('selectionContainerContentInner');
    statsDisplay.innerHTML = '';

    const unitImage = document.createElement('img');
    unitImage.classList.add('unit-image');
    unitImage.src = `/static/images/${unit.unit_id}.png`;
    unitImage.alt = unit.unit_name;
    statsDisplay.appendChild(unitImage);

    const unitName = document.createElement('h2');
    unitName.classList.add('unit-name');
    unitName.textContent = unit.unit_name;
    statsDisplay.appendChild(unitName);

    const unitDescription = document.createElement('p');
    unitDescription.classList.add('unit-description');
    unitDescription.textContent = unit.unit_description;
    statsDisplay.appendChild(unitDescription);

    const statsList = document.createElement('ul');
    statsList.classList.add('stats-list');

    const stats = [
        { label: 'Type', value: unit.unit_type },
        { label: 'Level', value: unit.unit_level },
        { label: 'Health', value: unit.unit_health },
        { label: 'Armor', value: unit.unit_armor },
        { label: 'Damage', value: unit.unit_damage },
        { label: 'Speed', value: unit.unit_speed },
        { label: 'Attack Range', value: unit.unit_attack_range },
        { label: 'Cost', value: `${unit.unit_cost} (${unit.unit_monthly} monthly) <span style="color: orange; font-weight: bold;">₿</span>` }
    ];

    stats.forEach(stat => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="stat-label">${stat.label}:</span> <span class="stat-value">${stat.value}</span>`;
        statsList.appendChild(listItem);
    });

    statsDisplay.appendChild(statsList);
}

function displayRoadStats() {
    const statsDisplay = document.getElementById('selectionContainerContentInner');
    statsDisplay.innerHTML = '';

    const terrainType = 'road';  // Defining a static terrain type for roads

    // Road image placeholder. Ensure you have an image named 'road.webp'.
    const roadImage = document.createElement('img');
    roadImage.classList.add('unit-image');
    roadImage.src = `/static/images/road.png`;
    roadImage.style.width = '100%';
    roadImage.style.borderRadius = '8px';
    roadImage.style.objectFit = 'cover';
    roadImage.alt = 'Road image';
    statsDisplay.appendChild(roadImage);

    // Road description
    const roadDescription = document.createElement('p');
    roadDescription.classList.add('unit-description');
    roadDescription.textContent = 'Roads provide fast and efficient travel, connecting various places smoothly.';
    statsDisplay.appendChild(roadDescription);

    const statsList = document.createElement('ul');
    statsList.classList.add('stats-list');

    const stats = [
        { label: 'Terrain', value: capitalizeFirstLetter(terrainType) },
        { 
            label: 'Cost', 
            value: '100 (5 monthly) <span style="color: orange; font-weight: bold;">₿</span>' 
        }

        // Add any additional road-specific stats here if needed.
    ];

    stats.forEach(stat => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="stat-label">${stat.label}:</span> <span class="stat-value">${stat.value}</span>`;
        statsList.appendChild(listItem);
    });

    statsDisplay.appendChild(statsList);
}


function displayHexagonStats(hexagon) {
    const statsDisplay = document.getElementById('selectionContainerContentInner');
    statsDisplay.innerHTML = '';

    const hexagonData = hexagon;

    if (!hexagonData) {
        console.error('No hexagon data found');
        return;
    }

    // Hexagon Image (placeholder)
    const hexImage = document.createElement('img');
    // hexImage.classList.add('hex-image');
    hexImage.classList.add('unit-image');
    hexImage.src = `/static/images/${hexagonData.terrain_type}.webp`;
    hexImage.style.width = '100%';
    hexImage.style.borderRadius = '8px';
    hexImage.style.objectFit = 'cover';
    hexImage.alt = hexagonData.terrain_type;
    statsDisplay.appendChild(hexImage);

    const statsDescription = document.createElement('p');
    statsDescription.classList.add('unit-description');
    statsDescription.textContent = hexagonData.description;
    statsDisplay.appendChild(statsDescription);

    const statsList = document.createElement('ul');
    statsList.classList.add('stats-list');

    const stats = [
        {label: 'Terrain', value: capitalizeFirstLetter(hexagonData.terrain_type) },
        { label: 'Coordinates', value: `(${hexagonData.axial_coordinates.q}, ${hexagonData.axial_coordinates.r})` },
        { label: 'Cartesian', value: `(${hexagonData.hex_cartesian.x.toFixed(2)}, ${hexagonData.hex_cartesian.y.toFixed(2)})` },
        { label: 'Buildings', value: hexagonData.buildings.length > 0 ? hexagonData.buildings.join(', ') : 'None' },
        // { label: 'Last Updated', value: new Date(hexagonData.timestamp).toLocaleString() }
    ];

    stats.forEach(stat => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="stat-label">${stat.label}:</span> <span class="stat-value">${stat.value}</span>`;
        statsList.appendChild(listItem);
    });

    statsDisplay.appendChild(statsList);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to get a color based on terrain type
function getTerrainColor(terrainType) {
    const colorMap = {
        'grass': '#7CFC00',
        'forest': '#228B22',
        'mountain': '#A9A9A9',
        'water': '#1E90FF',
        // Add more terrain types and colors as needed
    };
    return colorMap[terrainType] || '#FFFFFF';  // Default to white if terrain type is not found
}

function emptyStats()
{
    const statsDisplay = document.getElementById('selectionContainerContentInner');
    statsDisplay.innerHTML = '';
}

