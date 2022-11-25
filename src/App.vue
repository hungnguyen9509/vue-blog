<script lang="ts">
import HeaderNav from "./components/HeaderNav.vue";
import FooterNav from "./components/FooterNav.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseInit";

interface AppDataType {
  navigation: boolean | null;
}
export default {
  name: "app",
  components: { HeaderNav, FooterNav },
  data: (): AppDataType => {
    return {
      navigation: null,
    };
  },
  methods: {
    checkRoute() {
      if (
        ["login", "register", "forgot-password"].includes(
          this.$route.name || ""
        )
      ) {
        this.navigation = true;
        return;
      }

      this.navigation = false;
    },
  },
  async created() {
    this.checkRoute();
    onAuthStateChanged(auth, async (user) => {
      this.$store.commit("updateUser", user);
      if (user) {
        await this.$store.dispatch("getCurrentUser", user);
      }
    });
    await this.$store.dispatch("getPost");
  },
  watch: {
    $route() {
      this.checkRoute();
    },
  },
};
</script>

<template>
  <div class="app" v-if="$store.state.postLoaded">
    <HeaderNav v-if="!navigation" />
    <router-view />
    <FooterNav v-if="!navigation" />
  </div>
</template>
