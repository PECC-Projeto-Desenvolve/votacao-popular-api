import { usuario } from "../models/usuario.js";
import axios from "axios";

class UsuarioController {
  static async getUsuarios(req, res) {
    try {
      const listaUsuarios = await usuario.find();
      res.status(200).json(listaUsuarios);
    } catch (error) {
      console.error("Erro ao buscar usuario:", error);
      res.status(500).send("Erro ao buscar usuario.");
    }
  }

  static async getVotos(req, res) {
    try {
      console.log("Buscando votos");
      const votos = await usuario.find({ voto: { $exists: true } });
      const totalVotos = votos.length;
      const votos1 = votos.filter((voto) => voto.voto === 1).length;
      console.log("Votos 1:", votos1);
      const votos2 = votos.filter((voto) => voto.voto === 2).length;
      console.log("Votos 2:", votos2);
      const votos3 = votos.filter((voto) => voto.voto === 3).length;
      console.log("Votos 3:", votos3);
      res.status(200).json({ totalVotos, votos1, votos2, votos3 });
    } catch (error) {
      console.error("Erro ao buscar votos:", error);
      res.status(500).send("Erro ao buscar votos.");
    }
  }

  static async getUsuarioById(req, res) {
    try {
      const cpf = req.params.cpf;
      console.log("Buscando CPF:", cpf);
      const usuarioEncontrado = await usuario.findOne({ cpf: cpf });
      console.log("Usuário Encontrado:", usuarioEncontrado);
      if (usuarioEncontrado) {
        res.status(200).json(usuarioEncontrado);
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar usuario:", error);
      res.status(500).send("Erro ao buscar usuario.");
    }
  }

  static async createUsuario(req, res) {
    try {
      const { cpf } = req.body;

      // Verificar se o CPF já está cadastrado
      let usuarioExistente = await usuario.findOne({ cpf: cpf });
      if (usuarioExistente) {
        return res.status(400).json({ message: "CPF já registrado" });
      }

      // Se não estiver cadastrado, criar novo usuário
      const novoUsuario = await usuario.create(req.body);
      res.status(201).json({ message: "Criado com sucesso", novoUsuario });
    } catch (error) {
      console.error("Erro ao criar usuario:", error);
      res.status(500).send("Erro ao criar usuario.");
    }
  }

  static async updateUsuario(req, res) {
    try {
      const cpf = req.params.cpf;
      const novoUsuario = await usuario.findOneAndUpdate(
        { cpf: cpf },
        req.body,
        {
          new: true,
        }
      );
      if (novoUsuario) {
        res.status(200).json(novoUsuario);
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuario:", error);
      res.status(500).send("Erro ao atualizar usuario.");
    }
  }

  static async deleteUsuario(req, res) {
    try {
      const cpf = req.params.cpf;
      const usuarioDeletado = await usuario.findOneAndDelete({ cpf: cpf });
      if (usuarioDeletado) {
        res.status(200).json({ message: "Usuario removido com sucesso" });
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao remover usuario:", error);
      res.status(500).send("Erro ao remover usuario.");
    }
  }

  static async createVoto(req, res) {
    try {
      const { cpf, voto, cep } = req.body;
      console.log(
        "Recebido para createVoto - CPF:",
        cpf,
        "Voto:",
        voto,
        "CEP:",
        cep
      );

      // Validar o CEP usando a API Brasil Aberto
      const response = await axios.get(
        `https://brasilapi.com.br/api/cep/v1/${cep}`
      );
      const dadosCep = response.data;

      if (!dadosCep || dadosCep.city !== "Itabira") {
        return res.status(400).json({ message: "CEP não pertence a Itabira" });
      }

      let usuarioExistente = await usuario.findOne({ cpf: cpf });
      console.log("Usuário existente:", usuarioExistente);

      if (usuarioExistente) {
        usuarioExistente.voto = voto;
        await usuarioExistente.save();
        res
          .status(200)
          .json({ message: "Voto registrado com sucesso", usuarioExistente });
      } else {
        const novoUsuario = new usuario({ cpf, voto, cep });
        await novoUsuario.save();
        console.log("Voto registrado com sucesso:", novoUsuario);
        res
          .status(201)
          .json({ message: "Voto registrado com sucesso", novoUsuario });
      }
    } catch (error) {
      console.error("Erro ao registrar/atualizar voto:", error);
      res.status(500).send("Erro ao registrar/atualizar voto.");
    }
  }

  static async verificarVoto(req, res) {
    try {
      const cpf = req.params.cpf;
      const usuarioExistente = await usuario.findOne({ cpf: cpf });

      if (usuarioExistente) {
        const jaVotou = usuarioExistente.voto !== undefined;
        res.status(200).json({ jaVotou });
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao verificar voto:", error);
      res.status(500).send("Erro ao verificar voto.");
    }
  }
}

export default UsuarioController;