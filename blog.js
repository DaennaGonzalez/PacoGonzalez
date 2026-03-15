/* =========================
   BLOG.JS
   PACO GONZALEZ - BLOG
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const cuerpo = document.body;
  const anchoMovil = 992;

  /* =========================
     MENU MOVIL
     ========================= */
/* =========================
   MENU MOVIL
   ========================= */
const botonMenu = document.querySelector(".navegacion__boton");
const menu = document.querySelector(".navegacion__menu");
const navegacion = document.querySelector(".navegacion");
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
  botonMenu.addEventListener("click", (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    abrirCerrarMenu();
  });

  menu.addEventListener("click", (evento) => {
    evento.stopPropagation();
  });

  enlacesMenu.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      abrirCerrarMenu(false);
    });
  });

  document.addEventListener("click", (evento) => {
    const clickDentroBoton = botonMenu.contains(evento.target);
    const clickDentroMenu = menu.contains(evento.target);

    if (!clickDentroBoton && !clickDentroMenu) {
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
     REVEAL AL SCROLL
     ========================= */
  const elementosRevelar = document.querySelectorAll(".revelar");

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
        threshold: 0.14,
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
     FILTRO DE CATEGORIAS + BUSQUEDA
     ========================= */
  const buscador = document.getElementById("buscadorBlog");
  const botonesCategoria = document.querySelectorAll(".blog-categorias__boton");
  const articulos = document.querySelectorAll(".blog-card");

  let categoriaActiva = "todos";
  let terminoBusqueda = "";

  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function filtrarArticulos() {
    articulos.forEach((articulo) => {
      const categoria = articulo.dataset.categoria || "";
      const textoArticulo = normalizarTexto(articulo.textContent);

      const coincideCategoria =
        categoriaActiva === "todos" || categoria === categoriaActiva;

      const coincideBusqueda =
        terminoBusqueda === "" || textoArticulo.includes(terminoBusqueda);

      if (coincideCategoria && coincideBusqueda) {
        articulo.classList.remove("oculto");
      } else {
        articulo.classList.add("oculto");
      }
    });
  }

  if (buscador) {
    buscador.addEventListener("input", (evento) => {
      terminoBusqueda = normalizarTexto(evento.target.value || "");
      filtrarArticulos();
    });
  }

  if (botonesCategoria.length) {
    botonesCategoria.forEach((boton) => {
      boton.addEventListener("click", () => {
        botonesCategoria.forEach((item) => item.classList.remove("activo"));
        boton.classList.add("activo");

        categoriaActiva = boton.dataset.categoria || "todos";
        filtrarArticulos();
      });
    });
  }

  filtrarArticulos();
});