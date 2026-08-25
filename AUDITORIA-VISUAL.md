# Auditoría visual y de UX — Revisión final

Revisión completa del diseño existente: qué se mantuvo, qué se corrigió y por qué.
El objetivo no fue rediseñar por rediseñar, sino que **cada decisión que queda en el producto tenga una razón**.

---

## 1. Sistema de diseño (lo que antes no existía)

Antes: paleta `slate` + `indigo` de Tailwind por defecto, Inter, radios y alturas mezclados
(`rounded-lg`, `rounded-xl`, `rounded-2xl`; `py-1.5`, `py-2`, `py-2.5`), 5 acentos de color
compitiendo entre sí. Se veía como un dashboard SaaS genérico.

Ahora hay un sistema explícito en `tailwind.config.js`:

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F8F7F4` | fondo de aplicación (blanco cálido, no gris azulado) |
| `surface` | `#FFFFFF` | superficie de listado y modal |
| `ink-900/700/500/400/300/200` | `#1B1A17` → `#B8B3A9` | jerarquía de texto, 6 pasos y nada más |
| `line / line-soft / line-strong` | `#E4E1DA / #EFEDE8 / #D3CFC6` | contenedor, divisores internos, bordes de control |
| `accent` | `#1D5B52` (+ `dark`, `tint`) | **único** color de acción |
| `danger` | `#8E2C22` (+ `border`, `tint`) | eliminar y errores |

- **Tipografía:** IBM Plex Sans (UI) + IBM Plex Mono (email, teléfono, contador, etiquetas de
  sistema). El monoespaciado no es decorativo: alinea dígitos y direcciones en columna y le da
  identidad de herramienta interna en lugar de landing.
- **Pesos:** sólo 400 / 500 / 600. Nada de 700–900.
- **Radios:** 8px controles · 10px contenedor de lista · 12px modal · pill sólo para el badge.
- **Escala de spacing:** 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 56. Sin valores fuera de escala.
- **Movimiento:** 150ms en hover/focus, 180ms en el modal. Sin bounce, pulse permanente, glow ni float.

---

## 2. Layout y alineación

- Un único contenedor: `max-w-[1120px]` + `px-4 / sm:px-6 / lg:px-8`. Header, filtros, contador y
  listado comparten **exactamente** el mismo ancho y los mismos márgenes laterales (antes el header
  usaba `max-w-7xl` con paddings distintos de los del contenido).
- Ritmo vertical: header → filtros 20/28px · buscador → chips 12px · filtros → listado 16px ·
  fila → fila 1px de divisor con 58px de alto mínimo.
- Se eliminó la "tarjeta de filtros" (caja blanca con sombra dentro de otra caja): los filtros ahora
  viven sobre el fondo, y la única superficie elevada es el listado. Menos capas, jerarquía más clara.

---

## 3. Header

`identidad → contexto → acción`: eyebrow mono `DIRECTORIO INTERNO`, título `Contactos`, y un solo
botón primario. Se quitó el cuadrado con icono (decorativo) y la línea "N contactos en total en la
empresa", que duplicaba el contador de resultados. Sin navegación inventada.

---

## 4. Listado: de grid de tarjetas a filas alineadas

Cambio de patrón **con razón de UX**, no estética: en una grilla de 3 tarjetas el email de una
tarjeta nunca se alinea con el de la de al lado, así que escanear "todos los emails" o "todos los
departamentos" obliga a leer en zigzag. Un gestor de contactos se usa para escanear.

Ahora: una sola superficie con filas divididas, y columnas de base fija
(`170 / 196 / 128 / 116px` + acción) que **se alinean verticalmente** en desktop y **se apilan
naturalmente** en mobile por `flex-wrap` — sin media queries y sin overflow.

- Nombre: 15px / 500 / `ink-900` — único elemento con peso.
- Email: mono 12.5px `ink-500`, enlace `mailto:`.
- Teléfono: mono 12.5px `ink-400` (secundario), enlace `tel:`; ausencia = "Sin teléfono" en `ink-200`, sin cursiva.
- Departamento: badge pill mono 11px con punto de color, contenedor de ancho fijo → todos los badges alinean.
- Eliminar: posicionado en absoluto a la derecha, fuera del flujo, así **nunca** empuja el layout ni
  genera una línea vacía al envolver. Siempre visible (32×32 y toda la fila de alto útil), no
  aparece sólo en hover: en touch el hover no existe.
- Se quitó el avatar de iniciales: era ruido de datos (información que no existe) y comía 52px de
  ancho útil por fila.

**Contenido real:** nombres y emails largos truncan con ellipsis y `title` completo; el layout no se
rompe con `alejandro.maximiliano.fernandez.rodriguez@example.com`.

---

## 5. Buscador, chips y contador

- Buscador 40px de alto, icono a 12px del borde, `pl-[34px]` para que el texto nunca lo toque,
  botón de limpiar de 32×32 (área táctil real) y focus con borde `accent` + ring de 3px.
- Chips: **misma** altura (36px), padding, radio, tipografía y borde de 1px en los cuatro estados.
  El chip activo no cambia de tamaño → cero layout shift. Estados distinguibles por color *y* contraste.
- Contador: mono 12px, alineado a la derecha del buscador, en la misma línea → se lee como
  "resultado de estos filtros", no como una estadística. Dice `8 contactos` cuando no hay filtro y
  `3 de 8 contactos` cuando sí. `aria-live="polite"`.

---

## 6. Modal

- Ancho 468px (antes `max-w-md` = 448px con padding interno de 24px: la relación campo/caja quedaba apretada).
- Estructura header / cuerpo scrolleable / footer fijo con `max-h-[calc(100vh-48px)]`:
  en mobile el contenido scrollea **dentro** del modal y los botones nunca quedan fuera de pantalla.
- Overlay `#1B1A17/40` + blur 3px: suficiente contraste para el foco, suficiente contexto para no perder ubicación.
- Padding consistente de 20px en las tres zonas; footer con fondo `#FCFBF9` y borde superior que lo separa del formulario.
- Se mantuvo (y se respetó) la lógica existente: trap de foco, `inert` en el fondo, Escape, scroll lock, restauración de foco.

---

## 7. Formulario

- Un solo patrón por campo: `label (13/500) → 6px → input (40px) → 6px → error (12px)`. Sin excepciones.
- Todos los inputs y el select miden **40px**. Antes convivían alturas efectivas distintas por padding + iconos.
- Se quitaron los iconos dentro de los inputs: cuatro campos etiquetados no los necesitan, y obligaban
  a `pl-10`, desalineando el texto respecto de los labels.
- Email y teléfono en monoespaciado: se leen y verifican mejor.
- "Teléfono · opcional" en el label: la opcionalidad se declara donde se mira, no en un helper text.
- Estados: default / hover (`#BEB9AE`) / focus (borde accent + ring 3px) / filled / error (borde
  `danger-border` + mensaje) / disabled (fondo `line-soft`, texto `ink-300`).
- El error es evidente pero no agresivo: texto `#8E2C22` y borde, sin fondo rojo ni iconografía de alarma.

---

## 8. Botones

Todas las variantes comparten alto (40px), radio (8px), tipografía (14/500), borde de 1px y
transición. Sólo cambian color, borde y énfasis.

- `primary` — accent sólido (Agregar / Guardar)
- `secondary` — superficie con borde (Cancelar / Restablecer)
- `danger` — tinte + texto `danger` (destructivo)
- `ghost` — sin superficie (acciones terciarias)
- **disabled**: no es "primary con opacidad 50%". Es una superficie propia (`line-soft` + `ink-300` +
  borde `line`) que comunica "no disponible" y conserva contraste legible.

---

## 9. Estados vacíos

Dentro del mismo contenedor del listado (antes eran una caja punteada distinta, que rompía el ancho
y la superficie). Sin ilustración gigante ni icono en círculo con ring: eyebrow + título + una línea
de explicación + una acción.

- **Sin contactos:** qué pasa, por qué y qué hacer → "Agregar primer contacto" (primary).
- **Sin resultados:** aclara que son los filtros y cuántos contactos hay en total → "Restablecer filtros" (secondary).

---

## 10. Skeleton y transición

El skeleton usa **la misma geometría** que la fila real: mismo contenedor con borde y radio, mismo
`min-h-[58px]`, mismos paddings y las mismas bases de columna (170 / 196 / 128 / 116). Los anchos de
las barras varían por fila para no parecer una tabla sintética. Resultado: `loading → content` no
mueve el layout ni cambia la altura del contenedor.

---

## 11. Responsive (verificado)

| Viewport | Comportamiento |
|---|---|
| 320 / 375 / 390 / 430 | Botón del header a ancho completo; buscador full width; chips en dos líneas sin overflow; fila apilada en 3 líneas con acción fija arriba a la derecha; modal a `p-3` con scroll interno y footer visible |
| 768 / 1024 | Header en una línea; buscador 380px + contador a la derecha; filas empiezan a alinear columnas |
| 1280 / 1440 / 1920 | Contenido centrado en 1120px; las cuatro columnas alineadas; sin líneas de texto excesivamente largas |

Sin `overflow-x` en ningún ancho: nada tiene ancho fijo mayor al viewport y todo texto largo trunca.

---

## 12. Accesibilidad

- Foco visible en **todos** los interactivos: ring de 3px `accent/20` (o `danger/15` en eliminar), nunca `outline: none` sin reemplazo.
- Contraste: `ink-900` sobre `surface` 15:1 · `ink-500` 7:1 · mono `ink-400` sobre blanco 4.6:1 · `#FDFCFA` sobre `accent` 7.4:1.
- El estado activo de un chip no se comunica sólo por color: además tiene `aria-pressed` y un salto de contraste completo (texto claro sobre sólido).
- Áreas táctiles: chips 36px, botones 40px, eliminar y cerrar 32px con separación de 12px+ de cualquier otro objetivo.
- Labels reales en todos los campos, `aria-invalid` + `role="alert"` en errores, `aria-live` en el contador, `role="status"` en el skeleton.
- Modal: `role="dialog"`, `aria-modal`, título y descripción asociados, trap de foco, Escape, fondo `inert`.
- `prefers-reduced-motion` respetado (ya existía; se mantuvo).

---

## 13. Lo que se decidió NO hacer

- **Dark mode:** no existía. Agregarlo sólo para impresionar habría duplicado la superficie a mantener sin que la prueba lo pida.
- **Confirmación de borrado / undo:** es funcionalidad nueva, no un problema visual.
- **Búsqueda por email:** el placeholder dice "Buscar por nombre" porque la lógica de negocio existente filtra por nombre. No se tocó lógica para justificar una etiqueta.
- **Ordenamiento, paginación, avatares, estadísticas, sidebar, tabs, toasts:** fuera de alcance.
- Se mantuvieron intactos: `useContacts`, `useContactFilters`, `filterContacts`, `contactSchema`, tipos y tests.

---

## 14. Checklist final

**Layout** ✅ alineación · ✅ spacing en escala · ✅ un solo ancho máximo · ✅ altura de fila estable · ✅ responsive 320→1920 · ✅ sin overflow
**Tipografía** ✅ 7 niveles definidos · ✅ 3 pesos · ✅ line-heights consistentes · ✅ truncado con `title`
**Componentes** ✅ botones (5 variantes, 1 geometría) · ✅ inputs 40px · ✅ chips sin layout shift · ✅ filas alineadas · ✅ modal con footer fijo · ✅ skeleton isomorfo · ✅ empty states
**Estados** ✅ default · ✅ hover · ✅ active · ✅ focus · ✅ disabled · ✅ loading · ✅ error · ✅ empty (x2)
**Accesibilidad** ✅ teclado · ✅ foco · ✅ labels · ✅ contraste · ✅ áreas táctiles · ✅ modal
