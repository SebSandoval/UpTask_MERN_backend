import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';
const checkAuth = async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRETA)
            req.usuario = await Usuario.findById(decoded.id).select("-password -token -confirmado -__v -createdAt -updatedAd")
            // console.log(req.usuario);

        } catch (error) {
            return res.status(404).json({ msg: 'Hubo un Error' })
        }
    }

    if (!token) {
        const error = new Error("Token no Válido")
        return res.status(401).json({ msg: error.message })
    }
    next()
}

export default checkAuth
