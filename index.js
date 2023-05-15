const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");

app.use(express.json());
app.use(cors());

//Conexão com o Banco de dados
const mysql = require("mysql");

const db = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "password",
    database: "livrosmysql",
})

//Inserindo dados no Banco
app.post("/livros", (req, res) => {

    const {title,author,edicao,editora,pages,anoPublicacao} = req.body

    if(!title || !author || !edicao || !editora || !pages || !anoPublicacao){
        return res.status(422).json({msg: "Preencha todos os campos"});
    }

    const sql = `
        INSERT INTO livros (title,author,edicao,editora,pages,anoPublicacao)
        VALUES ("${title}", "${author}", "${edicao}", "${editora}", ${pages}, ${anoPublicacao})
    `;

    db.query(sql, (err, result) => {
        if(err){
            throw err;
        }

        res.json({msg: "Livro cadastrado com sucesso!", id: result.insertId});
    })
})

//Obtendo todo os dados do banco
app.get("/livros", (req, res) => {

    const sql = "select * from livros";

    db.query(sql, (err, result) => {

        if(err){
            throw err;
        }

        res.json({livros: result})
    })
})

//Pesquisando por dados específicos do banco
app.get("/livros/search", (req, res) => {

    const {title} = req.query;

    const sql = `SELECT * FROM livros WHERE title LIKE '%${title}%'`;

    db.query(sql, (err, result) => {

        if(err){
            throw err;
        }

        res.json({livros: result});
    })
})

//Editando dados do banco
app.patch("/livros/:id", (req, res) => {

    const {title,author,edicao,editora,pages,anoPublicacao} = req.body
    const {id} = req.params

    const sql = `select * from livros where id = ${id}`;

    db.query(sql, (err, result) => {

        if(err){
            throw err;
        }
        
        if(result.length === 0){
           res.status(404).json({message: "Livro não encontrado!"}); 
        }else{
            const sql = `
                UPDATE livros SET title = "${title}", author = "${author}", edicao = "${edicao}",
                editora = "${editora}",pages = ${pages}, anoPublicacao = ${anoPublicacao} WHERE id = ${id}
            `;

            db.query(sql, (err, result) => {

                if(err){
                    throw err;
                }

                res.json({message: "Livro atualizado com sucesso!"})
            })
        }

    })
})

//Deletando dados do banco
app.delete("/livros/:id", (req, res) => {

    const {id} = req.params

    const sql = `select * from livros where id = ${id}`;

    db.query(sql, (err, result) => {

        if(err){
            throw err;
        }
        
        if(result.length === 0){
           res.status(404).json({message: "Livro não encontrado!"}); 
        }else{
            const sql = `delete from livros where id = ${id}`;

            db.query(sql, (err, result) => {

                if(err){
                    throw err;
                }

                res.json({message: "Livro deletado com sucesso!"})
            })
        }

    })

})

app.listen(port, () => {
    console.log(`Servidor rodando na porta:${port}`);
})