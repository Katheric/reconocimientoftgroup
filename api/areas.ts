export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  try {
    if (req.method === 'POST') {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createArea',
          payload: req.body
        })
      });

      const data = await response.json();
      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo crear área' });
      }
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteArea',
          id: Number(id)
        })
      });

      const data = await response.json();
      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo eliminar área' });
      }
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/areas:', error);
    return res.status(500).json({ error: 'Error interno en areas' });
  }
}
