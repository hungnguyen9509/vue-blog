<template>
  <div class="create-post">
    <BlogCoverPreview :modalActive="modalActive" />
    <SpinnerLoading v-if="loading" />
    <div class="container">
      <div class="err-message" :class="{ invisible: !error }">
        <p><span>Error: </span>{{ errorMessage }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter blog title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <input
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            accept="image/*"
            @change="fileChange"
          />
          <button
            @click="openPreview"
            class="preview"
            :class="{ 'button-inactive': !storeState.blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ storeState.blogPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <vue2-tinymce-editor v-model="blogHTML" :options="options" />
      </div>
      <div class="blog-actions">
        <button @click="updateBlog">Save Changes</button>
        <router-link class="router-button" :to="{ name: 'preview-post' }"
          >Preview Changes</router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BlogCoverPreview from "@/components/BlogCoverPreview.vue";
import SpinnerLoading from "@/components/SpinnerLoading.vue";
import { db, storage } from "@/firebase/firebaseInit";
import type { Post } from "@/models/Post";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import type { EditorSettings } from "tinymce";
import contentCss from "tinymce/skins/content/default/content.min.css";
import contentUiCss from "tinymce/skins/ui/oxide/content.min.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Vue2TinymceEditor } from "vue2-tinymce-editor";

interface CreatePostDataType {
  file: File | null;
  error: boolean | null;
  errorMessage: string | null;
  timeoutId: number;
  blogId: string;
  currentPost: Post | null;
  loading: boolean;
  options: Partial<EditorSettings>;
}
export default {
  name: "CreatePost",
  components: { BlogCoverPreview, Vue2TinymceEditor, SpinnerLoading },
  data: (): CreatePostDataType => {
    return {
      file: null,
      error: null,
      errorMessage: null,
      loading: false,
      timeoutId: 0,
      blogId: "",
      currentPost: null,
      options: {
        placeholder: "Write your blog content here...",
        menubar: false,
        resize: false,
        skin: false,
        content_css: false,
        content_style: [contentCss, contentUiCss].join("\n"),
        toolbar:
          "fontselect fontsizeselect formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link table removeformat code | image",
        file_picker_types: "image",
        file_picker_callback: function (cb) {
          const input = document.createElement("input") as HTMLInputElement;
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.addEventListener("change", function () {
            if (!this.files) return;
            const file = this.files[0];
            const storageRef = ref(storage, `blogPostPhotos/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
              },
              (err) => {
                console.log("Error when upload post photo: ", err);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );

                cb(downloadURL, { title: file.name });
              }
            );
          });

          input.click();
        },
      },
    };
  },
  methods: {
    fileChange() {
      const blogPhotoRef = this.$refs.blogPhoto as HTMLInputElement;
      if (!blogPhotoRef.files?.length) return;

      this.file = blogPhotoRef.files[0];
      const fileName = this.file.name;
      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },
    openPreview() {
      this.$store.commit("openPhotoPreview");
    },
    async updatePost(downloadURL: string | null) {
      const docRef = doc(db, "blogPosts", this.blogId);
      await updateDoc(docRef, {
        blogHTML: this.blogHTML,
        blogCoverPhoto: downloadURL
          ? downloadURL
          : this.currentPost?.blogCoverPhoto,
        blogCoverPhotoName: this.blogCoverPhotoName,
        blogTitle: this.blogTitle,
      });

      this.loading = false;
      this.$store.commit("resetBlogValues");
      await this.$store.dispatch("getPost");
      this.$router.push({
        name: "view-post",
        params: { blogId: docRef.id },
      });
    },
    async updateBlog() {
      if (this.blogTitle.length === 0 || this.blogHTML.length === 0) {
        this.showErrorMessage(
          "Please ensure blog title and blog content has been filled!"
        );
        return;
      }

      this.loading = true;

      if (this.file) {
        const storageRef = ref(
          storage,
          `blogPostPhotos/${this.blogCoverPhotoName}`
        );
        const uploadTask = uploadBytesResumable(storageRef, this.file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (err) => {
            console.log("Error when upload cover photo: ", err);
            this.loading = false;
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await this.updatePost(downloadURL);
          }
        );
      } else {
        await this.updatePost(null);
      }
    },
    showErrorMessage(errorMessage: string) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.error = true;
      this.errorMessage = errorMessage;
      this.timeoutId = window.setTimeout(() => {
        this.error = false;
      }, 5000);
    },
  },
  computed: {
    storeState() {
      return this.$store.state;
    },
    profileId() {
      return this.$store.state.profileId;
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName;
    },
    modalActive() {
      return this.$store.state.blogPhotoPreview;
    },
    blogTitle: {
      get(): string {
        return this.$store.state.blogTitle;
      },
      set(payload: string) {
        this.$store.commit("updateBlogTitle", payload);
      },
    },
    blogHTML: {
      get(): string {
        return this.$store.state.blogHTML;
      },
      set(payload: string) {
        this.$store.commit("newBlogPost", payload);
      },
    },
  },
  mounted() {
    this.blogId = this.$route.params.blogId;
    this.currentPost = this.$store.state.blogPosts.find(
      (post: Post) => post.blogId === this.blogId
    );
    if (this.currentPost && !this.$store.state.postPreviewing) {
      this.$store.commit("setBlogState", this.currentPost);
    }
    this.$store.commit("setPostPreviewing", false);
  },
};
</script>

<style lang="scss">
.create-post {
  position: relative;
  height: 100%;

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: white;
  }

  label,
  button,
  .router-button {
    transition: 0.3s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;
    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 6px;
  }

  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: white;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.3s ease all;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .blog-info {
    display: flex;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.3s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;
      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;

    > div {
      height: 100% !important;
    }

    .tox.tox-tinymce {
      height: 100% !important;
    }
  }

  .blog-actions {
    margin-top: 16px;
    button {
      margin-right: 16px;
    }
  }
}
</style>
