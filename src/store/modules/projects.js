import axios from 'axios'
import * as PROJECT from '../actions/projects'
import { visitChildren } from '@/store/helpers/functions'

const state = {
  projects: {},
  selectedProject: undefined
}
const getters = {}
const getDefaultState = () => {
  return {
    projects: false,
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false,
    selectedProject: undefined
  }
}

const actions = {
  [PROJECT.CREATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_NAME]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.name = data.newProjectTitle
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_COLOR]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.color = data.newProjectColor
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_MEMBERS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.members = data.newProjectMembers
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.UPDATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.REMOVE_PROJECT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.QUIT_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/projects/exit?uid=' +
        data.uid +
        '&email=' +
        data.value
      axios({ url: url, method: 'POST' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.ADD_PROJECT_TO_FAVORITE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, { ...data, favorite: 1 })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.REMOVE_PROJECT_FROM_FAVORITE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, { ...data, favorite: 0 })
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
  [PROJECT.REMOVE_PROJECT_REQUEST]: (state, uid) => {
    visitChildren([state.projects[uid]], value => (delete state.projects[value.uid]))
    delete state.projects[uid]
  },
  [PROJECT.PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      state.projects[project.uid] = project
    }
  },
  [PROJECT.SELECT_PROJECT]: (state, project) => {
    state.selectedProject = project
  },
  [PROJECT.RESET_STATE_PROJECT]: (state) => {
    Object.assign(state, getDefaultState())
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
