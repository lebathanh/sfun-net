<template>
  <div class="home">
    <v-container>
      <v-row class="home-row">
        <v-col cols="10" offset="1" sm="12" offset-sm="0" class="body">
          <post-component
            :post="post"
            :postid="true"
            @sendMessPostId="sendMessPostId"
            @likePostId="likePostId"
            @disLikePostId="disLikePostId"
            @delPostId="delPostId"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PostComponent from '@/components/home/Post.vue'

export default {
  components: {
    PostComponent,
  },

  asyncData(ctx) {
    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          const result = await ctx.$axios.get(`/api/post/${ctx.params.id}`)
          if (result.data.success) {
            resolve({
              post: result.data.post,
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

  data: () => ({}),

  computed: {
    getPost(ctx) {
      return ctx.post ? ctx.post : null
    },
  },

  methods: {
    async sendMessPostId(data) {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      await this.post.comments.push(data.comment)
    },
    async likePostId() {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      if (!this.post.likes.includes(this.$auth.user._id)) {
        await this.post.likes.push(this.$auth.user._id)
      }
    },
    async disLikePostId() {
      this.$auth.fetchUser()
      this.$store.commit('setUser', this.$auth.user)
      const index = await this.post.likes.indexOf(this.$auth.user._id)
      if (index !== -1) {
        this.post.likes.splice(index, 1)
      }
    },
    async delPostId() {
      await this.$auth.fetchUser()
      await this.$store.commit('setUser', this.$auth.user)
      this.$router.push('/')
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
        overflow: auto;
        &::-webkit-scrollbar {
          width: 6px;
          background: #fff;
          border-radius: 30px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba($primary, 0.5);
          border-radius: 30px;
        }
      }
    }
  }
}
</style>
