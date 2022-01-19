<template>
  <div class="home">
    <v-container>
      <v-row class="home-row">
        <!-- list chat -->
        <v-col cols="3" md="3" class="conversations d-none d-md-flex">
          <v-card width="100%">
            <v-toolbar color="primary" dark class="conversations__header">
              <v-toolbar-title>Messages</v-toolbar-title>

              <v-spacer></v-spacer>

              <input type="text" placeholder="Search messages..." />

              <v-dialog v-model="dialog" scrollable max-width="300px">
                <template #activator="{ on, attrs }">
                  <v-icon class="mx-2" v-bind="attrs" v-on="on">mdi-plus-circle</v-icon>
                </template>
                <v-card>
                  <v-card-title>Select a friend</v-card-title>
                  <v-divider></v-divider>
                  <v-list-item-group v-model="dialogfr" active-class="blue--text">
                    <v-list-item v-for="friend in getFriends" :key="friend._id">
                      <v-list-item-avatar>
                        <v-img :src="friend.avatar.imgUrl"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title v-text="`${friend.lastname} ${friend.firstname}`"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-icon>
                        <v-icon> mdi-message-outline </v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-item-group>

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
                    <v-btn :disabled="typeof dialogfr === `undefined` || dialogfr === null" color="blue darken-1" text @click="chooseFriendMess">
                      Start
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>

            <v-list two-line class="conversations__body">
              <v-list-item-group v-model="selected" active-class="blue--text">
                <template v-for="(item, index) in conversations">
                  <conversaction-component :key="item._id" :conver="item"></conversaction-component>
                  <v-divider v-if="index < conversations.length - 1" :key="index"></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>

        <!-- chat zone -->
        <v-col v-if="getConver" xl="9" md="9" sm="12" class="conversation">
          <!-- header -->
          <div class="conversation__header">
            <div>
              <v-avatar size="55">
                <v-img :src="getFrAvatar"></v-img>
              </v-avatar>
            </div>
            <span>{{ `${getFriend.lastname} ${getFriend.firstname}` }}</span>
            <v-spacer></v-spacer>
            <v-icon v-if="getFriend.online" color="light-green accent-3"> mdi-access-point </v-icon>
            <v-icon v-if="!getFriend.online" color="gray"> mdi-access-point </v-icon>
          </div>
          <!-- body -->
          <div class="conversation__body">
            <div ref="mess_zone" class="conversation__body-list">
              <template v-for="(item, index) in getConver.messages">
                <message-component :key="index" :mess="item" :fravatar="getFrAvatar"></message-component>
              </template>
            </div>
          </div>
          <!-- bottom -->
          <div class="conversation__bottom">
            <v-menu :close-on-content-click="false" top right offset-y>
              <template #activator="{ on, attrs }">
                <div ref="emoji" v-bind="attrs" class="emoji" v-on="on">none</div>
              </template>
              <div>
                <VEmojiPicker @select="selectEmoji" />
              </div>
            </v-menu>
            <div v-if="isWriting" class="write_socket">
              {{ getFriend.firstname }}'s writing
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
              @click:append-outer="sendMess"
              @click:append="toggleEmoji"
              @focus="FocusCmt"
              @blur="BlurCmt"
            ></v-text-field>
          </div>
        </v-col>
        <v-col v-if="!getConver" xl="9" md="9" sm="12" class="conversation-none">
          <span v-if="conversations.length <= 0"> You don't have any conversation! </span>
          <v-btn color="primary" @click="newConver"> Start now </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbarFail" color="error" outlined>
      {{ error }}
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
import { VEmojiPicker } from 'v-emoji-picker'
import ConversactionComponent from '@/components/chat/Conversation.vue'
import MessageComponent from '@/components/chat/Message.vue'

export default {
  components: {
    VEmojiPicker,
    ConversactionComponent,
    MessageComponent,
  },
  data: () => ({
    dialog: false,
    dialogfr: null,
    message: '',
    overlay: false,
    snackbarFail: false,
    error: '',
    selected: null,
    conversations: [],
    write: [],
  }),

  computed: {
    getFriends: (ctx) => {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.friends
      } else {
        return []
      }
    },
    getConver: (ctx) => {
      if (ctx.selected === null || ctx.conversations.length <= 0) {
        return null
      } else {
        return ctx.conversations[ctx.selected]
      }
    },
    getFriend: (ctx) => {
      if (ctx.getConver) {
        return ctx.getConver.members.filter((member) => member._id !== ctx.$store.state.user._id)[0]
      } else {
        return null
      }
    },
    getFrAvatar: (ctx) => {
      return ctx.getFriend.avatar === null ? ctx.$store.state.avatarDefault : ctx.getFriend.avatar.imgUrl
    },
    isWriting: (ctx) => {
      if (ctx.getFriend) {
        return ctx.write.includes(ctx.getFriend._id)
      } else {
        return false
      }
    },
  },

  watch: {
    async getConver(newVal, oldVal) {
      await setTimeout(function () {}, 1000)
      if (typeof newVal !== 'undefined') {
        this.crollConver()
      }
    },
  },

  async beforeCreate() {
    try {
      const result = await this.$axios.get(`/api/chat/conversations`)
      if (result.data.success) {
        this.conversations = await result.data.element
      }
    } catch (error) {
      this.$router.push('/error')
    }
  },

  mounted() {
    this.socket.on(`srv_send-mess-${this.$store.state.user._id}`, async (data) => {
      const isExist = await this.conversations.filter((conver) => conver.members.map((member) => member._id).includes(data.mess.author))
      if (isExist.length > 0) {
        if (this.getConver === null || typeof this.getConver === 'undefined') {
          await isExist[0].messages.push(data.mess)
          if (!isExist[0].newMess.includes(this.$store.state.user._id)) {
            await isExist[0].newMess.push(this.$store.state.user._id)
          }
        } else {
          await isExist[0].messages.push(data.mess)
          await this.$refs.mess_zone.scroll({
            top: this.$refs.mess_zone.scrollHeight,
            behavior: 'smooth',
          })
          await this.$axios.put(`/api/chat/seen`, {
            conver: data.mess.conversation,
            user: this.$store.state.user._id,
          })
        }
      } else {
        await this.conversations.push(data.conver)
      }
    })

    this.socket.on('srv_writing', (data) => {
      if (!this.write.includes(data)) {
        this.write.push(data)
      }
    })

    this.socket.on('srv_unwriting', (data) => {
      if (this.write.includes(data)) {
        this.write.splice(this.write.indexOf(data), 1)
      }
    })
  },

  methods: {
    async sendMess() {
      try {
        await this.getConver.messages.push({
          author: this.$store.state.user._id,
          content: this.message,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        const result = await this.$axios.post(`/api/chat/send`, {
          friend: this.getFriend._id,
          content: this.message,
        })
        this.message = ''
        if (result.data.success) {
          await this.socket.emit('user_send-mess', { mess: result.data.element, friend: this.getFriend._id, conver: this.getConver })
          this.$refs.mess_zone.scroll({
            top: this.$refs.mess_zone.scrollHeight,
            behavior: 'smooth',
          })
        } else {
          this.getConver.messages.pop()
        }
      } catch (error) {
        this.snackbarFail = true
        this.error = 'Something went wrong. Please try again!'
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
    async crollConver() {
      if (typeof this.$refs.mess_zone !== 'undefined') {
        this.$refs.mess_zone.scroll({
          top: this.$refs.mess_zone.scrollHeight,
        })
        if (this.getConver.newMess.includes(this.$store.state.user._id)) {
          this.getConver.newMess.splice(this.getConver.newMess.indexOf(this.$store.state.user._id), 1)
          await this.$axios.put(`/api/chat/seen`, {
            conver: this.getConver._id,
            user: this.$store.state.user._id,
          })
        }
      }
    },
    FocusCmt() {
      this.socket.emit('user_writing', this.$store.state.user._id)
    },
    BlurCmt() {
      this.socket.emit('user_unwriting', this.$store.state.user._id)
    },
    selectEmoji(emoji) {
      this.message += emoji.data
    },
    toggleEmoji() {
      this.$refs.emoji.click()
    },
    newConver() {
      this.dialog = true
    },
    async chooseFriendMess() {
      const isExist = await this.conversations.filter((conver) =>
        conver.members.map((member) => member._id).includes(this.$store.state.user.friends[this.dialogfr]._id)
      )
      if (isExist.length > 0) {
        this.dialog = false
        this.dialogfr = null
      } else {
        await this.conversations.push({
          _id: null,
          isGroup: false,
          members: [this.$store.state.user.friends[this.dialogfr], this.$store.state.user],
          messages: [],
          newMess: [this.$store.state.user.friends[this.dialogfr]._id],
        })
        this.dialog = false
        this.dialogfr = null
      }
    },
    closeDialog() {
      this.dialog = false
      this.dialogfr = null
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  background: $secondary;
  width: 100%;
  height: 100%;
  .container {
    position: relative;
    height: 100%;
    width: 100%;
    .home-row {
      position: relative;
      height: 100%;
      width: 100%;
      margin: 0;
      overflow: hidden;
      .conversations {
        width: 100%;
        height: 100%;
        padding: 0 12px;
        margin: 0;
        overflow: auto;
        // border-top-left-radius: 10px;
        // border-bottom-left-radius: 10px;
        &::-webkit-scrollbar {
          width: 6px;
          background: #eceff1;
          border-radius: 30px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba($primary, 0.5);
          border-radius: 30px;
        }
        &__header {
          input {
            outline: none;
            border: none;
            background: white;
            color: $primary;
            padding: 5px 20px;
            border-radius: 10px;
          }
        }
      }
      .conversation {
        width: 100%;
        height: 100%;
        background: white;
        position: relative;
        padding: 0;
        border-radius: 4px;
        overflow: hidden;
        &__header {
          width: 100%;
          height: 65px;
          display: flex;
          align-items: center;
          padding: 12px;
          background: $primary;
          span {
            margin-left: 8px;
            font-size: $font_md;
            font-weight: 600;
            color: white;
          }
        }
        &__body {
          width: 100%;
          height: calc(100% - 150px);
          padding: 12px 12px 0 12px;
          overflow: auto;
          &-list {
            width: 100%;
            height: 100%;
            overflow: auto;
            &::-webkit-scrollbar {
              width: 6px;
              background: #eceff1;
              border-radius: 30px;
            }
            &::-webkit-scrollbar-thumb {
              background: rgba($primary, 0.5);
              border-radius: 30px;
            }
          }
        }
        &__bottom {
          width: 100%;
          height: 80px;
          padding: 12px;
          position: relative;
          .emoji {
            position: absolute;
            right: 0;
            visibility: hidden;
          }
          .write_socket {
            position: absolute;
            top: -8px;
            left: 12px;
            font-size: 14px;
            color: gray;
            img {
              bottom: 0;
              height: 18px;
              position: absolute;
              object-fit: cover;
            }
          }
        }
      }
      .conversation-none {
        width: 100%;
        height: 100%;
        background: white;
        position: relative;
        padding: 0;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          font-size: $font_lg;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
