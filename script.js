// ===================== CONFIGURACIÓN =====================
// Cambia aquí tus datos sin tocar el resto del código.

// Tu número con el código de Colombia (57), sin espacios ni "+"
const TELEFONO = "573178199187";

// Fecha límite para elegir: año, mes (0 = enero, 9 = octubre), día
const FECHA_LIMITE = new Date(2026, 9, 26);

// Los planes del carrusel. El último es el comodín.
const PLANES = [
  {
    emoji: "☕",
    titulo: "Café o helado",
    texto: "Una tarde tranquila, algo rico y conversación sin afán."
  },
  {
    emoji: "🎬",
    titulo: "Tarde de películas",
    texto: "Tú eliges la película, yo pongo las crispetas."
  },
  {
    emoji: "🚶‍♀️",
    titulo: "Una caminata",
    texto: "Caminar sin rumbo fijo y ponernos al día."
  },
  {
    emoji: "🍷",
    titulo: "Salir a comer",
    texto: "Una buena comida y, por qué no, otra copa de vino."
  },
  {
    emoji: "🃏",
    titulo: "Comodín: elijo yo",
    texto: "¿No te decides? Déjamelo a mí, prometo que valdrá la pena.",
    comodin: true
  }
];

// ===================== ELEMENTOS =====================
const pantallaCarta = document.getElementById("pantalla-carta");
const pantallaBono = document.getElementById("pantalla-bono");
const pantallaFinal = document.getElementById("pantalla-final");
const carrusel = document.getElementById("carrusel");
const puntos = document.getElementById("puntos");
const flechaIzq = document.getElementById("flecha-izq");
const flechaDer = document.getElementById("flecha-der");

// ===================== CAMBIAR DE PANTALLA =====================
function mostrarPantalla(pantalla) {
  [pantallaCarta, pantallaBono, pantallaFinal].forEach(p => p.classList.add("oculto"));
  pantalla.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("btn-continuar").addEventListener("click", () => {
  mostrarPantalla(pantallaBono);
});

document.getElementById("btn-volver").addEventListener("click", () => {
  mostrarPantalla(pantallaBono);
});

// ===================== FECHA LÍMITE =====================
function mostrarFechaLimite() {
  const texto = document.getElementById("fecha-limite");
  const hoy = new Date();
  const fecha = FECHA_LIMITE.toLocaleDateString("es-CO", { day: "numeric", month: "long" });

  if (hoy > FECHA_LIMITE) {
    texto.textContent = "Se acabó el tiempo para elegir… ahora el plan lo escojo yo.";
  } else {
    texto.textContent = `Tienes hasta el ${fecha} para elegir. Si no, elijo yo.`;
  }
}

// ===================== CREAR EL CARRUSEL =====================
function crearCarrusel() {
  PLANES.forEach((plan, i) => {
    // Tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta" + (plan.comodin ? " comodin" : "");
    tarjeta.innerHTML = `
      <div class="tarjeta-interior">
        <div class="emoji">${plan.emoji}</div>
        <h3>${plan.titulo}</h3>
        <p>${plan.texto}</p>
        <button class="boton">${plan.comodin ? "Sorpréndeme" : "¡Elijo este!"}</button>
      </div>
    `;
    tarjeta.querySelector("button").addEventListener("click", () => elegirPlan(plan));
    carrusel.appendChild(tarjeta);

    // Punto indicador
    const punto = document.createElement("button");
    punto.className = "punto";
    punto.setAttribute("aria-label", `Ir al plan ${i + 1}`);
    punto.addEventListener("click", () => irA(i));
    puntos.appendChild(punto);
  });

  actualizarIndicadores();
}

function indiceActual() {
  return Math.round(carrusel.scrollLeft / carrusel.clientWidth);
}

function irA(i) {
  carrusel.scrollTo({ left: i * carrusel.clientWidth });
}

function actualizarIndicadores() {
  const actual = indiceActual();
  puntos.querySelectorAll(".punto").forEach((p, i) => {
    p.classList.toggle("activo", i === actual);
  });
  flechaIzq.disabled = actual === 0;
  flechaDer.disabled = actual === PLANES.length - 1;
}

flechaIzq.addEventListener("click", () => irA(indiceActual() - 1));
flechaDer.addEventListener("click", () => irA(indiceActual() + 1));
carrusel.addEventListener("scroll", actualizarIndicadores);

// ===================== ELEGIR UN PLAN =====================
function elegirPlan(plan) {
  let mensaje;

  document.getElementById("final-emoji").textContent = plan.emoji;

  if (plan.comodin) {
    document.getElementById("final-titulo").textContent = "¡Confías en mí!";
    document.getElementById("final-texto").textContent =
      "Entonces el plan lo escojo yo. Escríbeme y cuadramos el día.";
    mensaje = "¡Hola RSV! Usé mi bono comodín y te dejo elegir el plan a ti. ¿Cuándo nos vemos?";
  } else {
    document.getElementById("final-titulo").textContent = "¡Bono canjeado!";
    document.getElementById("final-texto").textContent =
      `Elegiste: ${plan.titulo}. Ahora solo falta escoger el día.`;
    mensaje = `¡Hola RSV! Canjeé mi bono de cumpleaños y elegí: ${plan.titulo}. ¿Cuándo nos vemos?`;
  }

  document.getElementById("btn-whatsapp").href =
    `https://wa.me/${TELEFONO}?text=${encodeURIComponent(mensaje)}`;

  mostrarPantalla(pantallaFinal);
}

// ===================== INICIO =====================
crearCarrusel();
mostrarFechaLimite();
