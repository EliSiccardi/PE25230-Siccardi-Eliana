let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarCarrito(){
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoViajes = document.getElementById('carrito-viajes');
    const carritoTotal = document.getElementById('carrito-total');
    const tablaBody = document.getElementById('tabla-body')
    
    if (!tablaBody) return;

    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoViajes.style.display = 'none';
        carritoTotal.style.display = 'none';
        return;
    }

    carritoVacio.style.display = 'none';
    carritoViajes.style.display = 'block';
    carritoTotal.style.display = 'block';

    tablaBody.innerHTML = '';

    carrito.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>$${item.precio}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio * item.cantidad}</td>
            <td><button class="btn-eliminar" id="${item.id}">Eliminar</button></td>`;
        tablaBody.appendChild(fila);
    });

    calcularTotal();
    agregarEventosEliminar()
}

function calcularTotal() {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function agregarAlCarrito(id, nombre, precio){
    const existe = carrito.find(item => item.id === id);

    if (existe){
        existe.cantidad++;
    }else{
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Carrito actualizado: ', carrito);
}

function actualizarContador() {
    const totalViajes = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('cart-count');
    contador.textContent = totalViajes;
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
}

function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', (evento) => {  
            const boton = evento.target.closest('.btn-eliminar');
            const id = boton.id;

            eliminarDelCarrito(id);
        });
    });
}

function vaciarCarrito(){
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
}



const botonReservar = document.querySelectorAll('.btn-reservar-carrito');

botonReservar.forEach(btn => {
    btn.addEventListener('click', (evento) => {
        const article = evento.target.parentElement;
        const id = article.id;
        const nombre = article.querySelector('h2').textContent;
        const precio = parseFloat(article.querySelector('.precio').textContent);

        agregarAlCarrito(id, nombre, precio);
        actualizarContador();
    });
    
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    mostrarCarrito();
});

const botonVaciar = document.querySelector('.btn-vaciar');
if (botonVaciar) {
    botonVaciar.addEventListener('click', () => {
        if (confirm('¿Estas seguro de que deseas vaciar el carrito?')) {
            vaciarCarrito();
        }
    });
}

