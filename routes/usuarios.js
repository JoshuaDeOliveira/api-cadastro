import Express from 'express';
import pool from '../DataBase/pool.js'

const rotas = Express.Router()

rotas.get('/', async (req, res) => {
    try {
        const [respostas] = await pool.query(
            `SELECT id, nome, sobrenome, idade, email, celular, endereço_completo, cpf, created_at, updated_at
            FROM usuarios`
        )

        const usuarios = respostas.length === 0 ? {
            success: true,
            system_msg: 'Nenhum usuario encontrado! Por favor, cadastrar um usuario novo!',
        } : {
            success: true,
            users: respostas,
            total: respostas.length
        };

        res.json(usuarios)
    } catch (err) {
        const erro = {
            success: false,
            message: 'Erro interno do servidor',
            error: err.message
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

        const query = await pool.query(
            `DELETE FROM usuarios WHERE id = ?`, [iduser]
        )

        const affectedRows = query[0].affectedRows

        const systemMsg = affectedRows === 0 ? 
        {success: false,status: 404 , message: 'Usuario não localizado'} 
        : 
        {success: true,status: 200 , message: 'Usuario deletado com sucesso!'};
        
        res.status(systemMsg.status).json(systemMsg)
    } catch {
        const Erro = {
            success: false,
            message: 'Houve um erro ao deletar o usuario! Por favor, verifique a estabilidade do banco ou o pedido solicitado',
            error: err.message
        }
        res.status(500).json(Erro)
    }
})

rotas.put('/atualizarusuario', async (req, res) => { //Anotação de desenvolvimento: Seguir a construção da rota de atualização de usuario
    try{
        const iduser = req.body.id
        const NomeUser = req.body.nome
        const SobrenomeUser =  req.body.sobrenome
        const SenhaUser = req.body.senha_hash
        const IdadeUser = req.body.idade
        const EmailUser = req.body.email
        const CpfUser = req.body.cpf
        const CelularUser = req.body.celular
        const EndereçoUser = req.body.endereço_completo

        const Query = await pool.query(
            `UPDATE usuarios
            SET nome = ?, sobrenome = ?, senha_hash = ?, idade = ?, email = ?, cpf = ?, celular = ?, endereço_completo = ?
            WHERE id = ?`, [NomeUser, SobrenomeUser, SenhaUser, IdadeUser, EmailUser, CpfUser, CelularUser, EndereçoUser, iduser]
        )

        const affectedRows = Query[0].affectedRows

        const SystemMsg = affectedRows === 0 ? {
            success: false,
            status: 404,
            message: 'Usuario não encontrado'
        } 
        : 
        {
            success: true,
            status: 200,
            message: 'Usuario atualizado com sucesso'
        };

        res.status(SystemMsg.status).json(SystemMsg)
    } catch (err) {
        const Error = {
            success: false,
            message: 'Houve um erro',
            error: err.message
        }

        res.status(500).json(Error)
    }
})

export default rotas