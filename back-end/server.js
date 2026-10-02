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

    if (!user || user.senha !== senha) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const { password, ...usuarioSemSenha } = user;

    res.json({ message: 'Login realizado com sucesso!', usuario: usuarioSemSenha });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});


app.post('/api/veterinarios', async (req, res) => {
  const { nome, cfmv, especialidade } = req.body;

  if (!nome || !cfmv) {
    return res.status(400).json({ message: 'Nome e CFMV são obrigatórios.' });
  }

  try {
    const veterinario = await prisma.veterinario.create({
      data: { nome, cfmv, especialidade: especialidade || null },
    });
    res.status(201).json(veterinario);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Já existe um veterinário com esse CFMV.' });
    }
    res.status(500).json({ message: 'Erro ao cadastrar veterinário.' });
  }
});

app.post('/api/pets', async (req, res) => {
  const { nome, especie, raca, dataNascimento, peso, sexo, observacoes } = req.body;

  if (!nome || !especie) {
    return res.status(400).json({ message: 'Nome e espécie são obrigatórios.' });
  }

  try {
    const pet = await prisma.pet.create({
      data: {
        nome,
        especie,
        raca: raca || null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        peso: peso ? parseFloat(peso) : null,
        sexo: sexo || null,
        observacoes: observacoes || null,
      },
    });
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar pet.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
});