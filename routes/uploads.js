const {Router} = require('express');
const {check} = require('express-validator');

const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const {coleccionesPermitidas} = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser un mongoId valido').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser un mongoId valido').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;