const db = require("../config/database");

const File = {
    create({name,type,uploaded_by,file_path}){
        return db.prepare(`
            insert into files(name,type,uploaded_by,file_path)
            values(?,?,?,?)`)
            .run(name,type,uploaded_by,file_path);
    },

    findAll(){
        return db.prepare(`
            select * from files`).all();
    },

    findById(id){
        return db.prepare(`select * from files where id = ?`)
        .get(id);
    },

    updateUploadedBy(id,uploaded_by){
        return db.prepare("update files set uploaded_by = ? where id = ?")
        .run(uploaded_by,id);
    },

    deleteById(id){
        return db.prepare(`
            delete from files where id = ?`).run(id);
    }
};

module.exports = File;