/* Prestige — shared site script
   - Injects identical header + footer on every page (single source of truth)
   - Real logo as the home link; one-row grouped nav with dropdown submenus
   - Bilingual ES/EN toggle (Spanish source), persisted; mobile nav; auto year; mailto form */
(function () {
  "use strict";

  var NAV = [
    { href: "index.html", es: "Inicio", en: "Home" },
    { es: "Nosotros", en: "About", children: [
      { href: "quienes-somos.html", es: "Quiénes Somos", en: "Who We Are" },
      { href: "pilares.html",       es: "En qué creemos", en: "What We Believe" },
      { href: "vision-2030.html",   es: "Visión", en: "Vision" },
      { href: "equipo.html",        es: "Equipo", en: "Team" }
    ]},
    { href: "donde-operamos.html", es: "Dónde Operamos", en: "Where We Operate" },
    { href: "inversionistas.html", es: "Inversionistas", en: "Investors" },
    { href: "prensa.html",         es: "Prensa", en: "Press" },
    { es: "Conéctate", en: "Connect", children: [
      { href: "contacto.html",             es: "Consulta general", en: "General inquiry" },
      { href: "legal.html",                es: "PQRS", en: "Complaints" },
      { href: "trabaja-con-nosotros.html", es: "Trabaja con nosotros", en: "Work with us" }
    ]}
  ];

  function currentFile() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }
  function bi(es, en) { return '<span class="es">' + es + '</span><span class="en">' + en + '</span>'; }

  function renderHeader() {
    var here = currentFile();
    var items = NAV.map(function (n) {
      if (n.children) {
        var active = n.children.some(function (c) { return c.href === here; });
        var subs = n.children.map(function (c) {
          var cur = c.href === here ? ' aria-current="page"' : "";
          return '<li><a href="' + c.href + '"' + cur + '>' + bi(c.es, c.en) + "</a></li>";
        }).join("");
        return '<li class="' + (active ? "current" : "") + '">' +
                 '<button type="button" class="top" aria-haspopup="true" aria-expanded="false">' +
                   bi(n.es, n.en) + '<span class="caret">▾</span></button>' +
                 '<ul class="submenu">' + subs + "</ul></li>";
      }
      var cur = n.href === here ? ' aria-current="page"' : "";
      return '<li class="' + (n.href === here ? "current" : "") + '">' +
             '<a href="' + n.href + '"' + cur + '>' + bi(n.es, n.en) + "</a></li>";
    }).join("");

    var html =
      '<a class="skip" href="#main">Saltar al contenido / Skip to content</a>' +
      '<header class="site-header"><nav class="nav" aria-label="Principal">' +
        '<a class="brand" href="index.html" title="Inicio / Home" aria-label="Prestige Group — Inicio / Home">' +
          '<img class="flame" src="assets/img/flame.png" alt=""><span class="wm">Prestige Group</span></a>' +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="menu" aria-label="Menú">☰</button>' +
        '<div class="lang-toggle" role="group" aria-label="Language">' +
          '<button type="button" data-set-lang="es">ES</button>' +
          '<button type="button" data-set-lang="en">EN</button></div>' +
        '<ul class="menu" id="menu">' + items + "</ul>" +
      "</nav></header>";

    var mount = document.getElementById("site-header");
    if (mount) mount.outerHTML = html;
  }

  function renderFooter() {
    var year = new Date().getFullYear();
    var flat = [];
    NAV.forEach(function (n) {
      if (n.children) n.children.forEach(function (c) { flat.push(c); });
      else flat.push(n);
    });
    var navLinks = flat.map(function (n) {
      return '<li><a href="' + n.href + '">' + bi(n.es, n.en) + "</a></li>";
    }).join("");
    var explore = "<div><h4>" + bi("Explorar", "Explore") + "</h4><ul>" + navLinks + "</ul></div>";

    var disclosures = "<div><h4>" + bi("Enlaces", "Links") + "</h4><ul>" +
      '<li><a href="https://siemindustries.com" target="_blank" rel="noopener">Siem Industries</a></li>' +
      '<li><a href="https://www.linkedin.com/company/prestige-group-colombia/" target="_blank" rel="noopener">LinkedIn</a></li>' +
      "</ul></div>";

    var contact = "<div><h4>" + bi("Contacto", "Contact") + "</h4><ul>" +
      "<li>Bogotá · Villavicencio</li>" +
      '<li><a href="contacto.html">' + bi("Escríbanos", "Get in touch") + "</a></li>" +
      '<li><a href="trabaja-con-nosotros.html">' + bi("Trabaja con nosotros", "Work with us") + "</a></li>" +
      '<li><a href="prensa.html">' + bi("Prensa", "Press") + "</a></li>" +
      '<li><a href="legal.html">' + bi("PQRS y privacidad", "PQRS & privacy") + "</a></li></ul></div>";

    var about = '<div class="footer-brand"><img src="assets/img/logo-white.png" alt="Prestige">' +
      "<p style='color:#aebfa8;font-size:.86rem;margin:0 0 12px'>" +
        bi("Negocio de palma de aceite integrado y sostenible en Vichada, Orinoquía colombiana. En operación desde 2003.",
           "Integrated, sustainable palm oil business in Vichada, in Colombia's Orinoquía region. Operating since 2003.") +
      "</p><p style='color:#8fa489;font-size:.78rem;margin:0'>Prestige Colombia S.A.S. · Extractora Cimarrón S.A.S.</p></div>";

    var html =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="footer-grid">' + about + explore + disclosures + contact + "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + year + " Prestige Colombia S.A.S. " + bi("Todos los derechos reservados.", "All rights reserved.") + "</span>" +
          '<span class="footer-legal"><a href="legal.html">' + bi("PQRS · Aviso de privacidad", "PQRS · Privacy notice") + "</a></span>" +
        "</div></div></footer>";

    var mount = document.getElementById("site-footer");
    if (mount) mount.outerHTML = html;
  }

  function applyLang(lang) {
    var root = document.documentElement;
    if (lang === "en") { root.classList.add("lang-en"); root.setAttribute("lang", "en"); }
    else { root.classList.remove("lang-en"); root.setAttribute("lang", "es"); }
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-set-lang") === lang);
    });
    try { localStorage.setItem("prestige-lang", lang); } catch (e) {}
  }
  function initLang() {
    var saved = "es";
    try { saved = localStorage.getItem("prestige-lang") || "es"; } catch (e) {}
    applyLang(saved === "en" ? "en" : "es");
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-set-lang]");
      if (b) applyLang(b.getAttribute("data-set-lang"));
    });
  }

  function initNavToggle() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var menu = document.getElementById("menu");
    var groups = Array.prototype.slice.call(menu.querySelectorAll("li")).filter(function (li) {
      return li.querySelector(".submenu");
    });
    function closeAll(except) {
      groups.forEach(function (li) { if (li !== except) li.classList.remove("open"); });
    }
    // Desktop: hover opens one group and closes any other
    groups.forEach(function (li) {
      var btn = li.querySelector(".top");
      li.addEventListener("mouseenter", function () { if (window.innerWidth > 820) { closeAll(li); li.classList.add("open"); } });
      li.addEventListener("mouseleave", function () { if (window.innerWidth > 820) li.classList.remove("open"); });
      // Click works on both desktop and mobile (and for keyboard users)
      if (btn) btn.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = li.classList.contains("open");
        closeAll(li);
        li.classList.toggle("open", !isOpen);
      });
    });
    // Mobile hamburger
    document.addEventListener("click", function (e) {
      var t = e.target.closest(".nav-toggle");
      if (!t) return;
      var open = menu.classList.toggle("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Click outside or Escape closes all dropdowns
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".menu")) closeAll(null);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(null); });
  }

  function initForm() { /* forms post to the hosting platform (e.g. Netlify Forms); no JS needed */ }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader(); renderFooter(); initLang(); initNavToggle(); initForm();
  });
})();
