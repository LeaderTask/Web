import * as INSPECTOR from '../actions/inspector'
import axios from 'axios'

const state = {
  karma: [],
  is_notification_sound_on: true
}

const getters = {
}

const actions = {
  [INSPECTOR.CREATE_INSPECTOR_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'inspecttask'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [INSPECTOR.CREATE_OR_UPDATE_INSPECTOR_USER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'user'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [INSPECTOR.ANSWER_INSPECTOR_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'answer-message?id=' + data.id + '&answer=' + data.answer
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [INSPECTOR.KARMA_REQUEST]: ({ commit, dispatch }, uidUser) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'karma?uid_user=' + uidUser
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(INSPECTOR.KARMA_REQUEST, resp.data)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [INSPECTOR.UPDATE_SOUND_SETTING]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'sound-setting'
      axios({ url: url, method: 'POST', data })
        .then(resp => {
          commit(INSPECTOR.UPDATE_SOUND_SETTING, data.value)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [INSPECTOR.GET_SOUND_SETTING]: ({ commit, dispatch }, uidUser) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'sound-setting?uid_user=' + uidUser
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(INSPECTOR.GET_SOUND_SETTING, resp.data.is_notification_sound_on)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [INSPECTOR.KARMA_REQUEST]: (state, karma) => {
    state.karma = karma
  },
  [INSPECTOR.GET_SOUND_SETTING]: (state, value) => {
    state.is_notification_sound_on = value === 1
  },
  [INSPECTOR.UPDATE_SOUND_SETTING]: (state, value) => {
    state.is_notification_sound_on = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
