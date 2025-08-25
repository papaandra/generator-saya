// --- PROMPT UNTUK GAYA A.C.T.A. (VIRAL) ---
const createActaPrompt = (prod) => `
  Anda adalah seorang Viral Hook Generator profesional yang menciptakan konten viral dalam format JSON.
  Anda harus menggunakan formula A.C.T.A (Attention, Craving, Tension, Action).
  - A (Attention Hammer): Pembuka video yang mengejutkan atau provokatif.
  - C (Craving Trigger): Kalimat yang menyentuh emosi audiens (frustrasi, iri hati, ketakutan).
  - T (Tension Gap): Menciptakan rasa penasaran dengan menjanjikan sebuah rahasia.
  - A (Action Word): Tutup dengan CTA yang WAJIB menggunakan Power Word "BURUAN" dan mengarah ke keranjang kuning.

  Contoh:
  Input Produk: Kursus Public Speaking
  Output yang diharapkan:
  {
    "vo": "MULUT TERKUNCI SAAT DI PANGGUNG? Bayangkan jika kamu bisa mengubah keringat dingin jadi tepuk tangan meriah. Ada satu teknik pernapasan 3 detik yang dipakai para CEO untuk menghilangkan demam panggung seketika. Teknik itu akan TERUNGKAP di keranjang kuning.",
    "caption": "Jangan lagi buang waktu grogi di panggung! Temukan rahasia yang bikin kamu percaya diri. Cek keranjang kuning untuk infonya! #publicspeaking #belajarpresentasi #suksesmuda #terungkap #rahasia"
  }
  
  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- PROMPT UNTUK GAYA HALUS (VSOFT) ---
const createHalusPrompt = (prod) => `
  Anda adalah seorang Copywriter Viral yang elegan dan persuasif.
  Anda harus menggunakan formula VSOFT (Vivid, Story, Offer, Friendly CTA) untuk membuat konten dalam format JSON.
  
  PASTIKAN VO SANGAT RINGKAS DAN PADAT (total sekitar 14-15 detik).

  Berikut adalah definisi setiap elemen formula VSOFT:
  - V (Vivid Problem): Gambarkan masalah nyata dengan bahasa yang mudah dibayangkan.
  - S (Story Touch): Sisipkan sedikit narasi atau imajinasi audiens, gunakan gaya bahasa yang personal (aku, kamu).
  - O (Offer Clarity): Tampilkan produk sebagai solusi yang jelas dan bernilai.
  - FT (Friendly CTA): Ajakan ramah, tidak memaksa, dan mengarah ke keranjang kuning, diikuti hashtag relevan.

  Contoh:
  Input Produk: Kursus Public Speaking
  Output yang diharapkan:
  {
    "vo": "Pernah merasa punya ide brilian, tapi gugup saat menyampaikannya? Bayangkan jika kamu bisa bercerita dengan tenang dan meyakinkan. Ini adalah cara untuk mencapainya.",
    "caption": "Grogi saat bicara itu wajar, tapi jangan sampai menghambat potensimu. Dengan teknik yang tepat, kamu bisa jadi lebih percaya diri. Siapa tau ini solusinya? Cek keranjang kuning! #publicspeaking #percayaDiri #komunikasi"
  }
  
  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;


// --- FUNGSI UTAMA NETLIFY ---
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan.' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Kunci API (OPENAI_API_KEY) belum diatur di Netlify.' }) };
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
          { role: 'system', content: 'You are a professional content generator who always responds in valid Indonesian language JSON format.' },
          { role: 'user', content: finalPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error dari OpenAI:', errorData);
      const errorMessage = errorData.error?.message || 'Terjadi kesalahan pada API OpenAI.';
      return { statusCode: response.status, body: JSON.stringify({ error: `Gagal memanggil API OpenAI: ${errorMessage}` }) };
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    let result = {};
    if (mode === 'both') {
      result = { vo: content.vo, caption: content.caption };
    } else if (mode === 'vo') {
      result = { vo: content.vo };
    } else if (mode === 'caption') {
      result = { caption: content.caption };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Terjadi error di Netlify Function:', error);
    return { statusCode: 500, body: JSON.stringify({ error: `Terjadi kesalahan internal: ${error.message}` }) };
  }
}
