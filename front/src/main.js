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
  { path: '/', redirect: '/won' },
  { path: '/list', component: List },
  { path: '/mine', component: Mine },
  { path: '/won', component: Won }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

const app = new Vue({
  router,
  data: function () {
    return {
      people: [
        '강명진', '김성주', '김시환', '김유진', '김현우',
        '문민준', '서재현', '서표석', '선민규', '송영주',
        '심유성', '양경모', '위재원', '윤효상', '이정재',
        '조성준', '조장현', '최대범', '표성준', '한동규',
        '한충훈'
      ]
    }
  }
})

app.$mount('#app')
