<template>
  <NavbarSearchLimit
    v-if="showFreeModal"
    @cancel="showFreeModal = false"
  />
  <div class="flex gap-[10px] items-center px-3">
    <div
      v-if="!showSearchBar && lastGreedPath !== 'reglament_content' && lastGreedPath !== 'reglaments'"
      class="flex-none flex gap-[5px] p-[8px] cursor-pointer text-[#7e7e80] hover:text-[#7e7e80]/75"
      @click="onShowSearchBar"
    >
      <svg
        class="flex-none"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
          fill="currentColor"
        />
      </svg>
      <p class="font-roboto text-[14px]">
        Поиск
      </p>
    </div>
    <div
      v-if="showSearchBar"
      class="flex-none flex gap-[5px] items-center h-[40px] w-[160px] overflow-hidden px-[8px] text-[#7e7e80] bg-white rounded-[10px]"
    >
      <svg
        class="flex-none"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
          fill="currentColor"
        />
      </svg>
      <input
        ref="searchInput"
        v-model="searchText"
        maxlength="100"
        type="text"
        class="w-full font-roboto text-[14px] leading-[16px] border-0 focus:ring-0 p-0"
        @keyup.enter="sendSearchRequest"
        @blur="onBlurSearchInput"
      >
      <svg
        v-if="searchText"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        class="cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        data-v-1ded894d=""
        @click="erase"
      >
        <path
          d="M14.8486 2.84858C15.3172 2.37995 15.3172 1.62015 14.8486 1.15152C14.3799 0.682892 13.6202 0.682892 13.1515 1.15152L8.00005 6.30299L2.84858 1.15152C2.37995 0.682892 1.62015 0.682892 1.15152 1.15152C0.682891 1.62015 0.682891 2.37995 1.15152 2.84858L6.30299 8.00005L1.15152 13.1515C0.682891 13.6202 0.682891 14.3799 1.15152 14.8486C1.62015 15.3172 2.37995 15.3172 2.84858 14.8486L8.00005 9.69711L13.1515 14.8486C13.6202 15.3172 14.3799 15.3172 14.8486 14.8486C15.3172 14.3799 15.3172 13.6202 14.8486 13.1515L9.69711 8.00005L14.8486 2.84858Z"
          fill="black"
          fill-opacity="0.5"
          data-v-1ded894d=""
        />
      </svg>
    </div>
    <NavBarButtonsBoard
      v-if="lastGreedPath === 'boards_children'"
      :board-uid="lastNavStackUid"
      @popNavBar="popNavBar"
    />
    <NavBarButtonsReglament
      v-if="lastGreedPath === 'reglament_content'"
      :reglament-uid="lastNavStackUid"
      @popNavBar="popNavBar"
    />
    <NavBarButtonsProject
      v-if="lastGreedPath === 'projects_children'"
      :project-uid="lastNavStackUid"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
    <NavBarButtonsColor
      v-if="isColorTaskList"
      :color-uid="lastNavStackTypeVal"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
    <NavBarButtonsTag
      v-if="isTagTaskList"
      :tag-uid="lastTag"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
    <NavBarButtonsTasks
      v-if="isTaskList"
      :show-completed-tasks="showCompletedTasks"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
  </div>
</template>

<script>
import { PATCH_SETTINGS } from '@/store/actions/navigator'
import { visitChildren, UID_TO_ACTION } from '@/store/helpers/functions'
import * as TASK from '@/store/actions/tasks'
import * as BOARD from '@/store/actions/boards'
import { notify } from 'notiwind'

import NavBarButtonsBoard from '@/components/Navbar/NavBarButtonsBoard.vue'
import NavBarButtonsProject from '@/components/Navbar/NavBarButtonsProject.vue'
import NavBarButtonsReglament from '@/components/Navbar/NavBarButtonsReglament.vue'
import NavBarButtonsColor from '@/components/Navbar/NavBarButtonsColor.vue'
import NavbarSearchLimit from '@/components/Navbar/NavbarSearchLimit'
import NavBarButtonsTag from '@/components/Navbar/NavBarButtonsTag.vue'
import NavBarButtonsTasks from '@/components/Navbar/NavBarButtonsTasks.vue'

export default {
  components: {
    NavBarButtonsBoard,
    NavBarButtonsProject,
    NavBarButtonsReglament,
    NavBarButtonsColor,
    NavBarButtonsTag,
    NavbarSearchLimit,
    NavBarButtonsTasks
  },
  emits: ['popNavBar'],
  data: () => ({
    showSearchBar: false,
    searchText: '',
    showFreeModal: false
  }),
  computed: {
    settings () {
      return this.$store.state.navigator.navigator.settings
    },
    user () {
      return this.$store.state.user.user
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    lastGreedPath () {
      return this.navStack[this.navStack.length - 1]?.greedPath ?? ''
    },
    lastNavStackUid () {
      return this.navStack[this.navStack.length - 1]?.uid ?? ''
    },
    lastNavStackKey () {
      return this.navStack[this.navStack.length - 1]?.key ?? ''
    },
    lastNavStackType () {
      return this.navStack[this.navStack.length - 1]?.type ?? ''
    },
    lastNavStackTypeVal () {
      return this.navStack[this.navStack.length - 1]?.typeVal ?? ''
    },
    lastTag () {
      return this.navStack[this.navStack.length - 1]?.uid
    },
    showCompletedTasks () {
      return this.settings?.show_completed_tasks ?? false
    },
    isTaskList () {
      if (this.isColorTaskList) return false
      if (this.isTagTaskList) return false
      return this.lastNavStackKey === 'taskListSource'
    },
    isColorTaskList () {
      return this.lastNavStackType === 'color'
    },
    isTagTaskList () {
      return this.navStack[this.navStack.length - 1].greedPath === 'tags_children'
    }
  },
  watch: {
    navStack: {
      immediate: true,
      handler: function (val) {
        this.searchText = ''
        this.showSearchBar = false
      }
    },
    searchText () {
      if (this.lastGreedPath === 'boards_children') {
        this.$store.commit(BOARD.SHOW_SEARCH_CARDS, this.searchText)
      }
    }
  },
  methods: {
    updateSettings () {
      this.$store.dispatch(
        PATCH_SETTINGS,
        {
          show_completed_tasks: this.settings.show_completed_tasks ? 1 : 0,
          add_task_to_begin: this.settings.add_task_to_begin ? 1 : 0,
          cal_number_of_first_week: this.settings.cal_number_of_first_week ? 1 : 0,
          cal_show_week_number: this.settings.cal_show_week_number ? 1 : 0,
          nav_show_tags: this.settings.nav_show_tags ? 1 : 0,
          nav_show_overdue: this.settings.nav_show_overdue ? 1 : 0,
          nav_show_summary: this.settings.nav_show_summary ? 1 : 0,
          nav_show_emps: this.settings.nav_show_emps ? 1 : 0,
          nav_show_markers: this.settings.nav_show_markers ? 1 : 0,
          language: this.settings.language,
          stopwatch: this.settings.stopwatch ? 1 : 0,
          cal_work_time: this.settings.cal_work_time,
          reminders_in_n_minutes: this.settings.reminders_in_n_minutes,
          cal_work_week: this.settings.cal_work_week,
          compact_mode: this.settings.compact_mode ? 1 : 0
        }
      ).then(() => {
        this.requestLastVisitedNav()
      })
    },
    requestLastVisitedNav () {
      if (this.$store.state.auth.token) {
        // Process saved last visited nav
        if (this.navStack.length && this.navStack.length > 0) {
          if (this.navStack[this.navStack.length - 1].key === 'taskListSource') {
            const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].value.uid]
            if (!action) {
              console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].value.uid)
              return
            }
            this.$store.dispatch(action, this.navStack[this.navStack.length - 1].value.param)
            this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
            this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: this.navStack[this.navStack.length - 1].value })
          }
        } else {
          this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
          this.$store.commit(
            'updateStackWithInitValue',
            { name: 'Today', key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } }
          )

          this.$store.dispatch(TASK.TASKS_REQUEST, new Date())
            .then(() => {
              this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
            })
            .catch((err) => console.log(err))
        }
      }
      // After navigator is loaded we are trying to set up last visited navElement
      // Checking if last navElement is a gridSource
      if (this.navStack.length && this.navStack.length > 0) {
        if (this.navStack[this.navStack.length - 1].key === 'greedSource') {
          this.$store.commit('basic', { key: 'greedPath', value: this.navStack[this.navStack.length - 1].greedPath })
          this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })

          // If last navElement is related to processed navigator instance with 'new_' prefix
          // then we pass entire object from storeNavigator
          if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: this.$store.state.navigator.navigator[this.navStack[this.navStack.length - 1].greedPath] })

            // if last visited navElem is in nested in children, then we trying to find these children with visitChildren function
            // from storeNavigator
          } else if (['tags_children', 'projects_children', 'boards_children'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            if (this.navStack[this.navStack.length - 1].greedPath === 'tags_children') {
              // nested lookup for tags
              visitChildren(this.$store.state.navigator.navigator.tags.items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
            }

            // nested lookup for shared and private projects
            if (this.navStack[this.navStack.length - 1].greedPath === 'projects_children') {
              // Requests project's tasks
              const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].global_property_uid]
              if (!action) {
                console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].global_property_uid)
                return
              }
              this.$store.dispatch(action, this.navStack[this.navStack.length - 1].uid)
              this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.navStack[this.navStack.length - 1].global_property_uid, param: this.navStack[this.navStack.length - 1].uid } })

              visitChildren(this.$store.state.navigator.navigator.new_private_projects[0].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
              visitChildren(this.$store.state.navigator.navigator.new_private_projects[1].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
            }

            // nested lookup for shared and private boards
            if (this.navStack[this.navStack.length - 1].greedPath === 'boards_children') {
              // Requests project's tasks
              const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].global_property_uid]
              if (!action) {
                console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].global_property_uid)
                return
              }
              this.$store.dispatch(action, this.navStack[this.navStack.length - 1].uid)
              this.$store.commit('basic', { key: 'cardSource', value: { uid: this.navStack[this.navStack.length - 1].global_property_uid, param: this.navStack[this.navStack.length - 1].uid } })

              visitChildren(this.$store.state.navigator.navigator.new_private_boards[0].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
              visitChildren(this.$store.state.navigator.navigator.new_private_boards[1].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
            }
            // colors
          } else {
            this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: this.$store.state.navigator.navigator[this.navStack[this.navStack.length - 1].greedPath].items })
          }
        }
      }
    },
    popNavBar () {
      this.$emit('popNavBar')
    },
    sendSearchRequest () {
      if (this.lastGreedPath !== 'boards_children') {
        if (this.searchText.length > 3) {
          const navElem = {
            name: 'Поиск: ' + this.searchText,
            key: 'taskListSource',
            value: { uid: '11212e94-cedf-11ec-9d64-0242ac120002', param: this.searchText }
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
          this.$store.commit('basic', { key: 'taskListSource', value: navElem.value })
          this.$store.dispatch(TASK.SEARCH_TASK, this.searchText).then((resp) => {
            console.log('Search Tasks', resp)
          })
        } else {
          notify(
            {
              group: 'api',
              title: 'Длина запроса должна быть более 3 символов',
              action: '',
              text: ''
            },
            15000
          )
        }
      }
    },
    onBlurSearchInput () {
      if (this.searchText.length === 0) {
        this.showSearchBar = false
      }
    },
    onShowSearchBar () {
      if (this.user.tarif === 'free') {
        this.showFreeModal = true
        return
      }
      this.showSearchBar = true
      this.$nextTick(function () {
        this.$refs.searchInput.focus({ preventScroll: false })
      })
    },
    onChangeCompletedTasks () {
      this.settings.show_completed_tasks = !this.showCompletedTasks
      this.updateSettings()
    },
    erase () {
      this.searchText = ''
      this.$nextTick(function () {
        this.$refs.searchInput.focus({ preventScroll: false })
      })
    }
  }
}
</script>

<style scoped>
</style>
