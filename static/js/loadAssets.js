// Create a new PIXI loader instance
const loader = new PIXI.Loader();

// Create a Map to store battle units
const battleUnits = new Map();

// Function to load and parse the JSON file
async function loadBattleUnits() {
    try {
        // Fetch the JSON file from the correct path
        const response = await fetch('/static/json/battleUnits.json');
        const data = await response.json();

        // Iterate over each unit in the JSON file
        data.units.forEach((unit) => {
            // Add each soldier image to the loader with the correct path
            loader.add(unit.unit_id, `/static/images/${unit.unit_id}.png`);

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
loadBattleUnits().then(() => {
    if (1) {
        const unitContainer = document.getElementById('unitContainer');

        // Create an empty card for deselection
        const emptyCard = document.createElement('div');
        emptyCard.classList.add('unit-card', 'unselectable');
        emptyCard.id = 'card-empty';
        emptyCard.style.display = 'flex';
        emptyCard.style.alignItems = 'center';
        emptyCard.style.justifyContent = 'center';
        
        // Create a clear title element
        const clearTitle = document.createElement('div');
        clearTitle.classList.add('unit-name');
        clearTitle.textContent = 'Clear';
        
        // Append the clear title to the empty card
        emptyCard.appendChild(clearTitle);
        
        // Add a click event listener to the empty card
        emptyCard.addEventListener('click', function() {
            console.log(selectedObject)
            console.log('Clear selection.');
            if (selectedObject.object_type == 'soldier')
            {
                deselectSoldier(selectedObject.object_element)
            }
            selectedObject.object_id = null;
            selectedObject.object_type = null;
            emptyStats();
        });
        
        // Append the empty card to the unit container
        unitContainer.appendChild(emptyCard);
        
        // Display the battle units in the unit container
        battleUnits.forEach((unit) => {
            // Create a unit card
            const unitCard = document.createElement('div');
            unitCard.classList.add('unit-card');
            unitCard.classList.add('unselectable')
            unitCard.id = ('card-'+unit.unit_id);

            // Create an image element for the unit with the correct path
            const unitImage = document.createElement('img');
            unitImage.src = `/static/images/${unit.unit_id}.png`;
            unitImage.alt = unit.unit_name;
            unitImage.style.height = '65px';

            // Create a div element for the unit name
            const unitName = document.createElement('div');
            unitName.classList.add('unit-name');
            unitName.textContent = unit.unit_name;

            // Create a div element for the unit cost
            const unitCost = document.createElement('div');
            unitCost.classList.add('unit-cost');
            unitCost.textContent = `Cost: ${unit.unit_cost} $`;

            // Create a div element for the monthly expense
            const monthlyExpense = document.createElement('div');
            monthlyExpense.classList.add('unit-cost');
            monthlyExpense.textContent = `Monthly: ${unit.unit_monthly} $`;

            // Append the elements to the unit card
            unitCard.appendChild(unitImage);
            unitCard.appendChild(unitName);
            unitCard.appendChild(unitCost);
            unitCard.appendChild(monthlyExpense);

            // Add a click event listener to the unit card
            unitCard.addEventListener('click', function() {

                // If selected soldier, deselect it first
                if (selectedObject.object_type == 'soldier')
                    {
                        deselectSoldier(selectedObject.object_element)
                    }
                console.log(unit.unit_id);
                selectedObject.object_id = unit.unit_id;
                selectedObject.object_type = 'new_unit';

                // Display unit stats in right menu
                displayUnitStats(unit) 
            });

            unitContainer.appendChild(unitCard);
        });
    }
});