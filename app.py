from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import threading
from logic.HexagonalMap import HexagonalMap 
from logic.pathfinding import pathfinding
from logic.line_interpolation import line_interpolation


app = Flask(__name__)
socketio = SocketIO(app)

# Add a variable to store the server start time
server_start_time = time.time()

# Instantiate the HexagonalMap class and generate the map
hex_map_instance = HexagonalMap()
hex_map = hex_map_instance.generate_hexagonal_map()

# Array of roads
roads_list = {}

# Route to serve the main page
@app.route('/')
def index():
    print("Client connected to index")
    return render_template('gridhex.html')

# Function to send the server time to the client
def send_server_time():
    while True:
        elapsed_time = time.time() - server_start_time
        socketio.emit('server_time', {'time': elapsed_time})
        # print("Sent server time to client")
        socketio.sleep(0.1)  # 100ms interval

# Function to handle the ping event from the client
@socketio.on('ping')
def handle_ping(client_time):
    # print("Client pinged")
    return time.time() - server_start_time

# Start a new thread to continuously send the server's elapsed time to the client
@socketio.on('connect')
def handle_connect():
    threading.Thread(target=send_server_time).start()
    print("Client connected")
# Function to handle the getGrid event from the client, sends the hex map to the client
@socketio.on('getGrid')
def handle_get_grid():
    # Convert hex_map to a list of its values
    hex_map_list = list(hex_map.values())
    print("Sending grid data to client")
    socketio.emit('gridData', hex_map_list)


# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, debug=True)