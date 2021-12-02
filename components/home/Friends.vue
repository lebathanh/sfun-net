<template>
  <div class="body">
    <v-card class="friend">
      <v-list subheader class="friend-list">
        <v-subheader class="friend-list__header">
          <span>Friends - {{ getFriends.length }}</span>
          <v-spacer></v-spacer>
          <v-icon v-if="!fShow" color="white" @click="fShow = true"> mdi-chevron-down </v-icon>
          <v-icon v-if="fShow" color="white" @click="fShow = false"> mdi-chevron-up </v-icon>
        </v-subheader>
        <div v-if="fShow" class="friend-list_">
          <v-list-item v-for="(item, i) in getFriends" :key="i" class="friend-list__content" @click="$router.push(`/user/${item._id}`)">
            <v-list-item-avatar>
              <v-img :alt="`${item.email} avatar`" :src="item.avatar !== null ? item.avatar.imgUrl : $store.state.avatarDefault"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="`${item.lastname} ${item.firstname}`"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon :color="item.online ? 'primary' : 'grey'" size="26"> mdi-account </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </div>
      </v-list>
    </v-card>
    <v-card class="req">
      <v-list subheader class="req-list">
        <v-subheader class="req-list__header">
          <span>Requests - {{ getAccepts.length }}</span>
          <v-spacer></v-spacer>
          <v-icon v-if="!rShow" color="white" @click="rShow = true"> mdi-chevron-down </v-icon>
          <v-icon v-if="rShow" color="white" @click="rShow = false"> mdi-chevron-up </v-icon>
        </v-subheader>

        <div v-if="rShow" class="req-list_">
          <v-list-item v-for="(item, i) in getAccepts" :key="i" class="req-list__content" @click="GoViewProfile($event, item._id)">
            <v-list-item-avatar>
              <v-img :alt="`${item.email} avatar`" :src="item.avatar !== null ? item.avatar.imgUrl : $store.state.avatarDefault"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="`${item.lastname} ${item.firstname}`"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon class="req-list__content-icons">
              <v-icon color="error" class="req-list__content-icons__item" size="26" @click="DenideFriend($event, item)"> mdi-account-cancel </v-icon>
              <v-icon color="primary" class="req-list__content-icons__item" size="26" @click="AcceptFriend($event, item)"> mdi-account-check </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </div>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    fShow: true,
    rShow: true,
    loading: false,
  }),

  computed: {
    getFriends(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.friends
      } else {
        return []
      }
    },
    getAccepts(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.accept
      } else {
        return []
      }
    },
  },

  mounted() {
    this.socket.on('newconnection', (data) => {
      ;(async () => {
        const index = await this.$auth.user.friends.findIndex((x) => x._id === data)
        if (index !== -1) {
          this.$store.commit('updateFriendStatus', index)
        }
      })()
    })
    this.socket.on('disconnection', (data) => {
      ;(async () => {
        const index = await this.$auth.user.friends.findIndex((x) => x._id === data)
        if (index !== -1) {
          this.$store.commit('updateFriendStatusOff', index)
        }
      })()
    })
  },

  methods: {
    async AcceptFriend(e, friend) {
      e.stopPropagation()
      const result = await this.$axios.put('/api/auth/acceptfriend', { toUser: friend._id })
      if (result.data.success) {
        if (this.$store.state.friend) {
          const indexA = await this.$store.state.user.accept.map((x) => x._id).indexOf(friend._id)
          const indexR = await this.$store.state.friend.request.indexOf(this.$store.state.user._id)
          await this.$store.commit('acceptFriend', { a: indexA, r: indexR })
          await this.$store.commit('acceptFriend_', { a: indexA, r: indexR })
        } else {
          const indexA = await this.$store.state.user.accept.map((x) => x._id).indexOf(friend._id)
          await this.$store.commit('acceptFriendHome', { a: indexA, friend })
          await this.$store.commit('acceptFriendHome_', { a: indexA, friend })
        }
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async DenideFriend(e, friend) {
      e.stopPropagation()
      const result = await this.$axios.put('/api/auth/denidefriend', { toUser: friend._id })
      if (result.data.success) {
        if (this.$store.state.friend) {
          const indexA = await this.$store.state.user.accept.map((x) => x._id).indexOf(friend._id)
          const indexR = await this.$store.state.friend.request.indexOf(this.$store.state.user._id)
          await this.$store.commit('denideFriend', { a: indexA, r: indexR })
        } else {
          const indexA = await this.$store.state.user.accept.map((x) => x._id).indexOf(friend._id)
          await this.$store.commit('denideFriendHome', { a: indexA })
        }
        this.loading = false
      } else {
        this.loading = false
      }
    },
    GoViewProfile(e, id) {
      this.$router.push(`/user/${id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/list_friend.scss';
</style>
