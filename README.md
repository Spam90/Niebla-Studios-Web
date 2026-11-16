# Niebla Studios — web oficial

Sitio estático en HTML5, CSS3 y JavaScript puro. Sin frameworks ni pasos de compilación.

## Archivos
- `index.html` — página única: inicio, servicios, proyectos, nosotros, proceso y contacto.
- `css/styles.css` — diseño visual y responsive, con `prefers-reduced-motion`.
- `js/config.js` — **configuración centralizada** (dominio, contacto, endpoint del formulario).
- `js/main.js` — menú móvil con foco atrapado, validación, envío del formulario y canales de contacto.
- `js/symbol-3d.js` — símbolo 3D del hero en WebGL, construido a partir de `assets/logo.png`.
- `assets/logo.png` — logo oficial, sin modificar.
- `assets/simbolo.png`, `assets/simbolo-transparente.png` — recortes del mismo símbolo para cabecera, pie e icono.
- `robots.txt`, `sitemap.xml` — rastreo básico.

## Configuración (`js/config.js`)
Todos los datos del sitio se completan en ese único archivo:

| Campo | Uso | Estado |
|---|---|---|
| `site.domain` | Canonical, Open Graph, Schema.org, sitemap | PENDIENTE |
| `site.twitterHandle` | Tarjeta de Twitter/X (opcional) | PENDIENTE |
| `contact.email` | Enlaces de correo | PENDIENTE |
| `contact.whatsapp` | Enlace wa.me (solo dígitos, con prefijo de país) | PENDIENTE |
| `form.endpoint` | Recepción del formulario (POST JSON) | PENDIENTE |

Mientras un campo esté vacío, el canal correspondiente aparece deshabilitado y marcado como pendiente. El formulario valida los datos, pero no simula un envío: si no hay endpoint, lo indica al visitante.

Los metadatos SEO, Open Graph y Schema.org están escritos directamente en `index.html`, porque los rastreadores los leen sin ejecutar JavaScript. Al publicar, sustituir `[DOMINIO]` y los textos de `[DESCRIPCIÓN SEO]` / `[SUBTÍTULO SEO]`.

## Marcadores de contenido pendientes
`index.html` contiene 65 marcadores entre corchetes. Son textos que redacta ChatGPT, no se han inventado. Agrupados:

- **SEO y metadatos:** `[SUBTÍTULO SEO]`, `[DESCRIPCIÓN SEO]`, `[DOMINIO]`.
- **Navegación y hero:** `[TEXTO BOTÓN SOLICITAR PROYECTO]`, `[ETIQUETA]`, `[TITULAR PRINCIPAL]`, `[DESCRIPCIÓN DE LA AGENCIA]`, `[TEXTO BOTÓN PRINCIPAL]`, `[TEXTO BOTÓN SECUNDARIO]`.
- **Servicios:** títulos de sección, descripción y resultado para el cliente de cada uno de los seis servicios.
- **Proyectos:** título de sección, nota, y para cada proyecto: tipo (cliente o demostración), nombre, descripción, enlace y captura.
- **Nosotros:** título y dos párrafos.
- **Proceso:** título y descripción de los cuatro pasos.
- **Contacto:** título, texto, botón de envío.
- **Pie:** descripción breve.

Para integrar contenido sin romper el diseño, cada texto debe tener una longitud parecida al marcador que sustituye.

## Pruebas realizadas
- Enlaces internos: 22 anclas, ninguna rota. Todos los recursos locales existen.
- Escritorio y móvil sin errores de JavaScript. El único error es la carga de Google Fonts, que el entorno de prueba no puede alcanzar.
- Menú móvil: apertura, cierre con Escape, foco atrapado, sin desbordamiento horizontal.
- Formulario: validación con mensajes accesibles; envío correcto con endpoint simulado; aviso sin endpoint.
- Canales de contacto: enlaces `wa.me` y `mailto:` generados desde la configuración.
- Símbolo 3D: renderiza en WebGL; sin WebGL se muestra `assets/logo.png`.
- Movimiento reducido: sin entradas animadas ni giro automático.

## Pendiente antes de publicar
- Probar en Safari y en un teléfono real.
- Conectar el endpoint del formulario.
- Sustituir todos los marcadores con el contenido definitivo.

## Rediseño visual (noviembre 2026)
- `styles.css`: sistema editorial nuevo (paleta, Sora e Inter sin cambios). Servicios como índice en filas, proyectos en composición asimétrica, proceso como línea de tiempo, formulario con campos subrayados.
- `symbol-3d.js`: misma geometría del remolino, sin tocar proporciones. Solo se añadieron opciones (`zoom`, `spin`, `angle`, `tilt`, `scroll`, `pointer`) y se centró el pivote de giro.
- `main.js`: el símbolo 3D se monta en el hero (gira y avanza con el scroll), en la cabecera y en el pie. Si no hay WebGL, se usa `assets/simbolo-transparente.png` o `assets/logo.png`.
- `index.html`: misma estructura, ids y marcadores de contenido. No se escribió texto nuevo.
- Nota: el ZIP recibido no incluía la carpeta `assets/`; los archivos están en una sola carpeta. Las imágenes de respaldo y el favicon necesitan `assets/` junto a `index.html`.

## Segunda versión del rediseño
- El símbolo 3D es ahora un escenario fijo (`#stage`): cada sección declara su pose en `data-pose` (x, y, zoom, ry, a) y `main.js` la aplica al entrar en vista. `symbol-3d.js` expone `pose()`.
- Los textos de hero, servicios, nosotros, proceso y contacto son una **propuesta de copy** basada solo en lo documentado (los seis servicios y los cuatro pasos). Edítalos libremente en `index.html`. Siguen como marcadores los textos de Proyectos y los datos de contacto.
