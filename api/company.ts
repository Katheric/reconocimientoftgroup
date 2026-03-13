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

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ error: data.error || 'No se pudo guardar la empresa' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error en /api/company:', error);
    return res.status(500).json({ error: 'Error interno al guardar empresa' });
  }
}
