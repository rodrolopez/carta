const multer = require('multer');

// Usamos memoryStorage para no guardar el archivo en el disco local del server
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;