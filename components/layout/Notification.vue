<template>
  <v-list-item @click="HandleClick">
    <v-list-item-avatar>
      <img :src="item.author.avatar === null ? $store.state.avatarDefault : item.author.avatar.imgUrl" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-subtitle>
        {{ item.author.firstname }} updated a new post{{ item.post.group === null ? '.' : ` in ${item.post.group.name}` }}
      </v-list-item-subtitle>
      <v-list-item-subtitle> {{ timePost }} </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-icon>
      <v-icon class="drop_notifi-icon" @click="delNotifi"> mdi-trash-can-outline </v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  props: {
    item: {
      type: [Object, Boolean, Array, String],
      default: () => {},
    },
  },

  computed: {
    timePost: (ctx) => {
      const time = ctx.getTime(ctx.item.time)
      const now = new Date()
      const day = new Date(ctx.item.time)
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

  methods: {
    getTime(d) {
      const now = new Date()
      const post = new Date(d)
      return (now.getTime() - post.getTime()) / (24 * 3600 * 1000)
    },
    async HandleClick(e) {
      const result = await this.$axios.put(`/api/notifi/delete`, { notifi: this.item._id })
      if (result.data.success) {
        const index = await this.$store.state.user.notifications.findIndex((x) => x._id === this.item._id)
        const data = {
          index,
        }
        this.$router.push(`/post/${this.item.post._id}`)
        this.$store.commit('delNotifi', data)
      }
    },
    async delNotifi(e) {
      e.stopPropagation()
      const result = await this.$axios.put(`/api/notifi/delete`, { notifi: this.item._id })
      if (result.data.success) {
        const index = await this.$store.state.user.notifications.findIndex((x) => x._id === this.item._id)
        const data = {
          index,
        }
        this.$store.commit('delNotifi', data)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.drop_notifi {
  &-icon {
    &:hover {
      color: red;
    }
  }
}
</style>
