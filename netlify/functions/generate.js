// --- PROMPT UNTUK GAYA A.C.T.A. (VIRAL) ---
const createActaPrompt = (prod) => `
  Anda adalah seorang Viral Hook Generator profesional yang menciptakan konten viral dalam format JSON.
  Anda harus menggunakan formula A.C.T.A (Attention, Craving, Tension, Action).
  - A (Attention Hammer): Pembuka video yang mengejutkan atau provokatif.
  - C (Craving Trigger): Kalimat yang menyentuh emosi audiens (frustrasi, iri hati, ketakutan).
  - T (Tension Gap): Menciptakan rasa penasaran dengan menjanjikan sebuah rahasia.
  - A (Action Word): Tutup dengan CTA yang WAJIB menggunakan Power Word "TERUNGKAP" dan mengarah ke keranjang kuning.

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Stop sikat gigi pakai cara lama! Gak pede ngobrol dari dekat karena napas bau naga? Ternyata, cara sikat gigi yang diajarkan sejak SD itu salah. Rahasia sikat gigi yang benar akan TERUNGKAP di keranjang kuning.",
    "caption": "Punya masalah napas bau? Klik keranjang kuning buat solusinya! #sikatgigi #napasnaga #kesehatanmulut #terungkap #viral #fyp"
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
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Apakah Anda sering merasa gigi belum bersih sempurna? Sisa kuman bisa menyebabkan masalah gusi. Bayangkan jika setiap sikat gigi bisa terasa seperti pembersihan di dokter gigi. Koleksi kami sudah tersedia di keranjang kuning.",
    "caption": "Untuk senyum yang sehat dan percaya diri, kebersihan gigi adalah kunci. Sikat gigi kami didesain dengan teknologi terbaru untuk membersihkan hingga ke sela terdalam. Jadikan kebersihan mulut sebagai prioritas. Cek keranjang kuning sekarang. #perawatangigi #sikatgigipremium #senyumsehat #kesehatanmulut"
  }
  
  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- PROMPT BARU UNTUK GAYA GEN Z (VIBE) ---
const createGenZPrompt = (prod) => `
  Anda adalah seorang Viral Content Creator yang autentik, santai, dan menggunakan gaya bahasa anak muda (Gen Z).
  Anda harus menggunakan formula VIBE (Vibes Check, Instant Relevancy, Brevity & Punchline, Easy Action) untuk membuat konten dalam format JSON.
  
  PASTIKAN VO SANGAT RINGKAS DAN PADAT (total sekitar 14-15 detik).

  Berikut adalah definisi setiap elemen formula VIBE:
  - V (Vibes Check): Mulai dengan skenario yang relatable atau bahasa gaul.
  - I (Instant Relevancy): Masalah yang langsung relevan dengan audiens Gen Z.
  - B (Brevity & Punchline): Solusi disampaikan dengan sangat ringkas, padat, dan punya 'punchline'.
  - E (Easy Action): CTA yang santai, seperti memberi rekomendasi ke teman, dan mengarah ke keranjang kuning.

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "POV: abis makan seblak pedes banget, terus napas naga. Cuma satu sikat ini, vibes mulut auto fresh lagi. Gak pake ribet.",
    "caption": "Pusing gak sih nyari sikat gigi yang bener-bener works? Udah deh, gak usah pusing lagi. Langsung co di keranjang kuning. #napasnaga #sikatgigi #racuntiktok #xyzbca #beliditiktokshop"
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
    } else if (style === 'genz') {
      finalPrompt = createGenZPrompt(product);
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
