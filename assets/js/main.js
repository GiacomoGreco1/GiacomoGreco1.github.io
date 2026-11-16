/* Giacomo Greco – Portfolio. Vanilla JS, keine Abhängigkeiten. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
     1. Dot-Matrix-Name (5x7, wie die Ziffern in Blackouter)
     ------------------------------------------------------------------ */
  var GLYPHS = {
    G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
    I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
    R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####']
  };

  function buildMatrix(el) {
    if (!el) return;
    var lines = ['GIACOMO', 'GRECO'];
    var COLS = 41, ROWS = 16, CELL = 10, R = 3.7;
    var lit = {};      // "col,row" -> true
    var cursor = {};   // roter Unterstrich hinter dem Nachnamen

    lines.forEach(function (word, li) {
      var rowOff = li * 9;
      word.split('').forEach(function (ch, ci) {
        var g = GLYPHS[ch];
        for (var r = 0; r < 7; r++) {
          for (var c = 0; c < 5; c++) {
            if (g[r].charAt(c) === '#') lit[(ci * 6 + c) + ',' + (rowOff + r)] = true;
          }
        }
      });
    });
    for (var u = 0; u < 5; u++) cursor[(30 + u) + ',15'] = true;

    var out = '<svg viewBox="0 0 ' + (COLS * CELL) + ' ' + (ROWS * CELL) + '" focusable="false">';
    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        var key = col + ',' + row;
        var cx = col * CELL + CELL / 2, cy = row * CELL + CELL / 2;
        var cls = 'off', style = '';
        if (lit[key]) {
          cls = 'on';
          // Spalte für Spalte, mit etwas Streuung – wie ein Display, das hochfährt
          var d = Math.round(col * 17 + (row > 8 ? 380 : 0) + Math.random() * 260);
          style = ' style="--d:' + d + 'ms"';
        } else if (cursor[key]) {
          cls = 'cur';
        }
        out += '<circle class="' + cls + '" cx="' + cx + '" cy="' + cy + '" r="' + R + '"' + style + '/>';
      }
    }
    el.innerHTML = out + '</svg>';
  }

  /* ------------------------------------------------------------------
     2. Rollen-Zeile mit Terminal-Effekt
     ------------------------------------------------------------------ */
  var roleEl = doc.getElementById('role');
  var roleTimer = null;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function renderRole(text, animate, delay) {
    if (!roleEl) return;
    clearTimeout(roleTimer);
    var html = '<span class="sr">' + esc(text) + '</span><span aria-hidden="true">';
    for (var i = 0; i < text.length; i++) {
      html += '<span class="ch' + (animate ? '' : ' v') + '">' + esc(text.charAt(i)) + '</span>';
    }
    html += '<span class="caret"></span></span>';
    roleEl.innerHTML = html;
    if (!animate) return;

    var chars = roleEl.querySelectorAll('.ch');
    var caret = roleEl.querySelector('.caret');
    var n = 0;
    chars[0].parentNode.insertBefore(caret, chars[0]);
    function tick() {
      if (n >= chars.length) return;
      chars[n].classList.add('v');
      chars[n].parentNode.insertBefore(caret, chars[n].nextSibling);
      n++;
      roleTimer = setTimeout(tick, 26 + Math.random() * 38);
    }
    roleTimer = setTimeout(tick, delay || 0);
  }

  /* ------------------------------------------------------------------
     3. Sprache DE / EN
     Deutsch steht im HTML, Englisch hier. Die Wahl liegt in localStorage
     (kein Cookie, wird nicht übertragen).
     ------------------------------------------------------------------ */
  var EN = {
    title: 'Giacomo Greco – Junior Software Developer',
    skip: 'Skip to content',
    navLabel: 'Main navigation',
    navProjects: 'Projects',
    navExperience: 'Experience',
    navSkills: 'Skills',
    navContact: 'Contact',
    metaLabel: 'At a glance',
    metaLoc: 'Metzingen, DE · 48.54° N 9.28° E',
    metaIhk: 'Qualified 07/2026',
    metaStatus: 'available now',
    role: 'IT specialist for application development',
    claim: 'I build software you can <em>touch</em> – from microcontroller firmware to Android apps.',
    ctaProjects: 'View projects',
    ctaCv: 'CV (PDF)',

    hProjects: 'Projects',
    leadProjects: 'Three Android apps and two devices. All designed, built and finished by me – including the parts where the first approach did not work.',
    lblProblem: 'Problem',
    lblSolved: 'Solved',
    linkProfile: 'Code on GitHub',
    hwHead: 'Hardware',

    altScriba: 'Scriba on an Android tablet: handwritten notes with recognised shapes and the pen toolbar',
    p1Kind: 'Android · Tablet',
    p1What: 'Android tablet app for handwritten notes and PDF annotation.',
    p1Problem: 'Writing with a stylus and annotating PDFs – as direct as paper, with no account and no cloud. Every millisecond of lag between pen tip and line gets in the way.',
    p1s1: '<strong>Front-buffer rendering</strong> for latency-free pen input, combined with motion prediction.',
    p1s2: '<strong>Custom shape recognition</strong> for circles, rectangles and polygons – purely geometric.',
    p1s3: '<strong>Atomic saving</strong> with a .bak backup in my own versioned binary format.',
    p1s4: '<strong>Undo/redo</strong> built on action objects.',
    p1s5: '<strong>100% offline</strong> – the app does not even request the INTERNET permission.',

    altBlackouter: 'Blackouter: sleep timer with large red dot-matrix digits on a black background',
    p2Kind: 'Android · Sleep timer',
    p2What: 'Sleep timer that pauses media (Twitch, YouTube, Spotify), returns to the home screen and locks the display.',
    p2Problem: 'Fall asleep while streaming and the screen and battery run all night. The timer has to fire reliably – even after Android has long pushed the app into the background.',
    p2s1: '<strong>Restart instead of patching:</strong> the first attempt in React Native failed in the background. I switched to AlarmManager (<code>setExactAndAllowWhileIdle</code>) and Device Admin (<code>lockNow</code>).',
    p2s2: '<strong>Audio focus</strong> requests to cleanly pause other apps.',
    p2s3: '<strong>Dot-matrix digits</strong> drawn with CustomPainter in the Nothing design language – the same dots as in my name above.',

    altFh6: 'FH6 Tempi: list of lap times with filters and highlighted personal records',
    p3Kind: 'Android · Offline',
    p3What: 'Offline app for lap times in Forza Horizon 6.',
    p3Problem: 'Recording and comparing my own lap times across many tracks and cars – on the phone next to the controller, with no server and no sign-up.',
    p3s1: '<strong>APK from the cloud:</strong> GitHub Actions builds the app – no local Android setup needed.',
    p3s2: '<strong>Filters, sorting and personal records</strong>, fully offline on the device.',
    p3s3: '<strong>JSON import/export</strong> for backups and moving between devices.',

    altAmpel: 'MTC-Ampel: ESP32 board with red and green LEDs and a buzzer inside its enclosure',
    p4Kind: 'ESP32 · IHK final project',
    p4What: 'Signal light for production monitoring: shows tightening results right at the station.',
    p4Problem: 'The operator should see and hear immediately whether a screw joint was OK – without looking at a screen.',
    p4s1: '<strong>Tightening results via TCP/OpenProtocol</strong>, received and evaluated directly on the microcontroller.',
    p4s2: '<strong>ESP32 as a Wi-Fi access point</strong> – runs independently of the plant network.',
    p4s3: '<strong>OK/NOK via LEDs and buzzer.</strong> IHK grade: 85 points.',

    altWetter: 'Weather station: 3D-printed enclosure with an OLED display showing temperature, humidity and pressure',
    p5Kind: 'ESP32 · IoT',
    p5What: 'IoT weather station with an ESP32 (WiFi LoRa 32 V3) and a BME688 sensor.',
    p5Problem: 'Measuring and displaying indoor climate live – as a finished device on the desk, not a breadboard with a tangle of wires.',
    p5s1: '<strong>BME688 over I²C:</strong> temperature, humidity, pressure and gas resistance.',
    p5s2: '<strong>Live readout</strong> on the OLED display.',
    p5s3: '<strong>Custom enclosure</strong> designed in Fusion 360 and 3D-printed.',

    hExperience: 'Experience',
    tNowWhen: 'Now',
    tNowTitle: 'Ready for my first junior role',
    tNowText: 'Apprenticeship completed, five projects of my own shipped. I am looking for a team where I build applications – ideally close to the hardware.',
    tAzubiTitle: 'Apprenticeship: IT specialist for application development (Fachinformatiker)',
    tA1: 'C++ firmware for ESP32, STM32 and Atmel; drivers for SPI, I²C, UART and GPIO',
    tA2: 'Web interfaces in HTML, CSS and JavaScript; company websites in WordPress',
    tA3: 'Administration of Arch, Ubuntu and Raspberry Pi OS',
    tA4k: 'Network',
    tA4: 'TCP/IP, DHCP, subnetting, QNAP NAS, virtual machines',
    tA5: 'Git/GitHub, technical documentation for colleagues',
    tA6: '3D models and enclosures in Fusion 360',
    tAzubiNote: 'IHK certificate July 2026 · Final project: ESP32 signal light with TCP/OpenProtocol, 85 points.',
    tSchoolTitle: 'Vocational school, application development track',

    leadSkills: 'What I have actually worked with – during the apprenticeship or in the projects above.',
    skProto: 'Protocols: SPI, I²C, UART, TCP',
    skSysK: 'Systems',
    skNet: 'Networking',
    skVm: 'VMs',
    skOtherK: 'Other',
    langsK: 'Languages',
    lIt: 'Italian',
    lItLvl: 'Native',
    lDe: 'German',
    lEn: 'English',

    hContact: 'Contact',
    cta: 'Open to junior roles <span class="cta-now">right now<i aria-hidden="true"></i></span>',
    ctaSub: 'Application development, mobile or embedded. Get in touch – email is the fastest way.',
    footNote: 'No cookies. No trackers. Hand-written in HTML, CSS and JavaScript.',
    legalLabel: 'Legal',
    privacy: 'Privacy'
  };

  var DE = {};           // wird beim ersten Wechsel aus dem DOM gefüllt
  var deTitle = doc.title;
  var lang = 'de';

  function snapshotGerman() {
    each('[data-i18n]', function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in DE)) DE[k] = el.id === 'role' ? el.textContent : el.innerHTML;
    });
    each('[data-i18n-alt]', function (el) { DE[el.getAttribute('data-i18n-alt')] = el.alt; });
    each('[data-i18n-aria]', function (el) { DE[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
  }

  function each(sel, fn) {
    Array.prototype.forEach.call(doc.querySelectorAll(sel), fn);
  }

  function setLang(next, initial) {
    lang = next === 'en' ? 'en' : 'de';
    var dict = lang === 'en' ? EN : DE;
    root.lang = lang;
    doc.title = lang === 'en' ? EN.title : deTitle;

    each('[data-i18n]', function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v == null) return;
      if (el.id === 'role') { if (!initial) renderRole(v, false); }
      else el.innerHTML = v;
    });
    each('[data-i18n-alt]', function (el) {
      var v = dict[el.getAttribute('data-i18n-alt')];
      if (v != null) el.alt = v;
    });
    each('[data-i18n-aria]', function (el) {
      var v = dict[el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v);
    });
    each('.lang button', function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem('lang', lang); } catch (e) { /* privater Modus */ }
  }

  function currentRole() {
    return lang === 'en' ? EN.role : DE.role;
  }

  /* ------------------------------------------------------------------
     4. Scroll-Reveal
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = doc.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      each('.reveal', function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     5. Hero-Punktraster, das langsam dem Zeiger folgt
     ------------------------------------------------------------------ */
  function initGrid() {
    var canvas = doc.querySelector('.hero-grid');
    var hero = doc.getElementById('hero');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var GAP = 28, REACH = 230;
    var w = 0, h = 0, dpr = 1;
    var px = -9999, py = -9999;   // geglättete Position
    var tx = -9999, ty = -9999;   // Ziel
    var visible = true, raf = 0, userMoved = false, t0 = performance.now();

    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var ox = (w % GAP) / 2, oy = (h % GAP) / 2;
      for (var y = oy; y < h; y += GAP) {
        for (var x = ox; x < w; x += GAP) {
          var dx = x - px, dy = y - py;
          var d2 = dx * dx + dy * dy;
          var f = d2 < REACH * REACH ? 1 - Math.sqrt(d2) / REACH : 0;
          f = f * f;
          if (f > 0.02) {
            ctx.fillStyle = 'rgba(242,239,233,' + (0.13 + f * 0.6).toFixed(3) + ')';
            var s = 2 + f * 2.4;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
          } else {
            ctx.fillStyle = 'rgba(242,239,233,0.13)';
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
      }
    }

    function frame(now) {
      raf = 0;
      if (!visible) return;
      if (!userMoved) {
        // Ohne Maus (oder auf Touch): der Lichtfleck wandert langsam von selbst
        var t = (now - t0) / 1000;
        tx = w * (0.62 + 0.3 * Math.sin(t * 0.21));
        ty = h * (0.42 + 0.26 * Math.sin(t * 0.33 + 1.3));
      }
      if (px < -9000) { px = tx; py = ty; }
      px += (tx - px) * 0.045;
      py += (ty - py) * 0.045;
      draw();
      if (!userMoved || Math.abs(tx - px) > 0.3 || Math.abs(ty - py) > 0.3) kick();
    }

    function kick() {
      if (!raf && visible && !reduced.matches) raf = requestAnimationFrame(frame);
    }

    if (finePointer) {
      hero.addEventListener('pointermove', function (e) {
        var rect = canvas.getBoundingClientRect();
        tx = e.clientX - rect.left;
        ty = e.clientY - rect.top;
        userMoved = true;
        kick();
      }, { passive: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        kick();
      }).observe(hero);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });
    if (reduced.addEventListener) reduced.addEventListener('change', kick);

    resize();
    kick();
  }

  /* ------------------------------------------------------------------
     6. Dezenter Cursor-Ring (nur Maus/Trackpad; der Systemzeiger bleibt)
     ------------------------------------------------------------------ */
  function initCursor() {
    var el = doc.querySelector('.cursor');
    if (!el || !finePointer || reduced.matches) return;
    root.classList.add('has-cursor');
    var x = 0, y = 0, cx = 0, cy = 0, raf = 0, started = false;

    function frame() {
      raf = 0;
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) raf = requestAnimationFrame(frame);
    }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!started) { started = true; cx = x; cy = y; el.classList.add('on'); }
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });

    doc.addEventListener('pointerover', function (e) {
      var hit = e.target.closest && e.target.closest('a, button');
      el.classList.toggle('link', !!hit);
    }, { passive: true });

    root.addEventListener('pointerleave', function () { el.classList.remove('on'); started = false; });
  }

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */
  buildMatrix(doc.getElementById('matrix'));
  snapshotGerman();

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* ignorieren */ }
  if (saved === 'en') setLang('en', true);

  // Tippen erst, wenn die Matrix leuchtet
  renderRole(currentRole(), !reduced.matches, 1250);

  each('.lang button', function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  initReveal();
  initGrid();
  initCursor();
})();
