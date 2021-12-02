<template>
  <div class="body">
    <!-- Header -->
    <writepost-component />

    <!-- Body -->
    <div class="content">
      <div v-infinite-scroll="loadPost" infinite-scroll-disabled="disabled" class="wraper">
        <post-component v-for="(post, i) in getPosts" :key="i" :post="post" />
        <div class="text-center wraper_loading">
          <v-progress-circular v-if="scroll_loading" indeterminate color="primary"></v-progress-circular>
          <span v-if="disabled">That's all...!</span>
        </div>
      </div>
    </div>

    <v-snackbar v-model="snackbarNewPosts" color="primary" top centered rounded="pill" outlined timeout="-1">
      You have new posts, refresh to see now...
      <template #action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="
            {
              refreshListPost(), (snackbarNewPosts = false)
            }
          "
        >
          Refresh
        </v-btn>
        <v-btn color="warning" text v-bind="attrs" @click="snackbarNewPosts = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import WritepostComponent from '@/components/home/WritePost.vue'
import PostComponent from '@/components/home/Post.vue'

export default {
  components: {
    WritepostComponent,
    PostComponent,
  },

  data: () => ({
    scroll_loading: false,
    current_page: 1,
    snackbarNewPosts: false,
  }),

  computed: {
    getPosts(ctx) {
      return ctx.$store.state.posts !== null ? ctx.$store.state.posts.posts : []
    },
    disabled: (ctx) => {
      if (ctx.$store.state.posts) {
        return ctx.current_page >= ctx.$store.state.posts.count
      } else {
        return false
      }
    },
  },

  mounted() {
    this.$axios.get('/api/post/page/1').then((respone) => {
      if (respone.data.success) {
        this.current_page = 1
        this.$store.commit('setPosts', {
          posts: respone.data.posts,
          count: respone.data.postsSize,
        })
      } else {
        this.$store.commit('setPosts', {
          posts: [],
          count: 1,
        })
      }
    })
  },

  methods: {
    async loadPost() {
      try {
        this.scroll_loading = true
        const result = await this.$axios.get(`/api/post/page/${++this.current_page}`)
        if (result.data.success) {
          this.scroll_loading = false
          const data = {
            count: result.data.postsSize,
            posts: result.data.posts,
          }
          await this.$store.commit('loadPosts', data)
        }
      } catch (error) {}
    },
    refreshListPost() {
      this.$axios.get('/api/post/page/1').then((respone) => {
        if (respone.data.success) {
          this.current_page = 1
          this.$store.commit('setPosts', {
            posts: respone.data.posts,
            count: respone.data.postsSize,
          })
        } else {
          this.$store.commit('setPosts', {
            posts: [],
            count: 1,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/list_post.scss';
</style>
