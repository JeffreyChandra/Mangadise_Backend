const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Inisialisasi Google Cloud Storage
const storage = new Storage({
    keyFilename: path.join(__dirname, 'google-credentials.json'), 
    projectId: 'mangadise-project' 
});

const bucketName = 'komik-storage';
const bucket = storage.bucket(bucketName);

module.exports = { bucket };
