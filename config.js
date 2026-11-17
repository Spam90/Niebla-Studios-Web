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

};
