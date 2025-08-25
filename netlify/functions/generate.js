// --- PROMPT UNTUK GAYA A.C.T.A. (VIRAL) ---
const createActaPrompt = (prod) => `
  Anda adalah seorang Viral Hook Generator profesional yang menciptakan konten viral dalam format JSON.
  Gunakan formula A.C.T.A (Attention, Craving, Tension, Action):
  - A (Attention Hammer): Pembuka mengejutkan atau provokatif.
  - C (Craving Trigger): Sentuh emosi audiens (frustrasi, iri, takut, harapan).
  - T (Tension Gap): Buat penasaran dengan janji rahasia.
  - A (Action Word): Tutup dengan CTA wajib mengandung kata "TERUNGKAP".

  Input Produk: "${prod}"
  Output harus JSON:
  {
    "vo": "...",
    "caption": "..."
  }
`;

// --- PROMPT UNTUK GAYA FORMULA HALUS (ISI = VSOFT) ---
const createHalusPrompt = (prod) => `
  Anda adalah seorang Copywriter Viral yang elegan dan persuasif. 
  Gunakan formula HALUS (isi: VSOFT → Vivid, Story, Offer, Friendly CTA) untuk membuat konten dalam format JSON:
  - V (Vivid Problem): Gambarkan masalah nyata dengan bahasa yang mudah dibayangkan.
  - S (Story Touch): Sisipkan sedikit narasi/imajinasi audiens.
  - O (Offer Clarity): Tampilkan produk sebagai solusi jelas.
  - FT (Friendly CTA): Ajakan ramah + hashtag relevan.

  Input Produk: "${prod}"
  Output harus JSON:
  {
    "vo": "...",
    "caption": "..."
  }
`;

// --- FUNGSI UTAMA NETLIFY ---
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan.' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY belum diatur di Netlify.' }) };
  }

  const apiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const { product, mode, style = 'acta' } = JSON.parse(event.body);
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nama produk tidak boleh kosong.' }) };
    }

    let finalPrompt;
    if (style === 'halus') {
      finalPrompt = createHalusPrompt(product);
    } else {
      finalPrompt = createActaPrompt(product);
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: 'system', content: 'You are a professional content generator who always responds in valid Indonesian JSON format.' },
          { role: 'user', content: finalPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { statusCode: response.status, body: JSON.stringify({ error: errorData.error?.message }) };
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    let result = {};
    if (mode === 'both') result = { vo: content.vo, caption: content.caption };
    else if (mode === 'vo') result = { vo: content.vo };
    else if (mode === 'caption') result = { caption: content.caption };

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
