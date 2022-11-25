import Vue from "vue";
import VueRouter from "vue-router";

import AdminView from "@/views/AdminView.vue";
import BlogsView from "@/views/BlogsView.vue";
import CreatePost from "@/views/CreatePost.vue";
import EditPost from "@/views/EditPost.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import PreviewPost from "@/views/PreviewPost.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ViewPost from "@/views/ViewPost.vue";
import { auth } from "@/firebase/firebaseInit";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home",
        requiresAuth: false,
      },
    },
    {
      path: "/blogs",
      name: "blogs",
      component: BlogsView,
      meta: {
        title: "Blogs",
        requiresAuth: false,
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        title: "Login",
        requiresAuth: false,
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        title: "Register",
        requiresAuth: false,
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPassword,
      meta: {
        title: "Forgot Password",
        requiresAuth: false,
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        title: "Profile",
        requiresAuth: true,
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {
        title: "Admin",
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: "/create-post",
      name: "create-post",
      component: CreatePost,
      meta: {
        title: "Create Post",
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: "/preview-post",
      name: "preview-post",
      component: PreviewPost,
      meta: {
        title: "Preview Post",
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: "/view-post/:blogId",
      name: "view-post",
      component: ViewPost,
      meta: {
        title: "View Post",
        requiresAuth: false,
      },
    },
    {
      path: "/edit-post/:blogId",
      name: "edit-post",
      component: EditPost,
      meta: {
        title: "Edit Post",
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta?.title} | VueBlogs`;
  next();
});

router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  let admin = null;
  if (user) {
    const token = await user.getIdTokenResult();
    admin = token.claims.admin;
  }
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (user) {
      if (to.matched.some((route) => route.meta.requiresAdmin)) {
        if (admin) {
          return next();
        }
        return next({ name: "home" });
      }
      return next();
    }
    return next({ name: "home" });
  }
  return next();
});

export default router;
