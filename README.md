# Niebla Studios — sitio web oficial

Sitio estático desarrollado con HTML, CSS y JavaScript vanilla. No requiere framework ni proceso de compilación.

## Archivos principales
- `index.html`: contenido y estructura de la página.
- `styles.css`: sistema visual y adaptación responsive. El diseño editorial está aprobado y no debe modificarse sin autorización.
- `main.js`: navegación móvil, canales de contacto, símbolo 3D y comportamiento de la página.
- `config.js`: configuración centralizada del nombre y los canales oficiales.
- `symbol-3d.js`: símbolo 3D WebGL y su alternativa de respaldo.
- `assets/logo.png` y `assets/simbolo-transparente.png`: recursos gráficos utilizados por el sitio.

## Estado real de la agencia y reglas de contenido
Niebla Studios todavía no tiene clientes. Por tanto:
- No publicar testimonios, reseñas, logotipos de clientes, cifras de proyectos, estadísticas ni casos de éxito inventados.
- La sección pública se denomina **Demos y exploraciones**. Sus tres piezas son demostraciones conceptuales, no trabajos contratados ni proyectos de clientes.
- Mantener todos los servicios de desarrollo web y software aprobados. Describir el alcance con precisión y no afirmar experiencia, resultados o funcionalidades que no se hayan comprobado.
- La sección Nosotros puede explicar el equipo, el enfoque y el proceso sin fingir trayectoria comercial.
- El proceso de trabajo explica cómo se atenderán futuros proyectos; no representa experiencia acumulada.
- No añadir secciones de prueba social hasta disponer de material auténtico y autorización para publicarlo.

## Contacto
El correo oficial confirmado es `nieblastudiosrd@gmail.com`. El enlace se genera desde `config.js`.

WhatsApp todavía no está configurado. El sitio oculta el canal mientras el número oficial no exista; no debe mostrarse un botón deshabilitado ni sustituirse por un número personal sin autorización.

El formulario anterior fue retirado porque no tenía un endpoint real y no podía enviar mensajes. La página ofrece contacto directo por correo hasta que se implemente y pruebe una integración real. No volver a mostrar un formulario sin verificar recepción, errores y protección de datos.

## Dominio y configuración

- **Sitio público:** https://nieblastudio.devs.surf (confirmado por el usuario: la página ya carga desde esta dirección).
- **Proveedor DNS:** Devs.Surf; CNAME raíz y TXT `_vercel` añadidos con los valores solicitados por Vercel. La carga pública está comprobada por el usuario; el estado interno `Valid Configuration` de Vercel aún debe confirmarse.

En `config.js`:
- `site.domain`: `https://nieblastudio.devs.surf`.
- `contact.email`: correo oficial confirmado.
- `contact.whatsapp`: número oficial en formato internacional, solo dígitos; pendiente.
- `contact.whatsappMessage`: texto inicial del enlace de WhatsApp.

Canonical, Open Graph y Schema.org utilizan el dominio público confirmado. No alterar el diseño visual para este cambio.

## Criterios de cambios
- No rediseñar ni alterar CSS, composición, animaciones o símbolo 3D sin petición expresa.
- Diferenciar demo, proyecto personal, trabajo contratado y caso de éxito.
- No afirmar que la web está publicada o que un canal funciona sin comprobarlo.
- Registrar decisiones relevantes también en el repositorio central `Spam90/Agencia-del-goat`.
