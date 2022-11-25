import Vue from "vue";
import "./assets/main.scss";

import { auth } from "@/firebase/firebaseInit";
import { onAuthStateChanged } from "firebase/auth";
import {
  extend,
  localize,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import en from "vee-validate/dist/locale/en.json";
import { email, min, required } from "vee-validate/dist/rules";
import App from "./App.vue";
import router from "./router";
import store from "./store";
extend("required", required);
extend("email", email);
extend("min", min);
localize("en", en);

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

let app: Vue;
onAuthStateChanged(auth, () => {
  if (!app) {
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
