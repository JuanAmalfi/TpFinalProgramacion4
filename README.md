📚 LibrosApp

LibrosApp es una aplicación web desarrollada íntegramente en Angular 20, diseñada para simular una librería digital moderna, intuitiva y completamente responsive.
Permite a los usuarios explorar libros, ver detalles, gestionar reseñas, administrar un carrito de compras y acceder a una biblioteca personal luego de realizar una compra.
Incluye autenticación con roles, guards, múltiples CRUD completos y persistencia mediante JSON-Server como API local.

Licencia:
El proyecto está realizado de forma individual como Trabajo Final para la materia Programación IV (UTN – FRMDP).

✨ Características Principales
🔐 Autenticación y Roles

Login con validación por credenciales.

Roles: Usuario y Administrador.

Interfaz dinámica según el rol.

Guards para proteger rutas sensibles.

📘 Gestión de Libros (CRUD completo)
-Listado general con filtros y búsqueda .
-Alta, edición y eliminación (solo administrador).
-Detalle del libro con imagen, precio y descripción.
-Elementos visuales modernos y responsivos.

🛒 Carrito de compras
-Agregar libro desde el detalle.
-Quitar elementos.
-Total dinámico.
-Confirmación de compra.
-Persistencia en JSON-Server.

📚 Biblioteca del Usuario
-Sección personalizada con los libros comprados.
-Estados de lectura: No leído, Leyendo y Terminado.
-Acceso rápido al detalle del libro adquirido.

📝 Gestión de Reseñas (CRUD)
-Crear reseñas para libros adquiridos.
-Editar o eliminar reseñas propias
-Mostrar reseñas en el detalle del libro.

👤 CRUD de Usuarios (Administrador)
-Alta de usuarios.
-Edición de datos.
-Gestión general del sistema.

🎨 Diseño visual destacado
-Estética limpia, moderna y consistente.
-Glassmorphism, sombras suaves y microinteracciones.
-Layout responsive con Grid y Flex.
-Paleta cálida inspirada en librerías reales.



src/
├── app/
│   ├── carrito/          # Carrito de compras
│   ├── libro/            # CRUD de libros + detalles
│   ├── biblioteca/       # Biblioteca del usuario
│   ├── resenias/         # CRUD de reseñas
│   ├── usuarios/         # CRUD de usuarios y perfil
│   ├── home/             # Página principal
│   ├── log/              # Login y autenticación
│   ├── guards/           # AuthGuard y RoleGuard
│   ├── header/           # Barra superior
│   ├── footer/           # Pie de página
│   ├── app.routes.ts     # Configuración de rutas
│   ├── app.config.ts     # Providers globales y bootstrap
│   └── styles.css        # Variables y estilos globales
├── assets/               # Imágenes y recursos estáticos
├── db.json               # Base de datos JSON-Server
└── main.ts               # Entry point



Tecnologías Utilizadas
-Angular 20 (standalone components + signals)
-TypeScript
-HTML / CSS
-JSON-Server (API simulada)
-Flexbox & Grid
-LocalStorage (estado de sesión)



Flujo Principal de la Aplicación
1️⃣ Registro / Login
Usuario inicia sesión → se habilitan secciones según rol.

2️⃣ Exploración de Libros
Filtrar, buscar, ordenar y ver detalles.

3️⃣ Compra y Carrito
Agregar libros → confirmar compra → se agregan a la biblioteca.

4️⃣ Biblioteca Personal
Ver libros adquiridos y estados de lectura.

5️⃣ Reseñas
Agregar, editar o eliminar reseñas de libros comprados.

6️⃣ Administración (Rol Admin)
Gestión completa de:
Libros
Usuarios
Reseñas


Instalacion:
1) Clonar repositorio en visual studio code.
2) Instalar dependencias (npm install) en la terminal
3) Levantar LocalHost en Angular.


🧑‍💻 Autor
Juan Francisco Amalfi
Estudiante de la Tecnicatura Universitaria en Programación
UTN – Facultad Regional Mar del Plata



