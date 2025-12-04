<template>
  <div class="carrito-wrapper">
    <div class="carrito-container">
      
      <div class="carrito-header">
        <h1>🛒 Mi Carrito</h1>
        <button class="btn-cerrar" @click="irHome">✖</button>
      </div>

      <div v-if="carrito.length === 0" class="carrito-vacio">
        <p>Tu carrito está vacío.</p>
        <p class="mensaje-vacio">¡Parece que aún no has agregado boletos!</p>
        <button @click="irHome" class="btn-ir-home">Ir a la cartelera</button>
      </div>

      <div v-for="(item, index) in carrito" :key="index" class="carrito-item">
        <img :src="item.imagen || defaultImage" class="carrito-imagen" />
        <div class="carrito-info">
          <h2>{{ item.pelicula }}</h2>
          <p><strong>Sucursal:</strong> {{ item.sucursal }}</p>
          <p><strong>Hora:</strong> {{ item.hora }}</p>
          <p><strong>Asientos:</strong> {{ item.asientos.join(", ") }}</p>
          <p><strong>Precio Unitario:</strong> ${{ item.precio }}</p>

          <label>Cantidad:</label>
          <input type="number" min="1" v-model.number="item.cantidad" @change="guardarCarrito" />

          <p class="total-item"><strong>Total:</strong> ${{ item.cantidad * item.precio }}</p>
        </div>

        <button @click="eliminar(index)" class="btn-eliminar">❌</button>
      </div>

      <div v-if="carrito.length > 0" class="total-general">
        <h2>Total General: ${{ totalGeneral }}</h2>
        <button class="btn-pagar" @click="irAPago">Pagar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carrito: [],
      defaultImage: "/images/default.jpg"
    };
  },
  created() {
    this.cargarCarrito();
  },
  computed: {
    totalGeneral() {
      return this.carrito.reduce(
        (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
        0
      );
    }
  },
  methods: {
    cargarCarrito() {
      const data = JSON.parse(localStorage.getItem("carrito")) || [];
      this.carrito = data.map(item => ({
        pelicula: item.pelicula || item.titulo || "",
        sucursal: item.sucursal || "",
        hora: item.hora || "",
        asientos: item.asientos || [],
        imagen: item.imagen || this.defaultImage,
        precio: Number(item.precio) || 80,
        cantidad: Number(item.cantidad) || 1
      }));
    },
    guardarCarrito() {
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    },
    eliminar(index) {
      this.carrito.splice(index, 1);
      this.guardarCarrito();
    },
    irHome() {
      this.$router.push("/home-usuario");
    },
    irAPago() {
      this.$router.push({ name: "PagoPeliculas" });
    }
  }
};
</script>

<style scoped>
/* RESET GENERAL */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ══════════════════════════════════════════════════════════ */
/* 🛒 CONTENEDOR PRINCIPAL QUE OCUPA TODA LA PANTALLA */
/* ══════════════════════════════════════════════════════════ */
.carrito-wrapper {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: fixed; /* Cambiado a fixed para ocupar toda la pantalla */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  background: transparent;
}

.carrito-container {
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px 40px 20px;
  position: relative;
  z-index: 2;
  
  /* Efecto vidrio + fondo oscuro */
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-family: 'Segoe UI', sans-serif;
  
  /* Asegura que ocupe todo el ancho */
  box-sizing: border-box;
}

/* Fondo con imagen de palomitas */
.carrito-container::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/palomitas.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(12px) brightness(0.35);
  z-index: -1;
}

/* ════════════════════════════════════════════════════ */
/* 📌 ENCABEZADO (Título y Botón de Cerrar) */
/* ════════════════════════════════════════════════════ */
.carrito-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-top: 10px;
  width: 100%;
}

/* 🏷️ TÍTULO */
.carrito-container h1 {
  font-size: 32px;
  font-weight: 900;
  text-align: left;
  margin: 0;
  flex-grow: 1;
  color: #ffcc00;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 204, 0, 0.6), 0 0 18px rgba(255, 204, 0, 0.4);
}

/* ❌ BOTÓN CERRAR */
.btn-cerrar {
  width: 45px;
  height: 45px;
  margin-left: 20px;
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
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}

.btn-cerrar:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 0, 0, 0.3);
  background: linear-gradient(135deg, #ff3333, #ff0000);
}

.btn-cerrar:active {
  transform: scale(0.95);
}

/* ════════════════════════════════════════════════════ */
/* 😢 CARRITO VACÍO - ESTILOS MEJORADOS */
/* ════════════════════════════════════════════════════ */
.carrito-vacio {
  text-align: center;
  padding: 60px 25px;
  border-radius: 25px;
  border: 3px dashed rgba(255, 204, 0, 0.5);
  background: rgba(255, 255, 255, 0.1);
  color: #ffcc00;
  font-size: 22px;
  font-weight: bold;
  box-shadow: 0 0 25px rgba(255, 204, 0, 0.2);
  transition: all 0.4s ease;
  margin-top: 30px;
  width: 100%;
}

.carrito-vacio:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.carrito-vacio p {
  margin-bottom: 10px;
  color: #fff;
}

.carrito-vacio .mensaje-vacio {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  font-weight: normal;
}

/* Botón Ir a Home en Carrito Vacío */
.btn-ir-home {
  padding: 14px 30px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #111;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 200, 0, 0.4);
}

.btn-ir-home:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 200, 0, 0.6);
}

/* ════════════════════════════════════════════════════ */
/* 🎬 ITEM DEL CARRITO */
/* ════════════════════════════════════════════════════ */
.carrito-item {
  display: flex;
  gap: 18px;
  padding: 20px;
  margin-bottom: 20px;
  background: rgba(10, 10, 20, 0.85);
  border: 2px solid rgba(255, 204, 0, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 204, 0, 0.05);
  transition: all 0.3s ease;
  width: 100%;
}

.carrito-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(255, 204, 0, 0.3), 0 12px 25px rgba(0, 0, 0, 0.8);
}

/* ════════════════════════════════════════════════════ */
/* 📸 IMAGEN */
/* ════════════════════════════════════════════════════ */
.carrito-imagen {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 204, 0, 0.4);
  flex-shrink: 0;
}

/* ════════════════════════════════════════════════════ */
/* ℹ INFO */
/* ════════════════════════════════════════════════════ */
.carrito-info {
  flex: 1;
  min-width: 0; /* Permite que el texto se ajuste */
}

.carrito-info h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 900;
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.6), 0 0 20px rgba(255, 204, 0, 0.3);
  word-wrap: break-word;
}

.carrito-info p {
  margin: 6px 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.carrito-info label {
  display: block;
  margin: 10px 0 5px 0;
  color: #ffcc00;
  font-weight: 600;
}

.total-item {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 900;
  color: #ffcc00;
}

/* ════════════════════════════════════════════════════ */
/* 🔢 INPUT CANTIDAD */
/* ════════════════════════════════════════════════════ */
input[type="number"] {
  width: 60px;
  padding: 8px;
  border-radius: 10px;
  border: 2px solid rgba(255, 204, 0, 0.5);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
  font-weight: bold;
}

input[type="number"]:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 15px rgba(255, 204, 0, 0.8);
  outline: none;
}

/* ════════════════════════════════════════════════════ */
/* ❌ BOTÓN ELIMINAR */
/* ════════════════════════════════════════════════════ */
.btn-eliminar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 0, 0, 0.5);
  color: red;
  cursor: pointer;
  font-size: 18px;
  transition: 0.25s ease;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 10px;
}

.btn-eliminar:hover {
  background: rgba(255, 0, 0, 0.15);
  border-color: red;
  transform: scale(1.15);
}

/* ════════════════════════════════════════════════════ */
/* 💰 TOTAL GENERAL */
/* ════════════════════════════════════════════════════ */
.total-general {
  margin-top: 30px;
  padding: 25px;
  text-align: center;
  background: rgba(255, 204, 0, 0.15);
  border: 2px solid #ffcc00;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  box-shadow: 0 10px 25px rgba(255, 204, 0, 0.3);
  width: 100%;
}

.total-general h2 {
  margin: 0 0 20px;
  font-size: 26px;
  font-weight: 900;
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

/* ════════════════════════════════════════════════════ */
/* 🟡 BOTÓN PAGAR */
/* ════════════════════════════════════════════════════ */
.btn-pagar {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #111;
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 200, 0, 0.5), inset 0 -3px 8px rgba(0, 0, 0, 0.3);
}

.btn-pagar:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(255, 204, 0, 0.6), inset 0 -3px 8px rgba(0, 0, 0, 0.2);
}

.btn-pagar:active {
  transform: translateY(-1px);
}

/* ════════════════════════════════════════════════════ */
/* 📱 RESPONSIVE DESIGN */
/* ════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .carrito-container {
    padding: 20px 15px 30px 15px;
  }
  
  .carrito-header {
    margin-bottom: 20px;
  }
  
  .carrito-container h1 {
    font-size: 28px;
  }
  
  .btn-cerrar {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .carrito-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 18px;
  }
  
  .carrito-imagen {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .carrito-info h2 {
    font-size: 18px;
  }
  
  .carrito-info p {
    font-size: 15px;
  }
  
  .total-general h2 {
    font-size: 22px;
  }
  
  .btn-pagar {
    padding: 16px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .carrito-container {
    padding: 15px 12px 25px 12px;
  }
  
  .carrito-container h1 {
    font-size: 24px;
  }
  
  .btn-cerrar {
    width: 35px;
    height: 35px;
    font-size: 18px;
    margin-left: 15px;
  }
  
  .carrito-vacio {
    padding: 40px 20px;
    font-size: 20px;
  }
  
  .carrito-vacio .mensaje-vacio {
    font-size: 16px;
  }
  
  .btn-ir-home {
    padding: 12px 25px;
    font-size: 16px;
  }
  
  .carrito-item {
    padding: 15px;
  }
  
  .carrito-imagen {
    height: 180px;
  }
  
  input[type="number"] {
    width: 55px;
    padding: 7px;
    font-size: 15px;
  }
  
  .total-general {
    padding: 20px;
  }
  
  .total-general h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .btn-pagar {
    padding: 15px;
    font-size: 17px;
  }
}

/* ════════════════════════════════════════════════════ */
/* 📜 SCROLLBAR PERSONALIZADO */
/* ════════════════════════════════════════════════════ */
.carrito-wrapper::-webkit-scrollbar {
  width: 8px;
}

.carrito-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.carrito-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffcc00, #ff9900);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.carrito-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff9900, #ffcc00);
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
}
</style>