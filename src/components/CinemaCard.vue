<template>
  <div class="cinema-container-styled">
    
    <button class="btn-cerrar" @click="irADetallePelicula">
      <span class="back-icon">X</span>
    </button>

    <div class="content-wrapper">

      <div v-if="userRole === 'Administrador'" class="form-container">
        <h2>Agregar Nueva Sucursal/Cine</h2>

        <div class="form-grid">
          <div class="input-group">
            <label for="nombre">Nombre del Cine</label>
            <input 
              id="nombre" 
              v-model="nuevoCine.nombre" 
              placeholder="Ej. Cinépolis Centro"
              @keyup.enter="agregarCine"
            />
          </div>

          <div class="input-group">
            <label for="direccion">Dirección</label>
            <input 
              id="direccion" 
              v-model="nuevoCine.direccion" 
              placeholder="Ej. Av. Principal #123"
              @keyup.enter="agregarCine"
            />
          </div>

          <div class="input-group">
            <label for="ciudad">Ciudad</label>
            <input 
              id="ciudad" 
              v-model="nuevoCine.ciudad" 
              placeholder="Ej. Ciudad de México"
              @keyup.enter="agregarCine"
            />
          </div>

          <div class="input-group">
            <label for="telefono">Teléfono</label>
            <input 
              id="telefono" 
              v-model="nuevoCine.telefono" 
              placeholder="Ej. 555-1234-567"
              @keyup.enter="agregarCine"
            />
          </div>
        </div>

        <div class="input-group">
          <label for="descripcion">Descripción</label>
          <textarea 
            id="descripcion" 
            v-model="nuevoCine.descripcion" 
            placeholder="Descripción del cine..."
            rows="3"
            @keyup.enter="agregarCine"
          ></textarea>
        </div>

        <div class="form-buttons">
          <button class="btn-primary" @click="agregarCine">
            Agregar Sucursal
          </button>
        </div>

        <p class="mensaje" v-if="mensaje" :class="mensajeClase">{{ mensaje }}</p>
      </div>

      <div class="cines-section">
        <h2 class="subtitle-styled">
          <span class="subtitulo-icon">🍿</span>
          {{ userRole === 'Administrador' ? 'Sucursales Registradas' : 'Selecciona tu Cine' }}
        </h2>

        <div v-if="cines.length === 0" class="no-data">
          <p>📭 No hay cines registrados</p>
          <button v-if="userRole === 'Administrador'" @click="cargarEjemplos" class="btn-ejemplo">
            Cargar cines de ejemplo
          </button>
        </div>

        <div v-else class="cines-grid">
          <div v-for="cine in cines" :key="cine.id" class="cine-card-styled">
            <div class="cine-icon">🎬</div>

            <div class="cine-info">
              <h3>{{ cine.nombre }}</h3>
              <p class="direccion"><span class="icon">📍</span> {{ cine.direccion }}</p>
              <p class="ciudad"><span class="icon">🏙️</span> {{ cine.ciudad }}</p>
              <p class="telefono" v-if="cine.telefono"><span class="icon">📞</span> {{ cine.telefono }}</p>
              <p class="descripcion" v-if="cine.descripcion">{{ cine.descripcion }}</p>
            </div>

            <div class="actions" v-if="userRole === 'Administrador'">
              <button class="icon-btn edit" @click="abrirModalEditar(cine)" title="Editar">✏️</button>
              <button class="icon-btn delete" @click="eliminarCine(cine.id)" title="Eliminar">🗑️</button>
            </div>

            <div class="user-actions" v-else>
              <button class="btn-seleccionar-styled" @click="abrirModalFuncion(cine)">
                Seleccionar 🎟️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <button class="close-btn" @click="cerrarModal">✖️</button>
        <h2>Editar Sucursal</h2>

        <div class="input-group">
          <label for="edit-nombre">Nombre del Cine</label>
          <input id="edit-nombre" v-model="cineEdit.nombre" @keyup.enter="actualizarCine" />
        </div>

        <div class="input-group">
          <label for="edit-direccion">Dirección</label>
          <input id="edit-direccion" v-model="cineEdit.direccion" @keyup.enter="actualizarCine" />
        </div>

        <div class="input-group">
          <label for="edit-ciudad">Ciudad</label>
          <input id="edit-ciudad" v-model="cineEdit.ciudad" @keyup.enter="actualizarCine" />
        </div>

        <div class="input-group">
          <label for="edit-telefono">Teléfono</label>
          <input id="edit-telefono" v-model="cineEdit.telefono" @keyup.enter="actualizarCine" />
        </div>

        <div class="input-group">
          <label for="edit-descripcion">Descripción</label>
          <textarea id="edit-descripcion" v-model="cineEdit.descripcion" rows="3" @keyup.enter="actualizarCine"></textarea>
        </div>

        <p class="mensaje" v-if="mensajeModal" :class="mensajeClaseModal">{{ mensajeModal }}</p>

        <div class="modal-buttons">
          <button class="btn-primary" @click="actualizarCine">Actualizar</button>
          <button class="btn-cancel" @click="cerrarModal">Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="showModalFuncion" class="modal-overlay" @click.self="cerrarModalFuncion">
      <div class="modal modal-funcion">
        <button class="close-btn" @click="cerrarModalFuncion">✖️</button>

        <div class="modal-header">
          <div class="cine-selected-icon">🎬</div>
          <div>
            <h2>{{ cineSeleccionado.nombre }}</h2>
            <p class="cine-direccion-modal">📍 {{ cineSeleccionado.direccion }}, {{ cineSeleccionado.ciudad }}</p>
            <p class="cine-telefono-modal" v-if="cineSeleccionado.telefono">📞 {{ cineSeleccionado.telefono }}</p>
          </div>
        </div>

        <div class="funcion-content">
          <div class="input-group">
            <label for="fecha">📅 Selecciona la Fecha</label>
            <input 
              id="fecha"
              type="date"
              v-model="fechaSeleccionada" 
              @change="cargarHorarios"
              :min="fechaMinima"
              :max="fechaMaxima"
              class="date-input"
            />
          </div>

          <div class="input-group" v-if="fechaSeleccionada">
            <label>🕐 Selecciona el Horario</label>

            <div class="horarios-grid">
              <button 
                v-for="h in horariosDisponibles"
                :key="h.id"
                class="horario-btn"
                :class="{ 'horario-selected': horarioSeleccionado === h.id }"
                @click="seleccionarHorario(h.id)"
              >
                {{ h.hora }}
              </button>
            </div>

            <p v-if="horariosDisponibles.length === 0" class="no-horarios">
              No hay horarios disponibles para esta fecha
            </p>
          </div>

          <div class="modal-buttons">
            <button 
              class="btn-asientos"
              :disabled="!horarioSeleccionado"
              @click="irASeleccionAsientos"
            >
              🎫 Continuar a Asientos
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "CinemasManagement",

  data() {
    return {
      cines: [],
      nuevoCine: {
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        descripcion: ""
      },
      cineEdit: {
        id: null,
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        descripcion: ""
      },
      showModal: false,
      showModalFuncion: false,
      cineSeleccionado: {},
      mensaje: "",
      mensajeClase: "",
      mensajeModal: "",
      mensajeClaseModal: "",
      userRole: "",

      fechaSeleccionada: "",
      horarioSeleccionado: null,
      fechaMinima: "",
      fechaMaxima: "",
      horariosDisponibles: [],
      peliculaId: null,
      peliculaSeleccionada: null, // NUEVO: Para guardar el objeto película
    };
  },

  created() {
    this.cargarUsuarioActual();
    this.convertirDatosAntiguos();
    this.obtenerCines();
    this.configurarRangoFechas();
    
    // Cargar película seleccionada y su ID
    try {
      const pelicula = JSON.parse(localStorage.getItem("peliculaSeleccionada"));
      this.peliculaSeleccionada = pelicula; // Guardar el objeto completo
      this.peliculaId = pelicula ? pelicula.id : null;
    } catch (error) {
      console.error("Error al cargar película seleccionada:", error);
      this.peliculaId = null;
    }
  },

  methods: {
    // Cargar rol del usuario
    cargarUsuarioActual() {
      try {
        const usuario = JSON.parse(localStorage.getItem("currentUser"));
        this.userRole = usuario ? usuario.role : "Usuario";
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        this.userRole = "Usuario";
      }
    },

    // Convertir datos antiguos a nueva estructura
    convertirDatosAntiguos() {
      try {
        // Verificar si hay datos con la key antigua "cines"
        const datosViejos = localStorage.getItem("cines");
        if (datosViejos) {
          const cinesViejos = JSON.parse(datosViejos);
          if (cinesViejos && cinesViejos.length > 0) {
            // Convertir estructura vieja a nueva
            const cinesConvertidos = cinesViejos.map(cine => ({
              id: cine.id || Date.now(),
              nombre: cine.name || cine.nombre || "Cine sin nombre",
              direccion: cine.address || cine.direccion || "",
              ciudad: cine.ciudad || "",
              telefono: cine.telefono || "",
              descripcion: cine.descripcion || ""
            }));
            
            // Guardar en la key correcta
            localStorage.setItem("sucursales", JSON.stringify(cinesConvertidos));
            localStorage.removeItem("cines"); // Eliminar key vieja
            console.log("Datos antiguos convertidos:", cinesConvertidos);
          }
        }
      } catch (error) {
        console.error("Error al convertir datos antiguos:", error);
      }
    },

    // 🔙 Regresar a detalle de película
    irADetallePelicula() {
      if (this.peliculaId) {
        this.$router.push({ name: 'DetallePelicula', params: { id: this.peliculaId } });
      } else {
        this.$router.back();
      }
    },

    // 🔹 Cargar cines desde localStorage
    obtenerCines() {
      try {
        const datos = localStorage.getItem("sucursales");
        if (datos) {
          this.cines = JSON.parse(datos);
        } else {
          this.cines = [];
        }
        console.log("Cines cargados:", this.cines.length, "registros");
      } catch (error) {
        console.error("Error al cargar cines:", error);
        this.cines = [];
        this.mostrarMensaje("Error al cargar cines", "error");
      }
    },

    // 🔹 Guardar cines actualizados en localStorage
    guardarCines() {
      try {
        localStorage.setItem("sucursales", JSON.stringify(this.cines));
        console.log("Cines guardados:", this.cines.length, "registros");
      } catch (error) {
        console.error("Error al guardar cines:", error);
        this.mostrarMensaje("Error al guardar cines", "error");
      }
    },

    // 🔹 Agregar cine
    agregarCine() {
      if (!this.nuevoCine.nombre || !this.nuevoCine.direccion || !this.nuevoCine.ciudad) {
        this.mostrarMensaje("Completa los campos obligatorios (Nombre, Dirección, Ciudad)", "error");
        return;
      }

      try {
        const nuevoCine = {
          id: Date.now(),
          nombre: this.nuevoCine.nombre.trim(),
          direccion: this.nuevoCine.direccion.trim(),
          ciudad: this.nuevoCine.ciudad.trim(),
          telefono: this.nuevoCine.telefono.trim(),
          descripcion: this.nuevoCine.descripcion.trim()
        };

        this.cines.push(nuevoCine);
        this.guardarCines();

        this.mostrarMensaje("Sucursal agregada correctamente", "success");
        this.limpiarFormulario();
      } catch (error) {
        console.error("Error al agregar cine:", error);
        this.mostrarMensaje("Error al agregar sucursal", "error");
      }
    },

    // 🔹 Abrir modal editar
    abrirModalEditar(cine) {
      try {
        this.showModal = true;
        this.cineEdit = {
          id: cine.id,
          nombre: cine.nombre || "",
          direccion: cine.direccion || "",
          ciudad: cine.ciudad || "",
          telefono: cine.telefono || "",
          descripcion: cine.descripcion || ""
        };
      } catch (error) {
        console.error("Error al abrir modal de edición:", error);
        this.mostrarMensaje("Error al cargar datos para editar", "error");
      }
    },

    // 🔹 Cerrar modal editar
    cerrarModal() {
      this.showModal = false;
      this.cineEdit = {
        id: null,
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        descripcion: ""
      };
      this.mensajeModal = "";
    },

    // 🔹 Actualizar cine
    actualizarCine() {
      if (!this.cineEdit.nombre || !this.cineEdit.direccion || !this.cineEdit.ciudad) {
        this.mostrarMensajeModal("Completa los campos obligatorios", "error");
        return;
      }

      try {
        const index = this.cines.findIndex(c => c.id === this.cineEdit.id);

        if (index !== -1) {
          this.cines[index] = { ...this.cineEdit };
          this.guardarCines();
          this.mostrarMensaje("Sucursal actualizada correctamente", "success");
          this.cerrarModal();
        } else {
          this.mostrarMensajeModal("No se encontró la sucursal para editar", "error");
        }
      } catch (error) {
        console.error("Error al actualizar cine:", error);
        this.mostrarMensajeModal("Error al actualizar sucursal", "error");
      }
    },

    // 🔹 Eliminar cine
    eliminarCine(id) {
      if (!confirm("¿Estás seguro de eliminar esta sucursal? Esta acción no se puede deshacer.")) {
        return;
      }

      try {
        this.cines = this.cines.filter(c => c.id !== id);
        this.guardarCines();
        this.mostrarMensaje("Sucursal eliminada", "success");
      } catch (error) {
        console.error("Error al eliminar cine:", error);
        this.mostrarMensaje("Error al eliminar sucursal", "error");
      }
    },

    // 🔹 Cargar cines de ejemplo (solo para desarrollo)
    cargarEjemplos() {
      const ejemplos = [
        {
          id: Date.now(),
          nombre: "Cinépolis Galerías",
          direccion: "Av. Revolución 1500",
          ciudad: "Guadalajara",
          telefono: "33-1234-5678",
          descripcion: "Cine premium con sala VIP"
        },
        {
          id: Date.now() + 1,
          nombre: "Cinemex Plaza Patria",
          direccion: "Blvd. López Mateos 2400",
          ciudad: "Zapopan",
          telefono: "33-8765-4321",
          descripcion: "12 salas, incluye 4DX"
        },
        {
          id: Date.now() + 2,
          nombre: "Cinepolis Centro Magno",
          direccion: "Av. Vallarta 2425",
          ciudad: "Guadalajara",
          telefono: "33-5555-1234",
          descripcion: "Ubicación céntrica, estacionamiento gratuito"
        }
      ];

      this.cines = [...this.cines, ...ejemplos];
      this.guardarCines();
      this.mostrarMensaje("Cines de ejemplo cargados", "success");
    },

    // 🔹 Abrir modal de selección de función
    abrirModalFuncion(cine) {
      try {
        this.cineSeleccionado = { ...cine };
        this.showModalFuncion = true;

        this.fechaSeleccionada = "";
        this.horarioSeleccionado = null;
        this.horariosDisponibles = [];
        this.configurarRangoFechas();
      } catch (error) {
        console.error("Error al abrir modal de función:", error);
        this.mostrarMensaje("Error al cargar información del cine", "error");
      }
    },

    cerrarModalFuncion() {
      this.showModalFuncion = false;
      this.cineSeleccionado = {};
      this.fechaSeleccionada = "";
      this.horarioSeleccionado = null;
      this.horariosDisponibles = [];
    },

    // 🔹 Rango de fechas
    configurarRangoFechas() {
      try {
        const hoy = new Date();
        this.fechaMinima = hoy.toISOString().split("T")[0];

        const max = new Date();
        max.setDate(hoy.getDate() + 30);
        this.fechaMaxima = max.toISOString().split("T")[0];
      } catch (error) {
        console.error("Error al configurar rango de fechas:", error);
        const hoy = new Date();
        this.fechaMinima = hoy.toISOString().split("T")[0];
        this.fechaMaxima = this.fechaMinima;
      }
    },

    cargarHorarios() {
      if (!this.fechaSeleccionada) return;

      try {
        // Horarios de ejemplo (en un sistema real, esto vendría de una API)
        this.horariosDisponibles = [
          { id: 1, hora: "12:00 PM", sala: "Sala 1", tipo: "3D" },
          { id: 2, hora: "15:30 PM", sala: "Sala 2", tipo: "Tradicional" },
          { id: 3, hora: "18:00 PM", sala: "Sala 3", tipo: "VIP" },
          { id: 4, hora: "20:30 PM", sala: "Sala 4", tipo: "4DX" },
          { id: 5, hora: "23:00 PM", sala: "Sala 5", tipo: "Tradicional" },
        ];

        this.horarioSeleccionado = null;
      } catch (error) {
        console.error("Error al cargar horarios:", error);
        this.horariosDisponibles = [];
        this.mostrarMensajeModal("Error al cargar horarios disponibles", "error");
      }
    },

    seleccionarHorario(id) {
      this.horarioSeleccionado = id;
    },

    // 🔹 Guardar datos y navegar a selección de asientos
    irASeleccionAsientos() {
      if (!this.horarioSeleccionado) {
        this.mostrarMensajeModal("Selecciona un horario antes de continuar", "error");
        return;
      }

      try {
        const horario = this.horariosDisponibles.find(h => h.id === this.horarioSeleccionado);
        
        // **✅ CORRECCIÓN CLAVE**
        // REDUCIR el tamaño del objeto guardado en localStorage.
        const funcionData = {
          // Guardamos solo la información esencial y los IDs
          id: Date.now(), // ID único para esta función (si fuera de DB usarías el real)
          cineId: this.cineSeleccionado.id, 
          nombreCine: this.cineSeleccionado.nombre,
          peliculaId: this.peliculaSeleccionada ? this.peliculaSeleccionada.id : null,
          tituloPelicula: this.peliculaSeleccionada ? this.peliculaSeleccionada.titulo : "Pelicula Desconocida",
          fecha: this.fechaSeleccionada,
          horario: horario.hora, // Solo la hora
          horarioId: horario.id,
          sala: horario.sala, // Opcional: información de la sala si es importante para la vista de asientos
          tipo: horario.tipo,
          precio: this.peliculaSeleccionada ? this.peliculaSeleccionada.precio : 0, // Precio base de la película
          timestamp: new Date().toISOString()
        };

        // Almacenar el objeto simplificado
        localStorage.setItem("funcionSeleccionada", JSON.stringify(funcionData));

        // Redirigir a la siguiente vista
        this.$router.push("/asientos");
      } catch (error) {
        console.error("Error al guardar función seleccionada:", error);
        // Manejo específico del error de cuota
        if (error.name === 'QuotaExceededError') {
          alert("🛑 ERROR DE COMPRA: No se pudo iniciar la selección de asientos. El navegador tiene la memoria llena para esta aplicación. Por favor, limpia el historial del navegador (Cookies y otros datos de sitios) e inténtalo de nuevo.");
        } else {
          this.mostrarMensajeModal("Error al procesar la selección", "error");
        }
      }
    },

    limpiarFormulario() {
      this.nuevoCine = {
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        descripcion: ""
      };
    },

    mostrarMensaje(texto, tipo) {
      this.mensaje = texto;
      this.mensajeClase = tipo;
      setTimeout(() => {
        this.mensaje = "";
        this.mensajeClase = "";
      }, 3000);
    },

    mostrarMensajeModal(texto, tipo) {
      this.mensajeModal = texto;
      this.mensajeClaseModal = tipo;
      setTimeout(() => {
        this.mensajeModal = "";
        this.mensajeClaseModal = "";
      }, 3000);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

/* ══════════════════════════════════════════════════════════ */
/* RESET PARA EVITAR PROBLEMAS DE VISUALIZACIÓN */
/* ══════════════════════════════════════════════════════════ */
.cinema-container-styled,
.cinema-container-styled * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ══════════════════════════════════════════════════════════ */
/* 🍿 CONTENEDOR PRINCIPAL CON FONDO DE PALOMITAS */
/* ══════════════════════════════════════════════════════════ */
.cinema-container-styled {
  min-height: 100vh;
  width: 100%;
  margin: 0;
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

/* Oscurecimiento y Blur */
.cinema-container-styled::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.88) 100%);
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 0;
}

.cinema-container-styled > * {
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════════════════════════════ */
/* ❌ BOTÓN CERRAR - ESQUINA SUPERIOR DERECHA */
/* ══════════════════════════════════════════════════════════ */
.btn-cerrar { 
  position: fixed;
  top: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ff0000, #cc0000);
  border: 2px solid rgba(255, 0, 0, 0.4);
  border-radius: 50%;
  color: white;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  line-height: 1;
  padding: 0;
}

.btn-cerrar:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 
    0 6px 30px rgba(255, 0, 0, 0.6),
    0 0 40px rgba(255, 0, 0, 0.4);
  background: linear-gradient(135deg, #ff3333, #ff0000);
}

.btn-cerrar:active {
  transform: scale(0.95) rotate(90deg);
}

/* ══════════════════════════════════════════════════════════ */
/* 📜 SCROLLBAR DORADO */
/* ══════════════════════════════════════════════════════════ */
.cinema-container-styled::-webkit-scrollbar {
  width: 8px;
}

.cinema-container-styled::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.4);
}

.cinema-container-styled::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffcc00, #ff9900);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.cinema-container-styled::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff9900, #ffcc00);
  box-shadow: 0 0 12px rgba(255, 204, 0, 0.6);
}

/* ══════════════════════════════════════════════════════════ */
/* 📝 CONTENIDO PRINCIPAL CON ESPACIO ADECUADO */
/* ══════════════════════════════════════════════════════════ */
.content-wrapper {
  padding-top: 100px !important; /* Aumentado aún más */
  padding: 25px 20px 20px 20px; /* Más padding superior */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}

/* Subtítulo Estilizado */
.subtitle-styled {
  font-size: 28px;
  margin: 0 0 30px 0;
  font-weight: 800;
  color: #ffcc00;
  text-align: left;
  text-shadow: 0 2px 12px rgba(255, 204, 0, 0.5);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding-top: 10px; /* Espacio adicional */
}

.subtitulo-icon {
  font-size: 34px;
  filter: drop-shadow(0 2px 10px rgba(255, 204, 0, 0.4));
}

/* Formulario del Admin */
.form-container {
  margin: 0 auto 40px auto;
  max-width: 800px;
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.97), rgba(10, 10, 30, 0.97));
  border: 3px solid rgba(255, 204, 0, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 60px rgba(255, 204, 0, 0.1);
  padding: 30px;
  border-radius: 25px;
  margin-top: 10px; /* Espacio desde la parte superior */
}

.form-container h2 {
  text-align: center;
  color: #ffcc00;
  margin-bottom: 25px;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 12px rgba(255, 204, 0, 0.5);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px; 
  width: 100%;
}

.input-group label {
  color: #ffcc00;
  font-weight: 600;
  font-size: 1.1rem;
}

.input-group input,
.input-group textarea {
  background: #202020;
  border: 2px solid #ffb80060;
  border-radius: 18px; 
  color: #fff;
  padding: 16px 20px;
  font-size: 1.15rem;
  width: 100%;
  transition: 0.25s;
  box-sizing: border-box;
  min-height: 55px; 
  font-family: inherit;
  resize: vertical;
}

.input-group textarea {
  min-height: 100px;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #ffcc00;
  background: #2a2a2a;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
}

.form-buttons {
  margin-top: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  color: #000;
  border: none;
  border-radius: 18px;
  padding: 16px 25px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(255, 184, 0, 0.5);
}

.btn-primary:hover {
  box-shadow: 0 6px 22px rgba(255, 184, 0, 0.8);
  transform: translateY(-3px);
}

.btn-ejemplo {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 15px;
  font-size: 0.9rem;
}

.btn-ejemplo:hover {
  background: linear-gradient(135deg, #5a6268, #3d4349);
  transform: translateY(-2px);
}

.mensaje {
  padding: 12px;
  border-radius: 12px;
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  transition: opacity 0.3s;
}

.success {
  background-color: #4caf5020;
  color: #4caf50;
  border: 1px solid #4caf50;
}

.error {
  background-color: #f4433620;
  color: #f44336;
  border: 1px solid #f44336;
}

.no-data {
  text-align: center;
  color: #ccc;
  padding: 40px;
  border: 2px dashed #333;
  border-radius: 15px;
  margin-top: 30px;
  font-size: 1.1rem;
}

/* ══════════════════════════════════════════════════════════ */
/* 🎬 GRID DE CINES - RESPONSIVE */
/* ══════════════════════════════════════════════════════════ */
.cines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  padding: 0;
  margin-top: 25px;
  width: 100%;
}

.cine-card-styled {
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.97), rgba(10, 10, 30, 0.97));
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
  border: 3px solid rgba(255, 204, 0, 0.4);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 250px;
  width: 100%;
  box-sizing: border-box;
}

.cine-card-styled:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 204, 0, 0.2);
  border-color: #ffcc00;
}

.cine-icon {
  font-size: 3.5rem; 
  margin-bottom: 15px;
  filter: drop-shadow(0 2px 8px rgba(255, 204, 0, 0.3));
}

.cine-info {
  flex-grow: 1;
  width: 100%;
  margin-bottom: 20px;
}

.cine-info h3 {
  color: #ffcc00;
  font-size: 1.6rem;
  margin-bottom: 10px;
  word-wrap: break-word;
  text-shadow: 0 0 8px rgba(255, 204, 0, 0.4);
  line-height: 1.3;
}

.direccion, .ciudad, .telefono {
  color: #aaa;
  font-size: 1rem;
  margin-bottom: 8px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.descripcion {
  color: #888;
  font-size: 0.9rem;
  margin-top: 10px;
  font-style: italic;
  line-height: 1.4;
}

.icon {
  font-size: 1.2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: auto; 
  width: 100%;
}

.icon-btn {
  background: #333;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.icon-btn.edit:hover {
  background: #007bff;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.6);
  transform: scale(1.1);
}

.icon-btn.delete:hover {
  background: #dc3545;
  box-shadow: 0 0 20px rgba(220, 53, 69, 0.6);
  transform: scale(1.1);
}

/* 🎟️ Botón de Selección de Usuario */
.user-actions {
  margin-top: auto;
  width: 100%;
}

.btn-seleccionar-styled {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  color: #000;
  border: 3px solid rgba(255, 204, 0, 0.5);
  border-radius: 20px;
  padding: 16px 25px;
  font-weight: 800;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  margin-top: 15px;
  box-shadow: 0 4px 20px rgba(255, 204, 0, 0.4);
}

.btn-seleccionar-styled:hover {
  box-shadow: 0 8px 30px rgba(255, 204, 0, 0.7);
  transform: translateY(-3px) scale(1.02);
}

.btn-seleccionar-styled:active {
  transform: translateY(-1px) scale(0.99);
}

/* --- MODALES --- */
.modal-overlay {
  position: fixed;
  inset: 0; 
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: #1f1f1f;
  border-radius: 20px;
  width: calc(100% - 40px);
  max-width: 600px; 
  min-height: auto;
  padding: 30px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
  animation: fadeInScale 0.35s ease-out;
  overflow-y: auto;
  position: relative; 
  max-height: 90vh;
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

.modal .close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.2s;
  z-index: 10;
}

.modal .close-btn:hover {
  color: #ffcc00;
}

.modal h2 {
  color: #ffcc00;
  margin-bottom: 25px;
  font-size: 1.8rem;
  text-align: center;
  text-shadow: 0 2px 10px rgba(255, 204, 0, 0.5);
}

.modal-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel {
  background: #333;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 16px 25px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  flex: 1;
}

.btn-cancel:hover {
  background: #555;
  transform: translateY(-2px);
}

.modal-buttons .btn-primary {
  flex: 1;
}

/* Modal Selección de Función */
.modal-funcion .modal-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
}

.cine-selected-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 8px rgba(255, 204, 0, 0.3));
}

.cine-direccion-modal {
  color: #aaa;
  font-size: 1.1rem;
  margin-top: 5px;
}

.cine-telefono-modal {
  color: #888;
  font-size: 1rem;
  margin-top: 5px;
}

/* 📅 Calendario */
.date-input {
  appearance: none;
  background: #262626;
  border: 2px solid #ffcc0060;
  border-radius: 14px;
  padding: 16px;
  color: #fff;
  font-size: 1.1rem;
  width: 100%;
  min-height: 55px;
  cursor: pointer;
  font-family: inherit;
}

.date-input:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

/* HORARIOS */
.horarios-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.horario-btn {
  background: #2b2b2b;
  color: #fff;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  padding: 14px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  font-size: 1.1rem;
  min-width: 100px;
  flex: 1;
  font-family: inherit;
}

.horario-btn:hover {
  border-color: #ffb800;
  background: #3a3a3a;
  transform: translateY(-2px);
}

.horario-selected {
  background: #ffb800;
  color: #000;
  border-color: #ffb800;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(255, 184, 0, 0.5);
}

.no-horarios {
  color: #f44336;
  font-weight: 500;
  margin-top: 15px;
  text-align: center;
  padding: 10px;
  border: 1px solid #f44336;
  border-radius: 10px;
  background: rgba(244, 67, 54, 0.1);
}

.btn-asientos {
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
  border: none;
  border-radius: 18px;
  padding: 16px 25px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.5);
}

.btn-asientos:hover:not(:disabled) {
  box-shadow: 0 6px 22px rgba(76, 175, 80, 0.8);
  transform: translateY(-3px);
}

.btn-asientos:disabled {
  background: #555;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cines-grid {
    grid-template-columns: minmax(300px, 1fr);
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .modal {
    max-width: 450px;
  }
  .horario-btn {
    flex: 0 0 calc(50% - 7.5px);
  }
}
</style>