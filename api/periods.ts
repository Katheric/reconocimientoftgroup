export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  try {
    if (req.method === 'POST') {
      const {
        name,
        startDate,
        endDate,
        allowedValueIds,
        allowedCollaboratorIds
      } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createPeriod',
          payload: {
            name,
            startDate,
            endDate,
            allowedValueIds: allowedValueIds || '',
            allowedCollaboratorIds: allowedCollaboratorIds || ''
          }
        })
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({
          error: data.error || 'No se pudo crear el periodo'
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const { action, id, ...rest } = req.body;

      let payload: any = null;
      let appsScriptAction = '';

      if (action === 'activate') {
        appsScriptAction = 'activatePeriod';
      } else if (action === 'update') {
        appsScriptAction = 'updatePeriod';
        payload = {
          name: rest.name,
          startDate: rest.startDate,
          endDate: rest.endDate,
          allowedValueIds: rest.allowedValueIds || '',
          allowedCollaboratorIds: rest.allowedCollaboratorIds || ''
        };
      } else {
        return res.status(400).json({ error: 'Acción inválida' });
      }

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          payload
            ? { action: appsScriptAction, id, payload }
            : { action: appsScriptAction, id }
        )
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({
          error: data.error || 'No se pudo actualizar el periodo'
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deletePeriod',
          id
        })
      });

      const data = await response.json();

      if (!data.success) {
        return res.status(400).json({
          error: data.error || 'No se pudo eliminar el periodo'
        });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/periods:', error);
    return res.status(500).json({ error: 'Error interno en periods' });
  }
}
