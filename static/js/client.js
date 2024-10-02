const socket = io(); // Initialize socket.io (default to web host of page)

let lastServerTime = 0; // Variable to store the last received server time
let latency = 0; // Variable to store the calculated latency


function apiMove(selectedObject, hexagonTile) {
    // Move the selected object to the move goal
    console.log(selectedObject);
    console.log(hexagonTile);
}

// Function to calculate latency
function calculateLatency() {
    const startTime = Date.now();
    socket.emit('ping', startTime, (serverTime) => {
        const endTime = Date.now();
        latency = endTime - startTime;
        updateLatencyDisplay();
    });
}

// Calculate latency every 1 seconds
setInterval(calculateLatency, 1000);

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

// Log when connected to the server
socket.on('connect', () => {
    console.log('Connected to server');
});

// Log any connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});