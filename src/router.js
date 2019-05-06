import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/libros',
      name: 'libros',
      component: () => import(/* webpackChunkName: "libros" */ './views/Libros.vue')
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import(/* webpackChunkName: "usuarios" */ './views/Usuarios.vue')
    }
  ]
})
