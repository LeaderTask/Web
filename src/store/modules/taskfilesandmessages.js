import {
  CREATE_FILES_REQUEST,
  CREATE_FILE_REQUEST,
  DELETE_FILE_REQUEST,
  FILES_ERROR,
  FILES_REQUEST,
  FILES_SUCCESS,
  FILE_SUCCESS,
  GET_FILE,
  MERGE_FILES_WITH_MESSAGES,
  MYFILES,
  REFRESH_FILES,
  TOGGLE_UPLOAD_STATUS
} from '../actions/taskfiles'
import {
  CHANGE_MESSAGE,
  CREATE_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  INSPECTOR_MESSAGES_REQUEST,
  INSPECTOR_MESSAGES_SUCCESS,
  MESSAGES_ERROR,
  MESSAGES_REQUEST,
  MESSAGES_SUCCESS,
  REFRESH_CHAT_MESSAGES,
  REFRESH_INSPECTOR_MESSAGES,
  REFRESH_MESSAGES,
  REMOVE_MESSAGE_LOCALLY
} from '../actions/taskmessages'

import axios from 'axios'

const state = {
  /* messages */
  messages: [],
  chatMessages: [],
  inspectorMessages: [],
  status: '',
  hasLoadedOnce: false,
  /* files */
  files: [],
  file: '',
  myfiles: {},
  uploadStarted: false,
  fileAbortController: null
}

const getters = {}

const actions = {
  [FILES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit('abortFileAbortController')
      const fileAbortController = new AbortController()
      commit('initFileAbortController', fileAbortController)
      commit(FILES_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasksfiles/bytask?uid=' +
        taskUid
      axios({ url: url, method: 'GET', signal: fileAbortController.signal })
        .then((resp) => {
          commit(FILES_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(FILES_ERROR)
          reject(err)
        })
    })
  },
  [GET_FILE]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksfiles/file?uid=' + uid
      axios({ url: url, method: 'GET', responseType: 'blob' })
        .then((resp) => {
          commit(FILE_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(FILES_ERROR)
          reject(err)
        })
    })
  },
  [CREATE_FILES_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasksfiles/several?uid_task=' +
        data.uid_task
      commit(TOGGLE_UPLOAD_STATUS)
      axios({
        url: url,
        method: 'POST',
        data: data.name,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((resp) => {
          commit(CREATE_FILES_REQUEST, resp)
          commit(TOGGLE_UPLOAD_STATUS)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
          commit(TOGGLE_UPLOAD_STATUS)
        })
    })
  },
  [CREATE_FILE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasksfiles/one?uid_task=' +
        data.uid_task
      axios({
        url: url,
        method: 'POST',
        data: data.name,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((resp) => {
          commit(CREATE_FILE_REQUEST, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [MESSAGES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasksmsgs/bytask?uid=' +
        taskUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(MESSAGES_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(MESSAGES_ERROR, err)
          reject(err)
        })
    })
  },
  [INSPECTOR_MESSAGES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'message?uid_task=' + taskUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(INSPECTOR_MESSAGES_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(MESSAGES_ERROR, err)
          reject(err)
        })
    })
  },
  [CREATE_MESSAGE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksmsgs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
          commit(CREATE_MESSAGE_REQUEST, data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [DELETE_MESSAGE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksmsgs?uid=' + data.uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [DELETE_FILE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasksfiles?uid=' + data.uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
          commit(DELETE_FILE_REQUEST, data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  fetchMessagesAndFiles ({ commit, dispatch }, uid) {
    commit(MESSAGES_REQUEST)

    const messages = dispatch(MESSAGES_REQUEST, uid)
    const inspectorMessages = dispatch(INSPECTOR_MESSAGES_REQUEST, uid)
    const files = dispatch(FILES_REQUEST, uid)

    return Promise.all([messages, files, inspectorMessages]).then(() => {
      commit(MERGE_FILES_WITH_MESSAGES)
    })
  }
}

const mutations = {
  [MESSAGES_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [MESSAGES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.chatMessages = resp.data.msgs
    state.hasLoadedOnce = true
  },
  [INSPECTOR_MESSAGES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.inspectorMessages = resp.data
    state.hasLoadedOnce = true
  },
  [MESSAGES_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [CREATE_MESSAGE_REQUEST]: (state, data) => {
    // check if inspector message is already in chat messages
    if (data.id && state.messages.find((message) => message.id === data.id)) {
      return
    }
    state.messages.push(data)
  },
  [DELETE_FILE_REQUEST]: (state, data) => {
    state.messages.splice(state.messages.indexOf(data), 1)
  },
  [FILES_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [FILES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.files = resp?.data?.files || []
    state.hasLoadedOnce = true
  },
  [FILE_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.file = resp.data.files
    state.hasLoadedOnce = true
  },
  [CREATE_FILE_REQUEST]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true
  },
  [CHANGE_MESSAGE]: (state, data) => {
    for (let i = 0; i < state.messages.length; i++) {
      if (state.messages[i].uid === data.uid) {
        state.messages[i][data.key] = data.value
      }
    }
  },
  [REMOVE_MESSAGE_LOCALLY]: (state, message) => {
    for (let i = 0; i < state.messages.length; i++) {
      if (message.uid === state.messages[i].uid) {
        state.messages.splice(i, 1)
      }
    }
  },
  createLoadingFile (state, data) {
    data.loading = true
    state.messages.push(data)
  },
  [CREATE_FILES_REQUEST]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true
    for (let i = 0; i < state.messages.length; i++) {
      state.messages = state.messages.filter((item) => !item.loading)
    }
    for (const file of resp.data.success) {
      file.msg = file.file_name
      state.messages.push(file)
    }
  },
  [MYFILES]: (state, myfiles) => {
    state.status = 'success'
    for (const taskfile of myfiles) {
      state.myfiles[taskfile.uid_creator] = taskfile
    }
    state.hasLoadedOnce = true
  },
  [FILES_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_CHAT_MESSAGES]: (state) => {
    state.chatMessages = []
  },
  [REFRESH_INSPECTOR_MESSAGES]: (state) => {
    state.inspectorMessages = []
  },
  [REFRESH_MESSAGES]: (state) => {
    state.messages = []
  },
  [REFRESH_FILES]: (state) => {
    state.files = []
  },
  [MERGE_FILES_WITH_MESSAGES]: (state) => {
    state.inspectorMessages.forEach((item) => {
      item.uid_creator = 'inspector'
      item.date_create = item.creation_date
    })

    state.files.forEach((item) => {
      item.msg = item.file_name
    })

    state.messages = [
      ...state.chatMessages,
      ...state.files,
      ...state.inspectorMessages
    ]
    state.messages.forEach((item) => {
      if (!item.date_create.includes('Z')) {
        item.date_create += 'Z'
      }
    })
    state.messages.sort((a, b) => {
      return new Date(a.date_create) - new Date(b.date_create)
    })
  },
  [TOGGLE_UPLOAD_STATUS]: (state) => {
    state.uploadStarted = !state.uploadStarted
  },
  initFileAbortController (state, controller) {
    state.fileAbortController = controller
  },
  abortFileAbortController (state) {
    if (state.fileAbortController) {
      state.fileAbortController.abort()
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
