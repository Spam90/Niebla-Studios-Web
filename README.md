# Niebla Studios — sitio web oficial

Sitio estático desarrollado con HTML, CSS y JavaScript vanilla. No requiere framework ni proceso de compilación.

## Archivos principales
- `index.html`: página principal, posicionamiento y explicación del enfoque de trabajo.
- `demos/index.html`: laboratorio con tres prototipos interactivos (catálogo, gestión y reservas).
- `styles.css`: sistema visual y adaptación responsive. La identidad de marca (logo, paleta y símbolo 3D) se conserva; los cambios estructurales y de contenido aprobados pueden ampliar el sistema sin alterar esa identidad.
- `main.js`: navegación móvil, canales de contacto, símbolo 3D y comportamiento de la página.
- `config.js`: configuración centralizada del nombre y los canales oficiales.
- `symbol-3d.js`: símbolo 3D WebGL y su alternativa de respaldo.
- `assets/logo.png` y `assets/simbolo-transparente.png`: recursos gráficos utilizados por el sitio.

## Estado real de la agencia y reglas de contenido
Niebla Studios todavía no tiene clientes. Por tanto:
- No publicar testimonios, reseñas, logotipos de clientes, cifras de proyectos, estadísticas ni casos de éxito inventados.
- La sección pública se denomina **Demos y exploraciones**. El laboratorio contiene prototipos funcionales con datos ficticios: catálogo con carrito y administración local, panel de gestión con registros de ejemplo y exportación CSV, y flujo de reservas local. No son trabajos contratados ni proyectos de clientes. Las acciones no se envían a un backend y los datos se reinician al recargar.
- Mantener todos los servicios de desarrollo web y software aprobados. Describir el alcance con precisión y no afirmar experiencia, resultados o funcionalidades que no se hayan comprobado.
- La sección Nosotros puede explicar el equipo, el enfoque y el proceso sin fingir trayectoria comercial.
- El proceso de trabajo explica cómo se atenderán futuros proyectos; no representa experiencia acumulada.
- No añadir secciones de prueba social hasta disponer de material auténtico y autorización para publicarlo.

## Contacto
El correo oficial confirmado es `nieblastudiosrd@gmail.com`. El enlace se genera desde `config.js`.

WhatsApp todavía no está configurado. El sitio oculta el canal mientras el número oficial no exista; no debe mostrarse un botón deshabilitado ni sustituirse por un número personal sin autorización.

El formulario anterior fue retirado porque no tenía un endpoint real y no podía enviar mensajes. La página ofrece contacto directo por correo hasta que se implemente y pruebe una integración real. No volver a mostrar un formulario sin verificar recepción, errores y protección de datos.

## Configuración
En `config.js`:
- `site.domain`: URL pública confirmada `https://nieblastudio.devs.surf`.
- `contact.email`: correo oficial confirmado.
- `contact.whatsapp`: número oficial en formato internacional, solo dígitos; pendiente.
- `contact.whatsappMessage`: texto inicial del enlace de WhatsApp.

La URL pública está configurada en canonical, Open Graph, Schema.org y `site.domain`. La validación de DNS en Vercel y la confirmación del despliegue deben comprobarse por separado.

## Criterios de cambios
- No rediseñar ni alterar CSS, composición, animaciones o símbolo 3D sin petición expresa.
- Diferenciar demo, proyecto personal, trabajo contratado y caso de éxito.
- No afirmar que la web está publicada o que un canal funciona sin comprobarlo.
- Registrar decisiones relevantes también en el repositorio central `Spam90/Agencia-del-goat`.

## Dominio público y configuración

- URL pública: https://nieblastudio.devs.surf (el usuario confirmó que la página carga).
- `site.domain`, canonical, Open Graph y Schema.org utilizan esta URL.
- El estado interno Valid Configuration/Verified de Vercel y el despliegue de este commit deben comprobarse por separado.
- El QA completo del sitio sigue pendiente.


## Laboratorio de demos

Ruta pública: `/demos/`.

- **Catálogo digital:** búsqueda, filtro por categoría, carrito de prueba y alta local de productos desde la vista administrativa.
- **Sistema de gestión:** indicadores calculados desde registros ficticios, búsqueda, filtro por estado, cambio de estado y exportación CSV.
- **Sistema de reservas:** selección de servicio, fecha y horario, confirmación local y prevención de duplicados de horario durante la sesión.

Aviso obligatorio en la interfaz: los datos son ficticios, las acciones solo ocurren en el navegador, no existe backend ni procesamiento real y el estado se reinicia al recargar. No presentar estas demos como productos terminados, clientes o resultados comerciales.
