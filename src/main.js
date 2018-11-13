import Vue from 'vue'
import {
  Input,
  Button,
  Message,
} from 'element-ui'
import App from './App.vue'
import './assets/styles/app.styl'

Vue.use(Input)
Vue.use(Button)
Vue.prototype.$message = Message

const vm = new Vue({
  el: '#app',
  template: '<App />',
  components: { App },
})
