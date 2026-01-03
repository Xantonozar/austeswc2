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
        // Ensure it has the data URI prefix or add it if missing/handled elsewhere
        // But verify usually expects "data:image/png;base64,..."

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64String,
                { folder: folder },
                (error, result) => {
                    if (error) return reject(error);
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
