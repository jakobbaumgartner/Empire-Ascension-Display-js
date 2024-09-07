// Create a new Map to store the trajectories
const listOfTrajectories = new Map();

// Function to add a trajectory to the list of trajectories
function addTrajectory(key, trajectory) {
    listOfTrajectories.set(key, trajectory);
    console.log(listOfTrajectories);
}

// Function to get a trajectory from the list of trajectories
function getTrajectory(key) {
    const trajectory = listOfTrajectories.get(key);
    console.log(trajectory);
    console.log(listOfTrajectories);
    return trajectory;

}

// Function to remove a trajectory from the list of trajectories
function removeTrajectory(key) {
    listOfTrajectories.delete(key);
    console.log(listOfTrajectories);

}

// Function to update the trajectory of a soldier
function updateTrajectory(key, changes) {
    const trajectory = getTrajectory(key)

    if (changes.hasOwnProperty('trajectory')) {
        trajectory.trajectory = changes.trajectory;
    }

    if (changes.hasOwnProperty('flag_sprite')) {
        trajectory.flag_sprite = changes.flag_sprite;
    }

    if (changes.hasOwnProperty('soldier_sprite')) {
        trajectory.soldier_sprite = changes.soldier_sprite;
    }

    addTrajectory(key, trajectory);

    console.log(listOfTrajectories);

}




