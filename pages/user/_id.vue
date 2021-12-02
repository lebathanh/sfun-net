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
            <div class="user-header__info">
              <v-avatar class="user-header__info-avatar" size="120">
                <v-img :src="getAvatar"></v-img>
              </v-avatar>

              <div class="user-header__info-handle">
                <div class="user-header__info-handle__name">
                  <p>{{ getName }}</p>
                  <span>Join from {{ getRegister }}</span>
                </div>

                <!-- Add friend -->
                <div v-if="!isFriend && !isRequest && !isAccept" class="user-header__info-handle__handle" @click="AddFriend">
                  <v-btn :loading="loading" rounded color="primary">add friend</v-btn>
                </div>

                <!-- Cancel -->
                <div v-if="isRequest && !isFriend" class="user-header__info-handle__handle" @click="CancelFriend">
                  <v-btn :loading="loading" rounded color="warning" outlined>Cancel request</v-btn>
                </div>

                <!-- Delete -->
                <div v-if="isFriend" class="user-header__info-handle__handle">
                  <v-btn :loading="loading" rounded color="error" outlined @click="DelFriend">Delete friend</v-btn>
                </div>

                <!-- Accept -->
                <div v-if="!isFriend && isAccept" class="user-header__info-handle__handle">
                  <v-btn :loading="loading" rounded color="primary" @click="AcceptFriend">Accept</v-btn>
                  <v-btn :loading="loading" rounded color="warning" outlined @click="DenideFriend">Denide</v-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="user-body">
            <div class="user-body__activity">
              <post-component v-for="(post, i) in getPosts" :key="i" :post="post" :friend="true" />
            </div>
            <div class="user-body__info">
              <div class="user-body__info-body">
                <div class="user-body__info-body_head">
                  <p>Profile</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Name</span>
                  <p>{{ getName }}</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Gender</span>
                  <p>{{ getGender }}</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Birth</span>
                  <p>{{ getBirth }}</p>
                </div>
                <div class="user-body__info-body_item">
                  <span>Address</span>
                  <p>{{ getAddress }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FriendsComponent from '@/components/home/Friends.vue'
import PostComponent from '@/components/home/Post.vue'

export default {
  components: {
    FriendsComponent,
    PostComponent,
  },

  middleware: 'route-profile',

  data: () => ({
    loading: false,
  }),

  computed: {
    isFriend(ctx) {
      if (ctx.$store.state.friend && ctx.$store.state.user) {
        return ctx.$store.state.user.friends.map((x) => x._id).includes(ctx.$store.state.friend._id)
      }
      return false
    },
    isRequest(ctx) {
      if (ctx.$store.state.user && ctx.$store.state.friend) {
        return ctx.$store.state.user.request.includes(ctx.$store.state.friend._id)
      }
      return false
    },
    isAccept(ctx) {
      if (ctx.$store.state.user && ctx.$store.state.friend) {
        return ctx.$store.state.user.accept.map((x) => x._id).includes(ctx.$store.state.friend._id)
      }
      return false
    },
    getPosts(ctx) {
      if (ctx.$store.state.friend) {
        return ctx.$store.state.friend.posts
      } else {
        return []
      }
    },
    getBirth(ctx) {
      if (ctx.$store.state.friend) {
        return new Date(ctx.$store.state.friend.birth).toISOString().substr(0, 10)
      } else {
        return ''
      }
    },
    getAvatar(ctx) {
      if (ctx.$store.state.friend) {
        return ctx.$store.state.friend.avatar === null ? ctx.$store.state.avatarDefault : ctx.$store.state.friend.avatar.imgUrl
      } else {
        return ctx.$store.state.avatarDefault
      }
    },
    getName(ctx) {
      if (ctx.$store.state.friend) {
        return `${ctx.$store.state.friend.lastname} ${ctx.$store.state.friend.firstname}`
      } else {
        return ''
      }
    },
    getGender(ctx) {
      if (ctx.$store.state.friend) {
        return ctx.$store.state.friend.gender
      } else {
        return ''
      }
    },
    getAddress(ctx) {
      if (ctx.$store.state.friend) {
        return ctx.$store.state.friend.address
      } else {
        return ''
      }
    },
    getEmail(ctx) {
      if (ctx.$store.state.friend) {
        return ctx.$store.state.friend.email
      } else {
        return ''
      }
    },
    getRegister(ctx) {
      if (ctx.$store.state.friend) {
        return new Date(ctx.$store.state.friend.register).toISOString().substr(0, 10)
      } else {
        return new Date().toISOString().substr(0, 10)
      }
    },
  },

  async beforeCreate() {
    try {
      const result = await this.$axios.get(`/api/auth/user/${this.$route.params.id}`)
      if (result.data.success) {
        await this.$store.commit('setFriend', result.data.user)
      }
    } catch (error) {
      this.$router.push('/error')
    }
  },

  methods: {
    async AddFriend() {
      this.loading = true
      const result = await this.$axios.put('/api/auth/addfriend', { toUser: this.$store.state.friend._id })
      if (result.data.success) {
        this.$store.commit('addFriend', this.$store.state.friend._id)
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async CancelFriend() {
      this.loading = true
      const result = await this.$axios.put('/api/auth/cancelfriend', { toUser: this.$store.state.friend._id })
      if (result.data.success) {
        if (this.$store.state.user.request.includes(this.$store.state.friend._id)) {
          const i = this.$store.state.user.request.indexOf(this.$store.state.friend._id)
          await this.$store.commit('cancelFriend', i)
          this.loading = false
        }
      } else {
        this.loading = false
      }
    },
    async AcceptFriend() {
      this.loading = true
      const result = await this.$axios.put('/api/auth/acceptfriend', { toUser: this.$store.state.friend._id })
      if (result.data.success) {
        const indexA = await this.$store.state.user.accept.map((x) => x._id).indexOf(this.$store.state.friend._id)
        const indexR = await this.$store.state.friend.request.indexOf(this.$store.state.user._id)
        await this.$store.commit('acceptFriend', { a: indexA, r: indexR })
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async DenideFriend() {
      this.loading = true
      const result = await this.$axios.put('/api/auth/denidefriend', { toUser: this.$store.state.friend._id })
      if (result.data.success) {
        const indexA = await this.$store.state.user.accept.map((x) => x._id).indexOf(this.$store.state.friend._id)
        const indexR = await this.$store.state.friend.request.indexOf(this.$store.state.user._id)
        await this.$store.commit('denideFriend', { a: indexA, r: indexR })
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async DelFriend() {
      this.loading = true
      const result = await this.$axios.put('/api/auth/delfriend', { toUser: this.$store.state.friend._id })
      if (result.data.success) {
        const indexU = await this.$store.state.user.friends.map((x) => x._id).indexOf(this.$store.state.friend._id)
        const indexF = await this.$store.state.friend.friends.indexOf(this.$store.state.user._id)
        await this.$store.commit('delFriend', { u: indexU, f: indexF })
        this.loading = false
      } else {
        this.loading = false
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
            &-body {
              width: 95%;
              background: #fff;
              border-radius: 10px;
              overflow-x: hidden;
              &_head {
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
                display: flex;
                justify-content: flex-start;
                padding: 0 12px;
                span {
                  min-width: 64px;
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
</style>
