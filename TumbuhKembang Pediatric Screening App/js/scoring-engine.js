/**
 * TumbuhKembang.id - Mesin Penilaian (Scoring & Triage Engine)
 * Mengintegrasikan Norma Denver II & Triase M-CHAT-R/F
 * dengan Prinsip UX Empatik & Non-Stigmatisasi.
 */

const ScoringEngine = {
  /**
   * Menghitung skor perkembangan 3 pilar berdasarkan jawaban orang tua.
   * @param {Object} answers - Peta jawaban { [questionId]: 'often' | 'sometimes' | 'rare' | 'unsure' }
   * @param {Object} mchatAnswers - Jawaban pertanyaan lanjutan adaptif M-CHAT-R/F
   * @param {Object} childData - Data profil anak { name, correctedMonths, concerns }
   */
  calculate(answers = {}, mchatAnswers = {}, childData = {}) {
    const childName = childData.name || "si Kecil";
    const questions = window.SCREENING_DATA ? window.SCREENING_DATA.questions : [];

    // Bobot nilai jawaban
    // often (Sering / Sudah Mahir) = 2 poin
    // sometimes (Terkadang / Butuh Bantuan) = 1 poin
    // rare (Belum Terlihat) = 0 poin
    // unsure (Ragu / Coba Tes Dulu) = 1 poin
    const scoreMap = {
      often: 2,
      sometimes: 1,
      unsure: 1,
      rare: 0
    };

    // Akumulasi skor per pilar
    const pillarScores = {
      wicara: { raw: 0, max: 0, count: 0, fails: 0, items: [] },
      okupasi: { raw: 0, max: 0, count: 0, fails: 0, items: [] },
      perilaku: { raw: 0, max: 0, count: 0, fails: 0, items: [] }
    };

    let mchatCriticalFails = 0;
    let totalQuestionsAnswered = 0;

    questions.forEach(q => {
      const p = q.pillar;
      if (!pillarScores[p]) return;

      const userAns = answers[q.id] || "sometimes";
      const val = scoreMap[userAns] !== undefined ? scoreMap[userAns] : 1;

      pillarScores[p].raw += val;
      pillarScores[p].max += 2;
      pillarScores[p].count += 1;
      totalQuestionsAnswered++;

      if (userAns === "rare") {
        pillarScores[p].fails++;
        if (q.isSocialCritical) {
          mchatCriticalFails++;
        }
      }

      pillarScores[p].items.push({
        id: q.id,
        title: q.title,
        answer: userAns,
        score: val
      });
    });

    // Perhitungkan respons adaptive M-CHAT lanjutan jika ada
    Object.keys(mchatAnswers).forEach(followUpId => {
      const followUpAns = mchatAnswers[followUpId];
      if (followUpAns === "alert") {
        mchatCriticalFails += 1.5;
      }
    });

    // Evaluasi Status Pilar
    const results = {};

    // 1. Wicara & Bahasa
    const wicaraPct = pillarScores.wicara.max > 0 ? (pillarScores.wicara.raw / pillarScores.wicara.max) * 100 : 75;
    let wicaraStatus = "optimal";
    let wicaraStatusLabel = "Sesuai Usia Perkembangan";
    let wicaraSummary = `Penguasaan kosa kata, tiruan bunyi, dan pemahaman instruksi ${childName} berkembang seirama dengan usianya.`;
    let wicaraBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

    if (wicaraPct < 50 || pillarScores.wicara.fails >= 2) {
      wicaraStatus = "alert";
      wicaraStatusLabel = "Disarankan Observasi Ahli";
      wicaraSummary = `Inisiatif menunjuk dan ekspresi kata bermakna ${childName} masih terbatas. Dianjurkan evaluasi langsung bersama Terapis Wicara.`;
      wicaraBadgeClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
    } else if (wicaraPct < 75 || pillarScores.wicara.fails >= 1) {
      wicaraStatus = "monitoring";
      wicaraStatusLabel = "Perlu Penguatan Stimulasi";
      wicaraSummary = `${childName} sudah mulai memahami instruksi, namun membutuhkan stimulasi narasi harian untuk memperkaya artikulasi kata aktif.`;
      wicaraBadgeClass = "bg-amber-100 text-amber-800 border-amber-300";
    }

    results.wicara = {
      scorePct: Math.round(wicaraPct),
      status: wicaraStatus,
      statusLabel: wicaraStatusLabel,
      summary: wicaraSummary,
      badgeClass: wicaraBadgeClass,
      target: "20+ Kata Bermakna & Gestur Menunjuk",
      rawScore: pillarScores.wicara.raw,
      maxScore: pillarScores.wicara.max
    };

    // 2. Okupasi & Sensori
    const okupasiPct = pillarScores.okupasi.max > 0 ? (pillarScores.okupasi.raw / pillarScores.okupasi.max) * 100 : 75;
    let okupasiStatus = "optimal";
    let okupasiStatusLabel = "Sesuai Usia Perkembangan";
    let okupasiSummary = `Koordinasi motorik halus pincer grasp dan modulasi rangsang sensori taktil/suara ${childName} berada pada jalur yang baik.`;
    let okupasiBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

    if (okupasiPct < 50 || pillarScores.okupasi.fails >= 2) {
      wicaraStatus = "alert";
      okupasiStatusLabel = "Disarankan Observasi Ahli";
      okupasiSummary = `Ada indikasi hipersensitivitas pada suara keras atau keengganan taktil yang kuat, disarankan konsultasi Terapis Okupasi.`;
      okupasiBadgeClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
    } else if (okupasiPct < 75 || pillarScores.okupasi.fails >= 1) {
      okupasiStatus = "monitoring";
      okupasiStatusLabel = "Perlu Penguatan Stimulasi";
      okupasiSummary = `${childName} membutuhkan variasi eksplorasi tekstur dan latihan keseimbangan vestibular bebas gawai di rumah.`;
      okupasiBadgeClass = "bg-amber-100 text-amber-800 border-amber-300";
    }

    results.okupasi = {
      scorePct: Math.round(okupasiPct),
      status: okupasiStatus,
      statusLabel: okupasiStatusLabel,
      summary: okupasiSummary,
      badgeClass: okupasiBadgeClass,
      target: "Modulasi Sensori Tenang & Pincer Grasp Matang",
      rawScore: pillarScores.okupasi.raw,
      maxScore: pillarScores.okupasi.max
    };

    // 3. Perilaku & Interaksi (Denver II + M-CHAT-R/F)
    const perilakuPct = pillarScores.perilaku.max > 0 ? (pillarScores.perilaku.raw / pillarScores.perilaku.max) * 100 : 75;
    let perilakuStatus = "optimal";
    let perilakuStatusLabel = "Sesuai Usia Perkembangan";
    let perilakuSummary = `${childName} menunjukkan atensi sosial, respon panggilan nama, dan kontak mata yang hangat dan timbal balik.`;
    let perilakuBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
    let mchatRiskLevel = "Risiko Rendah (On-Track)";

    if (mchatCriticalFails >= 2 || perilakuPct < 50) {
      perilakuStatus = "alert";
      perilakuStatusLabel = "Disarankan Observasi Ahli";
      perilakuSummary = `Atensi bersama (joint attention) atau respon nama memerlukan pengamatan langsung bersama Psikolog Klinis Anak untuk konfirmasi dini.`;
      perilakuBadgeClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
      mchatRiskLevel = "Perlu Observasi Lanjutan Bersama Ahli";
    } else if (mchatCriticalFails >= 1 || perilakuPct < 75) {
      perilakuStatus = "monitoring";
      perilakuStatusLabel = "Perlu Penguatan Stimulasi";
      perilakuSummary = `Interaksi sosial ${childName} cukup baik, disarankan memperbanyak permainan interaksi timbal balik (tatap muka dan ci-luk-ba).`;
      perilakuBadgeClass = "bg-amber-100 text-amber-800 border-amber-300";
      mchatRiskLevel = "Risiko Sedang (Pantau Stimulasi 14 Hari)";
    }

    results.perilaku = {
      scorePct: Math.round(perilakuPct),
      status: perilakuStatus,
      statusLabel: perilakuStatusLabel,
      summary: perilakuSummary,
      badgeClass: perilakuBadgeClass,
      mchatRiskLevel,
      target: "Atensi Bersama Spontan & Regulasi Emosi Transisi",
      rawScore: pillarScores.perilaku.raw,
      maxScore: pillarScores.perilaku.max
    };

    // Kesimpulan Keseluruhan (Empathetic & Non-Stigmatizing)
    const hasAlert = results.wicara.status === "alert" || results.okupasi.status === "alert" || results.perilaku.status === "alert";
    const hasMonitoring = results.wicara.status === "monitoring" || results.okupasi.status === "monitoring" || results.perilaku.status === "monitoring";

    let overallRecommendation = "";
    let shouldRecommendConsultation = false;

    if (hasAlert) {
      overallRecommendation = `Hasil skrining menunjukkan ada aspek perkembangan ${childName} yang sangat dianjurkan untuk dikonfirmasi bersama Psikolog Anak atau Dokter Spesialis Tumbuh Kembang. Deteksi sejak dini adalah wujud cinta terbaik untuk membuka potensi maksimal si Kecil.`;
      shouldRecommendConsultation = true;
    } else if (hasMonitoring) {
      overallRecommendation = `Perkembangan ${childName} secara umum bertumbuh baik dengan beberapa area yang membutuhkan perhatian dan latihan terarah. Jalankan Roadmap Stimulasi 14 Hari di rumah untuk melihat lonjakan kemampuannya!`;
      shouldRecommendConsultation = false;
    } else {
      overallRecommendation = `Selamat Ayah & Bunda! Seluruh tonggak perkembangan ${childName} berada pada jalur yang optimal sesuai usianya. Tetap lanjutkan rutinitas bermain bermakna tanpa gawai di rumah!`;
      shouldRecommendConsultation = false;
    }

    return {
      pillars: results,
      mchatCriticalFails,
      hasAlert,
      hasMonitoring,
      overallRecommendation,
      shouldRecommendConsultation,
      evaluationDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  }
};

if (typeof window !== 'undefined') {
  window.ScoringEngine = ScoringEngine;
}
