import Vue from 'vue'
import App from './App'

import util from './common/util.js'

Vue.config.productionTip = false

Vue.prototype.$apiPath=util.apiPath
Vue.prototype.ScanAudio = function(){
        var music = null;
        music = uni.createInnerAudioContext(); //创建播放器对象
        music.src="/static/yinxiao.mp3";
		music.play(); //执行播放
}
Vue.prototype.$msg=util.msg
Vue.prototype.$jump=util.jump

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
