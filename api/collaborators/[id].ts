export default async function handler(req: any, res: any) {
  const { id } = req.query;
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  try {
    if (req.method === 'PATCH') {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateCollaborator',
          id: Number(id),
          payload: req.body
        })
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo actualizar colaborador' });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteCollaborator',
          id: Number(id)
        })
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({ error: data.error || 'No se pudo eliminar colaborador' });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error(`Error en /api/collaborators/${id}:`, error);
    return res.status(500).json({ error: 'Error interno en collaborator by id' });
  }
}
