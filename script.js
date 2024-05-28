let fields = [null, null, null, null, null, null, null, null, null];

let currentPlayer = "X"; // Startspieler

function render() {
  let container = document.getElementById("container");
  container.innerHTML = ""; // Clear the container

  let table = document.createElement("table");
  let index = 0;
  for (let i = 0; i < 3; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      let cell = document.createElement("td");
      if (fields[index] === "X") {
        let svg = createCrossSVG();
        cell.appendChild(svg);
      } else if (fields[index] === "O") {
        let svg = createCircleSVG();
        cell.appendChild(svg);
      }
      cell.dataset.index = index; // Store the index as data attribute
      cell.addEventListener("click", handleClick);
      row.appendChild(cell);
      index++;
    }
    table.appendChild(row);
  }
  container.appendChild(table);
}

function handleClick(event) {
  let cell = event.target;
  let index = cell.dataset.index;

  // Überprüfen, ob das Spiel bereits vorbei ist
  if (checkGameOver()) {
    return; // Ignoriere den Klick, wenn das Spiel vorbei ist
  }

  // Überprüfen, ob das Feld bereits belegt ist
  if (fields[index] !== null) {
    return; // Abbrechen, wenn das Feld bereits belegt ist
  }

  // Setzen des Zeichens des aktuellen Spielers
  fields[index] = currentPlayer;

  // Aktualisieren des Inhalts des aktuellen Zellen-Elements
  if (currentPlayer === "X") {
    let svg = createCrossSVG();
    cell.appendChild(svg);
  } else {
    let svg = createCircleSVG();
    cell.appendChild(svg);
  }

  // Wechsel zum nächsten Spieler
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // Aktualisieren des Textes und der Farbe des Spieler-Symbols, um den aktuellen Spieler anzuzeigen
  document.getElementById(
    "turn-text"
  ).innerHTML = `Spieler <span class="player-symbol">${currentPlayer}</span> ist dran`;
  let playerSymbol = document.querySelector(".player-symbol");
  playerSymbol.style.color = currentPlayer === "X" ? "#FF6C37" : "#00B0EF";

  // Nach dem Klick erneut prüfen, ob das Spiel vorbei ist
  checkGameOver();
}

// checkGameOver

function checkGameOver() {
  // Array mit allen möglichen Gewinnkombinationen
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Horizontale Linien
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Vertikale Linien
    [0, 4, 8],
    [2, 4, 6], // Diagonale Linien
  ];

  // Überprüfen, ob einer der Spieler gewonnen hat
  for (let combo of winCombos) {
    let [a, b, c] = combo;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      // Gewinner gefunden
      drawWinningLine(a, b, c);
      endGame();
      document.getElementById(
        "turn-text"
      ).innerHTML = `Spieler <span class="player-symbol">${fields[a]}</span> hat gewonnen!`;
      let playerSymbol = document.querySelector(".player-symbol");
      playerSymbol.style.color = currentPlayer === "X" ? "#00B0EF" : "#FF6C37";
      playerSymbol.style.fontSize = "40px";
      document.getElementById("turn-text").style.fontSize = "28px";
      return true; // Spiel vorbei
    }
  }

  // Überprüfen, ob das Spiel unentschieden ist
  if (!fields.includes(null)) {
    // Keine leeren Felder mehr vorhanden
    document.getElementById("turn-text").innerHTML = `Unentschieden!`;
    document.getElementById("turn-text").style.fontSize = "40px";
    return true; // Spiel vorbei
  }

  return false; // Spiel läuft weiter
}

// drawWinningLine
let winningLineDrawn = false; // Variable, um zu verfolgen, ob bereits ein Strich gezeichnet wurde

function drawWinningLine(a, b, c) {
  // Überprüfen, ob bereits ein Strich gezeichnet wurde
  if (winningLineDrawn) {
    return;
  }

  // Die betreffenden Zellen auswählen
  let cellA = document.querySelector(`[data-index='${a}']`);
  let cellB = document.querySelector(`[data-index='${b}']`);
  let cellC = document.querySelector(`[data-index='${c}']`);

  // Die Positionen der Zellen abrufen
  let rectA = cellA.getBoundingClientRect();
  let rectB = cellB.getBoundingClientRect();
  let rectC = cellC.getBoundingClientRect();

  // Die Positionen der Zellen relativ zum Viewport berechnen
  let xA = rectA.left + rectA.width / 2;
  let yA = rectA.top + rectA.height / 2;
  let xB = rectB.left + rectB.width / 2;
  let yB = rectB.top + rectB.height / 2;
  let xC = rectC.left + rectC.width / 2;
  let yC = rectC.top + rectC.height / 2;

  // Canvas erstellen und positionieren
  let canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none"; // Canvas soll Klicks nicht blockieren
  document.body.appendChild(canvas);

  // Kontext des Canvas abrufen
  let ctx = canvas.getContext("2d");

  // Start- und Endpunkte des Strichs
  let startX = xA;
  let startY = yA;
  let endX = xB;
  let endY = yB;

  // Länge des Strichs berechnen
  let lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

  // Animationszeit in Millisekunden
  let animationDuration = 1000; // 1 Sekunde
  let animationStartTime = null;

  // Animationsschleife
  function animate(currentTime) {
    if (!animationStartTime) {
      animationStartTime = currentTime;
    }
    let elapsedTime = currentTime - animationStartTime;
    let animationProgress = elapsedTime / animationDuration;

    if (animationProgress < 1) {
      // Neue Endpunkte des Strichs berechnen, um die volle Länge zu erreichen
      endX = xA + (xC - xA) * animationProgress;
      endY = yA + (yC - yA) * animationProgress;

      // Den Inhalt des Canvas löschen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Strich zeichnen
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Nächste Animationsschleife anfordern
      requestAnimationFrame(animate);
      winningLineDrawn = true;
    } else {
      // Animation beendet, Variable aktualisieren, um zu verfolgen, dass ein Strich gezeichnet wurde
      winningLineDrawn = true;
    }
  }

  // Erste Animationsschleife starten
  requestAnimationFrame(animate);
}

// create circle SVG

function createCircleSVG() {
  let svgNS = "http://www.w3.org/2000/svg";
  let svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "70");
  svg.setAttribute("height", "70");
  svg.setAttribute("viewBox", "0 0 100 100");

  // Randpfad
  let border = document.createElementNS(svgNS, "path");
  border.setAttribute("d", "M50,5 A45,45 0 1,1 50,95 A45,45 0 1,1 50,5");
  border.setAttribute("stroke", "#00B0EF");
  border.setAttribute("fill", "transparent");
  border.setAttribute("stroke-width", "10"); // Dickerer Rand
  border.setAttribute("stroke-dasharray", "0 283"); // Länge des Pfads

  svg.appendChild(border);

  // Innenkreis
  let circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "50");
  circle.setAttribute("cy", "50");
  circle.setAttribute("r", "35");
  circle.setAttribute("fill", "transparent");
  circle.setAttribute("stroke", "none");

  svg.appendChild(circle);

  // Add CSS classes for animations
  svg.classList.add("fill-animation");
  svg.classList.add("rotate-animation");

  return svg;
}

// create cross SVG

function createCrossSVG() {
  let svgNS = "http://www.w3.org/2000/svg";
  let svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "70");
  svg.setAttribute("height", "70");
  svg.setAttribute("viewBox", "0 0 100 100");

  // Erster Strich des Kreuzes
  let line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", "15");
  line1.setAttribute("y1", "15");
  line1.setAttribute("x2", "85");
  line1.setAttribute("y2", "85");
  line1.setAttribute("stroke", "#FFC000");
  line1.setAttribute("stroke-width", "10"); // Dickerer Strich

  svg.appendChild(line1);

  // Zweiter Strich des Kreuzes
  let line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", "85");
  line2.setAttribute("y1", "15");
  line2.setAttribute("x2", "15");
  line2.setAttribute("y2", "85");
  line2.setAttribute("stroke", "#FFC000");
  line2.setAttribute("stroke-width", "10"); // Dickerer Strich

  svg.appendChild(line2);

  // Add CSS classes for animations
  svg.classList.add("stroke-animation");
  svg.classList.add("rotate-animation");

  return svg;
}

// Funktion zum Zurücksetzen des Spiels
function resetGame() {
  // Array für die Felder zurücksetzen
  fields = [null, null, null, null, null, null, null, null, null];

  // Alle Zellen leeren
  // Klasse .game-over von allen Zellen entfernen, um Hovern wieder zu ermöglichen

  let cells = document.querySelectorAll("td");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("game-over");
  });

  // Canvas-Elemente entfernen, wenn vorhanden
  let canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.parentNode.removeChild(canvas);
  }
  winningLineDrawn = false;

  // Spiel zurücksetzen auf Startspieler X
  currentPlayer = "X";

  document.getElementById(
    "turn-text"
  ).innerHTML = `Spieler <span class="player-symbol">${currentPlayer}</span> beginnt!`;

  let playerSymbol = document.querySelector(".player-symbol");
  playerSymbol.style.color = currentPlayer === "X" ? "#FF6C37" : "#00B0EF";
  playerSymbol.style.fontSize = "36px";
  document.getElementById("turn-text").style.fontSize = "24px";
}

function endGame() {
  let cells = document.querySelectorAll("td");
  cells.forEach((cell) => {
    cell.classList.add("game-over");
  });
}

// Initial rendering
render();
