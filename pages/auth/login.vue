<template>
  <v-row>
    <v-col cols="12" class="auth">
      <v-form ref="form" v-model="valid" lazy-validation class="auth__form">
        <v-avatar size="150" class="auth__form-avatar">
          <img src="@/assets/images/avatar.png" alt="" srcset="" />
        </v-avatar>

        <h2 class="auth__form-header">LOGIN</h2>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          placeholder="Enter your email..."
          class="auth__form-input"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          required
          placeholder="Enter your password..."
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          class="auth__form-input"
          @click:append="show = !show"
        ></v-text-field>

        <v-btn :disabled="!valid" :loading="loading" color="primary" block rounded type="submit" class="auth__form-btn" @click="validate">
          Login
        </v-btn>

        <div class="auth__form-link">
          <span @click="$router.push('/auth/register')">Create a new account</span>
          <span @click="$router.push('/auth/forgot')">Forgot password</span>
        </div>
      </v-form>
    </v-col>
    <v-snackbar v-model="snackbarFail" color="error" outlined>
      {{ error }}
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarFail = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  layout: 'auth',

  middleware: 'auth-login',

  data: () => ({
    show: false,
    error: '',
    loading: false,
    snackbarFail: false,
    valid: true,
    email: '',
    emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
    password: '',
    passwordRules: [(v) => !!v || 'Password is required', (v) => (v && v.length >= 8) || 'Password must be at least 8 characters'],
  }),

  methods: {
    async validate(e) {
      e.preventDefault()
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const result = await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password,
            },
          })
          if (result.data.success) {
            this.loading = false
            this.error = ''
          } else {
            switch (result.data.code) {
              case 401:
                this.loading = false
                this.error = 'Your information is invalid!'
                this.snackbarFail = true
                break
              case 403:
                this.loading = false
                this.error = 'Account is not exists!'
                this.snackbarFail = true
                break
              case 400:
                this.loading = false
                this.error = 'Password is incorectly!'
                this.snackbarFail = true
                break
              default:
                this.loading = false
                this.error = 'Server error!'
                this.snackbarFail = true
                break
            }
          }
        } catch (error) {
          this.error = 'Server error!'
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
