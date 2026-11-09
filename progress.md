# Progreso del juego

## Solicitud original

> Crea un componente en React que sea un cronometro para las partidas de juego. Y al final se muestra, el tiempo que tardó la partida. El reloj, en su diseño, puede tener una estético tipo reloj mundial.

## Plan

- Crear un hook que mida la duración real de una partida y se limpie al desmontarse.
- Mostrar un reloj de expedición durante la partida y su duración congelada al finalizar.
- Verificar el build y el flujo visual disponible.

## Resultado

- Se añadió `useElapsedTime`, que calcula el tiempo desde un único instante de inicio, actualiza la interfaz cada 250 ms y libera su intervalo al detenerse.
- La partida ahora tiene un `sessionId`, de modo que responder preguntas no reinicia el tiempo; solo lo hacen una nueva carga de partida o el botón de nueva partida.
- Se añadió `WorldClock` en el encabezado de la pregunta y en el resumen final, con una esfera de meridianos, paralelos y manecillas.
- `pnpm run linter`, `pnpm run build` y la comprobación de formato finalizaron correctamente. La comprobación visual llegó al inicio de sesión: la ruta `/game` está protegida y no se usaron credenciales para atravesarla.
