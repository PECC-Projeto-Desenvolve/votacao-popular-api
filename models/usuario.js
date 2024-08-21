import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    cpf: {
        type: String, //zero não é reconhecido se for number
        required: true
    },
    cep: {
        type: Number,
        required: true
    },
    voto: {
        type: Number,
    }
}, { versionKey: false, collection: 'usuarios' });

const usuario = mongoose.model("usuarios", usuarioSchema);

export { usuario };