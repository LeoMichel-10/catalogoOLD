// Buscador
const buscador = document.querySelector('#buscador');
buscador.addEventListener('keyup', function() {
  const busqueda = this.value.toLowerCase();
  const filas = document.querySelectorAll('.dirlistertable tr.d');
  let juegosNuevos = [];
  let otrosJuegos = [];
  filas.forEach(function(fila) {
    const juego = fila.querySelector('td:nth-child(2)').textContent.toLowerCase();
    if (busqueda === '') {
      if (fila.querySelector('td:nth-child(2) img.new')) {
        juegosNuevos.push(fila);
      } else {
        otrosJuegos.push(fila);
      }
    } else if (juego.indexOf(busqueda) !== -1) {
      if (fila.querySelector('td:nth-child(2) img.new')) {
        juegosNuevos.push(fila);
      } else {
        otrosJuegos.push(fila);
      }
    } else {
      fila.style.display = 'none';
    }
  });
  juegosNuevos.sort((a, b) => a.querySelector('td:nth-child(2)').textContent.localeCompare(b.querySelector('td:nth-child(2)').textContent));
  otrosJuegos.sort((a, b) => a.querySelector('td:nth-child(2)').textContent.localeCompare(b.querySelector('td:nth-child(2)').textContent));
  filas.forEach(fila => fila.style.display = 'none');
  juegosNuevos.forEach(fila => fila.style.display = '');
  otrosJuegos.forEach(fila => fila.style.display = '');
  const tbody = document.querySelector('.dirlistertable tbody');
  juegosNuevos.concat(otrosJuegos).forEach(fila => tbody.appendChild(fila));
  enumerarJuegos();
});

const checkboxes = document.querySelectorAll('input[name="game"]');
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    let total = 0;
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        const costo = parseInt(checkbox.closest('tr').querySelector('td:nth-child(4)').textContent);
        total += costo;
      }
    });
    document.querySelector('#total').textContent = total + 'Mn';
  });
});

const cells = document.querySelectorAll('.dirlistertable tr.d td:first-child');
cells.forEach(function(cell) {
  cell.addEventListener('click', function(event) {
    var checkbox = cell.querySelector('input[type="checkbox"]');
	if (event.target !== checkbox) {
		checkbox.checked = !checkbox.checked;
		checkbox.dispatchEvent(new Event('change'));
	}
  });
});



const nameCells = document.querySelectorAll('.dirlistertable tr.d td:nth-child(2), .dirlistertable tr.d td:nth-child(3), .dirlistertable tr.d td:nth-child(4)');
nameCells.forEach(function(cell) {
	cell.addEventListener('click', function(event){
		var checkbox = cell.parentNode.querySelector('input[type="checkbox"]');
		if(event.target !== checkbox){
			checkbox.checked = !checkbox.checked;
			checkbox.dispatchEvent(new Event('change'));
		}
	});
});

const checkbox = document.querySelectorAll('input[name="game"]');
const comprar = document.querySelector('#comprar');
comprar.addEventListener('click', function() {
  let mensaje = '*Hola, me gustaría grabar en mi PS4 los siguientes juegos:*\n\n';
  let total = 0;
  let tamanoTotal = 0;
  let juegosSeleccionados = [];
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      const nombre = checkbox.closest('tr').querySelector('td:nth-child(2)').textContent;
      const tamano = parseFloat(checkbox.closest('tr').querySelector('td:nth-child(3)').textContent);
      const costo = checkbox.closest('tr').querySelector('td:nth-child(4)').textContent;
      juegosSeleccionados.push({nombre, tamano, costo});
      total += parseInt(costo);
      tamanoTotal += tamano;
    }
  });
  juegosSeleccionados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  juegosSeleccionados.forEach(juego => {
    mensaje += juego.nombre + ' - ' + juego.costo + '\n\n';
  });
  mensaje += '*Total de tamaño*: ' + tamanoTotal.toFixed(2) + ' Gb\n';
  mensaje += '*Total a pagar*: ' + total + 'Mn\n';
  window.open('https://wa.me/+5359030388?text=' + encodeURIComponent(mensaje));
});

const checkboxe = document.querySelectorAll('input[name="game"]');
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    let haySeleccionados = false;
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        haySeleccionados = true;
      }
    });
    comprar.disabled = !haySeleccionados;
  });
});

function ordenarYEnumerarJuegos() {
  const filas = document.querySelectorAll('.dirlistertable tr.d');
  let juegos = Array.from(filas);
  juegos.sort((a, b) => {
    const esNuevoA = a.querySelector('td:nth-child(2) img.new') !== null;
    const esNuevoB = b.querySelector('td:nth-child(2) img.new') !== null;
    if (esNuevoA && !esNuevoB) {
      return -1;
    } else if (!esNuevoA && esNuevoB) {
      return 1;
    } else {
      const juegoA = a.querySelector('td:nth-child(2)').textContent.replace(/^\d+\. /, '');
      const juegoB = b.querySelector('td:nth-child(2)').textContent.replace(/^\d+\. /, '');
      return juegoA.localeCompare(juegoB);
    }
  });
  let juegosOrdenadosAlfabeticamente = Array.from(juegos);
  juegosOrdenadosAlfabeticamente.sort((a, b) => {
    const juegoA = a.querySelector('td:nth-child(2)').textContent.replace(/^\d+\. /, '');
    const juegoB = b.querySelector('td:nth-child(2)').textContent.replace(/^\d+\. /, '');
    return juegoA.localeCompare(juegoB);
  });
  juegos.forEach(fila => {
    const celdaNombre = fila.querySelector('td:nth-child(2)');
    let span = celdaNombre.querySelector('span.enumeracion');
    if (!span) {
      span = document.createElement('span');
      span.classList.add('enumeracion');
      celdaNombre.insertBefore(span, celdaNombre.firstChild);
    }
    const index = juegosOrdenadosAlfabeticamente.indexOf(fila);
    const numero = (index + 1).toString().padStart(3, '0');
    span.textContent = numero + '. ';
  });
  const tbody = document.querySelector('.dirlistertable tbody');
  juegos.forEach(fila => tbody.appendChild(fila));
}

window.addEventListener('load', function() {
  ordenarYEnumerarJuegos();
});

window.addEventListener('load', function() {
  ordenarYEnumerarJuegos();
});


function ordenarPorImagenNew() {
  const filas = document.querySelectorAll('.dirlistertable tr.d');
  let juegos = Array.from(filas);
  juegos.sort((a, b) => {
    const esNuevoA = a.querySelector('td:nth-child(2) img.new') !== null;
    const esNuevoB = b.querySelector('td:nth-child(2) img.new') !== null;
    if (esNuevoA && !esNuevoB) {
      return -1;
    } else if (!esNuevoA && esNuevoB) {
      return 1;
    } else {
      return 0;
    }
  });
  const tbody = document.querySelector('.dirlistertable tbody');
  juegos.forEach(fila => tbody.appendChild(fila));
}

window.addEventListener('load', function() {
  ordenarYEnumerarJuegos();
  ordenarPorImagenNew();
});

const backToTopButton = document.querySelector('#back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});