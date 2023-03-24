import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import Usuario from "../models/Usuario.js"
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js"
const registrar = async (req, res) => {
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario) {
        const error = new Error('Usuairo ya registrado')
        return res.status(400).json({ msg: error.message })
    }
    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save()
        //enviar email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({ msg: 'Usuario Creado Correctamente, Revisa tu Email Para Confirmar Tu Cuenta' })

    } catch (error) {
        console.log(error);
    }


}


const autenticar = async (req, res) => {

    const { password, email } = req.body

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El Usuario no Existe")
        return res.status(404).json({ msg: error.message })
    }
    //cpmprobar si el usuario existe
    if (!usuario.confirmado) {
        const error = new Error("El Usuario no se Encuentra Confirmado")
        return res.status(404).json({ msg: error.message })
    }
    //comprobar si el usuario esta confirmado

    //comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)


        })

    } else {
        const error = new Error("El Password es Incorrecto")
        return res.status(404).json({ msg: error.message })

    }
}


const confirmar = async (req, res) => {

    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error("Token no válido")
        return res.status(404).json({ msg: error.message })
    }
    try {

        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ''
        await usuarioConfirmar.save()
        res.json({ msg: 'Usuario Confirmado Correctamente' })


    } catch (error) {
        console.log(error);
    }

}
const olvidePassword = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El Usuario no Existe")
        return res.status(404).json({ msg: error.message })
    }
    try {
        usuario.token = generarId()
        await usuario.save()

        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: 'Hemos Enviado un Email con las Instrucciones' })

    } catch (error) {
        console.log(error);
    }

}

const comprobarToken = async (req, res) => {

    const { token } = req.params
    const tokenValido = await Usuario.findOne({ token })
    if (tokenValido) {
        res.json({ msg: 'Token válido y el Usuario Existe' })

    } else {
        const error = new Error("Token no Válido")
        return res.status(404).json({ msg: error.message })
    }
}
const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    const usuario = await Usuario.findOne({ token })
    if (usuario) {
        usuario.password = password;
        usuario.token = ''
        try {
            await usuario.save()
            res.json({ msg: 'Usuario Modificado Correctamente' })
        } catch (error) {
            console.log(error);

        }

    } else {
        const error = new Error("Token no Válido")
        return res.status(404).json({ msg: error.message })
    }
    /*     console.log(token);
        console.log(password);
     */
}
const perfil = async (req, res) => {
    const { usuario } = req
    res.json(usuario)

}
export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}