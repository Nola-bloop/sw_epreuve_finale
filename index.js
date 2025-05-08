import express from "express";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve(path.dirname(''));
const options = { root: path.join(__dirname) };

import userRouter from "./src/routes/utilisateurs.route.js"
import taskRouter from "./src/routes/taches.route.js"

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/utilisateurs", userRouter)
app.use("/api/taches", taskRouter)


//Front=end=> (fait à l'aide de la documentation ci-présente: https://www.geeksforgeeks.org/express-js-res-sendfile-function/)
app.get("/", (_, res)=>{
    const fileName = './front.html';
    res.sendFile(fileName, options);
})
//==========>



app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});