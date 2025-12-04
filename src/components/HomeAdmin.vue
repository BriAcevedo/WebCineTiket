<template>
  <div class="admin-home">

    <!-- ⭐ MENÚ SUPERIOR -->
    <nav class="admin-menu">
      <button :class="{ active: menu === 'peliculas' }" @click="menu = 'peliculas'">🎬 Películas</button>
      <button :class="{ active: menu === 'sucursales' }" @click="menu = 'sucursales'">📍 Sucursales</button>
      <button class="logout" @click="cerrarSesion">Regresar</button>
    </nav>

    <!-- ⭐ CRUD DE PELÍCULAS -->
    <div v-if="menu === 'peliculas'" class="content-section">
      <h2 class="admin-home__title">🎬 Administrador – CRUD de Películas</h2>

      <!-- FORMULARIO -->
      <div class="admin-form">
        <h3>{{ editando ? "Editar Película" : "Agregar Película" }}</h3>

        <input v-model="form.titulo" placeholder="Título" class="admin-form__input" />
        <input v-model="form.autor" placeholder="Autor / Director" class="admin-form__input" />
        <input v-model="form.genero" placeholder="Género" class="admin-form__input" />
        <input v-model="form.clasificacion" placeholder="Clasificación" class="admin-form__input" />
        <input v-model="form.duracion" placeholder="Duración (minutos)" class="admin-form__input" />
        <input v-model="form.precio" placeholder="Precio" class="admin-form__input" />

        <textarea v-model="form.descripcion" placeholder="Descripción" 
                  class="admin-form__textarea"></textarea>

        <!-- IMAGEN -->
        <input type="file" @change="cargarImagen" class="admin-form__image" />
        <input v-model="form.imagen" placeholder="O URL de la imagen" class="admin-form__input" />

        <div class="admin-form__buttons">
          <button @click="guardarPelicula" class="btn btn--add">
            {{ editando ? "Guardar Cambios" : "Agregar" }}
          </button>

          <button v-if="editando" @click="cancelarEdicion" class="btn btn--cancel">
            Cancelar
          </button>
        </div>
      </div>

      <!-- LISTADO -->
      <h3>Películas Registradas</h3>

      <div class="movie-grid">
        <div v-for="p in peliculas" :key="p.id" class="movie-card">
          <img :src="p.imagen" class="movie-card__poster" />
          <h3 class="movie-card__title">{{ p.titulo }}</h3>

          <p class="movie-card__desc">{{ p.descripcion.substring(0, 80) }}...</p>

          <p class="movie-card__info">🔞 Clasificación: {{ p.clasificacion }}</p>
          <p class="movie-card__info">🎭 Género: {{ p.genero }}</p>
          <p class="movie-card__info">🕒 Duración: {{ p.duracion }} min</p>
          <p class="movie-card__info">💲 Precio: ${{ p.precio }}</p>

          <button @click="editar(p)" class="btn btn--edit">Editar</button>
          <button @click="eliminar(p.id)" class="btn btn--delete">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- ⭐ SUCURSALES — CinemaCard.vue -->
    <div v-if="menu === 'sucursales'" class="content-section sucursal-box">
      <h2 class="admin-home__title">📍 Sucursales</h2>

      <!-- 👇 AQUÍ SE MUESTRA EL COMPONENTE CORRECTO -->
      <CinemaCard />
    </div>

  </div>
</template>

<script>
import CinemaCard from "./CinemaCard.vue";  // 👈 IMPORTACIÓN CORRECTA

export default {
  name: "HomeAdmin",

  components: {
    CinemaCard  // 👈 REGISTRADO
  },

  data() {
    return {
      menu: "peliculas",

      peliculas: JSON.parse(localStorage.getItem("peliculas")) || [],

      editando: false,

      form: {
        id: null,
        titulo: "",
        autor: "",
        genero: "",
        descripcion: "",
        imagen: "",
        clasificacion: "",
        duracion: "",
        precio: ""
      }
    };
  },

  methods: {
    cargarImagen(event) {
      const archivo = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.imagen = reader.result;
      };
      reader.readAsDataURL(archivo);
    },

    guardarPelicula() {
      if (!this.form.titulo || !this.form.descripcion) {
        alert("Todos los campos son obligatorios");
        return;
      }

      if (this.editando) {
        const index = this.peliculas.findIndex(p => p.id === this.form.id);
        this.peliculas[index] = { ...this.form };
      } else {
        this.form.id = Date.now();
        this.peliculas.push({ ...this.form });
      }

      localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
      this.resetForm();
    },

    editar(peli) {
      this.editando = true;
      this.form = { ...peli };
    },

    cancelarEdicion() {
      this.resetForm();
    },

    eliminar(id) {
      this.peliculas = this.peliculas.filter(p => p.id !== id);
      localStorage.setItem("peliculas", JSON.stringify(this.peliculas));
    },

    verPelicula(p) {
      this.$router.push({
        name: "DetallePelicula",
        params: { id: p.id }
      });
    },

    resetForm() {
      this.editando = false;
      this.form = {
        id: null,
        titulo: "",
        autor: "",
        genero: "",
        descripcion: "",
        imagen: "",
        clasificacion: "",
        duracion: "",
        precio: ""
      };
    },

    cerrarSesion() {
      localStorage.removeItem("usuarioActual");
      this.$router.push("/");
    }
  }
};
</script>



<style scoped>
/* ══════════════════════════════════════════════════════════ */
/* 🎬 FONDO PRINCIPAL CON IMAGEN DE PALOMITAS */
/* ══════════════════════════════════════════════════════════ */
.admin-home {
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 0;
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
}

.admin-home::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 0;
}

@keyframes ambient-light {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.admin-home > * {
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════════════════════════════ */
/* 📱 MENÚ SUPERIOR MÓVIL - ESTILO APP */
/* ══════════════════════════════════════════════════════════ */
.admin-menu {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 204, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  width: 100%;
  box-sizing: border-box;
}

.admin-menu button {
  flex: 1;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.admin-menu button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 204, 0, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.admin-menu button:active::before {
  width: 300px;
  height: 300px;
}

.admin-menu button.active {
  background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
  color: #000;
  border-color: #ffcc00;
  box-shadow: 0 4px 20px rgba(255, 204, 0, 0.4);
  transform: translateY(-2px);
}

.admin-menu button:not(.active):hover {
  background: rgba(255, 204, 0, 0.1);
  border-color: rgba(255, 204, 0, 0.3);
  color: #ffcc00;
}

.logout {
  background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%) !important;
  color: white !important;
  border-color: #ff4757 !important;
}

.logout:hover {
  box-shadow: 0 4px 20px rgba(255, 71, 87, 0.4) !important;
  transform: translateY(-2px);
}

/* ══════════════════════════════════════════════════════════ */
/* 🎯 TITULO CON EFECTO NEÓN */
/* ══════════════════════════════════════════════════════════ */
.admin-home__title {
  color: #ffcc00;
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin: 24px 0;
  text-shadow: 
    0 0 10px rgba(255, 204, 0, 0.8),
    0 0 20px rgba(255, 204, 0, 0.5),
    0 0 30px rgba(255, 204, 0, 0.3);
  letter-spacing: 1px;
  animation: neon-pulse 2s ease-in-out infinite;
}

@keyframes neon-pulse {
  0%, 100% { 
    text-shadow: 
      0 0 10px rgba(255, 204, 0, 0.8),
      0 0 20px rgba(255, 204, 0, 0.5),
      0 0 30px rgba(255, 204, 0, 0.3);
  }
  50% { 
    text-shadow: 
      0 0 20px rgba(255, 204, 0, 1),
      0 0 30px rgba(255, 204, 0, 0.8),
      0 0 40px rgba(255, 204, 0, 0.5);
  }
}

/* ══════════════════════════════════════════════════════════ */
/* 📦 CONTENEDOR DE CONTENIDO - AHORA OCUPA TODA LA PANTALLA */
/* ══════════════════════════════════════════════════════════ */
.content-section {
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* ══════════════════════════════════════════════════════════ */
/* 📝 FORMULARIO TIPO MODAL MÓVIL */
/* ══════════════════════════════════════════════════════════ */
.admin-form {
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.95), rgba(30, 30, 50, 0.95));
  border: 2px solid rgba(255, 204, 0, 0.3);
  padding: 20px;
  border-radius: 24px;
  margin: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: slideInUp 0.4s ease-out;
  width: calc(100% - 32px);
  box-sizing: border-box;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-form h3 {
  color: #ffcc00;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(255, 204, 0, 0.3);
}

.admin-form__input,
.admin-form__textarea,
.admin-form__image {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 204, 0, 0.2);
  color: white;
  padding: 14px 16px;
  border-radius: 16px;
  margin-bottom: 14px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.admin-form__input:focus,
.admin-form__textarea:focus {
  outline: none;
  border-color: #ffcc00;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 4px rgba(255, 204, 0, 0.1);
  transform: translateY(-2px);
}

.admin-form__input::placeholder,
.admin-form__textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.admin-form__textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.admin-form__buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎨 BOTONES CON EFECTOS MODERNOS */
/* ══════════════════════════════════════════════════════════ */
.btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn:active::after {
  width: 300px;
  height: 300px;
}

.btn--add {
  flex: 1;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
}

.btn--add:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 210, 255, 0.5);
}

.btn--cancel {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn--cancel:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.btn--edit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 10px 16px;
  margin: 4px;
  box-shadow: 0 3px 12px rgba(240, 147, 251, 0.3);
}

.btn--delete {
  background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
  color: white;
  padding: 10px 16px;
  margin: 4px;
  box-shadow: 0 3px 12px rgba(255, 71, 87, 0.3);
}

.btn--ver {
  background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
  color: #000;
  padding: 10px 16px;
  margin: 4px;
  font-weight: 700;
  box-shadow: 0 3px 12px rgba(255, 204, 0, 0.3);
}

.btn--edit:hover,
.btn--delete:hover,
.btn--ver:hover {
  transform: translateY(-2px) scale(1.05);
}

/* ══════════════════════════════════════════════════════════ */
/* 🎬 GRID DE PELÍCULAS - ESTILO CARDS MÓVIL */
/* ══════════════════════════════════════════════════════════ */
.movie-grid {
  display: grid;
  gap: 16px;
  padding: 16px;
  grid-template-columns: 1fr;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.movie-card {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.9), rgba(20, 20, 40, 0.9));
  border: 2px solid rgba(255, 204, 0, 0.2);
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  position: relative;
  width: 100%;
}

.movie-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffcc00, #ff9900, #ffcc00);
  opacity: 0;
  transition: opacity 0.3s;
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #ffcc00;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(255, 204, 0, 0.2);
}

.movie-card:hover::before {
  opacity: 1;
}

.movie-card__poster {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 0;
  transition: transform 0.4s ease;
}

.movie-card:hover .movie-card__poster {
  transform: scale(1.05);
}

.movie-card > div {
  padding: 16px;
}

.movie-card__title {
  color: #ffcc00;
  font-size: 20px;
  font-weight: 800;
  margin: 12px 0 8px 0;
  text-shadow: 0 2px 10px rgba(255, 204, 0, 0.3);
  line-height: 1.3;
}

.movie-card__desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  min-height: 40px;
}

.movie-card__info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 6px 0;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border-left: 3px solid rgba(255, 204, 0, 0.5);
  transition: all 0.2s;
}

.movie-card__info:hover {
  background: rgba(255, 204, 0, 0.1);
  border-left-color: #ffcc00;
  transform: translateX(4px);
}

/* ══════════════════════════════════════════════════════════ */
/* 📍 SECCIÓN SUCURSALES */
/* ══════════════════════════════════════════════════════════ */
.sucursal-box {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.sucursal-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  margin-top: 20px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 2px dashed rgba(255, 204, 0, 0.3);
}

/* ══════════════════════════════════════════════════════════ */
/* 🎭 ANIMACIONES Y EFECTOS ADICIONALES */
/* ══════════════════════════════════════════════════════════ */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.movie-card {
  animation: float 6s ease-in-out infinite;
}

.movie-card:nth-child(2n) {
  animation-delay: -3s;
}

/* Scrollbar personalizado */
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
/* 📱 OPTIMIZACIÓN PARA PANTALLAS PEQUEÑAS */
/* ══════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .admin-home__title {
    font-size: 22px;
    margin: 16px 0;
  }

  .admin-menu button {
    font-size: 13px;
    padding: 10px 12px;
  }

  .movie-card__poster {
    height: 240px;
  }

  .btn {
    width: 100%;
    margin: 4px 0;
  }

  .admin-form__buttons {
    flex-direction: column;
  }
}
</style>