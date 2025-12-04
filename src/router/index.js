import { createRouter, createWebHistory } from "vue-router";

import LoginForm from "../components/LoginForm.vue";
import HomeUsuario from "../components/HomeUsuario.vue";   // usuario normal
import HomeAdmin from "../components/HomeAdmin.vue";       // administrador
import CinemaCard from "../components/CinemaCard.vue";
import SeleccionarAsientos from "../components/SeleccionarAsientos.vue";
import DetallePelicula from "../components/DetallePelicula.vue";
import CarritoPeliculas from "../components/CarritoPeliculas.vue"; // existente
import PagoPeliculas from "../components/PagoPeliculas.vue";       // existente
import BoletoPeliculas from "../components/BoletoPeliculas.vue";   // ← NUEVO

const routes = [
  { path: "/", name: "Login", component: LoginForm },

  // USUARIO NORMAL
  { path: "/home-usuario", name: "HomeUsuario", component: HomeUsuario },

  // ADMIN
  { path: "/home-admin", name: "HomeAdmin", component: HomeAdmin },

  // Detalle películas
  { path: "/pelicula/:id", name: "DetallePelicula", component: DetallePelicula },

  // Cinemas
  { path: "/cinemas", name: "CinemaCard", component: CinemaCard },

  // Seleccionar asientos
  { path: "/asientos", name: "SeleccionarAsientos", component: SeleccionarAsientos },

  // 🛒 CARRITO DE PELÍCULAS
  {
    path: "/carrito",
    name: "CarritoPeliculas",
    component: CarritoPeliculas
  },

  // 💳 PAGO DE PELÍCULAS
  {
    path: "/pago",
    name: "PagoPeliculas",
    component: PagoPeliculas
  },

  // 🎟️ BOLETO FINAL
  {
    path: "/boleto",
    name: "BoletoPeliculas",
    component: BoletoPeliculas
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
