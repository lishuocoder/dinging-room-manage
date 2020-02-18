import Vue from 'vue'
import App from './App'

import util from './common/util.js'

Vue.config.productionTip = false

Vue.prototype.$apiPath=util.apiPath

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
