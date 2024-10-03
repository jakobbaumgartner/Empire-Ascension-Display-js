from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import threading
from logic.generateMap import generate_hexagonal_map
from logic.pathfinding import a_star_pathfinding


app = Flask(__name__)
socketio = SocketIO(app)

# Add a variable to store the server start time
server_start_time = time.time()

# Generate the hexagonal map once at server start
hex_map = generate_hexagonal_map()

@app.route('/')
def index():
    return render_template('gridhex.html')

def send_server_time():
    while True:
        elapsed_time = time.time() - server_start_time
        socketio.emit('server_time', {'time': elapsed_time})
        socketio.sleep(0.1)  # 100ms interval

@socketio.on('ping')
def handle_ping(client_time):
    return time.time() - server_start_time

@socketio.on('connect')
def handle_connect():
    threading.Thread(target=send_server_time).start()

@socketio.on('getGrid')
def handle_get_grid():
    # Convert hex_map to a list of its values
    hex_map_list = list(hex_map.values())
    socketio.emit('gridData', hex_map_list)

@socketio.on('findPath')
def handle_find_path(data):
    start = (data['start']['q'], data['start']['r'])
    goal = (data['goal']['q'], data['goal']['r'])
    path = a_star_pathfinding(hex_map, start, goal)
    socketio.emit('pathFound', {'path': path})


if __name__ == '__main__':
    print(hex_map)
    socketio.run(app, debug=True)