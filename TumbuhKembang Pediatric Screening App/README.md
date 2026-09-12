# TumbuhKembang.id — Platform Skrining Tumbuh Kembang Pediatrik Empatik

Platform skrining mandiri berbasis web yang empatik, adaptif, dan non-stigmatisasi untuk deteksi dini tumbuh kembang balita (usia 18–36 bulan) di Indonesia.

Dibangun berdasarkan standar medis **Denver Developmental Screening Test II (Denver II)** dan triase **M-CHAT-R/F (Modified Checklist for Autism in Toddlers with Follow-Up)** yang dikelompokkan ke dalam **3 Pilar Perkembangan**:
1. **🗣️ Wicara & Bahasa** (*Speech & Communication*)
2. **🧩 Okupasi & Sensori** (*Occupational & Sensory Integration*)
3. **🧸 Perilaku & Interaksi** (*Behavior & Socio-emotional*)

---

## Fitur Utama

### 1. Kalkulator Usia Koreksi Prematur (Denver II Standard)
- Perhitungan akurat usia kronologis (kalender) vs usia gestasi.
- Rumus Denver II:
  $$\text{Defisit Gestasi (Minggu)} = 40 - \text{Usia Gestasi}$$
  $$\text{Usia Koreksi} = \text{Usia Kronologis (Hari)} - (\text{Defisit Gestasi} \times 7)$$
- Diterapkan otomatis pada anak di bawah usia 24 bulan untuk menghindari *false alarm* keterlambatan tumbuh kembang.
- Klasifikasi medis gestasi: *Ekstrem (<28 mgg), Sangat Prematur (28-31 mgg), Prematur Sedang (32-33 mgg), Late Preterm (34-36 mgg)*.

### 2. Mesin Skrining Adaptif (Adaptive Denver II & M-CHAT-R/F Loop)
- Bank pertanyaan interaktif dengan injeksi nama panggilan anak secara dinamis.
- 4 Opsi Jawaban:
  - `(A) Sering / Sudah Mahir` (Optimal)
  - `(B) Terkadang / Masih Butuh Bantuan` (Stimulasi)
  - `(C) Belum Terlihat` (Perlu Pantauan)
  - `(?) Ragu / Ingin Coba Tes Dulu` -> Membuka laci mini-game 60 detik.
- **In-Situ Interactive Mini-Games**: Panduan eksperimen bermain langsung 1 menit di rumah dengan stopwatch bawaan untuk menguji reaksi anak seketika.
- **Adaptive Branching M-CHAT-R/F**: Jika orang tua memilih "Belum Terlihat" pada butir sosial/komunikasi (*joint attention* / respon nama), engine memunculkan sub-tree pertanyaan konfirmasi lanjutan secara transparan dan tanpa kepanikan.

### 3. Visualisasi 3 Pilar & Roadmap Stimulasi Rumahan 14 Hari
- Kartu ringkasan 3 pilar dengan indikator empatik:
  - *Soft Emerald (#0D9488)*: Sesuai Usia Perkembangan (On-track)
  - *Warm Amber (#F59E0B)*: Perlu Penguatan Stimulasi
  - *Soft Indigo (#6366F1)*: Disarankan Observasi Ahli (menghindari warna merah peringatan yang menakutkan).
- Panduan terapis rumahan: teknik *Self-Talk*, *Sabotase Positif*, *Sensory Bin*, dan *Visual Warning Transisi*.
- **Pelacak Harian 14 Hari Interaktif**: Dilengkapi checklist yang tersimpan otomatis di browser (`localStorage`).
- **Ekspor Laporan PDF**: Layout khusus ramah cetak (`@media print`) untuk dokumen evaluasi klinis resmi.

### 4. Booking & Rekam Evaluasi Terpadu
- Profil tenaga ahli terakreditasi STR HIMPSI / IKATWI / IOTI.
- Pilihan metode: Telekonsultasi Video Zoom vs Tatap Muka di Klinik Harapanku Balikpapan.
- Slot waktu ramah jam tidur balita (nap-friendly).
- Integrasi WhatsApp otomatis: merangkum seluruh hasil anamnesis dan skor 3 pilar ke pesan WhatsApp resmi.

---

## Struktur Berkas

```
TumbuhKembang Pediatric Screening App/
├── index.html                   # Master Single Page Application
├── css/
│   └── styles.css               # Styling kustom, animasi, & layout cetak PDF (@media print)
├── js/
│   ├── screening-data.js        # Bank soal Denver II, M-CHAT, mini-game, checklist, & spesialis
│   ├── age-calculator.js        # Modul kalkulasi usia kronologis & usia koreksi prematur
│   ├── scoring-engine.js        # Algoritma skoring 3 pilar & klasifikasi risiko M-CHAT-R/F
│   └── app.js                   # State machine alur kuesioner, interaksi DOM, & WhatsApp generator
├── stitch_tumbuhkembang_pediatric_screening_app/
│   ├── code.html                # Baseline UI/UX mockup dari Stitch
│   └── screen.png               # Tangkapan layar desain awal
└── README.md                    # Dokumentasi arsitektur dan panduan pengguna
```

---

## Cara Menjalankan

Aplikasi ini bersifat Single Page Application (SPA) murni tanpa build step:
1. Buka berkas `index.html` langsung di browser modern (Chrome, Edge, Firefox, Safari), atau
2. Jalankan server lokal sederhana:
   ```bash
   npx serve .
   # atau
   python3 -m http.server 8000
   ```
3. Akses `http://localhost:8000/TumbuhKembang%20Pediatric%20Screening%20App/` pada browser.
