<template>
  <div class="detalle-container">

    <button class="btn-regresar" @click="regresarCatalogo">
      ✕
    </button>

    <h1 class="titulo">{{ pelicula.titulo }}</h1>

    <img :src="pelicula.imagen" class="poster" alt="poster" />

    <div class="info-card">

      <div class="info-item">
        <span class="info-icon">🎭</span>
        <div class="info-content">
          <strong>Clasificación</strong>
          <span>{{ pelicula.clasificacion }}</span>
        </div>
      </div>

      <div class="info-item">
        <span class="info-icon">🎪</span>
        <div class="info-content">
          <strong>Género</strong>
          <span>{{ pelicula.genero }}</span>
        </div>
      </div>

      <div class="info-item precio-destacado">
        <span class="info-icon">💰</span>
        <div class="info-content">
          <strong>Precio</strong>
          <span class="precio-valor">${{ pelicula.precio }}</span>
        </div>
      </div>

    </div>

    <div class="descripcion-section">
      <h3 class="subtitulo">
        <span class="subtitulo-icon">📝</span>
        Descripción
      </h3>
      <p class="descripcion">{{ pelicula.descripcion }}</p>
    </div>

    <button class="btn-continuar" @click="continuar">
      Seleccionar Cinema 
    </button>

  </div>
</template>

<script>
export default {
  name: "DetallePelicula",

  data() {
    return {
      pelicula: {},
    };
  },

  mounted() {
    const id = this.$route.params.id;

    // Todas tus películas guardadas en LocalStore
    const peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];

    // Busca la película por ID
    this.pelicula =
      peliculas.find(p => p.id == id) || {
        titulo: "No encontrada",
        descripcion: "Película no encontrada en el catálogo local.",
        imagen: ""
      };
  },

  methods: {
    /**
     * CORRECCIÓN: Este método asegura que el usuario regrese
     * al listado de películas (HomeUsuario) y no al historial previo.
     */
    regresarCatalogo() {
      this.$router.push({ name: "HomeUsuario" });
    },

    continuar() {

      // Guardar película seleccionada
      localStorage.setItem(
        "peliculaSeleccionada",
        JSON.stringify(this.pelicula)
      );

      // Redirigir a CinemaCard
      this.$router.push({
        name: "CinemaCard",
        query: { peliculaId: this.pelicula.id }
      });
    }
  }
};
</script>


<style scoped>
/* ══════════════════════════════════════════════════════════ */
/* RESET COMPLETO - FORZAR SIN MÁRGENES NI PADDINGS */
/* ══════════════════════════════════════════════════════════ */
.detalle-container,
.detalle-container * {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎬 CONTENEDOR PRINCIPAL CON FONDO DE PALOMITAS */
/* ══════════════════════════════════════════════════════════ */
.detalle-container {
  min-height: 100vh !important;
  width: 100% !important;
  position: fixed !important; /* CAMBIADO: fixed para control total */
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background-image: url('../assets/palomitas.webp') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  box-shadow: none !important;
  scroll-behavior: smooth !important;
  -webkit-overflow-scrolling: touch !important;
  z-index: 1 !important;
}

.detalle-container::before {
  content: "" !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.88) 100%) !important;
  backdrop-filter: blur(2px) !important;
  pointer-events: none !important;
  z-index: -1 !important;
}

/* ══════════════════════════════════════════════════════════ */
/* ✕ BOTÓN REGRESAR - ESQUINA SUPERIOR DERECHA EN ROJO */
/* ══════════════════════════════════════════════════════════ */
.btn-regresar {
  position: fixed !important;
  top: 2px !important; /* PEGADO AL BORDE */
  right: 2px !important; /* PEGADO AL BORDE */
  width: 35px !important;
  height: 35px !important;
  background: linear-gradient(135deg, #ff0000, #cc0000) !important;
  border: 2px solid rgba(255, 0, 0, 0.4) !important;
  border-radius: 50% !important;
  color: white !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 
    0 3px 10px rgba(255, 0, 0, 0.4),
    0 0 15px rgba(255, 0, 0, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: 1000 !important;
  line-height: 1 !important;
}

.btn-regresar:hover {
  transform: scale(1.1) rotate(90deg) !important;
  box-shadow: 
    0 4px 15px rgba(255, 0, 0, 0.6),
    0 0 20px rgba(255, 0, 0, 0.4) !important;
  background: linear-gradient(135deg, #ff3333, #ff0000) !important;
}

.btn-regresar:active {
  transform: scale(0.95) rotate(90deg) !important;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎭 TÍTULO PRINCIPAL - PEGADO ARRIBA */
/* ══════════════════════════════════════════════════════════ */
.titulo {
  font-size: 26px !important;
  margin-top: 40px !important; /* Espacio solo para el botón */
  margin-bottom: 10px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  font-weight: 800 !important;
  color: #ffcc00 !important;
  text-align: center !important;
  text-shadow: 
    0 0 12px rgba(255, 204, 0, 0.9),
    0 0 25px rgba(255, 204, 0, 0.6),
    0 1px 4px rgba(0, 0, 0, 0.9) !important;
  line-height: 1.1 !important;
  letter-spacing: 1px !important;
  animation: titleGlow 3s ease-in-out infinite !important;
  max-width: 90% !important;
  display: block !important;
}

@keyframes titleGlow {
  0%, 100% { 
    text-shadow: 
      0 0 12px rgba(255, 204, 0, 0.9),
      0 0 25px rgba(255, 204, 0, 0.6),
      0 1px 4px rgba(0, 0, 0, 0.9) !important;
  }
  50% { 
    text-shadow: 
      0 0 20px rgba(255, 204, 0, 1),
      0 0 40px rgba(255, 204, 0, 0.8),
      0 1px 4px rgba(0, 0, 0, 0.9) !important;
  }
}

/* ══════════════════════════════════════════════════════════ */
/* 🖼️ POSTER CINEMATOGRÁFICO - SIN MÁRGENES SUPERIORES */
/* ══════════════════════════════════════════════════════════ */
.poster {
  width: auto !important;
  max-width: 300px !important;
  height: auto !important;
  aspect-ratio: 2/3 !important;
  border-radius: 12px !important;
  margin-top: 0 !important;
  margin-bottom: 15px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  display: block !important;
  object-fit: cover !important;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(255, 204, 0, 0.25),
    0 0 0 2px rgba(255, 204, 0, 0.3) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  animation: fadeInScale 0.6s ease-out !important;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.poster:hover {
  transform: scale(1.04) translateY(-4px) rotate(0.5deg) !important;
  box-shadow: 
    0 12px 35px rgba(0, 0, 0, 0.95),
    0 0 50px rgba(255, 204, 0, 0.4),
    0 0 0 3px rgba(255, 204, 0, 0.5) !important;
}

/* ══════════════════════════════════════════════════════════ */
/* 📋 CARD DE INFORMACIÓN RENOVADA */
/* ══════════════════════════════════════════════════════════ */
.info-card {
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.97), rgba(10, 10, 30, 0.97)) !important;
  padding: 15px !important;
  margin-top: 0 !important;
  margin-bottom: 15px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  border-radius: 15px !important;
  backdrop-filter: blur(8px) !important;
  border: 2px solid rgba(255, 204, 0, 0.4) !important;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 204, 0, 0.1),
    0 0 30px rgba(255, 204, 0, 0.1) !important;
  animation: slideInUp 0.6s ease-out 0.2s backwards !important;
  max-width: 400px !important;
  display: block !important;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-item {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  margin: 10px 0 !important;
  padding: 10px !important;
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.08), rgba(255, 153, 0, 0.05)) !important;
  border-radius: 10px !important;
  border-left: 2px solid rgba(255, 204, 0, 0.6) !important;
  transition: all 0.3s ease !important;
}

.info-item:hover {
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.15), rgba(255, 153, 0, 0.1)) !important;
  border-left-color: #ffcc00 !important;
  transform: translateX(3px) !important;
  box-shadow: 0 2px 8px rgba(255, 204, 0, 0.2) !important;
}

.info-icon {
  font-size: 20px !important;
  min-width: 30px !important;
  text-align: center !important;
  filter: drop-shadow(0 1px 3px rgba(255, 204, 0, 0.3)) !important;
}

.info-content {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}

.info-content strong {
  color: #ffcc00 !important;
  font-weight: 700 !important;
  font-size: 10px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.6px !important;
  text-shadow: 0 1px 3px rgba(255, 204, 0, 0.4) !important;
}

.info-content span {
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

.precio-destacado {
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.15), rgba(255, 153, 0, 0.12)) !important;
  border-left-color: #ffcc00 !important;
  border-left-width: 3px !important;
}

.precio-valor {
  color: #ffcc00 !important;
  font-size: 18px !important;
  font-weight: 800 !important;
  text-shadow: 0 1px 6px rgba(255, 204, 0, 0.5) !important;
}

/* ══════════════════════════════════════════════════════════ */
/* 📝 SECCIÓN DE DESCRIPCIÓN */
/* ══════════════════════════════════════════════════════════ */
.descripcion-section {
  margin-top: 0 !important;
  margin-bottom: 15px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  animation: slideInUp 0.6s ease-out 0.3s backwards !important;
  max-width: 500px !important;
  padding: 0 10px !important;
  display: block !important;
}

.subtitulo {
  font-size: 20px !important;
  margin-bottom: 10px !important;
  font-weight: 800 !important;
  color: #ffcc00 !important;
  text-align: left !important;
  text-shadow: 0 1px 6px rgba(255, 204, 0, 0.5) !important;
  letter-spacing: 0.6px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.subtitulo-icon {
  font-size: 20px !important;
  filter: drop-shadow(0 1px 4px rgba(255, 204, 0, 0.4)) !important;
}

.descripcion {
  font-size: 13px !important;
  line-height: 1.5 !important;
  color: rgba(255, 255, 255, 0.95) !important;
  text-align: justify !important;
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.95), rgba(10, 10, 30, 0.95)) !important;
  padding: 12px !important;
  border-radius: 12px !important;
  border: 2px solid rgba(255, 204, 0, 0.3) !important;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎟️ BOTÓN CONTINUAR MEJORADO */
/* ══════════════════════════════════════════════════════════ */
.btn-continuar {
  background: linear-gradient(135deg, #ffcc00, #ff9900) !important;
  color: #000 !important;
  border: 2px solid rgba(255, 204, 0, 0.5) !important;
  border-radius: 15px !important;
  padding: 12px 24px !important;
  font-weight: 800 !important;
  font-size: 1rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  max-width: 400px !important;
  margin-top: 0 !important;
  margin-bottom: 20px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  display: block !important;
  box-shadow: 
    0 4px 15px rgba(255, 204, 0, 0.5),
    0 0 30px rgba(255, 204, 0, 0.2) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  position: relative !important;
  overflow: hidden !important;
}

.btn-continuar::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
  transition: left 0.5s !important;
}

.btn-continuar:hover::before {
  left: 100% !important;
}

.btn-continuar:hover {
  box-shadow: 
    0 6px 25px rgba(255, 204, 0, 0.7),
    0 0 50px rgba(255, 204, 0, 0.4) !important;
  transform: translateY(-3px) scale(1.02) !important;
  border-color: #ffcc00 !important;
}

.btn-continuar:active {
  transform: translateY(-1px) scale(0.98) !important;
  box-shadow: 
    0 3px 12px rgba(255, 204, 0, 0.6),
    0 0 25px rgba(255, 204, 0, 0.3) !important;
}

/* ══════════════════════════════════════════════════════════ */
/* 📱 RESPONSIVE - AÚN MÁS COMPACTO */
/* ══════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .titulo {
    font-size: 22px !important;
    margin-top: 35px !important;
    margin-bottom: 8px !important;
  }

  .poster {
    max-width: 250px !important;
    margin-bottom: 12px !important;
  }

  .subtitulo {
    font-size: 18px !important;
  }

  .descripcion {
    font-size: 12px !important;
    padding: 10px !important;
  }

  .info-content span {
    font-size: 13px !important;
  }

  .precio-valor {
    font-size: 16px !important;
  }

  .btn-continuar {
    font-size: 0.9rem !important;
    padding: 10px 20px !important;
    max-width: 300px !important;
  }

  .info-card {
    max-width: 320px !important;
    padding: 12px !important;
    margin-bottom: 12px !important;
  }
  
  .descripcion-section {
    max-width: 320px !important;
    padding: 0 8px !important;
    margin-bottom: 12px !important;
  }
  
  .btn-regresar {
    top: 1px !important;
    right: 1px !important;
    width: 30px !important;
    height: 30px !important;
    font-size: 16px !important;
  }
}

@media (max-width: 480px) {
  .titulo {
    font-size: 20px !important;
    margin-top: 30px !important;
    margin-bottom: 5px !important;
  }

  .poster {
    max-width: 220px !important;
    margin-bottom: 10px !important;
  }

  .subtitulo {
    font-size: 16px !important;
  }

  .descripcion {
    font-size: 11px !important;
    line-height: 1.4 !important;
    padding: 8px !important;
  }

  .info-content span {
    font-size: 12px !important;
  }

  .precio-valor {
    font-size: 14px !important;
  }

  .btn-continuar {
    font-size: 0.8rem !important;
    padding: 8px 16px !important;
    max-width: 280px !important;
    margin-bottom: 15px !important;
  }

  .btn-regresar {
    width: 25px !important;
    height: 25px !important;
    font-size: 14px !important;
  }
  
  .info-card {
    margin-left: 5px !important;
    margin-right: 5px !important;
    margin-bottom: 10px !important;
  }
  
  .descripcion-section {
    margin-left: 5px !important;
    margin-right: 5px !important;
    margin-bottom: 10px !important;
  }
}

/* ══════════════════════════════════════════════════════════ */
/* 📜 SCROLLBAR DORADO */
/* ══════════════════════════════════════════════════════════ */
.detalle-container::-webkit-scrollbar {
  width: 4px !important;
}

.detalle-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3) !important;
}

.detalle-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffcc00, #ff9900) !important;
  border-radius: 6px !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
}

.detalle-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff9900, #ffcc00) !important;
  box-shadow: 0 0 6px rgba(255, 204, 0, 0.6) !important;
}
</style>