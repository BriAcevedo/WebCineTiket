<template>
  <div class="pago-wrapper">
    <div class="pago-container">
      <button class="btn-cerrar" @click="$router.back()">✖</button>

      <h1>💳 Pago de Películas</h1>

      <div 
        class="tarjeta-credito" 
        :class="{ 'tarjeta-girada': girarTarjeta }" 
        @click="girarTarjeta = !girarTarjeta"
      >
        <div class="tarjeta-front">
          <div class="chip"></div>
          <p class="numero">{{ numeroTarjetaMasked }}</p>
          <div class="datos">
            <div>
              <span>Titular</span>
              <p>{{ titular || "NOMBRE APELLIDO" }}</p>
            </div>
            <div>
              <span>Válido Hasta</span>
              <p>{{ validez || "MM/AA" }}</p>
            </div>
          </div>
        </div>

        <div class="tarjeta-back">
          <div class="banda-magnetica"></div>
          <div class="cvv">
            <span>CVV</span>
            <p>{{ cvv || "***" }}</p>
          </div>
        </div>
      </div>

      <div class="inputs-tarjeta">
        <div class="form-group">
          <label>Número de tarjeta (16 dígitos)</label>
          <input 
            type="text" 
            v-model="numeroTarjeta" 
            placeholder="1234 5678 9012 3456" 
            maxlength="19" 
            :class="{ 'input-error': numeroTarjeta.length > 0 && !esNumeroValido }"
            @input="formatoNumeroTarjeta"
          />
        </div>
        
        <div class="form-group">
          <label>Nombre del titular</label>
          <input 
            type="text" 
            v-model="titular" 
            placeholder="JUAN PEREZ"
            :class="{ 'input-error': titular.length > 0 && !esTitularValido }"
          />
        </div>
        
        <div class="input-grupo">
          <div class="form-group">
            <label>Válido hasta (MM/AA)</label>
            <input 
              type="text" 
              v-model="validez" 
              placeholder="12/25" 
              maxlength="5" 
              :class="{ 'input-error': validez.length > 0 && !esValidezValida }"
              @input="formatoValidez"
            />
          </div>
          
          <div class="form-group">
            <label>CVV (3 dígitos)</label>
            <input 
              type="text" 
              v-model="cvv" 
              placeholder="123" 
              maxlength="3" 
              :class="{ 'input-error': cvv.length > 0 && !esCvvValido }"
              @focus="girarTarjeta = true"
              @blur="girarTarjeta = false"
            />
          </div>
        </div>
      </div>

      <div class="total-general">
        <h2>Total a Pagar:</h2>
        <p class="monto-total">${{ totalAPagar.toFixed(2) }}</p>
        <button 
          class="btn-pagar" 
          @click="confirmarPago"
          :disabled="!formularioEsValido"
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PagoPeliculas",
  data() {
    return {
      numeroTarjeta: "",
      titular: "",
      validez: "",
      cvv: "",
      girarTarjeta: false,
      carrito: []
    };
  },
  created() {
    // Carga el carrito desde localStorage al crear el componente
    this.carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  },
  computed: {
    numeroTarjetaLimpio() {
      return this.numeroTarjeta.replace(/\s/g, '');
    },
    numeroTarjetaMasked() {
      if (!this.numeroTarjetaLimpio) return "#### #### #### ####";
      const padded = this.numeroTarjetaLimpio.padEnd(16, "#");
      return padded.replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    totalAPagar() {
      return this.carrito.reduce(
        (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
        0
      );
    },
    esNumeroValido() {
      return this.numeroTarjetaLimpio.length === 16 && /^\d+$/.test(this.numeroTarjetaLimpio);
    },
    esTitularValido() {
      return this.titular.trim().length >= 3;
    },
    esValidezValida() {
      if (!/^\d{2}\/\d{2}$/.test(this.validez)) return false;
      const [mm, aa] = this.validez.split('/').map(n => parseInt(n));
      if (mm < 1 || mm > 12) return false;
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (aa < currentYear) return false;
      if (aa === currentYear && mm < currentMonth) return false;
      return true;
    },
    esCvvValido() {
      return this.cvv.length === 3 && /^\d+$/.test(this.cvv);
    },
    formularioEsValido() {
      return this.esNumeroValido && this.esTitularValido && this.esValidezValida && this.esCvvValido;
    }
  },
  methods: {
    formatoNumeroTarjeta() {
      let valorLimpio = this.numeroTarjeta.replace(/\D/g, '').substring(0, 16);
      this.numeroTarjeta = valorLimpio.replace(/(\d{4})(?=\d)/g, '$1 ');
    },
    formatoValidez() {
      let valorLimpio = this.validez.replace(/\D/g, '').substring(0, 4);
      if (valorLimpio.length > 2) {
        valorLimpio = `${valorLimpio.substring(0, 2)}/${valorLimpio.substring(2, 4)}`;
      }
      this.validez = valorLimpio;
    },
    confirmarPago() {
      if (!this.formularioEsValido) {
        alert("Por favor, rellena todos los campos correctamente. ⚠️");
        return;
      }

      // Pago simulado
      alert("¡Pago realizado con éxito! 🎉");

      // Guardar carrito como boletos comprados
      localStorage.setItem("boletos", JSON.stringify(this.carrito));

      // Opcional: limpiar carrito
      localStorage.removeItem("carrito");

      // Ir a Boleto
      this.$router.push("/boleto");
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
.pago-wrapper {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  background: transparent;
}

/* Fondo con imagen de palomitas */
.pago-wrapper::before {
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
  filter: blur(12px) brightness(0.4);
  z-index: -2;
}

/* Overlay oscuro para mejor contraste */
.pago-wrapper::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

/* ══════════════════════════════════════════════════════════ */
/* 💳 CONTENEDOR DEL FORMULARIO */
/* ══════════════════════════════════════════════════════════ */
.pago-container {
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 30px 25px 40px 25px;
  position: relative;
  z-index: 2;
  
  /* Efecto vidrio */
  backdrop-filter: blur(15px);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-family: 'Segoe UI', sans-serif;
  
  /* Asegura que ocupe todo el ancho */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ══════════════════════════════════════════════════════════ */
/* ❌ BOTÓN CERRAR */
/* ══════════════════════════════════════════════════════════ */
.btn-cerrar {
  position: absolute;
  top: 25px;
  right: 25px;
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
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  padding: 0;
  z-index: 100;
}

.btn-cerrar:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 0, 0, 0.3);
  background: linear-gradient(135deg, #ff3333, #ff0000);
}

.btn-cerrar:active {
  transform: scale(0.95);
}

/* ══════════════════════════════════════════════════════════ */
/* 🏷️ TÍTULO PRINCIPAL */
/* ══════════════════════════════════════════════════════════ */
h1 {
  text-align: center;
  margin: 20px 0 30px 0;
  font-size: 32px;
  font-weight: 900;
  color: #ffcc00;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 204, 0, 0.6), 0 0 18px rgba(255, 204, 0, 0.4);
  width: 100%;
}

/* ══════════════════════════════════════════════════════════ */
/* 💳 TARJETA DE CRÉDITO */
/* ══════════════════════════════════════════════════════════ */
.tarjeta-credito {
  width: 100%;
  max-width: 380px;
  height: 200px;
  margin: 0 auto 40px;
  perspective: 1000px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tarjeta-credito:hover {
  transform: translateY(-5px);
}

.tarjeta-front,
.tarjeta-back {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 25px;
  position: absolute;
  backface-visibility: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

/* Flipper effect */
.tarjeta-girada .tarjeta-front {
  transform: rotateY(-180deg);
}

.tarjeta-girada .tarjeta-back {
  transform: rotateY(0deg);
}

/* Frente - Diseño vibrante */
.tarjeta-front {
  background: linear-gradient(135deg, #ffcc00, #ff9900);
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.numero {
  font-size: 22px;
  letter-spacing: 3px;
  margin-top: 10px;
  font-weight: 800;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.datos {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
}

.datos span {
  font-size: 10px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 3px;
  display: block;
  font-weight: 600;
}

.datos p {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}

/* Reverso */
.tarjeta-back {
  background: linear-gradient(135deg, #1a1a1a, #000000);
  color: #fff;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
}

.banda-magnetica {
  height: 40px;
  background: #000;
  margin-top: 20px;
  border-radius: 0;
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
}

.cvv {
  margin-top: 30px;
  text-align: right;
}

.cvv span {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: #aaa;
}

.cvv p {
  background: #fff;
  color: #000;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: 800;
  min-width: 70px;
  display: inline-block;
  text-align: center;
  font-family: 'Courier New', monospace;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* ══════════════════════════════════════════════════════════ */
/* 📝 INPUTS DE TARJETA */
/* ══════════════════════════════════════════════════════════ */
.inputs-tarjeta {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 380px;
  margin-bottom: 30px;
}

/* Grupo de formulario */
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Labels */
.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #ffcc00;
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.5px;
}

/* Inputs */
.inputs-tarjeta input {
  width: 100%;
  padding: 16px 18px;
  border-radius: 12px;
  border: 2px solid rgba(255, 204, 0, 0.4);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 16px;
  transition: all 0.3s;
  font-weight: 500;
}

.inputs-tarjeta input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.inputs-tarjeta input:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 15px rgba(255, 204, 0, 0.6);
  outline: none;
  background: rgba(0, 0, 0, 0.8);
}

.input-error {
  border-color: #ff4757 !important;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.5) !important;
}

/* Grupo para MM/AA y CVV */
.input-grupo {
  display: flex;
  gap: 20px;
  width: 100%;
}

.input-grupo .form-group {
  flex: 1;
}

/* ══════════════════════════════════════════════════════════ */
/* 💰 TOTAL GENERAL */
/* ══════════════════════════════════════════════════════════ */
.total-general {
  text-align: center;
  margin-top: 30px;
  padding: 25px;
  background: rgba(255, 204, 0, 0.1);
  border: 2px solid rgba(255, 204, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  box-shadow: 0 10px 25px rgba(255, 204, 0, 0.15);
  width: 100%;
  max-width: 380px;
}

.total-general h2 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.monto-total {
  font-size: 36px;
  font-weight: 900;
  color: #ffcc00;
  margin: 10px 0 25px 0;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
}

/* ══════════════════════════════════════════════════════════ */
/* 🟡 BOTÓN PAGAR */
/* ══════════════════════════════════════════════════════════ */
.btn-pagar {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4), inset 0 -3px 8px rgba(0, 0, 0, 0.3);
}

.btn-pagar:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.6), inset 0 -3px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #66BB6A, #388E3C);
}

.btn-pagar:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-pagar:disabled {
  background: #4a4a4a;
  color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.7;
  transform: translateY(0);
}

/* ══════════════════════════════════════════════════════════ */
/* 📱 RESPONSIVE DESIGN */
/* ══════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .pago-container {
    padding: 25px 20px 35px 20px;
  }
  
  h1 {
    font-size: 28px;
    margin: 15px 0 25px 0;
  }
  
  .btn-cerrar {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .tarjeta-credito {
    max-width: 350px;
    height: 190px;
    margin-bottom: 35px;
  }
  
  .tarjeta-front,
  .tarjeta-back {
    padding: 20px;
  }
  
  .numero {
    font-size: 20px;
  }
  
  .inputs-tarjeta {
    gap: 22px;
  }
  
  .inputs-tarjeta input {
    padding: 15px;
    font-size: 15px;
  }
  
  .total-general {
    padding: 22px;
  }
  
  .monto-total {
    font-size: 32px;
  }
  
  .btn-pagar {
    padding: 17px;
    font-size: 19px;
  }
}

@media (max-width: 480px) {
  .pago-container {
    padding: 20px 15px 30px 15px;
  }
  
  h1 {
    font-size: 24px;
    margin: 10px 0 20px 0;
  }
  
  .btn-cerrar {
    top: 15px;
    right: 15px;
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
  
  .tarjeta-credito {
    max-width: 320px;
    height: 180px;
    margin-bottom: 30px;
  }
  
  .tarjeta-front,
  .tarjeta-back {
    padding: 18px;
    border-radius: 18px;
  }
  
  .chip {
    width: 35px;
    height: 25px;
  }
  
  .numero {
    font-size: 18px;
    letter-spacing: 2px;
  }
  
  .datos p {
    font-size: 13px;
  }
  
  .inputs-tarjeta {
    gap: 20px;
  }
  
  .form-group label {
    font-size: 13px;
  }
  
  .inputs-tarjeta input {
    padding: 14px;
    font-size: 14px;
  }
  
  .input-grupo {
    gap: 15px;
  }
  
  .total-general {
    padding: 20px;
  }
  
  .total-general h2 {
    font-size: 16px;
  }
  
  .monto-total {
    font-size: 28px;
    margin: 8px 0 20px 0;
  }
  
  .btn-pagar {
    padding: 16px;
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  .pago-container {
    padding: 15px 12px 25px 12px;
  }
  
  .tarjeta-credito {
    max-width: 300px;
    height: 170px;
  }
  
  .inputs-tarjeta input {
    padding: 13px;
    font-size: 13px;
  }
  
  .monto-total {
    font-size: 24px;
  }
}

/* ══════════════════════════════════════════════════════════ */
/* 📜 SCROLLBAR PERSONALIZADO */
/* ══════════════════════════════════════════════════════════ */
.pago-wrapper::-webkit-scrollbar {
  width: 8px;
}

.pago-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.pago-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffcc00, #ff9900);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.pago-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff9900, #ffcc00);
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
}
</style>