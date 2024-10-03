import heapq
import math

def heuristic(a, b, hex_grid, use_heuristic=False):
    if not use_heuristic:
        return 0
    # Euclidean distance weighted by average movement cost
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    distance = math.sqrt(dx**2 + dy**2)
    
    # Get movement costs for both hexes
    a_cost = hex_grid[f"{a[0]},{a[1]}"]["movement_cost"]
    b_cost = hex_grid[f"{b[0]},{b[1]}"]["movement_cost"]
    
    # Use average movement cost as a weight
    avg_cost = (a_cost + b_cost) / 2
    
    return distance * avg_cost


def get_neighbors(hex_grid, q, r):
    directions = [
        (1, -1), (1, 0), (0, 1),
        (-1, 1), (-1, 0), (0, -1)
    ]
    neighbors = []
    for dq, dr in directions:
        neighbor_q, neighbor_r = q + dq, r + dr
        neighbor_id = f"{neighbor_q},{neighbor_r}"
        if neighbor_id in hex_grid:
            neighbors.append((neighbor_q, neighbor_r))
    return neighbors

def pathfinding(hex_grid, start, goal, use_heuristic=True):
    start_q, start_r = start
    goal_q, goal_r = goal

    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal, hex_grid, use_heuristic)}

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            path = []
            total_cost = 0
            while current in came_from:
                path.append(current)
                total_cost += hex_grid[f"{current[0]},{current[1]}"]["movement_cost"]
                current = came_from[current]
            path.append(start)
            path.reverse()
            print(f"Total path cost: {total_cost}")
            return path

        for neighbor in get_neighbors(hex_grid, *current):
            movement_cost = hex_grid[f"{neighbor[0]},{neighbor[1]}"]["movement_cost"]
            tentative_g_score = g_score[current] + movement_cost
            if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = tentative_g_score + heuristic(neighbor, goal, hex_grid, use_heuristic)
                if neighbor not in [i[1] for i in open_set]:
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))

    return None  # No path found

# Example usage:
# For Dijkstra: pathfinding(hex_grid, start, goal, use_heuristic=False)
# For A*: pathfinding(hex_grid, start, goal, use_heuristic=True)
