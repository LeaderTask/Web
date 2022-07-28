import * as ANSWER from '../actions/reglament_answers'
import axios from 'axios'

const state = {
  reglaments: {}
}

const actions = {
  [ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentAnswer'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [ANSWER.UPDATE_REGLAMENT_ANSWER_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentAnswer'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [ANSWER.DELETE_REGLAMENT_ANSWER_REQUEST]: ({ commit, dispatch }, uid) => {
    const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentAnswer?uid=' + uid
    return new Promise((resolve, reject) => {
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {}

export default {
  state,
  actions,
  mutations
}
