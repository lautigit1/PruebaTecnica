# Sistema de Gestión de Contactos con Filtros Reactivos

Una aplicación web moderna, accesible y mantenible para la gestión y búsqueda de contactos empresariales, desarrollada con **React 18**, **TypeScript**, **Tailwind CSS**, **Formik** y **Yup**.

---

## 🚀 Características Principales

* **Filtros Reactivos Combinados**:
  * Búsqueda por nombre tolerante a espacios innecesarios e insensibilidad a mayúsculas/minúsculas.
  * Selector interactivo tipo chip por departamento (`Todos`, `Ventas`, `Desarrollo`, `Marketing`, `Soporte`).
  * Aplicación simultánea de filtros mediante estado derivado (`useMemo`) sin duplicación de estado.
  * Contador dinámico en tiempo real de contactos encontrados.
* **Carga Inicial y Skeleton Loading**:
  * Simulación de carga inicial fluida que replica visualmente la estructura exacta de las tarjetas de contacto (`Skeleton`).
* **Formulario y Modal Accesibles**:
  * Alta de contactos mediante modal con gestión de foco, cierre con `Escape`, clic en backdrop y bloqueo de scroll.
  * Validación en tiempo real y centralizada mediante esquema **Yup**.
  * Manejo de estados de formulario con **Formik** (deshabilitado al enviar/inválido, reseteo automático al confirmar/cancelar).
* **Generación de ID Segura**:
  * Asignación de UUID v4 estándar (`crypto.randomUUID`) en la capa de creación del modelo (`useContacts`).
* **Estados Vacíos Contextuales (`EmptyState`)**:
  * "Sin contactos": cuando la lista general está vacía, con botón para crear el primero.
  * "Sin resultados": cuando los filtros activos no arrojan coincidencias, con botón para restablecer filtros.
* **Eliminación Inmutable**:
  * Eliminación inmediata de contactos preservando la inmutabilidad del estado.
* **Accesibilidad (a11y)**:
  * Atributos semánticos (`role="dialog"`, `role="status"`, `aria-modal`, `aria-describedby`, `aria-invalid`, `aria-pressed`).
  * Navegación fluida por teclado y focus visible.
  * Respeto a preferencias del sistema (`prefers-reduced-motion`).

---

## 🛠️ Stack Tecnológico

* **React 18**: Biblioteca base para UI basada en componentes funcionales y hooks.
* **TypeScript (Strict Mode)**: Tipado estático estricto, unión de tipos y tipos derivados sin `any`.
* **Tailwind CSS**: Estilos utilitarios, responsive design y diseño moderno y sobrio.
* **Formik & Yup**: Gestión de estado de formularios y validaciones de esquema.
* **Lucide React**: Iconografía ligera y accesible.
* **Vite**: Bundler ultrarrápido y servidor de desarrollo.
* **Vitest & React Testing Library**: Suite de tests unitarios y de integración.
* **ESLint & Prettier**: Calidad, consistencia de código y formateo.

---

## 📁 Estructura del Proyecto

```text
src/
├── components/
│   ├── contacts/
│   │   ├── ContactCard.tsx       # Tarjeta individual con datos, avatar y acción de eliminar
│   │   ├── ContactFilters.tsx    # Búsqueda por nombre, chips de departamento y contador
│   │   ├── ContactForm.tsx       # Formulario con Formik y validación Yup
│   │   ├── ContactList.tsx       # Grid de contactos, skeletons o empty state
│   │   └── ContactModal.tsx      # Modal de alta de contacto
│   └── ui/
│       ├── Badge.tsx             # Badge accesible con código de color por departamento
│       ├── Button.tsx            # Botón con variantes (primary, secondary, danger, ghost)
│       ├── EmptyState.tsx        # Estados vacíos ("Sin contactos" vs "Sin resultados")
│       ├── Input.tsx             # Input accesible con label, error y helper text
│       ├── Modal.tsx             # Diálogo modal accesible con backdrop y tecla Esc
│       ├── Select.tsx            # Select accesible con opciones tipadas
│       └── Skeleton.tsx          # Skeleton loader que replica el layout real
├── constants/
│   └── departments.ts            # Fuente única de verdad para departamentos y colores
├── data/
│   └── data.json                 # Contactos iniciales
├── hooks/
│   ├── useContacts.ts            # Estado de contactos, inicialización, alta y baja
│   └── useContactFilters.ts     # Estado de filtros y lista derivada reactiva
├── schemas/
│   └── contactSchema.ts          # Esquema de validación Yup
├── types/
│   └── contact.ts                # Tipos TypeScript del dominio (Contact, Department)
├── utils/
│   ├── filterContacts.ts         # Función pura para lógica de filtrado combinado
│   └── id.ts                     # Generador seguro de UUID v4
├── App.tsx                       # Composición y layout principal
├── index.css                     # Directivas Tailwind y estilos base
└── main.tsx                      # Punto de entrada de React

tests/
├── App.test.tsx                  # Tests de integración de flujos principales
├── ContactForm.test.tsx          # Tests unitarios del formulario y validación
├── contactSchema.test.ts         # Tests del esquema Yup
├── filterContacts.test.ts        # Tests de la lógica de filtros y edge cases
└── id.test.ts                    # Tests de generación de UUID v4
```

---

## 📋 Requisitos Previos

* **Node.js**: `v18.0.0` o superior (recomendado `v20+` o `v22+`)
* **npm**: `v9.0.0` o superior

---

## ⚙️ Instalación y Puesta en Marcha

1. **Clonar el repositorio o situarse en el directorio:**
   ```bash
   cd pruebatec
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

---

## 📜 Comandos Disponibles

Todos los comandos están configurados en `package.json`:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Vite. |
| `npm run build` | Compila TypeScript (`tsc -b`) y empaqueta para producción con Vite. |
| `npm run preview` | Previsualiza localmente el build de producción. |
| `npm test` | Ejecuta la suite de pruebas automatizadas con Vitest. |
| `npm run test:watch` | Ejecuta las pruebas en modo observador interactivo. |
| `npm run lint` | Ejecuta ESLint para analizar estática y tipado. |
| `npm run format` | Formatea el código fuente utilizando Prettier. |

---

## 🧪 Pruebas Automatizadas

La aplicación cuenta con una suite completa de pruebas unitarias y de integración que cubren:
* Validación de esquema Yup (campos obligatorios, emails válidos, teléfonos, departamentos permitidos).
* Filtrado reactivo (búsqueda insensible a mayúsculas, espacios en blanco, filtros por departamento y combinación lógica).
* Generación de UUID v4 según estándar RFC 4122.
* Renderizado de Skeleton loaders durante la carga inicial.
* Flujo completo de apertura de modal, carga de datos, validación y alta en el listado.
* Eliminación inmutable de contactos.
* Estados vacíos contextuales y reseteo de filtros.

Para ejecutar los tests:
```bash
npm test
```
