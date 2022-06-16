const {Router} = require('express');
const {check} = require('express-validator');

const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios');

const {validarCampos, validarJWT, tieneRole} = require('../middlewares');

const { 
    esRolValido, 
    emailExiste, 
    existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //cuando el argumento de la funcion es el mismo que se esta recibiendo no es necesario especificarlo
    //check('rol').custom((rol) => esRolValido(rol) ),
    check('rol').custom(esRolValido ),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,//aqui se envia una referencia a la funcion
    //esAdminRole,
    //como se necesitan enviar otros parametros esta funcion debe retornar una funcion que maneje el req,res,next
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),//En este caso se intenta ejecutar una funcion, por eso esta funcion debe retornar otra funcion
    check('id', 'NO es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
