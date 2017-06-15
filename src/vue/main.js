import QiscusSDK from '../sdk'
import Vue from 'vue'
import QiscusWidget from './App'
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 2000
})

// QiscusSDK.mode = 'wide';
// QiscusSDK.init({
//   AppId: 'dragongo',
//   options: {
//     headerClickedCallback(response) {
//       console.info('header di click', response);
//     }
//   }
// });
// QiscusSDK.setUser('fikri@qiscus.com', 'password', 'fikri');

/* let's render the view layer */
window.vm = new Vue({
  render(h) {
    return h(QiscusWidget)
  }
}).$mount('#qiscus-widget')