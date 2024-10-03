from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import threading
from logic.generateMap import generate_hexagonal_map, movement_costs
from logic.pathfinding import pathfinding


app = Flask(__name__)
socketio = SocketIO(app)

# Add a variable to store the server start time
server_start_time = time.time()

# Generate the hexagonal map once at server start
hex_map = generate_hexagonal_map()

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

# Function to handle the findPath event from the client, send path to client
@socketio.on('findPath')
def handle_find_path(data):
    start = (data['start']['q'], data['start']['r'])
    goal = (data['goal']['q'], data['goal']['r'])
    path = pathfinding(hex_map, start, goal)
    socketio.emit('pathFound', {'path': path})
    print(f"Generated path from {start} to {goal}")

@socketio.on('placeRoad')
def handle_place_road(data):
    # Extract the coordinates and road ID from the received data
    coordinates = data['coordinates']
    roadId = data['roadId']
    
    # Log the information in the terminal
    print(f"Placing road with ID '{roadId}' at coordinates {coordinates}")
    
    # Add road to the roads list or perform other logic as needed
    print(coordinates)
    # Extract q and r values
    q_value = coordinates['q']
    r_value = coordinates['r']
    # Build the key string in the format 'q_value,r_value'
    key = f"{q_value},{r_value}"
    # Get element from hex_map using the key
    element = hex_map.get(key)

    # Append road type to hex buildings list
    element['buildings'].append(roadId)
    element['movement_cost'] = movement_costs['road'];
    print(element)

    # Emit the updated grid data to the client
    socketio.emit('gridData', list(hex_map.values()))

    



# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, debug=True)