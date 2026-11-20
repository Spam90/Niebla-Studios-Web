# Niebla Studios

Sitio web oficial y laboratorio de demostraciones de Niebla Studios.

## Tecnología
- HTML semántico, CSS y JavaScript vanilla.
- Sitio estático desplegado en Vercel.
- Símbolo 3D WebGL con alternativa visual estática.
- Pruebas de navegador con Playwright.

## Estructura
- `index.html`: página principal.
- `styles.css`: estilos globales y responsive.
- `main.js`: navegación, interacciones y canales de contacto.
- `config.js`: dominio, idioma y canales oficiales.
- `symbol-3d.js`: renderizado WebGL del símbolo principal.
- `assets/simbolo.svg`: marca vectorial transparente y favicon.
- `assets/logo.jpg`: imagen cuadrada para metadatos sociales y respaldo visual.
- `demos/index.html`: catálogo, gestión y reservas de demostración.
- `tests/`: pruebas E2E automatizadas.

## Demos
Las demos utilizan datos ficticios y estado local del navegador. No envían pedidos, reservas ni registros a un servidor; los cambios se pierden al recargar. No deben interpretarse como clientes, implementaciones contratadas ni resultados comerciales.

## Configuración
Edita `config.js` para actualizar el dominio y los canales oficiales. WhatsApp permanece oculto mientras no se configure un número oficial. El correo publicado es el canal directo disponible.

Dominio: https://nieblastudio.devs.surf

## Desarrollo local
Requiere Node.js y Python 3.

```bash
npm install
npx playwright install chromium
npm test
```

El servidor local de pruebas utiliza `http://127.0.0.1:4173`.

## Propiedad intelectual
El código, los diseños y los recursos de este repositorio son propiedad de Niebla Studios. Se aplica la licencia incluida en `LICENSE`; la visibilidad pública del repositorio no concede permiso de reutilización.

## Formulario de contacto

El formulario utiliza una función de Vercel en `api/contact.js` y la API de Resend. Para activar el envío real, configura estas variables en Vercel (Production, Preview y Development según corresponda):

- `RESEND_API_KEY`: clave secreta de Resend. Nunca debe incluirse en archivos públicos ni en el frontend.
- `CONTACT_FROM_EMAIL`: dirección remitente verificada en Resend, por ejemplo `contacto@tudominio.com`.

El destinatario está fijado en `nieblastudiosrd@gmail.com`. Mientras falte la configuración, el endpoint devuelve un estado explícito de servicio no configurado y la web conserva el correo directo como alternativa.
