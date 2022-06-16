const {Router} = require('express');
const {check} = require('express-validator');
const { 
    crearCategoria, 
    obtenerCategoria, 
    obtenerCategorias, 
    actualizarCategoria, 
    borrarCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

//{{ url }}/api/categorias

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
//validacion personalizada del id (de mongo y que exista)
router.get('/:id', [
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

// Crear categoria - privado, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Actualizar categoria - privado, cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarCategoria);

// Borrar categoria - privado, solo Admin, solo cambia de estado
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos,
], borrarCategoria);

module.exports = router;