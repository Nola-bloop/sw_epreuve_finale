import db from "../config/db.js"

let module = {
    listerTachesUtilisateur : function (id){
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, titre, description, date_debut, date_echeance, complete FROM tache WHERE utilisateur_id = $1',
                [id],
                (erreur, resultat) => {
                    if (erreur) {
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        resolve(resultat.rows)
                    }
                }
            )
        })
    },

    listerSousTachesUtilisateur : function (id){
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT sous_tache.id, sous_tache.tache_id, sous_tache.titre, sous_tache.complete FROM sous_tache INNER JOIN tache ON tache.id = sous_tache.tache_id WHERE tache.utilisateur_id = $1',
                [id],
                (erreur, resultat) => {
                    if (erreur) {
                        reject({
                            erreur: "Erreur du serveur",
                            code: erreur.code,
                            message: erreur.message
                        })
                    } else {
                        resolve(resultat.rows)
                    }
                }
            )
        })
    },

    creerTache: function (userId, titre, description, date_echeance){
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO tache (utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES ($1, $2, $3, NOW(), $4, false)',
                [userId, titre, description, date_echeance],
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

    creerSousTache: function (tache_id, titre){
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO sous_tache (tache_id, titre, complete) VALUES ($1, $2, false)',
                [tache_id, titre],
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

    modifierTache: function (uid, tacheId, titre, description, date_echeance, complete){
        if (complete === 0) {complete = false} 
        if (complete === 1) {complete = true}


        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE tache SET titre = $1, description = $2, date_echeance = $3, complete = $4 WHERE id = $5 AND utilisateur_id = $6',
                [titre, description, date_echeance, complete, tacheId, uid],
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

    modifierSousTache: function (uid, sousTacheId, titre, complete){
        if (complete === 0) {complete = false} 
        if (complete === 1) {complete = true}
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE sous_tache
                 SET titre = $1, complete = $2
                 FROM tache
                 WHERE sous_tache.tache_id = tache.id AND sous_tache.id = $3 AND tache.utilisateur_id = $4`,
                [titre, complete, sousTacheId, uid],
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

    supprimerTache: function (uid, tacheId){
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM tache WHERE id = $1 AND utilisateur_id = $2',
                [tacheId, uid],
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

    supprimerSousTache: function (uid, sousTacheId){
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM sous_tache
                 USING tache
                 WHERE sous_tache.tache_id = tache.id AND sous_tache.id = $1 AND tache.utilisateur_id = $2`,
                [sousTacheId, uid],
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
    }
}

export default module
