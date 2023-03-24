import Tarea from "../models/Tareas.js"
import Proyecto from "../models/Proyecto.js"
import { isValidObjectId } from "mongoose";
const agregarTarea = async (req, res) => {

    const { proyecto } = req.body

    try {
        const existeProyecto = await Proyecto.findById(proyecto)

        if (!existeProyecto) {
            const error = new Error("Proyecto no encontrado");
            return res.status(404).json({ message: error.message });

        }
        if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("No Tienes los Permisos Para Añadir Tareas")
            return res.status(401).json({ msg: error.message })

        }
        try {

            const tareaAlmacenada = await Tarea.create(req.body)

            //almacenar id del proyecto

            existeProyecto.tareas.push(tareaAlmacenada._id)
            await existeProyecto.save()
            res.json(tareaAlmacenada)
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        res.status(404).json({ msg: 'Proyecto no Encontrado' });
    };
    /*  const existeProyecto = await Proyecto.findById(proyecto)
 
     if (!existeProyecto) {
         const error = new Error("Proyecto no encontrado");
         return res.status(404).json({ message: error.message });
     }
     if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
         const error = new Error("No tienes los permisos para añadir tareas");
         return res.status(404).json({ message: error.message });
     }
     try {
 
         const tareaAlmacenada = await Tarea.create(req.body)
         res.json(tareaAlmacenada)
     } catch (error) {
         console.log(error);
     } */

}

const obtenerTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")




    if (!tarea) {
        const error = new Error("Tarea no Encontrada")
        return res.status(404).json({ msg: error.message })
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no Válida")
        return res.status(403).json({ msg: error.message })
    }

    res.json(tarea)

}
const actualizarTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")




    if (!tarea) {
        const error = new Error("Tarea no Encontrada")
        return res.status(404).json({ msg: error.message })
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no Válida")
        return res.status(403).json({ msg: error.message })
    }

    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }

}
const eliminarTarea = async (req, res) => {

    const { id } = req.params
    try {

        const tarea = await Tarea.findById(id).populate("proyecto")

        if (!tarea) {
            const error = new Error("Tarea no Encontrada")
            return res.status(404).json({ msg: error.message })
        }
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no Válida")
            return res.status(403).json({ msg: error.message })
        }

        try {

            const proyecto = await Proyecto.findById(tarea.proyecto)
            proyecto.tareas.pull(tarea._id)


            await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
            res.json({ msg: "Tarea Eliminada Correctamente" })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: "Tarea no Encontrada" });
    };


}
const cambiarEstado = async (req, res) => {

    const { id } = req.params
    try {

        const tarea = await Tarea.findById(id).populate("proyecto")

        if (!tarea) {
            const error = new Error("Tarea no Encontrada")
            return res.status(404).json({ msg: error.message })
        }

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
            !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
            const error = new Error("Acción no Válida")
            return res.status(403).json({ msg: error.message })
        }
        tarea.estado = !tarea.estado
        tarea.completado = req.usuario._id 
        await tarea.save();

        const tareaAlmacenada = await Tarea.findById(id)
        .populate("proyecto")
        .populate("completado")

        res.json(tareaAlmacenada);


    } catch (error) {
        res.status(404).json({ msg: "Tarea no Encontrada" });
    };
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}
