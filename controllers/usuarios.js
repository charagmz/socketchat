const { response, request } = require('express');//se hace para que vsc pueda intepretar las propiedades del objeto response
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado: true};
    // TODO validar que desde y limite sean numeros validos  
    //const usuarios = await Usuario.find(query)
    //    .skip(Number(desde))
    //    .limit(Number(limite));
    //const total = await Usuario.countDocuments(query);

    //para que las dos consultas se ejecuten de manera asyncrona dado que una no depende de la otra
    //desestructuracion de arreglos
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPut = async (req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    //TODO Validar que id exista
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {
        new: true //porque mongoose obtiene por default retorna el objeto viejo y con este parametro retornaria el nuevo
    });
    
    res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
    
    //const {google, ...rest} = req.body;//del body quita el campo google y los demas quedan en rest
    const {nombre, correo, password, rol} = req.body;
    //console.log(body);
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();
    res.json({
        usuario
    });
};

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    // Borrado fisico
    //const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
