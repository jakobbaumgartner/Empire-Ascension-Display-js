import math
from noise import pnoise2
import time
import random


class HexagonalMap:
    def __init__(self, grid_width=250, grid_height=100, hex_radius=15):
        self.hex_radius = hex_radius
        self.hex_height = self.hex_radius * math.sqrt(3)
        self.hex_width = self.hex_radius * 2
        self.grid_width = grid_width
        self.grid_height = grid_height

        self.hex_grid = {}
        self.grid_hash = 0000;

        self.terrain_types = {
            'water': 0x5B99C2,
            'beach': 0xF9DBBA,
            'grass': 0xCBE2B5,
            'forest': 0x86AB89,
            'mountain': 0xA28B55,
            'road': 0x000000
        }

        self.movement_costs = {
            'water': 10,
            'beach': 1,
            'grass': 3,
            'forest': 5,
            'mountain': 8,
            'road': 0.25
        }

        self.terrain_descriptions = {
            'water': "Slows movement significantly unless you have a boat or specialized unit.",
            'beach': "Easy to traverse, allowing quick movement along the shoreline with no obstacles.",
            'grass': "Flat terrain that enables fast and efficient movement across open fields.",
            'forest': "Dense trees slow down movement, but provide good cover and concealment.",
            'mountain': "Difficult terrain to traverse, but offers strategic high ground and defensive benefits.",
            'road': "Provides the fastest and most efficient movement for units."
        }

    def oddq_to_axial(self, col, row):
        q = col
        r = row - (col - (col & 1)) // 2
        return q, r, -q - r

    def oddq_offset_to_pixel(self, col, row):
        x = self.hex_radius * 3/2 * col
        y = self.hex_radius * math.sqrt(3) * (row + 0.5 * (col & 1))
        return x, y

    def get_terrain_type(self, noise_value):
        if noise_value < -0.3:
            return 'water'
        if noise_value < -0.1:
            return 'beach'
        if noise_value < 0.2:
            return 'grass'
        if noise_value < 0.5:
            return 'forest'
        return 'mountain'
    
    # def update_hex(self, hex_id, new_data):
        

    def generate_hexagonal_map(self):
        print("Generating hexagonal map...")

        for col in range(self.grid_width):
            for row in range(self.grid_height):
                q, r, s = self.oddq_to_axial(col, row)
                x, y = self.oddq_offset_to_pixel(col, row)
                noise_value = pnoise2(q * 0.05, r * 0.05)
                terrain = self.get_terrain_type(noise_value)
                hex_id = f"{q},{r}"

                hex_data = {
                    'hex_id': hex_id,
                    'description': self.terrain_descriptions[terrain],
                    'hex_cartesian': {'x': x, 'y': y},
                    'axial_coordinates': {'q': q, 'r': r, 's': s},
                    'terrain_type': terrain,
                    'state_hash': None,
                    'timestamp': time.time(),
                    'buildings': [],
                    'sprite': None,
                    'movement_cost': self.movement_costs[terrain]
                }

                self.hex_grid[hex_id] = hex_data
        
        self.grid_hash = random.randint(1000, 9999)

        return self.hex_grid
    
    # Function to update the terrain type of a hex
    def update_hex(self, hex_id, terrain_type):
        hex_data = self.hex_grid[hex_id]
        hex_data['description'] = self.terrain_descriptions[terrain_type]
        hex_data['terrain_type'] = terrain_type
        hex_data['movement_cost'] = self.movement_costs[terrain_type]
        hex_data['timestamp'] = time.time()

        # Generate a new state hash for the hex
        hex_data['state_hash'] = random.randint(1000, 9999)
        self.grid_hash = self.grid_hash + hex_data['state_hash']

        return hex_data
        

# Example usage
hex_map = HexagonalMap()
hex_grid = hex_map.generate_hexagonal_map()