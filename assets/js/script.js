const SNAPSHOT_STATE = {
        "runs": [{
            "run_id": "2026-11-25-acceso-inicial",
            "date": "2026-11-25",
            "observed_at": "2026-11-25T17:26:35.047529+00:00",
            "methodology_version": "1.0.0",
            "coverage": [{
                "platform": "Indeed",
                "status": "parcial",
                "reason": "Muestra de ficha almacenada; universo sin paginar",
                "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
                "filters": {
                    "geography": "México o elegibilidad explícita",
                    "seniority": "Todos",
                    "date_filter": "Sin filtro; prueba inicial de acceso"
                },
                "pages_reviewed": ["Listado o ficha de muestra"],
                "reported_count": null,
                "extracted_count": 1,
                "source_urls": ["https://mx.indeed.com/viewjob?jk=509e2c87d9fc71de"]
            }, {
                "platform": "OCC",
                "status": "bloqueada",
                "reason": "Consulta directa bloqueada: HTTP 403",
                "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
                "filters": {
                    "geography": "México o elegibilidad explícita",
                    "seniority": "Todos",
                    "date_filter": "Sin filtro; prueba inicial de acceso"
                },
                "pages_reviewed": [],
                "reported_count": null,
                "extracted_count": 0,
                "source_urls": ["https://www.occ.com.mx/empleos/de-ingeniero-de-datos/"]
            }, {
                "platform": "Get on Board",
                "status": "parcial",
                "reason": "Listado recuperado; ficha 403; sin cobertura de todo el protocolo",
                "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
                "filters": {
                    "geography": "México o elegibilidad explícita",
                    "seniority": "Todos",
                    "date_filter": "Sin filtro; prueba inicial de acceso"
                },
                "pages_reviewed": ["Listado o ficha de muestra"],
                "reported_count": null,
                "extracted_count": 1,
                "source_urls": ["https://www.getonbrd.com.mx/empleos-data-platforms"]
            }, {
                "platform": "Wellfound",
                "status": "parcial",
                "reason": "Muestra de ficha almacenada; sin paginar",
                "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
                "filters": {
                    "geography": "México o elegibilidad explícita",
                    "seniority": "Todos",
                    "date_filter": "Sin filtro; prueba inicial de acceso"
                },
                "pages_reviewed": ["Listado o ficha de muestra"],
                "reported_count": null,
                "extracted_count": 1,
                "source_urls": ["https://wellfound.com/location/mexico"]
            }, {
                "platform": "LinkedIn",
                "status": "parcial",
                "reason": "Resultado indexado; ficha bloqueada (DisabledError)",
                "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
                "filters": {
                    "geography": "México o elegibilidad explícita",
                    "seniority": "Todos",
                    "date_filter": "Sin filtro; prueba inicial de acceso"
                },
                "pages_reviewed": ["Listado o ficha de muestra"],
                "reported_count": null,
                "extracted_count": 1,
                "source_urls": ["https://mx.linkedin.com/jobs/ingeniero-de-datos-empleos"]
            }],
            "records": [{
                "seniority": "No informado",
                "seniority_basis": "No informado por la fuente recuperada",
                "first_published": null,
                "publication_raw": "No expuesta en la ficha recuperada",
                "publication_precision": "desconocida",
                "status": "no_verificable",
                "canonical_id": null,
                "dedup_evidence": null,
                "event": "primera_observacion",
                "source_cached_at": "Rastreo reportado: hace 2 días",
                "platform": "Indeed",
                "platform_id": "509e2c87d9fc71de",
                "company": "OODOO",
                "title": "Data Engineer (Azure / Databricks)",
                "family": "Ingeniería de Datos",
                "location": "Ciudad de México, CDMX",
                "market": "México",
                "modality": "Remoto",
                "technologies": ["Azure", "Databricks", "Python", "SQL", "PySpark"],
                "url": "https://mx.indeed.com/viewjob?jk=509e2c87d9fc71de",
                "evidence_url": "https://mx.indeed.com/viewjob?jk=509e2c87d9fc71de",
                "evidence": "Ficha recuperada con descripción y enlace de postulación. El servicio indica rastreo hace 2 días; no se verificó disponibilidad en tiempo real. Se conserva como indicio por revalidar."
            }, {
                "seniority": "No informado",
                "seniority_basis": "No informado por la fuente recuperada",
                "first_published": null,
                "publication_raw": "Hace 11 horas (resultado de búsqueda)",
                "publication_precision": "relativa",
                "status": "no_verificable",
                "canonical_id": null,
                "dedup_evidence": null,
                "event": "primera_observacion",
                "source_cached_at": "Índice de búsqueda: rastreo reportado hoy",
                "platform": "LinkedIn",
                "platform_id": "4494389439",
                "company": "Capgemini",
                "title": "Data Engineer",
                "family": "Ingeniería de Datos",
                "location": "CDMX o Estado de México",
                "market": "México",
                "modality": "Híbrido",
                "technologies": ["GCP", "PostgreSQL", "AlloyDB", "SQL", "Cloud Data Fusion"],
                "url": "https://mx.linkedin.com/jobs/view/data-engineer-at-capgemini-4494389439",
                "evidence_url": "https://mx.linkedin.com/jobs/view/data-engineer-at-capgemini-4494389439",
                "evidence": "Resultado indexado recuperado. La apertura de la ficha fue bloqueada por el servicio (DisabledError). El resultado indexado no confirma la vigencia."
            }, {
                "seniority": "No informado",
                "seniority_basis": "No informado por la fuente recuperada",
                "first_published": null,
                "publication_raw": "nov 11 (año no mostrado en el listado recuperado)",
                "publication_precision": "desconocida",
                "status": "no_verificable",
                "canonical_id": null,
                "dedup_evidence": null,
                "event": "primera_observacion",
                "source_cached_at": "Listado: rastreo reportado hace 6 días",
                "platform": "Get on Board",
                "platform_id": "data-engineer-rankmi-ciudad-de-mexico-santiago-lima",
                "company": "Rankmi",
                "title": "Data Engineer",
                "family": "Ingeniería de Datos",
                "location": "Ciudad de México / Santiago / Lima",
                "market": "México",
                "modality": "Híbrido",
                "technologies": [],
                "url": "https://www.getonbrd.com/jobs/data-science-analytics/data-engineer-rankmi-ciudad-de-mexico-santiago-lima",
                "evidence_url": "https://www.getonbrd.com.mx/empleos-data-platforms",
                "evidence": "Listado público recuperado; la ficha individual respondió 403. No se comprobó postulación vigente ni primera fecha original. La posición puede existir antes del inicio del panel."
            }, {
                "seniority": "Manager",
                "seniority_basis": "Explícito en el título; no se verificó nivel estandarizado",
                "first_published": null,
                "publication_raw": "Posted: 3 days ago (ficha almacenada)",
                "publication_precision": "relativa",
                "status": "no_verificable",
                "canonical_id": null,
                "dedup_evidence": null,
                "event": "primera_observacion",
                "source_cached_at": "Rastreo reportado: hace 5 días",
                "platform": "Wellfound",
                "platform_id": "5086265",
                "company": "LawnStarter",
                "title": "Analytics Engineering Manager, Data Platform & Governance",
                "family": "Estrategia y Liderazgo",
                "location": "Bogotá / Mexico City; remoto México elegible",
                "market": "Internacional elegible",
                "modality": "Remoto",
                "technologies": ["Redshift", "dbt", "Airflow", "Segment", "Lightdash"],
                "url": "https://wellfound.com/jobs/5086265-analytics-engineering-manager-data-platform-governance",
                "evidence_url": "https://wellfound.com/jobs/5086265-analytics-engineering-manager-data-platform-governance",
                "evidence": "Ficha almacenada con botón de postulación y México entre países elegibles. El rastreo reporta 5 días de antigüedad y la fecha relativa difiere del listado. Requiere revalidación actual."
            }]
        }], "historical": [], "reviews": []
    };
    const originalFetch = window.fetch.bind(window);
    window.fetch = async function (path, opts = {}) {
        if (path === '/api/state') return new Response(JSON.stringify(SNAPSHOT_STATE), {headers: {'content-type': 'application/json'}});
        if (path === '/api/protocol') return new Response("{\n  \"version\":\"1.0.0\",\n  \"window\":{\"start\":\"2026-11-25\",\"end\":\"2026-12-20\",\"timezone\":\"America/Mexico_City\"},\n  \"platforms\":[\"Indeed\",\"OCC\",\"Get on Board\",\"Wellfound\",\"LinkedIn\"],\n  \"families\":{\n    \"Ingeniería de Datos\":[\"Data Engineer\",\"Senior Data Engineer\",\"Ingeniero de Datos\",\"Data Platform Engineer\",\"Ingeniero de Plataforma de Datos\"],\n    \"Arquitectura de Datos\":[\"Data Architect\",\"Arquitecto de Datos\",\"Lakehouse Architect\"],\n    \"Analytics Engineering\":[\"Analytics Engineer\",\"Ingeniero de Analítica\"],\n    \"BI y Analítica\":[\"Senior Data Analyst\",\"Analista de Datos Senior\",\"Business Intelligence\",\"BI Lead\",\"BI Developer\",\"Advanced Analytics\",\"Analítica Avanzada\",\"Business Analytics\"],\n    \"Estrategia y Liderazgo\":[\"Analytics Manager\",\"Data & Analytics Manager\",\"Data Strategy Consultant\",\"Data Consultant\",\"Gerente de Analítica\",\"Consultor de Datos\"]\n  },\n  \"rules\":[\n    \"Mismos términos y filtros lógicos en las cinco plataformas; documentar toda limitación de filtros o paginación. Conservar todas las consultas, incluidas las que no produzcan registros.\",\n    \"Sin filtro de seniority: capturar todos los niveles y guardar el nivel publicado; si se deriva de experiencia y responsabilidades, marcarlo como inferido con justificación. No confundir título senior con clasificación de la plataforma.\",\n    \"Mercado México: puesto localizado explícitamente en México. Internacional elegible: empresa exterior y admisión explícita de residentes en México. LATAM genérico sin elegibilidad explícita queda pendiente y fuera del inventario elegible.\",\n    \"Consulta inicial: inventario visible de cualquier antigüedad. En consultas posteriores: buscar últimos 7 días cuando el filtro exista, cubrir días transcurridos desde el último corte válido y revalidar todas las fichas previas. No restringir la revalidación por antigüedad.\",\n    \"Fecha de publicación original solo cuando esté documentada; conservar texto relativo y precisión sin convertirlo en fecha exacta. Primera observación es una variable distinta.\",\n    \"Activa exige ficha original y mecanismo de postulación vigente o confirmación directa, comprobados en esta captura. Un snippet, resultado indexado, ficha cacheada o etiqueta corporativa de contratación no confirma estado actual.\",\n    \"Cerrar solo con evidencia explícita de cierre; desaparición, 403, login o error se registran no_verificable. No inferir contratación efectiva.\",\n    \"Deduplicación en plataforma por ID o URL canónica; entre plataformas solo por requisición corporativa o equivalencia documentada. Si es sospecha, mantener separada y pendiente. No fusionar solo por empresa y título.\",\n    \"Nueva observación no equivale a nueva apertura. Republicación no equivale a demanda adicional. Conservar historial inmutable, consultas, evidencia y conteos reportados frente a extraídos.\",\n    \"Captura completa requiere ejecutar todos los términos y revisar toda paginación accesible; documentar páginas, filtros y barreras. Captura parcial o bloqueada nunca se rellena con cero.\",\n    \"Cortes: 25 nov–1 dic, 2–8 dic, 9–15 dic y 16–20 dic. El último corte tiene cinco días. Promedio observado = nuevas publicaciones únicas documentadas / días con cobertura válida, mostrando denominador; sin cobertura equivalente no reportar promedio comparable.\",\n    \"Histórico 2025 solo fuente pública primaria, reporte de plataforma o registro propio verificable. Guardar periodo, país, familia, definición, unidad, fuente, fecha de recuperación y cobertura. Un agregado semestral no es una serie diaria ni una base comparable por especialidad.\",\n    \"No calcular p-valores, intervalos, IDLT ni causalidad sin observaciones y supuestos suficientes. Simulación aritmética separada del registro observado. No reconstruir datos faltantes.\"\n  ],\n  \"record_fields\":[\"platform\",\"platform_id\",\"company\",\"title\",\"family\",\"seniority\",\"seniority_basis\",\"location\",\"market\",\"modality\",\"technologies\",\"url\",\"first_published\",\"publication_raw\",\"publication_precision\",\"status\",\"evidence\",\"evidence_url\",\"source_cached_at\",\"canonical_id\",\"dedup_evidence\",\"event\"],\n  \"run_fields\":[\"run_id\",\"date\",\"observed_at\",\"methodology_version\",\"coverage\",\"records\"],\n  \"coverage_fields\":[\"platform\",\"status\",\"reason\",\"queries\",\"filters\",\"pages_reviewed\",\"reported_count\",\"extracted_count\",\"source_urls\"],\n  \"status_values\":[\"activa\",\"cerrada\",\"no_verificable\"],\n  \"event_values\":[\"primera_observacion\",\"conocida\",\"nueva_confirmada\",\"republicacion_confirmada\",\"posible_republicacion\"],\n  \"historical_fields\":[\"id\",\"platform\",\"period_start\",\"period_end\",\"geography\",\"family\",\"metric\",\"unit\",\"value\",\"source_url\",\"source_title\",\"retrieved_at\",\"methodology\",\"comparability\",\"limitation\"]\n}\n", {headers: {'content-type': 'application/json'}});
        if (path === '/analytics.py') return new Response("\"\"\"Analytics shared by local Python and browser Pyodide. No inferred time series.\"\"\"\nimport json\nfrom collections import Counter\nfrom html import escape\nfrom datetime import date, timedelta\n\nPLATFORMS = ['Indeed', 'OCC', 'Get on Board', 'Wellfound', 'LinkedIn']\n\ndef bar_svg(items, title):\n    items = list(items)\n    h = max(160, len(items) * 48 + 25)\n    top = max([v for _, v in items] + [1])\n    rows = []\n    for i, (label, value) in enumerate(items):\n        y = 12 + i * 48\n        rows.append(f'\u003ctext x=\"0\" y=\"{y+14}\" fill=\"#53635f\" font-size=\"12\">{escape(str(label))}\u003c/text>\u003crect x=\"158\" y=\"{y}\" width=\"{max(1,value/top*250)}\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"{y+16}\" fill=\"#173d36\" font-size=\"13\">{value}\u003c/text>')\n    return f'\u003csvg viewBox=\"0 0 460 {h}\" role=\"img\" aria-label=\"{escape(title)}\" xmlns=\"http://www.w3.org/2000/svg\">'+''.join(rows)+'\u003c/svg>'\n\ndef analyze(payload):\n    p = json.loads(payload) if isinstance(payload, str) else payload\n    runs = sorted(p['runs'], key=lambda r:r['observed_at'])\n    f = p.get('filters', {})\n    latest, first = {}, {}\n    for run in runs:\n        for r in run['records']:\n            key = (r['platform'], r['platform_id'])\n            first[key] = min(first.get(key, run['date']), run['date'])\n            latest[key] = dict(r, observed_at=run['observed_at'], observation_date=run['date'], first_observed=first[key])\n    # Latest observation, never carry a previous active status into an unobserved date.\n    rows = [r for r in latest.values() if all(not f.get(k) or r.get(k)==v for k,v in f.items() if k not in ['from','to']) and (not f.get('from') or r['observation_date']>=f['from']) and (not f.get('to') or r['observation_date']\u003c=f['to'])]\n    selected_runs = [r for r in runs if (not f.get('from') or r['date']>=f['from']) and (not f.get('to') or r['date']\u003c=f['to'])]\n    last_day = max((r['date'] for r in selected_runs),default=None)\n    active = [r for r in rows if r['status']=='activa' and r['observation_date']==last_day]\n    groups = {r.get('canonical_id') or r['platform']+':'+r['platform_id'] for r in rows}\n    confirmed_active = {r.get('canonical_id') or r['platform']+':'+r['platform_id'] for r in active}\n    platforms = [f['platform']] if f.get('platform') else PLATFORMS\n    coverage = []\n    for plat in platforms:\n        matches = [dict(c, date=r['date'],observed_at=r['observed_at']) for r in selected_runs for c in r['coverage'] if c['platform']==plat]\n        coverage.append(matches[-1] if matches else {'platform':plat,'status':'pendiente','date':None,'reason':'Sin captura en el rango'})\n    complete = sum(c['status']=='completa' for c in coverage)\n    # A publication date must have primary-source evidence; first observation alone is insufficient.\n    new_records = {r.get('canonical_id') or r['platform']+':'+r['platform_id'] for run in selected_runs for r in run['records'] if r.get('first_published') and r.get('publication_precision')=='exacta' and '2026-11-25'\u003c=r['first_published']\u003c=run['date'] and r['event']=='nueva_confirmada' and (not f.get('platform') or r['platform']==f['platform']) and (not f.get('family') or r['family']==f['family']) and (not f.get('market') or r['market']==f['market']) and (not f.get('seniority') or r['seniority']==f['seniority']) and (not f.get('modality') or r['modality']==f['modality']) and (not f.get('status') or r['status']==f['status']) and (not f.get('from') or r['first_published']>=f['from']) and (not f.get('to') or r['first_published']\u003c=f['to'])}\n    weekly = []\n    start = date(2026,11,25)\n    for i in range(4):\n        a = start + timedelta(days=7*i); b = min(a+timedelta(days=6),date(2026,12,20))\n        rr = [r for r in selected_runs if a.isoformat()\u003c=r['date']\u003c=b.isoformat()]\n        days = {r['date'] for r in rr if all(any(c['platform']==plat and c['status']=='completa' for c in r['coverage']) for plat in platforms)}\n        evidence = {r.get('canonical_id') or r['platform']+':'+r['platform_id'] for run in rr for r in run['records'] if r['event']=='nueva_confirmada' and r.get('first_published') and r['publication_precision']=='exacta' and a.isoformat()\u003c=r['first_published']\u003c=b.isoformat() and all(not f.get(k) or r.get(k)==v for k,v in f.items() if k not in ['from','to'])}\n        as_of = min(date.fromisoformat(p.get('as_of',date.today().isoformat())),date.fromisoformat(f.get('to') or '2026-12-20'))\n        elapsed = max(0,min((as_of-a).days+1,(b-a).days+1))\n        unknown_new = any(r['event']=='primera_observacion' and not r.get('first_published') for run in rr for r in run['records'] if not f.get('platform') or r['platform']==f['platform'])\n        daily = len(evidence)/len(days) if days and len(days)==elapsed and not unknown_new else None\n        weekly.append({'start':a.isoformat(),'end':b.isoformat(),'captures':len(rr),'valid_days':len(days),'elapsed_days':elapsed,'new':len(evidence) if days else None,'daily_mean':daily})\n    series = Counter(r['observation_date'] for r in rows)\n    return {'rows':rows,'coverage':coverage,'weekly':weekly,'metrics':{'observed':len(rows),'groups':len(groups),'active':len(confirmed_active) if any(r['observation_date']==last_day and r['status'] in ['activa','cerrada'] for r in rows) else None,'new':len(new_records) if complete==len(platforms) and not any(r['event']=='primera_observacion' and not r.get('first_published') for r in rows) else None,'coverage_complete':complete,'coverage_total':len(platforms),'last_day':last_day,'reposts':sum(r['event']=='republicacion_confirmada' for r in rows),'dedup_pending':sum(not r.get('canonical_id') for r in rows)},'charts':{'platform':bar_svg([(x,sum(r['platform']==x for r in rows)) for x in platforms],'Anuncios observados por plataforma'),'family':bar_svg(Counter(r['family'] for r in rows).most_common(),'Composición por especialidad'),'series':bar_svg(sorted(series.items()),'Última observación por fecha')}}\n");
        if (String(path).startsWith('/api/')) return new Response(JSON.stringify({error: 'Esta es una instantánea descargada. Incorpore datos en la aplicación Python o en la siguiente captura programada.'}), {status: 400});
        return originalFetch(path, opts);
    };

    window.__initialAnalysis = {
        "rows": [{
            "seniority": "No informado",
            "seniority_basis": "No informado por la fuente recuperada",
            "first_published": null,
            "publication_raw": "No expuesta en la ficha recuperada",
            "publication_precision": "desconocida",
            "status": "no_verificable",
            "canonical_id": null,
            "dedup_evidence": null,
            "event": "primera_observacion",
            "source_cached_at": "Rastreo reportado: hace 2 días",
            "platform": "Indeed",
            "platform_id": "509e2c87d9fc71de",
            "company": "OODOO",
            "title": "Data Engineer (Azure / Databricks)",
            "family": "Ingeniería de Datos",
            "location": "Ciudad de México, CDMX",
            "market": "México",
            "modality": "Remoto",
            "technologies": ["Azure", "Databricks", "Python", "SQL", "PySpark"],
            "url": "https://mx.indeed.com/viewjob?jk=509e2c87d9fc71de",
            "evidence_url": "https://mx.indeed.com/viewjob?jk=509e2c87d9fc71de",
            "evidence": "Ficha recuperada con descripción y enlace de postulación. El servicio indica rastreo hace 2 días; no se verificó disponibilidad en tiempo real. Se conserva como indicio por revalidar.",
            "observed_at": "2026-11-25T17:26:35.047529+00:00",
            "observation_date": "2026-11-25",
            "first_observed": "2026-11-25"
        }, {
            "seniority": "No informado",
            "seniority_basis": "No informado por la fuente recuperada",
            "first_published": null,
            "publication_raw": "Hace 11 horas (resultado de búsqueda)",
            "publication_precision": "relativa",
            "status": "no_verificable",
            "canonical_id": null,
            "dedup_evidence": null,
            "event": "primera_observacion",
            "source_cached_at": "Índice de búsqueda: rastreo reportado hoy",
            "platform": "LinkedIn",
            "platform_id": "4494389439",
            "company": "Capgemini",
            "title": "Data Engineer",
            "family": "Ingeniería de Datos",
            "location": "CDMX o Estado de México",
            "market": "México",
            "modality": "Híbrido",
            "technologies": ["GCP", "PostgreSQL", "AlloyDB", "SQL", "Cloud Data Fusion"],
            "url": "https://mx.linkedin.com/jobs/view/data-engineer-at-capgemini-4494389439",
            "evidence_url": "https://mx.linkedin.com/jobs/view/data-engineer-at-capgemini-4494389439",
            "evidence": "Resultado indexado recuperado. La apertura de la ficha fue bloqueada por el servicio (DisabledError). El resultado indexado no confirma la vigencia.",
            "observed_at": "2026-11-25T17:26:35.047529+00:00",
            "observation_date": "2026-11-25",
            "first_observed": "2026-11-25"
        }, {
            "seniority": "No informado",
            "seniority_basis": "No informado por la fuente recuperada",
            "first_published": null,
            "publication_raw": "nov 11 (año no mostrado en el listado recuperado)",
            "publication_precision": "desconocida",
            "status": "no_verificable",
            "canonical_id": null,
            "dedup_evidence": null,
            "event": "primera_observacion",
            "source_cached_at": "Listado: rastreo reportado hace 6 días",
            "platform": "Get on Board",
            "platform_id": "data-engineer-rankmi-ciudad-de-mexico-santiago-lima",
            "company": "Rankmi",
            "title": "Data Engineer",
            "family": "Ingeniería de Datos",
            "location": "Ciudad de México / Santiago / Lima",
            "market": "México",
            "modality": "Híbrido",
            "technologies": [],
            "url": "https://www.getonbrd.com/jobs/data-science-analytics/data-engineer-rankmi-ciudad-de-mexico-santiago-lima",
            "evidence_url": "https://www.getonbrd.com.mx/empleos-data-platforms",
            "evidence": "Listado público recuperado; la ficha individual respondió 403. No se comprobó postulación vigente ni primera fecha original. La posición puede existir antes del inicio del panel.",
            "observed_at": "2026-11-25T17:26:35.047529+00:00",
            "observation_date": "2026-11-25",
            "first_observed": "2026-11-25"
        }, {
            "seniority": "Manager",
            "seniority_basis": "Explícito en el título; no se verificó nivel estandarizado",
            "first_published": null,
            "publication_raw": "Posted: 3 days ago (ficha almacenada)",
            "publication_precision": "relativa",
            "status": "no_verificable",
            "canonical_id": null,
            "dedup_evidence": null,
            "event": "primera_observacion",
            "source_cached_at": "Rastreo reportado: hace 5 días",
            "platform": "Wellfound",
            "platform_id": "5086265",
            "company": "LawnStarter",
            "title": "Analytics Engineering Manager, Data Platform & Governance",
            "family": "Estrategia y Liderazgo",
            "location": "Bogotá / Mexico City; remoto México elegible",
            "market": "Internacional elegible",
            "modality": "Remoto",
            "technologies": ["Redshift", "dbt", "Airflow", "Segment", "Lightdash"],
            "url": "https://wellfound.com/jobs/5086265-analytics-engineering-manager-data-platform-governance",
            "evidence_url": "https://wellfound.com/jobs/5086265-analytics-engineering-manager-data-platform-governance",
            "evidence": "Ficha almacenada con botón de postulación y México entre países elegibles. El rastreo reporta 5 días de antigüedad y la fecha relativa difiere del listado. Requiere revalidación actual.",
            "observed_at": "2026-11-25T17:26:35.047529+00:00",
            "observation_date": "2026-11-25",
            "first_observed": "2026-11-25"
        }],
        "coverage": [{
            "platform": "Indeed",
            "status": "parcial",
            "reason": "Muestra de ficha almacenada; universo sin paginar",
            "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
            "filters": {
                "geography": "México o elegibilidad explícita",
                "seniority": "Todos",
                "date_filter": "Sin filtro; prueba inicial de acceso"
            },
            "pages_reviewed": ["Listado o ficha de muestra"],
            "reported_count": null,
            "extracted_count": 1,
            "source_urls": ["https://mx.indeed.com/viewjob?jk=509e2c87d9fc71de"],
            "date": "2026-11-25",
            "observed_at": "2026-11-25T17:26:35.047529+00:00"
        }, {
            "platform": "OCC",
            "status": "bloqueada",
            "reason": "Consulta directa bloqueada: HTTP 403",
            "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
            "filters": {
                "geography": "México o elegibilidad explícita",
                "seniority": "Todos",
                "date_filter": "Sin filtro; prueba inicial de acceso"
            },
            "pages_reviewed": [],
            "reported_count": null,
            "extracted_count": 0,
            "source_urls": ["https://www.occ.com.mx/empleos/de-ingeniero-de-datos/"],
            "date": "2026-11-25",
            "observed_at": "2026-11-25T17:26:35.047529+00:00"
        }, {
            "platform": "Get on Board",
            "status": "parcial",
            "reason": "Listado recuperado; ficha 403; sin cobertura de todo el protocolo",
            "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
            "filters": {
                "geography": "México o elegibilidad explícita",
                "seniority": "Todos",
                "date_filter": "Sin filtro; prueba inicial de acceso"
            },
            "pages_reviewed": ["Listado o ficha de muestra"],
            "reported_count": null,
            "extracted_count": 1,
            "source_urls": ["https://www.getonbrd.com.mx/empleos-data-platforms"],
            "date": "2026-11-25",
            "observed_at": "2026-11-25T17:26:35.047529+00:00"
        }, {
            "platform": "Wellfound",
            "status": "parcial",
            "reason": "Muestra de ficha almacenada; sin paginar",
            "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
            "filters": {
                "geography": "México o elegibilidad explícita",
                "seniority": "Todos",
                "date_filter": "Sin filtro; prueba inicial de acceso"
            },
            "pages_reviewed": ["Listado o ficha de muestra"],
            "reported_count": null,
            "extracted_count": 1,
            "source_urls": ["https://wellfound.com/location/mexico"],
            "date": "2026-11-25",
            "observed_at": "2026-11-25T17:26:35.047529+00:00"
        }, {
            "platform": "LinkedIn",
            "status": "parcial",
            "reason": "Resultado indexado; ficha bloqueada (DisabledError)",
            "queries": ["Data Engineer / Ingeniero de Datos; prueba inicial de acceso"],
            "filters": {
                "geography": "México o elegibilidad explícita",
                "seniority": "Todos",
                "date_filter": "Sin filtro; prueba inicial de acceso"
            },
            "pages_reviewed": ["Listado o ficha de muestra"],
            "reported_count": null,
            "extracted_count": 1,
            "source_urls": ["https://mx.linkedin.com/jobs/ingeniero-de-datos-empleos"],
            "date": "2026-11-25",
            "observed_at": "2026-11-25T17:26:35.047529+00:00"
        }],
        "weekly": [{
            "start": "2026-11-25",
            "end": "2026-12-01",
            "captures": 1,
            "valid_days": 0,
            "elapsed_days": 1,
            "new": null,
            "daily_mean": null
        }, {
            "start": "2026-12-02",
            "end": "2026-12-08",
            "captures": 0,
            "valid_days": 0,
            "elapsed_days": 0,
            "new": null,
            "daily_mean": null
        }, {
            "start": "2026-12-09",
            "end": "2026-12-15",
            "captures": 0,
            "valid_days": 0,
            "elapsed_days": 0,
            "new": null,
            "daily_mean": null
        }, {
            "start": "2026-12-16",
            "end": "2026-12-20",
            "captures": 0,
            "valid_days": 0,
            "elapsed_days": 0,
            "new": null,
            "daily_mean": null
        }],
        "metrics": {
            "observed": 4,
            "groups": 4,
            "active": null,
            "new": null,
            "coverage_complete": 0,
            "coverage_total": 5,
            "last_day": "2026-11-25",
            "reposts": 0,
            "dedup_pending": 4
        },
        "charts": {
            "platform": "\u003csvg viewBox=\"0 0 460 265\" role=\"img\" aria-label=\"Anuncios observados por plataforma\" xmlns=\"http://www.w3.org/2000/svg\">\u003ctext x=\"0\" y=\"26\" fill=\"#53635f\" font-size=\"12\">Indeed\u003c/text>\u003crect x=\"158\" y=\"12\" width=\"250.0\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"28\" fill=\"#173d36\" font-size=\"13\">1\u003c/text>\u003ctext x=\"0\" y=\"74\" fill=\"#53635f\" font-size=\"12\">OCC\u003c/text>\u003crect x=\"158\" y=\"60\" width=\"1\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"76\" fill=\"#173d36\" font-size=\"13\">0\u003c/text>\u003ctext x=\"0\" y=\"122\" fill=\"#53635f\" font-size=\"12\">Get on Board\u003c/text>\u003crect x=\"158\" y=\"108\" width=\"250.0\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"124\" fill=\"#173d36\" font-size=\"13\">1\u003c/text>\u003ctext x=\"0\" y=\"170\" fill=\"#53635f\" font-size=\"12\">Wellfound\u003c/text>\u003crect x=\"158\" y=\"156\" width=\"250.0\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"172\" fill=\"#173d36\" font-size=\"13\">1\u003c/text>\u003ctext x=\"0\" y=\"218\" fill=\"#53635f\" font-size=\"12\">LinkedIn\u003c/text>\u003crect x=\"158\" y=\"204\" width=\"250.0\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"220\" fill=\"#173d36\" font-size=\"13\">1\u003c/text>\u003c/svg>",
            "family": "\u003csvg viewBox=\"0 0 460 160\" role=\"img\" aria-label=\"Composición por especialidad\" xmlns=\"http://www.w3.org/2000/svg\">\u003ctext x=\"0\" y=\"26\" fill=\"#53635f\" font-size=\"12\">Ingeniería de Datos\u003c/text>\u003crect x=\"158\" y=\"12\" width=\"250.0\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"28\" fill=\"#173d36\" font-size=\"13\">3\u003c/text>\u003ctext x=\"0\" y=\"74\" fill=\"#53635f\" font-size=\"12\">Estrategia y Liderazgo\u003c/text>\u003crect x=\"158\" y=\"60\" width=\"83.33333333333333\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"76\" fill=\"#173d36\" font-size=\"13\">1\u003c/text>\u003c/svg>",
            "series": "\u003csvg viewBox=\"0 0 460 160\" role=\"img\" aria-label=\"Última observación por fecha\" xmlns=\"http://www.w3.org/2000/svg\">\u003ctext x=\"0\" y=\"26\" fill=\"#53635f\" font-size=\"12\">2026-11-25\u003c/text>\u003crect x=\"158\" y=\"12\" width=\"250.0\" height=\"23\" rx=\"4\" fill=\"#0b9eb8\"/>\u003ctext x=\"425\" y=\"28\" fill=\"#173d36\" font-size=\"13\">4\u003c/text>\u003c/svg>"
        }
    };
    let state = {runs: [], historical: [], reviews: []}, analysis = null, python = null, protocol = null;
    const $ = id => document.getElementById(id), esc = s => String(s ?? 'N/D').replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
    const labels = {
        activa: 'Activa verificada',
        cerrada: 'Cerrada',
        no_verificable: 'No verificable',
        completa: 'Completa',
        parcial: 'Parcial',
        bloqueada: 'Bloqueada',
        pendiente: 'Pendiente'
    };
    const titles = {
        overview: 'Mercado laboral de Datos y Analítica',
        records: 'Registro y evidencia de vacantes',
        weekly: 'Cortes semanales de seguimiento',
        history: 'Comparativa histórica · 2025 / 2026',
        simulator: 'Simulador de publicaciones',
        method: 'Metodología y calidad del dato'
    };

    function navigate(view) {
        document.querySelectorAll('.view').forEach(x => x.classList.toggle('active', x.id === view));
        document.querySelectorAll('.nav').forEach(x => x.classList.toggle('active', x.dataset.view === view));
        $('pagetitle').textContent = titles[view];
        $('filters').style.display = ['overview', 'records', 'weekly'].includes(view) ? 'flex' : 'none';
    }

    document.querySelectorAll('.nav').forEach(b => b.onclick = () => navigate(b.dataset.view));

    function filters() {
        return Object.fromEntries(['platform', 'family', 'market', 'seniority', 'modality', 'from', 'to', 'status'].map(k => [k, $(k).value]));
    }

    async function get(path) {
        const r = await fetch(path);
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'No se pudo leer');
        return data;
    }

    async function setupPython() {
        if (!window.loadPyodide) throw Error('Vista inicial calculada en Python. Para recalcular filtros, permita la conexión al motor Python o use la aplicación local.');
        python = await loadPyodide();
        await python.runPythonAsync(await (await fetch('/analytics.py')).text());
    }

    function table(rows) {
        return '<article class="card tablecard"><div class="tablehead sectionhead"><div><h2 class="smalltitle">Registro de observaciones</h2><p class="caption">' + rows.length + ' anuncios · última evidencia disponible para el rango</p></div><span class="tag gray">Trazable</span></div><div class="tablewrap"><table><thead><tr><th>Empresa / puesto</th><th>Plataforma</th><th>Ubicación / modalidad</th><th>Seniority</th><th>Publicación original</th><th>Estado</th><th>Evidencia</th></tr></thead><tbody>' + (rows.length ? rows.map(r => '<tr><td><b>' + esc(r.title) + '</b><small>' + esc(r.company) + '</small></td><td>' + esc(r.platform) + '</td><td>' + esc(r.location) + '<small>' + esc(r.modality) + ' · ' + esc(r.market) + '</small></td><td>' + esc(r.seniority) + '</td><td>' + esc(r.first_published || r.publication_raw) + '<small>' + esc(r.publication_precision) + '</small></td><td><span class="tag ' + (r.status === 'activa' ? '' : 'amber') + '">' + esc(labels[r.status]) + '</span></td><td><button class="rowbutton evidence" data-key="' + esc(r.platform + ':' + r.platform_id) + '">Ver evidencia ↗</button></td></tr>').join('') : '<tr><td colspan="7" class="empty">Sin registros para estos filtros. Esto no demuestra ausencia de vacantes.</td></tr>') + '</tbody></table></div></article>';
    }

    function renderTables() {
        if (!analysis) return;
        const q = $('search').value.toLowerCase(),
                rows = analysis.rows.filter(r => JSON.stringify([r.company, r.title, r.technologies]).toLowerCase().includes(q));
        $('fulltable').innerHTML = table(rows);
        $('previewtable').innerHTML = table(analysis.rows.slice(0, 5));
        document.querySelectorAll('.evidence').forEach(b => b.onclick = () => showDetail(b.dataset.key));
    }

    function showDetail(key) {
        const r = analysis.rows.find(r => r.platform + ':' + r.platform_id === key);
        const fields = {
            Empresa: r.company,
            Puesto: r.title,
            Plataforma: r.platform,
            'ID del anuncio': r.platform_id,
            'Primera observación': r.first_observed,
            'Última observación': r.observed_at,
            'Publicación original': r.first_published,
            'Fecha como aparece': r.publication_raw,
            'Precisión de fecha': r.publication_precision,
            Seniority: r.seniority,
            'Base del seniority': r.seniority_basis,
            Ubicación: r.location,
            Mercado: r.market,
            Modalidad: r.modality,
            Tecnologías: r.technologies.join(', ') || 'No informadas',
            Estado: labels[r.status],
            Evento: r.event,
            Evidencia: r.evidence,
            'Caché de fuente': r.source_cached_at,
            'Grupo de oportunidad': r.canonical_id || 'Pendiente de deduplicación entre plataformas',
            'Justificación de grupo': r.dedup_evidence
        };
        $('detailbody').innerHTML = Object.entries(fields).map(([k, v]) => '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>').join('') + '<dt>Fuente original</dt><dd><a target="_blank" rel="noopener noreferrer" href="' + esc(r.url) + '">Abrir anuncio ↗</a></dd><dt>Fuente de evidencia</dt><dd><a target="_blank" rel="noopener noreferrer" href="' + esc(r.evidence_url) + '">Consultar fuente ↗</a></dd>';
        $('detail').showModal();
    }

    $('closeDetail').onclick = () => $('detail').close();

    async function render() {
        if (!python) return;
        const f = filters();
        if (f.from > f.to) {
            $('loading').textContent = 'La fecha inicial debe preceder a la final.';
            return
        }
        python.globals.set('payload', JSON.stringify({
            ...state,
            filters: f,
            as_of: new Date().toLocaleDateString('en-CA', {timeZone: 'America/Mexico_City'})
        }));
        analysis = JSON.parse(python.runPython('json.dumps(analyze(payload), ensure_ascii=False)'));
        const m = analysis.metrics;
        $('mobserved').textContent = m.observed;
        $('mactive').textContent = m.active ?? 'N/D';
        $('mnew').textContent = m.new ?? 'N/D';
        $('mcoverage').textContent = m.coverage_complete + ' / ' + m.coverage_total;
        for (const [id, key, msg] of [['platformchart', 'platform', 'Sin anuncios observados en el rango.'], ['familychart', 'family', 'La composición aparecerá al registrar anuncios.'], ['serieschart', 'series', 'Sin observaciones. No se interpolan días faltantes.']]) $(id).innerHTML = m.observed ? analysis.charts[key] : '<div class="empty">' + msg + '</div>';
        $('dedupnote').textContent = m.dedup_pending + ' anuncios pendientes de vinculación entre plataformas · ' + m.reposts + ' republicaciones confirmadas.';
        $('coverage').innerHTML = analysis.coverage.map(c => '<div class="covrow"><b>' + esc(c.platform) + '</b><span class="tag ' + (c.status === 'completa' ? '' : 'amber') + '">' + esc(labels[c.status] || c.status) + '</span><div class="reason">' + esc(c.reason) + '<br>' + esc(c.date || 'Sin captura') + '</div></div>').join('');
        $('weeklyrows').innerHTML = analysis.weekly.map(w => '<tr><td>' + esc(w.start) + ' — ' + esc(w.end) + '</td><td>' + w.captures + '</td><td>' + w.valid_days + ' / ' + w.elapsed_days + '</td><td>' + (w.new ?? 'N/D') + '</td><td>' + (w.daily_mean === null ? 'N/D' : w.daily_mean.toFixed(2)) + '</td><td><span class="tag ' + (w.daily_mean === null ? 'amber' : '') + '">' + (w.elapsed_days === 0 ? 'Pendiente' : w.daily_mean === null ? 'Cobertura insuficiente' : 'Periodo observado') + '</span></td></tr>').join('');
        renderTables();
        $('loading').textContent = 'Análisis calculado en Python · los datos faltantes se conservan como N/D.';
    }

    function renderHistory() {
        $('historyrows').innerHTML = state.historical.length ? state.historical.map(h => '<tr><td><a href="' + esc(h.source_url) + '" target="_blank" rel="noopener">' + esc(h.source_title) + '</a><small>' + esc(h.platform) + '</small></td><td>' + esc(h.period_start) + ' / ' + esc(h.period_end) + '</td><td>' + esc(h.geography) + '<small>' + esc(h.family) + '</small></td><td>' + esc(h.metric) + '</td><td>' + esc(h.value) + ' ' + esc(h.unit) + '</td><td><span class="tag amber">' + esc(h.comparability) + '</span><small>' + esc(h.limitation) + '</small></td></tr>').join('') : '<tr><td colspan="6" class="empty">Sin fuentes históricas cargadas. Ninguna cifra de 2025 se ha supuesto.</td></tr>';
        const compatible = state.historical.filter(h => h.comparability === 'comparable');
        $('histcompare').textContent = compatible.length ? compatible.length + ' fuentes declaradas comparables. Se requiere consolidar la serie 2026 equivalente antes de calcular variación e inferencia.' : 'N/D — Falta una base histórica equivalente.';
        $('reviews').className = state.reviews.length ? '' : 'empty';
        $('reviews').innerHTML = state.reviews.length ? state.reviews.map(r => '<div class="review"><b>' + esc(r.period_start) + ' — ' + esc(r.period_end) + '</b><p>' + esc(r.summary) + '</p></div>').join('') : 'Sin informes semanales todavía.';
    }

    async function refresh() {
        try {
            $('refresh').disabled = true;
            state = await get('/api/state');
            $('lastupdate').textContent = state.runs.length ? 'Último corte: ' + state.runs.map(r => r.date).sort().at(-1) + ' · ' + state.runs.length + ' capturas' : 'Sin cortes guardados';
            renderHistory();
            if (python) await render();
        } catch (e) {
            $('loading').textContent = e.message;
            $('loading').classList.add('error');
        } finally {
            $('refresh').disabled = false
        }
    }

    function download(data, name, type = 'application/json') {
        const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], {type});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    $('export').onclick = () => {
        if (!analysis) return download(state, 'cortes-vacantes.json');
        const rows = analysis.rows;
        if (!rows.length) return download([], 'vacantes-filtradas.json');
        const fields = Object.keys(rows[0]);
        const cell = x => '"' + String(Array.isArray(x) ? x.join(' | ') : x ?? '').replace(/^([=+@-])/, '\t$1').replaceAll('"', '""') + '"';
        download('\ufeff' + [fields.map(cell).join(','), ...rows.map(r => fields.map(k => cell(r[k])).join(','))].join('\r\n'), 'vacantes-filtradas.csv', 'text/csv;charset=utf-8')
    };
    $('rawexport').onclick = () => download(state, 'historial-vacantes-2026.json');

    async function upload(input, endpoint, status) {
        try {
            const file = $(input).files[0];
            if (!file) throw Error('Seleccione un archivo JSON.');
            const payload = JSON.parse(await file.text());
            const r = await fetch(endpoint, {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(payload)
            }), data = await r.json();
            if (!r.ok) throw Error(data.error);
            $(status).textContent = data.idempotent ? 'Este corte ya estaba guardado.' : 'Guardado correctamente.';
            await refresh();
        } catch (e) {
            $(status).textContent = e.message
        }
    }

    $('importRun').onclick = () => upload('runfile', '/api/runs', 'importstatus');
    $('importHist').onclick = () => upload('histfile', '/api/historical', 'histstatus');
    $('refresh').onclick = refresh;
    ['platform', 'family', 'market', 'seniority', 'modality', 'from', 'to', 'status'].forEach(id => $(id).onchange = render);
    $('search').oninput = renderTables;

    function sim() {
        const a = Number($('previous').value), b = Number($('current').value), d = Number($('days').value),
                valid = Number.isFinite(a) && Number.isFinite(b) && a >= 0 && b >= 0;
        $('dayslabel').textContent = d + ' días';
        $('variation').textContent = valid && a > 0 ? ((b / a - 1) * 100).toLocaleString('es-MX', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }) + ' %' : 'N/D';
        $('simprevious').textContent = valid ? (a * d).toLocaleString('es-MX') : 'N/D';
        $('simcurrent').textContent = valid ? (b * d).toLocaleString('es-MX') : 'N/D';
        $('simirr').textContent = valid && a > 0 ? (b / a).toFixed(2) : 'N/D';
        return 'Escenario hipotético: anterior ' + a + '/día, actual ' + b + '/día, ' + d + ' días. Variación ' + $('variation').textContent + '. Publicaciones proyectadas ' + $('simprevious').textContent + ' frente a ' + $('simcurrent').textContent + '. No representa una medición histórica.';
    }

    ['previous', 'current', 'days'].forEach(id => $(id).oninput = sim);
    $('copy').onclick = async () => {
        try {
            await navigator.clipboard.writeText(sim());
            $('copy').textContent = '✓ Resultados copiados';
            setTimeout(() => $('copy').textContent = '▢ Copiar resultados', 2200)
        } catch {
            $('copy').textContent = 'No fue posible copiar; puede seleccionar los valores.'
        }
    };
    sim();
    if (window.__initialAnalysis) {
        analysis = window.__initialAnalysis;
        renderTables();
    }
    (async () => {
        await refresh();
        try {
            protocol = await get('/api/protocol');
            $('queries').innerHTML = Object.entries(protocol.families).map(([k, v]) => '<p><b>' + esc(k) + ':</b> ' + v.map(esc).join(' · ') + '</p>').join('');
            $('rules').innerHTML = protocol.rules.map(r => '<li>' + esc(r) + '</li>').join('');
            await setupPython();
            await render();
        } catch (e) {
            $('loading').textContent = e.message;
            $('loading').classList.add('error')
        }
    })();