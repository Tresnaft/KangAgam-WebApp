import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

/**
 * Deletes multiple files and logs any errors without throwing.
 * @param {Array<Object>} files - An array of file objects from Multer.
 */
export const cleanupUploadedFiles = async (files) => {
    if (!files || files.length === 0) return;

    console.log(`Cleaning up ${files.length} uploaded file(s)...`);
    const unlinkPromises = files.map(file => unlinkAsync(file.path).catch(err => {
        // Log error but don't let it stop other deletions
        console.error(`Failed to delete file: ${file.path}`, err);
    }));

    await Promise.all(unlinkPromises);
    console.log('Cleanup complete.');
};