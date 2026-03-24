import { Router, Request, Response } from "express";
import { db } from "../db";
import { Genero } from "../models/genero";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    db.all("SELECT * FROM generos", (erro, linhas) => {
        if(erro) {
            return res.status(500).json(
                {erro: "Erro ao buscar gêneros"}
            );
        }

        res.json(linhas);
    })
});

router.post("/", (req: Request, res: Response) => {
    const {nome} = req.body;
    if (!nome || nome.trim() === "") {
        return res.status(400).json({ erro: "O novo nome é obrigatório" });
    }

    db.run(
        "INSERT INTO generos (nome) VALUES (?)", [nome],
        function (erro) {
            if (erro) {
                return res.status(500).json(
                    {erro: "Erro ao cadastrar gênero"}
                )
            }

            res.status(201).json({
                id: this.lastID,
                nome,
            })
        }
    )
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: "O novo nome é obrigatório" });
    }

    const query = "UPDATE generos SET nome = ? WHERE id = ?";

    // Usamos 'this: any' novamente para acessar 'this.changes'
    db.run(query, [nome, id], function (this: any, erro: Error | null) {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao atualizar gênero",
                detalhes: erro.message
            });
        }

        // 'this.changes' indica quantas linhas foram modificadas
        if (this.changes === 0) {
            return res.status(404).json({ erro: "Gênero não encontrado" });
        }

        res.json({
            mensagem: "Gênero atualizado com sucesso",
            id,
            nome
        });
    });
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const query = "DELETE FROM generos WHERE id = ?";

    db.run(query, [id], function (this: any, erro: Error | null) {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao excluir gênero",
                detalhes: erro.message
            });
        }

        // Verifica se algum registro foi de fato deletado
        if (this.changes === 0) {
            return res.status(404).json({ erro: "Gênero não encontrado para exclusão" });
        }

        // Status 204 indica "No Content" (Sucesso, mas sem corpo na resposta)
        // Ou você pode usar 200 com um JSON de confirmação
        res.status(200).json({ 
            mensagem: "Gênero excluído com sucesso",
            id 
        });
    });
});

router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    db.get(
        "SELECT * FROM generos WHERE id = ?",
        [id],
        (erro, linha) => {
            if (erro) {
                return res.status(500).json(
                    {erro: "Erro ao buscar gênero"}
                );
            }

            if (!linha) {
                return res.status(404).json(
                    {erro: "Gênero não encontrado"}
                );
            }

            res.json(linha);
        }
    )
})
export default router;