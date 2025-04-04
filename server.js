import express from 'express';
import publicRouter from "./routes/public.js";
import privateRouter from "./routes/private.js";
import { PrismaClient } from '@prisma/client';
import auth from './middlewares/auth.js'

const app = express();

app.use(express.json());
app.use('/', publicRouter);
app.use('/', auth, privateRouter);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);

//usuario : morenoplays666
//senha: J9gv9ANLD6OvYE5e
// mongodb+srv://<db_username>:<db_password>@moreno.uxcregu.mongodb.net/?retryWrites=true&w=majority&appName=moreno