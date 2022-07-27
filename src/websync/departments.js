import store from '@/store'
import {
  NAVIGATOR_PUSH_DEPARTAMENT,
  NAVIGATOR_REMOVE_DEPARTAMENT, NAVIGATOR_UPDATE_DEPARTMENT
} from '@/store/actions/navigator'

export function createDepartment (obj) {
  store.commit(NAVIGATOR_PUSH_DEPARTAMENT, [obj.obj])
}

export function removeDepartment (uid) {
  store.commit(NAVIGATOR_REMOVE_DEPARTAMENT, uid)
}

export function updateDepartment (obj) {
  store.commit(NAVIGATOR_UPDATE_DEPARTMENT, obj.obj)
}
