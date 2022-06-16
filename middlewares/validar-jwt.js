const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');


const validarJWT = async (req=request, res=response, next) => {
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        //Si el token no es valido dispara un error por eso se usa el trycatch
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            });
        }
        
        // Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario inactivo'
            });
        } 

        //se agrega una propiedad nueva dentro del objeto request
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
        
    }

}

module.exports = {
    validarJWT
}