<template>
  <div class="chat-room-container">
    <UserSidebar class="sidebar-section" />
    <ChatRoomSection
      :self-msg="selfMsg"
      @after-sent-text="send"
      class="chat-room-section"
    />
  </div>
</template>

<script>
import UserSidebar from "../components/UserSidebar.vue";
import ChatRoomSection from "../components/ChatRoomSection.vue";
import { mapState } from "vuex";

export default {
  components: {
    UserSidebar,
    ChatRoomSection,
  },
  data() {
    return {
      input: "",
      msg: "",
      selfMsg: "",
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    console() {
      console.log(window.location);
    },
    // 從 ChatRoomSection.vue 拿到資料後透過 socket 傳送訊息給後端
    send(text) {
      this.$socket.emit("emit_method", {
        msg: text,
        userId: this.currentUser.id,
      });
      this.input = "";
    },
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    self(data) {
      console.log("self");
      console.log(data);
      if (data.msg !== "") {
        this.selfMsg = data.msg;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.chat-room-container {
  display: flex;
  margin: 0 auto;
  flex-flow: row nowrap;
  width: 1440px;
  max-width: 1440px;
  .chat-room-section {
    flex: 1;
    width: 26.7%;
  }
  .sidebar-section {
    width: 26.7%;
    padding-left: 95px;
  }
}
</style>
