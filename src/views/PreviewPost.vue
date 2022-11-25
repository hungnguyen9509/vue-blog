<template>
  <div class="post-view">
    <div class="container">
      <h2>{{ blogTitle }}</h2>
      <img :src="blogCoverPhoto" class="img-cover" />
      <div class="post-content" v-html="blogHTML"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PreviewPost",
  computed: {
    blogTitle() {
      return this.$store.state.blogTitle;
    },
    blogHTML() {
      return this.$store.state.blogHTML;
    },
    blogCoverPhoto() {
      return this.$store.state.blogPhotoFileURL;
    },
  },
  mounted() {
    this.$store.commit("setPostPreviewing", true);
  },
};
</script>

<style lang="scss">
.post-view {
  min-height: 100%;

  .container {
    max-width: 1000px;
    padding: 25px 25px 32px;
  }

  .img-cover {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  h2 {
    margin-bottom: 16px;
    font-weight: 300;
    font-size: 32px;
  }
}
</style>
