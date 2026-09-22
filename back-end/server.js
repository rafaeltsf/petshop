import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.js';

const app = express();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== senha) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const { password, ...usuarioSemSenha } = user;

    res.json({ message: 'Login realizado com sucesso!', usuario: usuarioSemSenha });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, senha, name } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.create({
      data: { email, password: senha, name }
    });

    const { password, ...usuarioSemSenha } = user;

    res.status(201).json({ message: 'Cadastro realizado com sucesso!', usuario: usuarioSemSenha });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));