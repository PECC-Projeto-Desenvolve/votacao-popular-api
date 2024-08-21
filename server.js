import express from "express";
import router from "./routes/usuarioRoutes.js";  
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Para lidar com JSON no corpo das requisições
app.use(cors());

// Usar as rotas de usuário em '/usuarios'
app.use('/usuarios', router);

// Rota de teste para verificar o roteamento
app.get('/test', (req, res) => {
    res.send('Roteamento funcionando!');
});



const connectDatabase = () => {
  console.log("Connecting to the database");

  mongoose
    .connect(
        "mongodb+srv://root:Desenvolve23@votacao.qqbzibs.mongodb.net/?retryWrites=true&w=majority&appName=votacao"
    )
    .then(() => {
        console.log("MongoDB Atlas Connected");
        // Inicie o servidor apenas depois que o MongoDB estiver conectado
        app.listen(PORT, () => {
          console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
        process.exit(1); // Sai do processo se a conexão falhar
    });
};

connectDatabase(); // Chamando a função para conectar ao banco de dados e iniciar o servidor