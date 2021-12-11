<template>
  <div class="chat-room-section">
    <div class="online-users">
      <div class="title">
        上線使用者<span class="online-user-count">({{ users.length }})</span>
      </div>
      <div class="user-list">
        <div v-for="user of users" :key="user.id" class="user-item">
          <img :src="user.avatar | emptyImage" class="avatar" alt="avatar" />
          <div class="name">{{ user.name }}</div>
          <div class="account">@{{ user.account }}</div>
        </div>
      </div>
    </div>
    <div class="chat-room">
      <div class="title">公開聊天室</div>
      <div class="chat-display-section">
        <div class="other dialogue">
          <img :src="false | emptyImage" class="avatar" alt="avatar" />
          <div class="desc">
            <div class="input">Hello</div>
            <div class="time">下午 6:01</div>
          </div>
        </div>
        <div class="currentuser dialogue">
          <div class="input">{{ selfMsg }}</div>
          <div class="time">下午 6:01</div>
        </div>
      </div>
      <form @click.stop.prevent="afterSendText" class="input-form">
        <input v-model="text" class="input" type="text" />
        <button class="submit-button" type="submit">>></button>
      </form>
    </div>
  </div>
</template>


<script>
import usersAPI from "../apis/users";
import { emptyImageFilter } from "../utils/mixins";

export default {
  props: {
    selfMsg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      users: [],
      text: "",
      textObj: [
        {
          userId: 11,
          msg: "Hello",
          createdAt: "下午 6:12",
        },
      ],
    };
  },
  mixins: [emptyImageFilter],
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      let { data } = await usersAPI.getTopUsers();
      this.users = data;
    },
    async afterSendText() {
      this.$emit("after-sent-text", this.text);
    },
  },
};
</script>

<style scoped lang="scss">
.chat-room-section {
  border: 1px solid #e6ecf0;
  display: flex;
  height: 100vh;
  .online-users {
    width: 390px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e6ecf0;
    .title {
      border-bottom: 1px solid #e6ecf0;
      padding: 15px;
      font-size: 18px;
      font-weight: 700;
      font-family: monospace;
    }
    .user-list {
      display: flex;
      flex-direction: column;
      .user-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6ecf0;
        padding: 15px;
        .avatar {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }
        .name {
          margin-left: 5px;
          margin-right: 5px;
          font-weight: 700;
          font-size: 15px;
          //刪節號
          width: fit-content;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .account {
          color: #657786;
          font-size: 15px;
        }
      }
    }
  }
  .chat-room {
    display: flex;
    flex-direction: column;
    flex: 1;
    .title {
      border-bottom: 1px solid #e6ecf0;
      padding: 15px;
      font-size: 18px;
      font-weight: 700;
      font-family: monospace;
    }
    .chat-display-section {
      padding: 15px;
      flex: 1;
      .dialogue {
        display: flex;
        margin-bottom: 15px;
        .time {
          color: #657786;
          font-size: 13px;
        }
      }
      .other {
        .avatar {
          margin-right: 10px;
        }
        .input {
          background: #e6ecf0;
          padding: 5px 10px;
          border-radius: 10px;
          font-size: 15px;
          letter-spacing: 1px;
        }
      }
      .currentuser {
        display: flex;
        flex-direction: column;
        & > div {
          align-self: flex-end;
        }
        .input {
          background: #ff6600;
          color: white;
          padding: 5px 10px;
          border-radius: 10px;
          font-size: 15px;
          letter-spacing: 1px;
        }
      }

      .avatar {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .input-form {
      display: flex;
      padding: 15px 15px 10px 15px;
      border-top: 1px solid #e6ecf0;
      .input {
        flex: 1;
        outline: none;
        border: none;
        background: #e6ecf0;
        font-size: 15px;
        border-radius: 8px;
        padding: 10px;
        letter-spacing: 1.5px;
      }
      .submit-button {
        background: white;
        border: none;
      }
    }
  }
}
</style>