import Vue from "vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  el: "#app",
  vuetify,
  router,
  icons: {
    iconfont: "mdiSvg", // "mdiSvg" || 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  render: (h) => h(App),
});
