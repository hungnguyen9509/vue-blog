<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'home' }"
          >VueBlogs</router-link
        >
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link class="link" :to="{ name: 'home' }">Home</router-link>
          <router-link class="link" :to="{ name: 'blogs' }">Blogs</router-link>
          <router-link v-if="admin" class="link" :to="{ name: 'create-post' }"
            >Create Post</router-link
          >
          <router-link v-if="!user" class="link" :to="{ name: 'login' }"
            >Login/Register</router-link
          >
        </ul>
        <div
          v-if="user"
          class="profile"
          ref="profile"
          @click="toggleProfileMenu"
        >
          <span>{{ storeState.profileInitials }}</span>
          <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ storeState.profileInitials }}</p>
              <div class="right">
                <p>
                  {{ storeState.profileFirstName }}
                  {{ storeState.profileLastName }}
                </p>
                <p>{{ storeState.profileUsername }}</p>
                <p>{{ storeState.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link :to="{ name: 'profile' }" class="option">
                  <UserIcon class="icon" />
                  <p>Profile</p>
                </router-link>
              </div>
              <div v-if="admin" class="option">
                <router-link :to="{ name: 'admin' }" class="option">
                  <AdminIcon class="icon" />
                  <p>Admin</p>
                </router-link>
              </div>
              <div @click="logout" class="option">
                <SignOutIcon class="icon" />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div @click="toggleMobileNav">
      <MenuIcon class="menu-icon" v-show="mobile" />
    </div>
    <Transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link class="link" :to="{ name: 'home' }">Home</router-link>
        <router-link class="link" :to="{ name: 'blogs' }">Blogs</router-link>
        <router-link v-if="admin" class="link" :to="{ name: 'create-post' }"
          >Create Post</router-link
        >
        <router-link v-if="!user" class="link" :to="{ name: 'login' }"
          >Login/Register</router-link
        >
      </ul>
    </Transition>
  </header>
</template>

<script lang="ts">
import MenuIcon from "./Icons/MenuIcon.vue";
import UserIcon from "./Icons/UserIcon.vue";
import AdminIcon from "./Icons/AdminIcon.vue";
import SignOutIcon from "./Icons/SignOutIcon.vue";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseInit";

import { useDebounceFn } from "@vueuse/core";

interface HeaderNavigationDataType {
  mobile: null | boolean;
  mobileNav: null | boolean;
  profileMenu: null | boolean;
  windowWidth: null | number;
}

export default {
  name: "HeaderNav",
  components: { MenuIcon, UserIcon, AdminIcon, SignOutIcon },
  data: (): HeaderNavigationDataType => {
    return {
      mobile: null,
      mobileNav: null,
      profileMenu: null,
      windowWidth: null,
    };
  },
  created() {
    const debouncedFn = useDebounceFn(this.checkScreen, 10);
    window.addEventListener("resize", debouncedFn);
    this.checkScreen();
  },
  methods: {
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 750) {
        this.mobile = true;
        return;
      }

      this.mobile = false;
      this.mobileNav = false;
      return;
    },

    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },

    toggleProfileMenu(e: MouseEvent) {
      if (e.target === this.$refs.profile) {
        this.profileMenu = !this.profileMenu;
      }
    },

    async logout() {
      await signOut(auth);
      window.location.reload();
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    admin() {
      return this.$store.state.profileAdmin;
    },
    storeState() {
      return this.$store.state;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background-color: white;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;

    &:hover {
      color: #1eb8b8;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;
    align-items: center;

    .branding {
      display: flex;

      .header {
        font-weight: 600;
        font-size: 24px;
        color: black;
        text-decoration: none;
      }
    }

    .nav-links {
      margin-left: auto;
      display: flex;
      align-items: center;

      ul {
        display: flex;
        margin-right: 32px;
        gap: 32px;
      }

      .profile {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: white;
        background-color: #303030;

        span {
          pointer-events: none;
          user-select: none;
          text-transform: uppercase;
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0px;
          width: 250px;
          background-color: #303030;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          .info {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid white;
            .initials {
              position: initial;
              width: 40px;
              height: 40px;
              background-color: #fff;
              color: #303030;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              text-transform: uppercase;
            }

            .right {
              flex: 1;
              margin-left: 24px;

              p:nth-of-type(1) {
                font-size: 14px;
              }

              p:nth-of-type(2),
              p:nth-of-type(3) {
                font-size: 12px;
              }
            }
          }

          .options {
            padding: 15px;
            .option {
              text-decoration: none;
              color: white;
              display: flex;
              align-items: center;
              margin-bottom: 12px;

              .icon {
                width: 18px;
                height: auto;
              }

              p {
                font-size: 14px;
                margin-left: 12px;
              }

              &:last-child {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
    }
  }

  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 28px;
    right: 25px;
    z-index: 100;
  }

  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;

    .link {
      padding: 15px 0;
      color: white;
      &:hover {
        color: #1eb8b8;
      }
    }
  }

  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 0.4s ease;
  }

  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  .mobile-nav-enter-to {
    transform: translateX(0px);
  }

  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>
