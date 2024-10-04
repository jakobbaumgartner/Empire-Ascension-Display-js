def lerp(a, b, t):
    """Linear interpolation between a and b."""
    return a + (b - a) * t

def cube_lerp(a, b, t):
    """Linearly interpolates between two hex coordinates in cube space."""
    return (lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t))

def cube_round(cube):
    """Converts float cube coordinates to the nearest hex."""
    rx, ry, rz = round(cube[0]), round(cube[1]), round(cube[2])
    x_diff = abs(rx - cube[0])
    y_diff = abs(ry - cube[1])
    z_diff = abs(rz - cube[2])

    if x_diff > y_diff and x_diff > z_diff:
        rx = -ry - rz
    elif y_diff > z_diff:
        ry = -rx - rz
    else:
        rz = -rx - ry

    return (rx, ry, rz)

def cube_distance(a, b):
    """Calculates the hex distance between two cube coordinates."""
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))

def axial_to_cube(hex):
    """Converts axial coordinates (q, r) to cube coordinates."""
    q, r = hex
    x = q
    z = r
    y = -x-z
    return (x, y, z)

def cube_to_axial(cube):
    """Converts cube coordinates to axial (q, r) coordinates."""
    x, y, z = cube
    q = x
    r = z
    return (q, r)

def line_interpolation(start, goal):
    """Generates a line of hexagons between start and goal on a hex grid."""
    # Convert axial to cube coordinates
    start_cube = axial_to_cube(start)
    goal_cube = axial_to_cube(goal)

    # Calculate distance N between start and goal
    N = cube_distance(start_cube, goal_cube)

    # Compute the line from start to goal
    results = []
    for i in range(N + 1):
        t = 1.0 / N * i
        interpolated_cube = cube_lerp(start_cube, goal_cube, t)
        rounded_cube = cube_round(interpolated_cube)
        results.append(cube_to_axial(rounded_cube))

    return results

# Example usage:
# start = (q1, r1)  # Replace with your start hex coordinates
# goal = (q2, r2)   # Replace with your goal hex coordinates
# hex_line = line_interpolation(start, goal)
# print(hex_line)
