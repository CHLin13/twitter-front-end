<template>
  <div>
    <Loading :is-loading="isLoading" v-if="isLoading" />
    <div v-else class="mainPage-container">
      <ModalForReplyTweet
        @after-click-cross="handleAfterTweetCancel"
        @replyTweet="handleAfterReplyTweet"
        :tweet="clickedTweet"
        v-if="isPostClicked"
      />
      <UserSidebar class="user-sidebar" />
      <MainSection
        @after-tweet-submit="handleAfterSubmit"
        @after-like-clicked="handleAfterLikeClick"
        @after-dislike-clicked="handleAfterDislikeClick"
        @after-comment-click="handleAfterCommentClicked"
        :tweets="tweets"
        :initial-current-user="currentUser"
      />
      <Trends
        @after-following="handleAfterFollowing"
        @after-cancel-following="handleAfterCacenlFollowing"
        class="trend-section"
      />
    </div>
  </div>
</template>

<script>
import UserSidebar from "../components/UserSidebar.vue";
import Trends from "../components/Trends.vue";
import MainSection from "../components/MainSection.vue";
import ModalForReplyTweet from "../components/ModalForReplyTweet.vue";
import Loading from "../components/Loading.vue";
import tweetsAPI from "../apis/tweets";
import likeAPI from "../apis/likes";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";

export default {
  name: "MainPage",
  components: {
    UserSidebar,
    Trends,
    MainSection,
    ModalForReplyTweet,
    Loading,
  },
  data() {
    return {
      tweets: [],
      newTweets: [],
      followings: [],
      isPostClicked: false,
      clickedTweet: {},
      isLoading: true,
    };
  },
  created() {
    this.fetchTweets();
  },
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    async fetchTweets() {
      // API
      try {
        let tweetResponse = await tweetsAPI.getTweets();
        if (tweetResponse.statusText !== "OK") {
          throw new Error(tweetResponse.status);
        }
        this.tweets = tweetResponse.data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法顯示資料，請稍後再試",
        });
      }
    },

    async handleAfterSubmit(newDescription) {
      try {
        // 發送 API
        let { data } = await tweetsAPI.postTweet({
          UserId: this.currentUser.id,
          description: newDescription,
        });
        if (data.status !== "success") {
          throw new Error(data.status);
        }
        this.$router.go(0);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `暫時無法處理請求，請稍後再試。 \n 錯誤原因：${error}`,
        });
      }
    },
    async handleAfterLikeClick(tweetId) {
      try {
        // 發送 API
        let response = await likeAPI.likeTweet({ tweetId });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }
        //頁面即時更新
        // 先 render 找出符合 tweetId 的 tweet
        this.tweets.filter((tweet) => {
          if (tweet.id === tweetId) {
            // 找到 tweet 後，判斷如果使用者還沒按過讚就把使用者 id push Likes 陣列裡
            if (
              !tweet.Likes.some((Like) => Like.UserId === this.currentUser.id)
            ) {
              tweet.Likes.push({ UserId: this.currentUser.id });
            }
          }
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `暫時無法處理請求，請稍後再試。 \n 錯誤原因：${error}`,
        });
      }
    },
    async handleAfterDislikeClick(tweetId) {
      try {
        // 發送 API
        let response = await likeAPI.unlikeTweet({ tweetId });
        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }
        // 頁面即時更新;
        this.tweets.filter((tweet) => {
          if (tweet.id === tweetId) {
            tweet.Likes = tweet.Likes.filter((Like) => {
              return Like.UserId !== this.currentUser.id;
            });
          }
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `暫時無法處理請求，請稍後再試。錯誤原因：${error}`,
        });
      }
    },
    async handleAfterReplyTweet(comment) {
      const tweetId = this.clickedTweet.id.toString();
      try {
        if (!comment) {
          Toast.fire({
            icon: "error",
            title: "請輸入內容",
          });
          return;
        }
        const { data } = await tweetsAPI.addReply({ tweetId, comment });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.isPostClicked = false;
        this.$router.go(0);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: `回覆推文失敗，請稍後再試。錯誤原因：${error}`,
        });
      }
    },
    handleAfterTweetCancel() {
      this.isPostClicked = false;
    },
    handleAfterCommentClicked(clickedComment) {
      this.isPostClicked = true;
      this.clickedTweet = clickedComment;
    },
    //同步更新
    handleAfterFollowing(userId) {
      for (let tweet of this.tweets) {
        if (tweet.UserId == userId) {
          this.newTweets.push(tweet);
        }
      }
    },
    handleAfterCacenlFollowing(userId) {
      this.newTweets = this.newTweets.filter((tweet) => {
        return tweet.UserId !== userId;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.mainPage-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  width: 1440px;
  max-width: 1440px;
  .main-section {
    border: 1px solid #e6ecf0;
    width: 40%;
    margin-left: 55px;
    margin-right: 30px;
  }

  .trend-section {
    position: sticky;
    top: 15px;
  }
}
</style>