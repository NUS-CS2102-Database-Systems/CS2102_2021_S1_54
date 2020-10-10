import Vue from "vue";
import VueRouter from "vue-router";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.use(VueRouter);

// new Vue({
//   render: (h) => h(App),
// }).$mount("#app");
new Vue({
  el: "#app",
  vuetify,
  router,
  icons: {
    iconfont: "mdiSvg", // "mdiSvg" || 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  render: (h) => h(App),
});
