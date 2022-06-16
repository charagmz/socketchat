const { response, request } = require('express');//se hace para que vsc pueda intepretar las propiedades del objeto response

const {Categoria} = require('../models');


const obtenerCategorias = async (req, res = response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado: true};
    //para que las dos consultas se ejecuten de manera asyncrona dado que una no depende de la otra
    //desestructuracion de arreglos
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite)).populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        categorias
    });
};

const obtenerCategoria = async (req, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json(categoria);
};

const crearCategoria = async (req, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }
    //console.log(body);
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    // Guardar en BD
    await categoria.save();

    res.status(201).json(categoria);
};

// actualizarCategoria - nombre - validar repetidos
const actualizarCategoria = async (req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true });
    
    res.json(categoria);
};

const borrarCategoria = async (req, res = response) => {
    const {id} = req.params;

    //const categoria = await Categoria.findByIdAndDelete(id);
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}