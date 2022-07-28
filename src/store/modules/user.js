import axios from 'axios'
import {
  USER_CHANGE_PHONE,
  USER_CHANGE_PHOTO,
  USER_ERROR,
  USER_REQUEST,
  USER_SUCCESS
} from '../actions/user'

const state = {
  user: null,
  status: '',
  hasLoadedOnce: false
}

const getters = {}

const actions = {
  [USER_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(USER_ERROR, err)
          reject(err)
        })
    })
  },
  [USER_CHANGE_PHOTO]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/foto'
      axios({
        data: data.file,
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          dispatch(USER_REQUEST).then((resp) => {
            commit(USER_CHANGE_PHOTO)
            resolve(resp)
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [USER_CHANGE_PHONE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/phone'
      axios({
        data: data,
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [USER_CHANGE_PHOTO]: (state, data) => {
    state.user.foto_link = state.user.foto_link + '&Z=' + Date.now()
  },
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.user = resp.data
    console.log('current user', state.user)
    state.hasLoadedOnce = true
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  ChangeCurrentUserName: (state, name) => {
    if (state.user) {
      state.user.current_user_name = name
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
