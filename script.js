let fields = [null, null, null, null, null, null, null, null, null];

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
  let index = event.target.dataset.index;
  if (fields[index] === null) {
    fields[index] = "X"; // Assuming X always starts
    render();
  }
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

// Initial rendering
render();
