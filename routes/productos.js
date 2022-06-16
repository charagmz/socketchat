const {Router} = require('express');
const {check} = require('express-validator');
const { 
    crearProducto, 
    obtenerProducto, 
    obtenerProductos, 
    actualizarProducto, 
    borrarProducto } = require('../controllers/productos');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//{{ url }}/api/Productos

// Obtener todas las Productos - publico
router.get('/', obtenerProductos);

// Obtener una Producto por id - publico
//validacion personalizada del id (de mongo y que exista)
router.get('/:id', [
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos,
], obtenerProducto);

// Crear Producto - privado, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'Categoria no es un ID valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos,
], crearProducto);

// Actualizar Producto - privado, cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos,
], actualizarProducto);

// Borrar Producto - privado, solo Admin, solo cambia de estado
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos,
], borrarProducto);

module.exports = router;