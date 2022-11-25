<template>
  <div class="modal" v-if="modalActive">
    <div class="modal-content">
      <p>{{ modalMessage }}</p>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    modalMessage: String,
    modalActive: Boolean,
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 8px;
    width: 300px;
    padding: 40px 30px;
    background-color: #fff;
    p {
      text-align: center;
    }
    button {
      align-self: center;
    }
  }
}
</style>
