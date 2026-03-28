export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${appsScriptUrl}?action=getRecognitions`);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const {
        fromId,
        toId,
        valueId,
        story,
        attachmentBase64,
        attachmentFileName,
        attachmentMimeType
      } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createRecognition',
          fromId,
          toId,
          valueId,
          story,
          attachmentBase64: attachmentBase64 || '',
          attachmentFileName: attachmentFileName || '',
          attachmentMimeType: attachmentMimeType || ''
        })
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({
          error: data.error || 'No se pudo crear el reconocimiento'
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const { id, score } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setRecognitionScore',
          id: Number(id),
          payload: { score }
        })
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({
          error: data.error || 'No se pudo guardar la calificación'
        });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/recognitions:', error);
    return res.status(500).json({ error: 'Error interno en recognitions' });
  }
}
