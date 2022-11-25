import Vue from "vue";
import Vuex from "vuex";
import { db, auth } from "@/firebase/firebaseInit";
import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import type { Post } from "@/models/Post";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    blogPosts: [] as Post[],
    postLoaded: false,
    postPreviewing: false,
    blogHTML: "",
    blogTitle: "",
    blogPhotoName: "",
    blogPhotoFileURL: "",
    blogPhotoPreview: false,
    editPost: false,
    user: null,
    profileAdmin: false,
    profileEmail: "",
    profileFirstName: "",
    profileLastName: "",
    profileUsername: "",
    profileId: "",
    profileInitials: "",
  },
  mutations: {
    newBlogPost(state, blogHTML: string) {
      state.blogHTML = blogHTML;
    },
    updateBlogTitle(state, blogTitle: string) {
      state.blogTitle = blogTitle;
    },
    fileNameChange(state, blogPhotoName: string) {
      state.blogPhotoName = blogPhotoName;
    },
    createFileURL(state, blogPhotoFileURL) {
      state.blogPhotoFileURL = blogPhotoFileURL;
    },
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    toggleEditPost(state, payload: boolean) {
      state.editPost = payload;
    },
    setPostPreviewing(state, payload: boolean) {
      state.postPreviewing = payload;
    },
    updateUser(state, user) {
      state.user = user;
    },
    setProfileAdmin(state, profileAdmin: boolean) {
      state.profileAdmin = profileAdmin;
    },
    setProfileInfo(state, userDoc: DocumentSnapshot<DocumentData>) {
      state.profileId = userDoc.id;
      state.profileEmail = userDoc.data()?.email;
      state.profileFirstName = userDoc.data()?.firstName;
      state.profileLastName = userDoc.data()?.lastName;
      state.profileUsername = userDoc.data()?.username;
    },
    setProfileInitials(state) {
      state.profileInitials =
        (state.profileFirstName.match(/(\b\S)?/g)?.join("") || "") +
        (state.profileLastName.match(/(\b\S)?/g)?.join("") || "");
    },
    changeFirstName(state, profileFirstName) {
      state.profileFirstName = profileFirstName;
    },
    changeLastName(state, profileLastName) {
      state.profileLastName = profileLastName;
    },
    changeUsername(state, profileUsername) {
      state.profileUsername = profileUsername;
    },
    resetBlogValues(state) {
      state.blogHTML = "";
      state.blogPhotoFileURL = "";
      state.blogPhotoName = "";
      state.blogTitle = "";
    },
    filterBlogPost(state, blogId: string) {
      state.blogPosts = state.blogPosts.filter(
        (post) => post.blogId !== blogId
      );
    },
    setBlogState(state, post: Post) {
      state.blogTitle = post.blogTitle;
      state.blogHTML = post.blogHTML;
      state.blogPhotoFileURL = post.blogCoverPhoto;
      state.blogPhotoName = post.blogCoverPhotoName;
    },
  },
  getters: {
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2);
    },
    blogPostsCards(state) {
      return state.blogPosts.slice(2, 6);
    },
  },
  actions: {
    async getCurrentUser({ commit }, user: User) {
      const docSnap = await getDoc(
        doc(db, "users", auth.currentUser?.uid || "")
      );
      if (docSnap.exists()) {
        commit("setProfileInfo", docSnap);
        commit("setProfileInitials");
        const token = await user.getIdTokenResult();
        const admin = token.claims.admin;
        commit("setProfileAdmin", admin);
      }
    },
    async updateUserSettings({ commit, state }) {
      await updateDoc(doc(db, "users", state.profileId), {
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      });
      commit("setProfileInitials");
    },
    async getPost({ state }) {
      const results = await getDocs(
        query(collection(db, "blogPosts"), orderBy("date", "desc"))
      );
      state.blogPosts = [
        ...results.docs.map((doc) => {
          const post: Post = {
            blogId: doc.data().blogId,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
            blogHTML: doc.data().blogHTML,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
          };
          return post;
        }),
      ];
      state.postLoaded = true;
    },
    async deletePost({ commit }, blogId: string) {
      commit("filterBlogPost", blogId);
      await deleteDoc(doc(db, "blogPosts", blogId));
    },
  },
});
