<template>
  <div>
    <div class="post-cmt__list-item">
      <v-avatar size="40">
        <v-img :src="getAvatar" alt="" srcset="" />
      </v-avatar>
      <div class="post-cmt__list-item__content">
        <div>
          <p @click="$router.push(`/user/${comment.author._id}`)">{{ `${comment.author.lastname} ${comment.author.firstname}` }}</p>
          <v-spacer></v-spacer>
          <span>{{ timePost }}</span>
        </div>
        <span>
          {{ comment.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
  },

  computed: {
    timePost: (ctx) => {
      const time = ctx.getTime(ctx.comment.time)
      const now = new Date()
      const day = new Date(ctx.comment.time)
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
    getAvatar: (ctx) => {
      return ctx.comment.author.avatar === null ? ctx.$store.state.avatarDefault : ctx.comment.author.avatar.imgUrl
    },
  },

  methods: {
    getTime(d) {
      const now = new Date()
      const post = new Date(d)
      return (now.getTime() - post.getTime()) / (24 * 3600 * 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.post-cmt__list-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  &__content {
    margin-left: 4px;
    max-width: 80%;
    min-width: 200px;
    padding: 3px 12px;
    background: #eceff1;
    border-radius: 20px;
    margin-bottom: 5px;
    div {
      display: flex;
      p {
        padding: 0 20px 0 0;
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    span {
      padding: 0;
      margin: 0;
      font-size: $font_sm;
      font-weight: 400;
    }
  }
}
</style>
