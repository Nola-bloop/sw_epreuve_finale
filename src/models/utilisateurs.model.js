import db from "../config/db.js"

let module = {
    creerUtilisateur : function (prenom, nom, courriel, cle_api, mdp){
        return new Promise ((resolve, reject) => {
            db.query(
                'INSERT INTO utilisateur (nom, prenom, courriel, cle_api, password) VALUES ($1, $2, $3, $4, $5)',
                [nom, prenom, courriel, cle_api, mdp],
                (erreur, resultat) => {
                    if (erreur) {
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        resolve()
                    }
                }
            )
        })
    },

    verifierCleApi : function (cle_api){
        return new Promise ((resolve, reject) => {
            db.query(
                'SELECT cle_api FROM utilisateur WHERE cle_api = $1',
                [cle_api],
                (erreur, resultat) => {
                    if (erreur){
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        resolve(resultat.rows.length === 0)
                    }
                }
            )
        })
    },

    changerCleApi : function (id, cle_api){
        return new Promise ((resolve, reject) => {
            db.query(
                'UPDATE utilisateur SET cle_api = $1 WHERE id = $2',
                [cle_api, id],
                (erreur, _) => {
                    if (erreur) {
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        resolve()
                    }
                }
            )
        })
    },

    obtenirIdUtilisateur : function (cle){
        return new Promise ((resolve, reject) => {
            db.query(
                'SELECT id FROM utilisateur WHERE cle_api = $1',
                [cle],
                (erreur, resultat) => {
                    if (erreur) {
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        if (resultat.rows.length === 0) {
                            reject({
                                code: "n/a",
                                message: `Aucun utilisateur avec la clé ${cle}.`
                            })
                        } else {
                            resolve(resultat.rows[0].id)
                        }
                    }
                }
            )
        })
    },

    obtenirCleUtilisateur : function (courriel, mdp){
        return new Promise ((resolve, reject) => {
            db.query(
                'SELECT cle_api FROM utilisateur WHERE courriel = $1 AND password = $2',
                [courriel, mdp],
                (erreur, resultat) => {
                    if (erreur) {
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        if (resultat.rows.length === 0) {
                            reject({
                                code: "n/a",
                                message: `aucun utilisateur avec le courriel ${courriel} et mot de passe ${mdp}.`
                            })
                        } else {
                            resolve(resultat.rows[0].cle_api)
                        }
                    }
                }
            )
        })
    }
}

export default module
