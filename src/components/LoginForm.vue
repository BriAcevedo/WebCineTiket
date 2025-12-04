<template>
  <div class="login-page">
    <div class="web-background" aria-hidden="true">
        <h1 class="web-title">CineTicket Web</h1>
        <p class="web-slogan">Tu portal de películas en pantalla grande.</p>
    </div>
    
    <div class="login-container">
      <transition name="fade" mode="out-in">
        <div v-if="logueado" key="home" class="welcome-screen">
          <div class="welcome-icon">🎬</div>
          <h2 class="welcome-title">¡Bienvenid@, {{ usuarioActual.username }}!</h2>
          <p class="welcome-subtitle">Explora las mejores películas del cine</p>
          <div class="user-info">
            <span class="role-badge">{{ usuarioActual.role }}</span>
          </div>
          <button @click="continuarHome" class="btn-primary">Continuar</button>
          <button @click="cerrarSesion" class="btn-secondary">Cerrar Sesión</button>
        </div>

        <div v-else-if="!mostrarRegistro && !mostrarRecuperar" key="login" class="form-screen">
          <div class="form-header">
            <h2>Iniciar Sesión</h2>
            <p class="form-description">Accede a tu cuenta de CineTicket</p>
          </div>

          <div class="form-group">
            <label>Usuario</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input v-model="username" placeholder="Ingresa tu usuario" />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input v-model="email" type="email" placeholder="Ingresa tu email" />
            </div>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input v-model="password" type="password" placeholder="Ingresa tu contraseña" />
            </div>
          </div>

          <button @click="login" :disabled="loading" class="btn-primary">
            {{ loading ? "Ingresando..." : "Iniciar Sesión" }}
          </button>

          <p class="mensaje" v-if="mensaje">{{ mensaje }}</p>

          <p class="link-recuperar" @click="mostrarRecuperar = true">
            ¿Olvidaste tu contraseña?
          </p>

          <div class="divider">
            <span>o</span>
          </div>

          <p class="registro-texto">
            ¿No tienes cuenta?
            <span @click="mostrarRegistro = true" class="link">Regístrate aquí</span>
          </p>
        </div>

        <div v-else-if="mostrarRegistro" key="registro" class="form-screen">
          <div class="form-header">
            <h2>Crear Cuenta</h2>
            <p class="form-description">Únete a CineTicket</p>
          </div>

          <div class="form-group">
            <label>Usuario</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input v-model="nuevoUsuario" placeholder="Elige un nombre de usuario" />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input v-model="nuevoEmail" type="email" placeholder="Ingresa tu email" />
            </div>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input v-model="nuevaContraseña" type="password" placeholder="Crea una contraseña" />
            </div>
          </div>

          <div class="form-group">
            <label>Rol</label>
            <div class="input-wrapper">
              <span class="input-icon">⚡</span>
              <select v-model="rol" class="select-rol">
                <option disabled value="">Selecciona un rol</option>
                <option value="Usuario">Usuario</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div class="form-group" v-if="rol === 'Administrador'">
            <label>Código de Administrador</label>
            <div class="input-wrapper">
              <span class="input-icon">🔑</span>
              <input v-model="adminCode" type="password" placeholder="Ingresa el código de administrador" />
            </div>
          </div>

          <button @click="registrar" :disabled="loading" class="btn-primary">
            {{ loading ? "Registrando..." : "Crear cuenta" }}
          </button>

          <p class="mensaje" v-if="mensaje">{{ mensaje }}</p>

          <div class="divider">
            <span>o</span>
          </div>

          <p class="registro-texto">
            ¿Ya tienes una cuenta?
            <span @click="volverAlLogin" class="link">Inicia sesión</span>
          </p>
        </div>

        <div v-else key="recuperar" class="form-screen">
          <div class="form-header">
            <h2>Recuperar Contraseña</h2>
            <p class="form-description">Te ayudaremos a recuperar tu cuenta</p>
            </div>

            <div v-if="!mostrarCodigoForm">
              <div class="form-group">
                <label>Email</label>
                <div class="input-wrapper">
                  <span class="input-icon">📧</span>
                  <input v-model="emailRecuperar" type="email" placeholder="Ingresa tu email" />
                </div>
              </div>

              <button @click="solicitarCodigo" :disabled="loading" class="btn-primary">
                {{ loading ? "Enviando..." : "Enviar código" }}
              </button>
            </div>

            <div v-else>
              <div class="form-group">
                <label>Código de Verificación</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔢</span>
                  <input v-model="codigoRecuperar" placeholder="Ingresa el código recibido" />
                </div>
              </div>

              <div class="form-group">
                <label>Nueva Contraseña</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input v-model="nuevaContraseñaRecuperar" type="password" placeholder="Ingresa tu nueva contraseña" />
                </div>
              </div>

              <button @click="restablecerContraseña" :disabled="loading" class="btn-primary">
                {{ loading ? "Restableciendo..." : "Restablecer contraseña" }}
              </button>
            </div>

            <p class="mensaje" v-if="mensaje">{{ mensaje }}</p>

            <div class="divider">
              <span>o</span>
            </div>

            <p class="registro-texto">
              <span @click="volverAlLogin" class="link">Volver al inicio de sesión</span>
            </p>
          </div>
        </transition>
    </div>

    <img src="../assets/logo.jpeg" alt="CineTicket Logo" class="bottom-logo" />
  </div>
</template>

<script>
import emailjs from "emailjs-com";

export default {
  data() {
    return {
      // LOGIN
      username: "",
      email: "",
      password: "",

      // REGISTRO
      nuevoUsuario: "",
      nuevoEmail: "",
      nuevaContraseña: "",
      rol: "",
      adminCode: "",

      // RECUPERAR CONTRASEÑA
      emailRecuperar: "",
      codigoRecuperar: "",
      nuevaContraseñaRecuperar: "",
      codigoGenerado: "",
      mostrarCodigoForm: false,

      // ESTADOS
      mensaje: "",
      loading: false,
      mostrarRegistro: false,
      mostrarRecuperar: false,
      logueado: false,
      usuarioActual: {}
    };
  },

  created() {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) {
      this.usuarioActual = savedUser;
      this.logueado = true;
    }
  },

  methods: {
    login() {
      if (!this.username || !this.email || !this.password) {
        this.mensaje = "Por favor completa todos los campos";
        return;
      }

      this.loading = true;
      this.mensaje = "";

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const user = usuarios.find(
        u =>
          u.username === this.username &&
          u.email === this.email &&
          u.password === this.password
      );

      setTimeout(() => {
        if (user) {
          this.usuarioActual = user;
          this.logueado = true;
          localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
          this.mensaje = "Usuario, email o contraseña incorrectos";
        }
        this.loading = false;
      }, 500);
    },

    registrar() {
      if (!this.nuevoUsuario || !this.nuevoEmail || !this.nuevaContraseña || !this.rol) {
        this.mensaje = "Por favor completa todos los campos";
        return;
      }

      // Código de administrador simple para demostración
      if (this.rol === "Administrador" && this.adminCode !== "1234") {
        this.mensaje = "Código de administrador incorrecto";
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      if (usuarios.some(u => u.username === this.nuevoUsuario || u.email === this.nuevoEmail)) {
        this.mensaje = "Usuario o email ya registrado";
        return;
      }

      const nuevo = {
        username: this.nuevoUsuario,
        email: this.nuevoEmail,
        password: this.nuevaContraseña,
        role: this.rol
      };

      usuarios.push(nuevo);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      this.mensaje = "¡Registro exitoso! Ahora puedes iniciar sesión.";

      this.nuevoUsuario = "";
      this.nuevoEmail = "";
      this.nuevaContraseña = "";
      this.rol = "";
      this.adminCode = "";

      setTimeout(() => {
        this.mostrarRegistro = false;
        this.mensaje = "";
      }, 2000);
    },

    solicitarCodigo() {
      if (!this.emailRecuperar) {
        this.mensaje = "Ingresa tu email";
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const user = usuarios.find(u => u.email === this.emailRecuperar);

      if (!user) {
        this.mensaje = "Email no registrado";
        return;
      }

      this.codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem("codigoRecuperacion", this.codigoGenerado);

      const templateParams = {
        to_name: user.username,
        to_email: this.emailRecuperar,
        codigo: this.codigoGenerado
      };

      this.loading = true;

      // USAR TUS PROPIAS CREDENCIALES DE EmailJS
      emailjs.send("service_eajr1pg","template_rket0ji",templateParams,"6w9DLOh-rB-JnszUQ")
        .then(() => {
          this.mostrarCodigoForm = true;
          this.mensaje = "Código enviado a tu correo";
        })
        .catch(() => {
          this.mensaje = "Error al enviar el código";
        })
        .finally(() => { this.loading = false; });
    },

    restablecerContraseña() {
      if (!this.codigoRecuperar || !this.nuevaContraseñaRecuperar) {
        this.mensaje = "Completa todos los campos";
        return;
      }

      const codigoGuardado = localStorage.getItem("codigoRecuperacion");

      if (this.codigoRecuperar !== codigoGuardado) {
        this.mensaje = "Código incorrecto";
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const index = usuarios.findIndex(u => u.email === this.emailRecuperar);

      if (index === -1) {
        this.mensaje = "Usuario no encontrado";
        return;
      }

      usuarios[index].password = this.nuevaContraseñaRecuperar;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      this.mensaje = "Contraseña restablecida correctamente";

      setTimeout(() => { this.volverAlLogin(); }, 1500);
    },

    volverAlLogin() {
      this.mostrarRegistro = false;
      this.mostrarRecuperar = false;
      this.mostrarCodigoForm = false;
      this.mensaje = "";

      this.emailRecuperar = "";
      this.codigoRecuperar = "";
      this.nuevaContraseñaRecuperar = "";
    },

    continuarHome() {
      if (this.usuarioActual.role === "Administrador") {
        this.$router.push("/home-admin");
      } else {
        this.$router.push("/home-usuario");
      }
    },

    cerrarSesion() {
      localStorage.removeItem("currentUser");
      this.usuarioActual = {};
      this.logueado = false;

      this.username = "";
      this.email = "";
      this.password = "";
    }
  }
};
</script>

<style scoped>
/* ANIMACIONES */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ================================================= */
/* === ESTILOS BASE (MÓVIL / CENTRADO) === */
/* ================================================= */
.login-page {
  /* ESTILOS CLAVE PARA PANTALLA COMPLETA */
  height: 100vh; /* Usa 100% del alto del viewport */
  width: 100vw; /* Usa 100% del ancho del viewport */
  
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1a1a2e;
  background-image: url('../assets/palomitas.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: auto; 
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.5) 0%, 
    rgba(0, 0, 0, 0.7) 50%, 
    rgba(0, 0, 0, 0.85) 100%);
  backdrop-filter: blur(3px);
  z-index: 0;
}

.web-background {
  display: none; 
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 204, 0, 0.2);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(255, 204, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bottom-logo {
  width: 60px;
  height: auto;
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 15px rgba(255, 204, 0, 0.5));
  z-index: 1;
  opacity: 0.9;
}

/* ================================================= */
/* === AJUSTES PARA VISTA WEB (PANTALLA COMPLETA) === */
/* ================================================= */

@media (min-width: 992px) {
  /* CONTENEDOR GENERAL: Diseño de dos columnas */
  .login-page {
    flex-direction: row; 
    justify-content: flex-start;
    align-items: stretch; 
    padding: 0; 
    background-image: none; 
    background-color: #1a1a2e;
    overflow: hidden; 
    height: 100vh; /* REAFIRMANDO ALTURA */
    width: 100vw; /* REAFIRMANDO ANCHO */
  }

  .login-page::before {
    content: none; 
  }

  /* COLUMNA IZQUIERDA: Fondo con imagen de palomitas */
  .web-background {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%; 
    height: 100vh; /* ABARCA LA ALTURA COMPLETA */
    position: relative;
    background-image: url('../assets/palomitas.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    padding: 40px; 
    color: white;
    text-align: center;
  }

  /* Overlay oscuro para la columna izquierda */
  .web-background::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75); 
      z-index: -1; 
  }

  .web-title, .web-slogan {
      position: relative;
      z-index: 1; 
  }

  .web-title {
    font-size: 3.5rem;
    color: #ffcc00;
    margin-bottom: 20px;
    text-shadow: 0 0 30px rgba(255, 204, 0, 0.8);
    font-weight: 800;
  }

  .web-slogan {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
  }

  /* COLUMNA DERECHA: Formulario */
  .login-container {
    width: 50%; 
    max-width: none; 
    height: 100vh; /* ABARCA LA ALTURA COMPLETA */
    border-radius: 0;
    border: none;
    background: #1a1a2e; 
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    animation: none; 
  }

  .form-screen, .welcome-screen {
    width: 100%;
    max-width: 400px; 
    padding: 0; 
  }

  .bottom-logo {
    display: none;
  }
}

/* ================================================= */
/* === ESTILOS DE ELEMENTOS INTERNOS === */
/* ================================================= */

.form-header { text-align: center; margin-bottom: 28px; }
.form-header h2 { color: #ffcc00; margin: 0 0 8px 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 0 20px rgba(255, 204, 0, 0.4); }
.form-description { color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 0; font-weight: 400; }
.welcome-screen { text-align: center; padding: 20px 0; }
.welcome-icon { font-size: 64px; margin-bottom: 20px; animation: bounce 1s ease infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.welcome-title { color: #ffcc00; font-size: 26px; font-weight: 700; margin: 0 0 12px 0; text-shadow: 0 0 20px rgba(255, 204, 0, 0.5); }
.welcome-subtitle { color: rgba(255, 255, 255, 0.85); font-size: 16px; margin: 0 0 20px 0; line-height: 1.5; }
.user-info { margin-bottom: 24px; }
.role-badge { display: inline-block; background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 170, 0, 0.2)); color: #ffcc00; padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(255, 204, 0, 0.3); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; color: #ffcc00; font-size: 13px; font-weight: 600; margin-bottom: 8px; padding-left: 4px; letter-spacing: 0.3px; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 14px; font-size: 18px; pointer-events: none; z-index: 1; }
.login-container input, .select-rol { width: 100%; padding: 14px 14px 14px 45px; border: 1px solid rgba(255, 204, 0, 0.2); border-radius: 12px; font-size: 15px; background: rgba(255, 255, 255, 0.05); color: #fff; outline: none; transition: all 0.3s ease; box-sizing: border-box; font-family: inherit; }
.login-container input::placeholder { color: rgba(255, 255, 255, 0.4); }
.login-container input:focus, .select-rol:focus { background: rgba(255, 255, 255, 0.08); border-color: #ffcc00; box-shadow: 0 0 0 3px rgba(255, 204, 0, 0.15); }
.select-rol { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffcc00' d='M6 9L1 4h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; cursor: pointer; }
.select-rol option { background: #1a1a2e; color: #fff; padding: 10px; }
.btn-primary, .btn-secondary { width: 100%; padding: 14px 24px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-size: 15px; box-sizing: border-box; text-transform: uppercase; letter-spacing: 0.5px; font-family: inherit; }
.btn-primary { background: linear-gradient(135deg, #ffcc00 0%, #ffaa00 100%); color: #000; box-shadow: 0 4px 20px rgba(255, 204, 0, 0.4); margin-bottom: 12px; }
.btn-primary:hover:not(:disabled) { background: linear-gradient(135deg, #ffd633 0%, #ffbb33 100%); transform: translateY(-2px); box-shadow: 0 6px 25px rgba(255, 204, 0, 0.6); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-secondary { background: transparent; color: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: none; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.5); color: #fff; }
.mensaje { color: #ffcc00; font-size: 13px; margin-top: 12px; text-align: center; background: rgba(255, 204, 0, 0.1); padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255, 204, 0, 0.2); line-height: 1.4; }
.divider { position: relative; text-align: center; margin: 24px 0 20px 0; }
.divider::before { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: rgba(255, 255, 255, 0.1); }
.divider span { position: relative; background: rgba(15, 15, 25, 0.95); padding: 0 12px; color: rgba(255, 255, 255, 0.5); font-size: 13px; font-weight: 600; }
.registro-texto { color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 0; text-align: center; line-height: 1.6; }
.link { color: #ffcc00; cursor: pointer; font-weight: 600; text-decoration: none; transition: all 0.2s ease; border-bottom: 1px solid transparent; }
.link:hover { color: #ffd633; border-bottom-color: #ffcc00; }
.link-recuperar { color: #ffcc00; cursor: pointer; font-weight: 600; text-decoration: none; font-size: 13px; display: block; margin-top: 12px; text-align: center; transition: all 0.2s ease; border-bottom: 1px solid transparent; display: inline-block; width: 100%; }
.link-recuperar:hover { color: #ffd633; border-bottom-color: #ffcc00; }
@media (max-width: 480px) { .login-page { padding: 16px 12px; } .login-container { padding: 28px 20px; border-radius: 20px; } .form-header h2 { font-size: 24px; } .form-description { font-size: 13px; } .welcome-icon { font-size: 56px; } .welcome-title { font-size: 22px; } .welcome-subtitle { font-size: 14px; } .form-group label { font-size: 12px; } .login-container input, .select-rol, .btn-primary, .btn-secondary { padding: 12px 12px 12px 42px; font-size: 14px; } .input-icon { font-size: 16px; left: 12px; } .mensaje, .registro-texto, .link-recuperar { font-size: 12px; } .bottom-logo { width: 50px; bottom: 12px; } }
@media (min-width: 481px) and (max-width: 991px) { .login-container { max-width: 460px; padding: 36px 28px; } .bottom-logo { width: 70px; bottom: 24px; } }
@media (max-height: 600px) and (max-width: 991px) { .login-container { margin-top: 40px; } }
</style>