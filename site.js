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

  function nav(href, label, current) {
    return (
      '<a href="' + href + '"' +
      (current ? ' class="is-current" aria-current="page"' : "") +
      ">" + label + "</a>"
    );
  }

  var header =
    '<header class="site-header">' +
      '<a class="logo" href="index.html" aria-label="Yejin Lee 홈">' +
        '<span class="logo__text">YEJIN<br>LEE</span>' +
        // 마우스를 올리면 나타나는 이미지 (images/logo-hover.png). 파일이 없으면 기존 로고가 그대로 보입니다.
        '<img class="logo__hover" src="images/logo-hover.png" alt="" aria-hidden="true" ' +
          'onload="this.parentNode.classList.add(\'has-hover\')">' +
      "</a>" +
      '<nav class="nav" aria-label="주 메뉴">' +
        nav("index.html", "WORKS", !onAbout) +
        nav("about.html", "ABOUT", onAbout) +
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
      var overLink = e.target.closest && e.target.closest("a, button, [role='button']");
      cursor.classList.toggle("is-link", !!overLink);
    });
    document.documentElement.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-visible");
    });
  }

  if (slot === "header") {
    el.insertAdjacentHTML("beforebegin", header);
    initCursor();
  }
  if (slot === "footer") el.insertAdjacentHTML("beforebegin", footer);
})();
