import * as TASK from '../actions/tasks'
import { AUTH_LOGOUT } from '../actions/auth'
import { PUSH_COLOR } from '../actions/colors'
import axios from 'axios'
import { notify } from 'notiwind'

import { MESSAGES_REQUEST, REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { FILES_REQUEST, REFRESH_FILES, MERGE_FILES_WITH_MESSAGES } from '@/store/actions/taskfiles'

function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const state = {
  tasks: false,
  tags: {},
  selectedTag: null,
  subtasks: false,
  selectedTask: undefined,
  copiedTasks: {},
  status: '',
  selectedColor: null,
  project: '',
  checklist: '',
  performer: '',
  access: [],
  focus: 0,
  date: null,
  hasLoadedOnce: false,
  loadedTasks: {},
  comment: [],
  newtasks: false,
  newConfig: {
    roots: [],
    leaves: [],
    openedIcon: {
      type: 'shape',
      fill: '#6b7280',
      strokeWidth: 1,
      viewBox: '0 0 30 18',
      draw: 'M28.8855 1.11439C29.9269 2.15579 29.9269 3.84423 28.8855 4.88563L16.8855 16.8856C15.8441 17.927 14.1556 17.927 13.1142 16.8856L1.11422 4.88563C0.0728226 3.84423 0.0728226 2.15579 1.11422 1.11439C2.15562 0.0729939 3.84406 0.0729939 4.88546 1.11439L14.9998 11.2288L25.1142 1.11439C26.1556 0.0729939 27.8441 0.0729939 28.8855 1.11439Z'

    },
    closedIcon: {
      type: 'shape',
      fill: '#6b7280',
      strokeWidth: 1,
      viewBox: '0 0 18 30',
      draw: 'M1.11454 1.11439C2.15594 0.0729939 3.84438 0.0729939 4.88578 1.11439L16.8858 13.1144C17.9272 14.1558 17.9272 15.8442 16.8858 16.8856L4.88578 28.8856C3.84438 29.927 2.15594 29.927 1.11454 28.8856C0.0731465 27.8442 0.0731465 26.1558 1.11454 25.1144L11.2289 15L1.11454 4.88563C0.0731465 3.84423 0.0731465 2.15579 1.11454 1.11439Z'
    }
  }
}

const getters = {
  getTasks: state => state.navigator,
  tasksStatus: state => state.status
}

const actions = {
  [TASK.TASKS_REQUEST]: ({ commit, dispatch }, chosenDate) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      if (!chosenDate) {
        chosenDate = new Date()
      }
      if (typeof chosenDate === 'string') {
        chosenDate = new Date(chosenDate)
      }
      const month = pad2(chosenDate.getMonth() + 1)
      const day = pad2(chosenDate.getDate())
      const year = chosenDate.getFullYear()
      const formattedDate = day + '-' + month + '-' + year
      const url = 'https://web.leadertask.com/api/v1/tasks/withdate?value=' + formattedDate
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.SEARCH_TASK]: ({ commit, dispatch }, text) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/search?text=' + text
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.SEARCH_TASK,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          // dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.SUBTASKS_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      // commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withparent?value=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.SUBTASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.SUBTASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.OPENED_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/opened'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.OPENED_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.UNSORTED_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/inbox'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.UNSORTED_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.OVERDUE_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/overdue'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.OVERDUE_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.UNREAD_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/unread'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.UNREAD_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.IN_WORK_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/inwork'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.IN_WORK_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.IN_FOCUS_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/infocus'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.IN_FOCUS_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.READY_FOR_COMPLITION_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/ready'
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.DELEGATED_TASKS_REQUEST]: ({ commit, dispatch }, email) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/delegate?email=' + email
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.DELEGATED_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.DELEGATED_TO_USER_TASKS_REQUEST]: ({ commit, dispatch }, email) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/delegateme?email=' + email
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.DELEGATED_TO_USER_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.PROJECT_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/byproject?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.PROJECT_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.TAG_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withtag?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.TAG_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.COLOR_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withcolor?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.COLOR_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.EMPLOYEE_TASKS_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasks/withemp?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(TASK.TASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.EMPLOYEE_TASKS_REQUEST,
            text: err.response.data
          }, 15000)
          commit(TASK.TASKS_ERROR, err)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [TASK.CREATE_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task'
      axios({
        url: url,
        method: 'POST',
        data: data
      })
        .then(resp => {
          resp.data._justCreated = data._justCreated
          if (resp.data.uid_parent !== '00000000-0000-0000-0000-000000000000' && !data._justCreated) {
            commit(TASK.ADD_SUBTASK, resp.data)
          } else {
            commit(TASK.ADD_TASK, resp.data)
          }
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CREATE_TASK,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.SELECT_TASK]: ({ commit, dispatch }, data) => {
    if (data.readed === 0) {
      dispatch(TASK.CHANGE_TASK_READ, data.uid)
    }

    commit(REFRESH_FILES)
    commit(REFRESH_MESSAGES)
    commit(TASK.SELECT_TASK, data)

    if (data.has_msgs && !data.has_files) {
      dispatch(MESSAGES_REQUEST, data.uid)
    }
    if (data.has_files && !data.has_msgs) {
      dispatch(FILES_REQUEST, data.uid)
        .then(() => {
          commit(MERGE_FILES_WITH_MESSAGES)
        })
    }
    if (data.has_files && data.has_msgs) {
      dispatch('fetchMessagesAndFiles', data.uid)
    }
  },
  [TASK.CHANGE_TASK_READ]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/readed?uid=' + uid + '&value=1'
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.MARK_TASK_AS_READ, uid)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_READ,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_NAME]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      if (data.value === '') {
        data.value = 'Task name'
      }
      const url = 'https://web.leadertask.com/api/v1/task/name?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_NAME,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_STATUS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/status?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.CHANGE_TASK_STATUS, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_STATUS,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.REMOVE_TASK]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task?uid=' + uid
      axios({
        url: url,
        method: 'DELETE'
      })
        .then(resp => {
          commit(TASK.REMOVE_TASK, uid)
          resolve(resp)
        }).catch(err => {
          // notify({
          //   group: 'api',
          //   title: 'REST API Error, please make screenshot',
          //   action: TASK.REMOVE_TASK,
          //   text: err.response.data
          // }, 15000)
          reject(err)
        })
    })
  },
  [TASK.ADD_SUBTASK]: ({ commit }, task) => {
    return new Promise((resolve) => {
      commit(TASK.ADD_SUBTASK, task)
      resolve()
    })
  },
  [TASK.CHANGE_TASK_ACCESS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/common?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.CHANGE_TASK_ACCESS, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_ACCESS,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_COLOR]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(TASK.COLOR_TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/task/marker?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.CHANGE_TASK_COLOR, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_COLOR,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_TAGS]: ({ commit, dispatch }, data) => {
    // tags
    return new Promise((resolve, reject) => {
      if (data.tags.length === '') {
        data.tags = []
      }
      const url = 'https://web.leadertask.com/api/v1/task/tags'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          commit(TASK.CHANGE_TASK_TAGS, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_TAGS,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_PERFORMER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      if (data.value !== '') {
        data.value = null
      }
      const url = 'https://web.leadertask.com/api/v1/task/performer?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.CHANGE_TASK_PERFORMER, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_PERFORMER,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_FOCUS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(TASK.IN_FOCUS_TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/task/focus?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.CHANGE_TASK_FOCUS, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_FOCUS,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_PROJECT]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(TASK.PROJECT_TASKS_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/task/project?uid=' + data.uid + '&value=' + data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          commit(TASK.CHANGE_TASK_PROJECT, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_PROJECT,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_CHEKCLIST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/checklist'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          commit(TASK.CHANGE_TASK_CHEKCLIST, data)
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_CHEKCLIST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_COMMENT]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/comment?uid=' + data.uid
      axios({
        url: url,
        method: 'PATCH',
        data: 'comment= ' + encodeURIComponent(data.value)
      })
        .then(resp => {
          resolve(resp)
          commit(TASK.CHANGE_TASK_COMMENT, data)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_COMMENT,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_DATE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/term'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
          commit(TASK.CHANGE_TASK_DATE, data)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_DATE,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_PARENT_AND_ORDER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/task/parent?uid=' + data.uid + '&parent=' + data.parent + '&order=' + data.order
      axios({
        url: url,
        method: 'PATCH'
      })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CHANGE_TASK_PARENT_AND_ORDER,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.CREATE_TAG_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/tag'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.CREATE_TAG_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.UPDATE_TAG_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/tag'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.UPDATE_TAG_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  [TASK.REMOVE_TAG_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/tag?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: TASK.REMOVE_TAG_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  }
}

const mutations = {
  [TASK.REMOVE_TASK_FROM_LEAVES]: (state, taskUid) => {
    for (let i = 0; i < state.newConfig.leaves.length; i++) {
      if (taskUid === state.newConfig.leaves[i]) {
        state.newConfig.leaves.splice(i, 1)
      }
    }
  },
  [TASK.TASKS_REQUEST]: state => {
    state.status = 'loading'
  },
  [TASK.TASKS_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.tasks = resp.data
    state.hasLoadedOnce = true

    Object.assign(state.newtasks, {})
    Object.assign(state.newConfig, { roots: [], leaves: [], listHasChildren: false, dragAndDrop: true, keyboardNavigation: true })

    const nodes = {}
    for (const node of resp.data.tasks) {
      if (node.has_children && !state.newConfig.listHasChildren) {
        state.newConfig.listHasChildren = true
      }

      state.newConfig.roots.push(node.uid)
      if (!node.has_children) {
        state.newConfig.leaves.push(node.uid)
      }

      nodes[node.uid] = {
        info: node,
        children: node.has_children ? ['fake-uid'] : [],
        state: {
          draggable: node.type === 1
        }
      }
    }

    state.newtasks = nodes
  },
  [TASK.SUBTASKS_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.subtasks = resp.data
    state.hasLoadedOnce = true
  },
  [TASK.TASKS_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [TASK.ADD_LOADED_TASK]: (state, uid) => {
    state.loadedTasks[uid] = true
  },
  [TASK.CLEAN_UP_LOADED_TASKS]: state => {
    state.loadedTasks = {}
  },
  [TASK.SELECT_TASK]: (state, task) => {
    state.selectedTask = task
  },
  [TASK.ADD_TASK_TAGS]: (state, tags) => {
    for (const tag of tags) {
      state.tags[tag.uid] = tag
    }
  },
  [TASK.UPDATE_NEW_TASK_LIST]: (state, tasks) => {
    for (const task of tasks) {
      if (!task.has_children) {
        state.newConfig.leaves.push(task.uid)
      }
      state.newtasks[task.uid] = {
        info: task,
        children: [],
        state: { checked: false, opened: false }
      }
    }
  },
  [TASK.MARK_TASK_AS_READ]: (state, uid) => {
    state.newtasks[uid].info.readed = 1
  },
  [TASK.CHANGE_TASK_STATUS]: (state, data) => {
    state.newtasks[data.uid].info.status = data.value
  },
  [TASK.ADD_TASK]: (state, task) => {
    if (!task._justCreated) {
      state.newConfig.roots.unshift(task.uid)
    }
    task._justCreated = false
    state.newConfig.leaves.push(task.uid)
    task.type = 1
    state.newtasks[task.uid] = {
      info: task,
      // even if copy, we would copy without children
      children: [],
      state: {
        draggable: true,
        disabled: false,
        checked: false
      }
    }
  },
  [TASK.REMOVE_TASK]: (state, uid) => {
    const uidParent = state.newtasks[uid].info.uid_parent === '00000000-0000-0000-0000-000000000000' ? uid : state.newtasks[uid].info.uid_parent

    if (
      state.newtasks[uidParent].children &&
      state.newtasks[uidParent].children.length > 1
    ) {
      state.newtasks[uidParent].children = arrayRemove(
        state.newtasks[uidParent].children,
        uid
      )
      // delete last fake-uid because we don't want to show collapsing task node
      if (state.newtasks[uidParent].children.length === 1 && state.newtasks[uidParent].children[0] === 'fake-uid') {
        state.newtasks[uidParent].children = []
      }
    } else if (
      state.newtasks[uidParent].children &&
      state.newtasks[uidParent].children.length === 1 &&
      state.newtasks[uidParent].children[0] !== 'fake-uid'
    ) {
      state.newConfig.leaves.push(uidParent)
      state.newtasks[uidParent].info.has_children = false
      state.newtasks[uidParent].children = []
    }

    state.newConfig.roots = arrayRemove(state.newConfig.roots, uid)
    delete state.newtasks[uid]
  },
  [TASK.ADD_SUBTASK]: (state, task) => {
    state.newConfig.leaves.push(task.uid)
    state.newtasks[task.uid] = {
      info: task,
      children: [],
      state: {
        disabled: false,
        draggable: true
      }
    }
    if (state.newtasks[task.uid_parent].children && state.newtasks[task.uid_parent].children.length) {
      state.newtasks[task.uid_parent].children.unshift(task.uid)
    } else {
      state.newtasks[task.uid_parent].children = [task.uid]
      state.newConfig.leaves = arrayRemove(state.newConfig.leaves, task.uid_parent)
    }
    state.newtasks[task.uid_parent].state.opened = true
  },
  [TASK.SELECT_TAG]: (state, tag) => {
    state.selectedTag = tag
  },
  [TASK.CHANGE_TASK_COMMENT]: (state, data) => {
    state.comment.push(data.value)
  },
  [TASK.CHANGE_TASK_PERFORMER]: (state, data) => {
    state.performer = data.value
  },
  [TASK.COLOR_TASKS_REQUEST]: (state, color) => {
    state.selectedColor = color
  },
  [TASK.PROJECT_TASKS_REQUEST]: (state, project) => {
    state.project = project
  },
  [TASK.TAG_TASKS_REQUEST]: (state, data) => {
    state.tags = data
  },
  [TASK.CHANGE_TASK_COLOR]: (state, data) => {
    state.selectedColor = data.value
  },
  [TASK.CHANGE_TASK_PROJECT]: (state, data) => {
    state.project = data.value
  },
  [TASK.CHANGE_TASK_CHEKCLIST]: (state, data) => {
    state.checklist.push(data.value)
  },
  [TASK.CHANGE_TASK_ACCESS]: (state, data) => {
    state.access.push(data.value)
  },
  [TASK.IN_FOCUS_TASKS_REQUEST]: (state, data) => {
    state.focus = data
  },
  [TASK.CHANGE_TASK_FOCUS]: (state, data) => {
    state.focus = data.value
  },
  [TASK.CHANGE_TASK_TAGS]: (state, data) => {
    state.selectedTag = data.value
  },
  [TASK.CHANGE_TASK_DATE]: (state, data) => {
    state.date.push(data.value)
  },
  [TASK.COPY_TASK]: (state, task) => {
    state.copiedTasks[task.uid] = task
  },
  [TASK.RESET_COPY_TASK]: (state) => {
    state.copiedTasks = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
