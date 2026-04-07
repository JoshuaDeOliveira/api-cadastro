import Express from 'express';
import pool from '../DataBase/pool.js'

const rotas = Express.Router()

rotas.get('/', async (req, res) => {
    try {
        const [Respostas] = await pool.query(
            `SELECT id, nome, sobrenome, idade, email, celular, endereço_completo, cpf, created_at, updated_at
            FROM usuarios`
        )

        const Usuarios = {
            sucess: true,
            users: Respostas,
            total: Respostas.length
        }

        res.json(Usuarios)
    } catch (err) {
        const erro = {
            sucess: false,
            message: 'Erro interno do servidor'
        }
        
        res.status(500).json(erro)
    }
})

rotas.post('/registrarusuario', async (req, res) => {
    try {
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

        const Sucesso = {
            success: true,
            message: 'Usuario registrado com sucesso'
        }

        res.status(201).json(Sucesso)
    } catch (err) {
        var Erro = {
            success: false,
            message: ''
        }

        if (err.code === 'ER_DUP_ENTRY') {
            switch (true) {
                case err.sqlMessage.includes('usuarios.email'):
                    Erro.message = 'Email ja esta cadastrado em outro usuario'
                    break;
                case err.sqlMessage.includes('usuarios.cpf'):
                    Erro.message = 'Cpf ja esta cadastrado em outro usuario!'
                    break;
            }
            res.status(409)
        } else {
            Erro.message = 'Erro ao registrar o usuario'
            res.status(500)
        }

        res.json(Erro)
    }
})

rotas.delete('/deletarusuario/:id', async (req, res) => {
    try {
        const iduser = req.params.id

        await pool.query(
            `DELETE FROM usuarios WHERE id = ?`, [iduser]
        )

        res.status(200).send('Usuario deletado!')
    } catch {
        const Erro = {
            sucess: false,
            message: 'Usuario não encontrado'
        }
        res.status(404).send(Erro)
    }
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