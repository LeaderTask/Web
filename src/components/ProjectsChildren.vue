<script setup>
import Icon from '@/components/Icon.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import projectIcon from '@/icons/project.js'
import sharedProject from '@/icons/shared_project.js'
import subArrow from '@/icons/arrow-sub.js'
import * as TASK from '@/store/actions/tasks'
import { SELECT_PROJECT } from '@/store/actions/projects'

const store = useStore()
// const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

const isGridView = computed(() => store.state.isGridView)

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const focusedProject = ref('')
const user = computed(() => store.state.user.user)
const allProjects = computed(() => store.state.projects.projects)

// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST // shared
}

const openProperties = (project, parentProjectUid = '') => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  focusedProject.value = project.uid
  if (props.projects[0].uid_parent && props.projects[0].uid_parent !== '00000000-0000-0000-0000-000000000000' && !parentProjectUid) {
    parentProjectUid = props.projects[0].uid_parent
  }
  store.commit('basic', { key: 'propertiesState', value: 'project' })
  // create empty instanse of project
  if (!project) {
    project = {
      uid_parent: parentProjectUid,
      color: '',
      comment: '',
      plugin: '',
      collapsed: 0,
      isclosed: 0,
      order: 0,
      group: 0,
      show: 0,
      favorite: 0,
      quiet: 0,
      email_creator: user.value.current_user_email,
      members: [user.value.current_user_email],
      children: [],
      uid: '',
      name: '',
      bold: 0
    }
  }
  store.commit(SELECT_PROJECT, project)
}

const clickOnGridCard = (value) => {
  if (UID_TO_ACTION[value.global_property_uid]) {
    store.dispatch(UID_TO_ACTION[value.global_property_uid], value.uid)
    const navElem = {
      name: value.name,
      key: 'taskListSource',
      value: { uid: value.global_property_uid, param: value.uid }
    }
    store.commit('pushIntoNavStack', navElem)
    store.commit('basic', { key: 'taskListSource', value: { uid: value.global_property_uid, param: value.uid } })
  }
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
const goToChildren = (value) => {
  if (value.children && value.children.length) {
    const navElem = {
      name: value.name,
      key: 'greedSource',
      uid: value.uid,
      greedPath: 'projects_children',
      value: value.children
    }
    store.commit('pushIntoNavStack', navElem)
    store.commit('basic', { key: 'greedSource', value: value.children })
    store.commit('basic', { key: 'greedPath', value: 'projects_children' })
  }
}
</script>

<template class="w-full">
  <div
    class="grid gap-4 mt-3"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <template
      v-for="(project, pindex) in projects"
      :key="pindex"
    >
      <div
        class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-md px-5 py-7 relative"
        :class="{ 'ring-4 ring-orange-300': focusedProject == project.uid && isPropertiesMobileExpanded }"
      >
        <div
          v-if="project.color != '#A998B6'"
          :style="{ backgroundColor: project.color }"
          style="border-radius: 100% 0 0.75rem 0;"
          class="w-7 h-7 absolute bottom-0 right-0"
        />
        <div>
          <div class="flex items-center w-96">
            <icon
              :path="properties.path"
              :width="properties.width"
              :height="properties.height"
              :box="properties.viewBox"
              size="18"
              class="text-gray-400 cursor-pointer hover:text-gray-800 mr-2"
              @click="openProperties(project)"
            />
            <icon
              v-if="project.members && project.members.length == 1"
              :path="projectIcon.path"
              :width="18"
              :height="18"
              :box="projectIcon.viewBox"
              class="text-gray-500 mr-2"
            />
            <icon
              v-if="project.members && project.members.length > 1"
              :path="sharedProject.path"
              :width="18"
              :height="18"
              :box="sharedProject.viewBox"
              class="text-gray-500 mr-2"
            />
            <p
              class="font-normal cursor-pointer"
              @click="clickOnGridCard(project)"
            >
              {{ project.name }}
            </p>
          </div>
          <div
            v-if="project.children && project.children.length"
            class="flex items-center"
          >
            <icon
              :path="subArrow.path"
              :box="subArrow.viewBox"
              :width="subArrow.width"
              :height="subArrow.height"
              class="text-gray-500 cursor-pointer mr-1"
              @click="goToChildren(project)"
            />
            <p
              class="font-light text-xs text-violet-500 cursor-pointer"
              @click="goToChildren(project)"
            >
              Подпроектов: {{ project.children.length }}
            </p>
          </div>
          <div
            v-if="project.children && !project.children.length && project.email_creator == user.current_user_email"
            class="flex items-center"
          >
            <icon
              :path="subArrow.path"
              :box="subArrow.viewBox"
              :width="subArrow.width"
              :height="subArrow.height"
              class="text-gray-500 cursor-pointer mr-1"
              @click="openProperties(false, parentProjectUid = project.uid)"
            />
            <p
              class="font-light text-xs text-violet-500 cursor-pointer"
              @click="openProperties(false, parentProjectUid = project.uid)"
            >
              Добавить подпроект
            </p>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="allProjects[projects[0].uid_parent] && allProjects[projects[0].uid_parent].email_creator === user.current_user_email"
      class="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 py-7"
      @click="openProperties(false)"
    >
      <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="dark:text-gray-100"
        >
          <path
            d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
            stroke="#3E3D3B"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
