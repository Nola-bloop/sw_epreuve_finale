import express from "express"
import taches from "../controllers/taches.controller.js"
import utilisateurs from "../controllers/utilisateurs.controller.js"

const module = express.Router()

//obtenir la liste de toutes les tâches
module.get('/',(req, res) => {
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        //la vérification de la clé d'api se fait dans les controllers lors de la conversion de la clé en ID d'utilisateur.

        taches.listerCompositeTaches(auth, res)
    }
})

//créer une nouvelle tâche
module.post('/', (req, res) => {
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        let titre = req.body.titre
        if (!titre) {
            res.status(400)
            res.send({message:"Aucun 'titre' envoyé dans le body JSON."})
            return
        }
    
        let description = req.body.description
        if (!description){
            res.status(400)
            res.send({message:"Aucune 'description' envoyé dans le body JSON."})
            return
        }
    
        let date_echeance = req.body.date_echeance
        if (!date_echeance){
            res.status(400)
            res.send({message:"Aucune 'date_echeance' envoyé dans le body JSON."})
            return
        }
        
        taches.creerTache(auth, titre, description, date_echeance, res)
    
    }
})

module.put('/', (req, res) =>{
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        let tache_id = req.body.tache_id
        if (!tache_id) {
            res.status(400)
            res.send({message:"Aucun 'tache_id' envoyé dans le body JSON."})
            return
        }
    
        let titre = req.body.titre
        if (!titre) {
            res.status(400)
            res.send({message:"Aucun 'titre' envoyé dans le body JSON."})
            return
        }
    
        let description = req.body.description
        if (!description) {
            res.status(400)
            res.send({message:"Aucun 'description' envoyé dans le body JSON."})
            return
        }
    
        let date_echeance = req.body.date_echeance
        if (!date_echeance) {
            res.status(400)
            res.send({message:"Aucun 'date_echeance' envoyé dans le body JSON."})
            return
        }
    
        let complete = req.body.complete
        if (!complete && complete !== false) {
            res.status(400)
            res.send({message:"Aucun 'complete' envoyé dans le body JSON."})
            return
        }
    
        taches.modifierTache(auth, tache_id,titre,description,date_echeance,complete,res)
    }
})

module.delete('/', (req, res)=>{
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        let tache_id = req.body.tache_id
        if (tache_id === undefined) {
            res.status(400)
            res.send({message:"Aucun 'tache_id' envoyé dans le body JSON."})
            return
        }

        taches.supprimerTache(auth, tache_id, res);
    }
})



//routes des sous-tâches
module.post('/sous', (req, res) => {
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        let tache_id = req.body.tache_id
        if (!tache_id){
            res.status(400)
            res.send({message:"Aucune 'tache_id' envoyé dans le body JSON."})
            return
        }
    
        let titre = req.body.titre
        if (!titre){
            res.status(400)
            res.send({message:"Aucune 'titre' envoyé dans le body JSON."})
            return
        }
    
    
    
        taches.creerSousTache(auth, tache_id, titre, res)
    }
})

module.put('/sous', (req, res) => {
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        let sousTacheId = req.body.sousTacheId

        if (!sousTacheId) {
            res.status(400)
            res.send({message:"Aucun 'sousTacheId' envoyé dans le body JSON."})
            return
        }

        let titre = req.body.titre
        if (!titre) {
            res.status(400)
            res.send({message:"Aucun 'titre' envoyé dans le body JSON."})
            return
        }

        let complete = req.body.complete
        if (!complete && complete !== false) {
            res.status(400)
            res.send({message:"Aucun 'complete' envoyé dans le body JSON."})
            return
        }


        taches.modifierSousTache(auth, sousTacheId, titre, complete, res)
    }
})

module.delete('/sous', (req, res)=>{
    let auth = req.headers.authentification

    if (!auth){
        res.status(401)
        res.send({
            message: "Aucune donnée dans la clé de header 'authentification'. Une clé au format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX est nécessaire"
        })
    }else{
        let sous_tache_id = req.body.sous_tache_id
        if (sous_tache_id === undefined) {
            res.status(400)
            res.send({message:"Aucun 'sous_tache_id' envoyé dans le body JSON."})
            return
        }

        taches.supprimerSousTache(auth, sous_tache_id, res);
    }
})

export default module