import express from "express"
import utilisateurs from "../controllers/utilisateurs.controller.js"

const module = express.Router()

//création d'un utilisateur
module.post('/', (req, res) => {
    console.log(req.body)
    let prenom = req.body.prenom
    let nom = req.body.nom
    let courriel = req.body.courriel
    let pwd = req.body.password

    if (!prenom || !nom || !courriel || !pwd){
        res.status(400)
        res.send({
            erreur: "Body json incomplet.",
            code: "n/a",
            message: "Il manque une valeur pour l'inscription.",
        })
        return
    }

    utilisateurs.creerUtilisateur(prenom, nom, courriel, pwd, res)
})

//get de la clé d'api
// /api/utilisateurs?cle=3178327539842732
module.get('/', (req, res) => {
    if (req.query.cle){
        let cle = req.query.cle

        if (!cle){
            res.status(400)
            res.send({
                erreur: "La clé d'api n'a pas été envoyé.",
                code: "n/a",
                message: "Il manque une valeur pour le rafraichissement.",
            })
            return
        }

        utilisateurs.rafraichirCleApi(cle,res)
    }else{
        let courriel = req.query.courriel
        let mdp = req.query.password

        if (!courriel || !mdp){
            res.status(400)
            res.send({
                erreur: "champ courriel ou password manquant!",
                code: "n/a",
                message: "Il manque une valeur pour la connexion.",
            })
            return
        }
        utilisateurs.obtenirCleApi(courriel, mdp,res)
    }
})

export default module