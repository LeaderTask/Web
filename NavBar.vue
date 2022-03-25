<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiMenu
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
// import NavBarItemLabel from '@/components/NavBarItemLabel.vue'
import Icon from '@/components/Icon.vue'
import Popper from 'vue3-popper'
import NavBarSearch from '@/components/NavBarSearch.vue'
import arrowBack from '@/icons/arrow-back.js'
import properties from '@/icons/properties.js'

import { PATCH_SETTINGS } from '@/store/actions/navigator.js'

const store = useStore()

defineProps({
  item: {
    type: Object,
    required: true
  },
  menu: {
    type: Array,
    default: () => []
  }
})
// const toggleLightDark = () => {
//   store.dispatch('darkMode')
// }

const localization = computed(() => store.state.localization.localization)
const navigator = computed(() => store.state.navigator.navigator)

const isNavBarVisible = computed(() => !store.state.isFullScreen)

const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)

const navStack = computed(() => store.state.navbar.navStack)

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)
const menuToggleMobile = () => {
  store.dispatch('asideMobileToggle')
}

const menuOpenLg = () => {
  store.dispatch('asideLgToggle', true)
}

const updateSettings = () => {
  store.dispatch(
    PATCH_SETTINGS,
    {
      show_completed_tasks: navigator.value.show_completed_tasks,
      add_task_to_begin: navigator.value.add_task_to_begin,
      cal_number_of_first_week: navigator.value.cal_number_of_first_week,
      cal_show_week_number: navigator.value.cal_show_week_number,
      nav_show_tags: navigator.value.nav_show_tags,
      nav_show_overdue: navigator.value.nav_show_overdue,
      nav_show_summary: navigator.value.nav_show_summary,
      nav_show_emps: navigator.value.nav_show_emps,
      nav_show_markers: navigator.value.nav_show_markers,
      language: navigator.value.language,
      stopwatch: navigator.value.stopwatch,
      cal_work_time: navigator.value.cal_work_time,
      reminders_in_n_minutes: navigator.value.reminders_in_n_minutes,
      cal_work_week: navigator.value.cal_work_week,
      compact_mode: navigator.value.compact_mode
    }
  )
}

const clickOnGridCard = (item, index) => {
  if (!item) {
    return
  }
  store.commit('removeAllFromStackAfterIndex', index)
  console.log(item)
  if ('greedPath' in item) {
    store.commit('basic', { key: 'greedPath', value: item.greedPath })
  }
  if (item.key === 'greedSource') {
    store.commit('basic', { key: 'mainSectionState', value: 'greed' })
    store.commit('basic', { key: 'greedSource', value: item.value })
  }
}

</script>
<template>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 right-0 fixed flex h-14 z-30 bg-gray-100
    transition-position xl:pl-80 w-auto lg:items-center dark:bg-gray-800 dark:border-gray-800"
    :class="{ 'ml-80 lg:ml-80':isAsideMobileExpanded, 'mr-96':isPropertiesMobileExpanded}"
  >
    <div class="flex-1 items-stretch flex h-14 py-2 pl-3">
      <nav-bar-item
        type="flex lg:hidden"
        @click.prevent="menuToggleMobile"
      >
        <icon
          :path="menuToggleMobileIcon"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        @click.prevent="menuOpenLg"
      >
        <icon
          :path="mdiMenu"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item
        class="bg-gray-50 dark:bg-gray-700 rounded-lg mr-1"
        @click="clickOnGridCard(navStack[navStack.length - 2], navStack.length - 2)"
      >
        <icon
          :path="arrowBack.path"
          :width="arrowBack.width"
          :height="arrowBack.height"
          :box="arrowBack.viewBox"
        />
      </nav-bar-item>
    </div>
    <div class="nav-scroll">
      <nav-bar-item
        v-for="(navItem, index) in navStack"
        :key="index"
        class="px-1"
      >
        <span
          v-if="navItem && navItem.name"
          class="bg-white text-black dark:bg-gray-700 rounded-lg breadcrumbs"
          @click="clickOnGridCard(navItem, index)"
        >
          {{ navItem.name.length > 15 ? navItem.name.slice(0, 15) + '...' : navItem.name }}
        </span>
      </nav-bar-item>
    </div>
    <div class="flex-none items-stretch flex h-14">
      <nav-bar-item class="px-3">
        <Popper
          class="w-full items-center"
          arrow
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
        >
          <template #content="{ close }">
            <div
              class="flex flex-col"
              @click="close"
            >
              <div class="flex items-center">
                <p>{{ localization.show_completed_tasks }}</p>
                <input
                  v-model="navigator.show_completed_tasks"
                  type="checkbox"
                  @change="updateSettings"
                >
              </div>
            </div>
          </template>
          <icon
            :path="properties.path"
            :width="properties.width"
            :height="properties.height"
            :box="properties.viewBox"
          />
        </Popper>
      </nav-bar-item>
      <!-- Search -->
      <nav-bar-item class="rounded-lg hover:text-gray-700 cursor-auto px-0">
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 20L15.514 15.506L20 20ZM18 9.5C18 11.7543 17.1045 13.9163 15.5104 15.5104C13.9163 17.1045 11.7543 18 9.5 18C7.24566 18 5.08365 17.1045 3.48959 15.5104C1.89553 13.9163 1 11.7543 1 9.5C1 7.24566 1.89553 5.08365 3.48959 3.48959C5.08365 1.89553 7.24566 1 9.5 1C11.7543 1 13.9163 1.89553 15.5104 3.48959C17.1045 5.08365 18 7.24566 18 9.5V9.5Z"
            stroke="black"
            stroke-opacity="0.5"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </nav-bar-item>
      <nav-bar-item class="px-0">
        <nav-bar-search :placeholder="localization.search" />
      </nav-bar-item>
    </div>
    <!--
    <div
      class="absolute w-screen top-14 left-0
        lg:w-auto lg:items-stretch lg:flex lg:grow lg:static dark:bg-gray-800"
      :class="[isMenuNavBarActive ? 'block' : 'hidden']"
    >
      <div class="max-h-screen-menu overflow-y-auto lg:overflow-visible lg:flex lg:items-stretch lg:justify-end lg:ml-auto">
        <nav-bar-item
          has-divider
          is-desktop-icon-only
          @click.prevent="toggleLightDark"
        >
          <nav-bar-item-label
            :icon="mdiBrightness6"
            label="Light/Dark"
            is-desktop-icon-only
          />
        </nav-bar-item>
      </div>
    </div>
    -->
  </nav>
</template>
