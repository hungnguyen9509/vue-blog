<template>
  <div class="home">
    <BlogPost v-if="!user" :post="welcomeScreen" />
    <BlogPost v-for="post in blogPostsFeed" :key="post.blogId" :post="post" />
    <div class="blog-card-wrap">
      <div class="container">
        <h3>View More Recent Blogs</h3>
        <div class="blog-cards">
          <BlogCard
            v-for="post in blogPostsCards"
            :key="post.blogId"
            :post="post"
          />
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>never miss a post. Register for your free account today!</h2>
        <router-link :to="{ name: 'register' }" class="router-button">
          Register for VueBlogs
          <ArrowRightLightIcon class="arrow arrow-light" />
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BlogPost from "@/components/BlogPost.vue";
import BlogCard from "@/components/BlogCard.vue";
import ArrowRightLightIcon from "@/components/Icons/ArrowRightLightIcon.vue";
export default {
  name: "HomeView",
  components: { BlogPost, BlogCard, ArrowRightLightIcon },
  data: () => {
    return {
      welcomeScreen: {
        title: "Welcome!",
        blogPost:
          "Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
        welcomeScreen: true,
        photo: "coding.jpg",
      },
    };
  },
  computed: {
    blogPostsCards() {
      return this.$store.getters.blogPostsCards;
    },
    blogPostsFeed() {
      return this.$store.getters.blogPostsFeed;
    },
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 800px) {
      padding: 125px 25px;
      flex-direction: row;
    }
  }

  .router-button {
    display: flex;
    align-items: center;
    font-size: 14px;
    text-decoration: none;
    @media (min-width: 800px) {
      margin-left: auto;
    }
  }

  h2 {
    font-weight: 300;
    font-size: 28px;
    max-width: 425px;
    width: 100%;
    text-align: center;
    text-transform: uppercase;

    @media (min-width: 800px) {
      text-align: initial;
      font-size: 40px;
    }
  }
}
</style>
