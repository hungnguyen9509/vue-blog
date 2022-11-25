<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <div class="form-wrap">
      <form class="register" @submit.prevent="handleSubmit(register)">
        <p class="login-register">
          Already have an account?
          <router-link class="router-link" :to="{ name: 'login' }"
            >Login</router-link
          >
        </p>
        <h2>Create your VueBlogs Account</h2>
        <div class="inputs">
          <ValidationProvider
            class="validator"
            name="First Name"
            rules="required"
            v-slot="{ errors }"
          >
            <div class="input">
              <input type="text" placeholder="Frist Name" v-model="firstName" />
              <UserIcon class="icon" />
            </div>
            <span v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider
            class="validator"
            name="Last Name"
            rules="required"
            v-slot="{ errors }"
          >
            <div class="input">
              <input type="text" placeholder="Last Name" v-model="lastName" />
              <UserIcon class="icon" />
            </div>
            <span v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider
            class="validator"
            name="Username"
            rules="required"
            v-slot="{ errors }"
          >
            <div class="input">
              <input type="text" placeholder="Username" v-model="username" />
              <UserIcon class="icon" />
            </div>
            <span v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider
            mode="eager"
            class="validator"
            name="Email"
            rules="required|email"
            v-slot="{ errors }"
          >
            <div class="input">
              <input type="email" placeholder="Email" v-model="email" />
              <EmailIcon class="icon" />
            </div>
            <span v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider
            mode="eager"
            class="validator"
            name="Password"
            rules="required|min:8"
            v-slot="{ errors }"
          >
            <div class="input">
              <input
                type="password"
                placeholder="Password"
                v-model="password"
              />
              <PasswordIcon class="icon" />
            </div>
            <span v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <button type="submit">Sign Up</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import EmailIcon from "@/components/Icons/EnvelopeIcon.vue";
import PasswordIcon from "@/components/Icons/LockIcon.vue";
import UserIcon from "@/components/Icons/UserIcon.vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseInit";

export default {
  name: "RegisterView",
  components: { EmailIcon, PasswordIcon, UserIcon },
  data: () => {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email,
      });

      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
