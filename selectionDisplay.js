var selected = null;

function displayUnitStats(unit) {
    console.log(unit);
    // Display unit stats
    const statsDisplay = document.getElementById('selectionContainerContentInner');

    // Clear the stats display
    statsDisplay.innerHTML = '';

    // Add the unit picture
    const unitImage = document.createElement('img');
    unitImage.classList.add('selection-container-image');
    unitImage.src = `${unit.unit_id}.png`;
    unitImage.alt = unit.unit_name;
    unitImage.style.height = '150px';
    unitImage.style.display = 'block';
    unitImage.style.margin = '0 auto';
    statsDisplay.appendChild(unitImage);

    // Add the unit name
    // Add the unit name
    const unitName = document.createElement('div');
    unitName.classList.add('unit-name');
    unitName.textContent = unit.unit_name;
    unitName.style.textAlign = 'center'; // Center align the unit name
    statsDisplay.appendChild(unitName);

    // Add the unit cost


}
    



  