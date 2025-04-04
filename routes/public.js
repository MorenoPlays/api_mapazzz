import express from 'express'
import bycript from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async function (req,res)
{
    const userdata = req.body;
    const jwtsecret = process.env.JWT_SECRET;

    try
    {
        const user = await prisma.usuario.findUnique({where: {telefone:userdata.telefone}});

        const mathPass = await bycript.compare(userdata.password, user.password);
        if(!user || !mathPass)
            res.status(404).json({message : "usuario invalido!"});
        else
        {
            const token = jwt.sign({id: user.id}, jwtsecret, {expiresIn: "1d"})
            res.status(200).json(token);
        }
        
    }catch(error)
    {
        res.status(500).json({message: "Error".error})
    }
})

router.post('/cadastro', async function (req, res){
    const user = req.body;
    try{
        const salt = await bycript.genSalt(10);
        const encry = await bycript.hash(user.password, salt);
        
        const dadosbd = await prisma.usuario.create({
            data:{
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                password: encry
            }
        })
        res.status(201).json(dadosbd);
    }catch(error)
    {
        res.status(500).json({message: "Error".error})
    }
   
});

router.get("/buscar_aria_de_risco", async function (req, res) {
   try
   {
        const dados = await prisma.ariaDeRisco.findMany({
            select:{
                id:true,
                enderecoFormatado:true,
                chuva:true,
                temperatura:true,
                tempo:true,
                imagem:true
            }
        });
        res.json(dados);
   }
   catch(error)
   {
        res.status(500).json("error", error);
   } 
});

router.get("/buscar_analise_total", async function (req, res) {
    const   dados = req.body;
    try
    {
        const analise = await prisma.ariaDeRiscoAnalise.findMany({
            where:{
                ariaDeRiscoId:dados.ariaDeRisco
            },
            include:
            {
                ariaDeRisco:true
            }
        });
        res.json(analise.length);
    }
    catch(error)
    {

    }
})



export default router;