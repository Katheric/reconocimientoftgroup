export default async function handler(req: any, res: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return res.status(500).json({ error: 'APPS_SCRIPT_URL no está configurada' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const response = await fetch(`${appsScriptUrl}?action=getTopNominators`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error en /api/stats/top-nominators:', error);
    return res.status(500).json({ error: 'Error interno en top nominators' });
  }
}
