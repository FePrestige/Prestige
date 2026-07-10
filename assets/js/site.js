/* =========================================================================
   Prestige Colombia — shared site script
   - Injects identical header + footer on every page (no drift between pages)
   - Bilingual ES/EN toggle (Spanish is the source language), persisted
   - Mobile nav, active link, auto current-year footer, contact mailto
   ========================================================================= */
(function () {
  "use strict";

  // --- Navigation (single source of truth; identical on every page) ---
  var NAV = [
    { href: "index.html",          es: "Inicio",            en: "Home" },
    { href: "quienes-somos.html",  es: "Quiénes Somos",     en: "Who We Are" },
    { href: "pilares.html",        es: "Nuestros Pilares",  en: "Our Pillars" },
    { href: "donde-operamos.html", es: "Dónde Operamos",    en: "Where We Operate" },
    { href: "sostenibilidad.html", es: "Sostenibilidad",    en: "Sustainability" },
    { href: "equipo.html",         es: "Equipo",            en: "Team" },
    { href: "inversionistas.html", es: "Inversionistas",    en: "Investors" },
    { href: "vision-2030.html",    es: "Visión 2030",       en: "Vision 2030" },
    { href: "contacto.html",       es: "Contacto",          en: "Contact" }
  ];

  function currentFile() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  function bi(es, en) {
    return '<span class="es">' + es + '</span><span class="en">' + en + '</span>';
  }

  // --- Header ---
  function renderHeader() {
    var here = currentFile();
    var items = NAV.map(function (n) {
      var cur = n.href === here ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + cur + '>' + bi(n.es, n.en) + "</a></li>";
    }).join("");

    var html =
      '<a class="skip" href="#main">' + "Saltar al contenido / Skip to content" + "</a>" +
      '<header class="site-header"><nav class="nav" aria-label="Principal">' +
        '<a class="brand" href="index.html">' +
          '<span class="mark">PC</span>' +
          '<span class="bt"><strong>Prestige Colombia</strong><span>Hacienda Cimarrón · Vichada</span></span>' +
        "</a>" +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="menu" aria-label="Menú">☰</button>' +
        '<ul class="menu" id="menu">' + items + "</ul>" +
        '<div class="lang-toggle" role="group" aria-label="Language">' +
          '<button type="button" data-set-lang="es">ES</button>' +
          '<button type="button" data-set-lang="en">EN</button>' +
        "</div>" +
      "</nav></header>";

    var mount = document.getElementById("site-header");
    if (mount) mount.outerHTML = html;
  }

  // --- Footer ---
  function renderFooter() {
    var year = new Date().getFullYear();
    var col = function (title, links) {
      return "<div><h4>" + title + "</h4><ul>" + links + "</ul></div>";
    };
    var navLinks = NAV.map(function (n) {
      return '<li><a href="' + n.href + '">' + bi(n.es, n.en) + "</a></li>";
    }).join("");

    var explore = col(bi("Explorar", "Explore"), navLinks);

    var disclosures = col(
      bi("Divulgaciones públicas", "Public disclosures"),
      '<li><a href="https://www.andgreen.fund/portfolio/" target="_blank" rel="noopener">&Green — ' + bi("Portafolio y ESAP", "Portfolio &amp; ESAP") + "</a></li>" +
      '<li><a href="https://siemindustries.com" target="_blank" rel="noopener">Siem Industries</a></li>' +
      '<li><a href="https://www.linkedin.com/company/prestige-colombia/" target="_blank" rel="noopener">LinkedIn</a></li>'
    );

    var contact = col(
      bi("Contacto", "Contact"),
      '<li><a href="mailto:info@prestigecol.com">info@prestigecol.com</a></li>' +
      "<li>Bogotá · Villavicencio</li>" +
      '<li><a href="contacto.html">' + bi("Escríbanos", "Get in touch") + "</a></li>"
    );

    var about =
      "<div><h4>Prestige Colombia</h4>" +
      "<p style='color:#aebfa8;font-size:.86rem;margin:0 0 12px'>" +
        bi(
          "Operación de palma de aceite integrada y sostenible en Vichada, Orinoquía colombiana. En operación desde 2003.",
          "Integrated, sustainable palm oil operation in Vichada, in Colombia's Orinoquía region. Operating since 2003."
        ) +
      "</p>" +
      "<p style='color:#8fa489;font-size:.78rem;margin:0'>Prestige Colombia S.A.S. · Extractora Cimarrón S.A.S.</p></div>";

    var html =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="footer-grid">' + about + explore + disclosures + contact + "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + year + " Prestige Colombia S.A.S. " +
            bi("Todos los derechos reservados.", "All rights reserved.") + "</span>" +
          '<span class="footer-legal">' +
            bi(
              "Sitio informativo. No constituye una oferta de valores ni asesoría de inversión.",
              "Informational website. Not an offer of securities or investment advice."
            ) +
          "</span>" +
        "</div>" +
      "</div></footer>";

    var mount = document.getElementById("site-footer");
    if (mount) mount.outerHTML = html;
  }

  // --- Language ---
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

  // --- Mobile nav ---
  function initNavToggle() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest(".nav-toggle");
      if (!t) return;
      var menu = document.getElementById("menu");
      var open = menu.classList.toggle("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Contact form -> mailto fallback ---
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var en = document.documentElement.classList.contains("lang-en");
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var name = get("cf-name"), org = get("cf-org"), email = get("cf-email"), msg = get("cf-message");
      var subject = (en ? "Website enquiry — " : "Consulta sitio web — ") + (org || name || "Prestige Colombia");
      var bodyLines = en
        ? ["Name: " + name, "Organisation: " + org, "Email: " + email, "", "Message:", msg]
        : ["Nombre: " + name, "Organización: " + org, "Correo: " + email, "", "Mensaje:", msg];
      var href = "mailto:info@prestigecol.com?subject=" + encodeURIComponent(subject) +
                 "&body=" + encodeURIComponent(bodyLines.join("\n"));
      window.location.href = href;
      var ok = document.getElementById("cf-status");
      if (ok) ok.style.display = "block";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    initLang();
    initNavToggle();
    initForm();
  });
})();
