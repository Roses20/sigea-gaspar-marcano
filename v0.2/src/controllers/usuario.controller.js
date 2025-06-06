const UsuarioService = require('../services/usuario.service');
const service = new UsuarioService();

const getUsuarios = async (req, res, next) => {
    try {
        const usuarios = await service.findAll();
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
};

const getUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await service.findOne(id);
        res.json(usuario);
    } catch (error) {
        next(error);
    }
};

const createUsuario = async (req, res, next) => {
    try {
        const data = req.body;
        const newUsuario = await service.create(data);
        res.status(201).json(newUsuario);
    } catch (error) {
        next(error);
    }
};

const updateUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const changes = req.body;
        const updatedUsuario = await service.update(id, changes);
        res.json(updatedUsuario);
    } catch (error) {
        next(error);
    }
};

const deleteUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsuarios,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
};
