import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file, folder = 'eswc_members') {
    try {
        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: folder,
                },
                (error, result) => {
                    if (error) {
                        return reject(error.message);
                    }
                    return resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );
            uploadStream.end(bytes);
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

// Helper for Base64 strings (which we currently receive from frontend)
export async function uploadBase64(base64String, folder = 'eswc_members') {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64String,
                {
                    folder: folder,
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) return reject(error);
                    console.log('[Cloudinary] Upload success:', {
                        resource_type: result.resource_type,
                        format: result.format,
                        url: result.secure_url
                    });
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            );
        });
    } catch (error) {
        throw error;
    }
}

// Dedicated helper for Document uploads (PDF/DOC/DOCX) — forces resource_type: 'raw'
// so the resulting URL uses raw/upload instead of image/upload
export async function uploadPdfBase64(base64String, folder = 'eswc_competition') {
    try {
        let ext = 'pdf';
        if (base64String.startsWith('data:application/msword')) {
            ext = 'doc';
        } else if (base64String.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            ext = 'docx';
        }

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64String,
                {
                    folder: folder,
                    resource_type: 'raw',
                    format: ext
                },
                (error, result) => {
                    if (error) {
                        console.error('[Cloudinary PDF] Upload error:', error);
                        return reject(error);
                    }
                    console.log('[Cloudinary PDF] Upload success:', {
                        resource_type: result.resource_type,
                        format: result.format,
                        url: result.secure_url
                    });
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            );
        });
    } catch (error) {
        console.error('[Cloudinary PDF] Unexpected error:', error);
        throw error;
    }
}
