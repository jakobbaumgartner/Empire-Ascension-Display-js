import heapq
import math

def heuristic(a, b, last_direction=None, new_direction=None, angle_weight=0.5):
    """Calculate the Euclidean distance with an optional penalty for changing direction."""
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    euclidean_distance = math.sqrt(dx**2 + dy**2)

    if last_direction is not None and new_direction is not None:
        # Calculate the angle-based penalty
        angle_change = math.atan2(new_direction[1], new_direction[0]) - math.atan2(last_direction[1], last_direction[0])
        angle_penalty = abs(math.sin(angle_change / 2)) * angle_weight
    else:
        angle_penalty = 0

    return euclidean_distance + angle_penalty

def get_neighbors(hex_grid, q, r):
    """Get neighboring positions on a hex grid."""
    directions = [
        (1, -1), (1, 0), (1, 1),
        (0, 1), (-1, 1), (-1, 0)
    ]
    neighbors = []
    for dq, dr in directions:
        neighbor_q, neighbor_r = q + dq, r + dr
        neighbor_id = f"{neighbor_q},{neighbor_r}"
        if neighbor_id in hex_grid:
            neighbors.append((neighbor_q, neighbor_r, dq, dr))
    return neighbors

def pathfinding(hex_grid, start, goal, use_heuristic=True, use_cost=True, angle_weight=0.5):
    """Implement the A* pathfinding algorithm with a preference for straighter paths."""
    open_set = []
    heapq.heappush(open_set, (0, start, (0, 0)))  # Include initial dummy direction
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal, angle_weight=angle_weight) if use_heuristic else 0}
    open_set_lookup = {start}
    last_direction = {start: (0, 0)}

    while open_set:
        _, current, current_direction = heapq.heappop(open_set)
        open_set_lookup.remove(current)

        if current == goal:
            # Reconstruct the path
            path = []
            total_cost = 0
            while current in came_from:
                path.append(current)
                if use_cost:
                    total_cost += hex_grid[f"{current[0]},{current[1]}"]["movement_cost"]
                current = came_from[current]
            path.append(start)
            path.reverse()
            if use_cost:
                print(f"Total path cost: {total_cost}")
            return path

        for neighbor, dq, dr in get_neighbors(hex_grid, *current):
            movement_cost = hex_grid[f"{neighbor[0]},{neighbor[1]}"]["movement_cost"] if use_cost else 1
            tentative_g_score = g_score[current] + movement_cost
            
            if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                neighbor_direction = (dq, dr)
                f_score_neighbor = tentative_g_score + (heuristic(neighbor, goal, current_direction, neighbor_direction, angle_weight) if use_heuristic else 0)
                f_score[neighbor] = f_score_neighbor
                if neighbor not in open_set_lookup:
                    heapq.heappush(open_set, (f_score_neighbor, neighbor, neighbor_direction))
                    open_set_lookup.add(neighbor)

    return None  # No path found

# Example usage:
# Use terrain cost: pathfinding(hex_grid, start, goal, use_heuristic=True, use_cost=True, angle_weight=0.5)
# Ignore terrain cost: pathfinding(hex_grid, start, goal, use_heuristic=True, use_cost=False, angle_weight=0.5)
