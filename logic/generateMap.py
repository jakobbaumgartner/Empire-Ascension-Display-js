import math
from noise import pnoise2
import time

# Constants for hexagon dimensions
hex_radius = 15
hex_height = hex_radius * math.sqrt(3)
hex_width = hex_radius * 2

# Grid dimensions in terms of the number of hexagons
grid_width = 250
grid_height = 100

# Color codes for different terrain types
terrain_types = {
    'water': 0x5B99C2,
    'beach': 0xF9DBBA,
    'grass': 0xCBE2B5,
    'forest': 0x86AB89,
    'mountain': 0xA28B55
}

movement_costs = {
    'water': 10,
    'beach': 1,
    'grass': 3,
    'forest': 5,
    'mountain': 8,
    'road': 0.5
}

terrain_descriptions = {
    'water': "Slows movement significantly unless you have a boat or specialized unit.",
    'beach': "Easy to traverse, allowing quick movement along the shoreline with no obstacles.",
    'grass': "Flat terrain that enables fast and efficient movement across open fields.",
    'forest': "Dense trees slow down movement, but provide good cover and concealment.",
    'mountain': "Difficult terrain to traverse, but offers strategic high ground and defensive benefits."
}

def oddq_to_axial(col, row):
    q = col
    r = row - (col - (col & 1)) // 2
    return q, r, -q - r

def oddq_offset_to_pixel(col, row):
    x = hex_radius * 3/2 * col
    y = hex_radius * math.sqrt(3) * (row + 0.5 * (col & 1))
    return x, y

def get_terrain_type(noise_value):
    if noise_value < -0.3:
        return 'water'
    if noise_value < -0.1:
        return 'beach'
    if noise_value < 0.2:
        return 'grass'
    if noise_value < 0.5:
        return 'forest'
    return 'mountain'

def generate_hexagonal_map():
    print("Generating hexagonal map...")
    hex_grid = {}

    for col in range(grid_width):
        for row in range(grid_height):
            q, r, s = oddq_to_axial(col, row)
            x, y = oddq_offset_to_pixel(col, row)
            noise_value = pnoise2(q * 0.05, r * 0.05)
            terrain = get_terrain_type(noise_value)
            hex_id = f"{q},{r}"

            hex_data = {
                'hex_id': hex_id,
                'description': terrain_descriptions[terrain],
                'hex_cartesian': {'x': x, 'y': y},
                'axial_coordinates': {'q': q, 'r': r, 's': s},
                'terrain_type': terrain,
                'state_hash': None,
                'timestamp': time.time(),
                'buildings': [],
                'sprite': None,
                'movement_cost': movement_costs[terrain]
            }

            hex_grid[hex_id] = hex_data

    return hex_grid