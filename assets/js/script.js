let analysis = null, requestId = 0;
const page = window.location;
const staticPreview = page.protocol === 'file:' || (
    ['localhost', '127.0.0.1', '[::1]'].includes(page.hostname)
    && page.pathname.endsWith('/index.html')
    && (page.port === '63342' || new URLSearchParams(page.search).has('_ijt'))
);
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
    $('filters').style.display = ['overview', 'records', 'weekly', 'history', 'simulator'].includes(view) ? 'flex' : 'none';
}

document.querySelectorAll('.nav').forEach(b => b.onclick = () => navigate(b.dataset.view));

function filters() {
    return Object.fromEntries(['platform', 'family', 'market', 'seniority', 'modality', 'from', 'to'].map(k => [k, $(k).value]));
}

async function get(path) {
    const r = await fetch(path);
    if (!r.headers.get('content-type')?.startsWith('application/json')) {
        throw Error('La API de Workforce no respondió con datos (HTTP ' + r.status + ').');
    }
    const data = await r.json();
    if (!r.ok) throw Error(data.error || 'No se pudo leer el panel.');
    return data;
}

function table(rows) {
    return '<article class="card tablecard"><div class="tablehead sectionhead"><div><h2 class="smalltitle">Registro de observaciones</h2><p class="caption">' + rows.length + ' anuncios · última evidencia disponible para el rango</p></div><span class="tag gray">Trazable</span></div><div class="tablewrap"><table><thead><tr><th>Empresa / puesto</th><th>Plataforma</th><th>Ubicación / modalidad</th><th>Seniority</th><th>Publicación original</th><th>Estado</th><th>Evidencia</th></tr></thead><tbody>' + (rows.length ? rows.map(r => '<tr><td><b>' + esc(r.title) + '</b><small>' + esc(r.company) + '</small></td><td>' + esc(r.platform) + '</td><td>' + esc(r.location) + '<small>' + esc(r.modality) + ' · ' + esc(r.market) + '</small></td><td>' + esc(r.seniority) + '</td><td>' + esc(r.first_published || r.publication_raw) + '<small>' + esc(r.publication_precision) + '</small></td><td><span class="tag ' + (r.status === 'activa' ? '' : 'amber') + '">' + esc(labels[r.status]) + '</span></td><td><button class="rowbutton evidence" data-key="' + esc(r.platform + ':' + r.platform_id) + '">Ver evidencia ↗</button></td></tr>').join('') : '<tr><td colspan="7" class="empty">Sin registros para estos filtros. Esto no demuestra ausencia de vacantes.</td></tr>') + '</tbody></table></div></article>';
}

function renderTables() {
    if (!analysis) return;
    const query = $('search').value.toLowerCase();
    const status = $('status').value;
    const rows = analysis.rows.filter(record => (!status || record.status === status)
        && [record.company, record.title, ...record.technologies].join(' ').toLowerCase().includes(query));
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
        'Evidencia de publicación': r.publication_evidence,
        'Evidencia de republicación': r.repost_evidence,
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
    const links = [
        ['Fuente original', r.url, 'Abrir anuncio'],
        ['Fuente de evidencia', r.evidence_url, 'Consultar fuente'],
        ['Postulación', r.application_url, 'Ver enlace de postulación']
    ];
    $('detailbody').innerHTML = Object.entries(fields).map(([name, value]) =>
        `<dt>${esc(name)}</dt><dd>${esc(value)}</dd>`
    ).join('') + links.filter(([, url]) => url).map(([name, url, label]) =>
        `<dt>${esc(name)}</dt><dd><a target="_blank" rel="noopener noreferrer"
         href="${esc(url)}">${esc(label)} ↗</a></dd>`
    ).join('');
    $('detail').showModal();
}

$('closeDetail').onclick = () => $('detail').close();

const fmt = (value, digits = 0) => value == null ? 'N/D' : value.toLocaleString('es-MX', {
    maximumFractionDigits: digits, minimumFractionDigits: digits
});
const shortDay = value => value.slice(8) + '/' + value.slice(5, 7);

function chart(id, items, title, digits = 0, maximum = null) {
    const top = maximum ?? Math.max(1, ...items.map(item => item[1] ?? 0));
    const height = 14 + items.length * 30;
    $(id).innerHTML = items.length ? `<svg viewBox="0 0 460 ${height}" role="img" aria-label="${esc(title)}">
        ${items.map(([label, value, missing = 'N/D'], i) => {
            const y = 7 + i * 30;
            const shown = value == null ? missing : fmt(value, digits);
            const width = value == null ? 0 : 220 * value / top;
            return `<g><title>${esc(label)} · ${shown}</title>
                <text x="4" y="${y + 15}" fill="#53635f" font-size="12">${esc(label)}</text>
                <rect x="169" y="${y}" width="220" height="19" rx="3" fill="#eaf0ef"/>
                <rect x="169" y="${y}" width="${width}" height="19" rx="3" fill="#0b9eb8"/>
                <text x="401" y="${y + 15}" fill="#173d36" font-size="12">${shown}</text></g>`;
        }).join('')}</svg>` : '<div class="empty">Sin datos en el periodo.</div>';
}

function periodLabel(week) {
    return shortDay(week.start) + ' – ' + shortDay(week.end);
}

function searchReconciliation(coverage) {
    const results = coverage.search_results;
    if (!Array.isArray(results) || !results.length) return '';
    return `<details class="search-results"><summary>Ver ${fmt(results.length)} resultados conciliados</summary>
        <ol>${results.map(r => `<li><b>${esc(r.title)}</b><br>
            ${esc(r.company)} · ${esc(r.publication_raw)} · ID ${esc(r.platform_id)}<br>
            ${r.in_scope ? 'En el estudio' : 'Fuera del estudio'} · ${esc(r.scope_reason)}</li>`).join('')}
        </ol></details>`;
}

function renderCategoryInventories(inventories) {
    const container = $('categoryInventories');
    container.hidden = !inventories.length;
    container.innerHTML = inventories.map(c => {
        const inventory = c.category_inventory;
        const results = inventory.results;
        return `<div class="sectionhead"><div><h2>Inventario general de TI · ${esc(c.platform)}</h2>
            <p>${esc(inventory.name)} · ${esc(inventory.date_window)}</p></div></div>
            <p><strong>${fmt(c.reported_count)}</strong> resultados reportados · ${fmt(results.length)} IDs conciliados ·
            ${fmt(c.pages_reviewed.length)} páginas revisadas.</p>
            <p class="caption">El recuento registra resultados visibles de la categoría. La primera publicación y la vigencia se verifican por ficha.</p>
            <details class="search-results"><summary>Ver ${fmt(results.length)} fichas de TI</summary>
                <ol>${results.map(r => `<li>${esc(r.platform_id)} · ${esc(r.publication_raw)} · página ${esc(r.page)}
                    ${/^https?:\/\//i.test(r.url) ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">Abrir en ${esc(c.platform)}</a>` : ''}</li>`).join('')}
                </ol></details>`;
    }).join('');
}

function render(data) {
    const m = data.metrics;
    $('mobserved').textContent = m.observed;
    $('mactive').textContent = fmt(m.active);
    $('mnew').textContent = fmt(m.new);
    $('mcoverage').textContent = m.coverage_complete + ' / ' + m.coverage_total;
    $('dedupnote').textContent = m.dedup_pending + ' anuncios sin vínculo entre plataformas · '
        + m.reposts + ' republicaciones confirmadas · ' + m.pending_market + ' de elegibilidad pendiente.';
    $('coverage').innerHTML = data.coverage.map(c => '<div class="covrow"><b>' + esc(c.platform)
        + '</b><span class="tag ' + (c.status === 'completa' ? '' : 'amber') + '">'
        + esc(labels[c.status]) + '</span><div class="reason">' + esc(c.reason)
        + '<br>' + esc(c.date || 'Sin captura') + searchReconciliation(c) + '</div></div>').join('');
    renderCategoryInventories(data.category_inventories ?? []);
    $('weeklyrows').innerHTML = data.weekly.map(w => `<tr>
        <td>${esc(w.start)} — ${esc(w.end)}</td><td>${fmt(w.captures)}</td>
        <td>${w.valid_days} / ${w.elapsed_days}</td><td>${fmt(w.new)}</td>
        <td>${fmt(w.daily_mean, 2)}</td><td>${w.coverage_pct == null ? 'N/D' : fmt(w.coverage_pct, 1) + ' %'}</td>
        <td><span class="tag ${w.daily_mean === null ? 'amber' : ''}">${w.elapsed_days === 0
            ? 'Pendiente' : w.daily_mean === null ? 'Cobertura o fechas insuficientes' : 'Periodo observado'}</span></td></tr>`).join('');
    chart('platformchart', data.coverage.map(c => [
        c.platform, data.distribution.platform[c.platform] ?? (c.status === 'completa' ? 0 : null),
        c.status === 'pendiente' ? 'Sin captura' : 'Sin fichas'
    ]), 'Anuncios por plataforma');
    chart('familychart', Object.entries(data.distribution.family), 'Anuncios por especialidad');
    chart('serieschart', data.series.map(d => [shortDay(d.date), d.observed]), 'Observaciones diarias');
    chart('weeklycoverage', data.weekly.map(w => [periodLabel(w), w.coverage_pct]), 'Cobertura semanal (%)', 1, 100);
    chart('weeklymean', data.weekly.map(w => [periodLabel(w), w.daily_mean]), 'Publicaciones por día', 2);
    renderTables();
}

function renderHistory(data) {
    $('historyrows').innerHTML = data.historical.length ? data.historical.map(h =>
        `<tr><td><a href="${esc(h.source_url)}" target="_blank" rel="noopener">${esc(h.source_title)}</a>
         <small>${esc(h.platform)} · consultado ${esc(h.retrieved_at)}</small></td>
         <td>${esc(h.period_start)} / ${esc(h.period_end)}</td>
         <td>${esc(h.geography)}<small>${esc(h.family)} · ${esc(h.coverage)}</small></td>
         <td>${esc(h.metric)}</td><td>${fmt(h.value, Number.isInteger(h.value) ? 0 : 2)} ${esc(h.unit)}</td>
         <td><span class="tag amber">${esc(h.comparability)}</span><small>${esc(h.limitation)}</small></td></tr>`
    ).join('') : '<tr><td colspan="6" class="empty">Sin fuentes históricas documentadas.</td></tr>';
    $('histcompare').innerHTML = data.comparisons.length ? data.comparisons.map(c =>
        `<p class="history-summary"><b>${esc(c.platform)} · ${esc(c.family)}</b><br>${esc(c.market)} ·
         ${periodLabel(c)} · ${c.valid_days} días por año<br>
         2025: ${fmt(c.previous, 2)} · 2026: ${fmt(c.current, 2)} publicaciones/día.
         Variación: ${c.change_pct == null ? 'N/D' : fmt(c.change_pct, 1) + ' %'}.
         <a href="${esc(c.source_url)}" target="_blank" rel="noopener">Ver fuente</a></p>`
    ).join('') : 'N/D · Pendiente de una base equivalente y cobertura válida en ambos años.';
    chart('comparisonchart', data.comparisons.flatMap(c => [
        [c.platform + ' · ' + shortDay(c.start) + ' · 2025', c.previous],
        [c.platform + ' · ' + shortDay(c.start) + ' · 2026', c.current]
    ]), 'Promedio diario en periodos equivalentes', 2);
    chart('activehistory', data.series.map(d => [shortDay(d.date), d.active]), 'Vacantes activas verificadas por día');
    chart('newhistory', data.series.map(d => [shortDay(d.date), d.documented_new]), 'Publicaciones nuevas por fecha original');
    $('reviews').className = data.reviews.length ? '' : 'empty';
    $('reviews').innerHTML = data.reviews.length ? data.reviews.map(r =>
        `<div class="review"><b>${esc(r.period_start)} — ${esc(r.period_end)}</b>
         <p>${esc(r.summary)}</p><button class="btn weekly-download" data-id="${esc(r.id)}">Descargar corte</button></div>`
    ).join('') : 'Sin informes semanales todavía.';
    document.querySelectorAll('.weekly-download').forEach(button => {
        button.onclick = () => download(data.reviews.find(r => r.id === button.dataset.id),
            button.dataset.id + '.json');
    });
    const selected = $('meanSource').value;
    const means = data.weekly.filter(w => w.daily_mean != null);
    $('meanSource').innerHTML = '<option value="">Seleccione un corte</option>'
        + means.map(w => `<option value="${w.end}">${periodLabel(w)} · ${fmt(w.daily_mean, 2)} por día</option>`).join('');
    if (means.some(w => w.end === selected)) $('meanSource').value = selected;
    $('useMean').disabled = !$('meanSource').value;
    if (!means.length) {
        $('simSourceNote').textContent = 'Aún no hay un promedio observado con cobertura válida.';
    } else if (!$('current').value) {
        $('simSourceNote').textContent = '';
    }
}

async function refresh() {
    const current = ++requestId;
    try {
        $('refresh').disabled = true;
        const query = new URLSearchParams(filters());
        const data = await get('/api/dashboard?' + query);
        if (current !== requestId) return;
        analysis = data;
        render(data);
        renderHistory(data);
        $('lastupdate').textContent = data.latest_date
            ? 'Última captura: ' + data.latest_date + ' · ' + data.run_count + ' capturas guardadas'
            : 'Sin capturas guardadas';
        $('loading').textContent = 'Consultado a las ' + new Date().toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City'
        }) + ' · Ciudad de México';
        $('loading').classList.remove('error');
    } catch (error) {
        if (current !== requestId) return;
        if (!analysis) $('lastupdate').textContent = 'Sin conexión con la API';
        $('loading').textContent = 'No se pudo actualizar. ' + error.message;
        $('loading').classList.add('error');
    } finally {
        if (current === requestId) $('refresh').disabled = false;
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
    if (!analysis) return;
    const rows = analysis.rows;
    if (!rows.length) return download([], 'vacantes-filtradas.json');
    const fields = Object.keys(rows[0]);
    const cell = x => '"' + String(Array.isArray(x) ? x.join(' | ') : x ?? '').replace(/^([=+@-])/, '\t$1').replaceAll('"', '""') + '"';
    download('\ufeff' + [fields.map(cell).join(','), ...rows.map(r => fields.map(k => cell(r[k])).join(','))].join('\r\n'), 'vacantes-filtradas.csv', 'text/csv;charset=utf-8')
};
$('rawexport').onclick = async () => {
    try {
        download(await get('/api/state'), 'historial-vacantes.json');
    } catch (error) {
        $('loading').textContent = error.message;
    }
};

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
        if (!r.ok) throw Error(data.error || 'El contrato requiere un objeto JSON válido.');
        $(status).textContent = data.idempotent ? 'Este corte ya estaba guardado.' : 'Guardado correctamente.';
        await refresh();
    } catch (e) {
        $(status).textContent = e.message
    }
}

$('importRun').onclick = () => upload('runfile', '/api/runs', 'importstatus');
$('importHist').onclick = () => upload('histfile', '/api/historical', 'histstatus');
$('refresh').onclick = refresh;
['platform', 'family', 'market', 'seniority', 'modality', 'from', 'to'].forEach(id => $(id).onchange = refresh);
$('search').oninput = renderTables;
$('status').onchange = renderTables;

function sim() {
    const a = Number($('previous').value), b = Number($('current').value), d = Number($('days').value),
            valid = $('previous').value !== '' && $('current').value !== ''
            && Number.isFinite(a) && Number.isFinite(b) && a >= 0 && b >= 0;
    $('dayslabel').textContent = d + ' días';
    $('variation').textContent = valid && a > 0 ? ((b / a - 1) * 100).toLocaleString('es-MX', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }) + ' %' : 'N/D';
    $('simprevious').textContent = valid ? (a * d).toLocaleString('es-MX') : 'N/D';
    $('simcurrent').textContent = valid ? (b * d).toLocaleString('es-MX') : 'N/D';
    $('simirr').textContent = valid && a > 0 ? (b / a).toFixed(2) : 'N/D';
    if (!valid) return 'Indique los dos promedios diarios para generar un escenario.';
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
$('meanSource').onchange = () => $('useMean').disabled = !$('meanSource').value;
$('useMean').onclick = () => {
    const week = analysis?.weekly.find(w => w.end === $('meanSource').value);
    if (!week || week.daily_mean == null) return;
    $('current').value = week.daily_mean;
    $('simSourceNote').textContent = 'Promedio observado del ' + periodLabel(week)
        + ' · ' + week.valid_days + ' días válidos.';
    sim();
};

async function loadProtocol() {
    try {
        const protocol = await get('/api/protocol');
        $('queries').innerHTML = Object.entries(protocol.families).map(([k, v]) =>
            '<p><b>' + esc(k) + ':</b> ' + v.map(esc).join(' · ') + '</p>').join('');
        $('rules').innerHTML = protocol.rules.map(r => '<li>' + esc(r) + '</li>').join('');
    } catch (error) {
        $('queries').textContent = error.message;
    }
}

if (staticPreview) {
    const link = document.createElement('a');
    link.href = 'http://127.0.0.1:8000/';
    link.textContent = 'abra el panel de Workforce';
    $('lastupdate').textContent = 'Vista previa estática';
    $('loading').replaceChildren(
        'La vista previa no tiene acceso a PostgreSQL. Inicie Docker Compose y ',
        link,
        ' en el puerto configurado en WORKFORCE_PORT (8000 por defecto).'
    );
    ['refresh', 'export', 'importRun', 'importHist', 'rawexport'].forEach(id => {
        $(id).disabled = true;
    });
} else {
    refresh();
    loadProtocol();
    setInterval(() => {
        if (!document.hidden && !$('refresh').disabled) refresh();
    }, 60000);
}
