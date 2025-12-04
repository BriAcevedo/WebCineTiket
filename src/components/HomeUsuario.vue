<template>
  <div class="user-home">
    
    <div class="user-home__header">
      <h2 class="user-home__title">🎬 Catálogo de Películas</h2>

      <div class="header-buttons">
        <button 
          @click="irCarrito" 
          class="cart-button"
          @mouseover="hover = true" 
          @mouseleave="hover = false"
          :class="{ 'cart-button--hovered': hover }"
        >
          🛒 Ir al Carrito
        </button>

        <button @click="cerrarSesion" class="user-home__logout">
          Regresar
        </button>
      </div>
    </div>

    <div v-if="peliculas.length === 0" class="user-home__empty">
      No hay películas disponibles.
    </div>
          
    <div class="movie-grid">
      <div
        v-for="p in peliculas"
        :key="p.id"
        class="movie-card"
      >
        <img :src="p.imagen" class="movie-card__poster" />

        <div class="movie-card__content">

          <h3 class="movie-card__title">{{ p.titulo }}</h3>

          <div class="movie-card__badges">
            <span class="movie-card__badge movie-card__badge--clasificacion">
              🔞 {{ p.clasificacion }}
            </span>
            <span class="movie-card__badge movie-card__badge--idioma">
              🗣 {{ p.idioma || 'Español' }}
            </span>
          </div>

          <p class="movie-card__desc">
            {{ p.descripcion?.substring(0, 100) || 'Sin descripción' }}...
          </p>

          <div class="movie-card__info-grid">

            <div class="movie-card__info">
              <span class="movie-card__info-label">🎞 Duración</span>
              <span class="movie-card__info-value">{{ p.duracion || 'N/A' }}</span>
            </div>

            <div class="movie-card__info movie-card__info--precio">
              <span class="movie-card__info-label">💲 Precio</span>
              <span class="movie-card__info-value">
                ${{ p.precio || '0' }}
              </span>
            </div>

          </div>

          <button @click="verPelicula(p)" class="btn btn--ver">
            Ver detalles
          </button>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomeUsuario',
  data() {
    return {
      peliculas: JSON.parse(localStorage.getItem("peliculas")) || [],
      hover: false,
    };
  },
  methods: {
    verPelicula(peli) {
      console.log('Redirigiendo a detalle de película:', peli.id, peli.titulo);
      
      // Guardar película seleccionada temporalmente
      localStorage.setItem('peliculaTemporal', JSON.stringify(peli));
      
      // Redirigir a DetallePelicula
      this.$router.push({
        name: "DetallePelicula",
        params: { 
          id: peli.id.toString()
        }
      });
    },
    cerrarSesion() {
      localStorage.removeItem("usuarioActual");
      this.$router.push("/");
    },
    irCarrito() {
      this.$router.push({ name: "CarritoPeliculas" });
    }
  },
  mounted() {
    console.log('=== HOMEUSUARIO MONTADO ===');
    console.log('Películas cargadas:', this.peliculas.length);
    
    // Verificar estructura de películas
    if (this.peliculas.length > 0) {
      console.log('Primera película:', this.peliculas[0]);
    }
  }
};
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════ */
/* 🛒 BOTÓN DEL CARRITO */
/* ══════════════════════════════════════════════════════════ */
.cart-button {
  background: linear-gradient(135deg, #007BFF 0%, #3399FF 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0, 123, 255, 0.4);
  transition: all 0.3s ease;
}

.cart-button--hovered {
  transform: translateY(-2px);
  box-shadow: 
    0 5px 20px rgba(0, 123, 255, 0.6),
    0 0 20px rgba(0, 123, 255, 0.3);
}

.cart-button:hover {
  background: linear-gradient(135deg, #0066CC 0%, #007BFF 100%);
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎬 CONTENEDOR PRINCIPAL - ESTILO STREAMING */
/* ══════════════════════════════════════════════════════════ */
.user-home {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  /* CAMBIO APLICADO AQUÍ */
  padding-top: 80px; 
  background-image: url('../assets/palomitas.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 204, 0, 0.5) transparent;
}

/* Scrollbar personalizado para navegadores Webkit (Chrome, Safari, Edge) */
.user-home::-webkit-scrollbar {
  width: 6px;
}

.user-home::-webkit-scrollbar-track {
  background: transparent;
}

.user-home::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(255, 204, 0, 0.6), rgba(255, 153, 0, 0.6));
  border-radius: 10px;
  border: 1px solid rgba(255, 204, 0, 0.2);
}

.user-home::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(255, 204, 0, 0.8), rgba(255, 153, 0, 0.8));
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

.user-home::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.75) 50%, rgba(0, 0, 0, 0.85) 100%);
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 0;
}

.user-home > * {
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎯 HEADER CON TÍTULO Y BOTÓN DE CERRAR SESIÓN */
/* ══════════════════════════════════════════════════════════ */
.user-home__header {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 40, 0.9) 100%);
  backdrop-filter: blur(10px);
  padding: 16px 40px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid rgba(255, 204, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: slideDown 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  width: 100%;
}

.user-home__title {
  font-size: 28px;
  font-weight: 800;
  color: #ffcc00;
  text-shadow: 
    0 0 10px rgba(255, 204, 0, 0.8),
    0 0 20px rgba(255, 204, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  margin: 0;
}

.user-home__logout {
  background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
  color: white;
  border: 2px solid #ff4757;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-home__logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 71, 87, 0.5);
  background: linear-gradient(135deg, #ff6348 0%, #ff4757 100%);
}

.user-home__logout:active {
  transform: translateY(0);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ══════════════════════════════════════════════════════════ */
/* 📭 ESTADO VACÍO */
/* ══════════════════════════════════════════════════════════ */
.user-home__empty {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin: 40px auto;
  border: 2px dashed rgba(255, 204, 0, 0.3);
  max-width: 800px;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎬 GRID DE PELÍCULAS - ESTILO NETFLIX/CINÉPOLIS */
/* ══════════════════════════════════════════════════════════ */
.movie-grid {
  display: grid;
  gap: 24px;
  padding: 24px 40px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  max-width: 100%;
  box-sizing: border-box;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎴 CARD DE PELÍCULA - INTERACTIVA Y MODERNA */
/* ══════════════════════════════════════════════════════════ */
.movie-card {
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.95), rgba(10, 10, 30, 0.95));
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border: 2px solid transparent;
}

.movie-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1;
}

.movie-card:hover::before {
  opacity: 1;
}

.movie-card:hover {
  transform: translateY(-12px) scale(1.03);
  border-color: rgba(255, 204, 0, 0.6);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(255, 204, 0, 0.3),
    inset 0 0 0 2px rgba(255, 204, 0, 0.2);
}

/* ══════════════════════════════════════════════════════════ */
/* 🖼️ POSTER CON EFECTO ZOOM */
/* ══════════════════════════════════════════════════════════ */
.movie-card__poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.movie-card:hover .movie-card__poster {
  transform: scale(1.1);
}

/* ══════════════════════════════════════════════════════════ */
/* 📝 INFORMACIÓN DE LA PELÍCULA */
/* ══════════════════════════════════════════════════════════ */
.movie-card__content {
  padding: 16px;
  position: relative;
  z-index: 2;
}

.movie-card__title {
  color: #ffcc00;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 12px 0;
  text-shadow: 
    0 2px 8px rgba(255, 204, 0, 0.4),
    0 0 20px rgba(255, 204, 0, 0.2);
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.movie-card__desc {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ══════════════════════════════════════════════════════════ */
/* 📊 INFORMACIÓN DETALLADA - BADGES */
/* ══════════════════════════════════════════════════════════ */
.movie-card__info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.movie-card__info {
  background: rgba(255, 204, 0, 0.1);
  border: 1px solid rgba(255, 204, 0, 0.3);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.movie-card__info::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.movie-card__info:hover::before {
  opacity: 1;
}

.movie-card__info:hover {
  background: rgba(255, 204, 0, 0.15);
  border-color: rgba(255, 204, 0, 0.5);
  transform: translateY(-2px);
}

.movie-card__info-label {
  font-size: 11px;
  color: rgba(255, 204, 0, 0.8);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.movie-card__info-value {
  font-size: 14px;
  color: white;
  font-weight: 600;
}

/* Badge especial para precio */
.movie-card__info--precio {
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.2) 0%, rgba(255, 153, 0, 0.2) 100%);
  border-color: rgba(255, 204, 0, 0.5);
}

.movie-card__info--precio .movie-card__info-value {
  color: #ffcc00;
  font-size: 18px;
  font-weight: 800;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎟️ ETIQUETAS DE CLASIFICACIÓN */
/* ══════════════════════════════════════════════════════════ */
.movie-card__badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.movie-card__badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.movie-card__badge--clasificacion {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  border-color: #ff6b6b;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.movie-card__badge--idioma {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border-color: #4ecdc4;
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
}

/* ══════════════════════════════════════════════════════════ */
/* 🔘 BOTÓN DE ACCIÓN PRINCIPAL */
/* ══════════════════════════════════════════════════════════ */
.btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:active::before {
  width: 400px;
  height: 400px;
}

.btn--ver {
  background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
  color: #000;
  box-shadow: 
    0 4px 20px rgba(255, 204, 0, 0.4),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.btn--ver::after {
  content: "▶";
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  transition: transform 0.3s;
}

.btn--ver:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 8px 30px rgba(255, 204, 0, 0.6),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.btn--ver:hover::after {
  transform: translateY(-50%) translateX(5px);
}

.btn--ver:active {
  transform: translateY(-1px);
}

/* ══════════════════════════════════════════════════════════ */
/* ✨ ANIMACIONES Y EFECTOS */
/* ══════════════════════════════════════════════════════════ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.movie-card {
  animation: fadeInUp 0.6s ease-out backwards;
}

.movie-card:nth-child(1) { animation-delay: 0.1s; }
.movie-card:nth-child(2) { animation-delay: 0.2s; }
.movie-card:nth-child(3) { animation-delay: 0.3s; }
.movie-card:nth-child(4) { animation-delay: 0.4s; }
.movie-card:nth-child(5) { animation-delay: 0.5s; }

/* ══════════════════════════════════════════════════════════ */
/* 🎭 EFECTO DE BRILLO EN HOVER */
/* ══════════════════════════════════════════════════════════ */
.movie-card::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 204, 0, 0.1) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.movie-card:hover::after {
  animation: shine 1.5s ease-in-out;
}

@keyframes shine {
  0% {
    opacity: 0;
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* ══════════════════════════════════════════════════════════ */
/* 📱 SCROLLBAR PERSONALIZADO */
/* ══════════════════════════════════════════════════════════ */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffcc00, #ff9900);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff9900, #ffcc00);
}

/* ══════════════════════════════════════════════════════════ */
/* 📱 OPTIMIZACIÓN RESPONSIVE */
/* ══════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .user-home__header {
    padding: 16px 20px;
  }
  
  .movie-grid {
    padding: 20px 16px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .header-buttons {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .user-home__title {
    font-size: 20px;
  }

  .user-home__logout,
  .cart-button {
    padding: 8px 14px;
    font-size: 12px;
  }

  .movie-card__poster {
    height: 280px;
  }

  .movie-card__title {
    font-size: 20px;
  }

  .movie-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
  
  .movie-card__info-grid {
    grid-template-columns: 1fr;
  }
}
</style>