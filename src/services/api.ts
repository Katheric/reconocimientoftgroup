const API_URL = import.meta.env.VITE_API_URL;

export async function getRecognitions() {
  const res = await fetch(`${API_URL}?action=getRecognitions`);
  return res.json();
}

export async function createRecognition(payload: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "createRecognition",
      payload: payload,
    }),
  });

  return res.json();
}
