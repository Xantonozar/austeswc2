// Client-side Cloudinary upload helper (browser-safe, no Node SDK).
// Uploads the raw File directly to Cloudinary so the binary never crosses Vercel.

export async function uploadFileToCloudinary(file, { folder = 'eswc_competition', resourceType = 'auto' }) {
    const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder })
    });
    const signData = await signRes.json();
    if (!signData || !signData.signature) {
        throw new Error(signData?.error || 'Failed to get Cloudinary upload signature');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', signData.folder);
    formData.append('timestamp', signData.timestamp);
    formData.append('api_key', signData.apiKey);
    formData.append('signature', signData.signature);

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`,
        { method: 'POST', body: formData }
    );

    if (!uploadRes.ok) {
        let message = 'Cloudinary upload failed';
        try {
            const err = await uploadRes.json();
            if (err?.error?.message) message = err.error.message;
        } catch { /* ignore */ }
        throw new Error(message);
    }

    const result = await uploadRes.json();
    return { url: result.secure_url, publicId: result.public_id };
}
