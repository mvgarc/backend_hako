const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El usuario ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol: rol || 'analista'
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
    } catch (error) {
        // console.error('Error al registrar el usuario:', error); //descomentar para depuración
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message || error });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
        }


        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error en el controlador de login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message || error });
    }
};