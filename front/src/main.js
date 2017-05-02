import Vue from 'vue'
import VueRouter from 'vue-router'
import List from './components/List.vue'
import Won from './components/Won.vue'
import Mine from './components/Mine.vue'

import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.use(VueRouter)

const routes = [
  { path: '/list', component: List },
  { path: '/mine', component: Mine },
  { path: '/won', component: Won }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

const app = new Vue({
  router
})

app.$mount('#app')
