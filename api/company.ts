export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateCompany',
        payload: req.body
      })
    });

    const text = await response.text();

    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return res.status(500).json({
        error: `Apps Script devolvió una respuesta no válida: ${text || 'vacía'}`
      });
    }

    if (!response.ok || !data.success) {
      return res.status(400).json({
        error: data.error || 'No se pudo guardar la empresa'
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error en /api/company:', error);
    return res.status(500).json({
      error: error?.message || 'Error interno al guardar empresa'
    });
  }
}
