document.addEventListener('DOMContentLoaded', () => {
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    /* ============ TOAST ============ */
    const toast = $('#toast');
    let toastTimer;
    function avisar(msg, tipo = 'ok') {
        toast.textContent = msg;
        toast.className = 'toast visible ' + (tipo === 'ok' ? 'ok' : 'error-t');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
    }

    /* ============ MENÚ MÓVIL ============ */
    const menu = $('#menu');
    const burger = $('#hamburguesa');
    function cerrarMenu() {
        menu.classList.remove('abierto');
        burger.classList.remove('abierta');
        burger.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', () => {
        const abierto = menu.classList.toggle('abierto');
        burger.classList.toggle('abierta', abierto);
        burger.setAttribute('aria-expanded', abierto);
    });
    $$('a', menu).forEach(a => a.addEventListener('click', cerrarMenu));

    /* ============ NAV: sombra + enlace activo + botón subir ============ */
    const nav = $('#nav');
    const subir = $('#subir');
    const enlaces = $$('.enlaces-header a');
    const secciones = enlaces.map(a => $(a.getAttribute('href'))).filter(Boolean);

    function alScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        subir.classList.toggle('visible', window.scrollY > 500);
        const pos = window.scrollY + 140;
        let actual = secciones[0];
        secciones.forEach(s => { if (s.offsetTop <= pos) actual = s; });
        enlaces.forEach(a => a.classList.toggle('activo', $(a.getAttribute('href')) === actual));
    }
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();
    subir.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ============ VACANTES (datos + render + filtros) ============ */
    const vacantes = [
        { id: 1, cargo: 'Desarrollador Web Junior', empresa: 'TechNova', area: 'tecnologia', ciudad: 'Bogotá', tipo: 'Tiempo completo', salario: '$3.500.000', icono: 'fa-code' },
        { id: 2, cargo: 'Analista de Datos', empresa: 'DataCol', area: 'tecnologia', ciudad: 'Remoto', tipo: 'Tiempo completo', salario: '$4.200.000', icono: 'fa-chart-line' },
        { id: 3, cargo: 'Asesor Comercial', empresa: 'Grupo Vendemás', area: 'ventas', ciudad: 'Medellín', tipo: 'Tiempo completo', salario: '$2.200.000', icono: 'fa-handshake' },
        { id: 4, cargo: 'Ejecutivo de Cuentas', empresa: 'Andina Retail', area: 'ventas', ciudad: 'Cali', tipo: 'Tiempo completo', salario: '$2.800.000', icono: 'fa-bullseye' },
        { id: 5, cargo: 'Auxiliar Administrativo', empresa: 'Gestiona S.A.S', area: 'administracion', ciudad: 'Barranquilla', tipo: 'Medio tiempo', salario: '$1.600.000', icono: 'fa-folder-open' },
        { id: 6, cargo: 'Asistente Contable', empresa: 'Contables & Cía', area: 'administracion', ciudad: 'Bogotá', tipo: 'Tiempo completo', salario: '$2.400.000', icono: 'fa-calculator' },
        { id: 7, cargo: 'Agente de Servicio al Cliente', empresa: 'CallCenter Plus', area: 'servicio', ciudad: 'Remoto', tipo: 'Tiempo completo', salario: '$1.800.000', icono: 'fa-headset' },
        { id: 8, cargo: 'Soporte Técnico Nivel 1', empresa: 'HelpDesk Co', area: 'servicio', ciudad: 'Medellín', tipo: 'Por turnos', salario: '$2.000.000', icono: 'fa-screwdriver-wrench' },
        { id: 9, cargo: 'Auxiliar de Bodega', empresa: 'LogiExpress', area: 'logistica', ciudad: 'Barranquilla', tipo: 'Por turnos', salario: '$1.700.000', icono: 'fa-boxes-stacked' },
        { id: 10, cargo: 'Coordinador de Despachos', empresa: 'TransCarga', area: 'logistica', ciudad: 'Cali', tipo: 'Tiempo completo', salario: '$3.000.000', icono: 'fa-truck-fast' },
        { id: 11, cargo: 'Diseñador UI/UX', empresa: 'Pixel Studio', area: 'tecnologia', ciudad: 'Remoto', tipo: 'Por proyecto', salario: '$3.800.000', icono: 'fa-pen-ruler' },
        { id: 12, cargo: 'Recepcionista Corporativo', empresa: 'Torre Empresarial', area: 'administracion', ciudad: 'Bogotá', tipo: 'Tiempo completo', salario: '$1.900.000', icono: 'fa-bell-concierge' }
    ];
    const nombresArea = { tecnologia: 'Tecnología', ventas: 'Ventas', administracion: 'Administración', servicio: 'Servicio al cliente', logistica: 'Logística' };

    const grid = $('#grid-vacantes');
    const vacio = $('#sin-resultados');
    const contador = $('#contador-vacantes');
    const estado = { area: 'todas', texto: '', ciudad: '' };

    const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function pintarVacantes() {
        const lista = vacantes.filter(v =>
            (estado.area === 'todas' || v.area === estado.area) &&
            (!estado.ciudad || v.ciudad === estado.ciudad) &&
            (!estado.texto || norm(v.cargo + ' ' + v.empresa).includes(norm(estado.texto)))
        );
        grid.innerHTML = lista.map((v, i) => `
            <article class="vacante" style="animation-delay:${i * 60}ms">
                <div class="vacante-top">
                    <div class="vacante-logo"><i class="fas ${v.icono}"></i></div>
                    <span class="etiqueta-area">${nombresArea[v.area]}</span>
                </div>
                <h3>${v.cargo}</h3>
                <p class="empresa">${v.empresa}</p>
                <div class="meta">
                    <span><i class="fas fa-location-dot"></i>${v.ciudad}</span>
                    <span><i class="fas fa-clock"></i>${v.tipo}</span>
                </div>
                <div class="vacante-pie">
                    <span class="salario">${v.salario}</span>
                    <button class="btn btn-primario" data-postular="${v.id}">Postularme</button>
                </div>
            </article>`).join('');
        vacio.hidden = lista.length > 0;
        contador.textContent = lista.length
            ? `Mostrando ${lista.length} ${lista.length === 1 ? 'vacante' : 'vacantes'}`
            : '';
    }

    $$('.chip').forEach(chip => chip.addEventListener('click', () => {
        $$('.chip').forEach(c => c.classList.remove('activo'));
        chip.classList.add('activo');
        estado.area = chip.dataset.filtro;
        pintarVacantes();
    }));

    $('#form-buscador').addEventListener('submit', e => {
        e.preventDefault();
        estado.texto = $('#buscar-texto').value.trim();
        estado.ciudad = $('#buscar-ciudad').value;
        pintarVacantes();
        $('#vacantes').scrollIntoView({ behavior: 'smooth' });
    });

    $('#limpiar-filtros').addEventListener('click', () => {
        estado.area = 'todas'; estado.texto = ''; estado.ciudad = '';
        $('#buscar-texto').value = ''; $('#buscar-ciudad').value = '';
        $$('.chip').forEach(c => c.classList.toggle('activo', c.dataset.filtro === 'todas'));
        pintarVacantes();
    });

    pintarVacantes();

    /* ============ MODALES ============ */
    let modalActivo = null;
    function abrirModal(id) {
        if (modalActivo) modalActivo.classList.remove('abierto');
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.add('abierto');
        m.setAttribute('aria-hidden', 'false');
        modalActivo = m;
        document.body.style.overflow = 'hidden';
        const primero = $('input', m);
        if (primero) setTimeout(() => primero.focus(), 150);
    }
    function cerrarModal() {
        if (!modalActivo) return;
        modalActivo.classList.remove('abierto');
        modalActivo.setAttribute('aria-hidden', 'true');
        modalActivo = null;
        document.body.style.overflow = '';
    }

    document.addEventListener('click', e => {
        const abrir = e.target.closest('[data-abrir]');
        if (abrir) { e.preventDefault(); cerrarMenu(); abrirModal(abrir.dataset.abrir); return; }

        const post = e.target.closest('[data-postular]');
        if (post) {
            const v = vacantes.find(x => x.id === +post.dataset.postular);
            $('#postular-vacante').textContent = `${v.cargo} · ${v.empresa}`;
            abrirModal('modal-postular');
            return;
        }
        if (e.target.closest('[data-cerrar]') || e.target.classList.contains('modal')) cerrarModal();

        const red = e.target.closest('[data-red]');
        if (red) { e.preventDefault(); avisar('Pronto tendremos nuestras redes sociales disponibles.'); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

    /* ============ VALIDACIÓN DE FORMULARIOS ============ */
    const reCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validarCampo(input) {
        const grupo = input.closest('.grupo');
        const err = $('.error', grupo);
        let msg = '';
        const v = input.value.trim();
        if (!v) msg = 'Este campo es obligatorio.';
        else if (input.type === 'email' && !reCorreo.test(v)) msg = 'Escribe un correo válido.';
        else if (input.type === 'password' && input.minLength > 0 && v.length < input.minLength) msg = `Mínimo ${input.minLength} caracteres.`;
        else if (input.id === 'c-mensaje' && v.length < 10) msg = 'Cuéntanos un poco más (mínimo 10 caracteres).';
        grupo.classList.toggle('invalido', !!msg);
        err.textContent = msg;
        return !msg;
    }

    function manejarForm(id, alExito) {
        const form = document.getElementById(id);
        const campos = $$('input, textarea', form);
        campos.forEach(c => c.addEventListener('input', () => { if (c.closest('.grupo').classList.contains('invalido')) validarCampo(c); }));
        campos.forEach(c => c.addEventListener('blur', () => validarCampo(c)));
        form.addEventListener('submit', e => {
            e.preventDefault();
            const ok = campos.map(validarCampo).every(Boolean);
            if (!ok) { avisar('Revisa los campos marcados.', 'error'); return; }
            alExito(form);
            form.reset();
            $$('.grupo', form).forEach(g => g.classList.remove('invalido'));
        });
    }

    manejarForm('form-contacto', () => avisar('¡Mensaje enviado! Te responderemos pronto.'));
    manejarForm('form-registro', f => {
        const nombre = $('#r-nombre', f).value.trim().split(' ')[0];
        cerrarModal();
        avisar(`¡Bienvenido a AGTempleos, ${nombre}!`);
    });
    manejarForm('form-login', () => { cerrarModal(); avisar('Sesión iniciada correctamente.'); });
    manejarForm('form-postular', () => { cerrarModal(); avisar('¡Postulación enviada! Mucho éxito.'); });

    /* ============ CARRUSEL ============ */
    const pista = $('#car-pista');
    const slides = $$('.slide', pista);
    const contPuntos = $('#car-puntos');
    const carrusel = $('#carrusel');
    let idx = 0, auto;

    slides.forEach((_, i) => {
        const p = document.createElement('button');
        p.className = 'punto' + (i === 0 ? ' activo' : '');
        p.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
        p.addEventListener('click', () => { ir(i); reiniciarAuto(); });
        contPuntos.appendChild(p);
    });
    const puntos = $$('.punto', contPuntos);

    function ir(n) {
        idx = (n + slides.length) % slides.length;
        pista.style.transform = `translateX(-${idx * 100}%)`;
        puntos.forEach((p, i) => p.classList.toggle('activo', i === idx));
    }
    function reiniciarAuto() { clearInterval(auto); auto = setInterval(() => ir(idx + 1), 5500); }

    $('#car-next').addEventListener('click', () => { ir(idx + 1); reiniciarAuto(); });
    $('#car-prev').addEventListener('click', () => { ir(idx - 1); reiniciarAuto(); });
    carrusel.addEventListener('mouseenter', () => clearInterval(auto));
    carrusel.addEventListener('mouseleave', reiniciarAuto);

    // Deslizar con el dedo / mouse
    let x0 = null;
    carrusel.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; clearInterval(auto); }, { passive: true });
    carrusel.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) ir(idx + (dx < 0 ? 1 : -1));
        x0 = null; reiniciarAuto();
    });
    carrusel.setAttribute('tabindex', '0');
    carrusel.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { ir(idx + 1); reiniciarAuto(); }
        if (e.key === 'ArrowLeft') { ir(idx - 1); reiniciarAuto(); }
    });
    reiniciarAuto();

    /* ============ FAQ ACORDEÓN ============ */
    $$('.item-faq').forEach(item => {
        const btn = $('.faq-pregunta', item);
        const resp = $('.faq-respuesta', item);
        btn.addEventListener('click', () => {
            const abrir = !item.classList.contains('abierto');
            $$('.item-faq').forEach(o => {
                o.classList.remove('abierto');
                $('.faq-respuesta', o).style.maxHeight = null;
                $('.faq-pregunta', o).setAttribute('aria-expanded', 'false');
            });
            if (abrir) {
                item.classList.add('abierto');
                resp.style.maxHeight = resp.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ============ CONTADORES ANIMADOS ============ */
    const formato = n => n.toLocaleString('es-CO');
    function animarContador(el) {
        const meta = +el.dataset.meta;
        const dur = 1800;
        const ini = performance.now();
        (function paso(t) {
            const p = Math.min((t - ini) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = formato(Math.round(meta * ease));
            if (p < 1) requestAnimationFrame(paso);
        })(ini);
    }
    const obs = new IntersectionObserver(entradas => {
        entradas.forEach(en => {
            if (en.isIntersecting) { animarContador(en.target); obs.unobserve(en.target); }
        });
    }, { threshold: 0.5 });
    $$('.contar').forEach(c => obs.observe(c));

    /* ============ APARECER AL HACER SCROLL ============ */
    const aparecer = new IntersectionObserver(entradas => {
        entradas.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('visto'); aparecer.unobserve(en.target); }
        });
    }, { threshold: 0.12 });
    $$('.articulo, .numero, .item-faq, .info-contacto, .formulario').forEach(el => {
        el.classList.add('reveal');
        aparecer.observe(el);
    });

    /* ============ AÑO FOOTER ============ */
    $('#anio').textContent = new Date().getFullYear();
});
