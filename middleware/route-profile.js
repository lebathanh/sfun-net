export default function ({ $auth, redirect, params }) {
  if (!$auth.loggedIn) {
    return redirect('/auth/login')
  } else if (params.id === $auth.user._id) {
    return redirect('/user')
  }
}
