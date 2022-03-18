<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ModalBox from '@/components/ModalBox.vue'
import { DatePicker } from 'v-calendar'
import { mdiMenu } from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
import AccModal from '@/components/AccModal.vue'

import * as TASK from '@/store/actions/tasks'
import { AUTH_LOGOUT } from '@/store/actions/auth'

import ArrowDown from '@/icons/arrow-down.js'

const router = useRouter()

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

let modalOneActive = ref(false)
var navig = ref(0)
// Serves as linkage between requests from storage and tree view navigator
const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST
}

const store = useStore()
const isFullScreen = computed(() => store.state.isFullScreen)
const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)
const isDark = computed(() => store.state.darkMode)

const datePickerBG = computed(() => {
  return isDark.value ? 'rgb(31 41 55)' : 'rgb(243 244 246)'
})
const localization = computed(() => store.state.localization.localization)
const attrs = computed(() => store.state.calendar.calendar)
const user = computed(() => store.state.user.user)
const storeNavigator = computed(() => store.state.navigator.navigator)

const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'

const currentDate = computed({
  get: () => new Date(),
  set: val => {
    store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    store.dispatch(TASK.TASKS_REQUEST, val)
    // hardcoded and messy
    const navElem = {
      name: dateToLabelFormat(val),
      key: 'taskListSource',
      value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: val }
    }
    store.commit('updateStackWithInitValue', navElem)
    store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: val } })
    store.commit(TASK.CLEAN_UP_LOADED_TASKS)
  }
})
const navigatorMenu = reactive({
  tasks: false,
  foldableNavigator: false,
  lang: getNavigatorLanguage(),
  currentDate: currentDate,
  themeStyles: {
    dayNotInMonth: 'not-in-month'
  }
})
const logout = () => {
  modalOneActive = false
  store.dispatch(AUTH_LOGOUT)
  router.push('/login')
}

function dateToLabelFormat (calendarDate) {
  const day = calendarDate.getDate()
  const month = calendarDate.toLocaleString('default', { month: 'short' })
  const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
  return day + ' ' + month + ', ' + weekday
}

const asideLgClose = () => {
  store.dispatch('asideLgToggle', false)
}

// TODO: clean up messy logic
const menuClick = (event, item) => {
  if (isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', false)
  }

  // Tasks list source
  if (UID_TO_ACTION[item.uid] && item.type === 'uid') {
    store.dispatch(UID_TO_ACTION[item.uid])
    const navElem = {
      name: item.label,
      key: 'taskListSource',
      value: { uid: item.uid, param: null }
    }
    store.commit('updateStackWithInitValue', navElem)
    store.commit('basic', { key: 'taskListSource', value: { uid: item.uid, param: null } })
    store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  // Grid source (projects, employees, colors, tags)
  } else {
    store.commit('basic', { key: 'mainSectionState', value: 'greed' })
    store.commit('basic', { key: 'greedPath', value: item.path })
    if (item.path === 'new_private_projects' || item.path === 'new_emps' || item.path === 'new_delegate') {
      const navElem = {
        name: item.label,
        key: 'greedSource',
        greedPath: item.path,
        value: storeNavigator.value[item.path]
      }
      store.commit('updateStackWithInitValue', navElem)
      store.commit('basic', { key: 'greedSource', value: storeNavigator.value[item.path] })
    } else {
      const navElem = {
        name: item.label,
        key: 'greedSource',
        value: storeNavigator.value[item.path].items
      }
      store.commit('updateStackWithInitValue', navElem)
      store.commit('basic', { key: 'greedSource', value: storeNavigator.value[item.path].items })
    }
  }

  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
const accS = () => {
  navig.value = 0
}
const tarifS = () => {
  navig.value = 1
}
//  document.getElementById('Maincalendar').classList.remove('is-not-in-month')
</script>

<template>
  <!-- Profile modal -->
  <modal-box
    v-model="modalOneActive"
    title="Аккаунт"
    @acc="accS()"
    @tarif="tarifS()"
  >
  <acc-modal
  v-if="navig === 0"
  />
  </modal-box>
  <!-- /Profile modal -->

  <aside
    v-show="!isFullScreen"
    id="aside"
    class="w-80 fixed top-0 z-40 h-screen transition-position lg:left-0"
    :class="[ isAsideMobileExpanded ? 'left-0' : '-left-80', isAsideLgActive ? 'block' : 'lg:hidden xl:block' ]"
  >
    <div class="flex flex-row w-full text-dark flex-1 h-12 items-center">
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        active-color="text-dark"
        active
        @click="asideLgClose"
      >
        <icon
          :path="mdiMenu"
          class="cursor-pointer"
          size="24"
        />
      </nav-bar-item>
      <div
        class="w-full px-6 cursor-pointer"
        @click="modalOneActive = true"
      >
        <div class="flex">
          <img
            :src="user.foto_link"
            width="40"
            height="40"
            class="rounded-lg border-2 border-white dark:border-gray-200 mr-1"
          >
          <icon
            :path="ArrowDown.path"
            class="cursor-pointer mr-2"
            :box="ArrowDown.viewBox"
            :width="ArrowDown.width"
            :height="ArrowDown.height"
          />
          <span
            class="text-sm my-auto"
          >
            {{ user.current_user_name }}
          </span>
        </div>
      </div>
    </div>
    <nav-bar-item class="rounded-b-3xl pt-0 mt-0">
      <DatePicker
        v-model="navigatorMenu.currentDate"
        class="border-none text-xs px-3"
        style="border: none!important;"
        :style="{ backgroundColor: datePickerBG }"
        id="Maincalendar"
        show-weeknumbers
        color="yellow"
        is-expanded
        :locale="navigatorMenu.lang"
        :masks="{ weekdays: 'WW' }"
        :attributes="attrs"
        :nav-visibility="visible"
        :is-dark="isDark"
       />
    </nav-bar-item>
    <div class="my-5">
      <template v-for="(menuGroup, index) in menu">
        <div
          v-if="typeof menuGroup === 'string'"
          :key="`a-${index}`"
          class="my-2"
        >
          <hr
            :key="`a-${index}`"
            class="text-xs mx-3 custom-border-divider"
            :class="[ asideMenuLabelStyle ]"
          >
        </div>
        <aside-menu-list
          v-else
          :key="`b-${index}`"
          :menu="menuGroup"
          @menu-click="menuClick"
        />
      </template>
    </div>
  </aside>
</template>

<style>
  .navigator-tree .e-list-text {
    font-size: 16px!important;
  }
  .navigator-tree .e-ul, .navigator-tree .e-text-content{
    padding-left: 4px!important;
  }
  .navigator-tree .e-icon-collapsible, .navigator-tree .e-icon-expandable {
    float: right;
    margin-right: 20px
  }
  .navigator-tree .e-level-1 > .e-text-content .e-list-text {
    color: gray;
    padding-left: 0px;
  }
  .navigator-tree .e-level-2 > .e-text-content {
    padding-left: 0px;
  }
  .vc-weeks {
    padding: 0;
  }
  .vc-arrow {
    @apply bg-white text-gray-800 rounded-xl dark:bg-gray-800 dark:text-white
  }
  .vc-weeknumber-content {
    @apply bg-white dark:bg-gray-800 rounded-lg text-violet-600 dark:text-white;
  }
  .vc-title {
    color: #2A2927;
  }
  .vc-weekday {
    color: #2A2927;
  }
  .vc-header {
    margin-bottom: 10px;
  }
  .vc-arrows-container {
    padding-left: 0;
    padding-right: 0;
  }
  .vc-container .vc-day-content:hover:not(.is-disabled) {
    @apply bg-gray-400 text-white;
  }
  .vc-container .vc-day-content.is-disabled {
    @apply pointer-events-none;
  }
  .vc-container .vc-day-content.is-disabled:hover {
    @apply bg-transparent;
  }
  .vc-day.is-not-in-month *:not(.is-disabled) {
    @apply opacity-100 text-gray-500 pointer-events-auto;
  }
  .vc-day.is-not-in-month .is-disabled  {
    @apply opacity-100 text-gray-400 pointer-events-none;
  }
  .vc-day.weekday-7 {
    @apply text-red-500;
  }
  .vc-day.weekday-1 {
    @apply text-red-500;
  }
  .vc-weekday:nth-last-of-type(-n+2) {
    @apply text-red-500;
  }
</style>
