<template>
  <div>
    <div class="message">
      <!-- friend -->
      <div :class="{ 'message-left': true, hide: isUser }">
        <v-avatar size="40">
          <v-img :src="getAvatar"></v-img>
        </v-avatar>
        <div class="content">
          <span> {{ mess.content }}</span>
          <p>{{ timeMess }}</p>
        </div>
      </div>
      <!-- user -->
      <div :class="{ 'message-right': true, hide: !isUser }">
        <div class="content">
          <span> {{ mess.content }}</span>
          <p>{{ timeMess }}</p>
        </div>
        <v-avatar size="40">
          <v-img :src="getAvatar"></v-img>
        </v-avatar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mess: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
    fravatar: {
      type: [String],
      default: () => '',
    },
  },

  computed: {
    getAvatar: (ctx) => {
      if (ctx.isUser) {
        return ctx.$store.state.user.avatar === null ? ctx.$store.state.avatarDefault : ctx.$store.state.user.avatar.imgUrl
      } else {
        return ctx.fravatar
      }
    },

    isUser: (ctx) => {
      return ctx.mess.author === ctx.$store.state.user._id
    },

    timeMess: (ctx) => {
      const now = new Date()
      const post = new Date(ctx.mess.createdAt)
      const time = (now.getTime() - post.getTime()) / (24 * 3600 * 1000)
      const day = new Date(ctx.mess.createdAt)
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
  },
}
</script>

<style lang="scss" scoped>
.hide {
  visibility: hidden;
}
.message {
  padding: 5px 0;
  width: 100%;
  height: auto;
  display: flex;
  &-left {
    max-width: 50%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    .content {
      margin-left: 8px;
      background: $primary;
      padding: 12px 12px 4px 12px;
      border-radius: 10px;
      color: white;
      display: flex;
      flex-direction: column;
      p {
        margin: 0;
        font-size: 12px;
        align-self: center;
      }
    }
  }
  &-right {
    max-width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 100%;
    .content {
      margin-right: 8px;
      background: $primary;
      padding: 12px 12px 4px 12px;
      border-radius: 10px;
      color: white;
      display: flex;
      flex-direction: column;
      p {
        margin: 0;
        font-size: 12px;
        align-self: center;
      }
    }
  }
}
</style>
