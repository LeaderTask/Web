<script setup>
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'
import properties from '@/icons/properties.js'
import projectIcon from '@/icons/project.js'
import sharedProject from '@/icons/shared_project.js'
import subArrow from '@/icons/arrow-sub.js'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import * as TASK from '@/store/actions/tasks'
import { SELECT_PROJECT } from '@/store/actions/projects'

const store = useStore()
defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST // shared
}

const isGridView = computed(() => store.state.isGridView)

const updateGridView = (value) => {
  store.commit('basic', { key: 'isGridView', value: value })
  localStorage.setItem('isGridView', value)
}

const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const user = computed(() => store.state.user.user)
const focusedProject = ref('')

const openProperties = (project, parentProjectUid = '') => {
  if (!isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', true)
  }
  focusedProject.value = project.uid
  store.commit('basic', { key: 'propertiesState', value: 'project' })
  // create empty instanse of project
  if (!project || parentProjectUid) {
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
    v-for="(value, index) in projects"
    :key="index"
  >
    <div
      class="flex items-center w-full"
      :class="{ 'justify-between': index == 0, 'mt-3': index == 1 } "
    >
      <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100">
        {{ value.dep }}
      </p>
      <div
        v-if="index == 0"
        class="flex"
      >
        <icon
          :path="listView.path"
          :width="listView.width"
          :height="listView.height"
          :box="listView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
          :class="{ 'text-gray-800': !isGridView, 'text-gray-400': isGridView }"
          @click="updateGridView(false)"
        />
        <icon
          :path="gridView.path"
          :width="gridView.width"
          :height="gridView.height"
          :box="gridView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
          :class="{ 'text-gray-800': isGridView, 'text-gray-400': !isGridView }"
          @click="updateGridView(true)"
        />
      </div>
    </div>
    <div
      class="grid gap-4 mt-3"
      :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
    >
      <template
        v-for="(project, pindex) in value.items"
        :key="pindex"
      >
        <div
          class="flex items-center bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md px-5 py-7 relative min-h-[100px]"
          :class="{ 'ring-4 ring-orange-300': focusedProject == project.uid }"
        >
          <icon
            :path="properties.path"
            :width="properties.width"
            :height="properties.height"
            :box="properties.viewBox"
            class="text-gray-400 cursor-pointer hover:text-gray-800 absolute top-10 right-5"
            @click="openProperties(project)"
          />
          <div
            v-if="project.color != '#A998B6'"
            :style="{ backgroundColor: project.color }"
            style="border-radius: 100% 0 0.75rem 0;"
            class="w-6 h-6 absolute bottom-0 right-0"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-3 right-3 cursor-pointer"
          >
            <path
              d="M8.58377 3.45475C8.69791 3.17266 8.89368 2.93108 9.146 2.76098C9.39832 2.59088 9.6957 2.5 10 2.5C10.3043 2.5 10.6017 2.59088 10.854 2.76098C11.1063 2.93108 11.3021 3.17266 11.4162 3.45475C12.5458 3.76541 13.5422 4.43829 14.2523 5.37004C14.9625 6.3018 15.3471 7.44092 15.3471 8.61244V12.2004L16.7466 14.2995C16.8233 14.4145 16.8674 14.5483 16.8741 14.6864C16.8808 14.8245 16.8499 14.9619 16.7847 15.0838C16.7194 15.2058 16.6223 15.3077 16.5036 15.3788C16.385 15.4498 16.2493
            15.4873 16.111 15.4873H12.6468C12.5549 16.1237 12.2367 16.7057 11.7506 17.1266C11.2645 17.5475 10.643 17.7791 10 17.7791C9.357 17.7791 8.73553 17.5475 8.24942 17.1266C7.76332 16.7057 7.44514 16.1237 7.35317 15.4873H3.88899C3.7507 15.4873 3.61499 15.4498 3.49635 15.3788C3.37771 15.3077 3.28059 15.2058 3.21535 15.0838C3.15011 14.9619 3.11919 14.8245 3.1259 14.6864C3.13261 14.5483 3.17669 14.4145 3.25345 14.2995L4.65287 12.2004V8.61244C4.65287 6.14971 6.31812 4.07502 8.58377
            3.45475ZM8.91988 15.4873C8.99877 15.7109 9.14506 15.9045 9.33858 16.0414C9.5321 16.1783 9.76332 16.2518 10.0004 16.2518C10.2374 16.2518 10.4687 16.1783 10.6622 16.0414C10.8557 15.9045 11.002 15.7109 11.0809 15.4873H8.91912H8.91988ZM10 4.79306C8.98704 4.79306 8.01556 5.19546 7.29929 5.91173C6.58302 6.62801 6.18062 7.59948 6.18062 8.61244V12.4318C6.18065 12.5827 6.136 12.7302 6.05229 12.8558L5.31668 13.9596H14.6826L13.9469 12.8558C13.8635 12.7301 13.8191 12.5826 13.8194
            12.4318V8.61244C13.8194 7.59948 13.417 6.62801 12.7007 5.91173C11.9844 5.19546 11.013 4.79306 10 4.79306Z"
              fill="#06060E"
              fill-opacity="0.5"
            />
            <circle
              cx="14.0625"
              cy="5.9375"
              r="3.1875"
              fill="#FB381E"
              stroke="white"
              stroke-width="2"
            />
          </svg>
          <div>
            <div class="flex items-start">
              <icon
                v-if="project.members && project.members.length == 1"
                :path="projectIcon.path"
                :width="18"
                :height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <icon
                v-if="project.members && project.members.length > 1"
                :path="sharedProject.path"
                :width="18"
                :height="18"
                :box="sharedProject.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <p
                class="font-normal cursor-pointer"
                @click="clickOnGridCard(project)"
              >
                {{ project.name.length > 60 ? project.name.substring(0, 60) + '...' : project.name }}
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
                @click="goToChildren(project)"
              />
              <p
                class="font-light text-xs text-violet-500 cursor-pointer"
                @click="openProperties(project, parentProjectUid = project.uid)"
              >
                Добавить подпроект
              </p>
            </div>
          </div>
        </div>
      </template>
      <div
        v-if="index == 0"
        class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer px-5 py-7"
        @click="openProperties(false)"
      >
        <div class="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-100">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
  </div>
</template>
