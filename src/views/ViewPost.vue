<template>
  <div class="post-view" v-if="currentBlog">
    <div class="container">
      <h2>{{ currentBlog.blogTitle }}</h2>
      <h4>
        Posted on:
        {{
          new Date(currentBlog.blogDate).toLocaleString("en-us", {
            dateStyle: "long",
          })
        }}
      </h4>
      <img :src="currentBlog.blogCoverPhoto" class="img-cover" />
      <div class="post-content" v-html="currentBlog.blogHTML"></div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Post } from "@/models/Post";
interface ViewPostDataType {
  currentBlog: Post | null;
}
export default {
  name: "ViewPostView",
  data: (): ViewPostDataType => {
    return {
      currentBlog: null,
    };
  },
  async mounted() {
    this.currentBlog = this.$store.state.blogPosts.find((post: Post) => {
      return post.blogId === this.$route.params.blogId;
    });
  },
};
</script>

<style lang="scss">
.post-view {
  h4 {
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 24px;
  }
}
</style>
