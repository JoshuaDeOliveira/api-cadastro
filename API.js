import Express from 'express';
import 'dotenv/config';
import mysql from 'mysql2/promise';

const app = Express()
const port = 3000

app.listen(port, () => {
    console.log('API online. . .!')
})

async function API(){
    try{
        const pool = mysql.createPool({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            database: process.env.DBDATABASE,
            password: process.env.DBPASSWORD, 
            waitForConnections: true, 
            connectionLimit: 10,
            queueLimit: 0
        })

        app.use(Express.json());

        app.get('/', async (req, res) => {
            const [Respostas] = await pool.query(
                `SELECT id, nome, sobrenome, idade, email, celular, endereço_completo, cpf, created_at, updated_at
                FROM usuarios`
            )
            res.send(Respostas)
        })

        app.post('/registrarusuario', async (req, res) => {

            const NomeUser = req.body.nome
            const SobrenomeUser =  req.body.sobrenome
            const SenhaUser = req.body.senha_hash
            const IdadeUser = req.body.idade
            const EmailUser = req.body.email
            const CpfUser = req.body.cpf
            const CelularUser = req.body.celular
            const EndereçoUser = req.body.endereço_completo

            await pool.query(
                `INSERT INTO usuarios (nome, sobrenome, senha_hash, idade, email, cpf, celular, endereço_completo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [NomeUser, SobrenomeUser, SenhaUser, IdadeUser, EmailUser, CpfUser, CelularUser, EndereçoUser]
            )
            res.status(201).send('Usuario registrado!')

        })

        app.delete('/deletarusuario', async (req, res) => {
            const iduser = req.body.id

            await pool.query(
                `DELETE FROM usuarios WHERE id = ?`, [iduser]
            )

            res.status(200).send('Usuario deletado!')
        })

        app.put('/atualizarusuario', async (req, res) => {
            const iduser = req.body.id
            const NomeUser = req.body.nome
            const SobrenomeUser =  req.body.sobrenome
            const SenhaUser = req.body.senha_hash
            const IdadeUser = req.body.idade
            const EmailUser = req.body.email
            const CpfUser = req.body.cpf
            const CelularUser = req.body.celular
            const EndereçoUser = req.body.endereço_completo

            await pool.query(
                `UPDATE usuarios
                SET nome = ?, sobrenome = ?, senha_hash = ?, idade = ?, email = ?, cpf = ?, celular = ?, endereço_completo = ?
                WHERE id = ?`, [NomeUser, SobrenomeUser, SenhaUser, IdadeUser, EmailUser, CpfUser, CelularUser, EndereçoUser, iduser]
            )

            res.status(200).send('Usuario Atualizado')
        })

    } catch (err) {
        console.log('Esse foi o erro encontrado')
    }
}

API()
