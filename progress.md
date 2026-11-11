Original prompt: Mejora en el modo oscuro la aparición del svg con el mapa y fonts de las preguntas y el reloj.

## Plan

- Reforzar la carta del mapa en el modo oscuro sin restar legibilidad al juego.
- Separar los colores de pregunta y reloj de los tonos de tablero.
- Verificar build, formato y contraste visual disponible.

## Implementación

- En modo oscuro, `world-map.svg` se usa como una carta de fondo de baja opacidad tanto en el escenario como en la placa de la bandera.
- Los títulos de pregunta y el reloj usan tokens independientes de los tonos del tablero para conservar contraste.
- El reloj recibe una base azul profunda y el tiempo se destaca con el marcador ámbar; la pregunta gana una guía lateral de marca y un peso tipográfico más firme.

## Verificación

- `pnpm run linter`, `pnpm oxfmt --check` y `pnpm run build` finalizaron correctamente.
- El cliente automatizado de juego no pudo ejecutarse porque la dependencia `playwright` no está instalada en el entorno.
