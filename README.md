# Estudio Jurídico - Bautista Galatro (Abogado)

Sitio web institucional minimalista y profesional para el Abogado Bautista Galatro (La Plata). Incluye una interfaz moderna y responsiva de una sola página ("One-Page") y un servidor backend ligero para recibir y derivar consultas vía correo electrónico.

## Características

- **Diseño UI/UX Premium:** Estructura limpia y minimalista en tonos blanco, gris pizarra y acentos verde esmeralda.
- **Formulario de Contacto Interactivo:** Validación en tiempo real (lado del cliente) y envío asíncrono.
- **Backend Robusto (Node.js + Express):** Lógica del lado del servidor para procesar consultas y validación de seguridad.
- **Notificaciones por Email:** Integración con **Nodemailer** para el envío automático de emails a `galatrobautista@gmail.com` usando SMTP.
- **Modo Simulado de Desarrollo:** Si no se configuran credenciales SMTP, el backend simula el envío imprimiendo los detalles en la consola de comandos, facilitando las pruebas locales sin configuraciones complejas.
- **Totalmente Adaptable:** Diseño responsivo para celulares, tablets y computadoras.

---

## Estructura del Proyecto

```text
├── public/                 # Archivos estáticos del frontend
│   ├── css/
│   │   └── style.css       # Estilos (Vanilla CSS)
│   ├── js/
│   │   └── main.js        # Lógica del cliente y validación de formulario
│   ├── images/             # Imágenes generadas para el sitio
│   │   ├── lawyer_hero.png
│   │   └── lawyer_profile.png
│   └── index.html          # Estructura semántica HTML5
├── .env.example            # Plantilla para variables de entorno
├── .gitignore              # Archivos excluidos de Git
├── package.json            # Dependencias del proyecto
└── server.js               # Código del servidor Express & Nodemailer
```

---

## Instalación y Configuración Local

1. **Clonar o descargar el proyecto** e ingresar al directorio:
   ```bash
   cd bautiabogado
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo `.env.example` y renombralo a `.env`:
   ```bash
   cp .env.example .env
   ```
   *Nota: Si dejas las credenciales SMTP en blanco, el servidor funcionará en **Modo Simulado**.*

4. **Iniciar el servidor en desarrollo:**
   ```bash
   npm run dev
   ```
   El sitio estará disponible en: `http://localhost:3000`

---

## Configuración de Correo SMTP (Producción / Netlify / VPS)

Para que el formulario envíe correos electrónicos reales a `galatrobautista@gmail.com`, edita tu archivo `.env` configurando los datos SMTP del servidor de correo que prefieras usar (por ejemplo, Gmail):

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contrasena-de-aplicacion-o-servicio
CONTACT_RECEIVER=galatrobautista@gmail.com
```

*Si usas Gmail, asegúrate de activar la verificación en dos pasos en tu cuenta de Google y generar una "Contraseña de aplicación" para colocar en `SMTP_PASS`.*
