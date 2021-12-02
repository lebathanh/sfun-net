<template>
  <div class="home">
    <v-container>
      <v-row class="home-row">
        <v-col cols="10" offset="1" class="body">
          <client-only>
            <group-component
              :group="group"
              @sendMessGroupId="sendMessGroupId"
              @likePostGroupId="likePostGroupId"
              @disLikePostGroupId="disLikePostGroupId"
              @delPostGroupId="delPostGroupId"
              @updatePostsGroupId="updatePostsGroupId"
            />
          </client-only>
        </v-col>
      </v-row>
    </v-container>
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
import GroupComponent from '@/components/group/Group.vue'

export default {
  components: {
    GroupComponent,
  },

  asyncData(ctx) {
    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          const result = await ctx.$axios.get(`/api/group/${ctx.params.id}`)
          if (result.data.success) {
            resolve({
              group: result.data.group,
            })
          } else {
            ctx.redirect('/error')
          }
        } catch (error) {
          ctx.redirect('/error')
        }
      })()
    })
  },

  data: () => ({
    snackbarSuccess: false,
    snackbarFail: false,
    overlay: false,
  }),

  methods: {
    async sendMessGroupId(data) {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      const indexP = await this.group.posts.findIndex((x) => x._id === data.id)
      this.group.posts[indexP].comments.push(data.comment)
    },
    async likePostGroupId(data) {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      const indexP = await this.group.posts.findIndex((x) => x._id === data.id)
      this.group.posts[indexP].likes.push(this.$auth.user._id)
    },
    async disLikePostGroupId(data) {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      const indexP = await this.group.posts.findIndex((x) => x._id === data.id)
      const indexU = await this.group.posts[indexP].likes.indexOf(this.$auth.user._id)
      if (indexU !== -1) {
        this.group.posts[indexP].likes.splice(indexU, 1)
      }
    },
    async delPostGroupId(data) {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      const indexP = await this.group.posts.findIndex((x) => x._id === data.id)
      if (indexP !== -1) {
        this.group.posts.splice(indexP, 1)
      }
    },
    async updatePostsGroupId(data) {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      await this.group.posts.splice(0, 0, data.post)
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
      .body {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
