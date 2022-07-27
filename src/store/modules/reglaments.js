import axios from 'axios'
import * as REGLAMENTS from '../actions/reglaments'

const state = {
  reglaments: {},
  reglamentQuestions: [], // вопросы по текущему регламенту
  contributors: [] // сотрудники, прошедшие текущий регламент
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
          commit(REGLAMENTS.REGLAMENT_SUCCESS, resp.data)
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
          commit(REGLAMENTS.REGLAMENT_CHANGE_REGLAMENTS, resp.data)
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
          commit(REGLAMENTS.REGLAMENT_CHANGE_REGLAMENTS, [data])
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
  [REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS]: ({ commit, dispatch }, uidReglament) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'userReglamentAnswers?uid_reglament=' +
        uidReglament
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS]: ({ commit, dispatch }, uidReglament) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'deleteUserReglamentAnswers?uid_reglament=' +
        uidReglament
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit(REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS)
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
  [REGLAMENTS.REGLAMENT_SUCCESS]: (state, data) => {
    state.reglamentQuestions = data
  },
  [REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS]: (state) => {
    state.contributors = []
  },
  [REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS]: (state, data) => {
    const contributors = data
    const seen = []
    const cleared = []
    for (let i = 0; i < contributors.length; i++) {
      if (!(seen.includes(contributors[i].uid_user))) {
        seen.push(contributors[i].uid_user)
        cleared.push(contributors[i])
      }
    }
    state.contributors = cleared
  },
  [REGLAMENTS.REGLAMENT_RESTORE_SELECTED]: (state) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
        if (state.reglamentQuestions[i].answers[j].selected) {
          state.reglamentQuestions[i].answers[j].selected = false
        }
      }
    }
  },
  [REGLAMENTS.REGLAMENT_UPDATE_QUESTION_NAME]: (state, data) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      if (state.reglamentQuestions[i].uid === data.uid) {
        state.reglamentQuestions[i].name = data.name
        return
      }
    }
  },
  [REGLAMENTS.REGLAMENT_DELETE_ANSWER]: (state, uid) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
        if (state.reglamentQuestions[i].answers[j].uid === uid) {
          state.reglamentQuestions[i].answers.splice(j, 1)
          return
        }
      }
    }
  },
  [REGLAMENTS.REGLAMENT_PUSH_ANSWER]: (state, data) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      if (state.reglamentQuestions[i].uid === data.uid_question) {
        if (!state.reglamentQuestions[i].answers) {
          state.reglamentQuestions[i].answers = []
        }
        state.reglamentQuestions[i].answers.push(data)
        return
      }
    }
  },
  [REGLAMENTS.REGLAMENT_UPDATE_ANSWER_NAME]: (state, data) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
        if (state.reglamentQuestions[i].answers[j].uid === data.uid) {
          state.reglamentQuestions[i].answers[j] = data
        }
      }
    }
  },
  [REGLAMENTS.REGLAMENT_SELECT_ANSWER]: (state, data) => {
    let rightAnswers = 0
    // считаем кол-во правильных ответов в вопросе и решаем, что будем делать дальше
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      // ищем вопрос, который мы выбрали, а потом проверяем считаем ответы
      if (state.reglamentQuestions[i].uid === data[0].uid_question) {
        for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
          if (state.reglamentQuestions[i].answers[j].is_right) {
            rightAnswers++
          }
        }
      }
    }
    // запускаем логику для одного вопроса
    if (rightAnswers === 1) {
      for (let i = 0; i < state.reglamentQuestions.length; i++) {
        if (state.reglamentQuestions[i].uid === data[0].uid_question) {
          for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
            // убираем selected с предыдущего вопроса
            if (state.reglamentQuestions[i].answers[j].selected && (state.reglamentQuestions[i].answers[j].uid !== data[0].uid)) {
              state.reglamentQuestions[i].answers[j].selected = false
            }
            // ставим selected новому вопросу
            if (!state.reglamentQuestions[i].answers[j].selected && (state.reglamentQuestions[i].answers[j].uid === data[0].uid)) {
              state.reglamentQuestions[i].answers[j].selected = true
            } else {
              state.reglamentQuestions[i].answers[j].selected = false
            }
          }
        }
      }
    } else {
      // выделяет/развыделяет множество ответов
      for (let i = 0; i < state.reglamentQuestions.length; i++) {
        for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
          if (state.reglamentQuestions[i].answers[j].uid === data[0].uid) {
            state.reglamentQuestions[i].answers[j].selected = data[1]
            return
          }
        }
      }
    }
  },
  [REGLAMENTS.REGLAMENT_SET_RIGHT_ANSWER]: (state, data) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      for (let j = 0; j < state.reglamentQuestions[i].answers.length; j++) {
        if (state.reglamentQuestions[i].answers[j].uid === data.uid) {
          state.reglamentQuestions[i].answers[j] = data
          return
        }
      }
    }
  },
  [REGLAMENTS.REGLAMENT_PUSH_QUESTION]: (state, data) => {
    state.reglamentQuestions.push(data)
  },
  [REGLAMENTS.REGLAMENT_DELETE_QUESTION]: (state, uid) => {
    for (let i = 0; i < state.reglamentQuestions.length; i++) {
      if (state.reglamentQuestions[i].uid === uid) {
        state.reglamentQuestions.splice(i, 1)
      }
    }
  },
  [REGLAMENTS.REGLAMENT_CHANGE_REGLAMENTS]: (state, reglaments) => {
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
