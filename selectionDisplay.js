var selected = null;

// JavaScript function
function displayUnitStats(unit) {
    const statsDisplay = document.getElementById('selectionContainerContentInner');
    statsDisplay.innerHTML = '';

    const unitImage = document.createElement('img');
    unitImage.classList.add('unit-image');
    unitImage.src = `${unit.unit_id}.png`;
    unitImage.alt = unit.unit_name;
    statsDisplay.appendChild(unitImage);

    const unitName = document.createElement('h2');
    unitName.classList.add('unit-name');
    unitName.textContent = unit.unit_name;
    statsDisplay.appendChild(unitName);

    const unitDescription = document.createElement('p');
    unitDescription.classList.add('unit-description');
    unitDescription.textContent = unit.unit_description;
    statsDisplay.appendChild(unitDescription);

    const statsList = document.createElement('ul');
    statsList.classList.add('stats-list');

    const stats = [
        { label: 'Type', value: unit.unit_type },
        { label: 'Level', value: unit.unit_level },
        { label: 'Health', value: unit.unit_health },
        { label: 'Armor', value: unit.unit_armor },
        { label: 'Damage', value: unit.unit_damage },
        { label: 'Speed', value: unit.unit_speed },
        { label: 'Attack Range', value: unit.unit_attack_range },
        { label: 'Cost', value: `${unit.unit_cost} (${unit.unit_monthly} monthly)` }
    ];

    stats.forEach(stat => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="stat-label">${stat.label}:</span> <span class="stat-value">${stat.value}</span>`;
        statsList.appendChild(listItem);
    });

    statsDisplay.appendChild(statsList);
}

