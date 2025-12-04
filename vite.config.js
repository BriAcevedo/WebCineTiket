import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './', // necesario para que Capacitor lo cargue bien
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://www.loginceci.somee.com/api/Users', // 🔹 URL hosteada en Somee
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // ajusta la ruta para que axios use /login, /register, etc.
      },
    },
  },
});
