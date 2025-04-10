document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const locationButtons = document.querySelectorAll('.location-buttons button');
    const mapIframe = document.querySelector('.map-container iframe');

    // Toggle del menú
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Cerrar menú cuando se hace clic en un enlace
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Cambio de mapa según el botón seleccionado
    locationButtons.forEach(button => {
        button.addEventListener('click', function() {
            locationButtons.forEach(btn => btn.classList.remove('active')); // Remueve la clase activa
            this.classList.add('active'); // Agrega la clase activa al botón seleccionado

            // Cambiar el mapa según el botón presionado
            switch(this.textContent.trim()) {
                case 'Popayán':
                    mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127838.61280441116!2d-76.64702890000001!3d2.4427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed2fcaf04784f%3A0x8e35b5ca20c0a4!2sPopay%C3%A1n%2C%20Cauca%2C%20Colombia!5e0!3m2!1ses!2sus!4v1709562830249!5m2!1ses!2sus";
                    break;
                case 'Cauca':
                    mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1015142.2195430108!2d-76.82281500000001!3d2.5425000000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2eb48328c5a3c3%3A0x9f33b5769a007499!2sCauca%2C%20Colombia!5e0!3m2!1ses!2sus!4v1709562950670!5m2!1ses!2sus";
                    break;
                case 'Colombia':
                    mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15857970.47901144!2d-74.0850942!3d4.3687906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2eb48328c5a3c3%3A0x9f33b5769a007499!2sColombia!5e0!3m2!1ses!2sus!4v1709562950670!5m2!1ses!2sus";
                    break;
            }
        });
    });
});

// Botón para modo daltónico
const btnDaltonic = document.getElementById('btnDaltonic');

btnDaltonic.addEventListener('click', () => {
    document.body.classList.toggle('daltonic-mode');
});
