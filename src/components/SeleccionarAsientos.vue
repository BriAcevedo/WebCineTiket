<template>
  <div class="cinema-container-full">

    <!-- Botón Cerrar en app móvil -->
    <button 
      @click="irACines"
      :style="{
        alignSelf: 'flex-end',
        margin: '16px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#FF4757',
        color: '#fff',
        border: 'none',
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }"
    >
      X
    </button>

    <div class="content">

      <h1 class="page-title">Selecciona tus asientos</h1>

      <!-- Info de la película y función -->
      <p class="subtitle">
        Película: <strong>{{ pelicula.titulo }}</strong> |
        {{ funcion?.horario?.hora || 'Hora no definida' }},
        {{ funcion?.cine?.name || 'Sucursal no definida' }}
      </p>

      <div class="asientos-container">

        <!-- Leyenda -->
        <div class="leyenda-asientos">
          <div class="leyenda-item">
            <span class="leyenda-box disponible-color"></span> Disponible
          </div>
          <div class="leyenda-item">
            <span class="leyenda-box ocupado-color"></span> Ocupado
          </div>
          <div class="leyenda-item">
            <span class="leyenda-box seleccionado-color"></span> Seleccionado
          </div>
        </div>

        <!-- Pantalla -->
        <div class="pantalla">PANTALLA</div>

        <!-- Asientos -->
        <div class="asientos-grid">
          <div
            v-for="(asiento, index) in asientos"
            :key="index"
            :class="['asiento', asiento.estado, { seleccionado: asiento.seleccionado }]"
            @click="toggleSeleccion(asiento)"
          >
            {{ asiento.nombre }}
          </div>
        </div>

        <!-- Resumen -->
        <div class="resumen">
          <p>
            Asientos Seleccionados ({{ asientosSeleccionados.length }}):
            <strong :class="{ 'text-yellow': asientosSeleccionados.length > 0 }">
              {{ asientosSeleccionados.join(', ') || 'Ninguno' }}
            </strong>
          </p>

          <!-- Botón Continuar -->
          <button 
            class="btn-primary"
            @click="irAlCarrito"
            :disabled="asientosSeleccionados.length === 0"
          >
            Continuar ({{ asientosSeleccionados.length }})
          </button>
        </div>

        <div v-if="mensajeConfirmacion" :class="['mensaje', mensajeTipo]">
          {{ mensajeConfirmacion }}
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "SeleccionarAsientos",
  data() {
    return {
      asientos: [],
      precioUnitario: 80,
      mensajeConfirmacion: null,
      mensajeTipo: "",

      // Función seleccionada y película desde localStorage
      funcion: JSON.parse(localStorage.getItem("funcionSeleccionada")) || null,
      pelicula: JSON.parse(localStorage.getItem("peliculaSeleccionada")) || { titulo: "Película no definida" }
    };
  },

  computed: {
    asientosSeleccionados() {
      return this.asientos.filter(a => a.seleccionado).map(a => a.nombre);
    },
    precioTotal() {
      return this.asientosSeleccionados.length * this.precioUnitario;
    }
  },

  methods: {
    irACines() {
      this.$router.push("/cinemas");
    },

    crearAsientos() {
      const filas = ["A", "B", "C", "D", "E", "F"];
      const columnas = 10;

      let lista = [];
      filas.forEach(fila => {
        for (let i = 1; i <= columnas; i++) {
          lista.push({
            nombre: `${fila}${i}`,
            estado: "disponible",
            seleccionado: false,
          });
        }
      });

      this.asientos = lista;
    },

    toggleSeleccion(asiento) {
      if (asiento.estado === "ocupado") return;
      asiento.seleccionado = !asiento.seleccionado;
    },

    guardarAsientos() {
      localStorage.setItem("asientosGuardados", JSON.stringify(this.asientos));
    },

    cargarAsientos() {
      // Cargar asientos iniciales
      const guardados = localStorage.getItem("asientosGuardados");
      if (guardados) {
        this.asientos = JSON.parse(guardados);
      } else {
        this.crearAsientos();
      }

      // Marcar asientos previamente pagados como ocupados
      const asientosOcupados = JSON.parse(localStorage.getItem("asientosOcupados")) || [];
      this.asientos.forEach(asiento => {
        if (asientosOcupados.includes(asiento.nombre)) {
          asiento.estado = "ocupado";
        }
      });
    },

    irAlCarrito() {
      if (this.asientosSeleccionados.length === 0) return;

      const itemCarrito = {
        idPelicula: this.pelicula.idPelicula || null,
        pelicula: this.pelicula.titulo || "Película no definida",
        imagen: this.pelicula.imagen || "/images/default.jpg",
        sucursal: this.funcion?.cine?.name || "Sucursal no definida",
        hora: this.funcion?.horario?.hora || "Hora no definida",
        asientos: this.asientosSeleccionados,
        cantidad: this.asientosSeleccionados.length,
        precio: Number(this.pelicula.precio) || this.precioUnitario,
        total: this.asientosSeleccionados.length * (Number(this.pelicula.precio) || this.precioUnitario),
        pagado: true
      };

      // Guardar en carrito
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (!Array.isArray(carrito)) carrito = [carrito];
      carrito.push(itemCarrito);
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Marcar los asientos seleccionados como ocupados
      let asientosOcupados = JSON.parse(localStorage.getItem("asientosOcupados")) || [];
      asientosOcupados.push(...this.asientosSeleccionados);
      localStorage.setItem("asientosOcupados", JSON.stringify(asientosOcupados));

      // Actualizar estado local de asientos
      this.asientos.forEach(asiento => {
        if (this.asientosSeleccionados.includes(asiento.nombre)) {
          asiento.estado = "ocupado";
          asiento.seleccionado = false;
        }
      });

      this.$router.push("/carrito");
    }
  },

  mounted() {
    this.cargarAsientos();
  },

  watch: {
    asientos: {
      deep: true,
      handler() {
        this.guardarAsientos();
      }
    }
  }
};
</script>
<style scoped>
/* ----------------------------------- */
/* 1. Estilos Base y Fondo de Palomitas */
/* ----------------------------------- */

.cinema-container-full {
  /* Fondo de palomitas, borroso, oscuro y fijo */
  background-image: url('../assets/palomitas.webp'); /* ¡AQUÍ DEBES PONER LA URL DE TU IMAGEN! */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Mantiene el fondo fijo al hacer scroll */
  min-height: 100vh;
  padding-top: 60px; /* Espacio para el botón de cerrar fijo */
  box-sizing: border-box;
}

/* Oscurece el fondo y aplica el efecto de desenfoque */
.cinema-container-full::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85); /* Capa oscura */
  backdrop-filter: blur(8px); /* Efecto borroso */
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2; /* Asegura que el contenido esté sobre el fondo borroso */
  padding: 0 10vw 20px 10vw; /* Padding lateral para simular un margen de app */
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ----------------------------------- */
/* 2. Botón de Cierre Flotante (X) */
/* ----------------------------------- */

.btn-close-app {
  position: fixed; /* Fijo para simular UI de app */
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #DAA520; /* Dorado para destacar */
  color: #1a1a2e; /* Contraste */
  border: 2px solid #FFD700; /* Borde dorado brillante */
  font-size: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100; /* Asegura que esté por encima de todo */
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  transition: transform 0.2s;
}

.btn-close-app:active {
  transform: scale(0.95);
}

/* ----------------------------------- */
/* 3. Títulos y Subtítulos */
/* ----------------------------------- */

.page-title {
  font-size: 2em;
  color: #FFD700; /* Dorado brillante */
  margin-bottom: 5px;
  text-shadow: 1px 1px 2px #000;
}

.subtitle {
  font-size: 1em;
  color: #ccc;
  margin-bottom: 20px;
}

.subtitle strong {
  color: #FFD700; /* Texto importante en dorado */
}

/* ----------------------------------- */
/* 4. Estructura y Pantalla de Cine */
/* ----------------------------------- */

.asientos-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 450px; /* Limita el ancho en móviles */
  margin: 0 auto;
}

.pantalla {
  width: 80%;
  height: 10px;
  background-color: #DAA520; /* Dorado como pantalla */
  color: #1a1a2e;
  border-radius: 5px 5px 0 0;
  text-align: center;
  font-weight: bold;
  line-height: 10px;
  margin: 20px 0;
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.5); /* Sombra dorada */
}

/* ----------------------------------- */
/* 5. Leyenda de Asientos */
/* ----------------------------------- */

.leyenda-asientos {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
  font-size: 0.8em;
  background-color: rgba(26, 26, 46, 0.7); /* Fondo semi-transparente oscuro */
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #333;
}

.leyenda-item {
  display: flex;
  align-items: center;
}

.leyenda-box {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 4px;
  margin-right: 5px;
  border: 1px solid #1a1a2e;
}

.disponible-color { background-color: #5cb85c; }
.ocupado-color { background-color: #e6e6e6; }
.seleccionado-color { background-color: #FFD700; } /* Dorado */

/* ----------------------------------- */
/* 6. Estilos de los Asientos */
/* ----------------------------------- */

.asientos-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 10 columnas */
  gap: 8px;
  width: 100%;
}

.asiento {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  font-weight: bold;
  border-radius: 6px 6px 0 0; /* Simula la forma de una butaca */
  cursor: pointer;
  transition: all 0.2s;
}

.asiento.disponible {
  background-color: #4CAF50; /* Verde más oscuro */
  color: #fff;
  border: 1px solid #388e3c;
}

.asiento.ocupado {
  background-color: #333; /* Gris oscuro para ocupado */
  color: #555;
  cursor: not-allowed;
  border: 1px solid #222;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
}

.asiento.seleccionado {
  background-color: #FFD700; /* Dorado seleccionado */
  color: #1a1a2e;
  border: 2px solid #DAA520;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.7); /* Brillo dorado */
  transform: scale(1.05);
}

/* Efecto hover */
.asiento.disponible:hover,
.asiento.seleccionado:hover {
  opacity: 0.85;
}

/* ----------------------------------- */
/* 7. Resumen y Botón Principal */
/* ----------------------------------- */

.resumen {
  width: 100%;
  margin-top: 30px;
  padding: 15px;
  background-color: rgba(26, 26, 46, 0.9); /* Fondo oscuro más sólido */
  border-radius: 12px;
  text-align: center;
  border-top: 3px solid #FFD700; /* Línea dorada */
}

.resumen p {
  margin-bottom: 15px;
}

.text-yellow {
  color: #FFD700; /* Dorado para asientos seleccionados */
  font-size: 1.1em;
}

.btn-primary {
  padding: 12px 25px;
  background-color: #FFD700; /* Dorado principal */
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: #DAA520; /* Dorado más oscuro al pasar el ratón */
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
}

.btn-primary:disabled {
  background-color: #555;
  color: #bbb;
  cursor: not-allowed;
}

/* ----------------------------------- */
/* 8. Mensajes de Confirmación */
/* ----------------------------------- */

.mensaje {
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
}

.mensaje.exito {
  background-color: #4CAF50;
  color: white;
}
</style>