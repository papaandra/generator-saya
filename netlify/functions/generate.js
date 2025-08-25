// --- PROMPT UNTUK GAYA A.C.T.A. (VIRAL) ---
const createActaPrompt = (prod) => `
  Anda adalah seorang Viral Hook Generator profesional yang menciptakan konten viral dalam format JSON.
  Anda harus menggunakan formula A.C.T.A (Attention, Craving, Tension, Action).
  - A (Attention Hammer): Pembuka video yang mengejutkan atau provokatif.
  - C (Craving Trigger): Kalimat yang menyentuh emosi audiens (frustrasi, iri hati, ketakutan).
  - T (Tension Gap): Menciptakan rasa penasaran dengan menjanjikan sebuah rahasia.
  - A (Action Word): Tutup dengan CTA yang WAJIB menggunakan Power Word "TERUNGKAP".

  Contoh:
  Input Produk: Kursus Public Speaking
  Output yang diharapkan:
  {
    "vo": "MULUT TERKUNCI SAAT DI PANGGUNG? Bayangkan jika kamu bisa mengubah keringat dingin jadi tepuk tangan meriah. Ada satu teknik pernapasan 3 detik yang dipakai para CEO untuk menghilangkan demam panggung seketika. Teknik itu akan TERUNGKAP di kursus ini.",
    "caption": "Jangan lagi buang waktu grogi di panggung! Temukan rahasia yang bikin kamu percaya diri. Link di bio untuk tahu caranya! #publicspeaking #belajarpresentasi #suksesmuda #terungkap #rahasia"
  }
  
  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- PROMPT UNTUK GAYA HALUS (PROFESIONAL) ---
const createHalusPrompt = (prod) => `
  Anda adalah seorang Copywriter Profesional dan Brand Strategist.
  Tugas Anda adalah membuat konten yang elegan, persuasif, dan profesional dalam format JSON.

  Gunakan formula P.A.V.E (Problem, Agitate, Value, Encourage):
  - P (Problem): Mulai dengan menyebutkan masalah audiens secara halus dan penuh empati.
  - A (Agitate): Sentuh sedikit dampak dari masalah tersebut.
  - V (Value): Tawarkan produk Anda sebagai solusi yang bernilai dan berkelas.
  - E (Encourage): Tutup dengan ajakan yang ramah dan tidak memaksa untuk mempelajari lebih lanjut.

  Contoh:
  Input Produk: Kursus Public Speaking
  Output yang diharapkan:
  {
    "vo": "Apakah Anda merasa gugup saat harus berbicara di depan banyak orang? Rasa tidak percaya diri ini bisa menghambat potensi karier Anda. Bayangkan jika Anda bisa menyampaikan ide dengan tenang dan meyakinkan. Temukan caranya di dalam kursus public speaking kami.",
    "caption": "Tingkatkan kepercayaan diri dan kuasai panggung. Kursus kami dirancang untuk membantu Anda berbicara dengan lebih efektif dan profesional. Klik link di bio untuk mempelajari selengkapnya. #publicspeaking #personalgrowth #karier #komunikasi #sukses"
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
