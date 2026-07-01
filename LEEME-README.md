# Prestige Colombia — Sitio web (preview bilingüe ES/EN)

Sitio estático, autocontenido. Una sola carpeta, sin dependencias, sin build. Listo para
previsualizar internamente y para hospedar.

## Cómo previsualizar (local)

Opción A — abrir directo: haga doble clic en `index.html`.
Opción B — servidor local (recomendado, evita restricciones del navegador):

```bash
cd prestige-site
python3 -m http.server 8000
# luego abra http://localhost:8000
```

## Cómo publicar (go-live)

Suba el contenido de la carpeta `prestige-site/` a cualquier hosting estático:
GitHub Pages, Netlify, Cloudflare Pages, Vercel, o un bucket/S3. No requiere servidor
ni base de datos. Apunte el dominio `prestigecol.com` al hosting.

## Estructura

```
prestige-site/
  index.html              Inicio
  quienes-somos.html      Quiénes Somos / El Grupo
  pilares.html            Nuestros Pilares
  donde-operamos.html     Dónde Operamos (mapa del proyecto)
  sostenibilidad.html     Sostenibilidad (hoja de ruta de certificación)
  equipo.html             Equipo / Liderazgo
  inversionistas.html     Inversionistas (credibilidad + prensa/enlaces)
  vision-2030.html        Visión 2030
  contacto.html           Contacto (formulario + mapa)
  assets/css/styles.css   Estilos (paleta verde/oro, Arial)
  assets/js/site.js       Encabezado/pie compartidos, toggle ES/EN, formulario
```

## Bilingüe (ES/EN) — cómo funciona

- **El español es el idioma fuente** y se muestra por defecto.
- Cada texto existe en el HTML en ambos idiomas, como `<span class="es">…</span><span class="en">…</span>`.
  El CSS oculta el idioma inactivo y el botón ES/EN del encabezado alterna entre ambos.
- **Garantía de paridad:** como ambos idiomas viven juntos en el mismo elemento, ninguna
  página puede existir en un idioma y no en el otro — se corrige el defecto principal del sitio actual.
- La preferencia de idioma se recuerda en el navegador.

## Para editar contenido

- **Texto:** edite el `.html` de la página. Cambie siempre AMBOS, `.es` y `.en`, juntos.
- **Menú y pie de página:** se generan una sola vez en `assets/js/site.js` (constante `NAV`
  y funciones `renderHeader`/`renderFooter`), por lo que son idénticos en todas las páginas.
- **Año del copyright:** se actualiza solo (toma el año actual). Ya no dice "© 2020".
- **Fotos:** los bloques con borde punteado son marcadores ("placeholders"). Reemplácelos por
  `<img src="assets/img/...">` cuando tenga las imágenes definitivas.

## Pendientes antes de publicar (marcadores a completar)

1. Fotos reales: plantación, planta, conservación, comunidad (varias páginas).
2. Equipo: nombres, cargos, biografías y fotos definitivas del equipo directivo (`equipo.html`).
3. Contacto: direcciones y teléfonos de las oficinas de Bogotá y Villavicencio (`contacto.html`).
4. Mapa de contacto: opcional reemplazar el mapa ilustrativo por un mapa interactivo.
5. Formulario: hoy abre el correo del usuario (mailto). Si quiere recepción automática,
   conéctelo a un servicio (Formspree, Basin, etc.).

## Nota sobre SEO (para go-live)

Para el preview interno este enfoque es ideal. Para producción, si se busca máxima indexación,
considere pre-renderizar el encabezado/pie en el HTML. El contenido principal de cada página
ya está en el HTML (en español, idioma fuente), por lo que es rastreable.
