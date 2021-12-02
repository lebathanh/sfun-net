<template>
  <div class="home">
    <v-container>
      <v-row class="home-row">
        <v-col cols="3" md="3" class="list_friend d-none d-md-flex">
          <friends-component />
        </v-col>
        <v-col xl="9" md="9" sm="12" class="user">
          <div class="user-header">
            <img :src="$store.state.bgDefault" />
            <!-- QrCode -->
            <v-dialog v-model="qrDialog" max-width="290">
              <template #activator="{ on, attrs }">
                <v-icon class="user-header__qr" color="white" size="24" v-bind="attrs" v-on="on">mdi-qrcode-scan</v-icon>
              </template>
              <v-card>
                <div class="qrcode">
                  <div class="header">
                    <p>QRCODE</p>
                  </div>
                  <div class="body">
                    <div>
                      <qrcode-vue v-if="!scaning" :value="$store.state.user._id" :size="160" level="H" />
                      <qrcode-stream v-if="scaning" @decode="onDecode" @init="onInit" />
                    </div>
                  </div>
                  <v-divider></v-divider>
                  <div class="action">
                    <v-spacer />
                    <v-btn class="action__btn" @click=";(qrDialog = false), (scaning = false)">Cancel</v-btn>
                    <v-btn class="action__btn" color="primary" @click="scaning = !scaning">Scan</v-btn>
                  </div>
                </div>
              </v-card>
            </v-dialog>

            <div class="user-header__info">
              <v-avatar class="user-header__info-avatar" size="120">
                <v-img :src="getAvatar"></v-img>
                <div class="user-header__info-avatar_">
                  <v-dialog v-model="aDialog" width="280px" persistent>
                    <template #activator="{ on, attrs }">
                      <v-icon class="user-header__info-avatar__icon" size="28" v-bind="attrs" v-on="on">mdi-camera</v-icon>
                    </template>

                    <v-card class="change-avatar_popup">
                      <div class="show_avatar">
                        <div v-if="chooseAvatar" class="show_avatar-choose">
                          <p @click="OnPickAImg">Choose a picture from your device</p>
                        </div>
                        <div v-if="!chooseAvatar" class="show_avatar-img">
                          <v-img max-height="270px" max-width="95%" :src="getAimg"></v-img>
                          <span @click="OnPickAImg">Choose a other picture</span>
                        </div>
                      </div>
                      <v-divider></v-divider>
                      <v-card-actions class="btn_change-avatar">
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelChangeA"> Cancel </v-btn>
                        <v-btn color="primary" :disabled="checkAimg" @click="saveChangeA"> Save </v-btn>
                      </v-card-actions>
                    </v-card>
                    <input
                      id="imgAInput"
                      ref="imgAInput"
                      name="imgAInput"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="OnPickedAImg"
                    />
                  </v-dialog>
                </div>
              </v-avatar>
              <div class="user-header__info-handle">
                <div class="user-header__info-handle__name">
                  <p>{{ `${$store.state.user.lastname} ${$store.state.user.firstname}` }}</p>
                  <span>Join from {{ getRegister }}</span>
                </div>

                <!-- Is user -->
                <div v-if="checkIsUser" class="user-header__info-handle__handle">
                  <v-btn rounded color="primary" class="hide_xm" @click="writePost">write post</v-btn>
                  <div>
                    <write-post-component ref="w_post" :profile="true" />
                  </div>
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <template #activator="{ on, attrs }">
                      <v-btn rounded color="warning" outlined v-bind="attrs" v-on="on">update</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Update profile</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="account.firstname" :rules="rules" label="First name" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="account.lastname" :rules="rules" label="Last name" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="account.birth" :rules="rules" hint="Birth" required persistent-hint type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="account.gender"
                                :rules="rules"
                                required
                                :items="['Male', 'Female', 'Orther']"
                                label="Gender"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="account.address" :rules="rules" required label="Address"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="refreshForm"> Close </v-btn>
                        <v-btn :disabled="!checkNotSame" type="submit" color="primary" @click="validate"> Save </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>

                <!-- Add friend -->
                <div v-if="!checkIsUser" class="user-header__info-handle__handle">
                  <v-btn rounded color="primary">add friend</v-btn>
                </div>

                <!-- Cancel -->
                <div v-if="!checkIsUser" class="user-header__info-handle__handle">
                  <v-btn rounded color="warning" outlined>Cancel request</v-btn>
                </div>

                <!-- Delete -->
                <div v-if="!checkIsUser" class="user-header__info-handle__handle">
                  <v-btn rounded color="error" outlined>Delete friend</v-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="user-body">
            <div class="user-body__activity">
              <v-tabs v-model="tab" centered fixed-tabs>
                <v-tabs-slider color="#03A9F4"></v-tabs-slider>
                <v-tab>
                  <v-badge color="primary" :content="getPosts.length" :value="getPosts.length" bordered> Posts </v-badge>
                </v-tab>
                <v-tab>
                  <v-badge color="primary" :content="0" :value="0" bordered> Save </v-badge>
                </v-tab>
              </v-tabs>

              <!-- Tabs -->
              <v-tabs-items v-model="tab" class="tab-items">
                <!-- Posts -->
                <v-tab-item>
                  <post-component v-for="(post, i) in getPosts" :key="i" :post="post" :profile="true" />
                </v-tab-item>
                <!-- Saved -->
                <v-tab-item>
                  <post-component v-for="(post, i) in getPostsSave" :key="i" :post="post" :save="true" />
                </v-tab-item>
              </v-tabs-items>
            </div>
            <div class="user-body__info">
              <div class="user-body__info-body">
                <div class="user-body__info-body_head">
                  <p>Profile</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Name</span>
                  <p>{{ `${$store.state.user.lastname} ${$store.state.user.firstname}` }}</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Gender</span>
                  <p>{{ $store.state.user.gender }}</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Birth</span>
                  <p>{{ getBirth }}</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Address</span>
                  <p>{{ $store.state.user.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbarFail" color="error" outlined>
      {{ error }}
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { QrcodeStream } from 'vue-qrcode-reader'

import FriendsComponent from '@/components/home/Friends.vue'
import WritePostComponent from '@/components/home/WritePost.vue'
import PostComponent from '@/components/home/Post.vue'

export default {
  components: {
    FriendsComponent,
    WritePostComponent,
    PostComponent,
    QrcodeVue,
    QrcodeStream,
  },

  data: () => ({
    tab: null,
    chooseAvatar: true,
    avatar: '',
    aImg: '',
    aDialog: false,
    rules: [(v) => !!v || 'This input is required'],
    dialog: false,
    qrDialog: false,
    scaning: false,
    snackbarFail: false,
    error: '',
    account: {
      firstname: '',
      lastname: '',
      birth: '',
      gender: '',
      address: '',
    },
  }),

  computed: {
    getAimg: (ctx) => {
      return ctx.aImg
    },
    checkAimg: (ctx) => {
      if (ctx.aImg !== '') {
        return false
      } else {
        return true
      }
    },
    getPosts(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.posts
      } else {
        return []
      }
    },
    getPostsSave(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.saved
      } else {
        return []
      }
    },
    getBirth(ctx) {
      return new Date(ctx.$store.state.user.birth).toISOString().substr(0, 10)
    },
    checkIsUser(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user._id !== this.$route.params.id
      } else {
        return false
      }
    },
    checkNotSame(ctx) {
      if (ctx.account.firstname !== ctx.$store.state.user.firstname && ctx.account.firstname !== '') {
        return true
      } else if (ctx.account.lastname !== ctx.$store.state.user.lastname && ctx.account.lastname !== '') {
        return true
      } else if (this.account.birth !== new Date(this.$store.state.user.birth).toISOString().substr(0, 10)) {
        return true
      } else if (this.account.gender !== this.$store.state.user.gender && ctx.account.gender !== '') {
        return true
      } else if (this.account.address !== this.$store.state.user.address && ctx.account.address !== '') {
        return true
      } else {
        return false
      }
    },
    getAvatar(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.avatar === null ? ctx.$store.state.avatarDefault : ctx.$store.state.user.avatar.imgUrl
      } else {
        return ctx.$store.state.avatarDefault
      }
    },
    getRegister: (ctx) => {
      if (ctx.$store.state.user) {
        return new Date(ctx.$store.state.user.register).toISOString().substr(0, 10)
      } else {
        return new Date().toISOString().substr(0, 10)
      }
    },
  },

  mounted() {
    ;(async () => {
      await this.$auth.fetchUser()
      await this.$store.commit('setUser', this.$auth.user)
      this.account.firstname = this.$store.state.user.firstname
      this.account.lastname = this.$store.state.user.lastname
      this.account.birth = new Date(this.$store.state.user.birth).toISOString().substr(0, 10)
      this.account.gender = this.$store.state.user.gender
      this.account.address = this.$store.state.user.address
    })()
  },

  methods: {
    writePost() {
      this.$refs.w_post.dialog = true
    },
    async validate(e) {
      e.preventDefault()
      try {
        const result = await this.$axios.put('/api/auth/update', this.account)
        if (result.data.success) {
          await this.$auth.fetchUser()
          await this.$store.commit('updateUser', this.account)
          this.dialog = false
          this.refreshForm()
        }
      } catch (error) {
        this.dialog = false
      }
    },
    refreshForm() {
      this.account.firstname = this.$store.state.user.firstname
      this.account.lastname = this.$store.state.user.lastname
      this.account.birth = new Date(this.$store.state.user.birth).toISOString().substr(0, 10)
      this.account.gender = this.$store.state.user.gender
      this.account.address = this.$store.state.user.address
      this.dialog = false
    },
    cancelChangeA() {
      this.aImg = ''
      this.chooseAvatar = true
      this.aDialog = false
    },
    async saveChangeA() {
      try {
        const result = await this.$axios.put('/api/auth/update', {
          avatar: this.aImg,
        })
        if (result.data.success) {
          await this.$auth.fetchUser()
          await this.$store.commit('updateAvatar', result.data.avatar)
          this.aImg = ''
          this.chooseAvatar = true
          this.aDialog = false
        }
      } catch (error) {
        this.aDialog = false
      }
    },
    OnPickAImg() {
      this.$refs.imgAInput.click()
    },
    OnPickedAImg(e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const filename = files[i].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.aImg = fileReader.result
          this.chooseAvatar = false
        })
        fileReader.readAsDataURL(files[i])
      }
    },
    onDecode(id) {
      ;(async () => {
        const result = await this.$axios.get(`/api/auth/user/${id}`)
        if (result.data.success) {
          this.$router.push(`/user/${result.data.user._id}`)
        } else {
          this.error = 'QRCode is invalid'
          this.snackbarFail = true
        }
      })()
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'ERROR: you need to grant camera access permission'
        } else if (error.name === 'NotFoundError') {
          this.error = 'ERROR: no camera on this device'
        } else if (error.name === 'NotSupportedError') {
          this.error = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.error = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.error = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = 'ERROR: Stream API is not supported in this browser'
        } else if (error.name === 'InsecureContextError') {
          this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
        } else {
          this.error = `ERROR: Camera error`
        }
        this.snackbarFail = true
      }
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
      .list_friend {
        width: 100%;
        height: 100%;
        padding: 0 12px;
      }
      .user {
        position: relative;
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        padding: 0;
        border-radius: 10px;
        &::-webkit-scrollbar {
          width: 6px;
          background: #eceff1;
          border-radius: 30px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba($primary, 0.5);
          border-radius: 30px;
        }
        &-header {
          position: relative;
          width: 100%;
          height: 280px;
          border-radius: 10px;
          &__qr {
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
          }
          img {
            width: 100%;
            height: 280px;
            object-fit: cover;
          }
          &__info {
            position: absolute;
            background: rgba($secondary, 0.6);
            z-index: 2;
            width: 100%;
            height: 90px;
            bottom: 0;
            display: flex;
            justify-content: flex-end;
            &-avatar {
              position: absolute;
              left: 5%;
              top: -35px;
              &_ {
                position: absolute;
                top: 90px;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2;
                background-color: rgba(0, 0, 0, 0.25);
                &_icon {
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 28px;
                  height: 28px;
                  cursor: pointer;
                  &:hover {
                    color: #fff;
                  }
                }
              }
            }
            &-handle {
              width: calc(95% - 120px);
              height: 100%;
              padding: 5px 16px;
              display: flex;
              justify-content: space-between;
              &__name {
                p {
                  font-size: $font_md;
                  font-weight: 700;
                  margin: 0;
                }
              }
              &__handle {
                align-self: center;
                div {
                  display: none;
                }
              }
            }
          }
        }
        &-body {
          position: relative;
          margin-top: 10px;
          width: 100%;
          height: auto;
          display: flex;
          &__activity {
            width: 65%;
            height: 100%;
            background: #fff;
            border-radius: 10px;
            padding: 12px;
          }
          &__info {
            width: 35%;
            height: 100%;
            padding: 0 12px;
            display: flex;
            justify-content: center;
            position: relative;
            &-body {
              width: 95%;
              background: #fff;
              border-radius: 10px;
              overflow-x: auto;
              position: relative;
              &_head {
                width: 100%;
                padding: 6px 12px;
                background: $primary;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                p {
                  margin: 0;
                  color: #fff;
                  text-transform: uppercase;
                  font-weight: 600;
                }
              }
              &_item {
                max-width: 100%;
                display: flex;
                justify-content: flex-start;
                padding: 0 12px;
                span {
                  min-width: 64px;
                  max-width: 30%;
                  font-weight: 600;
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.show_avatar {
  overflow: hidden;
  max-width: 280px;
  height: 280px;
  padding-top: 10px;
  &-choose {
    width: inherit;
    height: inherit;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p:hover {
      cursor: pointer;
      color: #03a9f4;
    }
  }
  &-img {
    position: relative;
    height: 90%;
    width: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      padding-top: 10px;
      &:hover {
        color: #3498db;
        cursor: pointer;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
.qrcode {
  width: 280px;
  height: auto;
  .header {
    width: 100%;
    height: 40px;
    background: $primary;
    text-align: center;
    p {
      color: #fff;
      font-size: $font_md;
      font-weight: 600;
      margin: 0;
      padding: 0;
      line-height: 40px;
    }
  }
  .body {
    width: 100%;
    padding: 12px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .action {
    padding: 5px 12px;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    &__btn {
      margin-left: 4px;
    }
  }
}

@media (max-width: 700px) {
  .home {
    .container {
      .home-row {
        .user {
          &-header {
            &__info {
              height: 100px;
              &-handle {
                width: calc(95% - 120px);
                height: 100%;
                padding: 5px 16px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                &__name {
                  p {
                    font-size: $font_md;
                    font-weight: 700;
                    margin: 0;
                  }
                }
                &__handle {
                  align-self: center;
                  div {
                    display: none;
                  }
                }
              }
            }
          }
          &-body {
            &__activity {
              width: 100%;
              height: 100%;
              background: #fff;
              border-radius: 10px;
              padding: 12px;
            }
            &__info {
              display: none;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 425px) {
  .home {
    .container {
      .home-row {
        .user {
          &-header {
            &__info {
              &-avatar {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: -120px;
                &_ {
                  position: absolute;
                  top: 90px;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 2;
                  background-color: rgba(0, 0, 0, 0.25);
                  &_icon {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 28px;
                    height: 28px;
                    cursor: pointer;
                    &:hover {
                      color: #fff;
                    }
                  }
                }
              }
              &-handle {
                width: 100%;
                height: 100%;
                padding: 5px 16px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                &__name {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: column;
                  p {
                    font-size: $font_md;
                    font-weight: 700;
                    margin: 0;
                  }
                }
                &__handle {
                  align-self: center;
                  div {
                    display: none;
                  }
                }
              }
            }
          }
          &-body {
            &__activity {
              width: 100%;
              height: 100%;
              background: #fff;
              border-radius: 10px;
              padding: 12px;
            }
            &__info {
              display: none;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 290px) {
  .home {
    .container {
      .home-row {
        .user {
          &-header {
            &__info {
              &-handle {
                &__handle {
                  align-self: center;
                  .hide_xm {
                    display: none;
                  }
                  div {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
