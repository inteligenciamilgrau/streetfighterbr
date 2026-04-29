(function () {
  "use strict";

  const VIEW_W = 1280;
  const VIEW_H = 720;
  const FLOOR_Y = 585;
  const GRAVITY = 1800;
  const ROUND_WINS_TO_MATCH = 2;
  const ROUND_INTRO_DURATION = 2.25;
  const ROUND_OVER_DURATION = 1.35;
  const FINAL_HIT_SLOWMO_DURATION = 1.05;
  const FINAL_HIT_SLOWMO_SCALE = 0.18;

  const stages = {
    title: {
      name: "Abertura",
      image: "assets/images/ui/title-screen.jpg",
      music: { bpm: 100, wave: "sawtooth", notes: [196, 247, 294, 330, 294, 247, 220, 247], bass: [98, 98, 123, 147] }
    },
    norte: {
      name: "Norte - Encontro das Águas",
      image: "assets/images/backgrounds/norte.jpg",
      music: { bpm: 108, wave: "sine", notes: [220, 262, 330, 392, 330, 262, 247, 294], bass: [110, 110, 98, 123] }
    },
    nordeste: {
      name: "Nordeste - Praça do Sol",
      image: "assets/images/backgrounds/nordeste.jpg",
      music: { bpm: 126, wave: "square", notes: [294, 330, 370, 440, 494, 440, 370, 330], bass: [147, 147, 165, 185] }
    },
    centro: {
      name: "Centro-Oeste - Pantanal Dourado",
      image: "assets/images/backgrounds/centro-oeste.jpg",
      music: { bpm: 104, wave: "triangle", notes: [196, 247, 294, 349, 330, 294, 247, 220], bass: [98, 123, 98, 147] }
    },
    sudeste: {
      name: "Sudeste - Terraço de Neon",
      image: "assets/images/backgrounds/sudeste.jpg",
      music: { bpm: 118, wave: "sawtooth", notes: [165, 196, 247, 330, 370, 330, 247, 196], bass: [82, 98, 123, 98] }
    },
    sul: {
      name: "Sul - Praça Araucária",
      image: "assets/images/backgrounds/sul.jpg",
      music: { bpm: 112, wave: "triangle", notes: [220, 277, 330, 370, 415, 370, 330, 277], bass: [110, 139, 110, 165] }
    },
    boss: {
      name: "Final - Arena Atlas",
      image: "assets/images/backgrounds/boss.jpg",
      music: { bpm: 132, wave: "sawtooth", notes: [98, 147, 196, 247, 294, 247, 196, 147], bass: [49, 49, 62, 73] }
    }
  };

  const fighters = [
    {
      id: "nayara",
      name: "Nayara Corrente",
      region: "Região Norte",
      stage: "norte",
      sheet: "assets/images/characters/nayara-sheet.png",
      color: "#42d889",
      bio: "Ribeirinha veloz, luta com base baixa, esquivas curtas e golpes que lembram o ritmo das águas.",
      moves: { punch: "Jab do Remo", kick: "Chute Afluente", jump: "Salto de Igapó", special: "Correnteza Verde" },
      stats: { power: 0.94, speed: 1.12, reach: 1.0, hp: 100 }
    },
    {
      id: "bento",
      name: "Bento Mandacaru",
      region: "Região Nordeste",
      stage: "nordeste",
      sheet: "assets/images/characters/bento-sheet.png",
      color: "#ffbf3d",
      bio: "Lutador solar que mistura passos de xaxado, frevo e capoeira em ataques rápidos e circulares.",
      moves: { punch: "Jab do Cordel", kick: "Meia-Lua do Sol", jump: "Pulo do Frevo", special: "Explosão Mandacaru" },
      stats: { power: 1.0, speed: 1.06, reach: 1.04, hp: 104 }
    },
    {
      id: "taina",
      name: "Tainá Cerrado",
      region: "Região Centro-Oeste",
      stage: "centro",
      sheet: "assets/images/characters/taina-sheet.png",
      color: "#38c7cf",
      bio: "Guarda do cerrado e atleta urbana, usa golpes amplos, giros firmes e pressão de média distância.",
      moves: { punch: "Cruzado do Cerrado", kick: "Giro do Pantanal", jump: "Salto Buriti", special: "Vento Dourado" },
      stats: { power: 1.04, speed: 0.98, reach: 1.08, hp: 108 }
    },
    {
      id: "deco",
      name: "Deco Concreto",
      region: "Região Sudeste",
      stage: "sudeste",
      sheet: "assets/images/characters/deco-sheet.png",
      color: "#54b7ff",
      bio: "Boxeador de rua com base de dança e jiu-jitsu, forte em aproximação e contra-ataque.",
      moves: { punch: "Gancho da Linha", kick: "Baixa do Asfalto", jump: "Pulo do Viaduto", special: "Onda Neon" },
      stats: { power: 1.08, speed: 1.02, reach: 0.98, hp: 106 }
    },
    {
      id: "anita",
      name: "Anita Araucária",
      region: "Região Sul",
      stage: "sul",
      sheet: "assets/images/characters/anita-sheet.png",
      color: "#d46174",
      bio: "Precisão fria, postura firme e chutes ascendentes inspirados no vento minuano e no pampa.",
      moves: { punch: "Palma do Pampa", kick: "Chute Minuano", jump: "Salto da Serra", special: "Corte Araucária" },
      stats: { power: 1.02, speed: 1.0, reach: 1.1, hp: 110 }
    }
  ];

  const boss = {
    id: "atlas",
    name: "Atlas Brasilis",
    region: "Chefão Final",
    stage: "boss",
    sheet: "assets/images/characters/atlas-sheet.png",
    color: "#f7c846",
    bio: "Campeão da arena nacional, usa armadura energética e golpes pesados de alcance longo.",
    moves: { punch: "Punho Atlas", kick: "Chute Colosso", jump: "Salto Orbital", special: "Mapa de Impacto" },
    stats: { power: 1.22, speed: 0.92, reach: 1.22, hp: 142 },
    boss: true
  };

  const mapPins = [
    { fighter: "nayara", label: "N", x: "39%", y: "34%" },
    { fighter: "bento", label: "NE", x: "66%", y: "37%" },
    { fighter: "taina", label: "CO", x: "49%", y: "57%" },
    { fighter: "deco", label: "SE", x: "61%", y: "66%" },
    { fighter: "anita", label: "S", x: "54%", y: "79%" }
  ];

  const actionDefs = {
    punch: { row: 1, duration: 0.28, hitAt: 0.12, range: 118, damage: 8, knock: 175, meter: 11 },
    kick: { row: 2, duration: 0.43, hitAt: 0.2, range: 150, damage: 12, knock: 235, meter: 14 },
    special: { row: 3, duration: 0.68, hitAt: 0.32, range: 270, damage: 22, knock: 340, meter: 0, cost: 35 }
  };

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const screens = Array.from(document.querySelectorAll(".screen"));
  const images = {};
  const spriteFrames = {};
  const keys = { left: false, right: false };
  const effects = [];

  let selectedId = "nayara";
  let selected = fighters[0];
  let assetsReady = false;
  let currentScreen = "title-screen";
  let animationId = 0;
  let lastTime = 0;
  let match = null;

  class AudioSystem {
    constructor() {
      this.ctx = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.timer = 0;
      this.step = 0;
      this.stageId = "title";
      this.musicVolume = Number(localStorage.getItem("sfbr-music") || 55) / 100;
      this.sfxVolume = Number(localStorage.getItem("sfbr-sfx") || 75) / 100;
    }

    unlock() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
        this.applyVolumes();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
    }

    applyVolumes() {
      if (!this.ctx) return;
      this.musicGain.gain.value = this.musicVolume * 0.28;
      this.sfxGain.gain.value = this.sfxVolume * 0.5;
    }

    setVolumes(music, sfx) {
      this.musicVolume = music;
      this.sfxVolume = sfx;
      localStorage.setItem("sfbr-music", Math.round(music * 100));
      localStorage.setItem("sfbr-sfx", Math.round(sfx * 100));
      this.applyVolumes();
    }

    start(stageId) {
      this.unlock();
      if (!this.ctx) return;
      if (this.stageId === stageId && this.timer) return;
      this.stop();
      this.stageId = stageId;
      this.step = 0;
      const theme = stages[stageId].music;
      const interval = (60000 / theme.bpm) / 2;
      this.tick();
      this.timer = window.setInterval(() => this.tick(), interval);
    }

    stop() {
      if (this.timer) window.clearInterval(this.timer);
      this.timer = 0;
    }

    tick() {
      if (!this.ctx) return;
      const theme = stages[this.stageId].music;
      const now = this.ctx.currentTime;
      const note = theme.notes[this.step % theme.notes.length];
      const bass = theme.bass[Math.floor(this.step / 2) % theme.bass.length];
      this.tone(note, now, 0.12, theme.wave, 0.055, this.musicGain);
      if (this.step % 2 === 0) this.tone(bass, now, 0.18, "triangle", 0.06, this.musicGain);
      if (this.step % 2 === 1) this.noise(now, 0.045, 0.035);
      this.step += 1;
    }

    tone(freq, start, duration, type, gain, destination) {
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(gain, start + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(amp);
      amp.connect(destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    }

    noise(start, duration, gain) {
      const samples = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
      const buffer = this.ctx.createBuffer(1, samples, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < samples; i += 1) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      const amp = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 2400;
      amp.gain.setValueAtTime(gain, start);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      src.buffer = buffer;
      src.connect(filter);
      filter.connect(amp);
      amp.connect(this.musicGain);
      src.start(start);
      src.stop(start + duration);
    }

    sfx(kind) {
      this.unlock();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (kind === "special") {
        this.tone(196, now, 0.14, "sawtooth", 0.18, this.sfxGain);
        this.tone(392, now + 0.06, 0.18, "square", 0.12, this.sfxGain);
        return;
      }
      if (kind === "hit") {
        this.tone(88, now, 0.08, "square", 0.16, this.sfxGain);
        this.noiseTo(this.sfxGain, now, 0.08, 0.08);
        return;
      }
      if (kind === "block") {
        this.tone(176, now, 0.06, "triangle", 0.14, this.sfxGain);
        this.tone(352, now + 0.035, 0.08, "square", 0.08, this.sfxGain);
        return;
      }
      if (kind === "select") {
        this.tone(523, now, 0.08, "triangle", 0.12, this.sfxGain);
        return;
      }
      this.tone(kind === "kick" ? 140 : 180, now, 0.06, "square", 0.1, this.sfxGain);
    }

    noiseTo(destination, start, duration, gain) {
      const samples = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
      const buffer = this.ctx.createBuffer(1, samples, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < samples; i += 1) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      const amp = this.ctx.createGain();
      amp.gain.setValueAtTime(gain, start);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      src.buffer = buffer;
      src.connect(amp);
      amp.connect(destination);
      src.start(start);
      src.stop(start + duration);
    }
  }

  const audio = new AudioSystem();

  function imagePaths() {
    const paths = Object.values(stages).map((stage) => stage.image);
    fighters.concat(boss).forEach((fighter) => paths.push(fighter.sheet));
    return Array.from(new Set(paths));
  }

  function loadImages() {
    const tasks = imagePaths().map((path) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        images[path] = img;
        resolve();
      };
      img.onerror = () => reject(new Error(path));
      img.src = path;
    }));
    return Promise.all(tasks);
  }

  function buildSpriteFrames() {
    fighters.concat(boss).forEach((fighter) => {
      const img = images[fighter.sheet];
      if (!img) return;
      const meta = analyzeSpriteSheet(img);
      if (meta) spriteFrames[fighter.sheet] = meta;
    });
  }

  function analyzeSpriteSheet(img) {
    const sheetW = Math.floor(img.width);
    const sheetH = Math.floor(img.height);
    const cellW = Math.floor(sheetW / 4);
    const cellH = Math.floor(sheetH / 4);
    const canvas = document.createElement("canvas");
    canvas.width = sheetW;
    canvas.height = sheetH;
    const buffer = canvas.getContext("2d", { willReadFrequently: true });
    if (!buffer) return null;
    buffer.drawImage(img, 0, 0);

    try {
      const pixels = buffer.getImageData(0, 0, sheetW, sheetH).data;
      const rows = [];
      for (let row = 0; row < 4; row += 1) {
        const frames = [];
        for (let frame = 0; frame < 4; frame += 1) {
          frames.push(measureSpriteFrame(pixels, sheetW, cellW, cellH, row, frame));
        }
        rows.push(frames);
      }
      return { cellW, cellH, rows };
    } catch (error) {
      return null;
    }
  }

  function measureSpriteFrame(pixels, sheetW, cellW, cellH, row, frame) {
    const cellX = frame * cellW;
    const cellY = row * cellH;
    let left = cellW;
    let top = cellH;
    let right = 0;
    let bottom = 0;

    for (let y = 0; y < cellH; y += 1) {
      for (let x = 0; x < cellW; x += 1) {
        const alpha = pixels[((cellY + y) * sheetW + cellX + x) * 4 + 3];
        if (alpha <= 12) continue;
        if (x < left) left = x;
        if (x + 1 > right) right = x + 1;
        if (y < top) top = y;
        if (y + 1 > bottom) bottom = y + 1;
      }
    }

    if (right <= left || bottom <= top) {
      return {
        sx: cellX,
        sy: cellY,
        sw: cellW,
        sh: cellH,
        left: 0,
        top: 0,
        anchorX: cellW / 2,
        anchorY: cellH
      };
    }

    const footStart = Math.max(top, bottom - Math.max(10, Math.floor((bottom - top) * 0.16)));
    let footX = 0;
    let footPixels = 0;
    for (let y = footStart; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const alpha = pixels[((cellY + y) * sheetW + cellX + x) * 4 + 3];
        if (alpha <= 12) continue;
        footX += x;
        footPixels += 1;
      }
    }

    return {
      sx: cellX + left,
      sy: cellY + top,
      sw: right - left,
      sh: bottom - top,
      left,
      top,
      anchorX: footPixels ? footX / footPixels : (left + right) / 2,
      anchorY: bottom
    };
  }

  function setScreen(id) {
    currentScreen = id;
    screens.forEach((screen) => screen.classList.toggle("is-active", screen.id === id));
    if (id === "title-screen") audio.start("title");
    if (id !== "game-screen") {
      keys.left = false;
      keys.right = false;
      cancelAnimationFrame(animationId);
      window.requestAnimationFrame(() => focusDefaultControl(id));
    }
  }

  function createFighter(data, x, side, cpu) {
    return {
      data,
      x,
      y: FLOOR_Y,
      vx: 0,
      vy: 0,
      facing: side,
      cpu,
      hp: data.stats.hp,
      maxHp: data.stats.hp,
      meter: cpu && data.boss ? 35 : 0,
      action: "idle",
      actionElapsed: 0,
      hitDone: false,
      hurtTimer: 0,
      aiTimer: 0,
      aiIntent: "idle",
      onGround: true
    };
  }

  function startArcade() {
    if (!assetsReady) return;
    selected = fighters.find((fighter) => fighter.id === selectedId) || fighters[0];
    const opponents = fighters.filter((fighter) => fighter.id !== selected.id).concat(boss);
    match = {
      player: null,
      enemy: null,
      opponents,
      index: 0,
      timer: 90,
      stageId: opponents[0].stage,
      state: "intro",
      elapsed: 0,
      round: 1,
      playerRounds: 0,
      enemyRounds: 0,
      roundIntroElapsed: 0,
      roundOverElapsed: 0,
      slowMoElapsed: 0,
      roundWinner: null
    };
    startRound(1);
    setScreen("game-screen");
    audio.start(match.stageId);
    cancelAnimationFrame(animationId);
    lastTime = performance.now();
    loop(lastTime);
  }

  function nextMatch() {
    if (!match) return;
    match.index += 1;
    const next = match.opponents[match.index];
    if (!next) {
      showResult("campeao");
      return;
    }
    match.playerRounds = 0;
    match.enemyRounds = 0;
    match.round = 1;
    match.stageId = next.stage;
    startRound(1);
    setScreen("game-screen");
    audio.start(match.stageId);
    cancelAnimationFrame(animationId);
    lastTime = performance.now();
    loop(lastTime);
  }

  function startRound(roundNumber) {
    if (!match) return;
    const opponent = match.opponents[match.index];
    match.player = createFighter(selected, 310, 1, false);
    match.enemy = createFighter(opponent, 970, -1, true);
    match.round = roundNumber;
    match.timer = opponent.boss ? 99 : 90;
    match.stageId = opponent.stage;
    match.state = "intro";
    match.elapsed = 0;
    match.roundIntroElapsed = 0;
    match.roundOverElapsed = 0;
    match.slowMoElapsed = 0;
    match.roundWinner = null;
    keys.left = false;
    keys.right = false;
    effects.length = 0;
  }

  function triggerAction(fighter, action) {
    if (!match || match.state !== "active") return;
    if (fighter.action !== "idle") return;
    if (action === "jump") {
      if (!fighter.onGround) return;
      fighter.vy = -720;
      fighter.onGround = false;
      return;
    }
    if (action === "special") {
      const cost = actionDefs.special.cost;
      if (fighter.meter < cost) {
        audio.sfx("punch");
        fighter.action = "punch";
      } else {
        fighter.meter -= cost;
        fighter.action = "special";
        audio.sfx("special");
      }
    } else {
      fighter.action = action;
      audio.sfx(action);
    }
    fighter.actionElapsed = 0;
    fighter.hitDone = false;
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
    lastTime = now;
    if (match && currentScreen === "game-screen") {
      updateMatch(dt);
      drawMatch(now / 1000);
      updateHud();
      animationId = requestAnimationFrame(loop);
    }
  }

  function updateMatch(dt) {
    if (match.state === "intro") {
      updateRoundIntro(dt);
      return;
    }
    if (match.state === "slowmo") {
      updateFinalHitSlowMo(dt);
      return;
    }
    if (match.state === "round-over") {
      updateRoundOver(dt);
      return;
    }
    if (match.state !== "active") return;
    const player = match.player;
    const enemy = match.enemy;

    match.elapsed += dt;
    match.timer = Math.max(0, (match.enemy.data.boss ? 99 : 90) - Math.floor(match.elapsed));

    player.facing = enemy.x >= player.x ? 1 : -1;
    enemy.facing = player.x >= enemy.x ? 1 : -1;

    const speed = 310 * player.data.stats.speed;
    player.vx = 0;
    if (keys.left) player.vx -= speed;
    if (keys.right) player.vx += speed;
    if (player.action !== "idle" && player.onGround) player.vx *= 0.38;

    updateAI(enemy, player, dt);
    updateFighter(player, enemy, dt);
    if (match.state !== "active") {
      updateEffects(dt * FINAL_HIT_SLOWMO_SCALE);
      return;
    }
    updateFighter(enemy, player, dt);
    if (match.state !== "active") {
      updateEffects(dt * FINAL_HIT_SLOWMO_SCALE);
      return;
    }
    resolveCollision(player, enemy);
    updateEffects(dt);

    if (player.hp <= 0 || enemy.hp <= 0 || match.timer <= 0) {
      const playerWins = enemy.hp <= 0 || (match.timer <= 0 && player.hp >= enemy.hp);
      if (match.timer <= 0) finishRound(playerWins ? "player" : "enemy");
      else startFinalHitSlowMo(playerWins ? "player" : "enemy");
    }
  }

  function updateRoundIntro(dt) {
    match.roundIntroElapsed += dt;
    if (match.roundIntroElapsed >= ROUND_INTRO_DURATION) {
      match.state = "active";
      match.roundIntroElapsed = ROUND_INTRO_DURATION;
    }
  }

  function updateFinalHitSlowMo(dt) {
    match.slowMoElapsed += dt;
    const slowDt = dt * FINAL_HIT_SLOWMO_SCALE;
    updateFighter(match.player, match.enemy, slowDt, false);
    updateFighter(match.enemy, match.player, slowDt, false);
    resolveCollision(match.player, match.enemy);
    updateEffects(slowDt);
    if (match.slowMoElapsed >= FINAL_HIT_SLOWMO_DURATION) finishRound(match.roundWinner);
  }

  function updateRoundOver(dt) {
    match.roundOverElapsed += dt;
    updateEffects(dt);
    if (match.roundOverElapsed < ROUND_OVER_DURATION) return;

    if (match.playerRounds >= ROUND_WINS_TO_MATCH || match.enemyRounds >= ROUND_WINS_TO_MATCH) {
      match.state = "ended";
      window.setTimeout(() => showResult(match.playerRounds >= ROUND_WINS_TO_MATCH ? "win" : "lose"), 250);
      return;
    }

    startRound(match.round + 1);
  }

  function updateAI(cpu, target, dt) {
    cpu.aiTimer -= dt;
    const distance = Math.abs(cpu.x - target.x);
    if (cpu.aiTimer <= 0) {
      cpu.aiTimer = cpu.data.boss ? 0.28 : 0.42;
      if (distance > 230) cpu.aiIntent = "approach";
      else if (distance < 82) cpu.aiIntent = "back";
      else cpu.aiIntent = Math.random() > (cpu.data.boss ? 0.25 : 0.4) ? "attack" : "hold";
    }

    const cpuSpeed = 235 * cpu.data.stats.speed;
    cpu.vx = 0;
    if (cpu.aiIntent === "approach") cpu.vx = cpu.facing * cpuSpeed;
    if (cpu.aiIntent === "back") cpu.vx = -cpu.facing * cpuSpeed * 0.65;
    if (cpu.aiIntent === "attack" && cpu.action === "idle") {
      const choice = cpu.meter >= 35 && Math.random() > 0.54 ? "special" : distance > 125 ? "kick" : "punch";
      triggerAction(cpu, choice);
    }
    if (!cpu.data.boss && cpu.onGround && distance > 330 && Math.random() < 0.006) triggerAction(cpu, "jump");
  }

  function updateFighter(fighter, opponent, dt, canHit = true) {
    fighter.x += fighter.vx * dt;
    fighter.y += fighter.vy * dt;
    fighter.vy += GRAVITY * dt;
    fighter.x = clamp(fighter.x, 90, VIEW_W - 90);
    if (fighter.y >= FLOOR_Y) {
      fighter.y = FLOOR_Y;
      fighter.vy = 0;
      fighter.onGround = true;
    }

    if (fighter.hurtTimer > 0) fighter.hurtTimer -= dt;
    if (fighter.action !== "idle") {
      const def = actionDefs[fighter.action];
      fighter.actionElapsed += dt;
      if (canHit && !fighter.hitDone && fighter.actionElapsed >= def.hitAt) {
        applyHit(fighter, opponent, def);
        fighter.hitDone = true;
      }
      if (fighter.actionElapsed >= def.duration) {
        fighter.action = "idle";
        fighter.actionElapsed = 0;
        fighter.hitDone = false;
      }
    } else {
      fighter.meter = clamp(fighter.meter + dt * 2.3, 0, 100);
    }
  }

  function applyHit(attacker, defender, def) {
    const distance = Math.abs(attacker.x - defender.x);
    const vertical = Math.abs(attacker.y - defender.y);
    const range = def.range * attacker.data.stats.reach;
    const facingTarget = attacker.facing === 1 ? defender.x > attacker.x - 12 : defender.x < attacker.x + 12;
    if (distance > range || vertical > 125 || !facingTarget) return;
    const blocked = isPlayerBlocking(defender, attacker);
    const baseDamage = def.damage * attacker.data.stats.power * (def === actionDefs.special ? 1.08 : 1);
    const damage = blocked ? baseDamage * 0.18 : baseDamage;
    defender.hp = Math.max(0, defender.hp - damage);
    defender.vx += attacker.facing * def.knock * (blocked ? 0.32 : 1);
    defender.hurtTimer = blocked ? 0.08 : 0.18;
    attacker.meter = clamp(attacker.meter + def.meter * (blocked ? 0.45 : 1), 0, 100);
    defender.meter = clamp(defender.meter + (blocked ? baseDamage * 0.6 : damage * 0.35), 0, 100);
    effects.push({
      type: blocked ? "block" : attacker.action,
      x: defender.x - attacker.facing * 45,
      y: defender.y - 145,
      color: blocked ? "#b5f2ff" : attacker.data.color,
      life: 0.32,
      max: 0.32,
      dir: attacker.facing
    });
    audio.sfx(blocked ? "block" : "hit");
    if (defender.hp <= 0 && match && match.state === "active") {
      startFinalHitSlowMo(defender === match.enemy ? "player" : "enemy");
    }
  }

  function startFinalHitSlowMo(winner) {
    if (!match || match.state !== "active") return;
    match.state = "slowmo";
    match.roundWinner = winner;
    match.slowMoElapsed = 0;
    keys.left = false;
    keys.right = false;
  }

  function finishRound(winner) {
    if (!match || match.state === "round-over" || match.state === "ended") return;
    match.roundWinner = winner;
    match.roundOverElapsed = 0;
    match.state = "round-over";
    if (winner === "player") match.playerRounds += 1;
    else match.enemyRounds += 1;
    keys.left = false;
    keys.right = false;
  }

  function isPlayerBlocking(defender, attacker) {
    if (!match || defender !== match.player || !defender.onGround || defender.action !== "idle") return false;
    const attackerIsRight = attacker.x > defender.x;
    return attackerIsRight ? keys.left : keys.right;
  }

  function resolveCollision(a, b) {
    const minDist = 82;
    const diff = b.x - a.x;
    if (Math.abs(diff) < minDist) {
      const push = (minDist - Math.abs(diff)) / 2;
      const dir = diff >= 0 ? 1 : -1;
      a.x -= push * dir;
      b.x += push * dir;
      a.x = clamp(a.x, 90, VIEW_W - 90);
      b.x = clamp(b.x, 90, VIEW_W - 90);
    }
  }

  function updateEffects(dt) {
    for (let i = effects.length - 1; i >= 0; i -= 1) {
      effects[i].life -= dt;
      if (effects[i].life <= 0) effects.splice(i, 1);
    }
  }

  function drawMatch(time) {
    const stage = stages[match.stageId];
    drawCover(images[stage.image], 0, 0, VIEW_W, VIEW_H);
    drawStageLighting(time);
    drawFighter(match.player, time);
    drawFighter(match.enemy, time);
    drawEffects();
    drawRoundOverlay();
  }

  function drawCover(img, x, y, w, h) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function drawStageLighting(time) {
    const grad = ctx.createLinearGradient(0, FLOOR_Y - 80, 0, VIEW_H);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.globalAlpha = 0.13 + Math.sin(time * 2) * 0.03;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, VIEW_W, 2);
    ctx.globalAlpha = 1;
  }

  function drawFighter(fighter, time) {
    const img = images[fighter.data.sheet];
    const cellW = img.width / 4;
    const cellH = img.height / 4;
    const def = fighter.action === "idle" ? null : actionDefs[fighter.action];
    const row = def ? def.row : 0;
    const idleFrames = [0, 1, 0, 2];
    const frame = def
      ? clamp(Math.floor((fighter.actionElapsed / def.duration) * 4), 0, 3)
      : idleFrames[Math.floor(time * 2.8) % idleFrames.length];
    const bossScale = fighter.data.boss ? 1.16 : 1;
    const drawH = 292 * bossScale;
    const drawW = drawH * (cellW / cellH);
    const bob = fighter.onGround && fighter.action === "idle" ? Math.sin(time * 8) * 3 : 0;
    const meta = spriteFrames[fighter.data.sheet];
    const frameBox = meta && meta.rows[row] ? meta.rows[row][frame] : null;
    const scale = drawH / cellH;

    ctx.save();
    ctx.translate(fighter.x, fighter.y + bob);
    ctx.scale(fighter.facing, 1);
    ctx.globalAlpha = fighter.hurtTimer > 0 ? 0.72 : 1;
    if (frameBox) {
      ctx.drawImage(
        img,
        frameBox.sx,
        frameBox.sy,
        frameBox.sw,
        frameBox.sh,
        (frameBox.left - frameBox.anchorX) * scale,
        (frameBox.top - frameBox.anchorY) * scale,
        frameBox.sw * scale,
        frameBox.sh * scale
      );
    } else {
      ctx.drawImage(img, frame * cellW, row * cellH, cellW, cellH, -drawW / 2, -drawH, drawW, drawH);
    }
    ctx.globalAlpha = 0.36;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(0, 4, 58 * bossScale, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawEffects() {
    effects.forEach((fx) => {
      const t = 1 - fx.life / fx.max;
      ctx.save();
      ctx.translate(fx.x, fx.y);
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = fx.color;
      ctx.lineWidth = fx.type === "special" ? 9 : fx.type === "block" ? 7 : 5;
      ctx.beginPath();
      ctx.arc(0, 0, 22 + t * (fx.type === "special" ? 95 : fx.type === "block" ? 58 : 45), -0.8, 0.8);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(fx.dir * (18 + t * 54), -t * 16, fx.type === "special" ? 9 : fx.type === "block" ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawRoundOverlay() {
    if (!match) return;

    if (match.state === "intro") {
      const fightPhase = match.roundIntroElapsed >= 1.12;
      const title = fightPhase ? "FIGHT!" : `ROUND ${match.round}`;
      const subtitle = `${match.player.data.name}  ${match.playerRounds} - ${match.enemyRounds}  ${match.enemy.data.name}`;
      drawCenterMessage(title, subtitle, fightPhase ? "#f7c846" : "#ffffff", 1);
      return;
    }

    if (match.state === "slowmo") {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(0, 84, VIEW_W, 3);
      ctx.fillRect(0, VIEW_H - 86, VIEW_W, 3);
      ctx.restore();
      return;
    }

    if (match.state === "round-over") {
      const winner = match.roundWinner === "player" ? match.player.data.name : match.enemy.data.name;
      drawCenterMessage(`${winner} VENCE`, `${match.playerRounds} - ${match.enemyRounds}`, "#f7c846", 0.92);
    }
  }

  function drawCenterMessage(title, subtitle, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    ctx.shadowBlur = 18;
    ctx.font = "900 86px Inter, system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(title, VIEW_W / 2, VIEW_H / 2 - 28);
    ctx.font = "900 28px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(subtitle, VIEW_W / 2, VIEW_H / 2 + 58);
    ctx.restore();
  }

  function updateHud() {
    const p = match.player;
    const e = match.enemy;
    document.getElementById("player-name").textContent = p.data.name;
    document.getElementById("enemy-name").textContent = e.data.name;
    document.getElementById("stage-name").textContent = stages[match.stageId].name;
    document.getElementById("round-timer").textContent = String(match.timer).padStart(2, "0");
    document.getElementById("round-score").textContent = `Round ${match.round} | ${match.playerRounds} - ${match.enemyRounds}`;
    document.getElementById("player-health").style.width = `${clamp((p.hp / p.maxHp) * 100, 0, 100)}%`;
    document.getElementById("enemy-health").style.width = `${clamp((e.hp / e.maxHp) * 100, 0, 100)}%`;
    document.getElementById("player-meter").style.width = `${p.meter}%`;
    document.getElementById("enemy-meter").style.width = `${e.meter}%`;
  }

  function renderResultMatchup(playerWon) {
    if (!match || !match.player || !match.enemy) return;
    const playerCard = document.getElementById("result-left");
    const enemyCard = document.getElementById("result-right");
    fillResultCard(playerCard, match.player.data, match.playerRounds, playerWon);
    fillResultCard(enemyCard, match.enemy.data, match.enemyRounds, !playerWon);
  }

  function fillResultCard(card, fighter, rounds, won) {
    const avatar = card.querySelector(".result-avatar");
    const name = card.querySelector("strong");
    const score = card.querySelector("span:not(.result-badge)");
    card.classList.toggle("is-winner", won);
    card.classList.toggle("is-loser", !won);
    avatar.style.backgroundImage = `url('${fighter.sheet}')`;
    name.textContent = fighter.name;
    score.textContent = `${rounds} round${rounds === 1 ? "" : "s"}`;
  }

  function showResult(type) {
    cancelAnimationFrame(animationId);
    const title = document.getElementById("result-title");
    const kicker = document.getElementById("result-kicker");
    const copy = document.getElementById("result-copy");
    const continueButton = document.getElementById("continue-button");
    const wonRound = type === "win";
    const champion = type === "campeao" || (wonRound && match.enemy.data.boss);
    const playerWonMatch = type !== "lose";
    renderResultMatchup(playerWonMatch);

    if (champion) {
      kicker.textContent = "Campeão";
      title.textContent = "You Win";
      copy.textContent = "O cinturão nacional fica com a sua região. O mapa inteiro desbloqueou a celebração final.";
      continueButton.textContent = "Jogar de novo";
      continueButton.onclick = startArcade;
    } else if (wonRound) {
      kicker.textContent = "Vitória";
      title.textContent = "You Win";
      copy.textContent = "Você levou o melhor de 3. A próxima região já entrou na arena.";
      continueButton.textContent = "Próxima luta";
      continueButton.onclick = nextMatch;
    } else {
      kicker.textContent = "Derrota";
      title.textContent = "You Lose";
      copy.textContent = "O adversário venceu dois rounds. A revanche começa do primeiro adversário.";
      continueButton.textContent = "Tentar de novo";
      continueButton.onclick = startArcade;
    }

    setScreen("result-screen");
    audio.start(champion ? "title" : match.stageId);
  }

  function createFighterPortrait(sheet) {
    const portrait = document.createElement("div");
    portrait.className = "fighter-card__portrait";
    portrait.style.backgroundImage = `url('${sheet}')`;
    return portrait;
  }

  function appendFighterSummary(parent, fighter) {
    const text = document.createElement("div");
    text.className = "fighter-card__text";

    const name = document.createElement("strong");
    name.textContent = fighter.name;

    const region = document.createElement("span");
    region.textContent = fighter.region;

    text.append(name, region);
    parent.append(createFighterPortrait(fighter.sheet), text);
  }

  function createRosterItem(fighter) {
    const item = document.createElement("article");
    item.className = "roster-item";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    const region = document.createElement("span");
    const bio = document.createElement("p");

    name.textContent = fighter.name;
    region.textContent = fighter.region;
    bio.textContent = fighter.bio;

    info.append(name, region, bio);
    item.append(createFighterPortrait(fighter.sheet), info);
    return item;
  }

  function renderSelect() {
    const grid = document.getElementById("fighter-grid");
    const pins = document.getElementById("map-pins");
    const roster = document.getElementById("roster-list");
    grid.replaceChildren();
    pins.replaceChildren();
    roster.replaceChildren();

    fighters.forEach((fighter) => {
      const card = document.createElement("button");
      card.className = "fighter-card";
      card.style.setProperty("--fighter-color", fighter.color);
      card.dataset.fighter = fighter.id;
      appendFighterSummary(card, fighter);
      card.addEventListener("click", () => chooseFighter(fighter.id));
      grid.appendChild(card);

      roster.appendChild(createRosterItem(fighter));
    });

    roster.appendChild(createRosterItem(boss));

    mapPins.forEach((pin) => {
      const fighter = fighters.find((item) => item.id === pin.fighter);
      const button = document.createElement("button");
      button.className = "pin";
      button.style.setProperty("--x", pin.x);
      button.style.setProperty("--y", pin.y);
      button.style.setProperty("--pin-color", fighter.color);
      button.dataset.fighter = fighter.id;
      button.textContent = pin.label;
      button.addEventListener("click", () => chooseFighter(fighter.id));
      pins.appendChild(button);
    });

    updateSelection();
  }

  function chooseFighter(id) {
    selectedId = id;
    audio.sfx("select");
    updateSelection();
  }

  function updateSelection() {
    selected = fighters.find((fighter) => fighter.id === selectedId) || fighters[0];
    document.querySelectorAll(".fighter-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.fighter === selected.id);
    });
    document.querySelectorAll(".pin").forEach((pin, index) => {
      pin.classList.toggle("is-selected", mapPins[index].fighter === selected.id);
    });
    const portrait = document.getElementById("selected-portrait");
    portrait.style.backgroundImage = `url('${selected.sheet}')`;
    portrait.style.borderColor = selected.color;
    document.getElementById("selected-region").textContent = selected.region;
    document.getElementById("selected-name").textContent = selected.name;
    document.getElementById("selected-bio").textContent = selected.bio;

    const moves = document.getElementById("selected-moves");
    moves.replaceChildren();
    [
      ["Soco", selected.moves.punch],
      ["Chute", selected.moves.kick],
      ["Pulo", selected.moves.jump],
      ["Especial", selected.moves.special]
    ].forEach(([label, value]) => {
      const wrap = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      wrap.append(term, description);
      moves.appendChild(wrap);
    });
  }

  function bindControls() {
    document.getElementById("start-button").addEventListener("click", () => {
      audio.start("title");
      setScreen("select-screen");
    });
    document.getElementById("fight-button").addEventListener("click", startArcade);
    document.getElementById("open-roster-button").addEventListener("click", () => openDialog("roster-dialog"));
    document.querySelectorAll("[data-screen]").forEach((button) => {
      button.addEventListener("click", () => setScreen(button.dataset.screen));
    });
    document.querySelectorAll("[data-open-config]").forEach((button) => {
      button.addEventListener("click", () => openDialog("config-dialog"));
    });

    const music = document.getElementById("music-volume");
    const sfx = document.getElementById("sfx-volume");
    music.value = Math.round(audio.musicVolume * 100);
    sfx.value = Math.round(audio.sfxVolume * 100);
    [music, sfx].forEach((input) => {
      input.addEventListener("input", () => audio.setVolumes(Number(music.value) / 100, Number(sfx.value) / 100));
    });

    window.addEventListener("keydown", (event) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (handleMenuKey(event, key)) return;
      if (key === "enter" && currentScreen === "title-screen") setScreen("select-screen");
      if (key === "enter" && currentScreen === "select-screen") startArcade();
      if (!match || currentScreen !== "game-screen") return;
      if (key === "a" || key === "arrowleft") keys.left = true;
      if (key === "d" || key === "arrowright") keys.right = true;
      if (key === "w" || key === "arrowup" || key === " ") triggerAction(match.player, "jump");
      if (key === "j") triggerAction(match.player, "punch");
      if (key === "k") triggerAction(match.player, "kick");
      if (key === "l") triggerAction(match.player, "special");
      if (key === "escape") openDialog("config-dialog");
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (key === "a" || key === "arrowleft") keys.left = false;
      if (key === "d" || key === "arrowright") keys.right = false;
    });

    document.querySelectorAll("[data-hold]").forEach((button) => {
      const direction = button.dataset.hold;
      button.addEventListener("pointerdown", (event) => { keys[direction] = true; button.setPointerCapture(event.pointerId); });
      button.addEventListener("pointerup", () => { keys[direction] = false; });
      button.addEventListener("pointercancel", () => { keys[direction] = false; });
      button.addEventListener("pointerleave", () => { keys[direction] = false; });
    });

    document.querySelectorAll("[data-tap]").forEach((button) => {
      button.addEventListener("pointerdown", () => {
        if (match && currentScreen === "game-screen") triggerAction(match.player, button.dataset.tap);
      });
    });
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog.open) dialog.showModal();
    window.requestAnimationFrame(() => {
      const first = getMenuItems(dialog)[0];
      if (first) first.focus();
    });
  }

  function handleMenuKey(event, key) {
    const root = getActiveMenuRoot();
    if (!root || root.id === "game-screen") return false;
    if (key === " " || key === "spacebar") {
      const items = getMenuItems(root);
      const active = root.contains(document.activeElement) ? document.activeElement : items[0];
      if (!active || active.matches("input")) return false;
      event.preventDefault();
      if (currentScreen === "select-screen" && active.dataset.fighter) {
        chooseFighter(active.dataset.fighter);
        startArcade();
        return true;
      }
      active.click();
      return true;
    }
    if (!["w", "a", "s", "d"].includes(key)) return false;
    event.preventDefault();
    moveMenuFocus(root, key);
    return true;
  }

  function getActiveMenuRoot() {
    const dialogs = Array.from(document.querySelectorAll("dialog[open]"));
    if (dialogs.length) return dialogs[dialogs.length - 1];
    if (currentScreen === "game-screen") return null;
    return document.getElementById(currentScreen);
  }

  function getMenuItems(root) {
    return Array.from(root.querySelectorAll("button:not(:disabled), input:not(:disabled)"))
      .filter((item) => item.offsetParent !== null || item.tagName === "DIALOG");
  }

  function moveMenuFocus(root, key) {
    const items = getMenuItems(root);
    if (!items.length) return;

    const active = root.contains(document.activeElement) ? document.activeElement : null;
    if (!active || !items.includes(active)) {
      items[0].focus();
      return;
    }

    const currentRect = active.getBoundingClientRect();
    const currentCenter = rectCenter(currentRect);
    const axis = key === "a" || key === "d" ? "x" : "y";
    const sign = key === "d" || key === "s" ? 1 : -1;
    let best = null;

    items.forEach((item) => {
      if (item === active) return;
      const center = rectCenter(item.getBoundingClientRect());
      const dx = center.x - currentCenter.x;
      const dy = center.y - currentCenter.y;
      const primary = axis === "x" ? dx * sign : dy * sign;
      if (primary <= 8) return;
      const secondary = axis === "x" ? Math.abs(dy) : Math.abs(dx);
      const score = primary * 4 + secondary;
      if (!best || score < best.score) best = { item, score };
    });

    if (best) {
      best.item.focus();
      best.item.scrollIntoView({ block: "nearest", inline: "nearest" });
      return;
    }

    const index = items.indexOf(active);
    const next = items[(index + (sign > 0 ? 1 : -1) + items.length) % items.length];
    next.focus();
    next.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function rectCenter(rect) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function focusDefaultControl(screenId) {
    if (document.querySelector("dialog[open]")) return;
    const target = screenId === "title-screen"
      ? document.getElementById("start-button")
      : screenId === "select-screen"
        ? document.querySelector(`.fighter-card[data-fighter="${selectedId}"]`)
        : screenId === "result-screen"
          ? document.getElementById("continue-button")
          : null;
    if (target && !target.disabled) target.focus();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function init() {
    bindControls();
    renderSelect();
    loadImages()
      .then(() => {
        buildSpriteFrames();
        assetsReady = true;
        document.getElementById("start-button").disabled = false;
        document.getElementById("load-status").textContent = "Pronto";
        if (currentScreen === "title-screen") focusDefaultControl("title-screen");
      })
      .catch((error) => {
        document.getElementById("load-status").textContent = `Falha ao carregar: ${error.message}`;
      });
    document.getElementById("start-button").disabled = true;
  }

  init();
}());
