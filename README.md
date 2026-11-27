# Observatorio de vacantes de Datos y Analítica en México

El panel de este repositorio consulta PostgreSQL para mostrar las observaciones de Indeed, OCC,
Get on Board, Wellfound y LinkedIn. El protocolo común está en
[src/workforce/files/protocol.json](src/workforce/files/protocol.json). La ventana de observación comprende del
25 de noviembre al 20 de diciembre de 2026, hora de Ciudad de México.

## Inicio en Docker

Desde la raíz de `workforce`, si aún no existe `.env`, copie `env.example` a `.env` y
configure `POSTGRES_PASSWORD`. Para un volumen existente utilice la contraseña con la que
se creó el usuario `workforce`.

```sh
docker compose up -d --build --wait
curl -fsS http://127.0.0.1:8000/api/health
```

Abra [el panel local](http://127.0.0.1:8000). El puerto se puede cambiar con `WORKFORCE_PORT`.
La vista previa de PyCharm en el puerto `63342` solo sirve los archivos del panel. El panel
conectado y las rutas `/api/` los sirve el contenedor `dashboard` en el puerto configurado.
El contenedor `workforce_postgres` conserva sus datos en el volumen `workforce_postgres_data`.
Al iniciar, el servicio del panel aplica las migraciones dentro de `workforce_db` y carga
los datos iniciales automáticamente. Si el volumen ya tiene la base anterior `workforce`,
el servicio crea `workforce_db` en el mismo servidor y conserva la base anterior. Las
dependencias están en `pyproject.toml`.

| Tabla en el esquema `workforce` | Contenido |
|---|---|
| `capture` | Fecha local, instante, versión de protocolo e identidad de la captura |
| `platform_capture` | Cobertura, consultas, conteos, filtros y páginas revisadas |
| `listing` | Identidad de anuncio por plataforma |
| `observation` | Datos del anuncio, evidencia, estado y vínculo entre plataformas por captura |
| `historical_source` | Valores de 2025 con alcance, fuente, cobertura y comparabilidad |
| `weekly_report` | Informe conservado en el primer cierre procesado de cada periodo |

El inicio incorpora la prueba de acceso del 25 de noviembre ya presente en el proyecto. Sus
cuatro fichas conservan el estado `no_verificable` y ninguna de las cinco plataformas obtuvo
cobertura completa en esa prueba. También incorpora el informe anual de OCC de 2025 como
contexto nacional.

En una base recién inicializada, `/api/health` debe informar al menos una captura guardada
en `runs`. Si el arranque falla, consulte `docker compose logs --tail=100 dashboard postgres`.

## Entrega de las tareas

| Tarea | Hora de Ciudad de México | Periodo |
|---|---|---|
| Capturar vacantes de plataformas | Alrededor de las 18:00 | Diario del 25 de noviembre al 20 de diciembre |
| Consolidar cortes de vacantes | Alrededor de las 21:00 | 1, 8, 15 y 20 de diciembre |

La tarea diaria produce un JSON con `run_id`, `date`, `observed_at`,
`methodology_version`, `coverage` y `records`. Se registra una cobertura por plataforma,
incluidas las consultas parciales o bloqueadas. Las tareas que tienen acceso a esta copia
del repositorio entregan los archivos desde la raíz:

```sh
python3 -m src.workforce stage run /ruta/a/captura.json
python3 -m src.workforce stage historical /ruta/a/fuente-2025.json
```

Para pedir el cierre de un periodo, la tarea semanal ejecuta el siguiente comando con la
fecha del corte correspondiente:

```sh
python3 -m src.workforce weekly 2026-12-01
```

Estos comandos requieren Python 3.10 o posterior. Escriben la entrega en `data/inbox` y
muestran la ruta del acuse esperado. El panel consume la cola automáticamente mientras
Docker está en ejecución y confirma el resultado en `data/receipts`. Las capturas y fuentes
se procesan antes de los informes semanales. El acuse de una captura incluye el conteo
guardado y los indicadores que usa el panel. El navegador consulta el panel cada minuto
mientras la pestaña está visible.

Si una tarea entrega su JSON en el resultado por falta de acceso al proyecto, puede
incorporarse desde **Registro de vacantes** o **Comparativa histórica**. Las dos vistas
aceptan los mismos contratos que la línea de comandos. Los reintentos de un mismo
`run_id` con el mismo archivo son idempotentes. Si un acuse indica rechazo, conserve
la evidencia de la entrega original y use un nuevo identificador para el contenido corregido.

## Medición y simulación

Los cortes son 25 nov–1 dic, 2–8 dic, 9–15 dic y 16–20 dic. Una captura registra
lo observado en esa fecha. Una publicación original se atribuye a su propia fecha
documentada, incluso si la evidencia se obtiene en una revalidación posterior.
Una vacante activa requiere evidencia contemporánea de postulación. La vista histórica
incluye las revalidaciones diarias y el informe semanal conserva los datos disponibles
al momento de su generación.

El promedio semanal requiere que todos los días transcurridos del rango seleccionado
tengan cobertura completa en las plataformas seleccionadas y que las primeras publicaciones
estén resueltas. Los días faltantes, la cobertura y el denominador quedan visibles.
El simulador permite cargar un promedio observado válido o introducir valores hipotéticos.

La comparación 2025/2026 exige el mismo periodo, plataforma, mercado, especialidad,
métrica, unidad y cobertura integral, con respaldo de una fuente verificable. Publicar
un total anual en la tabla de fuentes solo aporta contexto.

## Validación local

```sh
python3 -m unittest discover -s tests -v
docker compose config --quiet
```
