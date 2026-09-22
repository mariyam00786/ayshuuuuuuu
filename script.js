/* =========================================================
   DIGITAL BIRTHDAY CARD - JAVASCRIPT
   Interactive 5-Stage Engine for Pathu's Birthday Website
   ========================================================= */

(function () {
  'use strict';

  // --- Configuration & State ---
  const state = {
    currentStage: 1,
    friendName: localStorage.getItem('bday_friend_name') || 'Pathu',
    wishMessage: localStorage.getItem('bday_wish_message') || '',
    isMusicPlaying: false,
    audioCtx: null,
    musicBoxInterval: null,
  };

  // --- DOM Elements ---
  const stages = {
    1: document.getElementById('stage1'),
    2: document.getElementById('stage2'),
    3: document.getElementById('stage3'),
    4: document.getElementById('stage4'),
    5: document.getElementById('stage5'),
  };

  // Stage 1 Elements
  const stage1TextEl = document.getElementById('stage1Text');
  const stage1NextBtn = document.getElementById('stage1NextBtn');
  const miffy1Img = document.getElementById('miffy1Img');
  const miffy1Svg = document.getElementById('miffy1Svg');

  // Stage 2 Elements
  const stage2Line1El = document.getElementById('stage2Line1');
  const stage2Line2El = document.getElementById('stage2Line2');
  const stage2YesBtn = document.getElementById('stage2YesBtn');
  const stage2NoBtn = document.getElementById('stage2NoBtn');
  const miffy2Img = document.getElementById('miffy2Img');
  const miffy2Svg = document.getElementById('miffy2Svg');

  // Stage 3 Elements
  const cherryVid3 = document.getElementById('cherryVid3');
  const cakeStage3Btn = document.getElementById('cakeStage3Btn');
  const cakeStage3Img = document.getElementById('cakeStage3Img');
  const cakeSvg = document.getElementById('cakeSvg');
  const stage3BoxImg = document.getElementById('stage3BoxImg');

  // Stage 4 Elements
  const cherryVid4 = document.getElementById('cherryVid4');
  const stage4WishesBtn = document.getElementById('stage4WishesBtn');
  const jellycatImg = document.getElementById('jellycatImg');
  const jellycatSvg = document.getElementById('jellycatSvg');
  const stage4BoxImg = document.getElementById('stage4BoxImg');

  // Stage 5 Elements
  const stage5BoxImg = document.getElementById('stage5BoxImg');
  const wishesRecipientName = document.getElementById('wishesRecipientName');
  const wishesMessageBody = document.getElementById('wishesMessageBody');
  const burstHeartsBtn = document.getElementById('burstHeartsBtn');
  const restartCardBtn = document.getElementById('restartCardBtn');

  // Music & Controls
  const bgMusic = document.getElementById('bgMusic');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');

  // Customizer Modal
  const customizerModal = document.getElementById('customizerModal');
  const customizerToggleBtn = document.getElementById('customizerToggleBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const inputFriendName = document.getElementById('inputFriendName');
  const inputWishMessage = document.getElementById('inputWishMessage');
  const savePersonalizationBtn = document.getElementById('savePersonalizationBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  // Image Upload Inputs
  const uploadMusic = document.getElementById('uploadMusic');
  const uploadStarBg = document.getElementById('uploadStarBg');
  const uploadMiffy1 = document.getElementById('uploadMiffy1');
  const uploadMiffy2 = document.getElementById('uploadMiffy2');
  const uploadCherryVid = document.getElementById('uploadCherryVid');
  const uploadCake = document.getElementById('uploadCake');
  const uploadJellycat = document.getElementById('uploadJellycat');
  const uploadDotsBg = document.getElementById('uploadDotsBg');

  // Canvas for Confetti
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiParticles = [];
  let isConfettiRunning = false;

  // Resize canvas to full window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150));
  resizeCanvas();

  // =========================================================
  // TYPEWRITER EFFECT HELPER
  // =========================================================
  function typeWriter(text, element, speed = 65, callback) {
    element.innerHTML = '';
    element.classList.add('typing-cursor');
    let i = 0;

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('typing-cursor');
        if (typeof callback === 'function') {
          callback();
        }
      }
    }
    type();
  }

  // =========================================================
  // ASSET DETECTION & LOCAL STORAGE LOADER
  // Checks if user uploaded or placed local files
  // =========================================================
  function setupAssetCheck(imgElement, fallbackElement, storageKey) {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      imgElement.src = saved;
      imgElement.style.display = 'block';
      if (fallbackElement) fallbackElement.style.display = 'none';
      return;
    }

    // Test default src
    imgElement.onload = function () {
      imgElement.style.display = 'block';
      if (fallbackElement) fallbackElement.style.display = 'none';
    };
    imgElement.onerror = function () {
      imgElement.style.display = 'none';
      if (fallbackElement) fallbackElement.style.display = 'flex';
    };
  }

  function initAssets() {
    // Stage 1 Miffy
    setupAssetCheck(miffy1Img, miffy1Svg, 'bday_asset_miffy1');

    // Stage 2 Miffy GIF
    setupAssetCheck(miffy2Img, miffy2Svg, 'bday_asset_miffy2');

    // Stage 3 Cake
    setupAssetCheck(cakeStage3Img, cakeSvg, 'bday_asset_cake');

    // Stage 4 Jellycat
    setupAssetCheck(jellycatImg, jellycatSvg, 'bday_asset_jellycat');

    // Custom Box GIF overlays
    const savedStage3Box = localStorage.getItem('bday_asset_box3');
    if (savedStage3Box) {
      stage3BoxImg.src = savedStage3Box;
      stage3BoxImg.style.display = 'block';
    }

    const savedStage4Box = localStorage.getItem('bday_asset_box4');
    if (savedStage4Box) {
      stage4BoxImg.src = savedStage4Box;
      stage4BoxImg.style.display = 'block';
    }

    const savedStage5Box = localStorage.getItem('bday_asset_box5');
    if (savedStage5Box) {
      stage5BoxImg.src = savedStage5Box;
      stage5BoxImg.style.display = 'block';
    }

    // Custom Star Bg
    const savedStarBg = localStorage.getItem('bday_asset_star_bg');
    if (savedStarBg) {
      document.getElementById('stage1Bg').style.backgroundImage = `url(${savedStarBg})`;
      document.getElementById('stage2Bg').style.backgroundImage = `url(${savedStarBg})`;
    }

    // Custom Dots Bg
    const savedDotsBg = localStorage.getItem('bday_asset_dots_bg');
    if (savedDotsBg) {
      document.getElementById('stage5Bg').style.backgroundImage = `url(${savedDotsBg})`;
    }

    // Custom Video Bg
    const savedCherryVid = localStorage.getItem('bday_asset_cherry_vid');
    if (savedCherryVid) {
      cherryVid3.src = savedCherryVid;
      cherryVid3.style.display = 'block';
      cherryVid4.src = savedCherryVid;
      cherryVid4.style.display = 'block';
      document.getElementById('cherryFallback3').style.display = 'none';
      document.getElementById('cherryFallback4').style.display = 'none';
    } else {
      // Check if cherry vid file exists
      cherryVid3.oncanplay = function () {
        cherryVid3.style.display = 'block';
        document.getElementById('cherryFallback3').style.display = 'none';
      };
      cherryVid4.oncanplay = function () {
        cherryVid4.style.display = 'block';
        document.getElementById('cherryFallback4').style.display = 'none';
      };
    }

    // Custom Music
    const savedMusic = localStorage.getItem('bday_asset_music');
    if (savedMusic) {
      bgMusic.src = savedMusic;
    } else {
      bgMusic.src = 'assets/the_mountain-happy-birthday-508020.mp3';
    }
  }

  // =========================================================
  // STAGE TRANSITIONS & ANIMATIONS
  // =========================================================
  function goToStage(stageNum) {
    Object.keys(stages).forEach((key) => {
      stages[key].classList.remove('active-stage');
    });

    state.currentStage = stageNum;
    const targetStage = stages[stageNum];
    if (!targetStage) return;

    targetStage.classList.add('active-stage');

    // Run stage-specific initiation logic
    if (stageNum === 1) {
      startStage1();
    } else if (stageNum === 2) {
      startStage2();
    } else if (stageNum === 3) {
      startStage3();
    } else if (stageNum === 4) {
      startStage4();
    } else if (stageNum === 5) {
      startStage5();
    }
  }

  // --- STAGE 1: Happy Birthday! + Miffy 1 + next :3 ---
  function startStage1() {
    const headingText = state.friendName ? `Happy Birthday ${state.friendName}!` : 'Happy Birthday!';
    typeWriter(headingText, stage1TextEl, 70);
  }

  // --- STAGE 2: "i have a suprise for / you, wanna see it" ---
  function startStage2() {
    stage2Line1El.innerHTML = '';
    stage2Line2El.innerHTML = '';

    // First line typing
    typeWriter('i have a surprise for', stage2Line1El, 60, () => {
      // Second line typing right after
      setTimeout(() => {
        typeWriter('you, wanna see it?', stage2Line2El, 60);
      }, 150);
    });
  }

  // Playful "no thanks." button interaction
  let noBtnEvasionCount = 0;
  function evadeNoButton() {
    noBtnEvasionCount++;
    const maxOffset = Math.min(65, Math.floor(window.innerWidth * 0.16));
    const randomX = (Math.random() - 0.5) * (maxOffset * 2);
    const randomY = (Math.random() - 0.5) * 50;
    stage2NoBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    if (noBtnEvasionCount === 1) {
      stage2NoBtn.innerText = 'are you sure? :3';
    } else if (noBtnEvasionCount === 2) {
      stage2NoBtn.innerText = 'really? 🥺';
    } else if (noBtnEvasionCount >= 3) {
      stage2NoBtn.innerText = 'you gotta click yes! ✨';
    }
  }

  stage2NoBtn.addEventListener('mouseenter', evadeNoButton);
  stage2NoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    evadeNoButton();
  }, { passive: false });
  stage2NoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    evadeNoButton();
  });

  // --- STAGE 3: STAGE 3 BOX + CAKE BUTTON ---
  function startStage3() {
    // Ensure background video plays if loaded
    if (cherryVid3 && cherryVid3.paused) {
      cherryVid3.play().catch(() => {});
    }
  }

  // --- STAGE 4: Confetti surprise + JELLYCAT ---
  function startStage4() {
    // Launch celebratory confetti burst!
    launchConfettiBurst();

    if (cherryVid4 && cherryVid4.paused) {
      cherryVid4.play().catch(() => {});
    }
  }

  // --- STAGE 5: Illustrated Letter Frame + Wishes for Pathu ---
  function startStage5() {
    wishesRecipientName.innerText = `Dearest ${state.friendName},`;
    if (state.wishMessage) {
      const paras = state.wishMessage.split(/\n\s*\n/);
      if (paras.length > 1) {
        wishesMessageBody.innerHTML = paras
          .map((p, idx) => `<p class="letter-para ${idx === 0 ? 'para-opening' : 'para-main'}">${p.replace(/\n/g, '<br />')}</p>`)
          .join('');
      } else {
        wishesMessageBody.innerHTML = `<p class="letter-para para-opening">${state.wishMessage.replace(/\n/g, '<br />')}</p>`;
      }
    }
    // Ensure letter view is scrolled to top
    const scrollWrap = document.querySelector('.letter-scroll-wrapper');
    if (scrollWrap) scrollWrap.scrollTop = 0;

    // Gentle celebration burst
    launchHearts(10);
  }

  // =========================================================
  // INTERACTION EVENT LISTENERS
  // =========================================================

  // Stage 1 -> Stage 2
  stage1NextBtn.addEventListener('click', () => {
    goToStage(2);
  });

  // Stage 2 -> Stage 3
  stage2YesBtn.addEventListener('click', () => {
    playMusic();
    goToStage(3);
  });

  // Stage 3 -> Stage 4 (Tap on Cake)
  cakeStage3Btn.addEventListener('click', () => {
    goToStage(4);
  });

  // Stage 4 -> Stage 5 (my wishes button)
  stage4WishesBtn.addEventListener('click', () => {
    goToStage(5);
  });

  // Stage 5 Actions
  burstHeartsBtn.addEventListener('click', () => {
    launchHearts(25);
    launchConfettiBurst();

    // Play sweet celebratory arpeggio chime!
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      playChimeNote(523.25, now, 0.35);        // C5
      playChimeNote(659.25, now + 0.1, 0.35);  // E5
      playChimeNote(783.99, now + 0.2, 0.4);   // G5
      playChimeNote(1046.5, now + 0.32, 0.65); // C6
    } catch (e) {}
  });

  restartCardBtn.addEventListener('click', () => {
    noBtnEvasionCount = 0;
    stage2NoBtn.innerText = 'no thanks.';
    stage2NoBtn.style.transform = 'none';
    goToStage(1);
  });

  // Interactive Balloon Touch Zone
  const balloonZone = document.getElementById('balloonZone');
  if (balloonZone) {
    let lastBalloonTime = 0;
    const triggerBalloons = (e) => {
      const now = Date.now();
      if (now - lastBalloonTime < 350) return;
      lastBalloonTime = now;
      if (e && e.cancelable) e.preventDefault();

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const b = document.createElement('div');
          b.className = 'floating-heart';
          b.innerText = ['🎈', '✨', '💕', '🎈', '🌸'][i % 5];
          b.style.left = `${Math.random() * 25 + 15}vw`;
          b.style.bottom = '22vh';
          b.style.animationDuration = `${Math.random() * 1.2 + 2}s`;
          document.body.appendChild(b);
          setTimeout(() => b.remove(), 2600);
        }, i * 110);
      }
      try {
        const ctx = getAudioContext();
        const t = ctx.currentTime;
        playChimeNote(587.33, t, 0.3);        // D5
        playChimeNote(880.00, t + 0.12, 0.45); // A5
      } catch (err) {}
    };

    balloonZone.addEventListener('touchstart', triggerBalloons, { passive: false });
    balloonZone.addEventListener('click', triggerBalloons);
  }

  // Interactive Ribbon Touch Zone
  const ribbonZone = document.getElementById('ribbonZone');
  if (ribbonZone) {
    let lastRibbonTime = 0;
    const triggerRibbon = (e) => {
      const now = Date.now();
      if (now - lastRibbonTime < 350) return;
      lastRibbonTime = now;
      if (e && e.cancelable) e.preventDefault();

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const r = document.createElement('div');
          r.className = 'floating-heart';
          r.innerText = ['💖', '🎀', '✨'][i % 3];
          r.style.right = `${Math.random() * 25 + 15}vw`;
          r.style.bottom = '22vh';
          r.style.animationDuration = `${Math.random() * 1.2 + 2}s`;
          document.body.appendChild(r);
          setTimeout(() => r.remove(), 2600);
        }, i * 110);
      }
      try {
        const ctx = getAudioContext();
        const t = ctx.currentTime;
        playChimeNote(659.25, t, 0.35);       // E5
        playChimeNote(987.77, t + 0.1, 0.5);  // B5
      } catch (err) {}
    };

    ribbonZone.addEventListener('touchstart', triggerRibbon, { passive: false });
    ribbonZone.addEventListener('click', triggerRibbon);
  }

  // =========================================================
  // MUSIC PLAYER & WEB AUDIO API MUSIC BOX
  // Synthesizes sweet music-box birthday lullaby if no mp3 provided!
  // =========================================================
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  // Sweet music box chime note
  function playChimeNote(freq, time, duration = 0.8) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Harmonic bell overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.75, time);

    // Envelope
    gain.gain.setValueAtTime(0.24, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    gain2.gain.setValueAtTime(0.08, time);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.5);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  // "Happy Birthday to You" notes & timings
  const birthdayMelody = [
    { note: 261.63, dur: 0.35, pause: 0.4 }, // C4
    { note: 261.63, dur: 0.35, pause: 0.4 }, // C4
    { note: 293.66, dur: 0.7, pause: 0.8 },  // D4
    { note: 261.63, dur: 0.7, pause: 0.8 },  // C4
    { note: 349.23, dur: 0.7, pause: 0.8 },  // F4
    { note: 329.63, dur: 1.2, pause: 1.3 },  // E4

    { note: 261.63, dur: 0.35, pause: 0.4 }, // C4
    { note: 261.63, dur: 0.35, pause: 0.4 }, // C4
    { note: 293.66, dur: 0.7, pause: 0.8 },  // D4
    { note: 261.63, dur: 0.7, pause: 0.8 },  // C4
    { note: 392.00, dur: 0.7, pause: 0.8 },  // G4
    { note: 349.23, dur: 1.2, pause: 1.3 },  // F4

    { note: 261.63, dur: 0.35, pause: 0.4 }, // C4
    { note: 261.63, dur: 0.35, pause: 0.4 }, // C4
    { note: 523.25, dur: 0.7, pause: 0.8 },  // C5
    { note: 440.00, dur: 0.7, pause: 0.8 },  // A4
    { note: 349.23, dur: 0.7, pause: 0.8 },  // F4
    { note: 329.63, dur: 0.7, pause: 0.8 },  // E4
    { note: 293.66, dur: 1.0, pause: 1.1 },  // D4

    { note: 466.16, dur: 0.35, pause: 0.4 }, // Bb4
    { note: 466.16, dur: 0.35, pause: 0.4 }, // Bb4
    { note: 440.00, dur: 0.7, pause: 0.8 },  // A4
    { note: 349.23, dur: 0.7, pause: 0.8 },  // F4
    { note: 392.00, dur: 0.7, pause: 0.8 },  // G4
    { note: 349.23, dur: 1.5, pause: 1.8 },  // F4
  ];

  function playSynthMusicBox() {
    const ctx = getAudioContext();
    let startTime = ctx.currentTime + 0.1;
    let totalTime = 0;

    birthdayMelody.forEach((item) => {
      playChimeNote(item.note, startTime + totalTime, item.dur);
      totalTime += item.pause;
    });

    state.musicBoxInterval = setTimeout(() => {
      if (state.isMusicPlaying) {
        playSynthMusicBox();
      }
    }, totalTime * 1000);
  }

  function stopSynthMusicBox() {
    if (state.musicBoxInterval) {
      clearTimeout(state.musicBoxInterval);
      state.musicBoxInterval = null;
    }
  }

  function playMusic() {
    if (state.isMusicPlaying) return;
    state.isMusicPlaying = true;
    musicToggleBtn.classList.add('playing');
    musicLabel.innerText = 'Playing 🎵';

    // Try playing mp3 first
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Native audio is playing
        })
        .catch(() => {
          // If mp3 file not found or blocked, fall back to lovely music-box synth!
          playSynthMusicBox();
        });
    } else {
      playSynthMusicBox();
    }
  }

  function pauseMusic() {
    if (!state.isMusicPlaying) return;
    bgMusic.pause();
    stopSynthMusicBox();
    state.isMusicPlaying = false;
    musicToggleBtn.classList.remove('playing');
    musicLabel.innerText = 'Play Music';
  }

  function toggleMusic() {
    if (state.isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  musicToggleBtn.addEventListener('click', toggleMusic);

  // =========================================================
  // CONFETTI ENGINE (Embedded, High Performance)
  // =========================================================
  function launchConfettiBurst() {
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166', '#06d6a0', '#118ab2', '#c77dff'];
    for (let i = 0; i < 90; i++) {
      confettiParticles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 9 + 5,
        h: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0,
      });
    }

    if (!isConfettiRunning) {
      isConfettiRunning = true;
      requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.vx *= 0.985;
      p.rotation += p.rSpeed;
      p.life++;

      if (p.life > 70) {
        p.opacity -= 0.02;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      if (p.opacity <= 0 || p.y > canvas.height + 40) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // =========================================================
  // FLOATING HEARTS ANIMATION
  // =========================================================
  function launchHearts(count = 12) {
    const emojis = ['💕', '💖', '🌸', '✨', '🎂', '🐰'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = `${Math.random() * 85 + 5}vw`;
        heart.style.animationDuration = `${Math.random() * 1.5 + 2}s`;
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 3200);
      }, i * 140);
    }
  }

  // =========================================================
  // CUSTOMIZER & FILE UPLOAD HANDLING
  // =========================================================
  customizerToggleBtn.addEventListener('click', () => {
    inputFriendName.value = state.friendName;
    if (state.wishMessage) {
      inputWishMessage.value = state.wishMessage;
    }
    customizerModal.classList.add('open');
    customizerModal.setAttribute('aria-hidden', 'false');
  });

  closeModalBtn.addEventListener('click', () => {
    customizerModal.classList.remove('open');
    customizerModal.setAttribute('aria-hidden', 'true');
  });

  customizerModal.addEventListener('click', (e) => {
    if (e.target === customizerModal) {
      customizerModal.classList.remove('open');
    }
  });

  // Helper to read uploaded files into DataURLs and save
  function handleFileUpload(inputEl, storageKey, callback) {
    if (inputEl.files && inputEl.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        try {
          localStorage.setItem(storageKey, dataUrl);
        } catch (err) {
          console.warn('Storage limit reached, keeping in memory for current session.');
        }
        if (typeof callback === 'function') {
          callback(dataUrl);
        }
      };
      reader.readAsDataURL(inputEl.files[0]);
    }
  }

  savePersonalizationBtn.addEventListener('click', () => {
    const newName = inputFriendName.value.trim() || 'Pathu';
    const newMessage = inputWishMessage.value.trim();

    state.friendName = newName;
    state.wishMessage = newMessage;

    localStorage.setItem('bday_friend_name', newName);
    if (newMessage) {
      localStorage.setItem('bday_wish_message', newMessage);
    }

    // Process file uploads
    handleFileUpload(uploadMiffy1, 'bday_asset_miffy1', (url) => {
      miffy1Img.src = url;
      miffy1Img.style.display = 'block';
      miffy1Svg.style.display = 'none';
    });

    handleFileUpload(uploadMiffy2, 'bday_asset_miffy2', (url) => {
      miffy2Img.src = url;
      miffy2Img.style.display = 'block';
      miffy2Svg.style.display = 'none';
    });

    handleFileUpload(uploadCake, 'bday_asset_cake', (url) => {
      cakeStage3Img.src = url;
      cakeStage3Img.style.display = 'block';
      cakeSvg.style.display = 'none';
    });

    handleFileUpload(uploadJellycat, 'bday_asset_jellycat', (url) => {
      jellycatImg.src = url;
      jellycatImg.style.display = 'block';
      jellycatSvg.style.display = 'none';
    });

    handleFileUpload(uploadStarBg, 'bday_asset_star_bg', (url) => {
      document.getElementById('stage1Bg').style.backgroundImage = `url(${url})`;
      document.getElementById('stage2Bg').style.backgroundImage = `url(${url})`;
    });

    handleFileUpload(uploadDotsBg, 'bday_asset_dots_bg', (url) => {
      document.getElementById('stage5Bg').style.backgroundImage = `url(${url})`;
    });

    handleFileUpload(uploadCherryVid, 'bday_asset_cherry_vid', (url) => {
      cherryVid3.src = url;
      cherryVid3.style.display = 'block';
      cherryVid4.src = url;
      cherryVid4.style.display = 'block';
      document.getElementById('cherryFallback3').style.display = 'none';
      document.getElementById('cherryFallback4').style.display = 'none';
    });

    handleFileUpload(uploadMusic, 'bday_asset_music', (url) => {
      bgMusic.src = url;
      if (state.isMusicPlaying) {
        bgMusic.play().catch(() => {});
      }
    });

    // Update current display
    wishesRecipientName.innerText = `Dearest ${newName},`;
    if (newMessage) {
      const paras = newMessage.split(/\n\s*\n/);
      if (paras.length > 1) {
        wishesMessageBody.innerHTML = paras
          .map((p, idx) => `<p class="letter-para ${idx === 0 ? 'para-opening' : 'para-main'}">${p.replace(/\n/g, '<br />')}</p>`)
          .join('');
      } else {
        wishesMessageBody.innerHTML = `<p class="letter-para para-opening">${newMessage.replace(/\n/g, '<br />')}</p>`;
      }
    }

    customizerModal.classList.remove('open');
    goToStage(state.currentStage);
  });

  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm('Reset custom images, music, and text to default?')) {
      const keys = [
        'bday_friend_name', 'bday_wish_message', 'bday_asset_miffy1',
        'bday_asset_miffy2', 'bday_asset_cake', 'bday_asset_jellycat',
        'bday_asset_star_bg', 'bday_asset_dots_bg', 'bday_asset_cherry_vid',
        'bday_asset_music', 'bday_asset_box3', 'bday_asset_box4', 'bday_asset_box5'
      ];
      keys.forEach((k) => localStorage.removeItem(k));
      window.location.reload();
    }
  });

  // =========================================================
  // INITIALIZATION ON PAGE LOAD
  // =========================================================
  window.addEventListener('DOMContentLoaded', () => {
    initAssets();
    goToStage(1);
  });
})();
