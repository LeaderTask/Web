import { REFRESH_FILES } from '@/store/actions/taskfiles'
import {
  REFRESH_CHAT_MESSAGES,
  REFRESH_INSPECTOR_MESSAGES,
  // MESSAGES_REQUEST,
  // INSPECTOR_MESSAGES_REQUEST,
  REFRESH_MESSAGES
} from '@/store/actions/taskmessages'
import { visitChildren } from '@/store/helpers/functions'
import axios from 'axios'
import { PUSH_COLOR } from '../actions/colors'
import { NAVIGATOR_UPDATE_ASSIGNMENTS } from '../actions/navigator'
import * as TASK from '../actions/tasks'

const getDefaultState = () => {
  return {
    navigator: false,
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false,
    menu: []
  }
}

function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

const state = {
  doitnowAbortController: null,

  tasks: false,
  unread: '',
  today: '',
  inWork: '',
  inFocus: '',
  overdue: '',
  unsorted: '',
  ready: '',
  open: '',
  tags: {},
  selectedTag: null,
  subtasks: false,
  selectedTask: undefined,
  copiedTasks: {},
  status: '',
  daysWithTasks: [],
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
  getTasks: (state) => state.navigator,
  tasksStatus: (state) => state.status
}

const actions = {
  [TASK.TASKS_REQUEST]: ({ commit, dispatch, state }, chosenDate) => {
    commit('abortDoitnowAbortController')
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
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasks/withdate?value=' +
        formattedDate
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)

          state.today = resp.data
          state.today.title = 'Сегодня'
          state.today.link = '901841d9-0016-491d-ad66-8ee42d2b496b'

          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.DAYS_WITH_TASKS]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/navigator/calendarinfo'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.DAYS_WITH_TASKS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.ONE_TASK_REQUEST]: ({ commit, dispatch, state }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/entity?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.GET_TASK_CHILDRENS]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasks/withparent?value=' +
        uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.SEARCH_TASK]: ({ commit, dispatch }, text) => {
    if (text !== '') {
      return new Promise((resolve, reject) => {
        commit(TASK.TASKS_REQUEST)
        const url =
          process.env.VUE_APP_LEADERTASK_API +
          'api/v1/tasks/search?text=' +
          text
        axios({ url: url, method: 'GET' })
          .then((resp) => {
            commit(TASK.TASKS_SUCCESS, resp)
            commit(TASK.CLEAN_UP_LOADED_TASKS)
            if (resp.data.anothers_tags.length) {
              commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
            }
            if (resp.data.anothers_markers.length) {
              commit(PUSH_COLOR, resp.data.anothers_markers)
            }
            resolve(resp)
          })
          .catch((err) => {
            commit(TASK.TASKS_ERROR, err)
            reject(err)
          })
      })
    }
  },
  [TASK.SUBTASKS_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      // commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasks/withparent?value=' +
        taskUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.SUBTASKS_SUCCESS, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, {
            uids: state.newtasks[taskUid]?.children
          })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.OPENED_TASKS_REQUEST]: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/opened'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.OPENED_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.UNSORTED_TASKS_REQUEST]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/inbox'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.UNSORTED_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.OVERDUE_TASKS_REQUEST]: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/overdue'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.OVERDUE_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.DOITNOW_TASKS_REQUEST]: ({ commit, dispatch }) => {
    const doitnowAbortController = new AbortController()
    commit('initDoitnowAbortController', doitnowAbortController)
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const urlUnread =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/unread'
      const urlOverdue =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/overdue'
      const month = pad2(new Date().getMonth() + 1)
      const day = pad2(new Date().getDate())
      const year = new Date().getFullYear()
      const formattedDate = day + '-' + month + '-' + year
      const urlToday =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasks/withdate?value=' +
        formattedDate
      Promise.all([
        axios({
          url: urlUnread,
          method: 'GET',
          signal: doitnowAbortController.signal
        }),
        axios({
          url: urlOverdue,
          method: 'GET',
          signal: doitnowAbortController.signal
        }),
        axios({
          url: urlToday,
          method: 'GET',
          signal: doitnowAbortController.signal
        })
      ])
        .then((respAll) => {
          const unreadTasks = [...respAll[0].data.tasks]
          const overdueTasks = [...respAll[1].data.tasks].filter(
            (task) => unreadTasks.findIndex((t) => t.uid === task.uid) === -1
          )
          const todayTasks = [...respAll[2].data.tasks].filter(
            (task) =>
              unreadTasks.findIndex((t) => t.uid === task.uid) === -1 &&
              overdueTasks.findIndex((t) => t.uid === task.uid) === -1
          )
          const tasks = [...unreadTasks, ...overdueTasks, ...todayTasks]
          commit(TASK.TASKS_SUCCESS, { data: { tasks } })
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          const anothersTags = [
            ...respAll[0].data.anothers_tags,
            ...respAll[1].data.anothers_tags,
            ...respAll[2].data.anothers_tags
          ]
          if (anothersTags.length) {
            commit(TASK.ADD_TASK_TAGS, anothersTags)
          }
          const anothersMarkers = [
            ...respAll[0].data.anothers_markers,
            ...respAll[1].data.anothers_markers,
            ...respAll[2].data.anothers_markers
          ]
          if (anothersMarkers.length) {
            commit(PUSH_COLOR, anothersMarkers)
          }
          resolve([unreadTasks, overdueTasks, todayTasks])
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.UNREAD_TASKS_REQUEST]: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/unread'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.UNREAD_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.IN_WORK_TASKS_REQUEST]: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/inwork'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.IN_WORK_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.IN_FOCUS_TASKS_REQUEST]: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/infocus'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.IN_FOCUS_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.READY_FOR_COMPLITION_TASKS_REQUEST]: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/ready'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          commit(TASK.READY_FOR_COMPLITION_TASKS_REQUEST, resp)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.DELEGATED_TASKS_REQUEST]: ({ commit, dispatch, state }, email) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasks/delegate?email=' +
        email
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.DELEGATED_TO_USER_TASKS_REQUEST]: (
    { commit, dispatch, state },
    email
  ) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/tasks/delegateme?email=' +
        email
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.PROJECT_TASKS_REQUEST]: ({ commit, dispatch, state }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/byproject?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.TAG_TASKS_REQUEST]: ({ commit, dispatch, state }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/withtag?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.COLOR_TASKS_REQUEST]: ({ commit, dispatch, state }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/withcolor?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.EMPLOYEE_TASKS_REQUEST]: ({ commit, dispatch, state }, uid) => {
    return new Promise((resolve, reject) => {
      commit(TASK.TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/tasks/withemp?uid=' + uid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(TASK.TASKS_SUCCESS, resp)
          commit(TASK.CLEAN_UP_LOADED_TASKS)
          if (resp.data.anothers_tags.length) {
            commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
          }
          if (resp.data.anothers_markers.length) {
            commit(PUSH_COLOR, resp.data.anothers_markers)
          }
          dispatch(TASK.GET_INSPECTABLE_TASKS, { uids: state.newConfig.roots })
          resolve(resp)
        })
        .catch((err) => {
          commit(TASK.TASKS_ERROR, err)
          reject(err)
        })
    })
  },
  [TASK.CREATE_TASK]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/task'
      axios({
        url: url,
        method: 'POST',
        data: data
      })
        .then((resp) => {
          resp.data._justCreated = data._justCreated
          resp.data._addToList = data._addToList
          if (data._addToList) {
            if (
              resp.data.uid_parent !== '00000000-0000-0000-0000-000000000000' &&
              !data._justCreated
            ) {
              commit(TASK.PASTE_TO_SUBTASK, resp.data)
            } else {
              commit(TASK.ADD_TASK, resp.data)
            }
          }
          if (resp.data.type === 2) {
            dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
          }
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.SELECT_TASK]: ({ commit, dispatch }, data) => {
    if (data.readed === 0) {
      dispatch(TASK.CHANGE_TASK_READ, data.uid)
    }

    commit(REFRESH_FILES)
    commit(REFRESH_CHAT_MESSAGES)
    commit(REFRESH_INSPECTOR_MESSAGES)
    commit(REFRESH_MESSAGES)
    commit(TASK.SELECT_TASK, data)

    dispatch('fetchMessagesAndFiles', data.uid)
  },
  [TASK.CHANGE_TASK_READ]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/readed?uid=' +
        uid +
        '&value=1'
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.MARK_TASK_AS_READ, uid)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_NAME]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/task/name?uid=' + data.uid
      axios({
        url: url,
        method: 'PATCH',
        data: { name: data.value }
      })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_STATUS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/status?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.UPDATE_TASK, resp.data.tasks[0])
          if (resp.data.tasks[0].type === 2 || resp.data.tasks[0].type === 3) {
            dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
          }
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.REMOVE_TASK]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/task?uid=' + uid
      axios({
        url: url,
        method: 'DELETE'
      })
        .then((resp) => {
          commit(TASK.REMOVE_TASK, uid)
          //
          dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
          //
          resolve(resp)
        })
        .catch((err) => {
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
  [TASK.UPDATE_TASK]: ({ commit }, websyncObject) => {
    if (websyncObject.anothers_tags.length) {
      commit(TASK.ADD_TASK_TAGS, websyncObject.anothers_tags)
    }
    if (websyncObject.anothers_markers.length) {
      commit(PUSH_COLOR, websyncObject.anothers_markers)
    }
    commit(TASK.UPDATE_TASK, websyncObject.obj)
  },
  [TASK.CHANGE_TASK_ACCESS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/common?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.CHANGE_TASK_ACCESS, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_COLOR]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(TASK.COLOR_TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/marker?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.CHANGE_TASK_COLOR, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_TAGS]: ({ commit, dispatch }, data) => {
    // tags
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/task/tags'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_PERFORMER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/performer?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
          //
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_REDELEGATE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/redelegate?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
          //
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_FOCUS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/focus?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.CHANGE_TASK_FOCUS, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_PROJECT]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(TASK.PROJECT_TASKS_REQUEST)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/project?uid=' +
        data.uid +
        '&value=' +
        data.value
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.CHANGE_TASK_PROJECT, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_CHECKLIST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/task/checklist'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_COMMENT]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/comment?uid=' +
        data.uid
      axios({
        url: url,
        method: 'PATCH',
        data: { comment: data.value }
      })
        .then((resp) => {
          resolve(resp)
          commit(TASK.CHANGE_TASK_COMMENT, data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_DATE]: ({ commit, dispatch }, data) => {
    const dataSend = { ...data }
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/task/term'
      axios({ url: url, method: 'PATCH', data: dataSend })
        .then((resp) => {
          dataSend.is_overdue = resp.data.is_overdue
          dataSend.term = resp.data.term
          resolve(dataSend)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CHANGE_TASK_PARENT_AND_ORDER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/task/parent?uid=' +
        data.uid +
        '&parent=' +
        data.parent +
        '&order=' +
        data.order
      axios({
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(TASK.ADD_TO_LEAVES_TASKS_WITHOUT_CHILDREN)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.CREATE_TAG_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tag'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(TASK.PUSH_TAG, resp)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.UPDATE_TAG_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tag'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          commit(TASK.PUSH_TAG, resp)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.REMOVE_TAG_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tag?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  //  Повтор API
  [TASK.RESET_REPEAT_CHANGE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/taskrepeat/reset?uid=' +
        data.uid
      axios({ url: url, method: 'PATCH' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.EVERY_DAY_CHANGE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/taskrepeat/everyday?uid=' +
        data.uid
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.EVERY_WEEK_CHANGE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/taskrepeat/everyweek?uid=' +
        data.uid
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.EVERY_MONTH_CHANGE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/taskrepeat/everymonth?uid=' +
        data.uid
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.EVERY_YEAR_CHANGE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/taskrepeat/everyyear?uid=' +
        data.uid
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [TASK.GET_INSPECTABLE_TASKS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'tasksFromList'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(TASK.GET_INSPECTABLE_TASKS, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [TASK.REMOVE_TAG_REQUEST]: (state, uid) => {
    visitChildren([state.tags[uid]], (value) => delete state.tags[value.uid])
    delete state.tags[uid]
  },
  [TASK.PUSH_TAG]: (state, resp) => {
    state.tags[resp.data.uid] = resp.data
  },
  [TASK.UPDATE_TASK]: (state, task) => {
    if (state.newtasks[task.uid]) {
      state.newtasks[task.uid].info = task
    }
    if (state.selectedTask?.uid === task.uid) {
      state.selectedTask = task
    }
  },
  [TASK.DAYS_WITH_TASKS]: (state, resp) => {
    state.daysWithTasks = resp.data.calendar.dates_with_tasks
  },
  [TASK.REMOVE_TASK_FROM_LEAVES]: (state, uid) => {
    state.newConfig.leaves = state.newConfig.leaves.filter(item => item !== uid)
  },
  [TASK.ADD_TASK_TO_ROOTS]: (state, taskUid) => {
    if (!state.newConfig.roots.includes(taskUid)) {
      state.newConfig.roots.push(taskUid)
    }
  },
  [TASK.ADD_TASK_TO_LEAVES]: (state, taskUid) => {
    if (!state.newConfig.leaves.includes(taskUid)) {
      state.newConfig.leaves.push(taskUid)
    }
  },
  [TASK.REMOVE_TASK_FROM_ROOTS]: (state, taskUid) => {
    for (let i = 0; i < state.newConfig.roots.length; i++) {
      if (taskUid === state.newConfig.roots[i]) {
        state.newConfig.roots.splice(i, 1)
      }
    }
  },
  [TASK.IN_WORK_TASKS_REQUEST]: (state, resp) => {
    state.inWork = resp.data
    state.inWork.title = 'В работе'
    state.inWork.link = '2a5cae4b-e877-4339-8ca1-bd61426864ec'
  },
  [TASK.UNREAD_TASKS_REQUEST]: (state, resp) => {
    state.unread = resp.data
    state.unread.title = 'Непрочитанное'
    state.unread.link = 'fa042915-a3d2-469c-bd5a-708cf0339b89'
  },
  [TASK.TASKS_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [TASK.TASKS_SUCCESS]: (state, resp) => {
    state.status = 'success'

    state.hasLoadedOnce = true
    Object.assign(state.newtasks, {})
    Object.assign(state.newConfig, {
      roots: [],
      leaves: [],
      listHasChildren: false,
      dragAndDrop: true,
      keyboardNavigation: true
    })

    const nodes = {}
    for (const node of resp.data.tasks) {
      if (node.has_children && !state.newConfig.listHasChildren) {
        state.newConfig.listHasChildren = true
      }

      state.newConfig.roots.push(node.uid)
      if (!node.has_children) {
        state.newConfig.leaves.push(node.uid)
      }

      node._isEditable = false
      nodes[node.uid] = {
        info: node,
        children: node.has_children ? ['fake-uid'] : [],
        state: {
          draggable: [1, 2].includes(node.type)
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
  [TASK.TASKS_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [TASK.ADD_LOADED_TASK]: (state, uid) => {
    state.loadedTasks[uid] = true
  },
  [TASK.CLEAN_UP_LOADED_TASKS]: (state) => {
    state.loadedTasks = {}
  },
  [TASK.SELECT_TASK]: (state, task) => {
    if (task) console.log('select task', task)
    state.selectedTask = task
  },
  [TASK.ADD_TASK_TAGS]: (state, tags) => {
    for (const tag of tags) {
      state.tags[tag.uid] = tag
    }
  },
  [TASK.OVERDUE_TASKS_REQUEST]: (state, resp) => {
    state.overdue = resp.data
    state.overdue.title = 'Просрочено'
    state.overdue.link = '46418722-a720-4c9e-b255-16db4e590c34'
  },
  [TASK.UNSORTED_TASKS_REQUEST]: (state, resp) => {
    state.unsorted = resp.data
    state.unsorted.title = 'Неразобранное'
    state.unsorted.link = '5183b619-3968-4c3a-8d87-3190cfaab014'
  },
  [TASK.UPDATE_NEW_TASK_LIST]: (state, tasks) => {
    for (const task of tasks) {
      if (!task.has_children) {
        state.newConfig.leaves.push(task.uid)
      }
      task._isEditable = false
      state.newtasks[task.uid] = {
        info: task,
        children: [],
        state: {
          checked: false,
          opened: false,
          draggable: [1, 2].includes(task.type)
        }
      }
    }
  },
  [TASK.MARK_TASK_AS_READ]: (state, uid) => {
    if (state.newtasks[uid]) {
      state.newtasks[uid].info.readed = 1
    }
  },
  [TASK.READY_FOR_COMPLITION_TASKS_REQUEST]: (state, resp) => {
    state.ready = resp.data
    state.ready.title = 'Готово к сдаче'
    state.ready.link = 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0'
  },
  [TASK.ADD_TO_LEAVES_TASKS_WITHOUT_CHILDREN]: (state) => {
    Object.keys(state.newtasks).forEach((key) => {
      if (state.newtasks[key]?.children?.length === 0) {
        if (!state.newConfig.leaves.includes(state.newtasks[key]?.id)) {
          state.newConfig.leaves.push(state.newtasks[key]?.id)
        }
      }
    })
  },
  [TASK.ADD_TASK]: (state, task) => {
    if (state.newtasks[task.uid]) return // check if task already exist

    if (
      !task._justCreated &&
      task.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      state.newConfig.roots.unshift(task.uid)
    }

    task._justCreated = false
    task._isEditable = false

    // check if task has parent
    if (
      task.uid_parent &&
      task.uid_parent !== '00000000-0000-0000-0000-000000000000'
    ) {
      // add chevron if there are no children
      if (
        state.newtasks[task.uid_parent] &&
        state.newtasks[task.uid_parent].children &&
        state.newtasks[task.uid_parent].children.length === 0
      ) {
        state.newtasks[task.uid_parent].children.push('fake-uid')
        for (let i = 0; i < state.newConfig.leaves.length; i++) {
          if (task.uid_parent === state.newConfig.leaves[i]) {
            state.newConfig.leaves.splice(i, 1)
          }
        }
      } else if (
        state.newtasks[task.uid_parent] &&
        state.newtasks[task.uid_parent].children &&
        state.newtasks[task.uid_parent].children.length
      ) {
        // actually add a child if there are some children in it and add to newConfig
        state.newtasks[task.uid_parent].children.push(task.uid)
        state.newtasks[task.uid] = {
          info: task,
          children: [],
          state: {
            draggable: true,
            disabled: false,
            checked: false
          }
        }
        state.newConfig.leaves.push(task.uid)
      }
      return
    }

    state.newConfig.leaves.push(task.uid)

    state.newtasks[task.uid] = {
      info: task,
      children: [],
      state: {
        draggable: true,
        disabled: false,
        checked: false
      }
    }
  },
  [TASK.REMOVE_TASK]: (state, uid) => {
    if (!state.newtasks[uid]) return

    const uidParent =
      state.newtasks[uid].info.uid_parent ===
      '00000000-0000-0000-0000-000000000000'
        ? uid
        : state.newtasks[uid].info.uid_parent
    if (
      state.newtasks[uidParent] &&
      state.newtasks[uidParent].children &&
      state.newtasks[uidParent].children.length > 1
    ) {
      state.newtasks[uidParent].children = arrayRemove(
        state.newtasks[uidParent].children,
        uid
      )
      // delete last fake-uid because we don't want to show collapsing task node
      if (
        state.newtasks[uidParent].children.length === 1 &&
        state.newtasks[uidParent].children[0] === 'fake-uid'
      ) {
        state.newtasks[uidParent].children = []
      }
    } else if (
      state.newtasks[uidParent] &&
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
  [TASK.PASTE_TO_SUBTASK]: (state, task) => {
    state.newConfig.leaves.push(task.uid)
    state.newtasks[task.uid] = {
      info: task,
      children: [],
      state: {
        disabled: false,
        draggable: true
      }
    }
    // добавляем только в открытую ветку
    // потому что если ветка закрыта, то детей ее получим от
    // сервера при открытии
    if (state.newtasks[task.uid_parent].state.opened === true) {
      if (state.newtasks[task.uid_parent].children?.length) {
        state.newtasks[task.uid_parent].children.unshift(task.uid)
      } else {
        state.newtasks[task.uid_parent].children = [task.uid]
      }
    }
    state.newConfig.leaves = arrayRemove(
      state.newConfig.leaves,
      task.uid_parent
    )
    state.newtasks[task.uid_parent].state.opened = true
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
    if (
      state.newtasks[task.uid_parent].children &&
      state.newtasks[task.uid_parent].children.length
    ) {
      state.newtasks[task.uid_parent].children.unshift(task.uid)
    } else {
      state.newtasks[task.uid_parent].children = [task.uid]
      state.newConfig.leaves = arrayRemove(
        state.newConfig.leaves,
        task.uid_parent
      )
    }
    state.newtasks[task.uid_parent].state.opened = true
  },
  [TASK.ADD_TO_NEWTASKS]: (state, task) => {
    state.newtasks[task.uid] = {}
    state.newtasks[task.uid].info = {}
    state.newtasks[task.uid].info = task
  },
  [TASK.OPENED_TASKS_REQUEST]: (state, resp) => {
    state.open = resp.data
    state.open.title = 'Открытые задачи'
    state.open.link = '017a3e8c-79ac-452c-abb7-6652deecbd1c'
  },
  [TASK.SELECT_TAG]: (state, tag) => {
    state.selectedTag = tag
  },
  [TASK.RESET_STATE_TASKS]: (state) => {
    Object.assign(state, getDefaultState())
  },
  [TASK.CHANGE_TASK_COMMENT]: (state, data) => {
    state.comment.push(data.value)
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
  [TASK.CHANGE_TASK_ACCESS]: (state, data) => {
    state.access.push(data.value)
  },
  [TASK.IN_FOCUS_TASKS_REQUEST]: (state, resp) => {
    state.inFocus = resp.data
    state.inFocus.title = 'В фокусе'
    state.inFocus.link = '6fc44cc6-9d45-4052-917e-25b1189ab141'
  },
  [TASK.CHANGE_TASK_FOCUS]: (state, data) => {
    state.focus = data.value
  },
  [TASK.COPY_TASK]: (state, task) => {
    task.uid = ''
    state.copiedTasks[task.uid] = task
  },
  [TASK.RESET_COPY_TASK]: (state) => {
    state.copiedTasks = {}
  },
  [TASK.GET_INSPECTABLE_TASKS]: (state, uids) => {
    for (const uid of uids) {
      state.newtasks[uid].info.is_inspectable = true
      state.newtasks[uid].info.has_msgs = true
    }
  },
  initDoitnowAbortController (state, controller) {
    state.doitnowAbortController = controller
  },
  abortDoitnowAbortController (state) {
    if (state.doitnowAbortController) {
      state.doitnowAbortController.abort()
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
