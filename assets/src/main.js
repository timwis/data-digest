import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/handlebars/handlebars'
import 'codemirror/addon/display/autorefresh'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueCodemirror)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
