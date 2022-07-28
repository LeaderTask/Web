import {
  setLocalStorageItem,
  UID_TO_ACTION,
  visitChildren
} from '@/store/helpers/functions'

const state = {
  navStack: []
}

const getters = {
  lastNavStackElement: (state) => state.navStack[state.navStack.length - 1]
}

const actions = {
  gotoNavStackItem: ({ commit, dispatch, rootState }, index) => {
    const item = rootState.navbar.navStack[index]
    if (!item || !item.greedPath) return
    //
    const storeNavigator = rootState.navigator.navigator
    //
    commit('removeAllFromStackAfterIndex', index)

    commit('basic', { key: 'greedPath', value: item.greedPath })
    commit('basic', { key: 'mainSectionState', value: 'greed' })

    if (
      [
        'new_private_projects',
        'new_emps',
        'new_delegate',
        'new_private_boards'
      ].includes(item.greedPath)
    ) {
      commit('basic', {
        key: item.key,
        value: storeNavigator[item.greedPath]
      })
    } else if (
      ['tags_children', 'projects_children', 'boards_children'].includes(
        item.greedPath
      )
    ) {
      if (item.greedPath === 'tags_children') {
        const action = UID_TO_ACTION[item.global_property_uid]
        if (!action) {
          console.error('UID_TO_ACTION in undefined', item.global_property_uid)
          return
        }
        dispatch(action, item.uid).then(() => {
          commit('basic', {
            key: 'taskListSource',
            value: { uid: item.global_property_uid, param: item.uid }
          })
        })
        visitChildren(storeNavigator.tags.items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
      }
      if (item.greedPath === 'projects_children') {
        // Request project's tasks
        const action = UID_TO_ACTION[item.global_property_uid]
        if (!action) {
          console.error('UID_TO_ACTION in undefined', item.global_property_uid)
          return
        }
        dispatch(action, item.uid)
        commit('basic', {
          key: 'taskListSource',
          value: { uid: item.global_property_uid, param: item.uid }
        })
        visitChildren(storeNavigator.new_private_projects[0].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
        visitChildren(storeNavigator.new_private_projects[1].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
      }
      if (item.greedPath === 'other') {
        const navElem = {
          name: item.label,
          key: 'greedSource',
          value: { uid: item.uid, param: null },
          greedPath: 'other'
        }
        commit('updateStackWithInitValue', navElem)
        commit('basic', { key: 'mainSectionState', value: 'greed' })
        commit('basic', { key: 'greedPath', value: 'other' })
        return
      }
      if (item.greedPath === 'boards_children') {
        // Request boards's cards
        const action = UID_TO_ACTION[item.global_property_uid]
        if (!action) {
          console.error('UID_TO_ACTION in undefined', item.global_property_uid)
          return
        }
        dispatch(action, item.uid)
        commit('basic', {
          key: 'cardSource',
          value: { uid: item.global_property_uid, param: item.uid }
        })
        visitChildren(storeNavigator.new_private_boards[0].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
        visitChildren(storeNavigator.new_private_boards[1].items, (value) => {
          if (value.uid === item.uid) {
            commit('basic', { key: item.key, value: value.children })
          }
        })
      }
    } else {
      if (item.greedPath !== 'other') {
        commit('basic', {
          key: item.key,
          value: storeNavigator[item.greedPath].items
        })
      }
    }
  },
  popNavStack: ({ commit, dispatch, rootState }) => {
    const navStack = rootState.navbar.navStack
    if (navStack.length > 1) {
      const index = navStack.length - 2
      dispatch('gotoNavStackItem', index)
    }
  }
}

const mutations = {
  pushIntoNavStack: (state, navElement) => {
    state.navStack.push(navElement)
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  },
  updateStackWithInitValue: (state, navElement) => {
    state.navStack = [navElement]
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  },
  removeAllFromStackAfterIndex: (state, index) => {
    if (index === state.navStack.length - 1 || state.navStack.length === 1) {
      return
    }
    state.navStack.splice(index + 1, state.navStack.length - 1 - index)
    setLocalStorageItem('navStack', JSON.stringify(state.navStack))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
