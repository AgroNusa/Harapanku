/**
 * TumbuhKembang.id - Modul Kalkulator Usia Koreksi Prematur
 * Berdasarkan Pedoman Klinis Denver Developmental Screening Test II (Denver II)
 * & American Academy of Pediatrics (AAP).
 */

const AgeCalculator = {
  /**
   * Menghitung usia kronologis dan usia koreksi si Kecil.
   * @param {string|Date} birthDateInput - Tanggal lahir anak (YYYY-MM-DD)
   * @param {boolean} isPremature - Status kelahiran prematur (< 37 minggu)
   * @param {number} gestationWeeks - Usia kehamilan saat lahir dalam minggu (24 - 36)
   * @param {Date} [referenceDate] - Tanggal acuan evaluasi (default: hari ini)
   */
  calculate(birthDateInput, isPremature = false, gestationWeeks = 40, referenceDate = new Date()) {
    if (!birthDateInput) {
      return null;
    }

    const birthDate = new Date(birthDateInput);
    if (isNaN(birthDate.getTime())) {
      return null;
    }

    const today = referenceDate instanceof Date ? referenceDate : new Date();

    // Selisih total milidetik & hari kronologis
    const diffTimeMs = today.getTime() - birthDate.getTime();
    if (diffTimeMs < 0) {
      // Tanggal di masa depan
      return {
        isValid: false,
        error: "Tanggal lahir tidak boleh di masa depan."
      };
    }

    const oneDayMs = 1000 * 60 * 60 * 24;
    const totalChronoDays = Math.floor(diffTimeMs / oneDayMs);

    // Hitung Usia Kronologis (KTP)
    let chronoYears = today.getFullYear() - birthDate.getFullYear();
    let chronoMonths = today.getMonth() - birthDate.getMonth();
    let chronoDateDiff = today.getDate() - birthDate.getDate();

    if (chronoDateDiff < 0) {
      chronoMonths--;
      // Ambil hari dari bulan sebelumnya
      const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      chronoDateDiff += prevMonthLastDay;
    }
    if (chronoMonths < 0) {
      chronoYears--;
      chronoMonths += 12;
    }

    const totalChronoMonths = (chronoYears * 12) + chronoMonths;
    const chronoWeeks = Math.floor(chronoDateDiff / 7);
    const chronoRemainingDays = chronoDateDiff % 7;

    let chronoFormatted = "";
    if (totalChronoMonths < 1) {
      chronoFormatted = `${totalChronoDays} Hari (${Math.max(1, Math.floor(totalChronoDays / 7))} Minggu)`;
    } else if (totalChronoMonths < 12) {
      chronoFormatted = `${totalChronoMonths} Bulan ${chronoWeeks > 0 ? chronoWeeks + ' Mgg' : ''}`.trim();
    } else {
      const remainingMo = totalChronoMonths % 12;
      chronoFormatted = `${totalChronoMonths} Bulan (${chronoYears} Thn ${remainingMo > 0 ? remainingMo + ' Bln' : ''})`.trim();
    }

    // Evaluasi Prematuritas
    const validGestation = Math.min(36, Math.max(24, parseInt(gestationWeeks) || 33));
    const deficitWeeks = isPremature ? (40 - validGestation) : 0;
    const deficitDays = deficitWeeks * 7;

    // Klasifikasi klinis prematuritas AAP/WHO
    let prematurityCategory = "Cukup Bulan (Term)";
    if (isPremature) {
      if (validGestation < 28) {
        prematurityCategory = "Ekstrem (< 28 Minggu)";
      } else if (validGestation < 32) {
        prematurityCategory = "Sangat Prematur (28-31 Minggu)";
      } else if (validGestation < 34) {
        prematurityCategory = "Prematur Sedang (32-33 Minggu)";
      } else {
        prematurityCategory = "Late Preterm (34-36 Minggu)";
      }
    }

    // Ketentuan Denver II: Usia koreksi WAJIB diterapkan bila usia anak < 24 bulan (2 tahun)
    const isCorrectionApplicable = isPremature && (totalChronoMonths < 24);

    let totalCorrectedDays = totalChronoDays;
    let correctedMonths = totalChronoMonths;
    let correctedWeeks = chronoWeeks;
    let correctedFormatted = chronoFormatted;
    let clinicalNote = "Usia perkembangan dinilai penuh berdasarkan tanggal lahir.";

    if (isPremature) {
      if (isCorrectionApplicable) {
        totalCorrectedDays = Math.max(0, totalChronoDays - deficitDays);
        
        // Buat tanggal koreksi fiktif (seolah-olah lahir di tanggal HPL 40 minggu)
        const correctedBirthDate = new Date(birthDate.getTime() + (deficitDays * oneDayMs));
        
        let cYears = today.getFullYear() - correctedBirthDate.getFullYear();
        let cMonths = today.getMonth() - correctedBirthDate.getMonth();
        let cDateDiff = today.getDate() - correctedBirthDate.getDate();

        if (cDateDiff < 0) {
          cMonths--;
          const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          cDateDiff += prevMonthLastDay;
        }
        if (cMonths < 0) {
          cYears--;
          cMonths += 12;
        }

        correctedMonths = Math.max(0, (cYears * 12) + cMonths);
        correctedWeeks = Math.floor(cDateDiff / 7);

        if (correctedMonths < 1) {
          const daysLeft = Math.max(1, totalCorrectedDays);
          correctedFormatted = `${daysLeft} Hari (~${Math.max(1, Math.floor(daysLeft / 7))} Mgg Koreksi)`;
        } else {
          correctedFormatted = `${correctedMonths} Bulan ${correctedWeeks > 0 ? correctedWeeks + ' Minggu' : ''}`.trim();
        }

        clinicalNote = `Defisit gestasi ${deficitWeeks} minggu dikoreksi otomatis agar tonggak Denver II adil dan tidak memicu 'false alarm'.`;
      } else {
        clinicalNote = "Usia di atas 24 bulan: organ dan laju tumbuh kembang dianggap telah mengejar (catch-up growth), evaluasi menggunakan usia kalender murni.";
      }
    }

    return {
      isValid: true,
      totalChronoDays,
      totalChronoMonths,
      chronoYears,
      chronoMonths,
      chronoWeeks,
      chronoFormatted,
      isPremature,
      gestationWeeks: validGestation,
      deficitWeeks,
      deficitDays,
      prematurityCategory,
      isCorrectionApplicable,
      totalCorrectedDays,
      correctedMonths,
      correctedWeeks,
      correctedFormatted,
      clinicalNote
    };
  }
};

if (typeof window !== 'undefined') {
  window.AgeCalculator = AgeCalculator;
}
