// MAPA
var map = L.map('map').setView([-23.55052, -46.633308], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker;

// NOTIFICAÇÃO
function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.innerText = message;
    notification.classList.remove("hidden"); 
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.classList.add("hidden");
        }, 500);
    }, 3000);
}

// BUSCAR CEP
function buscarCEP() {
    var cep = document.getElementById("cep").value;

    if (cep.length !== 8) {
        showNotification("Enter a valid ZIP code with 8 digits.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showNotification("ZIP code not found!");
                return;
            }

            var endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            showNotification("Address found: " + endereco);

            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${data.localidade},${data.uf},Brasil&countrycodes=BR`)
                .then(res => res.json())
                .then(locations => {
                    if (locations.length > 0) {
                        var lat = locations[0].lat;
                        var lon = locations[0].lon;

                        map.setView([lat, lon], 14);

                        if (marker) {
                            map.removeLayer(marker);
                        }

                        marker = L.marker([lat, lon]).addTo(map)
                            .bindPopup(endereco)
                            .openPopup();
                    } else {
                        showNotification("Location not found on the map.");
                    }
                });
        });
}

// ESPERA O DOM CARREGAR (AQUI ESTÁ A CORREÇÃO)
document.addEventListener("DOMContentLoaded", function () {

    // ENTER NO INPUT
    document.getElementById("cep").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            buscarCEP();
        }
    });

    // DARK MODE
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggle-theme";
    toggleButton.innerHTML = "🌞";
    document.body.prepend(toggleButton);

    toggleButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        toggleButton.innerHTML = document.body.classList.contains("dark-mode") ? "🌙" : "🌞";
    });
    
    const empresa = document.body.getAttribute("data-empresa") || "Empresa";
    typeText(empresa);
});

// TYPE EFFECT DINÂMICO
function typeText(text) {
    var h1 = document.querySelector("h1");
    var index = 0;

    function typing() {
        if (index < text.length) {
            h1.innerHTML += text.charAt(index);
            index++;
            setTimeout(typing, 100);
        }
    }

    typing();
}