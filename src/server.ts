import express from "express";
import tarefasRoutes from "./routes/tarefas";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/tarefas", tarefasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor executando em localhost:${PORT}`);
});

