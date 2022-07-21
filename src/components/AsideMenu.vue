<script>
import EventAlert from '@/components/EventAlert.vue'
import ModalBox from '@/components/ModalBox.vue'
import { DatePicker } from 'v-calendar'
import NavBarItem from '@/components/NavBarItem.vue'
import DoitnowLimit from '@/components/Doitnow/DoitnowLimit.vue'
import Icon from '@/components/Icon.vue'
import AccModal from '@/components/AccModal.vue'
import AccTarif from '@/components/AccTarif.vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
import AccOption from '@/components/AccOption.vue'
import AccKarma from '@/components/AccKarma.vue'
import 'v-calendar/dist/style.css'
import { UID_TO_ACTION } from '@/store/helpers/functions'

import warn from '@/icons/warn.js'
import { mdiMenu } from '@mdi/js'

import * as TASK from '@/store/actions/tasks'
import { AUTH_LOGOUT } from '@/store/actions/auth'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    EventAlert,
    ModalBox,
    DoitnowLimit,
    DatePicker,
    NavBarItem,
    Icon,
    AccModal,
    AccTarif,
    AsideMenuList,
    AccOption,
    AccKarma
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      mdiMenu,
      warn,
      showFreeModal: false,
      modalOneActive: false,
      lastVisitedDate: this.navStack && this.navStack.length && this.navStack[this.navStack.length - 1] && this.navStack[this.navStack.length - 1].uid && this.navStack[this.navStack.length - 1].uid === '901841d9-0016-491d-ad66-8ee42d2b496b' && this.navStack[this.navStack.length - 1].param ? new Date(this.navStack[this.navStack.length - 1].param) : new Date(),
      currentSettingsTab: 'account'
    }
  },
  computed: {
    isFullScreen () {
      return this.$store.state.isFullScreen
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isAsideLgActive () {
      return this.$store.state.isAsideLgActive
    },
    isDark () {
      return this.$store.state.darkMode
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    datePickerBG () {
      return this.isDark ? 'rgb(31 41 55)' : '#f4f5f7'
    },
    attrs () {
      return this.$store.state.calendar.calendar
    },
    user () {
      return this.$store.state.user.user
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    getNavigatorLanguage () {
      return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'
    },
    favoriteBoards () {
      const arr = []
      const boards = this.$store.state.boards.boards
      Object.keys(boards).forEach(key => {
        if (boards[key].favorite === 1) {
          arr.push(boards[key])
        }
      })
      return arr
    },
    favoriteProjects () {
      const arr = []
      const projects = this.$store.state.projects.projects
      Object.keys(projects).forEach(key => {
        if (projects[key].favorite === 1) {
          arr.push(projects[key])
        }
      })
      return arr
    }
  },
  methods: {
    logout () {
      this.modalOneActive = false
      this.$store.dispatch(AUTH_LOGOUT)
      this.$router.push('/login')
      if (this.isPropertiesMobileExpanded) { this.$store.dispatch('asidePropertiesToggle', false) }
    },
    changeSettingsTab (tabName) {
      this.currentSettingsTab = tabName
    },
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      return day + ' ' + month + ', ' + weekday
    },
    asideLgClose () {
      this.$store.dispatch('asideLgToggle', false)
    },
    // TODO: clean up messy logic
    menuClick (event, item) {
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }

      // do it now
      if (item.uid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25') {
        if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
          this.showFreeModal = true
          return
        }
        const navElem = {
          name: item.label,
          key: 'greedSource',
          value: { uid: item.uid, param: null },
          greedPath: 'doitnow'
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: 'doitnow' })
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
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: 'other' })
        return
      }

      // Tasks list source
      if (UID_TO_ACTION[item.uid] && item.type === 'uid') {
        this.$store.dispatch(UID_TO_ACTION[item.uid])
        const navElem = {
          name: item.label,
          key: 'taskListSource',
          value: { uid: item.uid, param: new Date() },
          typeVal: new Date(),
          type: 'date'
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        if (item.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') { this.lastVisitedDate = new Date() } // desktop check
        this.$store.commit('basic', { key: 'taskListSource', value: { uid: item.uid, param: null } })
        this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      // Grid source (projects, employees, colors, tags)
      } else {
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: item.path })
        if (item.path === 'new_private_projects' || item.path === 'new_emps' || item.path === 'new_delegate' || item.path === 'new_private_boards') {
          const navElem = {
            name: item.label,
            key: 'greedSource',
            greedPath: item.path,
            value: this.storeNavigator[item.path]
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path] })
        } else {
          const navElem = {
            name: item.label,
            key: 'greedSource',
            greedPath: item.path,
            value: this.storeNavigator[item.path].items
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path].items })
        }
      }
    },
    onDayClick (day) {
      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.dispatch(TASK.TASKS_REQUEST, new Date(day.date))
      const navElem = {
        name: this.dateToLabelFormat(day.date),
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(day.date) },
        typeVal: new Date(day.date),
        type: 'date'
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.lastVisitedDate = new Date() // desktop check
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(day.date) } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    },
    TitleName () {
      if (this.currentSettingsTab === 'account') return ('Аккаунт')
      else if (this.currentSettingsTab === 'tarif') return ('Тариф')
      else if (this.currentSettingsTab === 'main') return ('Основное')
      else if (this.currentSettingsTab === 'karma') return ('Карма')
    },
    goToBoard (board) {
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      const path = 'new_private_boards'
      const el = {
        greedPath: path,
        key: 'greedSource',
        name: 'Доски',
        value: this.storeNavigator[path]
      }
      this.$store.commit('updateStackWithInitValue', el)

      this.$store.dispatch(CARD.BOARD_CARDS_REQUEST, board.uid)
      this.$store.commit('basic', {
        key: 'cardSource',
        value: { uid: board.global_property_uid, param: board.uid }
      })

      const navElem = {
        name: board.name,
        key: 'greedSource',
        uid: board.uid,
        global_property_uid: board.global_property_uid,
        greedPath: 'boards_children',
        value: board.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: board.children })
      this.$store.commit('basic', {
        key: 'greedPath',
        value: 'boards_children'
      })
    },
    goToProject (project) {
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      const path = 'new_private_projects'
      const el = {
        name: 'Проекты',
        key: 'greedSource',
        greedPath: path,
        value: this.storeNavigator[path]
      }
      this.$store.commit('updateStackWithInitValue', el)

      this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, project.uid)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: project.global_property_uid, param: project.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: project.name,
        key: 'greedSource',
        uid: project.uid,
        global_property_uid: project.global_property_uid,
        greedPath: 'projects_children',
        value: project.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: project.children })
      this.$store.commit('basic', { key: 'greedPath', value: 'projects_children' })
    }
  }
}
</script>

<template>
  <!-- Profile modal -->
  <modal-box
    v-model="modalOneActive"
    :title="TitleName()"
    @currentSettingsTab="changeSettingsTab"
  >
    <DoitnowLimit
      v-if="showFreeModal"
      @cancel="showFreeModal = false"
    />
    <acc-modal
      v-if="currentSettingsTab === 'account'"
      @currentSettingsTab="changeSettingsTab ('tarif')"
      @AccLogout="logout()"
    />
    <acc-tarif
      v-if="currentSettingsTab === 'tarif'"
    />
    <acc-option
      v-if="currentSettingsTab === 'main'"
    />
    <acc-karma
      v-if="currentSettingsTab === 'karma'"
    />
  </modal-box>
  <!-- /Profile modal -->

  <aside
    v-show="!isFullScreen"
    id="aside"
    style="overflow-x:hidden; scrollbar-width: none;"
    class="w-[292px] fixed top-0 z-30 h-screen transition-position lg:left-0 bg-[#f4f5f7] font-SfProDisplayNormal text-sm"
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
        dot="true"
        class="border-none pl-[22px] pr-[16px] calendar-nav-custom"
        :style="{ backgroundColor: datePickerBG }"
        show-weeknumbers="left"
        days="-1"
        color="#CCC"
        week-from-end="6"
        is-expanded
        :locale="getNavigatorLanguage"
        :masks="{ weekdays: 'WWW' }"
        :attributes="attrs"
        :is-dark="isDark"
        mode="single"
        is-inline
        in-next-month="true"
        in-month="true"
        in-prev-month="true"
        @dayclick="onDayClick"
      />
    </div>
    <EventAlert
      v-if="user?.tarif === 'free' || user?.tarif === 'trial'"
      :bg-color="'#FF912380'"
      :text-color="'white'"
      :user-icon="warn"
      :link="'https://www.leadertask.ru/alpha'"
      :message-text="user?.tarif === 'trial' ? 'Пробный тариф.' : 'Закончилась лицензия.'"
    />
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
          :favorite-boards="favoriteBoards"
          :favorite-projects="favoriteProjects"
          @menu-click="menuClick"
          @go-to-favorite-board="board => goToBoard(board)"
          @go-to-favorite-project="proj => goToProject(proj)"
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
  @apply bg-[#ff9123]/70 !important;
}

.calendar-nav-custom .vc-highlight,
.calendar-nav-custom .vc-highlight:focus
{
  @apply bg-[#ff9123]/50;
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
