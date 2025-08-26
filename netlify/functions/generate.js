// netlify/functions/generate.js

// ======================= PROMPT BUILDERS =======================

// 1) ACTA (Viral, tajam)
const createActaPrompt = (prod) => `
Anda adalah seorang Viral Hook Generator profesional yang hanya membalas dalam JSON valid.
Gunakan formula "kasar" untuk hook video TikTok:
1) Tombol Pattern (Play Grabber) — interupsi scroll. Contoh: "STOP SCROLLING!", "JANGAN SKIP KALAU KAMU..."
2) Psychological Trigger (Forced Engagement) — FOMO / pain point relevan. Contoh: "90% orang gagal karena..."
3) Curiosity Gap (Click Magnet) — info setengah, bikin penasaran. Contoh: "Rahasianya cuma 1 hal kecil..."
4) Power Word (Buy Trigger) — kata pemicu aksi seperti "Rahasia", "Terbukti", "Eksklusif", akhiri CTA ke keranjang kuning, gunakan kata "TERUNGKAP" di kalimat akhir.

Kaidah VO: 4 kalimat pendek, total ~14–15 detik (TTS), bahasa Indonesia.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat urut sesuai formula, akhiri dengan kata TERUNGKAP dan CTA keranjang kuning.",
  "caption": "2–3 kalimat + 5 hashtag relevan (Indonesia)."
}
`;

// 2) HALUS (isi = VSOFT) — nama tetap "Halus"
const createHalusPrompt = (prod) => `
Anda adalah Copywriter Viral yang elegan. Balas HANYA JSON valid.
Gunakan formula HALUS (isi: VSOFT = Vivid, Story, Offer, Friendly CTA):
- Vivid Problem: gambarkan masalah nyata yang mudah divisualkan.
- Story Touch: sedikit narasi/imajinasi, tonenya hangat (aku/kamu).
- Offer Clarity: produk sebagai solusi jelas.
- Friendly CTA: ajakan ramah, arahkan ke keranjang kuning + hashtag.

Kaidah VO: 4 kalimat pendek, total ~14–15 detik (TTS), bahasa Indonesia.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat halus, persuasif, tetap punchy (~15 detik).",
  "caption": "2–3 kalimat hangat + 5 hashtag relevan."
}
`;

// 3) Gen Z (VIBE)
const createGenZPrompt = (prod) => `
Anda adalah Viral Content Creator gaya Gen Z. Balas HANYA JSON valid.
Formula VIBE (Vibes Check, Instant Relevancy, Brevity & Punchline, Easy Action):
- Vibes Check: pembuka relatable/gaul (POV, spill, vibes).
- Instant Relevancy: masalah yang langsung relevan buat Gen Z.
- Brevity & Punchline: solusi super ringkas + punchline.
- Easy Action: CTA santai (spill/cek keranjang kuning/wajib punya).

Kaidah VO: 4 kalimat sangat ringkas, total ~14–15 detik (TTS), bahasa Indonesia/gaul natural.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat gaul, punchy, ~15 detik.",
  "caption": "2–3 kalimat santai + 5 hashtag relevan."
}
`;

// 4) Habit & Routine (Habit → Relate → Twist → Reveal)
const createHabitPrompt = (prod) => `
Anda adalah pembuat hook kategori Kebiasaan & Rutinitas Harian. Balas HANYA JSON valid.
Formula: Habit → Relate → Twist → Reveal.
- Habit: kebiasaan umum sehari-hari
- Relate: "ada yang sama gak?" / "kalian juga gini gak?"
- Twist: detail unik/cepat (tips/ritual/alat)
- Reveal: rahasia/solusi singkat, arahkan ke keranjang kuning

Kaidah VO: 4 kalimat pendek, total ~14–15 detik (TTS), bahasa Indonesia.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat natural, ~15 detik.",
  "caption": "2–3 kalimat santai + 5 hashtag relevan."
}
`;

// 5) Relate/Confess (“Cuma Aku atau Kalian Juga?”)
const createRelatePrompt = (prod) => `
Anda adalah pembuat hook "Cuma aku atau kalian juga?". Balas HANYA JSON valid.
Formula: Relate → Confess → Engage → CTA.
- Relate: mulai dengan "cuma aku atau kalian juga..."
- Confess: ngaku kebiasaan kecil/guilty pleasure terkait produk
- Engage: pancing komentar (tim A/B, setuju/nggak)
- CTA: arahkan coba produk/cek keranjang kuning

Kaidah VO: 4 kalimat ringan, ~14–15 detik (TTS), bahasa Indonesia.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat pancing komentar, ~15 detik.",
  "caption": "2–3 kalimat mengundang interaksi + 5 hashtag."
}
`;

// 6) Minor Annoyance (Pain → Exaggerate → Relieve → Solution)
const createMinorPrompt = (prod) => `
Anda adalah pembuat hook "Masalah sepele tapi nyebelin". Balas HANYA JSON valid.
Formula: Pain → Exaggerate → Relieve → Solution.
- Pain: masalah kecil sehari-hari
- Exaggerate: lebay-in sedikit (komedi ringan)
- Relieve: mood hancur/ganggu alur hari
- Solution: hadirkan produk sebagai solusi cepat + arah keranjang kuning

Kaidah VO: 4 kalimat fun, ~14–15 detik (TTS), bahasa Indonesia.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat fun, ~15 detik.",
  "caption": "2–3 kalimat + 5 hashtag relevan."
}
`;

// 7) Life Hack (Surprise → Reveal → Hack → Invitation)
const createHackPrompt = (prod) => `
Anda adalah pembuat hook Life Hack/penemuan tidak sengaja. Balas HANYA JSON valid.
Formula: Surprise → Reveal → Hack → Invitation.
- Surprise: "gak sengaja nemu..." / ekspresi takjub
- Reveal: sebut produknya
- Hack: fungsi unik/tak terduga (quick win)
- Invitation: ajak coba sendiri, arahkan keranjang kuning

Kaidah VO: 4 kalimat, ~14–15 detik (TTS), bahasa Indonesia.
Input Produk: "${prod}"

Balas HANYA JSON:
{
  "vo": "4 kalimat menarik, ~15 detik.",
  "caption": "2–3 kalimat + 5 hashtag relevan."
}
`;

// Mapping style -> builder
const PROMPT_BUILDERS = {
  acta: createActaPrompt,
  halus: createHalusPrompt,   // isinya VSOFT, nama tetap "Halus"
  genz: createGenZPrompt,
  habit: createHabitPrompt,
  relate: createRelatePrompt,
  minor: createMinorPrompt,
  hack: createHackPrompt,
};

// ======================= HANDLER =======================
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan.' }) };
  }

  try {
    const { product, mode = 'both', style = 'acta' } = JSON.parse(event.body || '{}');

    if (!product || typeof product !== 'string' || !product.trim()) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nama produk tidak boleh kosong.' }) };
    }

    const promptBuilder = PROMPT_BUILDERS[style] || PROMPT_BUILDERS.acta;
    const finalPrompt = promptBuilder(product.trim());

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Kunci API (OPENAI_API_KEY) belum diatur di Netlify.' }) };
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        max_tokens: 300,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a professional Indonesian content generator. Only return VALID JSON with keys: vo, caption. No extra text.' },
          { role: 'user', content: finalPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      return { statusCode: resp.status, body: JSON.stringify({ error: `OpenAI error: ${err || resp.status}` }) };
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || '{}';

    // JSON guard
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { parsed = { vo: raw, caption: '' }; }

    // mode filtering
    const result =
      mode === 'vo' ? { vo: parsed.vo } :
      mode === 'caption' ? { caption: parsed.caption } :
      { vo: parsed.vo, caption: parsed.caption };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: `Terjadi kesalahan internal: ${error.message}` }) };
  }
}
