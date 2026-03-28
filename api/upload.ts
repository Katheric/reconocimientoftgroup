import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, type Fields, type Files, type File } from 'formidable';
import { readFile } from 'fs/promises';

export const config = {
  api: {
    bodyParser: false
  }
};

type ParsedForm = {
  fields: Fields;
  files: Files;
};

function parseForm(req: NextApiRequest): Promise<ParsedForm> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 15 * 1024 * 1024,
      allowEmptyFiles: false
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ fields, files });
    });
  });
}

function getSingleField(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function getSingleFile(files: Files): File | null {
  const candidate = files.file;
  if (!candidate) return null;
  return Array.isArray(candidate) ? candidate[0] : candidate;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const file = getSingleFile(files);

    if (!file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }

    if (!file.filepath) {
      return res.status(400).json({ error: 'No se pudo leer el archivo temporal' });
    }

    const mimeType = file.mimetype || 'application/octet-stream';
    const fileName = file.originalFilename || `upload_${Date.now()}`;

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        error: `Tipo de archivo no permitido: ${mimeType}. Solo se permiten imágenes y PDF.`
      });
    }

    const buffer = await readFile(file.filepath);
    const base64 = buffer.toString('base64');

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'uploadImage',
        payload: {
          fileName,
          mimeType,
          base64,
          folder: getSingleField(fields.folder),
          type: getSingleField(fields.type),
          oldFileId: getSingleField(fields.oldFileId)
        }
      })
    });

    const rawText = await response.text();
    let data: any = null;

    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('Respuesta no JSON desde Apps Script:', rawText);
      return res.status(502).json({
        error: rawText || 'Apps Script devolvió una respuesta no válida'
      });
    }

    if (!response.ok || !data.success) {
      return res.status(400).json({
        error: data.error || 'No se pudo subir el archivo'
      });
    }

    return res.status(200).json({
      success: true,
      url: data.url,
      fileId: data.fileId
    });
  } catch (error: any) {
    console.error('Error en /api/upload:', error);

    if (error?.code === 1009 || String(error?.message || '').includes('maxFileSize')) {
      return res.status(400).json({
        error: 'El archivo excede el tamaño máximo permitido de 15 MB'
      });
    }

    return res.status(500).json({
      error: error?.message || 'Error interno al subir archivo'
    });
  }
}
