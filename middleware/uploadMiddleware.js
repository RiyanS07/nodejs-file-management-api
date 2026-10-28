const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

//configuring multer 
const storage = multer.diskStorage({  //configures saving file to disk
    destination: (req,file,cb) => {     //tells multer which folder to use
        cb(null, uploadDir);       //cb is callback used by multer to repost dest or fname
    },

    filename: (req,file,cb) =>{   //creates unique file name
        const uniqueName = Date.now() + "-" + path.basename(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  //limit upto 5mb
    }
});

module.exports = upload;