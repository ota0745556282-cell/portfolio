(function () {
  var targets = document.querySelectorAll('.section-head, .reveal');
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
