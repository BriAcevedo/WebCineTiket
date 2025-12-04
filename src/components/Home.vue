<template>
  <div class="home-container">
    <!-- 🔹 Navbar -->
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/logo.jpeg" alt="CineTicket Logo" />
        <span>CineTicket</span>
      </div>
      <ul class="menu">
        <li v-if="userRole === 'Administrador'">
          <a href="#" @click.prevent="irASucursales">Sucursales</a>
        </li>
        <li><a href="#" @click.prevent="logout">Cerrar sesión</a></li>
      </ul>
    </nav>

    <!-- 🔹 Contenido principal -->
    <div class="content">
      <h1 class="title">🎬 Cartelera de Películas</h1>

      <!-- FORMULARIO (ADMIN) -->
      <div v-if="userRole === 'Administrador'" class="form-container">
        <h2>Agregar Película</h2>

        <div class="form-grid">
          <div class="input-group">
            <label for="titulo">Título</label>
            <input id="titulo" v-model="pelicula.titulo" placeholder="Ej. Avatar" />
          </div>

          <div class="input-group">
            <label for="descripcion">Descripción</label>
            <input id="descripcion" v-model="pelicula.descripcion" placeholder="Sinopsis o resumen" />
          </div>

          <div class="input-group">
            <label for="duracion">Duración</label>
            <input id="duracion" v-model="pelicula.duracion" placeholder="Ej. 2h 15m" />
          </div>

          <div class="input-group">
            <label for="clasificacion">Clasificación</label>
            <input id="clasificacion" v-model="pelicula.clasificacion" placeholder="Ej. PG-13" />
          </div>

          <div class="input-group">
            <label for="genero">Género</label>
            <input id="genero" v-model="pelicula.genero" placeholder="Ej. Ciencia Ficción" />
          </div>

          <div class="input-group">
            <label for="fechaEstreno">Fecha Estreno</label>
            <input id="fechaEstreno" type="date" v-model="pelicula.fechaEstreno" />
          </div>

          <div class="input-group">
            <label for="precio">Precio</label>
            <input id="precio" type="number" step="0.01" v-model.number="pelicula.precio" placeholder="Ej. 80.00" />
          </div>

          <div class="input-group">
            <label>Seleccionar Imagen</label>
            <input type="file" @change="onFileSelected" accept="image/*" />
          </div>
        </div>

        <div v-if="pelicula.imagenUrl" class="preview">
          <p>Vista previa:</p>
          <img :src="pelicula.imagenUrl" alt="Vista previa" />
        </div>

        <label class="estado-label">
          Estado:
          <input type="checkbox" v-model="pelicula.estado" />
          <span>{{ pelicula.estado ? "Activo" : "Inactivo" }}</span>
        </label>

        <button class="btn-primary" @click="guardarPelicula">Agregar Película</button>
      </div>

      <!-- 🔹 Tarjetas de Películas -->
      <div class="card-grid">
        <div v-for="p in peliculas" :key="p.idPelicula" class="movie-card">
          <div
            class="poster-container"
            @mouseenter="mostrarVerMas(p.idPelicula)"
            @mouseleave="ocultarVerMas"
          >
            <img :src="p.imagenUrl" alt="Poster" class="poster" />

            <div
              v-if="userRole !== 'Administrador' && hoveredMovie === p.idPelicula"
              class="ver-mas-overlay"
              @click="abrirDetalles(p)"
            >
              <span class="ver-mas-text">👁️ Ver más</span>
            </div>
          </div>

          <div class="info">
            <h3>{{ p.titulo }}</h3>
            <p class="desc">{{ p.descripcion }}</p>

            <div class="detalles-pelicula">
              <p><strong>Duración:</strong> {{ p.duracion }}</p>
              <p><strong>Clasificación:</strong> {{ p.clasificacion }}</p>
              <p><strong>Género:</strong> {{ p.genero }}</p>
              <p><strong>Precio:</strong> ${{ p.precio.toFixed(2) }}</p>
              <p><strong>Estado:</strong> {{ p.estado ? "Activo" : "Inactivo" }}</p>
              <p><strong>Estreno:</strong> {{ new Date(p.fechaEstreno).toLocaleDateString() }}</p>
            </div>

            <div class="actions" v-if="userRole === 'Administrador'">
              <button class="icon-btn edit" @click="abrirModal(p)">✏️</button>
              <button class="icon-btn delete" @click="eliminarPelicula(p.idPelicula)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 MODAL EDITAR -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Editar Película</h2>

        <div class="input-group" v-for="(value, key) in camposEditables" :key="key">
          <label>{{ value }}</label>

          <input
            v-if="key !== 'fechaEstreno' && key !== 'precio'"
            v-model="pelicula[key]"
          />

          <input v-if="key === 'fechaEstreno'" type="date" v-model="pelicula.fechaEstreno" />

          <input v-if="key === 'precio'" type="number" step="0.01" v-model="pelicula.precio" />
        </div>

        <div class="input-group">
          <label>Actualizar Imagen</label>
          <input type="file" @change="onFileSelected" accept="image/*" />
          <img v-if="pelicula.imagenUrl" :src="pelicula.imagenUrl" class="preview-img" />
        </div>

        <label class="estado-label">
          Estado:
          <input type="checkbox" v-model="pelicula.estado" />
          <span>{{ pelicula.estado ? "Activo" : "Inactivo" }}</span>
        </label>

        <div class="modal-buttons">
          <button class="btn-primary" @click="guardarPelicula">Actualizar</button>
          <button class="btn-cancel" @click="cerrarModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- 🔹 MODAL DETALLES -->
    <div v-if="showDetalles" class="modal-overlay">
      <div class="modal modal-detalles">
        <button class="close-btn" @click="cerrarDetalles">✖️</button>

        <div class="detalles-contenido">
          <img :src="peliculaSeleccionada.imagenUrl" class="detalles-poster" />

          <div class="detalles-info">
            <h2>{{ peliculaSeleccionada.titulo }}</h2>
            <p>{{ peliculaSeleccionada.descripcion }}</p>

            <div class="detalles-grid">
              <div><strong>Duración:</strong> {{ peliculaSeleccionada.duracion }}</div>
              <div><strong>Género:</strong> {{ peliculaSeleccionada.genero }}</div>
              <div><strong>Clasificación:</strong> {{ peliculaSeleccionada.clasificacion }}</div>
              <div><strong>Estreno:</strong> {{ new Date(peliculaSeleccionada.fechaEstreno).toLocaleDateString() }}</div>
              <div><strong>Precio:</strong> ${{ peliculaSeleccionada.precio.toFixed(2) }}</div>
            </div>

            <button class="btn-continuar" @click="continuar">Continuar →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      peliculas: [],
      pelicula: {
        idPelicula: null,
        titulo: "",
        descripcion: "",
        duracion: "",
        clasificacion: "",
        genero: "",
        estado: true,
        fechaEstreno: "",
        imagenUrl: "",
        precio: 0,
      },
      showModal: false,
      showDetalles: false,
      peliculaSeleccionada: {},
      hoveredMovie: null,
      editMode: false,

      userRole: localStorage.getItem("userRole") || "",

      camposEditables: {
        titulo: "Título",
        descripcion: "Descripción",
        duracion: "Duración",
        clasificacion: "Clasificación",
        genero: "Género",
        fechaEstreno: "Fecha Estreno",
        precio: "Precio",
      },
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      this.$router.push("/");
    },

    irASucursales() {
      this.$router.push("/cinemas");
    },

    // 📌 OBTENER PELÍCULAS DESDE LOCALSTORAGE
    obtenerPeliculas() {
      const data = JSON.parse(localStorage.getItem("peliculas"));
      this.peliculas = data || [];
    },

    // 📌 SUBIR IMAGEN (local temporal)
    onFileSelected(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.pelicula.imagenUrl = reader.result; // base64
      };
      reader.readAsDataURL(file);
    },

    // 📌 GUARDAR (CREATE / UPDATE)
    guardarPelicula() {
      if (!this.pelicula.titulo.trim())
        return alert("⚠️ El título es obligatorio");

      let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];

      if (this.editMode) {
        const index = peliculas.findIndex(p => p.idPelicula === this.pelicula.idPelicula);
        peliculas[index] = { ...this.pelicula };
        alert("Película actualizada");
      } else {
        this.pelicula.idPelicula = Date.now();
        peliculas.push({ ...this.pelicula });
        alert("Película agregada");
      }

      localStorage.setItem("peliculas", JSON.stringify(peliculas));

      this.obtenerPeliculas();
      this.cerrarModal();
    },

    abrirModal(p) {
      this.pelicula = {
        ...p,
        fechaEstreno: p.fechaEstreno
          ? new Date(p.fechaEstreno).toISOString().split("T")[0]
          : "",
      };

      this.editMode = true;
      this.showModal = true;
    },

    cerrarModal() {
      this.showModal = false;
      this.editMode = false;

      this.pelicula = {
        idPelicula: null,
        titulo: "",
        descripcion: "",
        duracion: "",
        clasificacion: "",
        genero: "",
        estado: true,
        fechaEstreno: "",
        imagenUrl: "",
        precio: 0,
      };
    },

    eliminarPelicula(id) {
      if (!confirm("¿Eliminar película?")) return;

      let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];
      peliculas = peliculas.filter(p => p.idPelicula !== id);

      localStorage.setItem("peliculas", JSON.stringify(peliculas));

      this.obtenerPeliculas();
      alert("Película eliminada");
    },

    mostrarVerMas(id) {
      this.hoveredMovie = id;
    },

    ocultarVerMas() {
      this.hoveredMovie = null;
    },

    abrirDetalles(p) {
      this.peliculaSeleccionada = p;
      this.showDetalles = true;
    },

    cerrarDetalles() {
      this.showDetalles = false;
    },

    continuar() {
      localStorage.setItem(
        "peliculaSeleccionada",
        JSON.stringify(this.peliculaSeleccionada)
      );

      this.$router.push("/cinemas");
    },
  },

  mounted() {
    this.obtenerPeliculas();
  },
};
</script>



<style scoped>
/* 🎬 DISEÑO APP MÓVIL PROFESIONAL - HONOR X7 */
.home-container {
  background: #0a0a0a;
  min-height: 100vh;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  padding-bottom: 20px;
  max-width: 420px;
  margin: 0 auto;
  position: relative;
}

/* 🔹 Navbar Estilo App */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.logo span {
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.3px;
}

.menu {
  display: flex;
  gap: 12px;
  list-style: none;
  align-items: center;
}

.menu li a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
  padding: 6px 10px;
  border-radius: 8px;
}

.menu li a:hover {
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.08);
}

/* 🔹 Título */
.title {
  text-align: center;
  color: #fff;
  margin: 20px 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
  padding: 0 16px;
}

/* 🔹 Contenido */
.content {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 🔹 Formulario Admin - Estilo App */
.form-container {
  background: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(40px);
  border-radius: 16px;
  padding: 20px 16px;
  margin: 0 0 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
}

.form-container h2 {
  color: #fff;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 13px;
  letter-spacing: -0.1px;
}

.input-group input {
  background: rgba(58, 58, 60, 0.6);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  padding: 11px 14px;
  font-size: 15px;
  transition: all 0.2s;
}

.input-group input:focus {
  outline: none;
  background: rgba(58, 58, 60, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.preview {
  margin-top: 12px;
  text-align: center;
}

.preview p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  font-size: 13px;
}

.preview img {
  width: 100px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 🔹 Grid de Cards - Estilo App */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.movie-card {
  background: rgba(28, 28, 30, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 0.5px solid rgba(255, 255, 255, 0.08);
}

.movie-card:active {
  transform: scale(0.98);
}

.poster-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ver-mas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.ver-mas-text {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info {
  padding: 12px;
}

.info h3 {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
  line-height: 1.3;
}

.info p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
  line-height: 1.4;
}

.desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detalles-pelicula {
  margin-top: 8px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 0.5px solid rgba(255, 255, 255, 0.1);
}

/* 🔹 Botones Estilo iOS */
.btn-primary {
  display: block;
  margin: 20px auto 0;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-size: 15px;
  letter-spacing: -0.2px;
}

.btn-primary:active {
  opacity: 0.7;
}

.icon-btn {
  font-size: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.icon-btn:active {
  background: rgba(255, 255, 255, 0.15);
}

.edit { color: #64d2ff; }
.delete { color: #ff453a; }

/* 🔹 Modal Estilo App */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: rgba(28, 28, 30, 0.98);
  backdrop-filter: blur(40px);
  border-radius: 24px 24px 0 0;
  padding: 24px 20px 40px;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal h2 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.4px;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-buttons button {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-buttons button:active {
  opacity: 0.7;
}

.btn-cancel {
  background: rgba(255, 69, 58, 0.2);
  color: #ff453a;
}

/* 🔹 Modal Detalles - ESTILO APP MÓVIL HONOR X7 */
.modal-detalles {
  max-width: 420px;
  width: 95%;
  max-height: 85vh;
  border-radius: 24px;
  padding: 0;
  animation: slideUp 0.3s ease;
  background: #0a0a0a;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  font-size: 16px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

.close-btn:active {
  opacity: 0.7;
  transform: scale(0.95);
}

.detalles-contenido {
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.detalles-poster {
  width: 100%;
  height: 280px;
  object-fit: cover;
  flex-shrink: 0;
}

.detalles-info {
  padding: 20px 18px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
}

.detalles-info h2 {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.detalles-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
  margin-bottom: 20px;
  max-height: 100px;
  overflow-y: auto;
}

.detalles-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.06);
}

.detalle-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.detalle-item span:last-child {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.precio-destaque {
  font-size: 20px;
  font-weight: 700;
  color: #30d158;
}

.btn-continuar {
  width: 100%;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: -0.2px;
  box-shadow: 0 2px 12px rgba(0, 122, 255, 0.3);
}

.btn-continuar:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.estado-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.7);
  margin: 16px 0;
  font-weight: 500;
  font-size: 14px;
}

.estado-label input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #007aff;
}

/* 🔹 Scrollbar Personalizado */
.modal::-webkit-scrollbar,
.detalles-contenido::-webkit-scrollbar {
  width: 0;
}

/* Responsive */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
  
  .modal {
    border-radius: 24px;
    max-width: 600px;
    max-height: 85vh;
    padding: 32px 28px;
  }
  
  /* Modal detalles mantiene dimensiones de celular en todas las pantallas */
  .modal-detalles {
    max-width: 420px;
    border-radius: 24px;
  }
  
  .detalles-poster {
    height: 300px;
  }
  
  .detalles-info {
    padding: 24px 20px;
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
  }
  
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* En desktop sigue simulando pantalla de celular */
  .modal-detalles {
    max-width: 420px;
  }
}
</style>