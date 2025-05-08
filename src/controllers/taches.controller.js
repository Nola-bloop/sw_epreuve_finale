import utilisateurs from "../models/utilisateurs.model.js"
import taches from "../models/taches.model.js"
import logs from "./log.controller.js"

//fonction pour get un UID rapidement sans se soucier du .then et du .catch
async function getUID(cle, res){
    let id = -1
    await utilisateurs.obtenirIdUtilisateur(cle)
    .then((responseId) => {
        id = responseId
    }).catch((err) => {
        if (err.code === "n/a"){
            res.status(404)
        }else{
            logs.insert("Erreur lors de la recherche d'un utilisateur par son courriel et mot de passe.", err)
            res.status(500);
        }
        res.send(err);
        return
    })
    if (id === -1) return false
    else return id
}

function getTacheIndex(taches, id){
    for (let i = 0; i < taches.length; i++){
        if (taches[i].id === id)
            return i
    }
}

let module = {
    listerTachesUtilisateur : async function (cle, res, internal = false){
        //le internal me permet d'utiliser la fonction sans faire de res.send() immédiatement
        let id = await getUID(cle, res)
        if (!id) return

        let out = {}

        await taches.listerTachesUtilisateur(id)
        .then((resultats)=>{
            if (internal){
                out = resultats
            }else{
                res.status(200)
                res.send({"resultats":resultats})
            }
        }).catch((err)=>{
            logs.insert("Erreur lors de la recherche d'un utilisateur par son courriel et son mot de passe.", err)
            res.status(500)
            res.send(err)
        })

        if (internal) return out;
    },
    listerSousTachesUtilisateur : async function (cle, res, internal = false){
        //le internal me permet d'utiliser la fonction sans faire de res.send() immédiatement
        let uid = await getUID(cle, res)
        if (!uid) return

        let out = {}

        await taches.listerSousTachesUtilisateur(uid)
        .then((resultats)=>{
            if (internal){
                out = resultats
            }else{
                res.status(200)
                res.send({"resultats":resultats})
            }
        }).catch((err)=>{
            logs.insert("Erreur lors de la recherche d'un utilisateur par son courriel et son mot de passe.", err)
            res.status(500)
            res.send(err)
        })

        if (internal) return out
    },

    //fonction qui combine les taches et les sous-tâches
    listerCompositeTaches : async function (cle, res){
        let taches = await this.listerTachesUtilisateur(cle, res, true)
        if (!taches) return

        let sousTaches = await this.listerSousTachesUtilisateur(cle, res, true)
        if (!sousTaches) return

        //créer tous les tableaux
        for (let i = 0; i < taches.length; i++){
            taches[i].sousTaches = []
        }

        //remplir les nouveaux tableaux
        for (let i = 0; i < sousTaches.length; i++){
            let idx = getTacheIndex(taches, sousTaches[i].tache_id)
            taches[idx].sousTaches.push(sousTaches[i])
        }

        res.status(200)
        res.send({resultats : taches})
    },

    creerTache : async function (cle, titre, description, date_echeance, res){
        let uid = await getUID(cle, res)
        if (!uid) return

        await taches.creerTache(uid, titre, description, date_echeance)
        .then((_)=>{
            res.status(200)
            res.send({
                donnesUtilises:{
                    titre:titre,
                    description:description,
                    date_echeance:date_echeance
                },
                message: "Ajout effectué avec succès."
            })
        }).catch((err)=>{
            logs.insert("Erreur lors de la création d'une tâche.",err)
            res.status(500)
            res.send(err)
        })
    },
    creerSousTache : async function (cle, tache_id, titre, res){
        let uid = await getUID(cle, res) //plus ou moins une vérification...
        if (!uid) return

        await taches.creerSousTache(tache_id, titre)
        .then((_)=>{
            res.status(200)
            res.send({
                donnesUtilises:{
                    titre:titre,
                    tache_is:tache_id
                },
                message: "Ajout effectué avec succès."
            })
        }).catch((err)=>{
            logs.insert("Erreur lors de la création d'une sous-tâche.",err)
            res.status(500)
            res.send(err)
        })
    },
    modifierTache: async function (cle, tache_id, titre, description, date_echeance, complete, res){
        let uid = await getUID(cle, res) //plus ou moins une vérification...
        if (!uid) return

        await taches.modifierTache(uid, tache_id, titre, description, date_echeance, complete)
        .then((_)=>{
            res.status(200)
            res.send({
                donnesUtilises:{
                    titre:titre,
                    tache_is:tache_id,
                    description:description,
                    date_echeance:date_echeance,
                    complete:complete
                },
                message: "Modification effectué avec succès."
            })
        }).catch((err)=>{
            logs.insert("Erreur lors de la modification d'une tâche.",err)
            res.status(500)
            res.send(err)
        })
    },
    modifierSousTache: async function (cle, sousTacheId, titre, complete, res){
        let uid = await getUID(cle, res) //plus ou moins une vérification...
        if (!uid) return

        await taches.modifierSousTache(uid, sousTacheId, titre, complete)
        .then((_)=>{
            res.status(200)
            res.send({
                donnesUtilises:{
                    sousTacheId:sousTacheId,
                    titre:titre,
                    complete:complete
                },
                message: "Modification effectué avec succès."
            })
        }).catch((err)=>{
            logs.insert("Erreur lors de la modification d'une sous-tâche.",err)
            res.status(500)
            res.send(err)
        })
    },
    supprimerTache: async function (cle, tacheId, res){
        let uid = await getUID(cle, res) //plus ou moins une vérification...
        if (!uid) return

        await taches.supprimerTache(uid, tacheId)
        .then((_)=>{
            res.status(200)
            res.send({
                message:"Tache supprimée avec succès."
            })
        })
        .catch((err)=>{
            logs.insert("Erreur lors de la supprêssion d'une tâche.",err)
            res.status(500)
            res.send(err)
        })
    },
    supprimerSousTache: async function (cle, sousTacheId, res){
        let uid = await getUID(cle, res) //plus ou moins une vérification...
        if (!uid) return

        await taches.supprimerSousTache(uid, sousTacheId)
        .then((_)=>{
            res.status(200)
            res.send({
                message:"Tache supprimée avec succès."
            })
        })
        .catch((err)=>{
            logs.insert("Erreur lors de la supprêssion d'une sous-tâche.",err)
            res.status(500)
            res.send(err)
        })
    }
}

export default module