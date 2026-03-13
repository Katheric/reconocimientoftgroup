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
        action: 'bulkCreateCollaborators',
        payload: req.body
      })
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ error: data.error || 'No se pudieron importar colaboradores' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error en /api/collaborators/bulk:', error);
    return res.status(500).json({ error: 'Error interno en bulk collaborators' });
  }
}
