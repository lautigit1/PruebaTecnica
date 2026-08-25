# Auditoría técnica — Gestor de Contactos con Filtros

## AUDITORÍA

```
CRÍTICOS
(ninguno encontrado)

IMPORTANTES
- Modal.tsx: no había focus trap. Con Tab se podía sacar el foco del diálogo
  hacia el contenido de fondo mientras el modal seguía abierto (viola el
  patrón WAI-ARIA Dialog y el punto "el foco no se pierde" de la consigna).
- Modal.tsx: el contenido de fondo (#root) seguía siendo alcanzable por
  lectores de pantalla mientras el modal estaba abierto (no se marcaba como
  inert/oculto para AT).
- tests/ContactForm.test.tsx: el primer test generaba un warning de React
  "not wrapped in act(...)" porque la validación inicial de Formik
  (validateOnMount) resuelve después de que el test síncrono termina.

MEJORAS (no aplicadas — costo/beneficio no lo justifica)
- Badge.tsx tiene un fallback `|| {...}` para colores de departamento que es
  inalcanzable dado que `department` ya está tipado como `Department`. Es
  código defensivo inocuo; no aporta quitarlo.
- Podría añadirse un test dedicado de "Escape cierra el modal" y de
  restauración de foco, hoy cubiertos solo indirectamente.

CORRECTO / NO TOCAR
- Modelo de dominio (Contact, Department, DepartmentFilter) correctamente
  tipado, sin `any`, sin casts injustificados. `noUncheckedIndexedAccess`
  activado y respetado en todo el código.
- Estado: filteredContacts es derivado vía useMemo, no se duplica en
  estado. useContacts/useContactFilters bien separados, sin prop drilling
  relevante.
- generateUUID usa crypto.randomUUID con fallback a getRandomValues; nunca
  Math.random/Date.now/índices.
- Filtro combinado (nombre + departamento) con normalización trim+lowercase,
  correctamente cubierto por tests incluyendo edge cases.
- Formik + Yup: validación en tiempo real, botón deshabilitado hasta
  formulario válido y dirty, reset automático al enviar, remount limpio del
  formulario al reabrir el modal (Modal retorna null y desmonta el árbol).
- Accesibilidad general: labels asociados, aria-invalid/aria-describedby en
  Input/Select, aria-pressed en chips, role="dialog"/aria-modal en Modal,
  prefers-reduced-motion respetado, sin abuso de ARIA.
- Responsive: grid adaptativo, truncado de nombres/emails largos con
  title, chips con flex-wrap; sin overflow horizontal esperable entre
  320px–1440px.
- Sin dangerouslySetInnerHTML, sin secretos, sin dependencias sin usar.
- ESLint (no-explicit-any: error) y TypeScript strict pasan sin
  excepciones ni eslint-disable.
```

## PLAN

Se aplicaron únicamente los 3 puntos "IMPORTANTES": trampa de foco y
`inert` en el fondo dentro de `Modal.tsx` (mismo archivo, sin nuevas
dependencias ni abstracciones), y el ajuste del test de ContactForm para
esperar el settle de Formik. Nada más se modificó.

## VALIDACIÓN

Ejecutado en un entorno Linux con `node_modules` reinstalado desde el
mismo `package.json`/`package-lock.json` del proyecto (el `node_modules`
original en el equipo del usuario está armado para Windows y no puede
ejecutarse en la VM de shell remoto):

- `tsc -b --force`: sin errores.
- `eslint .`: sin errores ni warnings.
- `vite build`: build de producción exitoso (244 KB / 78 KB gzip).
- `vitest run`: 35/35 tests OK, sin warnings de `act()`.

## INFORME FINAL

```
Estado final:
- TypeScript: PASS
- ESLint: PASS
- Build: PASS
- Tests: PASS (35/35)
- Accesibilidad: OK (se corrigió focus trap + inert de fondo en el modal)
- Responsive: OK
- Arquitectura: OK

Cambios realizados:
- src/components/ui/Modal.tsx: trampa de foco (Tab/Shift+Tab) dentro del
  diálogo y `inert` sobre #root mientras el modal está abierto.
- tests/ContactForm.test.tsx: test inicial ahora espera el settle de
  Formik para eliminar el warning de act().

Problemas restantes:
- Ninguno bloqueante. El proyecto compila, lintea, buildea y testea limpio.

Riesgos conocidos:
- El atributo `inert` requiere navegadores relativamente recientes
  (Chrome/Edge/Firefox/Safari actuales lo soportan; no hay polyfill
  agregado porque no se justifica para este alcance).

Recomendaciones futuras (NO implementar ahora):
- Si el proyecto evoluciona hacia edición de contactos o persistencia,
  la separación actual (hooks de estado / esquema Yup / utils puros)
  ya permite agregar esas features sin reescribir componentes.
- Tests adicionales de Escape y restauración de foco si se busca
  cobertura más exhaustiva del modal.
```
