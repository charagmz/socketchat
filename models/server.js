const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {createServer} = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // Inicializaction socket io
        this.server = createServer(this.app);
        this.io     = require('socket.io')(this.server);


        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares: Funciones que se ejecutan cuando se levanta el servidor
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        //aqui de acuerdo al ambiente prod o dev se podria cambiar la conexion a la bd
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));

        // Fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }

    sockets() {
        //this.io.on('connection', socketController );
        this.io.on('connection', (socket) => socketController(socket, this.io) );
    }

    listen() {
        // se debe poner a escuchar el nuevo server porque el de express "this.app" no tiene nada de sockets
        this.server.listen(this.port, () => {
            console.log('Servidor escuchando en puerto', this.port);
        });        
    }

}


module.exports = Server;