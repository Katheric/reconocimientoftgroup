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
          action: 'createValue',
          payload: req.body
        })
      });

      const data = await response.json();
      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo crear el valor' });
      }
      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const { id, ...payload } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateValue',
          id: Number(id),
          payload
        })
      });

      const data = await response.json();
      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo actualizar el valor' });
      }
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteValue',
          id: Number(id)
        })
      });

      const data = await response.json();
      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo eliminar el valor' });
      }
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/values:', error);
    return res.status(500).json({ error: 'Error interno en values' });
  }
}
