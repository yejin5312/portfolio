/*
  모든 페이지가 함께 쓰는 상단 바(로고+메뉴)와 하단 정보 바입니다.
  여기 한 곳만 고치면 모든 페이지에 똑같이 반영돼요.
  각 페이지에서는 아래 두 줄로 불러옵니다.
    <script src="site.js" data-slot="header"></script>  (body 맨 위)
    <script src="site.js" data-slot="footer"></script>  (body 맨 아래)
*/
(function () {
  var el = document.currentScript;
  if (!el) return;
  var slot = el.getAttribute("data-slot");

  // 현재 페이지 파일 이름으로 메뉴 표시를 결정합니다.
  var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var onAbout = file.indexOf("about") === 0;
  var onJournal = file.indexOf("journal") === 0;

  // JOURNAL 메뉴 (테스트 중): 지우고 싶으면 false 로 바꾸면 메뉴에서 사라집니다.
  var SHOW_JOURNAL = true;

  // 사이트에서는 깔끔한 주소( / , /about )로, 내 컴퓨터에서 파일로 열 때는 파일 이름으로 이동합니다.
  var local = location.protocol === "file:";
  var homeHref = local ? "index.html" : "/";
  var aboutHref = local ? "about.html" : "/about";
  var journalHref = local ? "journal.html" : "/journal";

  function nav(href, label, current) {
    return (
      '<a href="' + href + '"' +
      (current ? ' class="is-current" aria-current="page"' : "") +
      ">" + label + "</a>"
    );
  }

  var header =
    '<header class="site-header">' +
      // 모바일에서만 보이는 햄버거 메뉴 버튼
      '<button class="menu-btn" type="button" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<div class="menu-dim"></div>' +
      '<button class="menu-close" type="button" aria-label="메뉴 닫기"></button>' +
      '<a class="logo" href="' + homeHref + '" aria-label="Yejin Lee 홈">' +
        '<span class="logo__text">YEJIN<br>LEE</span>' +
        // 마우스를 올리면 나타나는 이미지 (images/logo-hover.png). 파일이 없으면 기존 로고가 그대로 보입니다.
        '<img class="logo__hover" src="images/logo-hover.png" alt="" aria-hidden="true" ' +
          'onload="this.parentNode.classList.add(\'has-hover\')">' +
      "</a>" +
      '<nav class="nav" aria-label="주 메뉴">' +
        nav(homeHref, "WORKS", !onAbout && !onJournal) +
        (SHOW_JOURNAL ? nav(journalHref, "JOURNAL", onJournal) : "") +
        nav(aboutHref, "ABOUT", onAbout) +
      "</nav>" +
    "</header>";

  var footer =
    '<footer class="site-footer">' +
      '<div class="footer-col"><p>YEJIN LEE</p><p>Based in Seoul</p></div>' +
      '<div class="footer-col"><p>+82 10 6555 5312</p>' +
        '<p><a href="mailto:yejin5312@gmail.com">yejin5312@gmail.com</a></p></div>' +
      '<div class="footer-col"><p>INSTAGRAM</p>' +
        '<p><a href="https://www.instagram.com/yejin5312" target="_blank" rel="noopener">@yejin5312</a></p></div>' +
      '<div class="footer-col footer-col--right"><p>Copyright © 2026 Yejin Lee</p>' +
        "<p>All rights reserved</p></div>" +
    "</footer>";

  // 노란 원형 마우스 커서 (마우스가 있는 기기에서만 동작, 터치 기기는 그대로)
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<div class="cursor__dot"></div>';
    document.body.appendChild(cursor);
    document.documentElement.classList.add("has-custom-cursor");

    document.addEventListener("mousemove", function (e) {
      cursor.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
      cursor.classList.add("is-visible");
      var overLink = e.target.closest && e.target.closest("a:not(.work__link), button, [role='button']");
      cursor.classList.toggle("is-link", !!overLink);
    });
    document.documentElement.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-visible");
    });
  }


  // 모바일에서 옆으로 스와이프하는 영역
  var CAR_SEL = ".pj-trio:not(.pj-trio--cap), .pj-pair--swipe, .pj-smalls";

  // 가로 스와이프 띠: PC 에서는 마우스로 끌어서 넘길 수 있게 (터치 기기는 기본 스와이프)
  function initDragStrip() {
    var strips = document.querySelectorAll(".jd__strip");
    Array.prototype.forEach.call(strips, function (el) {
      var down = false, startX = 0, startLeft = 0, moved = false;
      el.addEventListener("pointerdown", function (e) {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
      });
      window.addEventListener("pointermove", function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 3) { moved = true; el.classList.add("is-drag"); }
        if (moved) el.scrollLeft = startLeft - dx;
      });
      window.addEventListener("pointerup", function () {
        if (!down) return;
        down = false; el.classList.remove("is-drag");
      });
      // 사진 한 장씩 이동 (화살표 버튼 / 키보드 좌우 화살표)
      var wrap = el.parentNode, prev = wrap.querySelector(".jd__nav--prev"), next = wrap.querySelector(".jd__nav--next");
      function items() { return el.children; }
      function step(dir) {
        var it = items(), i, x = el.scrollLeft, target = null;
        if (dir > 0) {
          for (i = 0; i < it.length; i++) { if (it[i].offsetLeft > x + 4) { target = it[i].offsetLeft; break; } }
        } else {
          for (i = it.length - 1; i >= 0; i--) { if (it[i].offsetLeft < x - 4) { target = it[i].offsetLeft; break; } }
        }
        if (target === null) return;
        var max = el.scrollWidth - el.clientWidth;
        el.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: "smooth" });
      }
      function sync() {
        var max = el.scrollWidth - el.clientWidth;
        if (prev) prev.disabled = el.scrollLeft <= 2;
        if (next) next.disabled = el.scrollLeft >= max - 2;
      }
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
      el.addEventListener("scroll", sync, { passive: true });
      el.addEventListener("load", sync, true);
      window.addEventListener("resize", sync);
      window.addEventListener("load", sync);
      sync();
      el.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      });
    });
  }

  // JOURNAL 상세: 문장이 왼쪽에서 오른쪽으로 쓰이듯 나타남 (줄마다 차례로, 화면에 들어올 때 한 번만)
  function initWrite() {
    var qs = document.querySelectorAll(".jd__q");
    if (!qs.length || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var CLIP0 = "inset(-0.3em 100% -0.3em 0)", CLIP1 = "inset(-0.3em -0.3em -0.3em -0.3em)";

    function build(q) {
      var by = q.nextElementSibling;
      // 단어를 span 으로 감싸서 줄 위치를 잰다
      var kids = Array.prototype.slice.call(q.childNodes), i, j;
      for (i = 0; i < kids.length; i++) {
        if (kids[i].nodeType !== 3) continue;
        var parts = kids[i].textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        for (j = 0; j < parts.length; j++) {
          if (!parts[j]) continue;
          if (/^\s+$/.test(parts[j])) frag.appendChild(document.createTextNode(parts[j]));
          else { var w = document.createElement("span"); w.className = "w"; w.textContent = parts[j]; frag.appendChild(w); }
        }
        q.replaceChild(frag, kids[i]);
      }
      var words = q.querySelectorAll(".w"), groups = [], top = null, cur = null;
      for (i = 0; i < words.length; i++) {
        var t = words[i].offsetTop;
        if (top === null || Math.abs(t - top) > 2) { cur = []; groups.push(cur); top = t; }
        cur.push(words[i]);
      }
      // 줄마다 블록으로 묶는다 (<br> 은 제거)
      var lines = [];
      for (i = 0; i < groups.length; i++) {
        var first = groups[i][0], last = groups[i][groups[i].length - 1];
        var line = document.createElement("span");
        line.className = "wl";
        q.insertBefore(line, first);
        var n = first;
        while (n) { var next = n.nextSibling; line.appendChild(n); if (n === last) break; n = next; }
        lines.push(line);
      }
      var brs = q.querySelectorAll("br");
      for (i = 0; i < brs.length; i++) brs[i].parentNode.removeChild(brs[i]);
      q.style.visibility = "visible";

      var delay = 0;
      for (i = 0; i < lines.length; i++) {
        var dur = Math.max(700, Math.min(2000, lines[i].textContent.length * 50));
        lines[i].animate([{ clipPath: CLIP0 }, { clipPath: CLIP1 }], { duration: dur, delay: delay, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" });
        delay += dur;
      }
      if (by) by.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: delay + 150, easing: "ease", fill: "both" });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.__done = true;
        build(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.5 });

    for (var k = 0; k < qs.length; k++) {
      qs[k].__orig = qs[k].innerHTML;
      qs[k].style.visibility = "hidden";
      if (qs[k].nextElementSibling) qs[k].nextElementSibling.style.opacity = "0";
      io.observe(qs[k]);
    }

    // 화면 가로 폭이 바뀌면(회전 등) 이미 쓰인 문장은 줄이 달라지므로 일반 글자로 되돌린다
    var lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      for (var m = 0; m < qs.length; m++) {
        if (qs[m].__done) {
          qs[m].innerHTML = qs[m].__orig;
          qs[m].style.visibility = "visible";
          var b = qs[m].nextElementSibling;
          if (b) { b.getAnimations().forEach(function (a) { a.cancel(); }); b.style.opacity = "1"; }
        }
      }
    });
  }

  // 스크롤하면 이미지가 아래에서 살짝 떠오르며 나타나는 효과 (은은하게)
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var mobile = window.matchMedia("(max-width: 700px)").matches;
    var all = document.querySelectorAll(".pj figure, .work, .about-visual, .jn figure");
    var items = [];
    for (var k = 0; k < all.length; k++) {
      var inCar = mobile && all[k].closest && all[k].closest(CAR_SEL);
      if (!inCar) items.push(all[k]);   // 스와이프 영역 안 이미지는 개별 효과 제외
    }
    if (mobile) {
      var cars = document.querySelectorAll(CAR_SEL);
      for (var c = 0; c < cars.length; c++) items.push(cars[c]);
    }
    if (!items.length) return;
    for (var i = 0; i < items.length; i++) items[i].classList.add("rv");

    // 화면에 들어올 때마다 나타나고, 화면 밖으로 나가면 다시 숨겨져서 위아래로 오가도 매번 반복됩니다.
    var io = new IntersectionObserver(function (entries) {
      var shown = entries.filter(function (e) { return e.isIntersecting; });
      shown.sort(function (a, b) {
        var ra = a.boundingClientRect, rb = b.boundingClientRect;
        return (ra.top - rb.top) || (ra.left - rb.left);
      });
      shown.forEach(function (e, n) {
        e.target.style.transitionDelay = Math.min(n, 4) * 0.1 + "s";
        e.target.classList.add("rv-in");
      });
      entries.forEach(function (e) {
        if (e.isIntersecting) return;
        e.target.style.transitionDelay = "";
        e.target.classList.remove("rv-in");
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  // 모바일: 3장 나란히 배치는 옆으로 스와이프 (아래에 점 표시)
  function initCarousels() {
    if (!window.matchMedia("(max-width: 700px)").matches) return;
    var cars = document.querySelectorAll(CAR_SEL);
    Array.prototype.forEach.call(cars, function (car) {
      // 바로 아래 2장짜리(.pj-duo, CONTAIN)가 있으면 같은 스와이프에 합침 (3장 + 2장 = 5장)
      var next = car.nextElementSibling;
      // (O-NEST) 2장 + 지그재그 2장 = 4장을 한 스와이프로, 모두 같은 세로 높이(3:4)
      if (next && car.classList.contains("pj-pair--swipe") && next.classList.contains("pj-zig")) {
        Array.prototype.slice.call(next.querySelectorAll(":scope > figure")).forEach(function (f) { f.classList.add("r34"); car.appendChild(f); });
        next.parentNode.removeChild(next);
        next = null;
      }
      if (next && next.classList.contains("pj-duo")) {
        Array.prototype.slice.call(next.querySelectorAll(":scope > figure")).forEach(function (f) { f.classList.add("r43"); car.appendChild(f); });
        next.parentNode.removeChild(next);
      }
      var figs = car.querySelectorAll(":scope > figure");
      if (figs.length < 2) return;
      var dots = document.createElement("div");
      dots.className = "pj-dots";
      dots.setAttribute("aria-hidden", "true");
      for (var i = 0; i < figs.length; i++) dots.appendChild(document.createElement("i"));
      car.parentNode.insertBefore(dots, car.nextSibling);
      var ds = dots.children;
      function update() {
        var idx = Math.round(car.scrollLeft / (car.clientWidth + 8));
        for (var i = 0; i < ds.length; i++) ds[i].classList.toggle("is-on", i === idx);
      }
      car.addEventListener("scroll", update, { passive: true });
      update();
    });
  }

  if (slot === "header") {
    el.insertAdjacentHTML("beforebegin", header);
    initCursor();

    // 모바일 햄버거 메뉴 열기/닫기 (열면 노란 패널, 바깥/X/ESC로 닫기)
    var bar = el.previousElementSibling;
    var btn = bar && bar.querySelector(".menu-btn");
    if (btn) {
      var setOpen = function (open) {
        bar.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      };
      btn.addEventListener("click", function () { setOpen(!bar.classList.contains("is-open")); });
      bar.querySelector(".menu-dim").addEventListener("click", function () { setOpen(false); });
      bar.querySelector(".menu-close").addEventListener("click", function () { setOpen(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    }
  }
  if (slot === "footer") {
    el.insertAdjacentHTML("beforebegin", footer);
    initCarousels();
    initReveal();
    initWrite();
    initDragStrip();
  }
})();
