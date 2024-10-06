const socket = io(); // Initialize socket.io (default to web host of page)

let lastServerTime = 0; // Variable to store the last received server time
let latency = 0; // Variable to store the calculated latency

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
    const { gridData, gridHash } = data;
    displayHexagonalGrid(hexContainer, gridData); // Pass the received data directly to displayHexagonalGrid
    setGridHash(gridHash); // Store the hash
    console.log('Received grid hash:', gridHash);
    g
});

// Log when connected to the server
socket.on('connect', () => {
    console.log('Connected to server');
    requestGridData(); // Request the grid data upon connection
});

// Listener for 'updateHex' event to update a specific hexagon
socket.on('updateHex', (data) => {
    console.log('Received update for hex:', data);
    updateHex(data); // Call the updateHex function with the received data
});

let syncCountdown = 0;
let syncInterval = null;

// Function to request the grid hash from the server
function requestGridHash() {
    socket.emit('getGridHash');
}

// Listener for 'gridHash' event to receive the grid hash from the server
socket.on('gridHash', (data) => {
    console.log('Received grid hash:', data.gridHash, 'Client grid hash:', gridHash, 'Sync countdown:', syncCountdown);
    const serverGridHash = data.gridHash;
    if (serverGridHash !== gridHash) {
        console.log('Grid hashes are out of sync');
        if (syncCountdown === 0) {
            syncCountdown = 3; // Start a 3-second countdown
            syncInterval = setInterval(() => {
                syncCountdown -= 0.5;
                console.log(`Grid sync countdown: ${syncCountdown} seconds`);
                if (syncCountdown <= 0) {
                    clearInterval(syncInterval);
                    syncCountdown = 0;
                    console.log('Requesting full grid data from server');
                    requestGridData(); // Request the entire grid data from the server
                }
            }, 500);
        } 
    } else {
        if (syncCountdown > 0) {
            clearInterval(syncInterval);
            syncCountdown = 0;
            console.log('Grid hashes are back in sync');
        }
    }
});

// Request the grid hash from the server every 5 seconds
setInterval(requestGridHash, 5000);
