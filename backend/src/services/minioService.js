const minioClient = require('../config/minio');
const bucketName = process.env.MINIO_BUCKET_NAME || 'menu-fotos';

// Inicializar bucket y políticas
const initBucket = async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            
            // Política para que las imágenes sean públicas de solo lectura
            const policy = JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: ['s3:GetObject'],
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            });
            await minioClient.setBucketPolicy(bucketName, policy);
            console.log(`Bucket '${bucketName}' creado y configurado como público.`);
        }
    } catch (error) {
        console.error('Error inicializando MinIO:', error);
    }
};

// Subir el buffer al bucket
const uploadBuffer = async (fileBuffer, fileName, mimetype) => {
    await initBucket();
    
    // Generar un nombre único para evitar sobreescribir fotos
    const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    
    await minioClient.putObject(bucketName, uniqueName, fileBuffer, fileBuffer.length, {
        'Content-Type': mimetype
    });
    
    // Retornar la URL pública directa
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || 9000;
    
    return `${protocol}://${endpoint}:${port}/${bucketName}/${uniqueName}`;
};

module.exports = { uploadBuffer };