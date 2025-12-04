<template>
  <div class="boleto-wrapper">
    <div class="boleto-container" v-if="boletoDisponible">
      
      <header class="boleto-header">
        <h1 class="titulo-principal">🎬 BOLETO DE CINE</h1>
      </header>

      <div class="comprador-info">
        <span class="comprador-icon">👤</span>
        <div class="comprador-datos">
          <h2 class="comprador-nombre">{{ comprador }}</h2>
          <p class="comprador-subtitulo">COMPRADOR</p>
        </div>
      </div>

      <div class="boletos-lista">
        <div class="boleto-item" v-for="(boleto, index) in boletos" :key="index">
          <div class="boleto-cabecera">
            <h3 class="boleto-titulo">BOLETO #{{ index + 1 }}</h3>
            <span class="boleto-estado">CONFIRMADO ✓</span>
          </div>
          
          <div class="boleto-detalles">
            <div class="detalle-fila">
              <span class="detalle-etiqueta">PELÍCULA:</span>
              <span class="detalle-valor pelicula">{{ boleto.pelicula }}</span>
            </div>
            <div class="detalle-fila">
              <span class="detalle-etiqueta">HORA:</span>
              <span class="detalle-valor hora">{{ boleto.hora }}</span>
            </div>
            <div class="detalle-fila">
              <span class="detalle-etiqueta">SUCURSAL:</span>
              <span class="detalle-valor">{{ boleto.sucursal }}</span>
            </div>
            <div class="detalle-fila">
              <span class="detalle-etiqueta">ASIENTOS:</span>
              <span class="detalle-valor asientos">
                <span v-for="(asiento, i) in boleto.asientos" :key="i" class="asiento-badge">{{ asiento }}</span>
              </span>
            </div>
            <div class="detalle-fila">
              <span class="detalle-etiqueta">CANTIDAD:</span>
              <span class="detalle-valor cantidad">{{ boleto.cantidad }}</span>
            </div>
          </div>
          
          <div class="seccion-total">
            <div class="total-contenedor">
              <span class="total-etiqueta">TOTAL A PAGAR:</span>
              <span class="total-precio">${{ (boleto.precio * boleto.cantidad).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="separador-linea" v-if="index < boletos.length - 1"></div>
        </div>
      </div>

      <div class="seccion-codigo">
        <div class="qr-contenedor">
          <div class="qr-grande">
            <div class="qr-simbolo-grande">[ QR CODE ]</div>
            <p class="qr-texto-grande">PRESENTAR EN TAQUILLA</p>
          </div>
          <div class="codigo-contenedor">
            <h4 class="codigo-titulo">CÓDIGO DE CONFIRMACIÓN</h4>
            <p class="codigo-grande">CT-{{ Math.random().toString(36).substr(2, 8).toUpperCase() }}</p>
            <p class="codigo-descripcion">Muestra este código o el QR para canjear tus boletos en la sucursal</p>
          </div>
        </div>
        
        <div class="botones-grandes">
          <button class="btn-grande btn-imprimir-grande" @click="imprimirBoleto">
            <span class="btn-icon">🖨️</span>
            <span class="btn-texto">IMPRIMIR BOLETO</span>
          </button>
          <button class="btn-grande btn-inicio-grande" @click="irHome">
            <span class="btn-icon">🏠</span>
            <span class="btn-texto">VOLVER AL INICIO</span>
          </button>
        </div>
        
        <div class="instrucciones-final">
          <p>📍 Llega al menos 15 minutos antes de la función</p>
          <p>🎫 Presenta este boleto en taquilla para canjearlo</p>
          <p>🔒 Guarda tu boleto en un lugar seguro</p>
        </div>
      </div>

    </div>

    <div v-else class="boleto-no-disponible">
      <div class="no-boleto-icon">🎬</div>
      <h2>NO HAY BOLETOS DISPONIBLES</h2>
      <p>Parece que aún no has comprado boletos para ninguna función.</p>
      <button class="btn-grande btn-inicio-grande" @click="irHome">
        🏠 VOLVER AL INICIO
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Boleto",
  data() {
    return {
      comprador: "Invitado",
      boletos: [],
      boletoDisponible: false
    };
  },
  mounted() {
    // Traer datos del usuario y de los boletos después del pago
    const usuario = JSON.parse(localStorage.getItem("currentUser")) || {};
    const boletosData = JSON.parse(localStorage.getItem("boletos")) || [];

    this.comprador = usuario.username || "Invitado";

    if (boletosData.length > 0) {
      this.boletos = boletosData.map(item => ({
        pelicula: item.pelicula || 'N/A',
        sucursal: item.sucursal || 'N/A',
        hora: item.hora || 'N/A',
        asientos: Array.isArray(item.asientos) ? item.asientos : [],
        cantidad: Number(item.cantidad) || 1,
        precio: Number(item.precio) || 0
      }));

      this.boletoDisponible = true;
      
      // *** CAMBIO: Se elimina el setTimeout que manipulaba el CSS, dejando que Vue y el CSS hagan el trabajo. ***
    }
  },
  methods: {
    irHome() {
      this.$router.push("/");
    },
    imprimirBoleto() {
      window.print();
    },
    compartirBoleto() {
      if (navigator.share) {
        navigator.share({
          title: 'Mi boleto de cine',
          text: `He comprado boletos para ${this.boletos.length} película(s) en CineTicket`,
          url: window.location.href
        });
      } else {
        alert('Enlace copiado al portapapeles');
      }
    }
  }
};
</script>

<style scoped>
/* ==================================================================== */
/* *** CAMBIOS CLAVE PARA CORREGIR SCROLL Y VISUALIZACIÓN *** */
/* ==================================================================== */

/* CLAVE 1: Configuración de HTML/BODY y el Wrapper para permitir el Scroll de la ventana */
html, body {
  width: 100% !important;
  height: auto !important;
  overflow-x: hidden !important; 
  overflow-y: scroll !important; /* Asegura el scroll vertical */
  position: static !important;
}

.boleto-wrapper {
  width: 100% !important;
  min-height: 100vh !important; /* CLAVE: Ocupa al menos toda la altura y permite crecer */
  height: auto !important; 
  background: linear-gradient(135deg, #0c0c1a 0%, #1a1a3e 100%) !important;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  color: #ffffff;
  display: flex !important; 
  justify-content: center !important; 
  overflow: visible !important; /* CLAVE: Permite que el contenido desborde al wrapper */
  position: relative;
  padding: 30px 20px 5px 20px !important; 
  margin: 0 !important;
  box-sizing: border-box;
}

.boleto-container {
  max-width: 450px !important; 
  width: 100% !important;
  height: auto !important; /* CLAVE: Altura automática para que se vea todo */
  padding: 8px 5px !important;
  background: linear-gradient(145deg, #0f0f23, #1a1a2e);
  overflow: visible !important; /* Permite que el contenido desborde si es necesario */
  position: relative;
  border-radius: 6px; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); 
}

/* CLAVE 2: Corrección de la maquetación de filas */
.detalle-fila {
  display: flex !important; /* Usa flex para que etiqueta y valor estén en la misma línea */
  justify-content: space-between;
  margin-bottom: 6px !important;
  padding: 4px 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  width: 100% !important;
  flex-wrap: wrap; 
}

.detalle-etiqueta {
  display: inline-block; 
  font-weight: 700;
  color: #a0a0c0;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0 !important;
  width: auto;
  flex-shrink: 0;
}

.detalle-valor {
  display: block;
  font-weight: 700;
  color: #ffffff;
  font-size: 0.85rem !important;
  word-break: break-word;
  overflow-wrap: break-word;
  width: auto;
  text-align: right;
  flex: 1; /* Permite que el valor ocupe el resto del espacio */
}

/* CLAVE 3: Eliminación/Ajuste de la regla genérica que rompía el diseño */
/* Se corrigió la regla para que no imponga estilos que rompan el display flex de otros elementos */
.boleto-wrapper * {
  /* Se eliminaron 'display: block !important' y otros que rompían los layouts de fila */
  max-width: 100% !important;
  min-height: auto !important;
  max-height: none !important;
  overflow: visible; 
  position: relative; 
  float: none;
  clear: both;
  box-sizing: border-box !important; /* Asegurar box-sizing para todos */
}


/* ==================================================================== */
/* *** REGLAS RESTANTES (SIN CAMBIOS Mayores) *** */
/* ==================================================================== */

/* ====== RESET COMPLETO - SOLO LO ESENCIAL PARA BOX-MODEL ====== */
* {
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
}

/* (El resto de tus estilos específicos sigue a continuación sin más modificaciones,
   ya que los cambios anteriores resuelven el problema de scroll y diseño de filas)
*/

/* ====== ENCABEZADO - SIEMPRE VISIBLE ====== */
.boleto-header {
  text-align: center;
  margin-bottom: 10px !important;
  padding: 5px 0 !important;
  border-bottom: 2px solid #ff9900;
  width: 100% !important;
  position: relative;
  top: 0 !important;
  left: 0 !important;
}

.titulo-principal {
  font-size: 1.2rem !important;
  font-weight: 900;
  color: #ffffff;
  margin: 0 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 3px 10px rgba(255, 153, 0, 0.4);
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.1 !important;
  display: block;
  width: 100% !important;
}

/* ====== INFORMACIÓN DEL COMPRADOR ====== */
.comprador-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px !important;
  border-radius: 6px;
  margin-bottom: 10px !important;
  border-left: 3px solid #00cc88;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 100% !important;
  overflow: visible !important;
  flex-wrap: wrap;
}

.comprador-icon {
  font-size: 1.2rem !important;
  margin-right: 8px !important;
  color: #00ccff;
  flex-shrink: 0;
}

.comprador-datos {
  flex: 1;
  min-width: 0;
}

.comprador-nombre {
  font-size: 1rem !important;
  margin-bottom: 2px !important;
  color: #ffffff;
  font-weight: 700;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.1;
}

.comprador-subtitulo {
  color: #b0b0d0;
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* ====== LISTA DE BOLETOS ====== */
.boletos-lista {
  margin-bottom: 10px !important;
  width: 100% !important;
  display: block;
}

.boleto-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding: 8px !important;
  margin-bottom: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  width: 100% !important;
  overflow: visible !important;
  display: block;
}

.boleto-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px !important;
  padding-bottom: 6px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 6px;
  width: 100% !important;
}

.boleto-titulo {
  font-size: 0.9rem !important;
  font-weight: 800;
  color: #ffcc00;
  margin: 0 !important;
  word-break: break-word;
  line-height: 1.1;
  flex: 1;
}

.boleto-estado {
  background: linear-gradient(to right, #00cc88, #00e6a8);
  color: #001a11;
  padding: 4px 8px !important;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0, 204, 136, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ====== DETALLES DEL BOLETO ====== */
.boleto-detalles {
  margin-bottom: 8px !important;
  width: 100% !important;
  display: block;
}

.detalle-valor.pelicula {
  color: #ff9900;
  font-size: 0.9rem !important;
  font-weight: 800;
}

.detalle-valor.hora {
  color: #00ccff;
  font-size: 0.85rem !important;
}

.detalle-valor.cantidad {
  color: #ff3366;
  font-size: 0.85rem !important;
}

.asientos {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 100% !important;
  margin-top: 4px !important;
}

.asiento-badge {
  background: linear-gradient(to right, #0066ff, #4a6bff);
  color: white;
  padding: 3px 6px !important;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.7rem !important;
  border: 1px solid rgba(0, 204, 255, 0.3);
  box-shadow: 0 1px 3px rgba(0, 102, 255, 0.2);
  text-align: center;
  flex-shrink: 0;
}

/* ====== SECCIÓN TOTAL ====== */
.seccion-total {
  margin-top: 10px !important;
  width: 100% !important;
}

.total-contenedor {
  background: linear-gradient(to right, rgba(255, 153, 0, 0.15), rgba(0, 102, 255, 0.15));
  padding: 8px !important;
  border-radius: 6px;
  display: block;
  border: 1px solid rgba(255, 153, 0, 0.2);
  width: 100% !important;
  text-align: center;
}

.total-etiqueta {
  display: block;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  font-size: 0.85rem !important;
  letter-spacing: 0.5px;
  word-break: break-word;
  margin-bottom: 4px !important;
}

.total-precio {
  display: block;
  font-size: 1.3rem !important;
  font-weight: 900;
  color: #00e6a8;
  text-shadow: 0 2px 5px rgba(0, 230, 168, 0.4);
  word-break: break-word;
}

/* ====== SEPARADOR ====== */
.separador-linea {
  height: 1px;
  background: linear-gradient(to right, transparent, #4a4a6b, transparent);
  margin: 10px 0 !important;
  width: 100% !important;
}

/* ====== SECCIÓN CÓDIGO ====== */
.seccion-codigo {
  margin-top: 15px !important;
  padding-top: 10px !important;
  border-top: 1px solid #4a4a6b;
  width: 100% !important;
  display: block;
}

.qr-contenedor {
  display: block !important;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px !important;
  border-radius: 6px;
  margin-bottom: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100% !important;
  text-align: center;
}

.qr-grande {
  background: #ffffff;
  color: #1c1c2e;
  width: 90px !important;
  height: 90px !important;
  border-radius: 4px;
  display: inline-block;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  padding: 6px !important;
  margin-bottom: 8px !important;
}

.qr-simbolo-grande {
  font-size: 0.9rem !important;
  font-weight: 900;
  margin-bottom: 4px !important;
  color: #333;
  text-align: center;
  word-break: break-word;
  line-height: 1.1;
}

.qr-texto-grande {
  font-size: 0.6rem !important;
  color: #666;
  text-align: center;
  line-height: 1.1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  word-break: break-word;
}

.codigo-contenedor {
  display: block;
  width: 100% !important;
}

.codigo-titulo {
  color: #ffffff;
  font-size: 0.85rem !important;
  font-weight: 800;
  margin-bottom: 6px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  word-break: break-word;
  line-height: 1.1;
}

.codigo-grande {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem !important;
  font-weight: 900;
  color: #ff9900;
  background: rgba(255, 153, 0, 0.1);
  padding: 8px !important;
  border-radius: 4px;
  margin: 8px 0 !important;
  letter-spacing: 0.5px;
  border: 1px dashed rgba(255, 153, 0, 0.4);
  text-align: center;
  word-break: break-all;
  overflow-wrap: break-word;
  width: 100% !important;
  display: block;
}

.codigo-descripcion {
  color: #b0b0d0;
  font-size: 0.75rem !important;
  line-height: 1.2;
  font-weight: 500;
  word-break: break-word;
  margin-top: 6px !important;
}

/* ====== BOTONES ====== */
.botones-grandes {
  display: flex;
  gap: 8px !important;
  margin-bottom: 10px !important;
  justify-content: center;
  flex-wrap: wrap;
  width: 100% !important;
}

.btn-grande {
  padding: 8px 10px !important;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem !important;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1;
  min-width: 120px !important;
  min-height: 35px !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  word-break: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.btn-imprimir-grande {
  background: linear-gradient(to right, #4a6bff, #6a8bff);
  color: white;
}

.btn-inicio-grande {
  background: linear-gradient(to right, #ff9900, #ffaa33);
  color: #1c1c2e;
}

.btn-grande:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
}

.btn-grande:active {
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 0.9rem;
}

.btn-texto {
  flex: 1;
  text-align: center;
  overflow-wrap: break-word;
}

/* ====== INSTRUCCIONES FINALES ====== */
.instrucciones-final {
  background: rgba(0, 102, 255, 0.08);
  padding: 8px !important;
  border-radius: 4px;
  border-left: 2px solid #4a6bff;
  margin-top: 10px !important;
  width: 100% !important;
  box-sizing: border-box;
}

.instrucciones-final p {
  color: #ffffff;
  font-size: 0.75rem !important;
  line-height: 1.2;
  margin-bottom: 4px !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  word-break: break-word;
}

.instrucciones-final p:last-child {
  margin-bottom: 0 !important;
}

/* ====== MENSAJE SIN BOLETO (AJUSTADO PARA EL CENTRADO) ====== */
.boleto-no-disponible {
  background: linear-gradient(145deg, #0f0f23, #1a1a2e);
  color: #ffffff;
  max-width: 450px; 
  min-height: 80vh; /* Ajustado para que no necesite 100vh si no hay contenido */
  padding: 15px 8px !important;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: visible !important;
  box-sizing: border-box;
  margin: 0 !important;
}

.no-boleto-icon {
  font-size: 2.5rem !important;
  margin-bottom: 10px !important;
  color: #ff9900;
}

.boleto-no-disponible h2 {
  font-size: 1.1rem !important;
  margin-bottom: 8px !important;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  word-break: break-word;
  padding: 0 5px !important;
  line-height: 1.1;
}

.boleto-no-disponible p {
  color: #b0b0d0;
  font-size: 0.9rem !important;
  margin-bottom: 12px !important;
  line-height: 1.2;
  max-width: 350px;
  padding: 0 5px !important;
  word-break: break-word;
}

/* ====== ESTILOS PARA IMPRESIÓN ====== */
@media print {
  .boleto-wrapper {
    background: white !important;
    overflow: visible !important;
    width: 100% !important;
    min-height: auto !important;
    padding: 5px !important;
    justify-content: flex-start !important; 
  }
  
  .boleto-container {
    box-shadow: none !important;
    padding: 5px !important;
    min-height: auto;
    max-width: 100% !important;
  }
  
  .btn-grande {
    display: none !important;
  }
}

/* ====== RESPONSIVIDAD (IMPORTANTE) ====== */
@media (max-width: 500px) {
  /* En pantallas menores a 500px, eliminamos el max-width para que el boleto ocupe todo el ancho (comportamiento mobile) */
  .boleto-container {
    max-width: none !important;
  }
  /* Quitamos el padding extra del wrapper para que el boleto ocupe más espacio horizontal en mobile */
  .boleto-wrapper {
    padding: 25px 3px 3px 3px !important;
    justify-content: flex-start !important; 
  }
  
  .boleto-container {
    padding: 6px 4px !important;
  }
  
  .titulo-principal {
    font-size: 1rem !important;
  }
  
  .comprador-nombre {
    font-size: 0.9rem !important;
  }
  
  .boleto-titulo {
    font-size: 0.8rem !important;
  }
  
  .detalle-etiqueta {
    font-size: 0.7rem !important;
  }
  
  .detalle-valor {
    font-size: 0.8rem !important;
  }
  
  .total-precio {
    font-size: 1.1rem !important;
  }
  
  .codigo-grande {
    font-size: 0.8rem !important;
    padding: 6px !important;
  }
  
  .btn-grande {
    min-width: 100px !important;
    font-size: 0.7rem !important;
    padding: 6px 8px !important;
  }
  
  .qr-grande {
    width: 80px !important;
    height: 80px !important;
  }
}

/* ====== REGLAS DE VISIBILIDAD ABSOLUTA ====== */
@media (max-width: 320px) {
  .boleto-wrapper {
    padding: 20px 3px 3px 3px !important; 
  }
  
  .boleto-container {
    padding: 4px 3px !important;
  }
  
  .titulo-principal {
    font-size: 0.9rem !important;
  }
  
  .comprador-nombre {
    font-size: 0.8rem !important;
  }
  
  .boleto-titulo {
    font-size: 0.75rem !important;
  }
  
  .detalle-fila {
    margin-bottom: 4px !important;
  }
  
  .btn-grande {
    min-width: 90px !important;
    padding: 5px 7px !important;
  }
}

</style>