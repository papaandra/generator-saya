// ===== Util kecil untuk cek opener di server =====
function extractOpenerText(vo = "") {
  const firstSentence = (vo || "").split(/[.!?]/)[0] || "";
  return firstSentence.trim().split(/\s+/).slice(0,4).join(" ").toLowerCase();
}
function violatesAvoidList(vo, avoidList = []) {
  const opener = extractOpenerText(vo);
  return avoidList.some(s => opener.startsWith((s || "").toLowerCase()));
}

// --- ACTA (LEBIH TAJAM + ANTI-MONOTON + ANTI-ULANG) ---
const createActaPrompt = (prod, avoidList = []) => `
  Anda adalah seorang Viral Hook Generator profesional yang menciptakan konten viral dalam format JSON.
  Anda WAJIB menggunakan formula "kasar" berikut untuk hook video TikTok:
  1.  **Tombol Pattern (Play Grabber):** Gunakan kalimat pembuka yang menginterupsi scroll. Contoh: "STOP SCROLLING!", "JANGAN SKIP KALAU KAMU...", "BAYANGIN INI TERJADI KE KAMU...".
  2.  **Psychological Trigger (Forced Engagement):** Gunakan FOMO atau sentuh pain point yang relevan. Contoh: "90% orang gagal karena...", "Kalau kamu skip, kamu bakal nyesel...".
  3.  **Curiosity Gap (Click Magnet):** Tampilkan informasi setengah untuk membuat penasaran. Contoh: "Rahasianya cuma 1 hal kecil...", "Kebanyakan orang salah langkah di sini...".
  4.  **Power Word (Buy Trigger):** Sisipkan salah satu kata pemicu aksi seperti "Rahasia", "Terbukti", "Eksklusif", dan akhiri dengan CTA yang jelas ke keranjang kuning.

  /* Variasi & Anti-Monoton:
     - Hindari pola pembuka klise: "JANGAN SKIP", "STOP SCROLLING", "90% orang", "Masih ...", "Kalau kamu ...".
     - Dilarang memulai kalimat pertama dengan pembuka berikut (riwayat): ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     - Boleh sindiran, ancaman, fakta pahit, mini-drama.
     - Sertakan ≥1 detail spesifik dari produk "${prod}".
     - 4 kalimat, total ±14–15 detik (ramah TTS). */

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "STOP SCROLLING! 90% orang gak sadar kalau cara sikat gigi mereka salah. Hasilnya, napas tetap bau dan karang gigi numpuk. Rahasia gigi bersih dan napas wangi ada di satu trik eksklusif yang ada di sikat gigi ini. Cek keranjang kuning sekarang!",
    "caption": "Merasa sikat gigi udah bener tapi napas masih bau? Mungkin cara kamu salah. Temukan solusi terbuktinya di keranjang kuning! #sikatgigi #napasbau #gigiputih #racuntiktok"
  }
  
  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- HALUS (VSOFT + ANTI-MONOTON + ANTI-ULANG) ---
const createHalusPrompt = (prod, avoidList = []) => `
  Anda adalah seorang Copywriter Viral yang elegan dan persuasif.
  Anda harus menggunakan formula VSOFT (Vivid, Story, Offer, Friendly CTA) untuk membuat konten dalam format JSON.
  
  PASTIKAN VO SANGAT RINGKAS DAN PADAT (total sekitar 14-15 detik).

  Berikut adalah definisi setiap elemen formula VSOFT:
  - V (Vivid Problem): Gambarkan masalah nyata dengan bahasa yang mudah dibayangkan.
  - S (Story Touch): Sisipkan sedikit narasi atau imajinasi audiens, gunakan gaya bahasa yang personal (aku, kamu).
  - O (Offer Clarity): Tampilkan produk sebagai solusi yang jelas dan bernilai.
  - FT (Friendly CTA): Ajakan ramah, tidak memaksa, dan mengarah ke keranjang kuning, diikuti hashtag relevan.

  /* Variasi & Anti-Monoton:
     - Hindari pembuka berulang: "Apakah kamu...", "Kadang kita...", "Bayangkan...".
     - Dilarang memulai kalimat pertama dengan pembuka berikut (riwayat): ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     - Gunakan alternatif: observasi ringan, cerita kecil, refleksi personal, pertanyaan halus.
     - Sertakan ≥1 detail spesifik dari produk "${prod}". */

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

// --- VIBE (Gen Z) + ANTI-MONOTON + ANTI-ULANG ---
const createGenZPrompt = (prod, avoidList = []) => `
  Anda adalah seorang Viral Content Creator yang autentik, santai, dan menggunakan gaya bahasa anak muda (Gen Z).
  Anda harus menggunakan formula VIBE (Vibes Check, Instant Relevancy, Brevity & Punchline, Easy Action) untuk membuat konten dalam format JSON.
  
  PASTIKAN VO SANGAT RINGKAS DAN PADAT (total sekitar 14-15 detik).

  Berikut adalah definisi setiap elemen formula VIBE:
  - V (Vibes Check): Mulai dengan skenario yang relatable atau bahasa gaul (POV, spill, vibes).
  - I (Instant Relevancy): Masalah yang langsung relevan dengan audiens Gen Z.
  - B (Brevity & Punchline): Solusi disampaikan dengan sangat ringkas, padat, dan punya 'punchline'.
  - E (Easy Action): CTA santai ke keranjang kuning.

  /* Variasi & Anti-Monoton:
     - Hindari repetisi pembuka seperti "Abis ...", "POV ...".
     - Dilarang memulai kalimat pertama dengan pembuka berikut (riwayat): ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     - Variasikan diksi gaul & ritme kalimat, tetap punchy. */

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Abis makan seblak pedes banget, terus napas naga. Cuma satu sikat ini, vibes mulut auto fresh lagi. Spill produknya di keranjang kuning ya.",
    "caption": "Pusing gak sih nyari sikat gigi yang bener-bener works? Udah deh, gak usah pusing lagi. Wajib punya sih ini, langsung co aja. #napasnaga #sikatgigi #racuntiktok #xyzbca #beliditiktokshop"
  }
  
  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

/* ===================== 4 FORMULA TAMBAHAN (sekarang juga anti-ulang) ===================== */

// --- HABIT (Habit → Relate → Twist → Reveal) ---
const createHabitPrompt = (prod, avoidList = []) => `
  Anda adalah pembuat hook kategori Kebiasaan & Rutinitas Harian.
  Gunakan formula: Habit → Relate → Twist → Reveal. Balas dalam JSON valid.
  - Habit: mulai dari kebiasaan harian yang umum.
  - Relate: ajak audiens merasa "sama banget".
  - Twist: beri detail unik/cepat (tips/ritual/alat sederhana).
  - Reveal: ungkap solusi singkat terkait produk, arahkan ke keranjang kuning.

  /* Anti-ulang pembuka (riwayat):
     Dilarang memulai kalimat pertama dengan: ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     Usahakan pembuka tiap hasil berbeda ritme/diksi. */

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Ada yang sama gak, tiap pagi pasti sikat gigi sambil buru-buru? Biasanya malah jadi nggak bersih maksimal. Aku nemu cara simpel biar tetap bersih walau mepet waktu. Cek sikat ini di keranjang kuning.",
    "caption": "Rutinitas kecil yang bikin hari lebih enak. Kamu tim sikat pagi dulu atau sarapan dulu? #morningroutine #lifehack #keranjangkuning #sikatgigi #cleanhabits"
  }

  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- RELATE (Relate → Confess → Engage → CTA) ---
const createRelatePrompt = (prod, avoidList = []) => `
  Anda adalah pembuat hook "Cuma aku atau kalian juga...".
  Gunakan formula: Relate → Confess → Engage → CTA. Balas dalam JSON valid.
  - Relate: mulai dengan "cuma aku atau kalian juga..."
  - Confess: akui kebiasaan kecil/guilty pleasure terkait produk.
  - Engage: pancing komentar (tim A/B, setuju/nggak).
  - CTA: ajak coba/cek produk di keranjang kuning.

  /* Anti-ulang pembuka (riwayat):
     Dilarang memulai kalimat pertama dengan: ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     Boleh variasi: "gue doang apa...", "sering gak sih...", dll. */

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Cuma aku atau kalian juga suka skip malam ini karena capek? Besoknya langsung nyesel, napas nggak enak. Ternyata ada cara biar sikat malam jadi cepet dan gak ribet. Spill di keranjang kuning, ya.",
    "caption": "Relate gak? Tim yang rajin sikat malam atau tim mager? Comment di bawah! #relate #guiltypleasure #keranjangkuning #sikatgigi #malam"
  }

  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- MINOR (Pain → Exaggerate → Relieve → Solution) ---
const createMinorPrompt = (prod, avoidList = []) => `
  Anda adalah pembuat hook "Masalah sepele tapi nyebelin".
  Gunakan formula: Pain → Exaggerate → Relieve → Solution. Balas dalam JSON valid.
  - Pain: sebutkan masalah kecil sehari-hari.
  - Exaggerate: lebay-in sedikit (komedi ringan).
  - Relieve: gambarkan mood yang keburu rusak.
  - Solution: tampilkan produk sebagai solusi cepat, arahkan ke keranjang kuning.

  /* Anti-ulang pembuka (riwayat):
     Dilarang memulai kalimat pertama dengan: ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     Variasikan diksi keluhan: "paling ngeselin", "bikin geregetan", "auto bad mood", dst. */

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Paling nyebelin kalau habis sikat gigi tapi masih ada sisa di sela, rasanya kaya belum mandi sehari. Mood pagi auto hancur. Untung ketemu sikat yang bisa masuk sela tanpa drama. Cek keranjang kuning buat yang begini juga.",
    "caption": "Hal kecil yang ganggu, tapi ada solusinya. #masalahsepele #lifeimprovement #keranjangkuning #sikatgigi #rapi"
  }

  SEKARANG, TUGAS ANDA:
  Gunakan formula dan contoh di atas untuk produk: "${prod}".
  Jawab hanya dalam format JSON.
`;

// --- HACK (Surprise → Reveal → Hack → Invitation) ---
const createHackPrompt = (prod, avoidList = []) => `
  Anda adalah pembuat hook Life Hack/temuan tidak sengaja.
  Gunakan formula: Surprise → Reveal → Hack → Invitation. Balas dalam JSON valid.
  - Surprise: "gak sengaja nemu..." / ekspresi takjub.
  - Reveal: sebut produknya.
  - Hack: fungsi unik/tak terduga (quick win).
  - Invitation: ajak audiens untuk coba, arahkan ke keranjang kuning.

  /* Anti-ulang pembuka (riwayat):
     Dilarang memulai kalimat pertama dengan: ${avoidList.length ? avoidList.map(s=>`"${s}"`).join(", ") : "(tidak ada)"}.
     Variasikan diksi takjub: "kaget banget", "baru ngeh", "gila sih", "ternyata...". */

  Contoh:
  Input Produk: Sikat Gigi
  Output yang diharapkan:
  {
    "vo": "Gak sengaja nemu trik biar sikat gigi 30 detik tapi tetap berasa bersih. Ternyata rahasianya ada di bentuk kepala sikatnya. Jadi sudut-sudut mulut gak kelewat. Mau coba? Ada di keranjang kuning.",
    "caption": "Trik kecil, hasil kerasa. Pernah coba cara ini? #lifehack #keranjangkuning #sikatgigi #hack #bersih"
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
    const { product, mode, style = 'acta', avoidOpeners = [] } = JSON.parse(event.body || "{}");
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nama produk tidak boleh kosong.' }) };
    }

    let finalPrompt;
    if (style === 'halus') {
      finalPrompt = createHalusPrompt(product, avoidOpeners);
    } else if (style === 'genz') {
      finalPrompt = createGenZPrompt(product, avoidOpeners);
    } else if (style === 'habit') {
      finalPrompt = createHabitPrompt(product, avoidOpeners);
    } else if (style === 'relate') {
      finalPrompt = createRelatePrompt(product, avoidOpeners);
    } else if (style === 'minor') {
      finalPrompt = createMinorPrompt(product, avoidOpeners);
    } else if (style === 'hack') {
      finalPrompt = createHackPrompt(product, avoidOpeners);
    } else {
      finalPrompt = createActaPrompt(product, avoidOpeners);
    }

    // semua style kita kasih variasi ringan (biar nggak template)
    const needsMoreVar = true;

    async function callOpenAI(prompt) {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: 'system', content: 'You are a professional content generator who always responds in valid Indonesian language JSON format.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: needsMoreVar ? 1.0 : 0.9,
          top_p: needsMoreVar ? 0.92 : 1.0,
          presence_penalty: 0.6,
          frequency_penalty: 0.35,
          max_tokens: 260,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.error?.message || `OpenAI error ${res.status}`);
      }
      const data = await res.json();
      let content = {};
      try { content = JSON.parse(data.choices[0].message.content || "{}"); } catch {}
      return content;
    }

    // Panggilan pertama
    let content = await callOpenAI(finalPrompt);

    // Server-side guard: kalau opener masih melanggar, 1x retry dengan instruksi tambahan
    if (content?.vo && violatesAvoidList(content.vo, avoidOpeners)) {
      const extra = `
      Penting: Kalimat pertama VO Anda terdeteksi mirip pembuka yang dilarang.
      Ulangi output dengan PEMBUKA BERBEDA dari daftar berikut: ${avoidOpeners.map(s=>`"${s}"`).join(", ")}.
      `;
      content = await callOpenAI(finalPrompt + "\n" + extra);
    }

    const result =
      mode === 'vo' ? { vo: content.vo } :
      mode === 'caption' ? { caption: content.caption } :
      { vo: content.vo, caption: content.caption };

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: `Terjadi kesalahan internal: ${error.message}` }) };
  }
}
