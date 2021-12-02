export const state = () => ({
  avatarDefault: 'https://res.cloudinary.com/bathanh-tech/image/upload/v1637742100/avatar_ikkqz0.jpg',
  bgDefault:
    'https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80',
  user: null,
  posts: null,
  friend: null,
})

export const mutations = {
  // socket
  updateFriendStatus(state, data) {
    state.user.friends[data].online = true
  },
  updateFriendStatusOff(state, data) {
    state.user.friends[data].online = false
  },
  addNotification(state, data) {
    state.user.notifications.splice(0, 0, data)
  },

  // User
  setUser(state, data) {
    state.user = data
  },
  updateUser(state, data) {
    state.user.firstname = data.firstname
    state.user.lastname = data.lastname
    state.user.gender = data.gender
    state.user.birth = data.birth
    state.user.address = data.address
  },
  updateAvatar(state, data) {
    state.user.avatar = data
  },
  addCommentsUser(state, data) {
    state.user.posts[data.index].comments.push(data.comment)
  },
  likePostUser(state, data) {
    state.user.posts[data.index].likes.push(data._id)
  },
  disLikePostUser(state, data) {
    state.user.posts[data.index].likes.splice(data.i, 1)
  },
  delPostUser(state, data) {
    state.user.posts.splice(data.index, 1)
  },

  // Notifi
  delNotifi(state, data) {
    state.user.notifications.splice(data.index, 1)
  },

  // Friend
  setFriend(state, data) {
    state.friend = data
  },
  addCommentsFriend(state, data) {
    state.friend.posts[data.index].comments.push(data.comment)
  },
  likePostFriend(state, data) {
    state.friend.posts[data.index].likes.push(data._id)
  },
  disLikePostFriend(state, data) {
    state.friend.posts[data.index].likes.splice(data.i, 1)
  },
  addFriend(state, data) {
    state.user.request.push(data)
  },
  cancelFriend(state, data) {
    state.user.request.splice(data, 1)
  },
  denideFriend(state, data) {
    state.user.accept.splice(data.a, 1)
    state.friend.request.splice(data.r, 1)
  },
  acceptFriend(state, data) {
    state.user.accept.splice(data.a, 1)
    state.friend.request.splice(data.r, 1)
    state.user.friends.push(state.friend)
    state.friend.friends.push(state.user._id)
  },
  acceptFriendHome(state, data) {
    state.user.accept.splice(data.a, 1)
    state.user.friends.push(data.friend)
  },
  denideFriendHome(state, data) {
    state.user.accept.splice(data.a, 1)
  },
  delFriend(state, data) {
    state.user.friends.splice(data.u, 1)
    state.friend.friends.splice(data.f, 1)
  },

  // Write
  updatePostsUser(state, data) {
    state.user.posts.splice(0, 0, data.post)
  },
  updatePostsGroup(state, data) {
    state.user.groups[data.index].posts.splice(0, 0, data.post)
  },

  // Save
  addCommentsSave(state, data) {
    state.user.saved[data.index].comments.push(data.comment)
  },
  likePostSave(state, data) {
    state.user.saved[data.index].likes.push(data._id)
  },
  disLikePostSave(state, data) {
    state.user.saved[data.index].likes.splice(data.i, 1)
  },
  delPostSave(state, data) {
    state.user.saved.splice(data.index, 1)
  },

  // Posts
  setPosts(state, data) {
    state.posts = data
  },
  likePost(state, data) {
    state.posts.posts[data.index].likes.push(data._id)
  },
  disLikePost(state, data) {
    state.posts.posts[data.index].likes.splice(data.i, 1)
  },
  delPost(state, data) {
    state.posts.posts.splice(data.index, 1)
    if (data.i !== -1) {
      state.user.posts.splice(data.i, 1)
    }
  },
  updatePosts(state, data) {
    state.posts.posts.splice(0, 0, data.post)
    state.user.posts.splice(0, 0, data.post)
  },
  loadPosts(state, data) {
    state.posts.count = data.count
    state.posts.posts.push(...data.posts)
  },
  savePost(state, data) {
    state.user.saved.splice(0, 0, data)
  },
  unSavePost(state, data) {
    state.user.saved.splice(data, 1)
  },

  // Group
  likePostGroup(state, data) {
    state.user.groups[data.indexG].posts[data.indexP].likes.push(data._id)
  },
  disLikePostGroup(state, data) {
    state.user.groups[data.indexG].posts[data.indexP].likes.splice(data.indexU, 1)
  },
  delPostGroup(state, data) {
    state.user.groups[data.indexG].posts.splice(data.indexP, 1)
  },

  // Comments
  addComments(state, data) {
    state.posts.posts[data.index].comments.push(data.comment)
  },
  addCommentsGroup(state, data) {
    state.user.groups[data.indexG].posts[data.indexP].comments.push(data.comment)
  },
}

export const actions = {}
