import * as TASK from '@/store/actions/tasks'
import { UID_TO_ACTION, visitChildren } from '@/store/helpers/functions'
import store from '@/store/index.js'
import { computed } from 'vue'

export function checkTaskSource () {
  const navStack = computed(() => store.state.navbar.navStack)
  const lastNavStackElement = navStack.value[navStack.value.length - 1]
  if (lastNavStackElement && lastNavStackElement.key === 'taskListSource') {
    // If there is last nav stack element and its taskListSource, request it
    const action = UID_TO_ACTION[lastNavStackElement.value.uid]
    if (!action) {
      throw new Error('There is not action in checkTasksSource')
    }
    store.dispatch(action, lastNavStackElement.value.param)
    store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    store.commit('basic', {
      key: lastNavStackElement.key,
      value: lastNavStackElement.value
    })
  } else {
    // If this is first sign in, create NavElement Today's tasks list because we got nothing in local store navstack item
    store.commit('basic', {
      key: 'taskListSource',
      value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date() }
    })
    store.commit('updateStackWithInitValue', {
      name: 'Сегодня',
      key: 'taskListSource',
      type: 'date',
      typeVal: new Date(),
      value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date() }
    })
    store.dispatch(TASK.TASKS_REQUEST, new Date()).then(() => {
      store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    })
  }
}

export function checkGreedSource () {
  const navStack = computed(() => store.state.navbar.navStack)
  const lastNavStackElement = navStack.value[navStack.value.length - 1]
  if (lastNavStackElement && lastNavStackElement.key === 'greedSource') {
    if (
      lastNavStackElement.value.uid === '2bad1413-a373-4926-8a3c-58677a680714'
    ) {
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: 'dashboard' })
    } else if (
      lastNavStackElement.value.uid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25'
    ) {
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: 'doitnow' })
    } else if (
      lastNavStackElement.value.uid === 'ed8039ae-f3de-4369-8f32-829d401056e9'
    ) {
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: 'colors' })
    } else if (
      lastNavStackElement.value.uid === '00a5b3de-9474-404d-b3ba-83f488ac6d30'
    ) {
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: 'tags' })
    } else if (
      lastNavStackElement.value.uid === '757be87d-c269-40e0-b224-6b2bb0e4f97d'
    ) {
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', { key: 'greedPath', value: 'other' })
    } else {
      store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      store.commit('basic', {
        key: 'greedPath',
        value: lastNavStackElement.greedPath
      })
    }

    const storeNavigator = computed(() => store.state.navigator.navigator)

    if (
      [
        'new_private_projects',
        'new_emps',
        'new_delegate',
        'new_private_boards'
      ].includes(lastNavStackElement.greedPath)
    ) {
      // If last navElement is related to processed navigator instance with 'new_' prefix then we pass entire object from storeNavigator
      store.commit('basic', {
        key: lastNavStackElement.key,
        value: storeNavigator.value[lastNavStackElement.greedPath]
      })
    } else if (
      ['tags_children', 'projects_children', 'boards_children'].includes(
        lastNavStackElement.greedPath
      )
    ) {
      // if last visited navElement is in nested in children, then we trying to find these children with visitChildren function from storeNavigator
      const action = UID_TO_ACTION[lastNavStackElement.value.uid]
      if (!action) {
        throw new Error('There is not action in checkTasksSource')
      }

      store.dispatch(action, lastNavStackElement.uid)
      store.commit('basic', {
        key: 'taskListSource',
        value: {
          uid: lastNavStackElement.global_property_uid,
          param: lastNavStackElement.uid
        }
      })

      if (Array.isArray(storeNavigator.value[lastNavStackElement.greedPath])) {
        for (const elem of storeNavigator.value[
          lastNavStackElement.greedPath
        ]) {
          makeSomethingMagicWithChildren(lastNavStackElement, elem.items)
        }
      } else {
        makeSomethingMagicWithChildren(
          lastNavStackElement,
          storeNavigator.value[lastNavStackElement.greedPath].items
        )
      }
    } else {
      // colors
      store.commit('basic', {
        key: lastNavStackElement.key,
        value: storeNavigator.value[lastNavStackElement.greedPath].items
      })
    }
  }
}

function makeSomethingMagicWithChildren (lastNavStackElement, items) {
  visitChildren(items, (value) => {
    if (value.uid === lastNavStackElement.uid) {
      store.commit('basic', {
        key: lastNavStackElement.key,
        value: value.children
      })
    }
  })
}
