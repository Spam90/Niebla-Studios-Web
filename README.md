# Niebla Studios

Sitio web oficial de Niebla Studios y página de demostraciones interactivas.

## Sitio actual

La página principal es un sitio estático construido con HTML, CSS y JavaScript vanilla. No utiliza un framework de frontend ni requiere un servidor de aplicación.

- `index.html`: contenido y estructura de la página principal.
- `redesign.css`: estilos, diseño responsive y estados visuales de la web actual.
- `redesign.js`: navegación móvil, animaciones, efectos visuales y comportamiento del fondo.
- `config.js`: configuración centralizada del dominio y los canales de contacto.
- `assets/simbolo.svg`: símbolo vectorial de la marca.
- `assets/logo.jpg`: imagen utilizada en los metadatos para compartir la web.
- `404.html`: página para rutas no encontradas.
- `robots.txt` y `sitemap.xml`: directivas de rastreo y mapa del sitio.

El fondo animado de la página utiliza un canvas WebGL con una alternativa visual estática cuando WebGL no está disponible o el usuario prefiere movimiento reducido. La versión actual no carga un renderizador 3D independiente del símbolo.

## Demostraciones

- `demos/index.html`: catálogo interactivo de demostraciones de catálogo, gestión y reservas.

Las demos son conceptuales y utilizan datos ficticios y estado local del navegador. No envían pedidos, reservas ni registros a un servidor; los cambios pueden perderse al recargar. No deben presentarse como proyectos entregados a clientes ni como resultados comerciales reales.

## Configuración

Edita `config.js` para actualizar los datos del sitio y los canales oficiales.

- Dominio: https://nieblastudio.devs.surf
- Correo: nieblastudiosrd@gmail.com
- WhatsApp: pendiente de configurar; no se muestra mientras no exista un número oficial.

El contacto principal de la página se realiza mediante enlaces de correo electrónico. No hay un formulario conectado a un backend.

## Pruebas y calidad

- `tests/site.spec.js`: pruebas E2E de navegación, contenido, responsive, interacciones y accesibilidad automatizada.
- `playwright.config.js`: configuración de Playwright y servidor local de pruebas.
- `.github/workflows/quality.yml`: ejecuta las pruebas en GitHub Actions al hacer push o abrir un pull request hacia `main`.

### Ejecutar localmente

Requiere Node.js y Python 3.

```bash
npm install
npx playwright install chromium
npm test
```

Playwright inicia un servidor estático en `http://127.0.0.1:4173`.

## Despliegue

El repositorio está preparado para un despliegue estático. El dominio configurado en los metadatos y en `config.js` es https://nieblastudio.devs.surf.

## Propiedad intelectual

El código, los diseños y los recursos de este repositorio son propiedad de Niebla Studios. Se aplica la licencia incluida en `LICENSE`; que el repositorio sea público no concede permiso de reutilización.
