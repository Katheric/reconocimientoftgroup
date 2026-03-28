export const config = {
  api: {
    bodyParser: false
  }
};

import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parseando archivo:', err);
      return res.status(500).json({ error: 'Error al procesar archivo' });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        return res.status(400).json({ error: 'Archivo requerido' });
      }

      const buffer = fs.readFileSync(file.filepath);
      const base64 = buffer.toString('base64');

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'uploadImage',
          payload: {
            fileName: file.originalFilename || `upload_${Date.now()}`,
            mimeType: file.mimetype || 'application/octet-stream',
            base64,
            folder: Array.isArray(fields.folder) ? fields.folder[0] : fields.folder || '',
            type: Array.isArray(fields.type) ? fields.type[0] : fields.type || '',
            oldFileId: Array.isArray(fields.oldFileId) ? fields.oldFileId[0] : fields.oldFileId || ''
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
          error: data.error || 'No se pudo subir la imagen'
        });
      }

      return res.status(200).json({
        success: true,
        url: data.url,
        fileId: data.fileId
      });
    } catch (error: any) {
      console.error('Error en /api/upload:', error);
      return res.status(500).json({
        error: error?.message || 'Error interno al subir archivo'
      });
    }
  });
}
