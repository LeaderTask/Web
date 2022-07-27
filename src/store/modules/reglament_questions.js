import * as QUESTION from '../actions/reglament_questions'
import axios from 'axios'

const state = {
  reglaments: {}
}

const actions = {
  [QUESTION.REGLAMENT_QUESTIONS_REQUEST]: ({ commit, dispatch }, uidReglament) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentQuestions?uid_reglament=' + uidReglament
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [QUESTION.CREATE_REGLAMENT_QUESTION_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentQuestion'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [QUESTION.UPDATE_REGLAMENT_QUESTION_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentQuestion'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [QUESTION.DELETE_REGLAMENT_QUESTION_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglamentQuestion?uid=' + uid
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
