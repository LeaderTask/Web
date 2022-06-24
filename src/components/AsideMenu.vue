<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ModalBox from '@/components/ModalBox.vue'
import { DatePicker } from 'v-calendar'
import { mdiMenu } from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import AccModal from '@/components/AccModal.vue'
import AccTarif from '@/components/AccTarif.vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
import AccModalPass from '@/components/AccModalPass.vue'
import AccOption from '@/components/AccOption.vue'
import AccKarma from '@/components/AccKarma.vue'
import 'v-calendar/dist/style.css'

import * as TASK from '@/store/actions/tasks'
import { AUTH_LOGOUT } from '@/store/actions/auth'

const router = useRouter()

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

let modalOneActive = ref(false)
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
const navStack = computed(() => store.state.navbar.navStack)

const datePickerBG = computed(() => {
  return isDark.value ? 'rgb(31 41 55)' : '#f4f5f7'
})
const attrs = computed(() => store.state.calendar.calendar)
const user = computed(() => store.state.user.user)
const storeNavigator = computed(() => store.state.navigator.navigator)
const navig = computed(() => store.state.navig)
const getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'

const lastVisitedDate = navStack.value && navStack.value.length && navStack.value[navStack.value.length - 1].value && navStack.value[navStack.value.length - 1].value.uid && navStack.value[navStack.value.length - 1].value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b' && navStack.value[navStack.value.length - 1].value.param ? new Date(navStack.value[navStack.value.length - 1].value.param) : new Date()
const currentDate = computed({
  get: () => lastVisitedDate.value,
  set: val => {
    lastVisitedDate.value = val
    if (isPropertiesMobileExpanded.value) { store.dispatch('asidePropertiesToggle', false) }
    store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    store.dispatch(TASK.TASKS_REQUEST, val)
    // hardcoded and messy
    const navElem = {
      name: dateToLabelFormat(val),
      key: 'taskListSource',
      value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: val },
      typeVal: val,
      type: 'date'
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
  if (isPropertiesMobileExpanded.value) { store.dispatch('asidePropertiesToggle', false) }
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
  console.log(item)
  if (isPropertiesMobileExpanded.value) {
    store.dispatch('asidePropertiesToggle', false)
  }

  // desktop check
  if (item.uid === '2bad1413-a373-4926-8a3c-58677a680714') {
    const navElem = {
      name: item.label,
      key: 'greedSource',
      value: { uid: item.uid, param: null }
    }
    store.commit('updateStackWithInitValue', navElem)
    store.commit('basic', { key: 'mainSectionState', value: 'greed' })
    store.commit('basic', { key: 'greedPath', value: 'dashboard' })
    return
  }

  // do it now
  if (item.uid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25') {
    const navElem = {
      name: item.label,
      key: 'greedSource',
      value: { uid: item.uid, param: null },
      greedPath: 'doitnow'
    }
    store.commit('updateStackWithInitValue', navElem)
    store.commit('basic', { key: 'mainSectionState', value: 'greed' })
    store.commit('basic', { key: 'greedPath', value: 'doitnow' })
    return
  }

  // other
  if (item.uid === '757be87d-c269-40e0-b224-6b2bb0e4f97d') {
    const navElem = {
      name: item.label,
      key: 'greedSource',
      value: { uid: item.uid, param: null },
      greedPath: 'other'
    }
    store.commit('updateStackWithInitValue', navElem)
    store.commit('basic', { key: 'mainSectionState', value: 'greed' })
    store.commit('basic', { key: 'greedPath', value: 'other' })
    return
  }

  // Tasks list source
  if (UID_TO_ACTION[item.uid] && item.type === 'uid') {
    store.dispatch(UID_TO_ACTION[item.uid])
    const navElem = {
      name: item.label,
      key: 'taskListSource',
      value: { uid: item.uid, param: new Date() },
      typeVal: new Date(),
      type: 'date'
    }
    store.commit('updateStackWithInitValue', navElem)
    if (item.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') { lastVisitedDate.value = new Date() } // desktop check
    store.commit('basic', { key: 'taskListSource', value: { uid: item.uid, param: null } })
    store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  // Grid source (projects, employees, colors, tags)
  } else {
    store.commit('basic', { key: 'mainSectionState', value: 'greed' })
    store.commit('basic', { key: 'greedPath', value: item.path })
    if (item.path === 'new_private_projects' || item.path === 'new_emps' || item.path === 'new_delegate' || item.path === 'new_private_boards') {
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
        greedPath: item.path,
        value: storeNavigator.value[item.path].items
      }
      store.commit('updateStackWithInitValue', navElem)
      store.commit('basic', { key: 'greedSource', value: storeNavigator.value[item.path].items })
    }
  }
}
const onDayClick = (day) => {
  store.dispatch(TASK.TASKS_REQUEST, new Date(day.date))
  const navElem = {
    name: dateToLabelFormat(day.date),
    key: 'taskListSource',
    value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(day.date) },
    typeVal: new Date(day.date),
    type: 'date'
  }
  store.commit('updateStackWithInitValue', navElem)
  lastVisitedDate.value = new Date() // desktop check
  store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
}
const TitleName = () => {
  if (navig.value === 0) return ('Аккаунт')
  else if (navig.value === 1) return ('Тариф')
  else if (navig.value === 2) return ('Основное')
  else if (navig.value === 3) return ('Изменение пароля')
  else if (navig.value === 4) return ('Карма')
}
const accS = () => {
  store.commit('basic', { key: 'navig', value: 0 })
}
const tarifS = () => {
  store.commit('basic', { key: 'navig', value: 1 })
}
</script>

<template>
  <!-- Profile modal -->
  <modal-box
    v-model="modalOneActive"
    :title="TitleName()"
    @acc="accS()"
    @tarif="tarifS()"
  >
    <acc-modal
      v-if="navig === 0"
      class="text-lg"
      @AccLogout="logout()"
    />
    <acc-tarif
      v-if="navig === 1"
      class="text-lg"
    />
    <acc-modal-pass
      v-if="navig === 3"
      class="text-lg"
    />
    <acc-option
      v-if="navig === 2"
      class="text-lg"
    />
    <acc-karma
      v-if="navig === 4"
      class="text-lg"
    />
  </modal-box>
  <!-- /Profile modal -->

  <aside
    v-show="!isFullScreen"
    id="aside"
    class="w-[292px] fixed top-0 z-[2] h-screen transition-position lg:left-0 bg-[#f4f5f7] font-SfProDisplayNormal text-sm"
    :class="[ isAsideMobileExpanded ? 'left-0' : '-left-[292px]', isAsideLgActive ? 'block' : 'lg:hidden xl:block' ]"
  >
    <div class="flex flex-row w-full text-dark px-[16px] mt-[22px] h-[32px] items-center">
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
        class="group w-full cursor-pointer"
        @click="modalOneActive = true"
      >
        <div class="flex items-center">
          <img
            v-if="user?.foto_link"
            :src="user?.foto_link"
            width="32"
            height="32"
            class="rounded-[8px] ml-[5px] mr-[2px] border-2 border-white"
          >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.7602 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.70104 8.44486C6.47133 8.67154 6.10681 8.68606 5.8598 8.47836L1.46869 4.78606C1.2045 4.56391 1.17041 4.16965 1.39256 3.90546C1.61471 3.64126 2.00897 3.60718 2.27316 3.82933L6.22839 7.15512L9.87636 3.55514C10.1221 3.31269 10.5178 3.31531 10.7602 3.56099Z"
              fill="#7e7e80"
            />
          </svg>
          <span
            class="ml-[6px] text-[15px] group-hover:text-[#4c4c4d]/75 text-[#4c4c4d] font-roboto"
          >
            {{ user?.current_user_name ?? '' }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-[10px]">
      <DatePicker
        id="Maincalendar"
        ref="calendarclass"
        v-model="navStack[0].typeVal"
        dot="true"
        class="border-none pl-[22px] pr-[16px] calendar-nav-custom"
        :style="{ backgroundColor: datePickerBG }"
        show-weeknumbers="left"
        days="-1"
        color="#CCC"
        week-from-end="6"
        from-page="fromPage"
        to-page="toPage"
        is-expanded
        :locale="navigatorMenu.lang"
        :masks="{ weekdays: 'WWW' }"
        :attributes="attrs"
        :is-dark="isDark"
        mode="single"
        is-inline
        in-next-month="true"
        in-month="true"
        in-prev-month="true"
        select-attribute="dates"
        @dayclick="onDayClick"
      />
    </div>
    <div class="my-[10px]">
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
.vc-container.calendar-nav-custom
{
  @apply font-roboto;
}

.calendar-nav-custom .vc-weeknumber-content {
  @apply bg-white rounded-[6px] text-[#8b64bd] not-italic text-[11px] mt-0 mr-[2px] h-[24px] w-[24px];
}

.calendar-nav-custom .vc-weeks {
  @apply p-0;
}

.calendar-nav-custom .vc-arrow {
  @apply text-[#424242] w-[32px] h-[32px];
}

.calendar-nav-custom .vc-title {
  @apply text-[#424242] capitalize text-[15px] font-bold;
}

.calendar-nav-custom .vc-weekday {
  @apply text-[#424242] capitalize text-[12px] h-[34px] pt-0 pb-0 flex items-center justify-center font-bold;
}
.calendar-nav-custom .vc-weekday:nth-child(7), .vc-weekday:nth-child(8)
{
  @apply text-[#e23300];
}

.calendar-nav-custom .vc-header
{
  @apply mb-[2px] h-[32px] p-0;
}

.calendar-nav-custom .vc-arrows-container
{
  @apply h-[32px] p-0;
}

.calendar-nav-custom .vc-day
{
  @apply min-h-[30px] h-[30px] w-[30px];
}

.calendar-nav-custom .vc-day-content:focus
{
  @apply bg-transparent !important;
}

.calendar-nav-custom .vc-highlight,
.calendar-nav-custom .vc-highlight:focus
{
  @apply bg-[#ff9123]/40;
}

.calendar-nav-custom .vc-day-content,
.calendar-nav-custom .vc-highlight
{
  @apply rounded-[8px] w-[30px] h-[30px] border-[#ff9123]/40 text-[#424242] text-[12px] font-medium !important;
}

.calendar-nav-custom .is-not-in-month .vc-day-content,
.calendar-nav-custom .is-not-in-month .vc-highlights,
.calendar-nav-custom .is-not-in-month .vc-day-layer,
.calendar-nav-custom .is-not-in-month .vc-highlight
{
  @apply opacity-100 pointer-events-auto text-black/50 !important;
}

.calendar-nav-custom .vc-day.weekday-7:not(.is-not-in-month) .vc-day-content,
.calendar-nav-custom .vc-day.weekday-1:not(.is-not-in-month) .vc-day-content
{
  @apply text-red-500 !important;
}

.calendar-nav-custom .dots-back
{
  background-color: #444444!important;
  height: 3px !important;
  width: 3px !important;
  position: relative !important;
  top: 11px !important;
  border-radius: 9999px !important;
}
</style>
