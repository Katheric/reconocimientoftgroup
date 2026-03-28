export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  const { type } = req.query;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    if (type === 'top-nominators') {
      const response = await fetch(`${appsScriptUrl}?action=getTopNominators`);
      const data = await response.json();
      return res.status(200).json(Array.isArray(data) ? data : []);
    }

    if (type === 'ambassadors') {
      const response = await fetch(`${appsScriptUrl}?action=getAmbassadors`);
      const data = await response.json();

      const normalized = Array.isArray(data)
        ? data.map((item: any, index: number) => ({
            valueId: Number(item.valueId || 0),
            valueName: item.valueName || 'Embajador',
            collabId: Number(item.collabId || item.id || index + 1),
            collabName: item.collabName || item.name || 'Sin nombre',
            collabAvatar: item.collabAvatar || item.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Embajador',
            avgScore:
              typeof item.avgScore === 'number'
                ? item.avgScore
                : typeof item.validatedCount === 'number'
                ? item.validatedCount
                : Number(item.validatedCount || 0)
          }))
        : [];

      return res.status(200).json(normalized);
    }

    return res.status(400).json({ error: 'Tipo de estadística no válido' });
  } catch (error) {
    console.error('Error en /api/stats:', error);
    return res.status(500).json({ error: 'Error interno en stats' });
  }
}
