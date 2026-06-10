import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../google-drive-key.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export const uploadToDrive = async (filePath: string) => {
  const fileMetadata = {
    name: path.basename(filePath),
    parents: ['YOUR_GOOGLE_DRIVE_FOLDER_ID'],
  };

  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  return `https://drive.google.com/uc?id=${response.data.id}`;
};
