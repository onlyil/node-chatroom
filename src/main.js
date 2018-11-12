import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(ElementUI)

const vm = new Vue({
  el: '#app',
  template: '<App />',
  components: { App },
})
