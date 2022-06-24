/* eslint-disable indent */
import store from '@/store/index.js'
import { shouldAddTaskIntoList } from './utils'

export function createTask (obj) {
  if (shouldAddTaskIntoList(obj.obj)) {
    store.commit('ADD_TASK', obj.obj)
  }
}

export function removeTask (uid) {
  store.commit('REMOVE_TASK', uid)
}

export function updateTask (obj) {
  store.commit('UPDATE_TASK', obj.obj)
  if (shouldAddTaskIntoList(obj.obj)) {
    store.commit('ADD_TASK', obj.obj)
  }
}
