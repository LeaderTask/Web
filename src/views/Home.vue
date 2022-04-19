<script setup>
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { visitChildren } from '@/store/helpers/functions'
import TasksListNew from '@/components/TasksListNew.vue'
import MainSection from '@/components/MainSection.vue'
import Projects from '@/components/Projects.vue'
import ProjectsChildren from '@/components/ProjectsChildren.vue'
import Employees from '@/components/Employees.vue'
import Tags from '@/components/Tags.vue'
import Colors from '@/components/Colors.vue'
import Assignments from '@/components/Assignments.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'
import * as TASK from '@/store/actions/tasks'

const store = useStore()
const mainSectionState = computed(() => store.state.mainSectionState)
const greedPath = computed(() => store.state.greedPath)
const greedSource = computed(() => store.state.greedSource)

const storeTasks = computed(() => store.state.tasks.newtasks)
const newConfig = computed(() => store.state.tasks.newConfig)
const navStack = computed(() => store.state.navbar.navStack)
const storeNavigator = computed(() => store.state.navigator.navigator)

const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

const getTasks = () => {
  if (store.state.auth.token) {
    // Process saved last visited nav
    if (navStack.value.length && navStack.value.length > 0) {
      if (navStack.value[navStack.value.length - 1].key === 'taskListSource') {
        store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].value.uid], navStack.value[navStack.value.length - 1].value.param)
        store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: navStack.value[navStack.value.length - 1].value })
      }
    } else {
      store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
      // TODO: here we need localization
      store.commit(
        'updateStackWithInitValue',
        { name: 'Today', key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } }
      )

      store.dispatch(TASK.TASKS_REQUEST, new Date())
        .then(() => {
          store.commit(TASK.CLEAN_UP_LOADED_TASKS)
        })
        .catch((err) => console.log(err))
    }
  }
}

const getNavigator = () => {
  if (store.state.auth.token) {
    store.dispatch(NAVIGATOR_REQUEST)
      .then(() => {
        // After navigator is loaded we are trying to set up last visited navElement
        // Checking if last navElement is a gridSource
        if (navStack.value.length && navStack.value.length > 0) {
          if (navStack.value[navStack.value.length - 1].key === 'greedSource') {
            store.commit('basic', { key: 'greedPath', value: navStack.value[navStack.value.length - 1].greedPath })
            store.commit('basic', { key: 'mainSectionState', value: 'greed' })

            // If last navElement is related to processed navigator instance with 'new_' prefix
            // then we pass entire object from storeNavigator
            if (['new_private_projects', 'new_emps', 'new_delegate'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath] })

            // if last visited navElemen is in nested in children, then we trying to find these children with visitChildren fucntion
            // from storeNavigator
            } else if (['tags_children', 'projects_children'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
              if (navStack.value[navStack.value.length - 1].greedPath === 'tags_children') {
                // nested lookup for tags
                visitChildren(storeNavigator.value.tags.items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
              }

              // nested lookup for shared and private projects
              if (navStack.value[navStack.value.length - 1].greedPath === 'projects_children') {
                visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
                visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
              }
            // colors
            } else {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath].items })
            }
          }
        }
      })
  }
}

onBeforeMount(() => {
  getNavigator()
  getTasks()
  store.dispatch(USER_REQUEST)
})

</script>

<template>
  <main-section>
    <TasksListNew
      v-if="mainSectionState === 'tasks'"
      :store-tasks="storeTasks"
      :new-config="newConfig"
    />
    <!-- Greed section -->
    <div v-if="mainSectionState === 'greed'">
      <projects
        v-if="greedPath === 'new_private_projects'"
        :projects="greedSource"
      />
      <projects-children
        v-if="greedPath === 'projects_children'"
        :projects="greedSource"
      />
      <employees
        v-if="greedPath === 'new_emps'"
        :employees="greedSource"
      />
      <tags
        v-if="greedPath === 'tags' || greedPath === 'tags_children'"
        :tags="greedSource"
      />
      <colors
        v-if="greedPath === 'colors'"
        :colors="greedSource"
      />
      <assignments
        v-if="greedPath === 'new_delegate'"
        :assignments="greedSource"
      />
    </div>
  </main-section>
</template>
