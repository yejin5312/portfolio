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

  // 사이트에서는 깔끔한 주소( / , /about )로, 내 컴퓨터에서 파일로 열 때는 파일 이름으로 이동합니다.
  var local = location.protocol === "file:";
  var homeHref = local ? "index.html" : "/";
  var aboutHref = local ? "about.html" : "/about";

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
        nav(homeHref, "WORKS", !onAbout) +
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


  // 스크롤하면 이미지가 아래에서 살짝 떠오르며 나타나는 효과 (은은하게)
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var items = document.querySelectorAll(".pj figure, .work, .about-visual");
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
    initReveal();
  }
})();
