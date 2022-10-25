import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import vuetify from "./plugins/vuetify";
import * as VueGoogleMaps from "vue2-google-maps";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

require("@/store/subscriber");

//axios.defaults.baseURL = "https://api-promotoria.iusa.com.mx/api/";
axios.defaults.baseURL = "https://dev-api-promotoria.iusa.com.mx/api/";
//axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

Vue.config.productionTip = false;

Vue.prototype.$hostImage = "https://dev-api-promotoria.iusa.com.mx/";
//Vue.prototype.$hostImage = "https://api-promotoria.iusa.com.mx/";

Vue.use(VueSweetalert2,VueGoogleMaps, {
  load: {
    key: "AIzaSyBwsTOgSJoyp56mJoj-zJAF80LC2DUDH7w",
    libraries: "places",
  },
});

/*new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");*/

store.dispatch("auth/attempt", localStorage.getItem("token")).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
  Vue.prototype.$serveName = "dev.promotoria";
});
