/**
 * TumbuhKembang.id - Main Application Controller
 * Mengatur alur UI state, interaktivitas Denver II & M-CHAT-R/F,
 * penyimpanan lokal, dan integrasi ekspor/booking.
 */

// Global Application State
const appState = {
  currentStep: 1,
  childName: "Arka",
  birthDate: "2023-04-15",
  isPremature: true,
  gestationWeeks: 33,
  selectedConcerns: ["speech_delay", "eye_contact"],
  
  // Jawaban Skrining
  currentQuestionIndex: 0,
  answers: {},
  mchatAnswers: {},
  
  // Timer Mini-Game
  miniGameTimer: null,
  miniGameSeconds: 60,
  
  // Hasil Evaluasi
  calculatedResults: null,
  calculatedAges: null,
  
  // Checklist 14 Hari (Saved in LocalStorage)
  checklistDone: {},
  
  // Booking Data
  selectedSpecialistId: "spec-1",
  consultMode: "teleconsult",
  selectedDate: "Besok",
  selectedDateFormatted: "Sabtu, 28 Okt",
  selectedTimeSlot: "10:00 - 10:45 WIB",
  parentPhone: "0812-3456-7890",
  parentNotes: ""
};

/**
 * Inisialisasi Aplikasi saat Dokumen Siap
 */
document.addEventListener("DOMContentLoaded", () => {
  initDateDefaults();
  loadChecklistFromStorage();
  recalculateAgesAndUI();
  setupDynamicDates();
  renderCurrentQuestion();
  renderChecklistUI();
  renderSpecialistUI();
});

/**
 * Menyiapkan tanggal default jika belum ada
 */
function initDateDefaults() {
  const birthInput = document.getElementById("birth-date");
  if (birthInput) {
    if (!birthInput.value) {
      // Default: anak berusia ~18-22 bulan
      const d = new Date();
      d.setMonth(d.getMonth() - 20);
      birthInput.value = d.toISOString().split("T")[0];
    }
    appState.birthDate = birthInput.value;
  }
}

/**
 * Navigasi Antar Layar (Langkah 1, 2, 3, 4)
 */
function navigateTo(stepNumber) {
  appState.currentStep = stepNumber;

  // Sembunyikan semua layar
  [1, 2, 3, 4].forEach(num => {
    const screenEl = document.getElementById(`screen-${num}`);
    if (screenEl) {
      screenEl.classList.add("hidden");
    }
    const navPill = document.getElementById(`pill-nav-${num}`);
    if (navPill) {
      if (num === stepNumber) {
        navPill.className = "transition-all px-3 py-1 rounded-full text-white bg-teal-600 font-bold shadow-xs";
      } else {
        navPill.className = "transition-all px-3 py-1 rounded-full text-slate-500 hover:text-teal-700";
      }
    }
  });

  // Tampilkan layar aktif
  const activeScreen = document.getElementById(`screen-${stepNumber}`);
  if (activeScreen) {
    activeScreen.classList.remove("hidden");
  }

  // Update Progress Bar
  const progressFill = document.getElementById("progress-bar-fill");
  const counterText = document.getElementById("step-counter-text");
  const pctText = document.getElementById("step-percentage");

  const labels = [
    "Langkah 1 dari 4: Identitas & Usia Koreksi",
    "Langkah 2 dari 4: Skrining Perkembangan Adaptif",
    "Langkah 3 dari 4: Roadmap Terapi & 3 Pilar Hasil",
    "Langkah 4 dari 4: Konsultasi Psikolog Terakreditasi"
  ];

  const percentages = ["25%", "50%", "75%", "100%"];

  if (progressFill) progressFill.style.width = percentages[stepNumber - 1];
  if (counterText) counterText.innerText = labels[stepNumber - 1];
  if (pctText) pctText.innerText = `${percentages[stepNumber - 1]} Selesai`;

  // Scroll kembali ke atas
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Hook spesifik per layar
  if (stepNumber === 2) {
    renderCurrentQuestion();
  } else if (stepNumber === 3) {
    computeAndRenderResults();
  } else if (stepNumber === 4) {
    updateBookingSummaryPreview();
  }
}

/**
 * Penanganan Perubahan Nama Anak
 */
function handleNameChange(val) {
  const trimmed = val.trim() || "si Kecil";
  appState.childName = trimmed;

  document.querySelectorAll(".child-name-target").forEach(el => {
    el.innerText = trimmed;
  });

  // Perbarui judul pertanyaan jika di step 2
  if (appState.currentStep === 2) {
    renderCurrentQuestion();
  }
}

/**
 * Penanganan Toggle Prematur
 */
function togglePremature(isChecked) {
  appState.isPremature = isChecked;
  const container = document.getElementById("premature-slider-container");
  if (container) {
    if (isChecked) {
      container.classList.remove("hidden");
    } else {
      container.classList.add("hidden");
    }
  }
  recalculateAgesAndUI();
}

/**
 * Penanganan Slider Gestasi
 */
function updateGestation(val) {
  appState.gestationWeeks = parseInt(val) || 33;
  let note = "Prematur Sedang";
  if (val < 28) note = "Ekstrem";
  else if (val < 32) note = "Sangat Prematur";
  else if (val >= 34) note = "Late Preterm";

  const labelEl = document.getElementById("gestation-label");
  if (labelEl) {
    labelEl.innerText = `${val} Minggu (${note})`;
  }
  recalculateAgesAndUI();
}

/**
 * Kalkulasi Usia Kronologis & Koreksi Denver II
 */
function recalculateAgesAndUI() {
  const birthInput = document.getElementById("birth-date");
  if (!birthInput || !birthInput.value) return;

  appState.birthDate = birthInput.value;
  const ageData = window.AgeCalculator.calculate(
    appState.birthDate,
    appState.isPremature,
    appState.gestationWeeks
  );

  if (!ageData || !ageData.isValid) return;
  appState.calculatedAges = ageData;

  // Update Tampilan Layar 1
  const chronoEl = document.getElementById("chrono-age-display");
  const correctedEl = document.getElementById("corrected-age-display");
  if (chronoEl) chronoEl.innerText = ageData.chronoFormatted;
  if (correctedEl) {
    if (ageData.isPremature && ageData.isCorrectionApplicable) {
      correctedEl.innerText = ageData.correctedFormatted;
    } else if (ageData.isPremature && !ageData.isCorrectionApplicable) {
      correctedEl.innerText = `${ageData.chronoFormatted} (Catch-up > 24 Bln)`;
    } else {
      correctedEl.innerText = `${ageData.chronoFormatted} (Tidak Perlu Koreksi)`;
    }
  }

  // Update Tampilan Layar 3
  const resChrono = document.getElementById("res-chrono");
  const resCorrected = document.getElementById("res-corrected");
  const resPrematureBadge = document.getElementById("res-premature-badge");

  if (resChrono) resChrono.innerText = ageData.chronoFormatted;
  if (resCorrected) {
    resCorrected.innerText = ageData.isCorrectionApplicable ? ageData.correctedFormatted : ageData.chronoFormatted;
  }
  if (resPrematureBadge) {
    if (ageData.isPremature) {
      resPrematureBadge.innerText = `Riwayat Prematur ${ageData.gestationWeeks} Mgg (${ageData.prematurityCategory})`;
      resPrematureBadge.classList.remove("hidden");
    } else {
      resPrematureBadge.classList.add("hidden");
    }
  }
}

/**
 * Toggle Chips Fokus Perhatian
 */
function toggleChip(btn, concernId) {
  const isSelected = btn.classList.contains("bg-teal-50");
  if (isSelected) {
    btn.classList.remove("border-teal-500", "bg-teal-50", "text-teal-800", "shadow-xs");
    btn.classList.add("border-slate-200", "bg-slate-50", "text-slate-600");
    appState.selectedConcerns = appState.selectedConcerns.filter(id => id !== concernId);
  } else {
    btn.classList.remove("border-slate-200", "bg-slate-50", "text-slate-600");
    btn.classList.add("border-teal-500", "bg-teal-50", "text-teal-800", "shadow-xs");
    if (!appState.selectedConcerns.includes(concernId)) {
      appState.selectedConcerns.push(concernId);
    }
  }
}

/**
 * Validasi dan Mulai Skrining Mandiri
 */
function validateAndStartScreening() {
  const nameInput = document.getElementById("child-name");
  if (!nameInput || !nameInput.value.trim()) {
    alert("Mohon masukkan nama panggilan si Kecil untuk mempersonalisasi kuesioner.");
    if (nameInput) nameInput.focus();
    return;
  }
  handleNameChange(nameInput.value);
  recalculateAgesAndUI();
  navigateTo(2);
}

/**
 * =========================================================
 * MODUL 2: MESIN SKRINING ADAPTIF & MINI-GAME
 * =========================================================
 */

function renderCurrentQuestion() {
  const questions = window.SCREENING_DATA ? window.SCREENING_DATA.questions : [];
  if (!questions || questions.length === 0) return;

  const q = questions[appState.currentQuestionIndex];
  if (!q) return;

  // Header & Domain Tracker
  const domainBadge = document.getElementById("domain-badge");
  const milestoneBadge = document.getElementById("milestone-badge");
  const questionTrackerText = document.getElementById("question-tracker-text");
  const remainingTimeText = document.getElementById("remaining-time-text");

  if (domainBadge) domainBadge.innerText = q.domainBadge;
  if (milestoneBadge) milestoneBadge.innerText = q.milestoneBadge;
  if (questionTrackerText) {
    questionTrackerText.innerText = `Pertanyaan ${appState.currentQuestionIndex + 1} dari ${questions.length}`;
  }
  if (remainingTimeText) {
    const questionsLeft = questions.length - (appState.currentQuestionIndex + 1);
    remainingTimeText.innerText = `Sisa waktu: ~${Math.max(1, Math.ceil(questionsLeft * 0.6))} menit`;
  }

  // Question Title & Subtext
  const titleEl = document.getElementById("screening-question-title");
  const exampleEl = document.getElementById("screening-question-example");
  const illustrationContainer = document.getElementById("illustration-placeholder");

  if (titleEl) {
    const formattedTitle = q.title.replace(/\[Nama Anak\]/g, `<span class="text-teal-600 font-bold child-name-target">${appState.childName}</span>`);
    titleEl.innerHTML = formattedTitle;
  }
  if (exampleEl) {
    exampleEl.innerText = q.example;
  }
  if (illustrationContainer && q.illustrationSvg) {
    illustrationContainer.innerHTML = q.illustrationSvg;
  }

  // Reset/Pre-fill Radio Selection
  const currentAnswer = appState.answers[q.id];
  const radios = document.getElementsByName("screening_response");
  radios.forEach(radio => {
    radio.checked = (radio.value === currentAnswer);
  });

  // Mini Game Content
  const miniGameTitle = document.getElementById("mini-game-title");
  const miniGameMaterials = document.getElementById("mini-game-materials");
  const miniGameSteps = document.getElementById("mini-game-steps");

  if (q.miniGame) {
    if (miniGameTitle) miniGameTitle.innerText = q.miniGame.title.replace(/\[Nama Anak\]/g, appState.childName);
    if (miniGameMaterials) miniGameMaterials.innerText = `Bahan: ${q.miniGame.materials}`;
    if (miniGameSteps) {
      miniGameSteps.innerHTML = q.miniGame.steps
        .map(step => `<li>${step.replace(/\[Nama Anak\]/g, `<span class="font-semibold text-teal-800">${appState.childName}</span>`)}</li>`)
        .join("");
    }
  }

  // Tutup drawer mini-game jika terbuka
  const drawer = document.getElementById("mini-game-drawer");
  const arrow = document.getElementById("drawer-arrow");
  if (drawer) drawer.classList.add("hidden");
  if (arrow) arrow.innerText = "▼";
  resetMiniGameTimer();

  // Evaluasi Banner Adaptif M-CHAT-R/F
  const adaptiveBanner = document.getElementById("mchat-subtrigger-banner");
  const adaptiveContent = document.getElementById("mchat-followup-content");
  
  if (currentAnswer === "rare" && q.isSocialCritical && q.mchatFollowUpId) {
    showMchatFollowUp(q.mchatFollowUpId);
  } else {
    if (adaptiveBanner) adaptiveBanner.classList.add("hidden");
    if (adaptiveContent) adaptiveContent.classList.add("hidden");
  }

  // Perbarui Tombol Berikutnya / Selesai
  const btnNext = document.getElementById("btn-next-screening");
  if (btnNext) {
    const isLast = (appState.currentQuestionIndex === questions.length - 1);
    btnNext.innerHTML = isLast
      ? `<span>Simpan & Lihat Analisis Hasil</span> <span>➔</span>`
      : `<span>Pertanyaan Berikutnya</span> <span>➔</span>`;
  }
}

/**
 * Handle Pemilihan Jawaban Opsi A/B/C/D
 */
function handleAnswerSelect(val) {
  const questions = window.SCREENING_DATA ? window.SCREENING_DATA.questions : [];
  const q = questions[appState.currentQuestionIndex];
  if (!q) return;

  appState.answers[q.id] = val;

  // Adaptive M-CHAT Trigger Logic
  if (val === "rare" && q.isSocialCritical && q.mchatFollowUpId) {
    showMchatFollowUp(q.mchatFollowUpId);
  } else {
    const adaptiveBanner = document.getElementById("mchat-subtrigger-banner");
    const adaptiveContent = document.getElementById("mchat-followup-content");
    if (adaptiveBanner) adaptiveBanner.classList.add("hidden");
    if (adaptiveContent) adaptiveContent.classList.add("hidden");
  }

  if (val === "unsure") {
    openMiniGameDrawer();
  }
}

/**
 * Tampilkan Sub-tree Protokol M-CHAT-R/F secara halus
 */
function showMchatFollowUp(followUpId) {
  const followUpData = window.SCREENING_DATA.mchatFollowUps[followUpId];
  if (!followUpData) return;

  const adaptiveBanner = document.getElementById("mchat-subtrigger-banner");
  const adaptiveContent = document.getElementById("mchat-followup-content");
  const fTitle = document.getElementById("mchat-f-title");
  const fContext = document.getElementById("mchat-f-context");
  const fOptions = document.getElementById("mchat-f-options");

  if (adaptiveBanner) adaptiveBanner.classList.remove("hidden");
  if (adaptiveContent) adaptiveContent.classList.remove("hidden");

  if (fTitle) fTitle.innerText = followUpData.title;
  if (fContext) fContext.innerText = followUpData.context.replace(/\[Nama Anak\]/g, appState.childName);

  if (fOptions) {
    const currentMchatAns = appState.mchatAnswers[followUpId];
    fOptions.innerHTML = followUpData.options.map((opt, idx) => `
      <label class="flex items-start space-x-2.5 p-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/50 cursor-pointer text-xs transition">
        <input type="radio" name="mchat_followup_radio" value="${opt.scoreValue}" 
          ${currentMchatAns === opt.scoreValue ? "checked" : ""} 
          onchange="handleMchatAnswerSelect('${followUpId}', '${opt.scoreValue}')"
          class="mt-0.5 text-indigo-600 focus:ring-indigo-500">
        <span class="text-slate-700">${opt.label}</span>
      </label>
    `).join("");
  }
}

function handleMchatAnswerSelect(followUpId, val) {
  appState.mchatAnswers[followUpId] = val;
}

/**
 * Mini-Game Drawer & Timer
 */
function toggleMiniGameDrawer() {
  const drawer = document.getElementById("mini-game-drawer");
  const arrow = document.getElementById("drawer-arrow");
  if (!drawer) return;

  if (drawer.classList.contains("hidden")) {
    openMiniGameDrawer();
  } else {
    drawer.classList.add("hidden");
    if (arrow) arrow.innerText = "▼";
  }
}

function openMiniGameDrawer() {
  const drawer = document.getElementById("mini-game-drawer");
  const arrow = document.getElementById("drawer-arrow");
  if (drawer) drawer.classList.remove("hidden");
  if (arrow) arrow.innerText = "▲";
}

function startMiniGameCountdown() {
  const timerBtn = document.getElementById("btn-minigame-timer");
  if (!timerBtn) return;

  if (appState.miniGameTimer) {
    clearInterval(appState.miniGameTimer);
    appState.miniGameTimer = null;
    timerBtn.innerText = "⏱️ Mulai Stopwatch 60 Detik";
    return;
  }

  appState.miniGameSeconds = 60;
  timerBtn.innerText = `⏱️ Waktu: 60s (Berjalan...)`;

  appState.miniGameTimer = setInterval(() => {
    appState.miniGameSeconds--;
    if (appState.miniGameSeconds <= 0) {
      clearInterval(appState.miniGameTimer);
      appState.miniGameTimer = null;
      timerBtn.innerText = "🔔 60 Detik Selesai! Pilih respons di atas.";
      timerBtn.classList.add("bg-emerald-600", "text-white");
    } else {
      timerBtn.innerText = `⏱️ Waktu: ${appState.miniGameSeconds}s`;
    }
  }, 1000);
}

function resetMiniGameTimer() {
  if (appState.miniGameTimer) {
    clearInterval(appState.miniGameTimer);
    appState.miniGameTimer = null;
  }
  appState.miniGameSeconds = 60;
  const timerBtn = document.getElementById("btn-minigame-timer");
  if (timerBtn) {
    timerBtn.innerText = "⏱️ Mulai Stopwatch 60 Detik";
    timerBtn.classList.remove("bg-emerald-600", "text-white");
  }
}

function confirmMiniGameDone(trialAnswer = "sometimes") {
  toggleMiniGameDrawer();
  const radios = document.getElementsByName("screening_response");
  if (trialAnswer === "often" && radios[0]) radios[0].checked = true;
  else if (trialAnswer === "sometimes" && radios[1]) radios[1].checked = true;
  else if (trialAnswer === "rare" && radios[2]) radios[2].checked = true;

  handleAnswerSelect(trialAnswer);
}

/**
 * Navigasi Langkah Soal Berikutnya / Sebelumnya
 */
function nextScreeningQuestion() {
  const questions = window.SCREENING_DATA ? window.SCREENING_DATA.questions : [];
  const q = questions[appState.currentQuestionIndex];

  // Pastikan user sudah memilih jawaban
  if (!appState.answers[q.id]) {
    alert("Silakan pilih salah satu opsi jawaban sebelum melanjutkan.");
    return;
  }

  if (appState.currentQuestionIndex < questions.length - 1) {
    appState.currentQuestionIndex++;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: "smooth" });
  } else {
    // Selesai seluruh soal -> pindah ke hasil
    navigateTo(3);
  }
}

function prevScreeningQuestion() {
  if (appState.currentQuestionIndex > 0) {
    appState.currentQuestionIndex--;
    renderCurrentQuestion();
    window.scrollTo({ top: 120, behavior: "smooth" });
  } else {
    navigateTo(1);
  }
}

/**
 * =========================================================
 * MODUL 3: HASIL 3 PILAR & ROADMAP 14 HARI
 * =========================================================
 */

function computeAndRenderResults() {
  recalculateAgesAndUI();

  const childData = {
    name: appState.childName,
    correctedMonths: appState.calculatedAges ? appState.calculatedAges.correctedMonths : 20,
    concerns: appState.selectedConcerns
  };

  const results = window.ScoringEngine.calculate(
    appState.answers,
    appState.mchatAnswers,
    childData
  );

  appState.calculatedResults = results;

  // 1. Update Kartu Profil & Usia di Hasil
  document.querySelectorAll(".child-name-target").forEach(el => {
    el.innerText = appState.childName;
  });

  const resDate = document.getElementById("res-eval-date");
  if (resDate) resDate.innerText = results.evaluationDate;

  // 2. Render 3 Pilar Outcome Cards
  renderPillarCard("wicara", results.pillars.wicara);
  renderPillarCard("okupasi", results.pillars.okupasi);
  renderPillarCard("perilaku", results.pillars.perilaku);

  // 3. Overall Recommendation Text
  const overallRecEl = document.getElementById("overall-recommendation-text");
  if (overallRecEl) {
    overallRecEl.innerText = results.overallRecommendation;
  }

  // 4. Consultation Recommendation Prompt Bar
  const consultPromptBox = document.getElementById("consultation-prompt-box");
  const consultPromptMsg = document.getElementById("consultation-prompt-msg");
  if (consultPromptBox && consultPromptMsg) {
    if (results.shouldRecommendConsultation) {
      consultPromptBox.classList.remove("hidden");
      consultPromptMsg.innerText = `Berdasarkan skor pada pilar Perilaku/Wicara, sangat disarankan untuk menjadwalkan evaluasi terpadu bersama Psikolog Anak atau Terapis Wicara.`;
    } else if (results.hasMonitoring) {
      consultPromptBox.classList.remove("hidden");
      consultPromptMsg.innerText = `Si Kecil menunjukkan fondasi yang baik. Jalankan stimulasi 14 hari di bawah ini atau jadwalkan konsultasi bila ingin pendampingan profesional langsung.`;
    } else {
      consultPromptBox.classList.add("hidden");
    }
  }

  // 5. Render Tabbed Roadmap Items
  renderRoadmapTabItems();
}

function renderPillarCard(pillarKey, pData) {
  const badgeEl = document.getElementById(`pillar-${pillarKey}-badge`);
  const summaryEl = document.getElementById(`pillar-${pillarKey}-summary`);
  const targetEl = document.getElementById(`pillar-${pillarKey}-target`);
  const scoreBar = document.getElementById(`pillar-${pillarKey}-scorebar`);
  const scoreText = document.getElementById(`pillar-${pillarKey}-scoretext`);

  if (badgeEl) {
    badgeEl.innerText = pData.statusLabel;
    badgeEl.className = `px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${pData.badgeClass}`;
  }
  if (summaryEl) {
    summaryEl.innerText = pData.summary;
  }
  if (targetEl) {
    targetEl.innerText = `Target: ${pData.target}`;
  }
  if (scoreBar) {
    scoreBar.style.width = `${pData.scorePct}%`;
    if (pData.status === "optimal") {
      scoreBar.className = "h-full rounded-full bg-emerald-500 transition-all duration-700";
    } else if (pData.status === "monitoring") {
      scoreBar.className = "h-full rounded-full bg-amber-500 transition-all duration-700";
    } else {
      scoreBar.className = "h-full rounded-full bg-indigo-500 transition-all duration-700";
    }
  }
  if (scoreText) {
    scoreText.innerText = `${pData.scorePct}% Optimal`;
  }
}

function renderRoadmapTabItems() {
  const items = window.SCREENING_DATA ? window.SCREENING_DATA.roadmapItems : null;
  if (!items) return;

  ["wicara", "okupasi", "perilaku"].forEach(pKey => {
    const container = document.getElementById(`roadmap-items-${pKey}`);
    if (!container) return;

    container.innerHTML = items[pKey].map(item => `
      <div class="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition space-y-1.5 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">${item.dayRange}</span>
          <span class="text-[11px] font-semibold text-slate-500">${item.badge}</span>
        </div>
        <h5 class="text-sm font-bold text-slate-800">${item.technique}</h5>
        <p class="text-xs text-slate-600 leading-relaxed">${item.description.replace(/Arka/g, appState.childName)}</p>
      </div>
    `).join("");
  });
}

function switchResultTab(tabId) {
  ["tab-wicara", "tab-okupasi", "tab-perilaku"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.classList.remove("hidden");

  // Tab buttons styling
  const btns = {
    "tab-wicara": "btn-tab-wicara",
    "tab-okupasi": "btn-tab-okupasi",
    "tab-perilaku": "btn-tab-perilaku"
  };

  Object.keys(btns).forEach(key => {
    const btn = document.getElementById(btns[key]);
    if (!btn) return;
    if (key === tabId) {
      btn.className = "px-3.5 py-1.5 rounded-lg bg-white shadow-xs text-teal-700 font-bold";
    } else {
      btn.className = "px-3.5 py-1.5 rounded-lg hover:text-slate-900 transition font-medium text-slate-600";
    }
  });
}

/**
 * Interactive 14-Day Checklist with LocalStorage
 */
function renderChecklistUI() {
  const listEl = document.getElementById("checklist-container");
  if (!listEl) return;

  const dailyItems = window.SCREENING_DATA ? window.SCREENING_DATA.dailyChecklist : [];
  const total = dailyItems.length;
  let doneCount = 0;

  listEl.innerHTML = dailyItems.map(item => {
    const isDone = !!appState.checklistDone[item.day];
    if (isDone) doneCount++;

    return `
      <label class="flex items-start space-x-3 p-3 rounded-xl border ${isDone ? 'border-teal-300 bg-teal-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'} cursor-pointer transition text-xs">
        <input type="checkbox" ${isDone ? "checked" : ""} onchange="toggleChecklistItem(${item.day}, this.checked)" class="mt-0.5 rounded text-teal-600 focus:ring-teal-500">
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <span class="font-bold ${isDone ? 'text-teal-900 line-through' : 'text-slate-800'}">Hari ${item.day}</span>
            <span class="text-[10px] uppercase font-semibold text-slate-400">${item.pillar}</span>
          </div>
          <p class="text-slate-600 mt-0.5 ${isDone ? 'text-slate-400' : ''}">${item.task.replace(/Arka/g, appState.childName)}</p>
        </div>
      </label>
    `;
  }).join("");

  const counterEl = document.getElementById("checklist-progress-text");
  if (counterEl) {
    counterEl.innerText = `${doneCount} dari ${total} Aktivitas Diselesaikan`;
  }
}

function toggleChecklistItem(day, isChecked) {
  appState.checklistDone[day] = isChecked;
  saveChecklistToStorage();
  renderChecklistUI();
}

function saveChecklistToStorage() {
  try {
    localStorage.setItem("tumbuhkembang_checklist", JSON.stringify(appState.checklistDone));
  } catch (e) {
    console.error("LocalStorage error:", e);
  }
}

function loadChecklistFromStorage() {
  try {
    const saved = localStorage.getItem("tumbuhkembang_checklist");
    if (saved) {
      appState.checklistDone = JSON.parse(saved);
    }
  } catch (e) {
    appState.checklistDone = {};
  }
}

/**
 * Ekspor PDF & Print Generator
 */
function downloadPdfRoadmap() {
  const toast = document.getElementById("toast-download");
  if (toast) toast.classList.remove("hidden");

  setTimeout(() => {
    if (toast) toast.classList.add("hidden");
    // Trigger window.print yang dioptimasi oleh styles.css print media query
    window.print();
  }, 900);
}

/**
 * =========================================================
 * MODUL 4: BOOKING & REKAM EVALUASI PSIKOLOG ANAK
 * =========================================================
 */

function setupDynamicDates() {
  const dateContainer = document.getElementById("date-selector");
  if (!dateContainer) return;

  const daysName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthsName = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  const buttonsHtml = [];
  const today = new Date();

  for (let i = 1; i <= 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dayStr = daysName[d.getDay()];
    const dateNum = d.getDate();
    const monthStr = monthsName[d.getMonth()];
    const fullDateFormatted = `${dayStr}, ${dateNum} ${monthStr}`;

    const isFirst = (i === 1);
    buttonsHtml.push(`
      <button type="button" onclick="selectDatePill(this, '${fullDateFormatted}')" 
        class="date-pill flex-shrink-0 px-4 py-3 rounded-2xl border-2 ${isFirst ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'} text-center transition">
        <span class="block text-[10px] uppercase font-bold text-teal-700">${isFirst ? 'Besok' : dayStr}</span>
        <span class="block text-base font-extrabold">${dateNum}</span>
        <span class="block text-[11px]">${monthStr}</span>
      </button>
    `);
  }

  dateContainer.innerHTML = buttonsHtml.join("");
}

function selectDatePill(el, dateFormatted) {
  document.querySelectorAll(".date-pill").forEach(pill => {
    pill.className = "date-pill flex-shrink-0 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 text-center hover:bg-slate-100 transition";
  });
  el.className = "date-pill flex-shrink-0 px-4 py-3 rounded-2xl border-2 border-teal-600 bg-teal-50 text-teal-900 text-center transition";
  appState.selectedDateFormatted = dateFormatted;
  updateBookingSummaryPreview();
}

function selectTimeSlot(el, slotTime) {
  document.querySelectorAll(".time-slot-btn").forEach(btn => {
    btn.className = "time-slot-btn px-3 py-2.5 rounded-xl text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition";
  });
  el.className = "time-slot-btn px-3 py-2.5 rounded-xl text-xs font-bold border-2 border-teal-600 bg-teal-50 text-teal-800 transition";
  appState.selectedTimeSlot = slotTime;
  updateBookingSummaryPreview();
}

function handleConsultModeChange(mode) {
  appState.consultMode = mode;
  renderSpecialistUI();
  updateBookingSummaryPreview();
}

function renderSpecialistUI() {
  const spec = window.SCREENING_DATA.specialists.find(s => s.id === appState.selectedSpecialistId) || window.SCREENING_DATA.specialists[0];
  if (!spec) return;

  const specNameEl = document.getElementById("spec-name");
  const specTitleEl = document.getElementById("spec-title");
  const specBadgeEl = document.getElementById("spec-badge");
  const specExpEl = document.getElementById("spec-experience");
  const specClinicEl = document.getElementById("spec-clinic");
  const specRatingEl = document.getElementById("spec-rating");
  const specSpecialtiesEl = document.getElementById("spec-specialties");

  if (specNameEl) specNameEl.innerText = spec.name;
  if (specTitleEl) specTitleEl.innerText = spec.title;
  if (specBadgeEl) specBadgeEl.innerText = spec.strBadge;
  if (specExpEl) specExpEl.innerText = spec.experience;
  if (specClinicEl) specClinicEl.innerText = spec.clinic;
  if (specRatingEl) specRatingEl.innerText = `★ ${spec.rating} (${spec.reviewsCount}+ Sesi)`;
  if (specSpecialtiesEl) {
    specSpecialtiesEl.innerHTML = spec.specialties.map(s => `
      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">${s}</span>
    `).join("");
  }

  // Update Harga pada Pilihan Mode
  const telePriceEl = document.getElementById("teleconsult-price");
  const inClinicPriceEl = document.getElementById("inclinic-price");
  if (telePriceEl) telePriceEl.innerText = spec.teleconsultRate;
  if (inClinicPriceEl) inClinicPriceEl.innerText = spec.inClinicRate;
}

function switchSpecialist(specId) {
  appState.selectedSpecialistId = specId;
  renderSpecialistUI();
  updateBookingSummaryPreview();
}

function updateBookingSummaryPreview() {
  const spec = window.SCREENING_DATA.specialists.find(s => s.id === appState.selectedSpecialistId) || window.SCREENING_DATA.specialists[0];
  const ageData = appState.calculatedAges || window.AgeCalculator.calculate(appState.birthDate, appState.isPremature, appState.gestationWeeks);

  const snapName = document.getElementById("attached-child-name");
  const snapAge = document.getElementById("attached-corrected-age");
  const snapDenver = document.getElementById("attached-denver-status");
  const snapMchat = document.getElementById("attached-mchat-status");

  if (snapName) snapName.innerText = appState.childName;
  if (snapAge && ageData) {
    snapAge.innerText = ageData.isPremature && ageData.isCorrectionApplicable ? ageData.correctedFormatted : ageData.chronoFormatted;
  }
  if (snapDenver) {
    const res = appState.calculatedResults;
    snapDenver.innerText = res ? `Wicara: ${res.pillars.wicara.statusLabel}, Sensori: ${res.pillars.okupasi.statusLabel}` : "Denver II Terlampir";
  }
  if (snapMchat) {
    const res = appState.calculatedResults;
    snapMchat.innerText = res ? res.pillars.perilaku.mchatRiskLevel : "M-CHAT-R/F Triase Terlampir";
  }
}

function showBookingConfirmationModal() {
  const phoneInput = document.getElementById("parent-phone");
  const notesInput = document.getElementById("parent-notes");

  if (phoneInput && phoneInput.value.trim()) {
    appState.parentPhone = phoneInput.value.trim();
  }
  if (notesInput) {
    appState.parentNotes = notesInput.value.trim();
  }

  const spec = window.SCREENING_DATA.specialists.find(s => s.id === appState.selectedSpecialistId) || window.SCREENING_DATA.specialists[0];

  const modalTime = document.getElementById("modal-time-label");
  const modalMethod = document.getElementById("modal-method-label");
  const modalDoctor = document.getElementById("modal-doctor-label");

  if (modalTime) modalTime.innerText = `${appState.selectedDateFormatted} • ${appState.selectedTimeSlot}`;
  if (modalMethod) {
    modalMethod.innerText = appState.consultMode === "teleconsult" ? "Telekonsultasi Video Zoom" : "Tatap Muka di Klinik Harapanku";
  }
  if (modalDoctor && spec) modalDoctor.innerText = spec.name;

  const modal = document.getElementById("booking-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeModalAndReset() {
  const modal = document.getElementById("booking-modal");
  if (modal) modal.classList.add("hidden");
  navigateTo(1);
}

/**
 * Integrasi WhatsApp Langsung dengan Data Skrining Terlampir
 */
function sendWhatsAppBooking() {
  const spec = window.SCREENING_DATA.specialists.find(s => s.id === appState.selectedSpecialistId) || window.SCREENING_DATA.specialists[0];
  const ageData = appState.calculatedAges || window.AgeCalculator.calculate(appState.birthDate, appState.isPremature, appState.gestationWeeks);
  const results = appState.calculatedResults;

  const methodText = appState.consultMode === "teleconsult" ? "Telekonsultasi Video Zoom" : "Tatap Muka di Klinik Harapanku";

  let summaryText = `*PENDAFTARAN KONSULTASI TUMBUHKEMBANG.ID*\n\n`;
  summaryText += `*Profil Anak:* ${appState.childName}\n`;
  summaryText += `*Usia Kalender:* ${ageData ? ageData.chronoFormatted : '-'}\n`;
  if (ageData && ageData.isPremature) {
    summaryText += `*Riwayat Prematur:* ${ageData.gestationWeeks} Minggu\n`;
    summaryText += `*Usia Koreksi Denver II:* ${ageData.correctedFormatted}\n`;
  }
  summaryText += `\n*Hasil Evaluasi 3 Pilar:*\n`;
  if (results) {
    summaryText += `• Wicara & Bahasa: ${results.pillars.wicara.statusLabel}\n`;
    summaryText += `• Okupasi & Sensori: ${results.pillars.okupasi.statusLabel}\n`;
    summaryText += `• Perilaku (M-CHAT): ${results.pillars.perilaku.mchatRiskLevel}\n`;
  }
  summaryText += `\n*Jadwal Pilihan:*\n`;
  summaryText += `• Ahli: ${spec ? spec.name : '-'}\n`;
  summaryText += `• Waktu: ${appState.selectedDateFormatted}, ${appState.selectedTimeSlot}\n`;
  summaryText += `• Metode: ${methodText}\n`;
  summaryText += `• Kontak Orang Tua: ${appState.parentPhone}\n`;
  if (appState.parentNotes) {
    summaryText += `• Catatan: ${appState.parentNotes}\n`;
  }
  summaryText += `\n_Mohon konfirmasi ketersediaan slot. Terima kasih!_`;

  const waUrl = `https://wa.me/628115400992?text=${encodeURIComponent(summaryText)}`;
  window.open(waUrl, "_blank");
}
