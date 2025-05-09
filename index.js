import express from "express";
import dotenv from "dotenv";
import path from "path";

// Importation du module swagger-ui-express
import swaggerUi from 'swagger-ui-express';
// Le fichier qui contient la documentation au format JSON, ajustez selon votre projet
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/doc.json', 'utf8'));

// Options le l'interface, changez le titre "Demo API" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "epreuvefinale"
};

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

// La route à utiliser pour accéder au rendu visuel de la documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});