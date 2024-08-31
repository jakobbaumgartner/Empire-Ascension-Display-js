// Create a new PIXI loader instance
const loader = new PIXI.Loader();

// Create a Map to store battle units
const battleUnits = new Map();

// Function to load and parse the JSON file
async function loadBattleUnits() {
    try {
        // Fetch the JSON file
        const response = await fetch('battleUnits.json');
        const data = await response.json();

        // Iterate over each unit in the JSON file
        data.units.forEach((unit) => {
            // Add each soldier image to the loader
            loader.add(unit.unit_id, `${unit.unit_id}.png`);

            // Store unit data in the Map
            battleUnits.set(unit.unit_id, unit);
        });

        // Start loading the resources
        loader.load((loader, resources) => {
            console.log("All units loaded successfully");
            console.log(battleUnits)
            // You can now use the resources and battleUnits Map as needed
        });
    } catch (error) {
        console.error('Error loading battle units:', error);
    }
}

// Call the function to load battle units
loadBattleUnits();
