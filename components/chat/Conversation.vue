<template>
  <div>
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="getAvatar"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="`${getFriend.lastname} ${getFriend.firstname}`"></v-list-item-title>

        <v-list-item-subtitle v-text="getLastMess.content"></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text v-text="timePost"></v-list-item-action-text>

        <v-icon v-if="!checkNewMess" color="grey lighten-1"> mdi-facebook-messenger </v-icon>

        <v-icon v-else color="red accent-3"> mdi-facebook-messenger </v-icon>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    conver: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
  },

  computed: {
    getTimeL: (ctx) => {
      if (ctx.getLastMess !== '') {
        return ctx.getLastMess.createdAt
      } else {
        return new Date()
      }
    },
    timePost: (ctx) => {
      const now = new Date()
      const post = new Date(ctx.getTimeL)
      const time = (now.getTime() - post.getTime()) / (24 * 3600 * 1000)
      const day = new Date(ctx.getTimeL)
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
    getFriend: (ctx) => {
      return ctx.conver.members.filter((member) => member._id !== ctx.$store.state.user._id)[0]
    },
    getLastMess: (ctx) => {
      return ctx.conver.messages.length > 0 ? ctx.conver.messages[ctx.conver.messages.length - 1] : ''
    },
    checkNewMess: (ctx) => {
      return ctx.conver.newMess.includes(ctx.$store.state.user._id)
    },
    getAvatar: (ctx) => {
      return ctx.getFriend.avatar === null ? ctx.$store.state.avatarDefault : ctx.getFriend.avatar.imgUrl
    },
  },

  mounted() {},

  method: {},
}
</script>
