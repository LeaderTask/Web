import store from '@/store/index.js'
import * as NAVIGATOR from '@/store/actions/navigator.js'

export function createReglament (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_PUSH_REGLAMENT, obj.obj)
}

export function deleteReglament (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_REMOVE_REGLAMENT, obj.obj)
}

export function updateReglament (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_UPDATE_REGLAMENT, obj.obj)
}
