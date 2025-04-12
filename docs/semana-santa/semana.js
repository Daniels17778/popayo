document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

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
});


let speech; // sirve para la voz

function leerTexto() {
    let texto = document.getElementById("texto").textContent;
   
    
    

    
    detenerTexto();

    speech = new SpeechSynthesisUtterance(texto);
   
    
    speech.lang = "es-ES"; 
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


function detenerTexto() {
    window.speechSynthesis.cancel();
}

function leerTexto1() {
    let texto1 = document.getElementById("texto1").textContent;
   
    
    

    
    detenerTexto();

    speech = new SpeechSynthesisUtterance(texto1);
   
    
    speech.lang = "es-ES"; 
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

// Botón para modo daltónico
const btnDaltonic = document.getElementById('btnDaltonic');

btnDaltonic.addEventListener('click', () => {
    document.body.classList.toggle('daltonic-mode');
});
