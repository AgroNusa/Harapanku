/**
 * TumbuhKembang.id - Data Bank Skrining Pediatrik
 * Mengintegrasikan Norma Denver Developmental Screening Test II (Denver II)
 * dan Triase M-CHAT-R/F (Modified Checklist for Autism in Toddlers with Follow-Up).
 */

const SCREENING_DATA = {
  // 8 Pertanyaan Utama (Core Milestone Items)
  questions: [
    {
      id: "q1",
      pillar: "wicara",
      pillarName: "Wicara & Komunikasi",
      domainBadge: "💬 Wicara & Komunikasi Sosial",
      milestoneBadge: "Denver II & M-CHAT-R/F Triase",
      title: "Apakah [Nama Anak] pernah menunjuk benda menarik hanya untuk memperlihatkannya kepada Ayah/Bunda?",
      example: "Menunjuk pesawat terbang di langit lalu memastikan Ayah/Bunda melihat ke arah pesawat tersebut, bukan sekadar menunjuk botol susu saat ia lapar atau minta diambilkan mainan.",
      icon: "👆",
      estimatedSeconds: 45,
      isSocialCritical: true, // Trigger adaptif M-CHAT-R/F jika Belum Terlihat
      mchatFollowUpId: "mchat_q1_followup",
      miniGame: {
        title: "Eksperimen 'Lihat Itu!' (60 Detik)",
        materials: "1 mainan favorit atau boneka bersuara",
        steps: [
          "Dudukkan [Nama Anak] santai di dekat Ayah atau Bunda.",
          "Letakkan boneka atau mainan bersuara di seberang ruangan (jarak 2-3 meter).",
          "Tunjuk ke arah mainan dengan antusias: 'Wah, lihat itu apa ya!' tanpa langsung bergerak mengambilnya.",
          "Amati: Apakah si Kecil menoleh ke arah yang ditunjuk, lalu kembali menatap mata Anda sambil ikut menunjuk atau tersenyum?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 animate-bounce mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Gestur Proto-Deklaratif
        </span>
      `
    },
    {
      id: "q2",
      pillar: "wicara",
      pillarName: "Wicara & Bahasa",
      domainBadge: "🗣️ Bahasa Ekspresif",
      milestoneBadge: "Denver II Bahasa & Kosa Kata",
      title: "Berapa banyak kata bermakna yang sudah bisa diucapkan [Nama Anak] selain memanggil 'Mama' atau 'Papa'?",
      example: "Menyebut 'susu', 'makan', 'bola', 'kucing', 'mobil' secara konsisten saat menunjuk objek yang tepat, bukan hanya ocehan tanpa arti (babbling).",
      icon: "💬",
      estimatedSeconds: 40,
      isSocialCritical: false,
      miniGame: {
        title: "Tebak Suara Hewan & Objek (60 Detik)",
        materials: "Buku gambar atau mainan hewan sederhana",
        steps: [
          "Buka halaman dengan gambar kucing, sapi, atau mobil.",
          "Tanya dengan nada riang: 'Kucing bunyinya gimana ya, sayang?'",
          "Beri jeda 5 detik tanpa menyela jawaban si Kecil.",
          "Amati: Apakah anak mencoba meniru suara ('meow', 'moo') atau menyebut nama objeknya?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Artikulasi Kosa Kata Aktif
        </span>
      `
    },
    {
      id: "q3",
      pillar: "wicara",
      pillarName: "Wicara & Bahasa",
      domainBadge: "👂 Bahasa Reseptif",
      milestoneBadge: "Denver II Pemahaman Bahasa",
      title: "Apakah [Nama Anak] memahami dan mau mengikuti instruksi sederhana 1-langkah tanpa Ayah/Bunda perlu memberi isyarat tangan?",
      example: "Misal ketika Bunda berkata: 'Tolong bawa bola itu ke sini' atau 'Ayo pakai sepatunya' tanpa Bunda menunjuk ke arah bola atau sepatu tersebut.",
      icon: "📦",
      estimatedSeconds: 40,
      isSocialCritical: false,
      miniGame: {
        title: "Misi Rahasia 'Tolong Bunda' (60 Detik)",
        materials: "1 cangkir plastik atau mainan kecil di meja",
        steps: [
          "Pastikan tangan Bunda berada di samping badan (jangan menunjuk sama sekali).",
          "Katakan dengan jelas dan senyum: '[Nama Anak], tolong ambilkan cangkir itu ya.'",
          "Amati: Apakah si Kecil memahami arti instruksi verbal semata dan melangkah menuju benda yang diminta?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Pemahaman Reseptif Verbal
        </span>
      `
    },
    {
      id: "q4",
      pillar: "okupasi",
      pillarName: "Okupasi & Sensori",
      domainBadge: "🔊 Auditori & Modulasi Sensori",
      milestoneBadge: "Sensory Processing Triase",
      title: "Bagaimana respons [Nama Anak] saat mendengar suara rumah tangga yang cukup bising (seperti blender, vacuum cleaner, atau hair dryer)?",
      example: "Menangis histeris berkepanjangan, menutup telinga panik, atau gemetar ketakutan meski alat menyala dari jarak aman.",
      icon: "🎧",
      estimatedSeconds: 45,
      isSocialCritical: false,
      miniGame: {
        title: "Tes Nada Bunyi Berirama (60 Detik)",
        materials: "Sendok dan mangkuk logam",
        steps: [
          "Ketukkan sendok ke mangkuk dengan suara sedang berjarak 1 meter dari anak.",
          "Perhatikan bahasa tubuh: Apakah anak menunjukkan rasa ingin tahu, atau justru menjerit kaget dengan reaksi motorik panik berlebih?",
          "Catatan: Reaksi kaget sejenak adalah normal; panik histeris berulang menandakan sensitivitas auditori."
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Toleransi Rangsang Suara
        </span>
      `
    },
    {
      id: "q5",
      pillar: "okupasi",
      pillarName: "Okupasi & Sensori",
      domainBadge: "🖐️ Integrasi Taktil & Sentuhan",
      milestoneBadge: "Sensory Modulation & Okupasi",
      title: "Apakah [Nama Anak] merasa nyaman menyentuh berbagai macam tekstur (seperti rumput, pasir, cat air, adonan tepung, atau label pakaian)?",
      example: "Anak yang sangat sensitif (tactile defensiveness) biasanya menolak keras menginjak rumput tanpa alas kaki, enggan tangan kotor/lengket, atau rewel ekstrem dengan kerah/tag baju.",
      icon: "🌾",
      estimatedSeconds: 45,
      isSocialCritical: false,
      miniGame: {
        title: "Eksplorasi Sentuhan 'Tangan Penjelajah' (60 Detik)",
        materials: "Sedikit air hangat atau tepung terigu di wadah kecil",
        steps: [
          "Ajak anak menyentuh permukaan tepung atau air hangat bersama Bunda.",
          "Katakan: 'Wah, lembut sekali ya rasanya!'",
          "Amati: Apakah anak mau menyentuh dengan telapak tangannya atau segera mengelap tangannya dengan ekspresi gelisah berlebihan?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Modulasi Sistem Taktil
        </span>
      `
    },
    {
      id: "q6",
      pillar: "okupasi",
      pillarName: "Okupasi & Sensori",
      domainBadge: "🧩 Motorik Halus & Koordinasi",
      milestoneBadge: "Denver II Motorik Halus Adaptif",
      title: "Apakah [Nama Anak] mampu menjepit benda kecil (seperti kismis, remah biskuit, atau kancing besar) menggunakan ujung ibu jari dan telunjuk (pincer grasp)?",
      example: "Mengambil makanan ringan satu per satu menggunakan ujung dua jari dengan rapi, bukan menyekop dengan seluruh genggaman telapak tangan (palmar grasp).",
      icon: "🤏",
      estimatedSeconds: 35,
      isSocialCritical: false,
      miniGame: {
        title: "Menjimpit Remah Biskuit (60 Detik)",
        materials: "1 keping biskuit yang dipatahkan kecil seukuran kacang",
        steps: [
          "Letakkan 2 potongan kecil biskuit di atas meja bersih di hadapan anak.",
          "Katakan: 'Ayo ambil kuenya, Arka.'",
          "Amati gerakan jarinya: Apakah ia menggunakan ujung ibu jari & telunjuk (pincer grasp yang matang) atau menggenggam dengan seluruh tangan?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Pincer Grasp (Jepit 2 Jari)
        </span>
      `
    },
    {
      id: "q7",
      pillar: "perilaku",
      pillarName: "Perilaku & Interaksi",
      domainBadge: "👀 Kontak Mata & Senyum Sosial",
      milestoneBadge: "Denver II & M-CHAT-R/F Sosial",
      title: "Ketika Ayah/Bunda berbicara, tersenyum, atau bermain bersama [Nama Anak], apakah ia membalas menatap mata dengan hangat?",
      example: "Mempertahankan kontak mata setidaknya beberapa detik saat diajak tertawa, bukan menghindar atau pandangannya melayang seolah melihat menembus orang di depannya.",
      icon: "👁️",
      estimatedSeconds: 40,
      isSocialCritical: true, // Critical M-CHAT
      mchatFollowUpId: "mchat_q7_followup",
      miniGame: {
        title: "Bermain Ci-Luk-Ba Selevel Mata (60 Detik)",
        materials: "Kain saputangan atau kedua telapak tangan Bunda",
        steps: [
          "Turunkan posisi kepala Bunda agar sejajar persis dengan ketinggian mata anak.",
          "Tutup wajah dengan tangan, lalu buka dengan gembira: 'Ci-luk... Ba!'",
          "Amati: Apakah si Kecil langsung mencari tatapan mata Bunda dan membalas senyuman secara sinkron?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Timbal Balik Emosi Sosial
        </span>
      `
    },
    {
      id: "q8",
      pillar: "perilaku",
      pillarName: "Perilaku & Interaksi",
      domainBadge: "👂 Respon Panggilan Nama",
      milestoneBadge: "M-CHAT-R/F Critical Indicator #1",
      title: "Apakah [Nama Anak] langsung menoleh atau merespons ketika namanya dipanggil dari arah samping atau belakang?",
      example: "Menoleh mencari sumber suara saat dipanggil dalam suasana tenang (bukan saat sedang asyik menonton layar TV/gadget yang menyita perhatian).",
      icon: "🔔",
      estimatedSeconds: 40,
      isSocialCritical: true, // Critical M-CHAT
      mchatFollowUpId: "mchat_q8_followup",
      miniGame: {
        title: "Panggilan Santai Tanpa Sentuhan (60 Detik)",
        materials: "Kondisi ruangan tenang (matikan TV/gawai)",
        steps: [
          "Posisikan diri Bunda di belakang atau samping anak (jarak ~1.5 meter).",
          "Panggil namanya dengan nada lembut alami: '[Nama Anak]...'",
          "Jangan menyentuh pundaknya atau melambaikan tangan di depannya.",
          "Amati: Apakah si Kecil memutar kepalanya ke arah Bunda dalam 1-2 kali panggilan?"
        ]
      },
      illustrationSvg: `
        <svg class="w-14 h-14 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Atensi Terhadap Nama
        </span>
      `
    }
  ],

  // Adaptive Follow-up Protocol Questions (M-CHAT-R/F)
  mchatFollowUps: {
    mchat_q1_followup: {
      id: "mchat_q1_followup",
      parentQuestionId: "q1",
      pillar: "perilaku",
      title: "Langkah Tambahan (M-CHAT-R/F): Bagaimana cara si Kecil meminta bantuan Ayah/Bunda?",
      context: "Saat si Kecil menginginkan benda yang tidak bisa ia raih sendiri (misal camilan di meja tinggi), apa yang biasanya ia lakukan?",
      options: [
        { label: "Menarik tangan Ayah/Bunda ke arah benda sambil menatap wajah Anda", scoreValue: "optimal" },
        { label: "Menangis atau berteriak di dekat benda tanpa menatap mata Anda", scoreValue: "monitoring" },
        { label: "Menggunakan tangan Ayah/Bunda seolah sebagai 'alat/benda' mekanik tanpa kontak mata", scoreValue: "alert" }
      ]
    },
    mchat_q7_followup: {
      id: "mchat_q7_followup",
      parentQuestionId: "q7",
      pillar: "perilaku",
      title: "Langkah Tambahan (M-CHAT-R/F): Apakah kontak mata muncul saat si Kecil gembira?",
      context: "Saat bermain hal yang sangat ia sukai (seperti digelitik atau dilempar pelan ke kasur), apakah si Kecil menatap mata Anda untuk meminta mainan diulang kembali?",
      options: [
        { label: "Ya, selalu mencari tatapan mata untuk minta diulang", scoreValue: "optimal" },
        { label: "Terkadang, lebih fokus pada aktivitasnya daripada orangnya", scoreValue: "monitoring" },
        { label: "Jarang atau tidak pernah menatap mata", scoreValue: "alert" }
      ]
    },
    mchat_q8_followup: {
      id: "mchat_q8_followup",
      parentQuestionId: "q8",
      pillar: "perilaku",
      title: "Langkah Tambahan (M-CHAT-R/F): Respon terhadap suara menarik lainnya?",
      context: "Jika [Nama Anak] tidak menoleh saat dipanggil namanya, apakah ia menoleh bila mendengar suara bungkus makanan dibuka atau bel pintu?",
      options: [
        { label: "Ya, langsung menoleh cepat bila suara camilan / bel pintu", scoreValue: "selective_attention" },
        { label: "Terkadang tidak merespons suara apapun (perlu cek pendengaran THT)", scoreValue: "check_hearing" },
        { label: "Sama sekali tidak merespons panggilan maupun suara sekitar", scoreValue: "alert" }
      ]
    }
  },

  // Roadmap Stimulasi Mandiri 14 Hari (Spesifik 3 Pilar)
  roadmapItems: {
    wicara: [
      {
        dayRange: "Hari 1 - 4",
        technique: "Teknik Narasi 'Self-Talk' (15 Menit/Hari)",
        description: "Ucapkan setiap kegiatan yang Bunda lakukan bersama anak dengan kalimat pendek berirama: 'Bunda kupas pisang, potong kecil, suap ke mulut Arka. Nyam!' Hindari mengetes anak berulang kali ('ini apa?'); fokuslah membanjiri telinganya dengan kosa kata yang relevan.",
        badge: "Stimulasi Bahasa Reseptif"
      },
      {
        dayRange: "Hari 5 - 8",
        technique: "Menunda Respon (Teknik Sabotase Positif)",
        description: "Saat anak meraih tangan Anda untuk meminta biskuit, jangan langsung memberikannya seketika. Beri jeda 3 detik, posisikan biskuit sejajar dengan mata Bunda, tunjuk bersama sambil ucapkan: 'Mau roti? Rooo-ti...'. Beri apresiasi saat ada upaya suara sekecil apapun.",
        badge: "Inisiatif Bahasa Ekspresif"
      },
      {
        dayRange: "Hari 9 - 14",
        technique: "Buku Bergambar Tebal & Tiruan Suara Onomatope",
        description: "Gunakan buku bergambar hewan atau kendaraan. Fokuslah pada tiruan bunyi sederhana ('Mooo', 'Brummm', 'Piu-piu') yang jauh lebih mudah ditiru pita suara balita daripada kata lengkap.",
        badge: "Artikulasi Fonem Awal"
      }
    ],
    okupasi: [
      {
        dayRange: "Hari 1 - 4",
        technique: "Sensory Bin 'Beras Warna & Sendok Takar' (Screen-Free)",
        description: "Sediakan wadah berisi beras kering yang diwarnai pewarna makanan aman. Sembunyikan balok kecil di dalamnya. Biarkan anak merogoh, menyendok, dan menuang. Aktivitas ini menstimulasi modulasi taktil dan koordinasi dua belah tangan.",
        badge: "Regulasi Sensori Taktil"
      },
      {
        dayRange: "Hari 5 - 8",
        technique: "Rintangan Bantal Karpet (Vestibular & Balance)",
        description: "Susun 3-4 bantal sofa di atas karpet. Ajak si Kecil merangkak atau melangkah di atas permukaan yang tidak rata. Menstimulasi sistem keseimbangan telinga dalam (vestibular) dan kekuatan otot inti tubuh.",
        badge: "Vestibular & Motorik Kasar"
      },
      {
        dayRange: "Hari 9 - 14",
        technique: "Pijat Taktil & Kompres Lembut Selimut (Deep Pressure)",
        description: "Setelah mandi sore, lakukan pijatan lembut dari telapak kaki ke paha menggunakan losion bayi. Gulung anak perlahan seperti 'burrito' dengan selimut lembut selama 3-5 menit untuk menenangkan sistem saraf yang mudah lelah.",
        badge: "Proprioseptif & Calming"
      }
    ],
    perilaku: [
      {
        dayRange: "Hari 1 - 4",
        technique: "Permainan Gelembung Selevel Mata (Joint Attention)",
        description: "Tiuplah gelembung sabun dekat wajah Ayah/Bunda, lalu tunggu si Kecil menatap mata Anda sebelum meniup gelembung berikutnya. Hal ini melatih siklus komunikasi dua arah (melihat objek -> melihat orang -> tersenyum bersama).",
        badge: "Atensi Bersama (M-CHAT)"
      },
      {
        dayRange: "Hari 5 - 8",
        technique: "Pemberitahuan Transisi 2 Menit (Visual Warning)",
        description: "Balita sering tantrum saat kegiatan bermain dihentikan mendadak. Berikan aba-aba jelas: 'Dua kali perosotan lagi, setelah itu kita mandi ya Arka'. Tunjukkan timer visual atau hitungan jari bersama.",
        badge: "Manajemen Emosi & Transisi"
      },
      {
        dayRange: "Hari 9 - 14",
        technique: "Bermain Cermin Ekspresi Wajah (Social Mirroring)",
        description: "Duduk bersama di depan cermin besar. Praktikkan ekspresi senang, kaget, dan lucu. Bantu si Kecil menyadari bahwa emosi dan tatapan mata adalah sarana berkomunikasi yang menyenangkan.",
        badge: "Resonansi Afektif"
      }
    ]
  },

  // Daily 14-day checklist items for interactive tracker
  dailyChecklist: [
    { day: 1, pillar: "wicara", task: "15 menit Self-Talk saat sarapan (sebutkan semua aksi & benda)" },
    { day: 2, pillar: "okupasi", task: "Eksplorasi sensory bin beras/pasta kering selama 20 menit" },
    { day: 3, pillar: "perilaku", task: "Bermain gelembung sabun selevel mata (latih kontak mata 3x)" },
    { day: 4, pillar: "wicara", task: "Membaca 1 buku bergambar hewan, tirukan 3 suara hewan" },
    { day: 5, pillar: "okupasi", task: "Rintangan bantal karpet di ruang tamu (latih keseimbangan)" },
    { day: 6, pillar: "perilaku", task: "Gunakan aba-aba transisi 2 menit sebelum tidur siang/mandi" },
    { day: 7, pillar: "wicara", task: "Latih Sabotase Positif: tunda 3 detik sebelum memberi camilan" },
    { day: 8, pillar: "okupasi", task: "Bermain adonan tepung/playdough (meremas & menjepit jempol-telunjuk)" },
    { day: 9, pillar: "perilaku", task: "Bermain cermin ekspresi wajah 10 menit bersama Ayah/Bunda" },
    { day: 10, pillar: "wicara", task: "Bermain ci-luk-ba dengan kata kejutan 'Baaa!'" },
    { day: 11, pillar: "okupasi", task: "Kompres lembut selimut (burrito roll) 5 menit sebelum tidur malam" },
    { day: 12, pillar: "perilaku", task: "Panggil nama dari arah berbeda tanpa menyentuh (evaluasi respons)" },
    { day: 13, pillar: "wicara", task: "Ajak anak memilih antara 2 benda: 'Mau apel atau biskuit?'" },
    { day: 14, pillar: "semua", task: "Evaluasi kemajuan mingguan & persiapkan catatan untuk konsultasi" }
  ],

  // Profil Psikolog Anak & Terapis Mitra Terakreditasi
  specialists: [
    {
      id: "spec-1",
      name: "Dra. Riana Puspita, M.Psi.",
      title: "Psikolog Klinis Anak & Tumbuh Kembang",
      strBadge: "STR Aktif HIMPSI",
      rating: "4.95",
      reviewsCount: 380,
      experience: "12+ Tahun",
      clinic: "Klinik Harapanku Balikpapan & Telehealth",
      specialties: ["Speech Delay", "Triase Spektrum Autisme", "Sensori Integrasi", "Regulasi Emosi Balita"],
      initials: "RP",
      teleconsultRate: "Rp 250.000 / 45 mnt",
      inClinicRate: "Rp 375.000 / 60 mnt"
    },
    {
      id: "spec-2",
      name: "Sarah Anjani, A.Md.TW",
      title: "Terapis Wicara Pediatrik",
      strBadge: "STR Aktif IKATWI",
      rating: "4.92",
      reviewsCount: 215,
      experience: "8+ Tahun",
      clinic: "Klinik Harapanku Balikpapan",
      specialties: ["Artikulasi & Oral Motor", "Keterlambatan Bicara", "Komunikasi Reseptif", "Terapi Makan (Feeding)"],
      initials: "SA",
      teleconsultRate: "Rp 200.000 / 45 mnt",
      inClinicRate: "Rp 300.000 / 60 mnt"
    },
    {
      id: "spec-3",
      name: "Dimas Wicaksono, S.Tr.Kes",
      title: "Terapis Okupasi & Sensori Integrasi",
      strBadge: "STR Aktif IOTI",
      rating: "4.90",
      reviewsCount: 190,
      experience: "7+ Tahun",
      clinic: "Klinik Harapanku Balikpapan",
      specialties: ["Sensory Processing Disorder", "Motorik Halus Pincer", "Regulasi Hiperaktif", "Kemandirian ADL"],
      initials: "DW",
      teleconsultRate: "Rp 220.000 / 45 mnt",
      inClinicRate: "Rp 325.000 / 60 mnt"
    }
  ]
};

// Export to global scope for browser SPA execution
if (typeof window !== 'undefined') {
  window.SCREENING_DATA = SCREENING_DATA;
}
