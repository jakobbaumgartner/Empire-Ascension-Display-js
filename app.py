from flask import Flask, render_template
from flask_socketio import SocketIO
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app)

# Add a variable to store the server start time
server_start_time = time.time()

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

if __name__ == '__main__':
    socketio.run(app, debug=True)