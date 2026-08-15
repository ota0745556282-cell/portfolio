/* スクロールに応じて要素を表示する。
   同じ親の中に並んだ .reveal には、順番に応じた遅延を入れて
   1枚ずつ現れるようにしている */
(function () {
  var targets = document.querySelectorAll('.section-head, .reveal');

  var seen = {};
  document.querySelectorAll('.reveal').forEach(function (el) {
    var parent = el.parentNode;
    var key = parent.className || 'root';
    seen[key] = (seen[key] || 0) + 1;
    var index = Math.min(seen[key] - 1, 5);
    el.style.setProperty('--delay', (index * 0.08) + 's');
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach(function (el) { io.observe(el); });
})();

/* ページ上端のスクロール進捗バー */
(function () {
  var bar = document.querySelector('.scroll-progress span');
  if (!bar) return;

  var ticking = false;

  function update() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.setProperty('--progress', Math.min(100, Math.max(0, ratio * 100)) + '%');
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* 横に流れ続ける帯（マーキー）。
   1組の内容が画面幅より狭いと、流れ切ったあとに空白が出てしまう。
   そこで画面幅を超えるまで内容を足したうえで、同じものをもう1組並べ、
   トラック全体を -50% 動かすことで継ぎ目なく繋げている */
(function () {
  var track = document.querySelector('.marquee-track');
  if (!track) return;

  var group = track.querySelector('.marquee-group');
  if (!group) return;

  var unit = group.innerHTML;
  var resizeTimer;

  function build() {
    while (track.children.length > 1) {
      track.removeChild(track.lastChild);
    }
    group.innerHTML = unit;

    var guard = 0;
    while (group.getBoundingClientRect().width < window.innerWidth && guard < 20) {
      group.insertAdjacentHTML('beforeend', unit);
      guard++;
    }

    track.appendChild(group.cloneNode(true));
  }

  build();

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  }, { passive: true });
})();

/* 作品カードの上でマウスを追いかける光。
   カード内でのカーソル位置を CSS 変数として渡している */
(function () {
  var cards = document.querySelectorAll('.work-card');
  if (!cards.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(function (card) {
    card.addEventListener('pointermove', function (event) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    });

    card.addEventListener('pointerleave', function () {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();

/* 現在表示中のセクションをナビでハイライト */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;

  var linkFor = {};
  var sections = [];
  links.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    linkFor[section.id] = link;
    sections.push(section);
  });

  var visible = {};
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });

    var current = null;
    sections.forEach(function (section) {
      if (visible[section.id] && !current) current = section.id;
    });

    links.forEach(function (link) { link.classList.remove('is-active'); });
    if (current && linkFor[current]) linkFor[current].classList.add('is-active');
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function (section) { spy.observe(section); });
})();

/* メールアドレスのコピー */
(function () {
  var buttons = document.querySelectorAll('[data-copy]');

  buttons.forEach(function (button) {
    var label = button.querySelector('.copy-label') || button;
    var original = label.textContent;
    var timer;

    button.addEventListener('click', function () {
      var value = button.getAttribute('data-copy');

      var done = function (message) {
        label.textContent = message;
        clearTimeout(timer);
        timer = setTimeout(function () { label.textContent = original; }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(
          function () { done('コピーしました'); },
          function () { done(value); }
        );
      } else {
        done(value);
      }
    });
  });
})();
