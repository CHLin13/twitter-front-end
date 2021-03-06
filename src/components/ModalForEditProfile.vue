<template>
  <div @click.self="cancelModalClick()" class="modal edit">
    <div class="modal-content">
      <form @submit.stop.prevent="handleSubmit" enctype="multipart/form-data">
        <div class="modal-header">
          <div class="icon cross" @click.stop.prevent="cancelModalClick"></div>
          <span class="title">編輯個人資料</span>
          <button class="save" type="submit">儲存</button>
        </div>

        <div class="modal-body">
          <div
            class="background-photo"
            :style="{
              background: `url(${
                this.editUserCover ? this.editUserCover : ''
              }) no-repeat center/cover`,
            }"
          ></div>
          <div class="icon camera-two">
            <input
              type="file"
              class="coverFile"
              name="cover"
              accept="image/*"
              @change="coverChange"
            />
          </div>
          <img
            class="icon inside-two"
            src="../assets/imgs/camera_inside.png"
            alt=""
          />
          <div class="icon cross" @click.stop.prevent="clearCoverImg()"></div>

          <div
            class="photo"
            :style="{
              background: `url(${
                this.editUserAvatar ? this.editUserAvatar : ''
              }) no-repeat center/cover`,
            }"
          ></div>
          <div class="icon camera-one">
            <input
              class="avatarFile"
              name="avatar"
              accept="image/*"
              @change="avatarChange"
              type="file"
            />
          </div>
          <img
            class="icon inside-one"
            src="../assets/imgs/camera_inside.png"
            alt=""
          />

          <div class="for-inputs">
            <span class="name tag">名稱</span>
            <input
              v-model="editUserName"
              class="tweet-content name"
              type="text"
              placeholder=""
              name="name"
              maxlength="50"
            />
            <span
              class="word-count"
              :class="{ 'word-limit': editUserName.length === 50 }"
              >{{ editUserName ? editUserName.length : 0 }}/50</span
            >
            <span class="self-intro tag">自我介紹</span>
            <textarea
              v-model="editUserIntro"
              class="tweet-content intro"
              type="textarea"
              placeholder=""
              name="introduction"
              maxlength="160"
            ></textarea>
            <span
              class="word-count"
              :class="{ 'word-limit': editUserIntro.length === 160 }"
              >{{ editUserIntro ? editUserIntro.length : 0 }}/160</span
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { Toast } from "@/utils/helpers";
import usersAPI from "@/apis/users";
import { mapState } from "vuex";

export default {
  name: "ModalForEditProfile",
  components: {},
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editUserName: this.user.name ? this.user.name : "",
      editUserIntro: this.user.introduction ? this.user.introduction : "",
      editUserCover: this.user.cover ? this.user.cover : "",
      editUserAvatar: this.user.avatar ? this.user.avatar : "",
    };
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    cancelModalClick() {
      this.$emit("after-click-cross");
    },
    coverChange(e) {
      const { files } = e.target;
      if (files !== 0) {
        const coverUrl = window.URL.createObjectURL(files[0]);
        this.editUserCover = coverUrl;
      }
    },
    avatarChange(e) {
      const { files } = e.target;
      if (files !== 0) {
        const avatarUrl = window.URL.createObjectURL(files[0]);
        this.editUserAvatar = avatarUrl;
      }
    },
    clearCoverImg() {
      this.$emit("uploading", false);
      const coverUrl = "https://i.ytimg.com/vi/KYV0tMXhxUg/maxresdefault.jpg";
      this.editUserCover = coverUrl;
    },
    async handleSubmit(e) {
      try {
        if (this.user.name === "") {
          Toast.fire({
            icon: "warning",
            title: "請輸入名稱",
          });
          return;
        } else if (
          this.user.name.length > 50 &&
          this.user.introduction.length > 160
        ) {
          Toast.fire({
            icon: "warning",
            title: "名稱和自我介紹超過最大限制字數！",
          });
          return;
        } else if (this.user.name.length > 50) {
          Toast.fire({
            icon: "warning",
            title: "名稱只限50字",
          });
          return;
        } else if (this.user.introduction.length > 160) {
          Toast.fire({
            icon: "warning",
            title: "自我介紹只限160字",
          });
          return;
        }

        const form = e.target;
        const formData = new FormData(form);
        this.updateUser(formData);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法更新資料，請稍後再試",
        });
      }
    },
    async updateUser(formData) {
      this.$emit("uploading", true);

      try {
        const { data } = await usersAPI.updateUser({
          userId: this.currentUser.id,
          formData,
        });
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.$emit("complete-edit", this.user);
        this.$emit("uploading", false);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法更新資料，請稍後再試",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$orange: #ff6600;
$deeporange: #f34a16;
$lightdark: #9197a3;
$bitdark: #657786;
$divider: #e6ecf0;
.modal,
.edit {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);

  .modal-content {
    position: absolute;
    left: 50%;
    top: 54px;
    width: 600px;
    height: 654px;
    border-radius: 14px;
    border: 1px solid #c4c4c4;
    transform: translate(-50%, 0);
    // outline: blue solid;

    .modal-header {
      height: 54px;
      // outline: red solid;
      padding: 0;
      display: flex;
      align-items: center;
      .icon.cross {
        width: 15px;
        height: 15px;
        margin: 0 0 0 19.5px;
        mask: url(../assets/svgs/icon_cross.svg) no-repeat center;
        mask-size: contain;
        background-color: $bitdark;
        cursor: pointer;
        transition: ease-in 0.2s;
        &:hover {
          background-color: $orange;
        }
      }
      .title {
        // line-height: 54px;
        margin: 13px 324px 14px 45px;
        justify-items: start;
        font-family: Noto Sans TC;
        font-style: normal;
        font-weight: bold;
        font-size: 19px;
        line-height: 28px;
      }

      .save {
        width: 64px;
        height: 30px;
        background: #ff6600;
        border-radius: 100px;
        color: #ffffff;
        border: none;
        margin: 12px 15px 12px 0;
        &:focus {
          outline: none;
        }
      }
    }

    form {
      height: 100%;
    }

    .modal-body {
      height: 100%;
      position: relative;
      // outline: black solid ;
      padding: 0;
      .background-photo {
        width: 598px;
        height: 200px;
        height: 200px;
        background: url(https://images.unsplash.com/photo-1587502537147-2ba64a62e3d3?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2017&q=80)
          no-repeat center;
        background-size: cover;
      }
      .photo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: #c4c4c4;
        position: absolute;
        left: 15px;
        top: 140px;
        border: 4px solid #ffffff;
        box-sizing: border-box;
        background: url(https://source.unsplash.com/collection/4389261/100x100);
      }
      .for-inputs {
        display: flex;
        flex-direction: column;
        margin-top: 80px;
        // outline: red solid;
        .tweet-content {
          width: 570px;
          height: 150px;
          margin-left: 75px - 16px;
          margin-right: 15px;
          border: none;
          resize: none;
          outline: none;
          background: #f5f8fa;
          margin: 0 15px;
          border-bottom: 2px solid #657786;
          padding: 22px 15px 0 15px;
        }
        .tweet-content.name {
          font-weight: 500;
          font-size: 19px;
          line-height: 28px;
          color: #1c1c1c;
        }
        .name {
          height: 54px;
        }
        .intro {
          margin-top: 43px;
          font-weight: 500;
          font-size: 19px;
          line-height: 28px;
          color: #1c1c1c;
        }
        .word-count {
          text-align: end;
          margin-right: 15px;
          font-family: Noto Sans TC;
          font-style: normal;
          font-weight: 500;
          font-size: 15px;
          line-height: 22px;
          &.word-limit {
            color: red;
          }
        }
      }
      .tag {
        position: absolute;
        left: 30px;
        font-family: Noto Sans TC;
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
      }
      .name {
        top: 285px;
        font-weight: 500;
        font-size: 15px;
        line-height: 15px;
        color: #657786;
      }
      .self-intro {
        font-weight: 500;
        font-size: 15px;
        line-height: 15px;
        bottom: 231px;
        color: #657786;
      }
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        height: 20px;
        width: 20px;
        &::before {
          content: "";
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: block;
          position: absolute;
          border: 1.5px dashed lightgray;
          animation: rotate 10s linear infinite;
        }
      }
      .inside-one,
      .inside-two {
        height: 9.7px;
        width: 9.7px;
      }
      .camera-one {
        top: 190px;
        left: 68px;
        background: url(../assets/imgs/camera.png) no-repeat center;
        background-size: contain;
        cursor: pointer;
        transform-origin: center;

        .avatarFile {
          padding-right: 30px;
          padding-bottom: 30px;
          width: 30px;
          height: 30px;
          opacity: 0;
          z-index: 1;
          cursor: pointer;
        }
      }
      .inside-one {
        top: 196px;
        left: 73px;
        cursor: pointer;
      }

      .camera-two {
        background: url(../assets/imgs/camera.png) no-repeat center;
        background-size: contain;

        top: 90px;
        left: 262px;
        cursor: pointer;
        .coverFile {
          width: 100%;
          height: 100%;
          opacity: 0;
          position: relative;
          z-index: 1;
          cursor: pointer;
        }
      }
      .inside-two {
        top: 96px;
        left: 267px;
        cursor: pointer;
      }

      .cross {
        background: url(../assets/imgs/cross.png) no-repeat center;
        background-size: contain;
        cursor: pointer;
        top: 90px;
        left: 320px;
      }
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
