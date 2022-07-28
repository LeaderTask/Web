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

export function createReglamentQuestion (obj) {
  const lastNavStack = store.getters.lastNavStackElement
  if (shouldDoAnything(lastNavStack, obj.obj.uid_reglament)) {
    obj.obj.answers = [] // здесь добавляем, потому что в вопросе нужен изначально пустой массив ответов
    store.commit(REGLAMENT.REGLAMENT_PUSH_QUESTION, obj.obj)
  }
}

export function deleteReglamentQuestion (obj) {
  store.commit(REGLAMENT.REGLAMENT_DELETE_QUESTION, obj.obj) // second param is question uuid
}

export function updateReglamentQuestion (obj) {
  const lastNavStack = store.getters.lastNavStackElement
  if (shouldDoAnything(lastNavStack, obj.obj.uid_reglament)) {
    store.commit(REGLAMENT.REGLAMENT_UPDATE_QUESTION, obj.obj)
  }
}
