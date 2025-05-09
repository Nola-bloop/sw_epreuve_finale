import query from "../models/utilisateurs.model.js"
import logs from "../controllers/log.controller.js"

//fonction pour get un UID rapidement sans se soucier du .then et du .catch
async function getUID(cle, res){
    let id = -1
    await query.obtenirIdUtilisateur(cle)
    .then((responseId) => {
        id = responseId
    }).catch((err) => {
        if (err.code === "n/a"){
            console.log(res)
            res.status(404)
        }else{
            logs.insert("Erreur lors de la recherche d'un utilisateur par sa clé d'API.", err)
            res.status(500);
        }
        res.send(err);
        return
    })

    if (id === -1) return false
    else return id
}

let module = {
    //Fonction pour créer un nouvel utilisateur
    creerUtilisateur : async function (prenom, nom, courriel, mdp, res){

        //s'assurer que le UUID est réellement unique
        let cle_api = await this.obtenirCleApiValide(res)

        query.creerUtilisateur(prenom, nom, courriel, cle_api, mdp)
        .then((_)=>{
            res.status(200);
            res.send({
                prenom: prenom,
                nom: nom,
                courriel: courriel,
                cle_api: cle_api,
                password: mdp
            });
        }).catch((err) =>{
            logs.insert("Erreur lors de la création d'un utilisateur", err)
            res.status(500);
            res.send(err);
        })
    },

    //Fonction pour changer la clé d'api
    rafraichirCleApi : async function (cle, res){
        let nouvelleCle = await this.obtenirCleApiValide(res)

        let id = await getUID(cle, res)

        await query.changerCleApi(id, nouvelleCle)
        .then((_)=>{
            console.log("then")
            res.status(200)
            res.send({
                cle_api: nouvelleCle
            })
        }).catch((err)=>{
            console.log("err")
            logs.insert("Erreur lors de la modification de la clé d'API d'un utilisateur.", err)
            res.status(500);
            res.send(err);
        })
    },

    //Fonction pour obtenir une clé d'API valide (unique)
    obtenirCleApiValide : async function (res){
        let cle_api = ""
        let valide = false

        //boucle qui crée une nouvelle clé et qui vérifie si elle est déjà présente dans la BD jusqu'à ce qu'elle en trouve une unique.
        while (!valide){
            cle_api = crypto.randomUUID()
            await query.verifierCleApi(cle_api)
            .then((out)=>{valide = out})
            .catch((err) => {
                logs.insert("Erreur lors de la validation de l'a clé d'api", err) 
                res.status(500);
                res.send(err);
            })
        }

        return cle_api
    },

    //Fonction pour la clé d'api d'un utilisateur
    obtenirCleApi : async function (courriel, mdp, res){
        let cle = ""
        await query.obtenirCleUtilisateur(courriel, mdp)
        .then((responseCle)=>{
            cle = responseCle
            res.status(200)
            res.send({
                cle_api: cle
            })
        }).catch((err)=>{
            if (err.code === "n/a"){
                res.status(404)
            }else{
                logs.insert("Erreur lors de la recherche d'un utilisateur par son courriel et mot de passe.", err)
                res.status(500);
            }
            res.send(err);
            return
        })
    }
}


export default module;