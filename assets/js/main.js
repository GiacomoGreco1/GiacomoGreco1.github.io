/* Giacomo Greco – Portfolio. Vanilla JS, keine Abhängigkeiten. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var I18N = window.I18N || { ui: { de: {} }, en: {}, it: {} };
  var LANGS = ['de', 'en', 'it'];
  var lang = 'de';

  function each(sel, fn) {
    Array.prototype.forEach.call(doc.querySelectorAll(sel), fn);
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* privater Modus */ }
  }
  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function ui(key) {
    return (I18N.ui[lang] || I18N.ui.de)[key] || '';
  }

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
     3. Sprache DE / EN / IT
     Deutsch steht im HTML, die anderen Sprachen in i18n.js. Die Wahl liegt
     in localStorage (kein Cookie, wird nicht übertragen).
     ------------------------------------------------------------------ */
  var DE = {};
  var deTitle = doc.title;

  function snapshotGerman() {
    each('[data-i18n]', function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in DE)) DE[k] = el.id === 'role' ? el.textContent : el.innerHTML;
    });
    each('[data-i18n-alt]', function (el) { DE[el.getAttribute('data-i18n-alt')] = el.alt; });
    each('[data-i18n-aria]', function (el) { DE[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
    // Standardbild merken, damit sprachabhängige Bilder zurückwechseln können
    each('.shot img', function (img) { img.setAttribute('data-src-de', img.getAttribute('src')); });
  }

  function dict() {
    return lang === 'de' ? DE : (I18N[lang] || DE);
  }

  function setLang(next, initial) {
    lang = LANGS.indexOf(next) >= 0 ? next : 'de';
    var d = dict();
    root.lang = lang;
    doc.title = lang === 'de' ? deTitle : (d.title || deTitle);

    each('[data-i18n]', function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v == null) return;
      if (el.id === 'role') { if (!initial) renderRole(v, false); }
      else el.innerHTML = v;
    });
    each('[data-i18n-alt]', function (el) {
      var v = d[el.getAttribute('data-i18n-alt')];
      if (v != null) el.alt = v;
    });
    each('[data-i18n-aria]', function (el) {
      var v = d[el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v);
    });

    // Screenshots in der passenden Sprache, falls vorhanden
    each('.shot img', function (img) {
      var src = img.getAttribute('data-src-' + lang) || img.getAttribute('data-src-de');
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      var link = img.parentNode;
      if (link && link.classList.contains('zoom')) {
        link.setAttribute('href', src);
        link.setAttribute('aria-label', ui('zoom') + ': ' + img.alt);
      }
    });

    each('.lang button', function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    each('[data-lb]', function (b) { b.setAttribute('aria-label', ui(b.getAttribute('data-lb'))); });
    var lb = doc.getElementById('lightbox');
    if (lb) lb.setAttribute('aria-label', ui('viewer'));
    labelTheme();
    if (!initial) store('lang', lang);
  }

  function currentRole() {
    return dict().role || DE.role;
  }

  /* ------------------------------------------------------------------
     4. Helles / dunkles Design
     ------------------------------------------------------------------ */
  var themeBtn = doc.getElementById('theme');
  var gridApi = null;

  function isLight() {
    return root.getAttribute('data-theme') === 'light';
  }
  function labelTheme() {
    if (!themeBtn) return;
    var t = ui(isLight() ? 'toDark' : 'toLight');
    themeBtn.setAttribute('aria-label', t);
    themeBtn.setAttribute('title', t);
  }
  function setTheme(light) {
    if (light) root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#F4F1EA' : '#0B0B0C');
    store('theme', light ? 'light' : 'dark');
    labelTheme();
    if (gridApi) gridApi.refresh();
  }

  /* ------------------------------------------------------------------
     5. Bilder vergrößern
     ------------------------------------------------------------------ */
  function initLightbox() {
    var dlg = doc.getElementById('lightbox');
    var links = Array.prototype.slice.call(doc.querySelectorAll('a.zoom'));
    if (!dlg || !dlg.showModal || !links.length) return;   // ohne <dialog>: Link öffnet einfach das Bild
    var img = doc.getElementById('lb-img');
    var cap = doc.getElementById('lb-cap');
    var count = doc.getElementById('lb-count');
    var index = 0;

    function show(i) {
      index = (i + links.length) % links.length;
      var source = links[index].querySelector('img');
      img.src = links[index].getAttribute('href');
      img.alt = source.alt;
      img.width = source.getAttribute('width');
      img.height = source.getAttribute('height');
      cap.textContent = source.alt;
      count.textContent = (index + 1) + ' / ' + links.length;
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
        dlg.showModal();
      });
    });

    dlg.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-lb]');
      if (btn) {
        var act = btn.getAttribute('data-lb');
        if (act === 'close') dlg.close();
        else show(index + (act === 'next' ? 1 : -1));
        return;
      }
      if (e.target === dlg || e.target.classList.contains('lb-fig')) dlg.close();   // Klick neben das Bild
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(index + 1);
      else if (e.key === 'ArrowLeft') show(index - 1);
    });
    dlg.addEventListener('close', function () {
      if (links[index]) links[index].focus();
    });
  }

  /* ------------------------------------------------------------------
     6. Scroll-Reveal
     ------------------------------------------------------------------ */
  function initReveal() {
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
    each('.reveal', function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     7. Hero-Punktraster, das langsam dem Zeiger folgt
     ------------------------------------------------------------------ */
  function initGrid() {
    var canvas = doc.querySelector('.hero-grid');
    var hero = doc.getElementById('hero');
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    var GAP = 28, REACH = 230;
    var w = 0, h = 0, dpr = 1;
    var px = -9999, py = -9999;   // geglättete Position
    var tx = -9999, ty = -9999;   // Ziel
    var visible = true, raf = 0, userMoved = false, t0 = performance.now();
    var rgb = '242,239,233', base = 0.13;

    function readColors() {
      var v = getComputedStyle(root).getPropertyValue('--ink-rgb').replace(/\s/g, '');
      if (v) rgb = v;
      base = isLight() ? 0.2 : 0.13;
    }

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
      var dim = 'rgba(' + rgb + ',' + base + ')';
      for (var y = oy; y < h; y += GAP) {
        for (var x = ox; x < w; x += GAP) {
          var dx = x - px, dy = y - py;
          var d2 = dx * dx + dy * dy;
          var f = d2 < REACH * REACH ? 1 - Math.sqrt(d2) / REACH : 0;
          f = f * f;
          if (f > 0.02) {
            ctx.fillStyle = 'rgba(' + rgb + ',' + (base + f * 0.6).toFixed(3) + ')';
            var s = 2 + f * 2.4;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
          } else {
            ctx.fillStyle = dim;
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

    readColors();
    resize();
    kick();
    return { refresh: function () { readColors(); draw(); } };
  }

  /* ------------------------------------------------------------------
     8. Dezenter Cursor-Ring (nur Maus/Trackpad; der Systemzeiger bleibt)
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
  setLang(load('lang') || 'de', true);

  // Tippen erst, wenn die Matrix leuchtet
  renderRole(currentRole(), !reduced.matches, 1250);

  each('.lang button', function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  if (themeBtn) themeBtn.addEventListener('click', function () { setTheme(!isLight()); });

  initLightbox();
  initReveal();
  gridApi = initGrid();
  initCursor();
})();
