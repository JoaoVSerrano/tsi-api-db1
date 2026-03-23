import {Router, Request, Response} from "express";
import { Tarefa } from "../models/tarefa";

const router = Router();

let tarefas: Tarefa[] = [
    {id: 1, titulo: "Estudar Express", concluida: false},
    {id: 2, titulo: "Estudar para Prova", concluida: false}
];

router.get("/", (req: Request, res: Response) =>{
    res.json(tarefas);
});

router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const tarefa = tarefas.find(t => t.id == id);

    if(!tarefa) {
        return res.status(404).json({erro: "Tarefa não encontrada"});
    }

    res.json(tarefa);
});

router.post("/", (req: Request, res: Response) => {
    const {titulo} = req.body;

    const novaTarefa: Tarefa = {
        id: tarefas.length + 1,
        titulo: titulo,
        concluida: false
    }

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

router.put("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const tarefa = tarefas.find(t => t.id == id);

    if(!tarefa) {
        return res.status(404).json({erro : "Tarefa não encontrada"});
    }

    const {titulo, concluida} = req.body;

    tarefa.titulo = titulo ?? tarefa.titulo,
    tarefa.concluida = concluida ?? tarefa.concluida

    res.json(tarefa);
});

router.delete("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    tarefas = tarefas.filter(t => t.id !== id);

    res.json({
        mensagem: "Tarefa Removida"
    });
});

export default router;
