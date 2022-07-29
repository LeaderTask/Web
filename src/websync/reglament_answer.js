import store from '@/store/index.js'
import * as REGLAMENT from '@/store/actions/reglaments'

function shouldDoAnything (navElement, reglamentUid) {
  if (
    navElement.greedPath &&
    navElement.greedPath === 'reglament_content' &&
    navElement.uid === reglamentUid
  ) return true
  return false
}

export function createReglamentAnswer (obj) {
  const lastNavStack = store.getters.lastNavStackElement
  if (shouldDoAnything(lastNavStack, obj.obj.uid_reglament)) {
    store.commit(REGLAMENT.REGLAMENT_PUSH_ANSWER, obj.obj)
  }
}

export function deleteReglamentAnswer (obj) {
  store.commit(REGLAMENT.REGLAMENT_DELETE_ANSWER, obj.obj) // second param is answer uuid
}

export function updateReglamentAnswer (obj) {
  const lastNavStack = store.getters.lastNavStackElement
  if (shouldDoAnything(lastNavStack, obj.obj.uid_reglament)) {
    store.commit(REGLAMENT.REGLAMENT_UPDATE_ANSWER_NAME, obj.obj)
  }
}
