let players = [];
let amountPerPlayer = 0;
let totalPaid = 0;

// Cargar datos al iniciar la aplicación
window.onload = function() {
  loadSavedData();
}

// Función para guardar datos en Local Storage
function saveData() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("amountPerPlayer", amountPerPlayer);
  localStorage.setItem("totalPaid", totalPaid);
}

// Función para cargar datos desde Local Storage
function loadSavedData() {
  const savedPlayers = localStorage.getItem("players");
  const savedAmountPerPlayer = localStorage.getItem("amountPerPlayer");
  const savedTotalPaid = localStorage.getItem("totalPaid");
  if (savedPlayers) {
    players = JSON.parse(savedPlayers);
    amountPerPlayer = parseFloat(savedAmountPerPlayer);
    totalPaid = parseFloat(savedTotalPaid);
    // Mostrar los datos guardados en la pantalla
    updateUI();
    updateSummary();
  }
}

// Función para actualizar la interfaz (UI) después de cargar los datos
function updateUI() {
  document.getElementById("playersSection").innerHTML = "";
  players.forEach((player, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    playerDiv.innerHTML = `
      <input type="text" value="${player.name === `Jugador ${index + 1}` ? "" : player.name}" placeholder="Jugador ${index + 1}" onchange="updatePlayerName(${index}, this.value)" />
      <span>Debe: €${amountPerPlayer.toFixed(2)}</span>
      <button onclick="togglePayment(${index})" class="${player.hasPaid ? 'paid' : ''}">
        ${player.hasPaid ? 'Pagado' : 'No Pagado'}
      </button>
    `;
    document.getElementById("playersSection").appendChild(playerDiv);
  });

  // Añadir botón de reinicio al final de la sección de jugadores
  const resetButtonDiv = document.createElement("div");
  resetButtonDiv.classList.add("reset-button");
  resetButtonDiv.innerHTML = `
    <button onclick="confirmReset()">Reiniciar Datos</button>
  `;
  document.getElementById("playersSection").appendChild(resetButtonDiv);
}

// Función para actualizar el nombre del jugador
function updatePlayerName(index, newName) {
  players[index].name = newName;
  saveData();
}

// Función para generar los jugadores y establecer el monto por jugador
function generatePlayers() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const totalAmount = parseFloat(document.getElementById("totalAmount").value);
  if (isNaN(numPlayers) || isNaN(totalAmount) || numPlayers <= 0 || totalAmount <= 0) {
    alert("Por favor, ingresa valores válidos.");
    return;
  }

  // Calcular el monto por jugador
  amountPerPlayer = totalAmount / numPlayers;

  // Limpiar cualquier lista anterior y reiniciar los datos
  players = [];
  document.getElementById("playersSection").innerHTML = "";

  // Generar lista de jugadores
  for (let i = 0; i < numPlayers; i++) {
    const player = {
      name: `Jugador ${i + 1}`,
      hasPaid: false
    };
    players.push(player);

    // Crear el elemento HTML de cada jugador
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    playerDiv.innerHTML = `
      <input type="text" value="" placeholder="Jugador ${i + 1}" onchange="updatePlayerName(${i}, this.value)" />
      <span>Debe: €${amountPerPlayer.toFixed(2)}</span>
      <button onclick="togglePayment(${i})">No Pagado</button>
    `;
    document.getElementById("playersSection").appendChild(playerDiv);
  }

  // Añadir botón de reinicio al final de la sección de jugadores
  const resetButtonDiv = document.createElement("div");
  resetButtonDiv.classList.add("reset-button");
  resetButtonDiv.innerHTML = `
    <button onclick="confirmReset()">Reiniciar Datos</button>
  `;
  document.getElementById("playersSection").appendChild(resetButtonDiv);

  // Ocultar el botón "Continuar"
  document.querySelector('.config-section').style.display = 'none';

  // Reiniciar los contadores
  totalPaid = 0;
  updateSummary();
  saveData(); // Guardar los datos iniciales
}

// Función para alternar el estado de pago de un jugador
function togglePayment(index) {
  const player = players[index];
  player.hasPaid = !player.hasPaid;

  // Actualizar el total pagado y el botón
  if (player.hasPaid) {
    totalPaid += amountPerPlayer;
  } else {
    totalPaid -= amountPerPlayer;
  }

  // Actualizar el botón visualmente
  const playerDiv = document.getElementById("playersSection").children[index];
  const button = playerDiv.querySelector("button");
  button.textContent = player.hasPaid ? "Pagado" : "No Pagado";
  button.classList.toggle("paid", player.hasPaid);

  // Actualizar el resumen de pagos y guardar datos
  updateSummary();
  saveData();
}

// Función para actualizar el resumen de pagos
function updateSummary() {
  const totalAmount = parseFloat(document.getElementById("totalAmount").value);
  const remainingAmount = totalAmount - totalPaid;
  document.getElementById("totalPaid").textContent = totalPaid.toFixed(2);
  document.getElementById("remainingAmount").textContent = remainingAmount.toFixed(2);
}

// Función para confirmar el reinicio de los datos
function confirmReset() {
  const confirmation = confirm("¿Estás seguro de que deseas reiniciar los datos?");
  if (confirmation) {
    resetData();
  }
}

// Función para reiniciar los datos
function resetData() {
  players = [];
  amountPerPlayer = 0;
  totalPaid = 0;
  saveData();
  location.reload(); // Recargar la página para reiniciar la aplicación
}
