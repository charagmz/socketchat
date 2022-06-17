const url = (window.location.hostname.includes('localhost')) 
            ? 'http://localhost:4000/api/auth/' 
            : 'https://restservernjs.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

// Validar el token del localstorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    try {
        const resp = await fetch (url, {
            headers: {'x-token': token}
        });

        const {usuario: userDB, token: tokenDB} = await resp.json();
        // renovar el token
        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre;
        
        await conectarSocket();
    } catch (error) {
        window.location = 'index.html';
        throw new Error('Token no valido');
    }
}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', () => {
        // TODO:
    });

    // socket.on('usuarios-activos', (payload) => {
    //     dibujarUsuarios(payload);
    // });
    // se envia solo la referencia a la funcion porque el contenido de la funcion flecha es solo el llamado a una funcion donde el primer argumento es igual al primer argumento del callback 
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', () => {
        // TODO:
    });

}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({nombre, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;
}

const main = async () => {

    await validarJWT();
}

main();

//