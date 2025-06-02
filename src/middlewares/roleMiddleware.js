const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.rol))) {
            // usuario no autorizado o rol incorrecto
            return res.status(401).json({ message: 'No autorizado para acceder a esta ruta.' });
        }
        next();
    };
};

module.exports = authorize;