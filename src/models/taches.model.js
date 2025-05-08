import db from "../config/db.js"

let module = {
    listerTachesUtilisateur : function (id){
        return new Promise((resolve, reject) => {
            db.query('SELECT id, titre, description, date_debut, date_echeance, complete FROM tache WHERE utilisateur_id = ?', [id], (erreur, resultat) => {
                if (erreur) {
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    //indexes (tache):
                    //id, titre, description, date_debut, date_echeance, complete
                    resolve(resultat)
                }
            })
        })
    },
    listerSousTachesUtilisateur : function (id){
        return new Promise((resolve, reject) => {
            db.query('SELECT sous_tache.id, sous_tache.tache_id, sous_tache.titre, sous_tache.complete FROM sous_tache INNER JOIN tache ON tache.id = sous_tache.tache_id WHERE tache.utilisateur_id = ?', [id], (erreur, resultat) => {
                if (erreur) {
                    // Gestion de l'erreur serveur
                    reject({
                        erreur: "Erreur du serveur",
                        code: erreur.sqlState,
                        message: erreur.message
                    })
                }else{
                    //indexes (sous tache):
                    //id, tache_id, titre, complete
                    resolve(resultat)
                }
            })
        })
    },
    creerTache: function (userId, titre, description, date_echeance){
        return new Promise((resolve, reject) =>{
            db.query('INSERT INTO tache (utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES (?, ?, ?, NOW(), ?, 0)', [userId, titre, description, date_echeance], (erreur, resultat)=>{
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
    creerSousTache: function (tache_id, titre){
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO sous_tache (tache_id, titre, complete) VALUES (?, ?, 0)', [tache_id, titre], (erreur, _) => {
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
    modifierTache: function (uid, tacheId, titre, description, date_echeance, complete){
        return new Promise((resolve, reject) => {
            db.query('UPDATE tache SET titre = ?, description = ?, date_echeance = ?, complete = ? WHERE id = ? AND utilisateur_id = ?', [titre, description, date_echeance, complete, tacheId, uid], (erreur, resultat) => {
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
    modifierSousTache: function (uid, sousTacheId, titre, complete){
        return new Promise((resolve, reject) => {
            db.query('UPDATE sous_tache INNER JOIN tache ON tache.id = sous_tache.tache_id SET sous_tache.titre = ?, sous_tache.complete = ? WHERE sous_tache.id = ? AND tache.utilisateur_id = ?', [titre, complete, sousTacheId, uid], (erreur, resultat) => {
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
    supprimerTache: function (uid, tacheId){
        return new Promise((resolve, reject) =>{
            db.query('DELETE FROM tache WHERE id = ? AND utilisateur_id = ?', [tacheId, uid],(erreur, resultat)=>{
                if (erreur){
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
    supprimerSousTache: function (uid, sousTacheId){
        return new Promise((resolve, reject)=>{
            db.query('DELETE sous_tache FROM sous_tache INNER JOIN tache ON tache.id = sous_tache.tache_id WHERE sous_tache.id = ? AND tache.utilisateur_id = ?', [sousTacheId, uid], (erreur, resultat) =>{
                if (erreur){
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
    }
}

export default module