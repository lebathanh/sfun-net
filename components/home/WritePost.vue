<template>
  <v-dialog v-model="dialog" persistent width="500">
    <!-- Can see -->
    <template #activator="{ on, attrs }">
      <div class="header">
        <div v-bind="attrs" ref="call" class="header__input" v-on="on">
          <v-avatar class="header__input-avatar" size="40">
            <v-img :src="getAvatar" />
          </v-avatar>
          <input disabled type="text" :placeholder="getName + ', how are you today?'" />
        </div>

        <div class="header__div">
          <v-divider></v-divider>
        </div>

        <div class="header__icons">
          <div class="header__icons-item" v-bind="attrs" v-on="on">
            <v-icon color="success">mdi-image-multiple</v-icon>
            <span class="d-none d-sm-flex">Photos</span>
          </div>
          <div class="header__icons-item" v-bind="attrs" v-on="on">
            <v-icon color="warning">mdi-emoticon-outline </v-icon>
            <span class="d-none d-sm-flex">Emotions</span>
          </div>
          <div class="header__icons-item" v-bind="attrs" v-on="on">
            <v-icon color="error">mdi-play-box-multiple</v-icon>
            <span class="d-none d-sm-flex">Videos</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Dialog -->
    <v-card class="card">
      <!-- Title -->
      <v-card-title class="card__header">
        <span>New Post</span>
        <v-icon size="36" class="card__header-icon" @click="closeDialog">mdi-close-circle-outline</v-icon>
      </v-card-title>
      <v-divider></v-divider>

      <!-- Body -->
      <div class="card__body">
        <!-- User -->
        <div class="card__body-user">
          <v-avatar size="40">
            <img :src="getAvatar" alt="" srcset="" />
          </v-avatar>
          <span> {{ `${$store.state.user.lastname} ${$store.state.user.firstname}` }} </span>
        </div>

        <!-- Input -->
        <div class="card__body-text">
          <!-- Text -->
          <textarea v-model="cap" rows="3" placeholder="Typing your post..."></textarea>

          <!-- File -->
          <div class="card__body-text__extra">
            <div v-for="(item, i) in media" :key="i" class="card__body-text__extra-img">
              <!-- Is img -->
              <img v-if="item.type === 'img'" :src="item.imgUrl" alt="" srcset="" />

              <!-- Is video -->
              <video v-if="item.type === 'video'" :src="item.videoUrl" controls></video>

              <v-icon size="20" class="card__body-text__extra-img__icon" @click="delImg($event, i)">mdi-close-circle</v-icon>
            </div>
          </div>

          <!-- Icon -->
          <div class="card__body-text__add">
            <span>Add to your post...</span>
            <div class="card__body-text__add-item">
              <v-menu :close-on-content-click="false" top offset-y>
                <template #activator="{ on, attrs }">
                  <v-icon size="30" color="warning" class="card__body-text__add-item_" v-bind="attrs" v-on="on">mdi-emoticon-outline </v-icon>
                </template>
                <div>
                  <VEmojiPicker @select="selectEmoji" />
                </div>
              </v-menu>

              <v-icon size="30" color="success" class="card__body-text__add-item_" @click="OnPickImg">mdi-image-multiple</v-icon>
              <v-icon size="30" color="error" class="card__body-text__add-item_" @click="OnPickVideo">mdi-play-box-multiple</v-icon>
            </div>
            <input id="imgInput" ref="imgInput" name="imgInput" type="file" accept="image/*" style="display: none" multiple @change="OnPickedImg" />
            <input id="videoInput" ref="videoInput" name="videoInput" type="file" accept="video/*" style="display: none" @change="OnPickedVideo" />
          </div>
        </div>
      </div>

      <!-- Button -->
      <v-card-actions>
        <v-btn :disabled="!validCap" block color="primary" @click="handlePost">update</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Amination -->
    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Update successfully!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarFail" color="error" outlined>
      Update fail, please try later!
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'

export default {
  components: {
    VEmojiPicker,
  },
  props: {
    profile: {
      type: Boolean,
      default: () => false,
    },
    group: {
      type: String,
      default: () => null,
    },
    groupid: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    snackbarSuccess: false,
    snackbarFail: false,
    overlay: false,
    dialog: false,
    media: [],
    cap: '',
  }),

  computed: {
    getImages: (ctx) => {
      return ctx.media.filter((item) => item.type === 'img')
    },
    getVideos: (ctx) => {
      return ctx.media.filter((item) => item.type === 'video')
    },
    validCap: (ctx) => {
      return ctx.cap !== ''
    },
    getAvatar: (ctx) => {
      if (ctx.$store.state.user !== null) {
        return ctx.$store.state.user.avatar === null ? ctx.$store.state.avatarDefault : ctx.$store.state.user.avatar.imgUrl
      } else {
        return ctx.$store.state.avatarDefault
      }
    },
    getName: (ctx) => {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.firstname
      } else {
        return ''
      }
    },
  },

  methods: {
    selectEmoji(emoji) {
      this.cap += emoji.data
    },
    OnPickImg() {
      this.$refs.imgInput.click()
    },
    OnPickVideo() {
      this.$refs.videoInput.click()
    },
    OnPickedImg(e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const filename = files[i].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.media.push({
            type: 'img',
            imgUrl: fileReader.result,
          })
        })
        fileReader.readAsDataURL(files[i])
      }
    },
    async OnPickedVideo(e) {
      this.overloading = true
      const files = e.target.files
      const filesize = (files[0].size / 1024 / 1024).toFixed(4)
      const filename = files[0].name
      if (filesize <= 10) {
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file')
        }
        const fileReader = new FileReader()
        await fileReader.readAsDataURL(files[0])
        await fileReader.addEventListener('load', () => {
          this.media.push({
            type: 'video',
            videoUrl: fileReader.result,
          })
        })
        this.overloading = false
      } else {
        this.overloading = false
        this.snackbarTooBig = true
      }
    },
    delImg(e, i) {
      this.media.splice(i, 1)
    },
    closeDialog() {
      this.dialog = false
      this.media = []
      this.cap = ''
    },
    async handlePost() {
      try {
        this.overlay = true
        const form = await {
          author: this.$auth.$state.user._id,
          cap: this.cap,
          videos: this.media.filter((item) => item.type === 'video').map((item) => item.videoUrl),
          images: this.media.filter((item) => item.type === 'img').map((item) => item.imgUrl),
          group: this.group,
        }
        const result = await this.$axios.post('/api/post', form)
        if (result.data.success) {
          await this.$auth.fetchUser()
          result.data.post.author = await result.data.founduser
          const data = {
            post: result.data.post,
          }
          // Custom
          if (this.profile) {
            // profile
            await this.$store.commit('updatePostsUser', data)
            this.socket.emit('user_newpost', result.data.post.notification)
          } else if (this.group !== null) {
            if (this.groupid) {
              // group id
              const data = {
                post: result.data.post,
              }
              await this.$emit('updatePostsGroupId', data)
            }
            // group
            const index = await this.$store.state.user.groups.findIndex((x) => x._id === this.group)
            await this.$store.commit('updatePostsGroup', { post: result.data.post, index })
            await this.$store.commit('updatePostsUser', data)
            this.socket.emit('user_newpost', result.data.post.notification)
          } else {
            // home
            await this.$store.commit('updatePosts', data)
            this.socket.emit('user_newpost', result.data.post.notification)
          }
          this.overlay = false
          this.closeDialog()
        } else {
          this.overlay = false
          this.snackbarFail = true
        }
      } catch (error) {
        this.overlay = false
        this.snackbarFail = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/write_post.scss';
</style>
