const url = (window.location.hostname.includes('localhost')) 
            ? 'http://localhost:4000/api/auth/' 
            : 'https://restservernjs.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

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

    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
}


const main = async () => {

    await validarJWT();
}

main();

//