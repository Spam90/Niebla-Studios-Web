/* Niebla Studios — configuración centralizada.
   Único lugar donde se completan los datos del sitio.
   Todo campo vacío ("") se muestra como pendiente y no se publica como dato real. */
window.NIEBLA_CONFIG = {

  site: {
    name: "Niebla Studios",
    domain: "",                 // Ej: "nieblastudios.com" (sin https://). PENDIENTE
    locale: "es_DO",            // Configuración regional para Open Graph
    twitterHandle: ""           // Ej: "@nieblastudios". Opcional. PENDIENTE
  },

  contact: {
    email: "",                  // Correo de contacto público. PENDIENTE
    whatsapp: "",               // Solo dígitos con prefijo de país. Ej: "18090000000". PENDIENTE
    whatsappMessage: "Hola, quiero solicitar un proyecto con Niebla Studios."
  },

  form: {
    endpoint: ""                // URL que recibe el formulario por POST (JSON). PENDIENTE
  }

  /*
   PENDIENTES DE CONTENIDO (redactados por ChatGPT, no incluidos en la configuración):
   - Textos de cada [MARCADOR] en index.html.
   - Descripciones de servicios y resultados para el cliente.
   - Proyectos reales o de demostración, con capturas, nombre, tipo y enlace.
   - Texto de la sección Nosotros.
   - Textos del proceso de trabajo.
   - Metadatos SEO: título, descripción y subtítulo (también en Open Graph y Schema.org).
   Ver README.md para el listado completo.
  */
};
