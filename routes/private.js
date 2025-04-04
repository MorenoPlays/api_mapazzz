import express, { json } from 'express'
import { PrismaClient } from '@prisma/client'
import auth from '../middlewares/auth.js';
import e from 'express';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/listar-usuarios', auth, async function (req, res) {
    try{
        const users = await prisma.usuario.findMany({select:
            {
                nome:true,
                email:true,
                telefone:true
            }
        });
        res.status(200).json(users);
    }catch(erro){
        res.status(500),json({message: "Error"});
    }
});

router.post("/postar_aria", auth,  async function(req, res) {
    const post = req.body;
    try
    {
        const dados = await prisma.ariaDeRisco.create({
            data:
            {
                imagem: post.imagem ? post.imagem : "default",
                chuva : post.chuva,
                temperatura: post.temperatura,
                tempo: post.tempo,
                enderecoFormatado: post.endereco,
                latitude: post.latitude,
                longitude: post.longitude,
                usuarioId: req.user
            }
        });
        res.json(dados);
    }
    catch(error)
    {
        res.status(500).json({message:"error", error});
    }
});

router.post("/analisar_aria",auth, async function (req, res) {
    const dados =  req.body;
    try{
        const   analise = await prisma.ariaDeRiscoAnalise.create({
            data:{
                usuarioId:req.user,
                ariaDeRiscoId:dados.ariaDeRisco
            }
        });
        res.json(analise);
    }catch(error)
    {
        res.status(500).json({message: "error", error});
    }
});

export default router;