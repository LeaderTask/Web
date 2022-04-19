import { createStore } from 'vuex'
import axios from 'axios'
import { darkModeKey } from '@/config.js'

import auth from './modules/auth'
import navigator from './modules/navigator'
import calendar from './modules/calendar'
import navbar from './modules/navbar'
import user from './modules/user'
import tasks from './modules/tasks'
import taskfilesandmessages from './modules/taskfilesandmessages'
import employees from './modules/employees'
import departments from './modules/departments'
import projects from './modules/projects'
import colors from './modules/colors'
import localization from './modules/localization'

export default createStore({
  state: {
    /* Main section state. Possible values: 'tasks', 'greed' */
    mainSectionState: 'tasks',
    greedPath: null,
    greedSource: null,
    taskListSource: null,

    navig: 0,
    isGridView: true,

    /* Properties state: (project, task, color, tag, empmloyee) */
    propertiesState: null,

    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: false,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,
    isPropertiesMobileExpanded: false,
    isPropertiesLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: []
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    /* User */
    user (state, payload) {
      if (payload.name) {
        state.userName = payload.name
      }
      if (payload.email) {
        state.userEmail = payload.email
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
    }
  },
  actions: {
    asideMobileToggle ({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded
      document.getElementById('app').classList[isShow ? 'add' : 'remove']('ml-80', 'lg:ml-0')
      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      commit('basic', {
        key: 'isAsideMobileExpanded',
        value: isShow
      })
    },

    asidePropertiesToggle ({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isPropertiesMobileExpanded
      document.getElementById('app').classList[isShow ? 'add' : 'remove']('mr-96')
      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      commit('basic', {
        key: 'isPropertiesMobileExpanded',
        value: isShow
      })
    },

    asideLgToggle ({ commit, state }, payload = null) {
      commit('basic', { key: 'isAsideLgActive', value: payload !== null ? payload : !state.isAsideLgActive })
    },

    fullScreenToggle ({ commit, state }, value) {
      commit('basic', { key: 'isFullScreen', value })

      document.documentElement.classList[value ? 'add' : 'remove']('full-screen')
    },

    darkMode ({ commit, state }) {
      const value = !state.darkMode

      document.documentElement.classList[value ? 'add' : 'remove']('dark')

      localStorage.setItem(darkModeKey, value ? '1' : '0')

      commit('basic', {
        key: 'darkMode',
        value
      })
    },

    fetch ({ commit }, payload) {
      axios
        .get(`data-sources/${payload}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            commit('basic', {
              key: payload,
              value: r.data.data
            })
          }
        })
        .catch(error => {
          alert(error.message)
        })
    }
  },
  modules: {
    auth,
    navigator,
    calendar,
    user,
    tasks,
    navbar,
    taskfilesandmessages,
    employees,
    departments,
    projects,
    colors,
    localization
  }
})
