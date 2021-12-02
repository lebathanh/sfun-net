<template>
  <div class="body">
    <div class="posts-top">
      <div class="posts-top-bg">
        <img :src="getBackGround" />
        <div class="modal-overlay">
          <div class="modal-overlay-bg">
            <span class="posts-top-name">{{ group.name }} </span>
            <div v-if="checkJoined" class="posts-top-write" @click="HandlePost">
              <v-icon color="white">mdi-note-edit</v-icon>
              <span>Write a post</span>
              <div class="display_none">
                <write-post-component v-if="checkJoined" ref="write" :group="group._id" :groupid="true" @updatePostsGroupId="updatePostsGroupId" />
              </div>
            </div>
            <p class="posts-top-quantity">{{ group.members.length }} members</p>
            <v-menu bottom left offset-y transition="slide-y-transition">
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" class="menu" v-on="on">mdi-dots-vertical</v-icon>
              </template>

              <v-list min-width="150px">
                <v-list-item-group>
                  <!-- Change info -->
                  <v-list-item v-if="checkJoined && checkIsAdmin" dense @click="HandleLeave">
                    <v-list-item-icon>
                      <v-icon>mdi-book-edit-outline </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Edit group</v-list-item-title>
                  </v-list-item>

                  <!-- Change background -->
                  <v-list-item v-if="checkJoined && checkIsAdmin" dense @click="HandleLeave">
                    <v-list-item-icon>
                      <v-icon>mdi-image</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Change background</v-list-item-title>
                  </v-list-item>

                  <!-- Add admin -->
                  <v-list-item v-if="checkJoined && checkIsAdmin" dense @click="HandleLeave">
                    <v-list-item-icon>
                      <v-icon>mdi-account-key-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Add admin</v-list-item-title>
                  </v-list-item>

                  <!-- Leave -->
                  <v-list-item v-if="checkJoined && !checkIsAdmin" dense @click="HandleLeave">
                    <v-list-item-icon>
                      <v-icon color="red">mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Leave</v-list-item-title>
                  </v-list-item>

                  <!-- Join -->
                  <v-list-item v-if="!checkJoined" dense @click="handleJoin($event, group._id)">
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-login</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Join</v-list-item-title>
                  </v-list-item>

                  <!-- Report -->
                  <v-list-item dense>
                    <v-list-item-icon>
                      <v-icon color="warning">mdi-alert-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Report</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
    <div class="posts-content">
      <div v-if="checkJoined" class="posts-content__wrapper">
        <post-component
          v-for="(post, i) in group.posts"
          :key="i"
          :post="post"
          :group="true"
          :groupid="true"
          @sendMessGroupId="sendMessGroupId"
          @likePostGroupId="likePostGroupId"
          @disLikePostGroupId="disLikePostGroupId"
          @delPostGroupId="delPostGroupId"
        />
      </div>
      <div v-if="!checkJoined" class="posts-content__wrapper">
        <p>Oh! You are not a member of this group, join to see more...</p>
        <v-btn color="primary" @click="handleJoin($event, group._id)">Join</v-btn>
      </div>
    </div>

    <!-- Amination -->
    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Leave successfully!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarFail" color="error" outlined>
      Something went wrong!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import WritePostComponent from '@/components/home/WritePost.vue'
import PostComponent from '@/components/home/Post.vue'

export default {
  components: {
    WritePostComponent,
    PostComponent,
  },
  props: {
    group: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
  },

  data: () => ({
    snackbarSuccess: false,
    snackbarFail: false,
    overlay: false,
  }),

  computed: {
    checkJoined(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.groups.map((x) => x._id).includes(ctx.group._id)
      } else {
        return false
      }
    },
    checkIsAdmin(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user._id === ctx.group.admin._id
      } else {
        return false
      }
    },
    getBackGround(ctx) {
      return ctx.group.background === null ? ctx.$store.state.bgDefault : ctx.group.background.imgUrl
    },
  },

  methods: {
    HandlePost() {
      this.$refs.write.dialog = true
    },
    async HandleLeave() {
      this.overlay = true
      try {
        const result = await this.$axios.put(`/api/group/leave/${this.group._id}`, { user: this.$auth.user._id })
        if (result.data.success) {
          this.$emit('refreshSelected')
          await this.$auth.fetchUser()
          await this.$store.commit('setUser', this.$auth.user)
          this.overlay = false
          this.snackbarSuccess = true
        } else {
          this.overlay = false
          this.snackbarFail = true
        }
      } catch (error) {
        this.overlay = false
        this.snackbarFail = true
      }
    },
    async handleJoin(e, id) {
      e.stopPropagation()
      try {
        this.overlay = true
        const result = await this.$axios.put(`/api/group/join`, { user: this.$auth.user._id, group: id })
        if (result.data.success) {
          await this.$auth.fetchUser()
          await this.$store.commit('setUser', this.$auth.user)
          this.overlay = false
        } else {
          this.overlay = false
          this.snackbarFail = true
        }
      } catch (error) {
        this.overlay = false
        this.snackbarFail = true
      }
    },
    sendMessGroupId(data) {
      this.$emit('sendMessGroupId', data)
    },
    likePostGroupId(data) {
      this.$emit('likePostGroupId', data)
    },
    disLikePostGroupId(data) {
      this.$emit('disLikePostGroupId', data)
    },
    delPostGroupId(data) {
      this.$emit('delPostGroupId', data)
    },
    updatePostsGroupId(data) {
      this.$emit('updatePostsGroupId', data)
    },
  },
}
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  .posts-top {
    position: relative;
    width: 95%;
    height: 30%;
    overflow: hidden;
    &-bg {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        &-bg {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          min-height: 70px;
          background-color: rgba($primary, 0.25);
          padding: 12px 30px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          align-items: flex-end;
        }
      }
      .menu {
        position: absolute;
        color: white;
        top: 4px;
        right: 5px;
      }
    }
    &-name {
      font-size: 30px;
      color: #fff;
      line-height: 70px;
      font-weight: 900;
      letter-spacing: 1px;
      max-height: 72px;
      width: 60%;
      overflow: hidden;
      display: block;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-quantity {
      font-size: 16px;
      font-weight: 400;
      margin-top: 8px;
      color: #fff;
      margin: 0;
    }
    &-write {
      margin-right: 8px;
      span {
        margin-left: 4px;
      }
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        color: $primary;
      }
    }
  }
  .posts-content {
    position: relative;
    margin-top: 10px;
    width: 95%;
    height: calc(70% - 10px);
    background: #fff;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    &__wrapper {
      width: 100%;
      height: 95%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
        background: $secondary;
        border-radius: 30px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba($primary, 0.5);
        border-radius: 30px;
      }
    }
  }
}
.display_none {
  display: none;
}

@media (max-width: 600px) {
  .body {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    .posts-top {
      position: relative;
      width: 95%;
      height: 30%;
      overflow: hidden;
      &-bg {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modal-overlay {
          &-bg {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }
      }
      &-name {
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
