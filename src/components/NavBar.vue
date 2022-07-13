<script>
import {
  mdiForwardburger,
  mdiBackburger,
  mdiMenu
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import Popper from 'vue3-popper'
import NavButtonsRight from '@/components/Navbar/NavBarButtonsRight.vue'

import propertiesproject from '@/icons/propertiesproject.js'
import add from '@/icons/add.js'
import arrowForward from '@/icons/arrow-forward.js'
import arrowDown from '@/icons/arrow-down.js'

import { SELECT_PROJECT } from '@/store/actions/projects'

export default {
  components: {
    NavBarItem,
    Icon,
    Popper,
    NavButtonsRight
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showNoneUid: [
        '46418722-a720-4c9e-b255-16db4e590c34',
        '017a3e8c-79ac-452c-abb7-6652deecbd1c',
        'fa042915-a3d2-469c-bd5a-708cf0339b89',
        '2a5cae4b-e877-4339-8ca1-bd61426864ec',
        'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0'
      ],
      mdiForwardburger,
      mdiBackburger,
      mdiMenu,
      propertiesproject,
      add,
      arrowForward,
      arrowDown,
      isTaskHoverPopperActive: false
    }
  },
  computed: {
    isNavBarVisible () {
      return !this.$store.state.isFullScreen
    },
    user () {
      return this.$store.state.user.user
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    projects () {
      return this.$store.state.projects.projects
    },
    menuToggleMobileIcon () {
      return this.isAsideMobileExpanded ? this.mdiBackburger : this.mdiForwardburger
    }
  },
  methods: {
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    toggleTaskHoverPopper (val) {
      this.isTaskHoverPopperActive = val
    },
    menuToggleMobile () {
      this.$store.dispatch('asideMobileToggle')
    },
    menuOpenLg () {
      this.$store.dispatch('asideLgToggle', true)
    },
    clickOnGridCard (item, index) {
      this.$store.dispatch('gotoNavStackItem', index)
    },
    openProjectProperties (project, parentProjectUid = '') {
      if (!this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }

      this.$store.commit('basic', { key: 'propertiesState', value: 'project' })

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
          email_creator: this.user.current_user_email,
          members: [this.user.current_user_email],
          children: [],
          uid: '',
          name: '',
          bold: 0
        }
      } else {
        project = this.projects[project]
      }
      this.$store.commit(SELECT_PROJECT, project)
    },
    popNavBar () {
      this.$store.dispatch('popNavStack')
    }
  }
}
</script>

<template>
  <pre
    v-if="navStack.length && showNoneUid.includes(navStack[navStack.length - 1].uid)"
    class="md:text-lg sm:text-base"
  >
    У вас пока нет задач этой категории!
  </pre>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 pt-2 right-0 fixed flex h-14 z-[10] bg-[#f4f5f7] font-['Roboto']
    transition-position xl:ml-72 w-auto lg:items-center dark:bg-gray-800 dark:border-gray-800"
    :class="{ 'ml-80':isAsideMobileExpanded, 'mr-96':isPropertiesMobileExpanded }"
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
    </div>
    <div class="nav-scroll">
      <nav-bar-item
        v-for="(navItem, index) in navStack"
        :key="index"
        class="px-1 group"
      >
        <span
          v-if="navItem && navItem.name"
          class="font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] breadcrumbs"
          :class="index === 0 ? 'text-[#7E7E80] font-medium' : index+1 === navStack.length ? 'text-[#4C4C4D] font-medium' : 'text-[#7E7E80] font-medium'"
          @click.stop="clickOnGridCard(navItem, index), closeProperties()"
        >
          {{ navItem.name.length > 15 ? navItem.name.slice(0, 15) + '...' : (((new Date(navItem.value?.param).getDate() + new Date(navItem.value?.param).getMonth() + new Date(navItem.value?.param).getMonth()) === (new Date().getDate() + new Date().getMonth() + new Date().getMonth()) && navItem.value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') ? 'Сегодня' : navItem.name) }}
          <Popper
            class="items-center"
            :class="isDark ? 'dark' : 'light'"
            placement="bottom"
            @click.stop="toggleTaskHoverPopper(true)"
            @open:popper="toggleTaskHoverPopper(true)"
            @close:popper="toggleTaskHoverPopper(false)"
          >

            <template #content>
              <div class="flex flex-col w-60">
                <div
                  class="text-[13px] flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1 rounded-md"
                  @click="openProjectProperties(navItem.uid)"
                >
                  <icon
                    class="mr-3 text-gray-500 p-1"
                    :path="propertiesproject.path"
                    :width="16"
                    :height="10"
                    :box="propertiesproject.viewBox"
                  />
                  Открыть свойства проекта
                </div>
                <div
                  v-if="projects[navItem.uid] && projects[navItem.uid].email_creator === user.current_user_email"
                  class="font-medium flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1 mr-1 rounded-md"
                  @click="openProjectProperties(false, navItem.uid)"
                >

                  <icon
                    class="mr-2 text-gray-500 p-2"
                    :path="add.path"
                    :width="14"
                    :height="13"
                    :box="add.viewBox"
                  />
                  Добавить подпроект
                </div>
              </div>
            </template>
            <icon
              v-if="navItem.greedPath === 'projects_children' && index === (navStack.length - 1)"
              class="invisible ml-0.5 text-gray-500 group-hover:visible"
              :path="arrowDown.path"
              :width="10"
              :height="10"
              :box="arrowDown.viewBox"
            />
          </Popper>
        </span>
        <div>
          <icon
            v-if="index !== navStack.length - 1"
            class="ml-2.5 mr-0.5 text-gray-500"
            :path="arrowForward.path"
            :width="6"
            :height="12"
            :box="arrowForward.viewBox"
          />
        </div>
      </nav-bar-item>
    </div>
    <div>
      <NavButtonsRight
        @popNavBar="popNavBar"
      />
    </div>
  </nav>
</template>
