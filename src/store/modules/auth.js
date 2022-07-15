import { setLocalStorageItem } from '@/store/helpers/functions'
import axios from 'axios'
import { notify } from 'notiwind'
import {
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_REGISTER,
  AUTH_REQUEST,
  AUTH_RESET,
  AUTH_SUCCESS,
  AUTH_CHANGE_PASSWORD,
  AUTH_REFRESH_TOKEN
} from '../actions/auth'
import { RESET_STATE_NAVIGATOR } from '../actions/navigator'
import { RESET_STATE_PROJECT } from '../actions/projects'
import { PROJECT_TASKS_REQUEST, RESET_STATE_TASKS } from '../actions/tasks'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: (state) => !!state.token,
  authStatus: (state) => state.status
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, uri) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios({ url: uri, method: 'POST' })
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: AUTH_REQUEST,
              text: err.response?.data ?? err
            },
            15000
          )
          reject(err)
        })
    })
  },
  [AUTH_REGISTER]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REGISTER)
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/new'
      axios({ url: uri, data: user, method: 'POST' })
        .then((resp) => {
          console.log(resp)
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: AUTH_REGISTER,
              text: err.response?.data ?? err
            },
            15000
          )
          reject(err)
        })
    })
  },
  [AUTH_CHANGE_PASSWORD]: ({ commit }, data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
      commit(AUTH_CHANGE_PASSWORD)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/password'
      axios({ url: url, data: data, method: 'PATCH' })
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: AUTH_CHANGE_PASSWORD,
              text: err.response?.data ?? err
            },
            15000
          )
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-refresh-token')
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/exit'
      commit(RESET_STATE_NAVIGATOR)
      commit(RESET_STATE_TASKS)
      commit(RESET_STATE_PROJECT)
      commit(PROJECT_TASKS_REQUEST)
      commit(AUTH_REQUEST)
      commit(AUTH_RESET)
      axios
        .get(url)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: AUTH_LOGOUT,
              text: err.response?.data ?? err
            },
            15000
          )
          reject(err)
        })
    })
  },
  [AUTH_REFRESH_TOKEN]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.defaults.headers.common.RefreshToken = localStorage.getItem('user-refresh-token')
      const url = process.env.VUE_APP_LEADERTASK_API + 'https://web.leadertask.com/api/v1/tokens/refresh'
      axios
        .post(url)
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: AUTH_LOGOUT,
              text: err.response?.data ?? err
            },
            15000
          )
          reject(err)
        })
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_REGISTER]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.data.access_token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
    window.location.href += 'login'
  },
  [AUTH_RESET]: (state, index) => {
    localStorage.removeItem('navStack')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
