<template>
  <div class="post">
    <!-- Author -->
    <div class="post-info">
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar size="40">
            <img :src="getAvatar" />
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="post-info__name">
            <span v-if="checkGroup">{{ post.group.name }}<v-icon size="30">mdi-menu-right </v-icon> </span>
            <span @click="$router.push(`/user/${post.author._id}`)">{{ `${post.author.lastname} ${post.author.firstname}` }}</span>
          </v-list-item-title>
          <v-list-item-subtitle class="post-info__time">{{ timePost }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-menu bottom left offset-y transition="slide-y-transition">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon> mdi-dots-horizontal </v-icon>
              </v-btn>
            </template>

            <v-list min-width="150px">
              <v-list-item-group>
                <!-- Save -->
                <v-list-item v-if="!checkAuthor && !checkSaved" dense @click="handleSave">
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-content-save-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Save</v-list-item-title>
                </v-list-item>

                <!-- Unsave -->
                <v-list-item v-if="!checkAuthor && checkSaved" dense @click="handleSave">
                  <v-list-item-icon>
                    <v-icon color="warning">mdi-content-save-move-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Unsave</v-list-item-title>
                </v-list-item>

                <!-- Del -->
                <v-list-item v-if="checkAuthor" dense @click="handleDelPost">
                  <v-list-item-icon>
                    <v-icon color="red">mdi-trash-can</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>

                <!-- View -->
                <v-list-item v-if="checkParams" dense @click="$router.push(`/post/${post._id}`)">
                  <v-list-item-icon>
                    <v-icon>mdi-eye-arrow-right</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>View</v-list-item-title>
                </v-list-item>

                <!-- Report -->
                <v-list-item v-if="!checkAuthor" dense>
                  <v-list-item-icon>
                    <v-icon>mdi-alert-decagram</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Report</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </div>

    <!-- Cap -->
    <div class="post-cap">
      <p>{{ post.cap }}</p>
      <!-- <p ref="col_cap" :class="{ see_more: !showCap }">{{ post.cap }}</p>
      <span v-if="!showCap" @click="showCap = !showCap">See more...</span>
      <span v-if="showCap" @click="showCap = !showCap">Hide away.</span> -->
    </div>

    <!-- Media -->
    <div class="post-media">
      <div v-if="getSizeMedia === 1" class="layout">
        <div v-for="(item, i) in getDisplayMedia" :key="i" class="layout-item__1" @click="clickMedia($event, i)">
          <img v-if="item.type === 'img'" :src="item.url" />
          <video v-if="item.type === 'video'" :src="item.url"></video>
          <div v-if="item.type === 'video' && i !== 2" class="model_video">
            <v-icon size="40" color="black"> mdi-play-circle-outline </v-icon>
          </div>
        </div>
      </div>
      <div v-if="getSizeMedia === 2" class="layout">
        <div v-for="(item, i) in getDisplayMedia" :key="i" class="layout-item__2" @click="clickMedia($event, i)">
          <img v-if="item.type === 'img'" :src="item.url" />
          <video v-if="item.type === 'video'" :src="item.url"></video>
          <div v-if="item.type === 'video' && i !== 2" class="model_video">
            <v-icon size="40" color="black"> mdi-play-circle-outline </v-icon>
          </div>
        </div>
      </div>
      <div v-if="getSizeMedia >= 3" class="layout">
        <div v-for="(item, i) in getDisplayMedia" :key="i" class="layout-item__3" @click="clickMedia($event, i)">
          <img v-if="item.type === 'img'" :src="item.url" />
          <video v-if="item.type === 'video'" :src="item.url"></video>
          <div v-if="item.type === 'video'" class="model_video">
            <v-icon size="40" color="black"> mdi-play-circle-outline </v-icon>
          </div>
          <div v-if="i === 2 && getSizeMedia > 3" class="modal">
            <span>+{{ getSizeMedia - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div v-if="getCmtSize > 0 || getLikeSize" class="post-ext">
      <span>{{ getLikeSize }} likes...</span>
      <v-spacer></v-spacer>
      <span>{{ getCmtSize }} Comments</span>
    </div>

    <!-- Like share cmt -->
    <v-divider></v-divider>
    <div class="post-handle">
      <div class="post-handle__item">
        <v-icon v-if="!checkLike" color="gray" @click="handleLike">mdi-heart-outline</v-icon>
        <v-icon v-if="checkLike" color="red" @click="handleDisLike">mdi-heart</v-icon>
        <span>Like</span>
      </div>
      <div class="post-handle__item" @click="focusComment">
        <v-icon>mdi-comment-outline </v-icon>
        <span>Comments</span>
      </div>
      <div class="post-handle__item">
        <v-icon>mdi-share-all-outline </v-icon>
        <span>Share</span>
      </div>
    </div>
    <v-divider></v-divider>

    <!-- Comment -->
    <div v-if="getComments.length > 0" class="post-cmt">
      <p v-if="checkSizeShowCmt" @click="seeLastMess">See last comments...</p>
      <p v-if="!checkSizeShowCmt && getComments.length > 3" @click="hideLastMess">Hide away.</p>
      <v-divider></v-divider>
      <div ref="comment_zone" class="post-cmt__list">
        <comment-component v-for="(item, i) in getComments" :key="i" :comment="item" />
      </div>
    </div>

    <!-- Write comment -->
    <v-menu :close-on-content-click="false" top right offset-y>
      <template #activator="{ on, attrs }">
        <div ref="emoji" v-bind="attrs" class="post-emoji" v-on="on">none</div>
      </template>
      <div>
        <VEmojiPicker @select="selectEmoji" />
      </div>
    </v-menu>
    <div class="post-write">
      <div v-if="commenting" class="post-write__socket">
        Someone's commenting
        <img src="@/assets/images/simple_loading.gif" />
      </div>
      <v-text-field
        ref="input_comment"
        v-model="message"
        append-outer-icon="mdi-send"
        append-icon="mdi-emoticon-outline"
        filled
        clear-icon="mdi-close-circle"
        clearable
        label="Type comment..."
        type="text"
        @click:append="toggleEmoji"
        @click:append-outer="sendMessage"
        @focus="FocusCmt"
        @blur="BlurCmt"
      ></v-text-field>
    </div>

    <!-- Overlay -->
    <div v-if="overlay" class="overlay" @click="closeLB">
      <div class="overlay-item">
        <img v-if="getCrrMedia !== null && getCrrMedia.type === 'img'" :src="getCrrMedia.url" />
        <video v-if="getCrrMedia !== null && getCrrMedia.type === 'video'" :src="getCrrMedia.url" controls></video>
      </div>
      <v-icon size="60" class="overlay-icon overlay-prev" @click="prevMedia">mdi-chevron-left </v-icon>
      <v-icon size="60" class="overlay-icon overlay-next" @click="nextMedia">mdi-chevron-right</v-icon>
    </div>

    <!-- Amination -->
    <v-snackbar v-model="snackbarFail" color="error" outlined>
      Something went wrong!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Successfully!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <!-- Overloading -->
    <v-overlay :value="overload">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'
import CommentComponent from '@/components/home/Comment.vue'

export default {
  components: {
    VEmojiPicker,
    CommentComponent,
  },

  props: {
    post: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
    profile: {
      type: Boolean,
      default: () => false,
    },
    save: {
      type: Boolean,
      default: () => false,
    },
    friend: {
      type: Boolean,
      default: () => false,
    },
    group: {
      type: Boolean,
      default: () => false,
    },
    groupid: {
      type: Boolean,
      default: () => false,
    },
    postid: {
      type: Boolean,
      default: () => false,
    },
  },

  data: () => ({
    current: 0,
    overlay: false,
    overload: false,
    snackbarFail: false,
    snackbarSuccess: false,
    message: '',
    showCap: false,
    showComments: 3,
    commenting: false,
  }),

  computed: {
    getDisplayMedia: (ctx) => {
      if (ctx.post.videos !== [] && ctx.post.images !== []) {
        if (ctx.post.videos.length + ctx.post.images.length === 1) {
          return [
            [
              ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
              ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
            ][0],
          ]
        } else if (ctx.post.videos.length + ctx.post.images.length === 2) {
          return [
            [
              ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
              ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
            ][0],
            [
              ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
              ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
            ][1],
          ]
        } else if (ctx.post.videos.length + ctx.post.images.length >= 3) {
          return [
            [
              ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
              ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
            ][0],
            [
              ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
              ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
            ][1],
            [
              ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
              ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
            ][2],
          ]
        } else {
          return []
        }
      } else {
        return []
      }
    },
    getCrrMedia: (ctx) => {
      if (ctx.post.videos !== [] && ctx.post.images !== []) {
        return [
          ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
          ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
        ][ctx.current]
      } else {
        return null
      }
    },
    getSizeMedia: (ctx) => {
      if (ctx.post.videos !== [] && ctx.post.images !== []) {
        return [
          ...ctx.post.videos.map((item) => ({ type: 'video', url: item.videoUrl })),
          ...ctx.post.images.map((item) => ({ type: 'img', url: item.imgUrl })),
        ].length
      } else {
        return 0
      }
    },
    getAvatar: (ctx) => {
      return ctx.post.author.avatar === null ? ctx.$store.state.avatarDefault : ctx.post.author.avatar.imgUrl
    },
    getLikeSize: (ctx) => {
      return ctx.post.likes.length
    },
    getCmtSize: (ctx) => {
      return ctx.post.comments.length
    },
    checkLike: (ctx) => {
      if (ctx.$auth.loggedIn) {
        if (ctx.post.likes.includes(ctx.$auth.user._id)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    timePost: (ctx) => {
      const time = ctx.getTime(ctx.post.time)
      const now = new Date()
      const day = new Date(ctx.post.time)
      const hh = day.getHours()
      const mm = day.getMinutes()
      const ss = day.getSeconds()
      if (day.getDate() === now.getDate() && day.getMonth() === now.getMonth()) {
        if (time > 1 / 24) {
          return `${Math.round(time * 24)} hours.`
        } else {
          return `${Math.round(time * 24 * 60)} minutes.`
        }
      } else if (now.getDate() - day.getDate() === 1 && day.getMonth() === now.getMonth()) {
        return `Yesterday at ${hh}:${mm}:${ss}.`
      } else if (day.getMonth() === now.getMonth()) {
        return `${Math.abs(now.getDate() - day.getDate())} days at ${hh}:${mm}:${ss}.`
      } else {
        return `${day.toISOString().substr(0, 10)} at ${hh}:${mm}:${ss}.`
      }
    },
    getComments: (ctx) => {
      return ctx.post.comments.slice(ctx.post.comments.length - ctx.showComments)
    },
    checkSizeShowCmt: (ctx) => {
      if (ctx.showComments >= ctx.post.comments.length) {
        return false
      } else {
        return true
      }
    },
    getSizeCap: (ctx) => {
      if (ctx.post.cap.length > 250) {
        return true
      } else {
        return false
      }
    },
    checkAuthor: (ctx) => {
      if (ctx.$auth.loggedIn) {
        return ctx.$auth.user._id === ctx.post.author._id
      } else {
        return false
      }
    },
    checkParams: (ctx) => {
      return Object.keys(ctx.$route.params).length === 0
    },
    checkSaved: (ctx) => {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.saved.map((i) => i._id).includes(ctx.post._id)
      }
    },
    checkGroup: (ctx) => {
      return ctx.post.group !== null
    },
  },

  created() {
    if (this.post.comments.length < 3) {
      this.showComments = this.post.comments.length
    }
  },

  mounted() {
    this.socket.on(`srv_commenting-${this.post._id}`, () => {
      this.commenting = true
    })
    this.socket.on(`srv_uncommenting-${this.post._id}`, () => {
      this.commenting = false
    })
    this.socket.on(`srv_commented-${this.post._id}`, (cmt) => {
      ;(async () => {
        if (this.profile) {
          // profile
          const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
          const data = {
            index,
            comment: cmt,
          }
          await this.$store.commit('addCommentsUser', data)
        } else if (this.save) {
          // save
          const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
          const data = {
            index,
            comment: cmt,
          }
          await this.$store.commit('addCommentsSave', data)
        } else if (this.friend) {
          // friend
          const index = await this.$store.state.friend.posts.findIndex((x) => x._id === this.post._id)
          const data = {
            index,
            comment: cmt,
          }
          await this.$store.commit('addCommentsFriend', data)
        } else if (this.group) {
          if (this.groupid) {
            // group id
            const data = {
              id: this.post._id,
              comment: cmt,
            }
            await this.$emit('sendMessGroupId', data)
          }
          // group
          const indexG = await this.$store.state.user.groups.findIndex((x) => x._id === this.post.group._id)
          const indexP = await this.$store.state.user.groups[indexG].posts.findIndex((x) => x._id === this.post._id)
          const data = {
            indexG,
            indexP,
            comment: cmt,
          }
          await this.$store.commit('addCommentsGroup', data)
        } else if (this.postid) {
          // post id
          const data = {
            comment: cmt,
          }
          await this.$emit('sendMessPostId', data)
        } else {
          // home
          const index = await this.$store.state.posts.posts.findIndex((x) => x._id === this.post._id)
          const data = {
            index,
            comment: cmt,
          }
          await this.$store.commit('addComments', data)
        }
        await this.showComments++
        this.$refs.comment_zone.scroll({
          top: this.$refs.comment_zone.scrollHeight,
          behavior: 'smooth',
        })
      })()
    })
  },

  methods: {
    selectEmoji(emoji) {
      this.message += emoji.data
    },
    getTime(d) {
      const now = new Date()
      const post = new Date(d)
      return (now.getTime() - post.getTime()) / (24 * 3600 * 1000)
    },
    toggleEmoji() {
      this.$refs.emoji.click()
    },
    focusComment() {
      this.$refs.input_comment.focus()
    },
    async sendMessage() {
      try {
        const form = {
          author: this.$auth.user._id,
          text: this.message,
        }
        if (form.text !== '') {
          const result = await this.$axios.post(`/api/comment/${this.post._id}`, form)
          if (result.data.success) {
            this.message = ''
            result.data.comment.author = await result.data.user
            this.socket.emit('user_commented', result.data.comment)
            // Custom
            if (this.profile) {
              // profile
              const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
              const data = {
                index,
                comment: result.data.comment,
              }
              await this.$store.commit('addCommentsUser', data)
            } else if (this.save) {
              // save
              const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
              const data = {
                index,
                comment: result.data.comment,
              }
              await this.$store.commit('addCommentsSave', data)
            } else if (this.friend) {
              // friend
              const index = await this.$store.state.friend.posts.findIndex((x) => x._id === this.post._id)
              const data = {
                index,
                comment: result.data.comment,
              }
              await this.$store.commit('addCommentsFriend', data)
            } else if (this.group) {
              if (this.groupid) {
                // group id
                const data = {
                  id: this.post._id,
                  comment: result.data.comment,
                }
                await this.$emit('sendMessGroupId', data)
              }
              // group
              const indexG = await this.$store.state.user.groups.findIndex((x) => x._id === this.post.group._id)
              const indexP = await this.$store.state.user.groups[indexG].posts.findIndex((x) => x._id === this.post._id)
              const data = {
                indexG,
                indexP,
                comment: result.data.comment,
              }
              await this.$store.commit('addCommentsGroup', data)
            } else if (this.postid) {
              // post id
              const data = {
                comment: result.data.comment,
              }
              await this.$emit('sendMessPostId', data)
              ;(async () => {
                // profile
                const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
                if (index !== -1) {
                  const data = {
                    index,
                    comment: result.data.comment,
                  }
                  await this.$store.commit('addCommentsUser', data)
                }
              })()
            } else {
              // home
              const index = await this.$store.state.posts.posts.findIndex((x) => x._id === this.post._id)
              const data = {
                index,
                comment: result.data.comment,
              }
              await this.$store.commit('addComments', data)
              ;(async () => {
                const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
                if (index !== -1) {
                  const data = {
                    index,
                    comment: result.data.comment,
                  }
                  await this.$store.commit('addCommentsSave', data)
                }
              })()
            }
            await this.showComments++
            this.$refs.comment_zone.scroll({
              top: this.$refs.comment_zone.scrollHeight,
              behavior: 'smooth',
            })
          } else {
            this.snackbarFail = true
          }
        }
      } catch (error) {
        this.snackbarFail = true
      }
    },
    seeLastMess() {
      if (this.showComments <= this.post.comments.length - 3) {
        this.showComments = this.showComments + 3
      } else {
        this.showComments = this.post.comments.length
      }
    },
    hideLastMess() {
      this.showComments = 3
    },
    async clickMedia(e, i) {
      this.current = await i
      this.overlay = true
    },
    nextMedia(e) {
      e.stopPropagation()
      if (this.current < this.post.videos.length + this.post.images.length - 1) {
        this.current++
      } else {
        this.current = 0
      }
    },
    prevMedia(e) {
      e.stopPropagation()
      if (this.current === 0) {
        this.current = this.post.videos.length + this.post.images.length - 1
      } else {
        this.current--
      }
    },
    closeLB() {
      this.overlay = false
    },
    async handleLike() {
      try {
        const result = await this.$axios.put(`/api/post/like/${this.post._id}`, { author: this.$auth.user._id })
        if (result.data.success) {
          // Custom
          if (this.profile) {
            // profile
            const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
            if (!this.$store.state.user.posts[index].likes.includes(this.$auth.user._id)) {
              const data = {
                index,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('likePostUser', data)
            }
          } else if (this.save) {
            // save
            const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
            if (!this.$store.state.user.saved[index].likes.includes(this.$auth.user._id)) {
              const data = {
                index,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('likePostSave', data)
            }
          } else if (this.friend) {
            // friend
            const index = await this.$store.state.friend.posts.findIndex((x) => x._id === this.post._id)
            if (!this.$store.state.friend.posts[index].likes.includes(this.$auth.user._id)) {
              const data = {
                index,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('likePostFriend', data)
            }
          } else if (this.group) {
            if (this.groupid) {
              // group id
              const data = {
                id: this.post._id,
              }
              await this.$emit('likePostGroupId', data)
            }
            // group
            const indexG = await this.$store.state.user.groups.findIndex((x) => x._id === this.post.group._id)
            const indexP = await this.$store.state.user.groups[indexG].posts.findIndex((x) => x._id === this.post._id)
            const data = {
              indexG,
              indexP,
              _id: this.$auth.user._id,
            }
            await this.$store.commit('likePostGroup', data)
            ;(async () => {
              // profile
              const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
              if (index !== -1) {
                if (!this.$store.state.user.posts[index].likes.includes(this.$auth.user._id)) {
                  const data = {
                    index,
                    _id: this.$auth.user._id,
                  }
                  await this.$store.commit('likePostUser', data)
                }
              }
            })()
          } else if (this.postid) {
            // post id
            await this.$emit('likePostId')
            ;(async () => {
              // profile
              const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
              if (index !== -1) {
                if (!this.$store.state.user.posts[index].likes.includes(this.$auth.user._id)) {
                  const data = {
                    index,
                    _id: this.$auth.user._id,
                  }
                  await this.$store.commit('likePostUser', data)
                }
              }
            })()
          } else {
            // home
            const index = await this.$store.state.posts.posts.findIndex((x) => x._id === this.post._id)
            if (!this.$store.state.posts.posts[index].likes.includes(this.$auth.user._id)) {
              const data = {
                index,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('likePost', data)
            }
            ;(async () => {
              const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
              if (index !== -1) {
                if (!this.$store.state.user.saved[index].likes.includes(this.$auth.user._id)) {
                  const data = {
                    index,
                    _id: this.$auth.user._id,
                  }
                  await this.$store.commit('likePostSave', data)
                }
              }
            })()
            ;(async () => {
              const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
              if (index !== -1) {
                if (!this.$store.state.user.posts[index].likes.includes(this.$auth.user._id)) {
                  const data = {
                    index,
                    _id: this.$auth.user._id,
                  }
                  await this.$store.commit('likePostUser', data)
                }
              }
            })()
          }
        }
      } catch (error) {
        this.snackbarFail = true
      }
    },
    async handleDisLike() {
      try {
        const result = await this.$axios.put(`/api/post/like/${this.post._id}`, { author: this.$auth.user._id })
        if (result.data.success) {
          // Custom
          if (this.profile) {
            // profile
            const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
            if (this.$store.state.user.posts[index].likes.includes(this.$auth.user._id)) {
              const i = this.$store.state.user.posts[index].likes.indexOf(this.$auth.user._id)
              const data = {
                index,
                i,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('disLikePostUser', data)
            }
          } else if (this.save) {
            // save
            const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
            if (this.$store.state.user.saved[index].likes.includes(this.$auth.user._id)) {
              const i = this.$store.state.user.saved[index].likes.indexOf(this.$auth.user._id)
              const data = {
                index,
                i,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('disLikePostSave', data)
            }
          } else if (this.friend) {
            // friend
            const index = await this.$store.state.friend.posts.findIndex((x) => x._id === this.post._id)
            if (this.$store.state.friend.posts[index].likes.includes(this.$auth.user._id)) {
              const i = this.$store.state.friend.posts[index].likes.indexOf(this.$auth.user._id)
              const data = {
                index,
                i,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('disLikePostFriend', data)
            }
          } else if (this.group) {
            if (this.groupid) {
              // group id
              const data = {
                id: this.post._id,
              }
              await this.$emit('disLikePostGroupId', data)
            }
            // group
            const indexG = await this.$store.state.user.groups.findIndex((x) => x._id === this.post.group._id)
            const indexP = await this.$store.state.user.groups[indexG].posts.findIndex((x) => x._id === this.post._id)
            const indexU = await this.$store.state.user.groups[indexG].posts[indexP].likes.indexOf(this.$auth.user._id)
            const data = {
              indexG,
              indexP,
              indexU,
            }
            await this.$store.commit('disLikePostGroup', data)
          } else if (this.postid) {
            // post id
            await this.$emit('disLikePostId')
          } else {
            // home
            const index = await this.$store.state.posts.posts.findIndex((x) => x._id === this.post._id)
            if (this.$store.state.posts.posts[index].likes.includes(this.$auth.user._id)) {
              const i = this.$store.state.posts.posts[index].likes.indexOf(this.$auth.user._id)
              const data = {
                index,
                i,
                _id: this.$auth.user._id,
              }
              await this.$store.commit('disLikePost', data)
            }
            ;(async () => {
              const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
              if (index !== -1) {
                if (this.$store.state.user.saved[index].likes.includes(this.$auth.user._id)) {
                  const i = this.$store.state.user.saved[index].likes.indexOf(this.$auth.user._id)
                  const data = {
                    index,
                    i,
                    _id: this.$auth.user._id,
                  }
                  await this.$store.commit('disLikePostSave', data)
                }
              }
            })()
            ;(async () => {
              const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
              if (index !== -1) {
                if (this.$store.state.user.posts[index].likes.includes(this.$auth.user._id)) {
                  const i = this.$store.state.user.posts[index].likes.indexOf(this.$auth.user._id)
                  const data = {
                    index,
                    i,
                    _id: this.$auth.user._id,
                  }
                  await this.$store.commit('disLikePostUser', data)
                }
              }
            })()
          }
        }
      } catch (error) {
        this.snackbarFail = true
      }
    },
    async handleDelPost() {
      try {
        this.overload = true
        const result = await this.$axios.delete(`/api/post/${this.post._id}`)
        if (result.data.success) {
          // Custom
          if (this.profile) {
            // profile
            const index = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
            if (index !== -1) {
              await this.$auth.fetchUser()
              const data = {
                index,
              }
              await this.$store.commit('delPostUser', data)
            }
          } else if (this.group) {
            if (this.groupid) {
              // group id
              const data = {
                id: this.post._id,
              }
              await this.$emit('delPostGroupId', data)
            }
            // group
            const indexG = await this.$store.state.user.groups.findIndex((x) => x._id === this.post.group._id)
            const indexP = await this.$store.state.user.groups[indexG].posts.findIndex((x) => x._id === this.post._id)
            const data = {
              indexG,
              indexP,
            }
            await this.$store.commit('delPostUser', data)
            await this.$store.commit('delPostGroup', data)
          } else if (this.postid) {
            // post id
            await this.$emit('delPostId')
          } else {
            // home
            const index = await this.$store.state.posts.posts.findIndex((x) => x._id === this.post._id)
            const i = await this.$store.state.user.posts.findIndex((x) => x._id === this.post._id)
            if (index !== -1) {
              await this.$auth.fetchUser()
              const data = {
                index,
                i,
              }
              await this.$store.commit('delPost', data)
              await this.$store.commit('delPostUser', data)
              if (this.post.group !== null) {
                ;(async () => {
                  const indexG = await this.$store.state.user.groups.findIndex((x) => x._id === this.post.group._id)
                  const indexP = await this.$store.state.user.groups[indexG].posts.findIndex((x) => x._id === this.post._id)
                  const data = {
                    indexG,
                    indexP,
                  }
                  await this.$store.commit('delPostGroup', data)
                })()
              }
            }
          }
          this.overload = false
          this.snackbarSuccess = true
        } else {
          this.overload = false
          this.snackbarFail = true
        }
      } catch (error) {
        this.overload = false
        this.snackbarFail = true
      }
    },
    async handleSave() {
      try {
        this.overload = true
        if (this.checkSaved) {
          const result = await this.$axios.put(`/api/post/unsave/${this.post._id}`)
          if (result.data.success) {
            await this.$auth.fetchUser()
            const index = await this.$store.state.user.saved.findIndex((x) => x._id === this.post._id)
            this.$store.commit('unSavePost', index)
            this.overload = false
            this.snackbarSuccess = true
          }
        } else {
          const result = await this.$axios.put(`/api/post/save/${this.post._id}`)
          if (result.data.success) {
            await this.$auth.fetchUser()
            this.$store.commit('savePost', result.data.post)
            this.overload = false
            this.snackbarSuccess = true
          }
        }
      } catch (error) {
        this.snackbarFail = true
        this.overload = false
      }
    },
    FocusCmt() {
      this.socket.emit('user_commenting', this.post._id)
    },
    BlurCmt() {
      this.socket.emit('user_uncommenting', this.post._id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/assets/scss/components/post.scss';
</style>
