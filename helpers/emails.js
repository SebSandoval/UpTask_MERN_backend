import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {


    const { email, nombre, token } = datos
    // console.log(datos);
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });



    const info = await transport.sendMail({
        from: ' "UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Comprueba tu Cuenta",
        text: "Comprueba tu Cuenta de Uptask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
        <p>Si tu no create esta cuenta, puedes ignorar el mensaje</p>
        `


    })
}






export const emailOlvidePassword = async (datos) => {


    const { email, nombre, token } = datos
    //TODO: MOVER A  variables de entorno
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    //informacion email
    const info = await transport.sendMail({
        from: ' "UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu Password",
        text: "Reestablece tu Password de Uptask",
        html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>
        <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        `


    })
}

