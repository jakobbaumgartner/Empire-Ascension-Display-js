const toggleBtn = document.getElementById('unitToggleBtn');
    const unitContainer = document.getElementById('unitContainer');

    toggleBtn.addEventListener('click', function() {
        if (unitContainer.style.transform === 'translateY(135px)') {
            unitContainer.style.transform = 'translateY(0)';
            toggleBtn.style.top = '-15px';
            toggleBtn.classList.remove('up');
            toggleBtn.classList.add('down');
        } else {
            unitContainer.style.transform = 'translateY(135px)';
            toggleBtn.style.top = '-15px';
            toggleBtn.classList.remove('down');
            toggleBtn.classList.add('up');
        }
    });

