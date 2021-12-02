<template>
  <v-row>
    <v-col cols="12" class="auth">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">FORGOT</h2>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          placeholder="Enter your email..."
          class="auth__form-input"
        ></v-text-field>

        <v-btn :disabled="!valid" :loading="loading" color="primary" block rounded type="submit" class="auth__form-btn" @click="validate">
          Send
        </v-btn>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/login')">Go to login</span>
        </div>
      </v-form>
      <v-snackbar v-model="snackbarSuccess" color="success" outlined>
        Email was sent check your email!
        <template #action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbarSuccess = false"> Close </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="snackbarFail" color="error" outlined>
        {{ error }}
        <template #action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'auth',

  data: () => ({
    show: false,
    valid: true,
    loading: false,
    snackbarFail: false,
    snackbarSuccess: false,
    error: '',
    email: '',
    emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
  }),

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        this.loading = true
      }
      const result = await this.$axios.$post('/api/auth/forgot', {
        email: this.email,
      })
      if (result.success) {
        this.loading = false
        this.error = ''
        this.snackbarSuccess = true
      } else {
        switch (result.status) {
          case 400:
            this.error = 'Account is not exists!'
            this.loading = false
            this.snackbarFail = true
            break
          default:
            this.error = 'Server error'
            this.loading = false
            this.snackbarFail = true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/auth.scss';
</style>
