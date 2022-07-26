import axios from 'axios'
import * as REGLAMENTS from '../actions/reglaments'

const state = {
  reglaments: {}
}

const actions = {
  // получить вопросы регламента
  [REGLAMENTS.REGLAMENT_REQUEST]: ({ commit, dispatch }, uidReglament) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'reglament?uid_reglament=' +
        uidReglament
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // получить все регламенты
  [REGLAMENTS.REGLAMENTS_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'reglaments?organization=' +
        data.organization +
        '&user_uid=' +
        data.user_uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit('ChangeReglaments', resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.CREATE_REGLAMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.UPDATE_REGLAMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          commit('ChangeReglaments', [data])
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.CRATE_USER_REGLAMENT_ANSWER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'userReglamentAnswer'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS]: (
    { commit, dispatch },
    uidReglament
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'userReglamentAnswers?uid_reglament=' +
        uidReglament
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS]: (
    { commit, dispatch },
    uidReglament
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'deleteUserReglamentAnswers?uid_reglament=' +
        uidReglament
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.DELETE_REGLAMENT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit('RemoveReglamentByUid', uid)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.GET_REGLAMENTS_BY_USER]: ({ commit, dispatch }, userUid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'usersPassedReglaments?uid_user=' +
        userUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  ChangeReglaments: (state, reglaments) => {
    for (const reglament of reglaments) {
      state.reglaments[reglament.uid] = reglament
    }
  },
  RemoveReglamentByUid: (state, reglamentUid) => {
    delete state.reglaments[reglamentUid]
  }
}

const getters = {
  reglamentsList: (state) => Object.values(state.reglaments)
}

export default {
  state,
  actions,
  mutations,
  getters
}
