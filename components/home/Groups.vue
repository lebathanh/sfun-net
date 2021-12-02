<template>
  <div class="body">
    <v-card class="group">
      <v-list subheader class="group-list">
        <v-subheader class="group-list__header">
          <span>Groups - {{ getGroups.length }} </span>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="400px" persistent>
            <template #activator="{ on, attrs }">
              <v-icon class="mr-2" color="white" v-bind="attrs" v-on="on">mdi-plus-circle-outline</v-icon>
            </template>

            <v-card>
              <v-toolbar class="list-group__header-header" color="primary">Create a new group</v-toolbar>
              <div class="list-group__header-input">
                <label for="inputGrName">Group's name</label>
                <input id="inputGrName" v-model="inputGrName" placeholder="Enter your group's name..." type="text" />
              </div>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click=";(dialog = false), (inputGrName = '')"> Cancel </v-btn>
                <v-btn :loading="loading" color="primary" @click="HandleCreate"> Create </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-icon v-if="!gShow" color="white" @click="gShow = true"> mdi-chevron-down </v-icon>
          <v-icon v-if="gShow" color="white" @click="gShow = false"> mdi-chevron-up </v-icon>
        </v-subheader>
        <div v-if="gShow" class="group-list__content">
          <v-list-item-group>
            <v-list-item v-for="(item, i) in getGroups" :key="i" @click="handleSelected($event, { i, item })">
              <v-list-item-avatar>
                <v-img :alt="`${item.name} avatar`" :src="item.background === null ? $store.state.bgDefault : item.background.imgUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon class="group-list__content-icon">
                <span>{{ item.members.length }}</span>
                <v-icon color="primary"> mdi-account-multiple </v-icon>
                <span>{{ item.posts.length }}</span>
                <v-icon color="warning"> mdi-archive-edit </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </div>
      </v-list>
    </v-card>

    <!-- Amination -->
    <v-snackbar v-model="invalid" color="error" outlined>
      Group's name must be more than 6 leters
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="invalid = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbarSuccess" color="success" outlined>
      Successfully!

      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackbarFail" color="error" outlined>
      Please try again later!

      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Boolean,
      default: () => false,
    },
  },

  data: () => ({
    gShow: true,
    dialog: false,
    invalid: false,
    snackbarSuccess: false,
    snackbarFail: false,
    loading: false,
    inputGrName: '',
  }),

  computed: {
    getGroups(ctx) {
      if (ctx.$store.state.user) {
        return ctx.$store.state.user.groups
      } else {
        return []
      }
    },
  },

  methods: {
    async HandleCreate() {
      if (this.inputGrName.length < 6) {
        this.invalid = true
      } else {
        this.loading = true
        try {
          const result = await this.$axios.post('/api/group', { name: this.inputGrName })
          if (result.data.success) {
            await this.$auth.fetchUser()
            await this.$store.commit('setUser', this.$auth.user)
            this.loading = false
            this.dialog = false
            this.snackbarSuccess = true
            this.inputGrName = ''
          } else {
            this.loading = false
            this.snackbarFail = true
          }
        } catch (error) {
          this.loading = false
          this.snackbarFail = true
        }
      }
    },
    handleSelected(e, data) {
      if (this.group) {
        this.$emit('handleSelected', data.i)
      } else {
        this.$router.push(`/group/${data.item._id}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/list_group.scss';
.list-group__header {
  &-header {
    font-size: 24px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
  }
  &-input {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    label {
      font-size: 18px;
      font-weight: 600;
      width: 90%;
      color: #03a9f4;
      text-transform: capitalize;
    }
    input {
      margin-top: 3px;
      border-radius: 10px;
      outline: none;
      padding: 5px 10px;
      width: 90%;
      border: 1px solid #03a9f4;
    }
  }
}
</style>
