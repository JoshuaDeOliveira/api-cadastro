import Express from 'express';
import 'dotenv/config';
import {TesteConexao} from './DataBase/pool.js'
import rotas from './routes/usuarios.js'

const app = Express()
const port = 3000

app.use(Express.json());
app.use('/', rotas)
const Statusdb = await TesteConexao()

if (Statusdb) {
    app.listen(port, () => {
        console.log('Conexão estabelecida com sucesso. . .!')
    })
} else {
    process.exit(1)
}
