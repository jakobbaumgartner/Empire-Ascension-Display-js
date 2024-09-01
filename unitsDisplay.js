// Add close or open bottom menu event
const toggleBtn = document.getElementById('unitToggleBtn');
const unitContainer = document.getElementById('unitContainer');

    toggleBtn.addEventListener('click', function() {
        if (unitContainer.style.transform === 'translateY(165px)') {
            unitContainer.style.transform = 'translateY(0)';
            toggleBtn.style.top = '-15px';
            toggleBtn.classList.remove('up');
            toggleBtn.classList.add('down');
        } else {
            unitContainer.style.transform = 'translateY(165px)';
            toggleBtn.style.top = '-15px';
            toggleBtn.classList.remove('down');
            toggleBtn.classList.add('up');
        }
    });

// Add close or open right menu event 
const selectionToggleBtn = document.getElementById('selectionToggleBtn');
const selectionContainer = document.getElementById('selectionContainer');

selectionToggleBtn.addEventListener('click', function() {
    if (selectionContainer.style.transform === 'translateX(265px)') {
        selectionContainer.style.transform = 'translateX(0)';
        selectionToggleBtn.style.left = '-15px';
        selectionToggleBtn.classList.remove('left');
        selectionToggleBtn.classList.add('right');
    } else {
        selectionContainer.style.transform = 'translateX(265px)';
        selectionToggleBtn.style.left = '-15px';
        selectionToggleBtn.classList.remove('right');
        selectionToggleBtn.classList.add('left');
    }
});