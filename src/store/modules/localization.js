import {
  LOCALIZATION_REQUEST,
  LOCALIZATION_ERROR,
  LOCALIZATION_SUCCESS
} from '../actions/localization'

import axios from 'axios'

const state = {
  localization: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {
}

const actions = {
  [LOCALIZATION_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(LOCALIZATION_REQUEST)

      // getting language logic
      let language = 'russian'
      if (navigator.language.includes('en')) language = 'english'

      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/localize/strings?language=' + language
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(LOCALIZATION_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(LOCALIZATION_ERROR, err)
          reject(err)
        })
    })
  }
}

const mutations = {
  [LOCALIZATION_REQUEST]: state => {
    state.status = 'loading'
  },
  [LOCALIZATION_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.localization = resp?.data?.rows
    state.hasLoadedOnce = true
  },
  [LOCALIZATION_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
