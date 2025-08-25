// Fungsi utama yang akan dieksekusi oleh Netlify
export async function handler(event) {
  // 1. Validasi Awal: Pastikan request menggunakan metode POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan.' }),
    };
  }

  // 2. Mengambil Kunci API dari Environment Variables di Netlify
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Kunci API (OPENAI_API_KEY) belum diatur di Netlify.' }),
    };
  }
  
  const apiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    // 3. Membaca data yang dikirim dari frontend
    const { product, mode } = JSON.parse(event.body);
    if (!product) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ error: 'Nama produk tidak boleh kosong.' }),
      };
    }

    // 4. MEMBUAT PROMPT DETAIL (MENGGUNAKAN FORMULA MATRIX ANDA)
    // PROMPT INI SUDAH DIKEMAS DENGAN STRUKTUR A.C.T.A. AGAR LEBIH EFEKTIF
    const createPrompt = (prod) => `
      Anda adalah seorang Viral Hook Generator profesional yang menciptakan konten viral dalam format JSON.

      Anda harus menggunakan formula A.C.T.A (Attention, Craving, Tension, Action) untuk membuat konten hook viral.
      - A (Attention Hammer): Pembuka video yang mengejutkan, memecah pola, atau provokatif. (Contoh: "STOP!", "IKLAN ANDA BONCOS?").
      - C (Craving Trigger): Kalimat yang menyentuh emosi atau masalah audiens (frustrasi, iri hati, ketakutan).
      - T (Tension Gap): Menciptakan rasa penasaran dengan menjanjikan sebuah rahasia atau solusi tanpa membocorkan intinya.
      - A (Action Word): Tutup dengan Call to Action (CTA) yang WAJIB menggunakan Power Word "TERUNGKAP".

      Berikut adalah contoh lengkap dari sebuah prompt dan output yang sempurna:
      Input Produk: Kursus Public Speaking
      Output yang diharapkan:
      {
        "vo": "MULUT TERKUNCI SAAT DI PANGGUNG? Bayangkan jika kamu bisa mengubah keringat dingin jadi tepuk tangan meriah. Ada satu teknik pernapasan 3 detik yang dipakai para CEO untuk menghilangkan demam panggung seketika. Teknik itu akan TERUNGKAP di kursus ini.",
        "caption": "Jangan lagi buang waktu grogi di panggung! Temukan rahasia yang bikin kamu percaya diri. Link di bio untuk tahu caranya! #publicspeaking #belajarpresentasi #suksesmuda #terungkap #rahasia"
      }
      
      SEKARANG, TUGAS ANDA:
      Gunakan formula dan contoh di atas untuk produk: "${prod}".
      Jawab hanya dalam format JSON seperti contoh di atas. Jangan tambahkan teks lain di luar JSON.
      `;

    // 5. Mengirim Request ke API OpenAI
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: 'system', content: 'You are a Viral Hook Generator expert who always responds in valid Indonesian language JSON format.' },
          { role: 'user', content: createPrompt(product) }
        ],
        // Memaksa OpenAI membalas dengan JSON
        response_format: { type: "json_object" },
        temperature: 0.9, // Dibuat lebih kreatif sesuai prompt asli Anda
        max_tokens: 250,
      }),
    });

    // 6. Menangani error dari API OpenAI
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error dari OpenAI:', errorData);
      const errorMessage = errorData.error?.message || 'Terjadi kesalahan pada API OpenAI.';
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Gagal memanggil API OpenAI: ${errorMessage}` }),
      };
    }

    // 7. Mem-parsing hasil dari OpenAI
    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    // Menentukan data apa yang akan dikirim kembali berdasarkan 'mode'
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
    // 8. Menangani error umum
    console.error('Terjadi error di Netlify Function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Terjadi kesalahan internal: ${error.message}` }),
    };
  }
}
