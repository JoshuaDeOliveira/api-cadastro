import Express from 'express';
import pool from '../DataBase/pool.js'

const rotas = Express.Router()

rotas.get('/', async (req, res) => {
        const [Respostas] = await pool.query(
            `SELECT id, nome, sobrenome, idade, email, celular, endereço_completo, cpf, created_at, updated_at
                FROM usuarios`
        )
    res.send(Respostas)
})

rotas.post('/registrarusuario', async (req, res) => {
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

rotas.delete('/deletarusuario', async (req, res) => {
    const iduser = req.body.id
    await pool.query(
        `DELETE FROM usuarios WHERE id = ?`, [iduser]
    )

    res.status(200).send('Usuario deletado!')
})

rotas.put('/atualizarusuario', async (req, res) => {
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

export default rotas