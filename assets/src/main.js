import Vue from 'vue'
import Buefy from 'buefy'
import AsyncComputed from 'vue-async-computed'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/handlebars/handlebars'
import 'codemirror/addon/display/autorefresh'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(AsyncComputed)
Vue.use(VueCodemirror)

library.add(faCheck)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

store.dispatch('getCurrentUser')
  .finally(() => new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app'))
