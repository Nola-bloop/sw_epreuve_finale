import fs from "fs"
import path from 'path';

const logPath = path.resolve('logfile.txt');

let module = {
    insert : function (msg, sql){
        let date = "["+new Date().toISOString()+"] "
        let sqlMsg = " ; State: " + sql.code + " ; Message: " + sql.message
        let line = "\n"+date + msg + sqlMsg
        fs.appendFile(logPath, line, function (err) {
            if (err) console.log("Impossible d'écrire dans le fichier journal. "+err)
        });
    }
}

export default module