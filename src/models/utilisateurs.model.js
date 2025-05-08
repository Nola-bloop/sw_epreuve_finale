import db from "../config/db.js"

let module = {
    creerUtilisateur : function (prenom, nom, courriel, cle_api, mdp){
        return new Promise ((resolve, reject) => {
            db.query('INSERT INTO `utilisateur` (`nom`, `prenom`, `courriel`, `cle_api`, `password`) values (?, ?, ?, ?, ?)', [nom, prenom, courriel, cle_api, mdp], (erreur, resultat) => {
                if (erreur) {
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    resolve()
                }
            })
        })
    },
    //vérifier si la clé est unique
    verifierCleApi : function (cle_api){
        return new Promise ((resolve, reject) => {
            db.query('SELECT cle_api FROM `utilisateur` WHERE cle_api = ?', [cle_api], (erreur, resultat) => {
                if (erreur){
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    //retourne vrai si la clé d'api n'existe pas encore
                    resolve(resultat.length == 0)
                }
            })
        })
    },
    changerCleApi : function (id, cle_api){
        console.log(cle_api, id)
        return new Promise ((resolve, reject) => {
            db.query('UPDATE utilisateur SET cle_api = ? WHERE id = ?', [cle_api, id], (erreur, _) => {
                if (erreur) {
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    resolve()
                }
            })
        })
    },
    obtenirIdUtilisateur : function (cle){
        return new Promise ((resolve, reject) => {
            db.query('SELECT `id` FROM `utilisateur` WHERE `cle_api` = ?', [cle], (erreur, resultat) => {
                if (erreur) {
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    if (resultat.length === 0) {
                        reject({
                            code: "n/a",
                            message:`Aucun utilisateur avec la clé ${cle}.`
                        })
                    } else {
                        resolve(resultat[0].id);
                    }
                }
            })
        })
    },
    obtenirCleUtilisateur : function (courriel, mdp){
        return new Promise ((resolve, reject) => {
            db.query('SELECT `cle_api` FROM `utilisateur` WHERE `courriel` = ? AND `password` = ?', [courriel, mdp], (erreur, resultat) => {
                if (erreur) {
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    if (resultat.length === 0) {
                        reject({
                            code: "n/a",
                            message:`aucun utilisateur avec le courriel ${courriel} et mot de passe ${mdp}.`
                        })
                    } else {
                        resolve(resultat[0].cle_api);
                    }
                }
            })
        })
    }
}
export default module;