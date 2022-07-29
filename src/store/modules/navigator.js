import axios from 'axios'
import { PUSH_BOARD } from '../actions/boards'
import { PUSH_COLOR, PUSH_MYCOLOR } from '../actions/colors'
import { PUSH_DEPARTMENT } from '../actions/departments'
import { PUSH_EMPLOYEE, PUSH_EMPLOYEE_BY_EMAIL } from '../actions/employees'
import {
  NAVIGATOR_CHANGE_EMPLOYEE_DEPARTMENT,
  NAVIGATOR_ERROR,
  NAVIGATOR_PUSH_BOARD,
  NAVIGATOR_PUSH_COLOR,
  NAVIGATOR_PUSH_DEPARTAMENT,
  NAVIGATOR_PUSH_EMPLOYEE,
  NAVIGATOR_PUSH_PROJECT,
  NAVIGATOR_PUSH_REGLAMENT,
  NAVIGATOR_PUSH_TAG,
  NAVIGATOR_REMOVE_BOARD,
  NAVIGATOR_REMOVE_COLOR,
  NAVIGATOR_REMOVE_DEPARTAMENT,
  NAVIGATOR_REMOVE_EMPLOYEE,
  NAVIGATOR_REMOVE_PROJECT,
  NAVIGATOR_REMOVE_REGLAMENT,
  NAVIGATOR_REMOVE_TAG,
  NAVIGATOR_REQUEST,
  NAVIGATOR_SUCCESS,
  NAVIGATOR_UPDATE_ASSIGNMENTS,
  NAVIGATOR_UPDATE_DEPARTMENT,
  NAVIGATOR_UPDATE_EMPLOYEE,
  NAVIGATOR_UPDATE_REGLAMENT,
  PATCH_SETTINGS,
  PATCH_SETTINGS_SUCCESS,
  RESET_STATE_NAVIGATOR
} from '../actions/navigator'
import { PUSH_PROJECT } from '../actions/projects'
import { ADD_TASK_TAGS } from '../actions/tasks'
import { visitChildren } from '../helpers/functions'

const getDefaultState = () => {
  return {
    navigator: false,
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false,
    menu: []
  }
}

function getAllMembersByDepartmentUID (emps, departmentUID) {
  const employeesStuck = []
  for (const employee of emps) {
    if (employee.uid_dep === departmentUID) {
      employeesStuck.push(employee)
    }
  }
  return employeesStuck
}

const state = getDefaultState()

const getters = {
  getNavigator: (state) => state.navigator,
  navigatorStatus: (state) => state.status
}

const actions = {
  [NAVIGATOR_REQUEST]: ({ commit, dispatch, rootState }) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/navigator/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resp.rootState = rootState

          if (resp.data.delegate_iam) {
            for (const dm of resp.data.delegate_iam.items) {
              dm.parentID = resp.data.delegate_iam.uid
            }
          }
          if (resp.data.delegate_to_me) {
            for (const dt of resp.data.delegate_to_me.items) {
              dt.parentID = resp.data.delegate_to_me.uid
            }
          }
          if (resp.data.emps.items) {
            for (const employee of resp.data.emps.items) {
              employee.parentID = resp.data.emps.uid
              commit(PUSH_EMPLOYEE, employee)
              commit(PUSH_EMPLOYEE_BY_EMAIL, employee)
            }
          }
          commit(NAVIGATOR_SUCCESS, resp)
          // TODO: we are doing the same thing 3 times, DRY
          // process colors in shared vuex storage
          if (resp.data.colors.items) {
            commit(PUSH_COLOR, resp.data.colors.items)
            commit(PUSH_MYCOLOR, resp.data.colors.items)
            visitChildren(resp.data.colors.items, (value) => {
              value.parentID = resp.data.colors.uid
            })
          }
          // process private projects then put them in shared vuex storage
          if (resp.data.private_projects.items) {
            const myPrivateProjects = []
            visitChildren(resp.data.private_projects.items, (value) => {
              value.global_property_uid = resp.data.private_projects.uid
              myPrivateProjects.push(value)
            })
            commit(PUSH_PROJECT, myPrivateProjects)
          }
          // process shared projects then put them in shared vuex storage
          if (resp.data.common_projects.items) {
            const myCommonProjects = []
            visitChildren(resp.data.common_projects.items, (value) => {
              value.global_property_uid = resp.data.common_projects.uid
              myCommonProjects.push(value)
            })
            commit(PUSH_PROJECT, myCommonProjects)
          }

          if (resp.data.private_boards.items) {
            const myPrivateBoards = []
            visitChildren(resp.data.private_boards.items, (value) => {
              value.global_property_uid = resp.data.private_boards.uid
              myPrivateBoards.push(value)
            })
            commit(PUSH_BOARD, myPrivateBoards)
          }
          if (resp.data.common_projects.items) {
            const myCommonBoards = []
            visitChildren(resp.data.common_boards.items, (value) => {
              value.global_property_uid = resp.data.common_boards.uid
              myCommonBoards.push(value)
            })
            commit(PUSH_BOARD, myCommonBoards)
          }
          if (resp.data.deps.items) {
            for (const department of resp.data.deps.items) {
              commit(PUSH_DEPARTMENT, department)
            }
          }
          // process tags then put them in shared vuex storage
          if (resp.data.tags.items) {
            const myTags = []
            visitChildren(resp.data.tags.items, (value) => {
              // TODO: how to remove children without hurt actual data?
              value.global_property_uid = resp.data.tags.uid
              myTags.push(value)
            })
            commit(ADD_TASK_TAGS, myTags)
          }
          dispatch('setDots', resp.data.calendar.dates_with_tasks)
          resolve(resp)
        })
        .catch((err) => {
          commit(NAVIGATOR_ERROR, err)
          reject(err)
        })
    })
  },
  [PATCH_SETTINGS]: ({ commit, dispatch }, settings) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/settings/all'
      axios({ url: url, method: 'PATCH', data: settings })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [NAVIGATOR_UPDATE_EMPLOYEE]: ({ commit, dispatch }, employee) => {
    commit(NAVIGATOR_UPDATE_EMPLOYEE, employee)
    commit(PUSH_EMPLOYEE, employee)
    commit(PUSH_EMPLOYEE_BY_EMAIL, employee)
  },
  [NAVIGATOR_UPDATE_ASSIGNMENTS]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/navigator/assignments'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          if (resp.data.delegate_iam) {
            for (const dm of resp.data.delegate_iam.items) {
              dm.parentID = resp.data.delegate_iam.uid
            }
          }
          if (resp.data.delegate_to_me) {
            for (const dt of resp.data.delegate_to_me.items) {
              dt.parentID = resp.data.delegate_to_me.uid
            }
          }
          commit(NAVIGATOR_UPDATE_ASSIGNMENTS, resp)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [NAVIGATOR_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [NAVIGATOR_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true

    console.log('navigator ', resp)

    state.menu = []
    state.menu.push([
      {
        label: 'Очередь',
        uid: '2cf6b167-6506-4b05-bc34-70a8d88e3b25',
        bold: 0,
        icon: 'M5 6.89471C5 6.65742 5.08975 6.42985 5.2495 6.26206C5.40925 6.09426 5.62593 6 5.85185 6H22.5926C22.8185 6 23.0352 6.09426 23.1949 6.26206C23.3547 6.42985 23.4444 6.65742 23.4444 6.89471C23.4444 7.13201 23.3547 7.35958 23.1949 7.52737C23.0352 7.69517 22.8185 7.78943 22.5926 7.78943H5.85185C5.62593 7.78943 5.40925 7.69517 5.2495 7.52737C5.08975 7.35958 5 7.13201 5 6.89471ZM14.0741 13.1577H5.85185C5.62593 13.1577 5.40925 13.252 5.2495 13.4198C5.08975 13.5876 5 13.8151 5 14.0524C5 14.2897 5.08975 14.5173 5.2495 14.6851C5.40925 14.8529 5.62593 14.9471 5.85185 14.9471H14.0741C14.3 14.9471 14.5167 14.8529 14.6764 14.6851C14.8362 14.5173 14.9259 14.2897 14.9259 14.0524C14.9259 13.8151 14.8362 13.5876 14.6764 13.4198C14.5167 13.252 14.3 13.1577 14.0741 13.1577ZM14.0741 20.3154H5.85185C5.62593 20.3154 5.40925 20.4097 5.2495 20.5775C5.08975 20.7453 5 20.9729 5 21.2102C5 21.4474 5.08975 21.675 5.2495 21.8428C5.40925 22.0106 5.62593 22.1049 5.85185 22.1049H14.0741C14.3 22.1049 14.5167 22.0106 14.6764 21.8428C14.8362 21.675 14.9259 21.4474 14.9259 21.2102C14.9259 20.9729 14.8362 20.7453 14.6764 20.5775C14.5167 20.4097 14.3 20.3154 14.0741 20.3154ZM26 17.6313C26.0009 17.784 25.964 17.9343 25.8931 18.0676C25.8222 18.2009 25.7196 18.3126 25.5954 18.3918L18.7805 22.8654C18.6517 22.9494 18.5038 22.9958 18.3522 22.9997C18.2006 23.0037 18.0507 22.965 17.918 22.8877C17.7862 22.8091 17.6764 22.6953 17.5997 22.5578C17.5231 22.4204 17.4823 22.2642 17.4815 22.1049V13.1577C17.4816 12.9985 17.5222 12.8423 17.5991 12.7051C17.6759 12.5679 17.7862 12.4547 17.9186 12.3772C18.051 12.2997 18.2006 12.2607 18.3522 12.2642C18.5037 12.2677 18.6516 12.3136 18.7805 12.3972L25.5954 16.8708C25.7196 16.95 25.8222 17.0617 25.8931 17.195C25.964 17.3283 26.0009 17.4786 26 17.6313ZM23.5403 17.6313L19.1852 14.7682V20.4944L23.5403 17.6313Z',
        width: 30,
        height: 30,
        iconBox: '0 0 30 30',
        type: 'uid',
        iconBackgroundClass: ''
      }
    ])
    state.menu.push([
      {
        label: 'Сегодня',
        uid: resp.data.tasks.items[0].uid,
        bold: resp.data.tasks.items[0].bold,
        icon: 'M8.69787 4.46611C8.69787 3.91238 9.14675 3.4635 9.70047 3.4635C10.2542 3.4635 10.7031 3.91238 10.7031 4.46611V5.18226H19.2969V4.46611C19.2969 3.91238 19.7457 3.4635 20.2995 3.4635C20.8532 3.4635 21.3021 3.91238 21.3021 4.46611V5.18226H23.0208C24.2865 5.18226 25.3125 6.20827 25.3125 7.47393V22.3698C25.3125 23.6355 24.2865 24.6615 23.0208 24.6615H6.97911C5.71346 24.6615 4.68744 23.6355 4.68744 22.3698V7.47393C4.68744 6.20827 5.71346 5.18226 6.97911 5.18226H8.69787V4.46611ZM19.2969 6.75778V7.90362C19.2969 8.45734 19.7457 8.90622 20.2995 8.90622C20.8532 8.90622 21.3021 8.45734 21.3021 7.90362V6.75778H23.0208C23.4163 6.75778 23.737 7.07841 23.737 7.47393V22.3698C23.737 22.7653 23.4163 23.086 23.0208 23.086H6.97911C6.58359 23.086 6.26296 22.7653 6.26296 22.3698V7.47393C6.26296 7.07841 6.58359 6.75778 6.97911 6.75778H8.69787V7.90362C8.69787 8.45734 9.14675 8.90622 9.70047 8.90622C10.2542 8.90622 10.7031 8.45734 10.7031 7.90362V6.75778H19.2969ZM9.61999 10.8333C8.90944 10.8333 8.33344 11.4224 8.33344 12.1491C8.33344 12.8758 8.90944 13.4649 9.61999 13.4649C10.3305 13.4649 10.9065 12.8758 10.9065 12.1491C10.9065 11.4224 10.3305 10.8333 9.61999 10.8333ZM15.4913 12.1491C15.4913 11.4224 16.0673 10.8333 16.7779 10.8333C17.4884 10.8333 18.0644 11.4224 18.0644 12.1491C18.0644 12.8758 17.4884 13.4649 16.7779 13.4649C16.0673 13.4649 15.4913 12.8758 15.4913 12.1491ZM15.4913 15.8333C15.4913 15.1066 16.0673 14.5175 16.7779 14.5175C17.4884 14.5175 18.0644 15.1066 18.0644 15.8333C18.0644 16.56 17.4884 17.1491 16.7779 17.1491C16.0673 17.1491 15.4913 16.56 15.4913 15.8333ZM15.4913 19.5175C15.4913 18.7908 16.0673 18.2017 16.7779 18.2017C17.4884 18.2017 18.0644 18.7908 18.0644 19.5175C18.0644 20.2442 17.4884 20.8333 16.7779 20.8333C16.0673 20.8333 15.4913 20.2442 15.4913 19.5175ZM19.0937 12.1491C19.0937 11.4224 19.6697 10.8333 20.3802 10.8333C21.0908 10.8333 21.6668 11.4224 21.6668 12.1491C21.6668 12.8758 21.0908 13.4649 20.3802 13.4649C19.6697 13.4649 19.0937 12.8758 19.0937 12.1491ZM19.0937 15.8333C19.0937 15.1066 19.6697 14.5175 20.3802 14.5175C21.0908 14.5175 21.6668 15.1066 21.6668 15.8333C21.6668 16.56 21.0908 17.1491 20.3802 17.1491C19.6697 17.1491 19.0937 16.56 19.0937 15.8333ZM19.0937 19.5175C19.0937 18.7908 19.6697 18.2017 20.3802 18.2017C21.0908 18.2017 21.6668 18.7908 21.6668 19.5175C21.6668 20.2442 21.0908 20.8333 20.3802 20.8333C19.6697 20.8333 19.0937 20.2442 19.0937 19.5175ZM8.33344 15.8333C8.33344 15.1066 8.90944 14.5175 9.61999 14.5175C10.3305 14.5175 10.9065 15.1066 10.9065 15.8333C10.9065 16.56 10.3305 17.1491 9.61999 17.1491C8.90944 17.1491 8.33344 16.56 8.33344 15.8333ZM8.33344 19.5175C8.33344 18.7908 8.90944 18.2017 9.61999 18.2017C10.3305 18.2017 10.9065 18.7908 10.9065 19.5175C10.9065 20.2442 10.3305 20.8333 9.61999 20.8333C8.90944 20.8333 8.33344 20.2442 8.33344 19.5175ZM11.9358 12.1491C11.9358 11.4224 12.5118 10.8333 13.2223 10.8333C13.9329 10.8333 14.5089 11.4224 14.5089 12.1491C14.5089 12.8758 13.9329 13.4649 13.2223 13.4649C12.5118 13.4649 11.9358 12.8758 11.9358 12.1491ZM11.9358 15.8333C11.9358 15.1066 12.5118 14.5175 13.2223 14.5175C13.9329 14.5175 14.5089 15.1066 14.5089 15.8333C14.5089 16.56 13.9329 17.1491 13.2223 17.1491C12.5118 17.1491 11.9358 16.56 11.9358 15.8333ZM11.9358 19.5175C11.9358 18.7908 12.5118 18.2017 13.2223 18.2017C13.9329 18.2017 14.5089 18.7908 14.5089 19.5175C14.5089 20.2442 13.9329 20.8333 13.2223 20.8333C12.5118 20.8333 11.9358 20.2442 11.9358 19.5175Z',
        width: 30,
        height: 30,
        iconBox: '0 0 30 30',
        type: 'uid',
        iconBackgroundClass: ''
      }
    ])
    // state.menu.push('separator')
    state.menu.push([
      {
        label: 'Поручения',
        uid: resp.data.delegate_iam.uid,
        bold: false,
        icon: 'M14.5889 5.83335C12.5446 5.83335 10.8874 7.49059 10.8874 9.5349C10.8874 11.5792 12.5446 13.2364 14.5889 13.2364C16.6332 13.2364 18.2905 11.5792 18.2905 9.5349C18.2905 7.49059 16.6332 5.83335 14.5889 5.83335ZM9.2207 9.5349C9.2207 6.57012 11.6241 4.16669 14.5889 4.16669C17.5537 4.16669 19.9571 6.57012 19.9571 9.5349C19.9571 12.4997 17.5537 14.9031 14.5889 14.9031C11.6241 14.9031 9.2207 12.4997 9.2207 9.5349ZM9.7352 16.7169C9.27499 16.7168 8.83057 16.8847 8.48551 17.1892C8.14047 17.4937 7.91855 17.9138 7.86146 18.3704L7.50774 21.2038C7.4905 21.3417 7.50279 21.4819 7.54382 21.6148C7.58485 21.7477 7.65367 21.8703 7.74571 21.9745C7.83776 22.0788 7.95092 22.1622 8.07769 22.2194C8.20446 22.2766 8.34193 22.3061 8.48099 22.3061H19.1236C19.5839 22.3061 19.957 22.6792 19.957 23.1394C19.957 23.5996 19.5839 23.9727 19.1236 23.9727H8.48136C8.10601 23.9728 7.73476 23.893 7.39259 23.7387C7.05036 23.5844 6.74487 23.3591 6.49639 23.0777C6.24791 22.7963 6.06212 22.4652 5.95135 22.1066C5.8406 21.7479 5.80738 21.3698 5.85391 20.9973L6.20764 18.1639C6.31509 17.304 6.73299 16.5129 7.38272 15.9396C8.03238 15.3663 8.86908 15.05 9.73552 15.0503H10.0539C10.5141 15.0503 10.8872 15.4234 10.8872 15.8836C10.8872 16.3438 10.5141 16.7169 10.0539 16.7169H9.7352ZM17.5317 17.1389C17.0541 17.1389 16.667 17.4872 16.667 17.9167C16.667 18.3463 17.0541 18.6945 17.5317 18.6945H22.7105L21.8637 19.5324C21.5424 19.8502 21.5685 20.3422 21.9218 20.6311C22.2752 20.92 22.822 20.8966 23.1432 20.5788L25.8337 17.9167L23.1432 15.2546C22.822 14.9368 22.2752 14.9134 21.9218 15.2023C21.5685 15.4913 21.5424 15.9832 21.8637 16.301L22.7105 17.1389H17.5317Z',
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'new_delegate',
        iconBackgroundClass: ''
      }
    ])
    // state.menu.push('separator')
    state.menu.push([
      {
        label: 'Проекты',
        uid: resp.data.private_projects.uid,
        bold: false,
        icon: 'M23.8818 9.48613V8.39669C23.8818 7.38613 23.0651 6.56289 22.0625 6.56289H14.565L14.3401 6.18824C14.2031 5.97134 13.9635 5.83331 13.7092 5.83331H8.15332C7.15073 5.83331 6.33398 6.65655 6.33398 7.66712V21.4995C6.33398 22.5101 7.15073 23.3333 8.15332 23.3333H23.6813C24.6839 23.3333 25.5006 22.5101 25.5006 21.4995V11.3101C25.5055 10.3636 24.7915 9.58472 23.8818 9.48613ZM7.81097 7.66712C7.81097 7.47486 7.96748 7.31712 8.15821 7.31712H13.2983L15.2937 10.6002C15.4258 10.8171 15.6654 10.9551 15.9246 10.9551H23.6911C23.8818 10.9551 24.0383 11.1129 24.0383 11.3051V21.4995C24.0383 21.6918 23.8818 21.8495 23.6911 21.8495H8.15332C7.96259 21.8495 7.80608 21.6918 7.80608 21.4995V7.66712H7.81097ZM22.4048 9.47134H16.3306L15.4649 8.04669H22.0576C22.2483 8.04669 22.4048 8.20444 22.4048 8.39669V9.47134Z',
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'new_private_projects',
        iconBackgroundClass: ''
      }
    ])
    state.menu.push([
      {
        label: 'Регламенты',
        uid: '92413f6c-2ef3-476e-9429-e76d7818685d', // reglaments uuid
        bold: false,
        icon: 'M 22.082031 6.183594 L 16.820312 0.921875 C 16.664062 0.765625 16.433594 0.664062 16.199219 0.664062 C 15.96875 0.664062 15.738281 0.765625 15.582031 0.921875 L 12.871094 3.628906 C 12.535156 3.964844 12.535156 4.535156 12.871094 4.867188 L 12.898438 4.894531 L 6.113281 8.273438 C 5.933594 8.378906 5.777344 8.53125 5.699219 8.738281 L 0.746094 21.125 C 0.746094 21.148438 0.71875 21.175781 0.71875 21.203125 C 0.695312 21.253906 0.667969 21.304688 0.667969 21.355469 C 0.640625 21.589844 0.71875 21.820312 0.875 22 C 1.03125 22.234375 1.289062 22.335938 1.546875 22.335938 C 1.597656 22.335938 1.648438 22.335938 1.699219 22.3125 C 1.726562 22.3125 1.753906 22.3125 1.777344 22.285156 C 1.804688 22.285156 1.828125 22.257812 1.855469 22.257812 L 14.238281 17.304688 C 14.445312 17.226562 14.601562 17.074219 14.703125 16.890625 L 18.085938 10.105469 L 18.109375 10.132812 C 18.265625 10.289062 18.496094 10.390625 18.730469 10.390625 C 18.960938 10.390625 19.195312 10.289062 19.347656 10.132812 L 22.082031 7.421875 C 22.417969 7.089844 22.417969 6.519531 22.082031 6.183594 Z M 9.855469 12.789062 C 9.855469 12.582031 10.007812 12.429688 10.214844 12.429688 C 10.421875 12.429688 10.574219 12.582031 10.574219 12.789062 C 10.574219 12.996094 10.421875 13.152344 10.214844 13.152344 C 10.007812 13.152344 9.855469 12.96875 9.855469 12.789062 Z M 5.183594 19.058594 L 9.464844 14.777344 C 9.699219 14.855469 9.957031 14.90625 10.214844 14.90625 C 11.375 14.90625 12.332031 13.949219 12.332031 12.789062 C 12.332031 11.628906 11.375 10.675781 10.214844 10.675781 C 9.054688 10.675781 8.097656 11.628906 8.097656 12.789062 C 8.097656 13.046875 8.152344 13.304688 8.226562 13.539062 L 3.945312 17.820312 L 7.195312 9.695312 L 14.1875 6.183594 L 16.792969 8.789062 L 13.3125 15.808594 Z M 14.730469 4.25 L 16.199219 2.777344 L 20.226562 6.804688 L 18.753906 8.273438 Z M 14.730469 4.25',
        iconBox: '0 0 23 23',
        width: 20,
        height: 20,
        type: 'greed',
        path: 'reglaments',
        iconBackgroundClass: 'm-[5px]'
      }
    ])
    state.menu.push([
      {
        label: 'Доски',
        uid: resp.data.private_boards.uid,
        bold: false,
        icon: 'M6.5 24.9694C5.67347 24.9694 5 24.3061 5 23.4898V8.85714C5 8.04082 5.67347 7.37755 6.5 7.37755H10.102V6.32653C10.102 5.96939 10.3878 5.68367 10.7449 5.68367H12.7347L12.7857 5.55102C13.1122 4.62245 14.0102 4 15 4C15.9898 4 16.8878 4.62245 17.2143 5.55102L17.2653 5.68367H19.2551C19.6122 5.68367 19.898 5.96939 19.898 6.32653V7.37755H23.5C24.3265 7.37755 25 8.04082 25 8.85714V23.4898C25 24.3061 24.3265 24.9694 23.5 24.9694H6.5ZM6.29592 23.6939H23.7143V8.65306H19.898V9.70408C19.898 10.0612 19.6122 10.3469 19.2551 10.3469H10.7449C10.3878 10.3469 10.102 10.0612 10.102 9.70408V8.65306H6.29592V23.6939ZM11.398 9.06122H18.6122V6.96939H16.7041C16.3469 6.96939 16.0612 6.68367 16.0612 6.32653C16.0612 5.7449 15.5918 5.27551 15.0102 5.27551C14.4286 5.27551 13.949 5.7449 13.949 6.32653C13.949 6.68367 13.6633 6.96939 13.3061 6.96939H11.398V9.06122ZM19.1327 20.3571C18.7041 20.3571 18.3673 20.0102 18.3673 19.5918V18.6224C18.3673 18.1939 18.7143 17.8571 19.1327 17.8571H21.3163C21.7449 17.8571 22.0816 18.2041 22.0816 18.6224V19.5918C22.0816 20.0204 21.7347 20.3571 21.3163 20.3571H19.1327ZM14.0306 20.3571C13.6122 20.3571 13.2653 20.0102 13.2653 19.5918V18.6224C13.2653 18.1939 13.6122 17.8571 14.0306 17.8571H16.2143C16.6429 17.8571 16.9796 18.2041 16.9796 18.6224V19.5918C16.9796 20.0204 16.6327 20.3571 16.2143 20.3571H14.0306ZM8.68367 20.3571C8.2551 20.3571 7.91837 20.0102 7.91837 19.5918V18.6224C7.91837 18.1939 8.26531 17.8571 8.68367 17.8571H10.8673C11.2857 17.8571 11.6327 18.2041 11.6327 18.6224V19.5918C11.6327 20.0204 11.2857 20.3571 10.8673 20.3571H8.68367ZM19.1327 15.5C18.7041 15.5 18.3673 15.1531 18.3673 14.7347V13.7551C18.3673 13.3367 18.7143 12.9898 19.1327 12.9898H21.3163C21.7449 12.9898 22.0816 13.3367 22.0816 13.7551V14.7245C22.0816 15.1429 21.7347 15.4898 21.3163 15.4898H19.1327V15.5ZM14.0306 15.5C13.6122 15.5 13.2653 15.1531 13.2653 14.7347V13.7551C13.2653 13.3367 13.6122 12.9898 14.0306 12.9898H16.2143C16.6429 12.9898 16.9796 13.3367 16.9796 13.7551V14.7245C16.9796 15.1429 16.6327 15.4898 16.2143 15.4898H14.0306V15.5ZM8.68367 15.5C8.2551 15.5 7.91837 15.1531 7.91837 14.7347V13.7551C7.91837 13.3367 8.26531 12.9898 8.68367 12.9898H10.8673C11.2857 12.9898 11.6327 13.3367 11.6327 13.7551V14.7245C11.6327 15.1429 11.2857 15.4898 10.8673 15.4898H8.68367V15.5Z',
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'new_private_boards',
        iconBackgroundClass: ''
      }
    ])
    // state.menu.push('separator')
    state.menu.push([
      {
        label: 'Сотрудники',
        uid: resp.data.emps.uid,
        bold: false,
        type: 'greed',
        path: 'new_emps',
        icon: 'M14.9998 6.54762C14.5894 6.54762 14.1957 6.71067 13.9055 7.00091C13.6153 7.29114 13.4522 7.68478 13.4522 8.09524C13.4522 8.50569 13.6153 8.89933 13.9055 9.18957C14.1957 9.4798 14.5894 9.64286 14.9998 9.64286C15.4103 9.64286 15.8039 9.4798 16.0942 9.18957C16.3844 8.89933 16.5475 8.50569 16.5475 8.09524C16.5475 7.68478 16.3844 7.29114 16.0942 7.00091C15.8039 6.71067 15.4103 6.54762 14.9998 6.54762ZM11.9046 8.09524C11.9046 7.27433 12.2307 6.48704 12.8112 5.90657C13.3916 5.3261 14.1789 5 14.9998 5C15.8207 5 16.608 5.3261 17.1885 5.90657C17.769 6.48704 18.0951 7.27433 18.0951 8.09524C18.0951 8.91615 17.769 9.70343 17.1885 10.2839C16.608 10.8644 15.8207 11.1905 14.9998 11.1905C14.1789 11.1905 13.3916 10.8644 12.8112 10.2839C12.2307 9.70343 11.9046 8.91615 11.9046 8.09524ZM22.351 7.32143C22.0432 7.32143 21.748 7.44372 21.5303 7.66139C21.3126 7.87907 21.1903 8.1743 21.1903 8.48214C21.1903 8.78998 21.3126 9.08522 21.5303 9.30289C21.748 9.52057 22.0432 9.64286 22.351 9.64286C22.6589 9.64286 22.9541 9.52057 23.1718 9.30289C23.3895 9.08522 23.5117 8.78998 23.5117 8.48214C23.5117 8.1743 23.3895 7.87907 23.1718 7.66139C22.9541 7.44372 22.6589 7.32143 22.351 7.32143ZM19.6427 8.48214C19.6427 8.12648 19.7127 7.7743 19.8489 7.44571C19.985 7.11712 20.1845 6.81855 20.4359 6.56706C20.6874 6.31557 20.986 6.11608 21.3146 5.97997C21.6432 5.84386 21.9954 5.77381 22.351 5.77381C22.7067 5.77381 23.0589 5.84386 23.3875 5.97997C23.7161 6.11608 24.0146 6.31557 24.2661 6.56706C24.5176 6.81855 24.7171 7.11712 24.8532 7.44571C24.9893 7.7743 25.0594 8.12648 25.0594 8.48214C25.0594 9.20044 24.774 9.88931 24.2661 10.3972C23.7582 10.9051 23.0693 11.1905 22.351 11.1905C21.6327 11.1905 20.9439 10.9051 20.4359 10.3972C19.928 9.88931 19.6427 9.20044 19.6427 8.48214ZM6.48793 8.48214C6.48793 8.1743 6.61022 7.87907 6.8279 7.66139C7.04557 7.44372 7.34081 7.32143 7.64865 7.32143C7.95649 7.32143 8.25172 7.44372 8.4694 7.66139C8.68707 7.87907 8.80936 8.1743 8.80936 8.48214C8.80936 8.78998 8.68707 9.08522 8.4694 9.30289C8.25172 9.52057 7.95649 9.64286 7.64865 9.64286C7.34081 9.64286 7.04557 9.52057 6.8279 9.30289C6.61022 9.08522 6.48793 8.78998 6.48793 8.48214ZM7.64865 5.77381C6.93035 5.77381 6.24148 6.05915 5.73357 6.56706C5.22566 7.07497 4.94031 7.76385 4.94031 8.48214C4.94031 9.20044 5.22566 9.88931 5.73357 10.3972C6.24148 10.9051 6.93035 11.1905 7.64865 11.1905C8.36694 11.1905 9.05582 10.9051 9.56373 10.3972C10.0716 9.88931 10.357 9.20044 10.357 8.48214C10.357 7.76385 10.0716 7.07497 9.56373 6.56706C9.05582 6.05915 8.36694 5.77381 7.64865 5.77381ZM9.31311 21.6408C8.96314 21.8714 8.55724 22.0031 8.1385 22.0217C7.71975 22.0402 7.30379 21.9451 6.93475 21.7463C6.56572 21.5476 6.25738 21.2526 6.04247 20.8927C5.82756 20.5329 5.7141 20.1215 5.71412 19.7024V14.6726C5.71412 14.57 5.75489 14.4716 5.82745 14.399C5.9 14.3265 5.99841 14.2857 6.10103 14.2857H9.22025C9.29083 13.7191 9.51748 13.1833 9.8749 12.7381H6.10103C5.58796 12.7381 5.09591 12.9419 4.73311 13.3047C4.37032 13.6675 4.1665 14.1596 4.1665 14.6726V19.7024C4.1663 20.3687 4.33818 21.0237 4.66549 21.6041C4.99279 22.1845 5.46443 22.6705 6.03472 23.0151C6.60501 23.3596 7.25461 23.5511 7.92062 23.5709C8.58663 23.5907 9.24646 23.4381 9.83621 23.128C9.59452 22.6586 9.41851 22.1582 9.31311 21.6408ZM20.1635 23.128C20.7532 23.4381 21.413 23.5907 22.0791 23.5709C22.7451 23.5511 23.3947 23.3596 23.965 23.0151C24.5352 22.6705 25.0069 22.1845 25.3342 21.6041C25.6615 21.0237 25.8334 20.3687 25.8332 19.7024V14.6726C25.8332 14.1596 25.6294 13.6675 25.2666 13.3047C24.9038 12.9419 24.4117 12.7381 23.8986 12.7381H20.1248C20.4819 13.1835 20.7085 13.7192 20.7794 14.2857H23.8986C24.0013 14.2857 24.0997 14.3265 24.1722 14.399C24.2448 14.4716 24.2856 14.57 24.2856 14.6726V19.7024C24.2856 20.1215 24.1721 20.5329 23.9572 20.8927C23.7423 21.2526 23.434 21.5476 23.0649 21.7463C22.6959 21.9451 22.2799 22.0402 21.8612 22.0217C21.4424 22.0031 21.0365 21.8714 20.6866 21.6408C20.5812 22.1581 20.4051 22.6586 20.1635 23.128ZM12.2915 12.7381C11.7784 12.7381 11.2864 12.9419 10.9236 13.3047C10.5608 13.6675 10.357 14.1596 10.357 14.6726V20.4762C10.357 21.7076 10.8461 22.8885 11.7168 23.7592C12.5875 24.6299 13.7685 25.119 14.9998 25.119C16.2312 25.119 17.4121 24.6299 18.2828 23.7592C19.1535 22.8885 19.6427 21.7076 19.6427 20.4762V14.6726C19.6427 14.1596 19.4389 13.6675 19.0761 13.3047C18.7133 12.9419 18.2212 12.7381 17.7082 12.7381H12.2915ZM11.9046 14.6726C11.9046 14.57 11.9454 14.4716 12.0179 14.399C12.0905 14.3265 12.1889 14.2857 12.2915 14.2857H17.7082C17.8108 14.2857 17.9092 14.3265 17.9818 14.399C18.0543 14.4716 18.0951 14.57 18.0951 14.6726V20.4762C18.0951 21.2971 17.769 22.0844 17.1885 22.6649C16.608 23.2453 15.8207 23.5714 14.9998 23.5714C14.1789 23.5714 13.3916 23.2453 12.8112 22.6649C12.2307 22.0844 11.9046 21.2971 11.9046 20.4762V14.6726Z',
        width: 30,
        height: 30,
        iconBox: '0 0 30 30',
        iconBackgroundClass: ''
      }
    ])
    state.menu.push([
      {
        label: 'Прочее',
        uid: '757be87d-c269-40e0-b224-6b2bb0e4f97d',
        bold: false,
        icon: [
          'M7.5 16.875C8.53553 16.875 9.375 16.0355 9.375 15C9.375 13.9645 8.53553 13.125 7.5 13.125C6.46447 13.125 5.625 13.9645 5.625 15C5.625 16.0355 6.46447 16.875 7.5 16.875Z',
          'M15 16.875C16.0355 16.875 16.875 16.0355 16.875 15C16.875 13.9645 16.0355 13.125 15 13.125C13.9645 13.125 13.125 13.9645 13.125 15C13.125 16.0355 13.9645 16.875 15 16.875Z',
          'M22.5 16.875C23.5355 16.875 24.375 16.0355 24.375 15C24.375 13.9645 23.5355 13.125 22.5 13.125C21.4645 13.125 20.625 13.9645 20.625 15C20.625 16.0355 21.4645 16.875 22.5 16.875Z'
        ],
        iconBox: '0 0 30 30',
        width: 30,
        height: 30,
        type: 'greed',
        path: 'other'
      }
    ])
    const newAssignments = []
    newAssignments.push({
      dep: 'Поручено мной',
      items: resp.data.delegate_iam.items
    })
    newAssignments.push({
      dep: 'Поручено мне',
      items: resp.data.delegate_to_me.items
    })
    resp.data.new_delegate = newAssignments

    // Merge emps to deps like new private projects
    const dataEmps = [...resp.data.emps?.items]
    const newEmps = []
    newEmps.push({
      dep: { uid: '', name: 'Вне отдела' },
      items: getAllMembersByDepartmentUID(
        dataEmps,
        '00000000-0000-0000-0000-000000000000'
      )
    })
    for (const department of resp.data.deps.items) {
      const dep = {
        dep: department,
        items: getAllMembersByDepartmentUID(dataEmps, department.uid)
      }
      newEmps.push(dep)
    }
    resp.data.new_emps = newEmps

    // Merge common projects and private projects into my own data structure
    // Array of objects where object is { dep: 'Dependency name', items: items }
    const itemsInProjectView = []
    itemsInProjectView.push({
      dep: 'Мои проекты',
      items: resp.data.private_projects.items,
      type: 'projects'
    })
    itemsInProjectView.push({
      dep: 'Общие проекты',
      items: resp.data.common_projects.items,
      type: 'projects'
    })
    resp.data.new_private_projects = itemsInProjectView

    const newCommonBoards = []
    newCommonBoards.push({
      dep: 'Мои доски',
      items: resp.data.private_boards.items
    })
    newCommonBoards.push({
      dep: 'Общие доски',
      items: resp.data.common_boards.items
    })
    resp.data.new_private_boards = newCommonBoards

    state.navigator = resp.data
  },
  [NAVIGATOR_UPDATE_ASSIGNMENTS]: (state, resp) => {
    const newAssignments = []
    newAssignments.push({
      dep: 'Поручено мной',
      items: resp.data.delegate_iam.items
    })
    newAssignments.push({
      dep: 'Поручено мне',
      items: resp.data.delegate_to_me.items
    })
    state.navigator.delegate_iam = resp.data.delegate_iam
    state.navigator.delegate_to_me = resp.data.delegate_to_me
    state.navigator.new_delegate = newAssignments
  },
  [NAVIGATOR_PUSH_DEPARTAMENT]: (state, departaments) => {
    for (const departament of departaments) {
      if (
        departament.uid_parent ||
        departament.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding departament to the root
        state.navigator.deps.items.push(departament)
      } else {
        // adding departament recursively to subarrays
        visitChildren(state.navigator.deps.items, (value) => {
          if (value.uid === departament.uid_parent) {
            value.children.push(departament)
          }
        })
      }
      // добавить в new_emps
      state.navigator.new_emps.push({
        dep: departament,
        items: getAllMembersByDepartmentUID(
          state.navigator.emps.items,
          departament.uid
        )
      })
    }
  },
  [NAVIGATOR_PUSH_REGLAMENT]: (state, reglament) => {
    state.navigator.reglaments.items.push(reglament)
  },
  [NAVIGATOR_REMOVE_REGLAMENT]: (state, reglament) => {
    for (let i = 0; i < state.navigator.reglaments.items.length; i++) {
      if (state.navigator.reglaments.items[i].uid === reglament.uid) {
        state.navigator.reglaments.items.splice(i, 1)
        return
      }
    }
  },
  [NAVIGATOR_REMOVE_DEPARTAMENT]: (state, uidDepartment) => {
    // удаляем  из new_emps
    const indexEmps = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === uidDepartment
    )
    if (indexEmps !== -1) {
      const emps = state.navigator.new_emps[indexEmps]
      const rootEmps = state.navigator.new_emps.find(
        (emps) => emps.dep.uid === ''
      )
      if (rootEmps && emps) {
        rootEmps.items.push(...emps.items)
      }
      state.navigator.new_emps.splice(indexEmps, 1)
    }
    // удаляем из deps
    const indexDeps = state.navigator.deps.items.findIndex(
      (dep) => dep.uid === uidDepartment
    )
    if (indexDeps !== -1) state.navigator.deps.items.splice(indexDeps, 1)
  },
  [NAVIGATOR_UPDATE_DEPARTMENT]: (state, department) => {
    const indexEmps = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === department.uid
    )
    if (indexEmps !== -1) {
      state.navigator.new_emps[indexEmps].dep = department
    }

    const indexDeps = state.navigator.deps.items.findIndex(
      (dep) => dep.uid === department.uid
    )
    if (indexDeps !== -1) state.navigator.deps.items[indexDeps] = department
  },
  [NAVIGATOR_CHANGE_EMPLOYEE_DEPARTMENT]: (state, data) => {
    const uidDepOld =
      data.uidDepartmentOld === '00000000-0000-0000-0000-000000000000'
        ? ''
        : data.uidDepartmentOld
    const uidDepNew =
      data.uidDepartmentNew === '00000000-0000-0000-0000-000000000000'
        ? ''
        : data.uidDepartmentNew
    const indexEmpsOld = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === uidDepOld
    )
    const indexEmpsNew = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === uidDepNew
    )
    const empsOld = state.navigator.new_emps[indexEmpsOld]
    const empsNew = state.navigator.new_emps[indexEmpsNew]
    if (empsOld && empsNew && empsOld.dep.uid !== empsNew.dep.uid) {
      // отдел поменялся - перемещаем сотрудника
      const indexEmp = empsOld.items.findIndex((emp) => emp.uid === data.uidEmp)
      const [emp] = empsOld.items.splice(indexEmp, 1)
      empsNew.items.push(emp)
      emp.uid_dep = empsNew.dep.uid || '00000000-0000-0000-0000-000000000000'
    }
  },
  [NAVIGATOR_PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      if (
        !project.uid_parent ||
        project.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding projects to the root
        state.navigator.new_private_projects[0].items.push(project)
      } else {
        // adding projects recursively to subarrays
        visitChildren(
          state.navigator.new_private_projects[0].items,
          (value) => {
            if (value.uid === project.uid_parent) {
              value.children.push(project)
            }
          }
        )
      }
    }
  },
  [NAVIGATOR_PUSH_BOARD]: (state, boards) => {
    for (const board of boards) {
      if (
        !board.uid_parent ||
        board.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding projects to the root
        state.navigator.new_private_boards[0].items.push(board)
      } else {
        // adding projects recursively to subarrays
        visitChildren(state.navigator.new_private_boards[0].items, (value) => {
          if (value.uid === board.uid_parent) {
            value.children.push(board)
          }
        })
      }
    }
  },
  [NAVIGATOR_PUSH_TAG]: (state, tags) => {
    for (const tag of tags) {
      if (
        !tag.uid_parent ||
        tag.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding tags to the root
        state.navigator.tags.items.push(tag)
      } else {
        // adding projects recursively to subarrays
        visitChildren(state.navigator.tags.items, (value) => {
          if (value.uid === tag.uid_parent) {
            value.children.push(tag)
          }
        })
      }
    }
  },
  [NAVIGATOR_PUSH_COLOR]: (state, colors) => {
    for (const color of colors) {
      state.navigator.colors.items.push(color)
    }
  },
  NAVIGATOR_UPDATE_COLOR: (state, colors) => {
    visitChildren(state.navigator.colors.items, (value, index) => {
      if (value.uid === colors.uid) {
        Object.assign(value, colors)
      }
    })
  },
  [NAVIGATOR_UPDATE_REGLAMENT]: (state, reglament) => {
    for (let i = 0; i < state.navigator.reglaments.items.length; i++) {
      if (state.navigator.reglaments.items[i].uid === reglament.uid) {
        Object.assign(state.navigator.reglaments.items[i], reglament)
        return
      }
    }
  },
  NAVIGATOR_UPDATE_TAG: (state, tag) => {
    visitChildren(state.navigator.tags.items, (value) => {
      if (value.uid === tag.uid) {
        Object.assign(value, tag)
      }
    })
  },
  [NAVIGATOR_PUSH_EMPLOYEE]: (state, employees) => {
    for (const employee of employees) {
      state.navigator.emps.items.push(employee)
      const dep =
        employee.uid_dep === '00000000-0000-0000-0000-000000000000'
          ? ''
          : employee.uid_dep
      const emps = state.navigator.new_emps.find((emps) => emps.dep.uid === dep)
      emps?.items?.push(employee)
    }
  },
  [NAVIGATOR_REMOVE_PROJECT]: (state, project) => {
    if (
      !project.uid_parent ||
      project.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (
        let i = 0;
        i < state.navigator.new_private_projects[0].items.length;
        i++
      ) {
        if (
          state.navigator.new_private_projects[0].items[i].uid === project.uid
        ) {
          state.navigator.new_private_projects[0].items.splice(i, 1)
        }
      }
    } else {
      visitChildren(
        state.navigator.new_private_projects[0].items,
        (value, index) => {
          if (value.uid === project.uid_parent) {
            for (let i = 0; i < value.children.length; i++) {
              if (value.children[i].uid === project.uid) {
                // remove element without mutation
                value.children.splice(i, 1)
              }
            }
          }
        }
      )
    }
  },
  [NAVIGATOR_REMOVE_BOARD]: (state, board) => {
    if (
      !board.uid_parent ||
      board.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (
        let i = 0;
        i < state.navigator.new_private_boards[0].items.length;
        i++
      ) {
        if (state.navigator.new_private_boards[0].items[i].uid === board.uid) {
          state.navigator.new_private_boards[0].items.splice(i, 1)
        }
      }
    } else {
      visitChildren(
        state.navigator.new_private_boards[0].items,
        (value, index) => {
          if (value.uid === board.uid_parent) {
            for (let i = 0; i < value.children.length; i++) {
              if (value.children[i].uid === board.uid) {
                // remove element without mutation
                value.children.splice(i, 1)
              }
            }
          }
        }
      )
    }
  },
  [NAVIGATOR_UPDATE_EMPLOYEE]: (state, employee) => {
    for (const dep of state.navigator.new_emps) {
      for (let i = 0; i < dep.items.length; i++) {
        if (dep.items[i].uid === employee.uid) {
          dep.items[i] = employee
        }
      }
    }
  },
  [NAVIGATOR_REMOVE_EMPLOYEE]: (state, employee) => {
    for (const dep of state.navigator.new_emps) {
      for (let i = 0; i < dep.items.length; i++) {
        if (dep.items[i].uid === employee.uid) {
          dep.items.splice(i, 1)
        }
      }
    }
  },
  [NAVIGATOR_REMOVE_TAG]: (state, tag) => {
    // removing wihtout mutation even on root level
    if (
      !tag.uid_parent ||
      tag.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (let i = 0; i < state.navigator.tags.items.length; i++) {
        if (state.navigator.tags.items[i].uid === tag.uid) {
          state.navigator.tags.items.splice(i, 1)
        }
      }
    } else {
      visitChildren(state.navigator.tags.items, (value, index) => {
        if (value.uid === tag.uid_parent) {
          for (let i = 0; i < value.children.length; i++) {
            if (value.children[i].uid === tag.uid) {
              // remove element without mutationy
              value.children.splice(i, 1)
            }
          }
        }
      })
    }
  },
  [NAVIGATOR_REMOVE_COLOR]: (state, color) => {
    for (let i = 0; i < state.navigator.colors.items.length; i++) {
      if (state.navigator.colors.items[i].uid === color.uid) {
        state.navigator.colors.items.splice(i, 1)
      }
    }
  },
  NAVIGATOR_UPDATE_PROJECT: (state, project) => {
    visitChildren(
      state.navigator.new_private_projects[0].items,
      (value, index) => {
        if (value.uid === project.uid) {
          Object.assign(value, project)
        }
      }
    )
  },
  [NAVIGATOR_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [PATCH_SETTINGS_SUCCESS]: (state, resp) => {
    state.navigator.settings = resp
  },
  [RESET_STATE_NAVIGATOR]: (state) => {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
