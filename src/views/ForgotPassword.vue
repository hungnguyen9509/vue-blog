<template>
  <ValidationObserver v-slot="{ handleSubmit }" ref="form">
    <div @submit.prevent="handleSubmit(resetPassword)" class="reset-password">
      <ConfirmModal
        :modal-active="modalActive"
        :modalMessage="modalMessage"
        @close-modal="closeModal"
      />
      <SpinnerLoading v-if="loading" />
      <div class="form-wrap">
        <form class="reset">
          <p class="login-register">
            Back to <router-link :to="{ name: 'login' }">Login</router-link>
          </p>
          <h2>Reset Password</h2>
          <p>Forgot your password? Enter your email to reset it</p>
          <div class="inputs">
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
          </div>
          <button type="submit">Reset</button>
          <div class="angle"></div>
        </form>
        <div class="background"></div>
      </div>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import ConfirmModal from "@/components/ConfirmModal.vue";
import EmailIcon from "@/components/Icons/EnvelopeIcon.vue";
import SpinnerLoading from "@/components/SpinnerLoading.vue";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseInit";
import type { ValidationObserver } from "vee-validate";
export default {
  name: "ForgotPassword",
  components: { EmailIcon, ConfirmModal, SpinnerLoading },
  data: () => {
    return { email: "", modalActive: false, modalMessage: "", loading: false };
  },
  methods: {
    closeModal() {
      this.modalActive = false;
      this.email = "";
      (this.$refs.form as InstanceType<typeof ValidationObserver>).reset();
    },
    resetPassword() {
      this.loading = true;
      this.modalActive = true;
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          this.loading = false;
          this.modalMessage =
            "If your account exists, you will receive an email";
          this.modalActive = true;
        })
        .catch((error) => {
          this.loading = false;
          this.modalMessage = error.message;
          this.modalActive = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }

      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
