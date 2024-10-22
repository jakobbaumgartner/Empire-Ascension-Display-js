const socket = io(); // Initialize socket.io (default to web host of page)

let lastServerTime = 0; // Variable to store the last received server time
let latency = 0; // Variable to store the calculated latency

function apiMove(start, goal) {
    // Move the selected object to the move goal
    console.log('Selected Object:', start);
    console.log('Hexagon Tile:', goal)
    socket.emit('findPath', { start: start, goal: goal });
}

// Function to display the receieved path on the map
socket.on('pathFound', (data) => {
    console.log('Received path:', data.path);
    displayPath(data.path);
});


// Function to calculate latency
function calculateLatency() {
    const startTime = Date.now();
    socket.emit('ping', startTime, (serverTime) => {
        const endTime = Date.now();
        latency = endTime - startTime;
        updateLatencyDisplay();
        
    });
}

// Calculate latency every 2 seconds
setInterval(calculateLatency, 2000);

// Function to update the latency display
function updateLatencyDisplay() {
    const latencyElement = document.getElementById('serverDelay');
    // latencyElement.textContent = `${latency} ms`;

    let dotColor;
    
    if (latency < 25) {
        dotColor = 'green';
    } else if (latency < 100) {
        dotColor = 'orange';
    } else {
        dotColor = 'red';
    }
    
    latencyElement.innerHTML = `<span style="color: ${dotColor}; font-size: 20px;">●</span> ${latency} ms`;
}

// Function to update the current time display
function updateCurrentTime(serverTime) {
    const currentTimeElement = document.getElementById('currentTime');
    const date = new Date(serverTime * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Function to request the grid data from the server
function requestGridData() {
    socket.emit('getGrid');
}

// Add event listener for all incoming socket events
socket.onAny((eventName, ...args) => {
    if (eventName !== 'server_time') {
        console.log(`Received event: ${eventName}`, args);
    }
});

// Specific listener for 'server_time' event
socket.on('server_time', (data) => {
    lastServerTime = data.time; // Save the incoming time to the variable
    updateCurrentTime(lastServerTime); // Update the time display
    // console.log('Server time:', new Date(lastServerTime * 1000).toISOString());
});

// Listener for 'gridData' event to receive the map data
socket.on('gridData', (data) => {
    console.log('Received grid data:', data);
    var hexGrid = createHexagonalGridData(data)
    displayHexagonalGrid(hexContainer, hexGrid) 
});

// Log when connected to the server
socket.on('connect', () => {
    console.log('Connected to server');
    requestGridData(); // Request the grid data upon connection
});

// Log any connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

// Send server information about new road tile placement
function placeRoad(axialCoordinates, roadId) {

    // Check if this is start or end of road
    if (!selectedObject.axial_coordinates) {
        selectedObject.axial_coordinates = axialCoordinates;
    } else {
        console.log('Existing axial coordinates:', selectedObject.axial_coordinates);
        console.log('Input axial coordinates:', axialCoordinates);

        // Emit a socket event to the server with road generation data
        socket.emit('generateRoad', {
            start: selectedObject.axial_coordinates,
            end: axialCoordinates
        });

        deselectSelectedObject()
        
    }


    console.log(selectedObject)
    // Log road placement information
    // console.log('Placing road:', roadId, 'at:', axialCoordinates);
    
    // // Emit a socket event to the server with road placement data
    // socket.emit('placeRoad', { coordinates: axialCoordinates, roadId: roadId });
}
