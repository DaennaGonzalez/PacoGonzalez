/* =========================
   PACO GONZALEZ - SCRIPT.JS
   VERSION CORREGIDA Y ROBUSTA
   COMPATIBLE CON EL HTML/CSS FINAL
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const cuerpo = document.body;
  const anchoMovil = 992;
  const anchoTelefono = 768;

  /* =========================
     MENU MOVIL
     ========================= */
  const botonMenu = document.querySelector(".navegacion__boton");
  const menu = document.querySelector(".navegacion__menu");
  const enlacesMenu = document.querySelectorAll(".navegacion__enlace");

  function abrirCerrarMenu(forzarEstado = null) {
    if (!botonMenu || !menu) return;

    const expandidoActual = botonMenu.getAttribute("aria-expanded") === "true";
    const nuevoEstado =
      typeof forzarEstado === "boolean" ? forzarEstado : !expandidoActual;

    botonMenu.setAttribute("aria-expanded", String(nuevoEstado));
    menu.classList.toggle("navegacion__menu--activo", nuevoEstado);
    cuerpo.classList.toggle("menu-abierto", nuevoEstado);
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", () => {
      abrirCerrarMenu();
    });

   enlacesMenu.forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    const href = enlace.getAttribute("href") || "";

    abrirCerrarMenu(false);

    const esInicio =
      href === "index.html" ||
      href === "./" ||
      href === "/";

    const enHome =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/") ||
      window.location.pathname === "";

    if (esInicio && enHome) {
      evento.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
});

    document.addEventListener("click", (evento) => {
      if (!menu.contains(evento.target) && !botonMenu.contains(evento.target)) {
        abrirCerrarMenu(false);
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        abrirCerrarMenu(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= anchoMovil) {
        abrirCerrarMenu(false);
      }
    });
  }

  /* =========================
     ANIO AUTOMATICO
     ========================= */
  const anioActual = document.getElementById("anioActual");
  if (anioActual) {
    anioActual.textContent = new Date().getFullYear();
  }

  /* =========================
     REVELAR ELEMENTOS AL SCROLL
     ========================= */
  const elementosRevelar = document.querySelectorAll(".revelar, .imagen-sube-scroll");

  if ("IntersectionObserver" in window) {
    const observadorRevelar = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observadorRevelar.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elementosRevelar.forEach((elemento) => {
      observadorRevelar.observe(elemento);
    });
  } else {
    elementosRevelar.forEach((elemento) => {
      elemento.classList.add("visible");
    });
  }

  /* =========================
     HEADER ACTIVO AL SCROLL
     ========================= */
  const encabezado = document.querySelector(".encabezado");

  function actualizarEncabezado() {
    if (!encabezado) return;

    if (window.scrollY > 24) {
      encabezado.classList.add("encabezado--activo");
    } else {
      encabezado.classList.remove("encabezado--activo");
    }
  }

  actualizarEncabezado();
  window.addEventListener("scroll", actualizarEncabezado, { passive: true });

  /* =========================
     ENLACE ACTIVO SEGUN HASH
     ========================= */
  function actualizarEnlaceActivo() {
    const hashActual = window.location.hash || "#inicio";

    enlacesMenu.forEach((enlace) => {
      const href = enlace.getAttribute("href");
      if (href === hashActual) {
        enlace.classList.add("navegacion__enlace--activo");
      } else if (hashActual === "#inicio" && href === "#inicio") {
        enlace.classList.add("navegacion__enlace--activo");
      } else {
        enlace.classList.remove("navegacion__enlace--activo");
      }
    });
  }

  actualizarEnlaceActivo();
  window.addEventListener("hashchange", actualizarEnlaceActivo);

  /* =========================
     OBSERVAR SECCIONES PARA NAV
     ========================= */
  const seccionesObservables = document.querySelectorAll(
    "#inicio, #perfil, #formacion, #areas-practica, #experiencia, #estadisticas, #contacto"
  );

  if ("IntersectionObserver" in window && seccionesObservables.length) {
    const observadorSecciones = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const id = entrada.target.getAttribute("id");
            enlacesMenu.forEach((enlace) => {
              enlace.classList.remove("navegacion__enlace--activo");
              if (enlace.getAttribute("href") === `#${id}`) {
                enlace.classList.add("navegacion__enlace--activo");
              }
            });
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "-15% 0px -45% 0px",
      }
    );

    seccionesObservables.forEach((seccion) => {
      observadorSecciones.observe(seccion);
    });
  }

  /* =========================
     CONTADORES DINAMICOS
     ========================= */
  const contadores = document.querySelectorAll(".tarjeta-estadistica__numero");
  const seccionEstadisticas = document.getElementById("estadisticas");
  let contadoresActivados = false;

  function animarContador(elemento, destino) {
    const duracion = 1800;
    const inicio = 0;
    const tiempoInicio = performance.now();

    const actualizar = (tiempoActual) => {
      const tiempoTranscurrido = tiempoActual - tiempoInicio;
      const progreso = Math.min(tiempoTranscurrido / duracion, 1);
      const valor = Math.floor(inicio + (destino - inicio) * easeOutCubic(progreso));
      elemento.textContent = valor;

      if (progreso < 1) {
        requestAnimationFrame(actualizar);
      } else {
        elemento.textContent = destino;
      }
    };

    requestAnimationFrame(actualizar);
  }

  function activarContadores() {
    if (contadoresActivados) return;
    contadoresActivados = true;

    contadores.forEach((contador) => {
      const destino = Number(contador.dataset.count || 0);
      animarContador(contador, destino);
    });
  }

  /* =========================
     BARRAS DINAMICAS
     ========================= */
  const barras = document.querySelectorAll(".barra-estadistica__relleno");
  let barrasActivadas = false;

  function activarBarras() {
    if (barrasActivadas) return;
    barrasActivadas = true;

    barras.forEach((barra, indice) => {
      const ancho = barra.dataset.width || "0";
      setTimeout(() => {
        barra.style.width = `${ancho}%`;
      }, indice * 180);
    });
  }

  /* =========================
     DONUT DINAMICO
     ========================= */
  const donut = document.querySelector(".grafica-donut");
  let donutActivado = false;

  const datosDonut = {
    defensa: 34,
    investigaciones: 24,
    amparo: 18,
    otros: 24,
  };

  function establecerDonutFinal() {
    if (!donut) return;

    const total =
      datosDonut.defensa +
      datosDonut.investigaciones +
      datosDonut.amparo +
      datosDonut.otros;

    const p1 = datosDonut.defensa;
    const p2 = datosDonut.defensa + datosDonut.investigaciones;
    const p3 = datosDonut.defensa + datosDonut.investigaciones + datosDonut.amparo;
    const p4 = total;

    donut.style.background = `conic-gradient(
      #0555c1 0% ${p1}%,
      #013477 ${p1}% ${p2}%,
      #768398 ${p2}% ${p3}%,
      #9cc0ff ${p3}% ${p4}%,
      rgba(255,255,255,0.12) ${p4}% 100%
    )`;

    const centro = donut.querySelector(".grafica-donut__centro strong");
    if (centro) {
      centro.textContent = `${total}%`;
    }
  }

  function activarDonut() {
    if (!donut || donutActivado) return;
    donutActivado = true;

    const totalFinal =
      datosDonut.defensa +
      datosDonut.investigaciones +
      datosDonut.amparo +
      datosDonut.otros;

    const duracion = 1900;
    const tiempoInicio = performance.now();

    const animar = (tiempoActual) => {
      const transcurrido = tiempoActual - tiempoInicio;
      const avance = Math.min(transcurrido / duracion, 1);
      const progreso = easeOutCubic(avance);

      const defensa = datosDonut.defensa * progreso;
      const investigaciones = datosDonut.investigaciones * progreso;
      const amparo = datosDonut.amparo * progreso;
      const otros = datosDonut.otros * progreso;

      const p1 = defensa;
      const p2 = defensa + investigaciones;
      const p3 = defensa + investigaciones + amparo;
      const p4 = defensa + investigaciones + amparo + otros;

      donut.style.background = `conic-gradient(
        #0555c1 0% ${p1}%,
        #013477 ${p1}% ${p2}%,
        #768398 ${p2}% ${p3}%,
        #9cc0ff ${p3}% ${p4}%,
        rgba(255,255,255,0.12) ${p4}% 100%
      )`;

      const centro = donut.querySelector(".grafica-donut__centro strong");
      if (centro) {
        centro.textContent = `${Math.round(totalFinal * progreso)}%`;
      }

      if (avance < 1) {
        requestAnimationFrame(animar);
      } else {
        establecerDonutFinal();
      }
    };

    requestAnimationFrame(animar);
  }

  function donutVisibleEnPantalla() {
    if (!donut) return false;
    const rect = donut.getBoundingClientRect();
    const altoVentana = window.innerHeight || document.documentElement.clientHeight;

    return rect.top < altoVentana * 0.92 && rect.bottom > altoVentana * 0.08;
  }

  /* =========================
     ACTIVACION CENTRAL DE ESTADISTICAS
     ========================= */
  function activarEstadisticasCompletas() {
    activarContadores();
    activarBarras();
    activarDonut();
  }

  if (seccionEstadisticas && "IntersectionObserver" in window) {
    const observadorEstadisticas = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            activarEstadisticasCompletas();
            observadorEstadisticas.disconnect();
          }
        });
      },
      {
        threshold: window.innerWidth < anchoTelefono ? 0.12 : 0.28,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observadorEstadisticas.observe(seccionEstadisticas);
  } else if (seccionEstadisticas) {
    activarEstadisticasCompletas();
  }

  /* Fallback extra en móvil y al cargar */
  if (seccionEstadisticas) {
    setTimeout(() => {
      const rect = seccionEstadisticas.getBoundingClientRect();
      const altoVentana = window.innerHeight || document.documentElement.clientHeight;
      const visible = rect.top < altoVentana * 0.92 && rect.bottom > altoVentana * 0.08;

      if (visible) {
        activarEstadisticasCompletas();
      }
    }, 500);

    window.addEventListener(
      "scroll",
      () => {
        const rect = seccionEstadisticas.getBoundingClientRect();
        const altoVentana = window.innerHeight || document.documentElement.clientHeight;
        const visible = rect.top < altoVentana * 0.92 && rect.bottom > altoVentana * 0.08;

        if (visible) {
          activarEstadisticasCompletas();
        }
      },
      { passive: true }
    );
  }

  /* Donut fallback móvil */
  if (donut && window.innerWidth < anchoTelefono) {
    setTimeout(() => {
      if (!donutActivado && donutVisibleEnPantalla()) {
        activarDonut();
      }
    }, 700);

    window.addEventListener(
      "scroll",
      () => {
        if (!donutActivado && donutVisibleEnPantalla()) {
          activarDonut();
        }
      },
      { passive: true }
    );
  }

  /* =========================
     COPIAR CORREO
     ========================= */
  const botonesCopiar = document.querySelectorAll(".contacto__copiar-correo");

  botonesCopiar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const correo = boton.dataset.correo || "";
      const contenedor = boton.closest(".contacto__correo-acciones");
      const mensaje = contenedor?.querySelector(".contacto__mensaje-copiado");

      try {
        await navigator.clipboard.writeText(correo);
        mostrarMensajeCopiado(mensaje);
      } catch (error) {
        const areaTemporal = document.createElement("textarea");
        areaTemporal.value = correo;
        document.body.appendChild(areaTemporal);
        areaTemporal.select();
        document.execCommand("copy");
        document.body.removeChild(areaTemporal);
        mostrarMensajeCopiado(mensaje);
      }
    });
  });

  function mostrarMensajeCopiado(mensaje) {
    if (!mensaje) return;
    mensaje.classList.add("visible");
    mensaje.textContent = "Correo copiado";

    setTimeout(() => {
      mensaje.classList.remove("visible");
    }, 2200);
  }

  /* =========================
     EFECTO 3D SUAVE EN TARJETAS
     ========================= */
  const tarjetas3D = document.querySelectorAll(
    ".tarjeta-estadistica, .tarjeta-servicio, .tarjeta-grafica, .tarjeta-barras, .formacion__tarjeta, .experiencia-v2__item, .tarjeta-autoridad"
  );

  tarjetas3D.forEach((tarjeta) => {
    tarjeta.addEventListener("mousemove", (evento) => {
      if (window.innerWidth < anchoMovil) return;

      const rect = tarjeta.getBoundingClientRect();
      const x = evento.clientX - rect.left;
      const y = evento.clientY - rect.top;
      const centroX = rect.width / 2;
      const centroY = rect.height / 2;

      const rotacionX = ((y - centroY) / centroY) * -4;
      const rotacionY = ((x - centroX) / centroX) * 5;

      tarjeta.style.transform = `perspective(1000px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) translateY(-6px)`;
    });

    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });

  /* =========================
     BOTONES CON REBOTE SUAVE
     ========================= */
  const botones = document.querySelectorAll(".boton, .acciones-flotantes__boton");

  botones.forEach((boton) => {
    boton.addEventListener("mouseenter", () => {
      if (window.innerWidth < anchoMovil) return;
      boton.classList.add("rebote-hover");
    });

    boton.addEventListener("animationend", () => {
      boton.classList.remove("rebote-hover");
    });
  });

  /* =========================
     PARALLAX SUAVE EN HERO
     ========================= */
  const imagenHero = document.querySelector(".hero__imagen");
  const seccionHero = document.querySelector(".hero");

  function aplicarParallaxHero() {
    if (!imagenHero || !seccionHero || window.innerWidth < anchoMovil) {
      if (imagenHero) {
        imagenHero.style.transform = "";
      }
      return;
    }

    const rect = seccionHero.getBoundingClientRect();
    const alturaVentana = window.innerHeight;

    if (rect.bottom > 0 && rect.top < alturaVentana) {
      const desplazamiento = rect.top * -0.03;
      imagenHero.style.transform = `translate3d(0, ${desplazamiento}px, 0)`;
    }
  }

  aplicarParallaxHero();
  window.addEventListener("scroll", aplicarParallaxHero, { passive: true });
  window.addEventListener("resize", aplicarParallaxHero);

  /* =========================
     ACCIONES FLOTANTES MOVIL
     ========================= */
  const accionesFlotantes = document.querySelector(".acciones-flotantes");
  let ultimoScroll = window.scrollY;

  function controlarAccionesFlotantes() {
    if (!accionesFlotantes) return;
    if (window.innerWidth >= anchoMovil) return;

    const scrollActual = window.scrollY;

    if (scrollActual > ultimoScroll && scrollActual > 180) {
      accionesFlotantes.style.transform = "translateY(120px)";
      accionesFlotantes.style.opacity = "0.92";
    } else {
      accionesFlotantes.style.transform = "translateY(0)";
      accionesFlotantes.style.opacity = "1";
    }

    ultimoScroll = scrollActual;
  }

  if (accionesFlotantes) {
    accionesFlotantes.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    window.addEventListener("scroll", controlarAccionesFlotantes, { passive: true });
  }

  /* =========================
     FUNCION AUXILIAR
     ========================= */
  function easeOutCubic(valor) {
    return 1 - Math.pow(1 - valor, 3);
  }

  
});


