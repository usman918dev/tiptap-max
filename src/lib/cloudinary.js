/**
 * Mock Cloudinary upload for demo purposes
 * Replace this with actual Cloudinary implementation when deploying
 */
export async function uploadToCloudinary(file, folder = 'uploads') {
    return new Promise((resolve) => {
        // Simulate upload delay
        setTimeout(() => {
            // Create a local object URL for demo
            const url = URL.createObjectURL(file);
            resolve({
                success: true,
                url: url,
                publicId: `demo-${Date.now()}`,
                folder: folder,
            });
        }, 1500);
    });
}
