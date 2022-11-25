<template>
  <div class="modal" ref="modal" v-if="modalActive">
    <div class="modal-content">
      <div @click="closePreview">
        <CloseIcon class="icon" />
      </div>
      <img :src="blogCoverPhoto" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import CloseIcon from "@/components/Icons/CloseIcon.vue";
export default {
  props: {
    modalActive: Boolean,
  },
  components: {
    CloseIcon,
  },
  data: () => {
    return {};
  },
  methods: {
    closePreview() {
      this.$store.commit("openPhotoPreview");
    },
  },
  computed: {
    blogCoverPhoto() {
      return this.$store.state.blogPhotoFileURL;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 120;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  .modal-content {
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 12px;
    background-color: #fff;
    height: 400px;
    width: 600px;
    padding: 50px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    .icon {
      width: 24px;
      height: auto;
      cursor: pointer;
      font-size: 24px;
      position: absolute;
      top: 15px;
      right: 15px;
      color: #303030;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: top;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
