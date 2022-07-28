<template>
  <modal-box-notification-instruction
    v-model="shouldShowModalBox"
    button="warning"
    has-button
    has-cancel
    button-label="Хорошо, я понял"
    @confirm="setShouldShowModalValue('0')"
  >
    <p>
      Мы используем системные уведомления для отображения важных событий в приложении, которые нельзя увидеть при свернутом браузере или в другой вкладке.
    </p>
    <p>
      Чтобы всегда быть в курсе актуального положения дел, пожалуйста, разрешите отображение уведомлений в настройках браузера.
    </p>
    <p>
      Инстрyкции как включить уведомления для разных браузеров:
    </p>
    <a
      href="https://support.google.com/chrome/answer/3220216?hl=ru&co=GENIE.Platform%3DAndroid"
      target="_blank"
      class="text-blue-400"
    >Google Chrome</a>
    <br>
    <a
      href="https://support.apple.com/ru-ru/guide/safari/sfri40734/mac"
      target="_blank"
      class="text-blue-400"
    >Safari</a>
    <br>
    <a
      href="https://sendpulse.com/ru/knowledge-base/push-notifications/enable-disable-push-notifications-mozilla-firefox"
      target="_blank"
      class="text-blue-400"
    >Firefox</a>
  </modal-box-notification-instruction>
  <main-section class="h-full">
    <aside-menu
      v-if="!isFileRedirect"
      :menu="menu"
    />
    <overlay
      v-if="!isFileRedirect"
      v-show="isAsideLgActive"
      :z-index="'z-20'"
      @overlay-click="overlayClick"
    />
    <nav-bar v-if="!isFileRedirect" />
    <properties-right v-if="!isFileRedirect" />
    <ErrorNotification v-if="!isFileRedirect" />
    <Notification v-if="!isFileRedirect" />
    <InspectorNotification v-if="!isFileRedirect" />
    <TasksListNew
      v-if="mainSectionState === 'tasks'"
    />
    <!-- Greed section -->
    <div
      v-if="mainSectionState === 'greed'"
      class="h-full"
      :class="{ 'overflow-auto scroll-style relative': greedPath === 'doitnow', 'h-auto': greedPath === 'projects_children' }"
    >
      <projects
        v-if="greedPath === 'new_private_projects'"
        :items="greedSource"
      />
      <reglaments
        v-if="greedPath === 'reglaments'"
        :items="greedSource"
      />
      <boards
        v-if="greedPath === 'new_private_boards'"
        :boards="greedSource"
      />
      <doitnow
        v-if="greedPath === 'doitnow'"
      />
      <dashboard
        v-if="greedPath === 'dashboard'"
      />
      <other
        v-if="greedPath === 'other'"
      />
      <tags
        v-if="greedPath === 'tags'"
        :tags="greedSource"
      />
      <TagWithChildren
        v-if="greedPath === 'tags_children'"
        :tags="greedSource"
      />
      <ProjectWithChildren
        v-if="greedPath === 'projects_children'"
        :projects="greedSource"
      />
      <BoardWithChildren
        v-if="greedPath === 'boards_children'"
        :boards="greedSource"
      />
      <ReglamentContent
        v-if="greedPath === 'reglament_content'"
        :reglament="greedSource"
      />
      <employees
        v-if="greedPath === 'new_emps'"
        :employees="greedSource"
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

<script>
import { setLocalStorageItem, UID_TO_ACTION, visitChildren } from '@/store/helpers/functions'
import AsideMenu from '@/components/AsideMenu.vue'
import NavBar from '@/components/NavBar.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
import ErrorNotification from '@/components/Notifications/ErrorNotification.vue'
import Notification from '@/components/Notifications/Notification.vue'
import InspectorNotification from '@/components/Notifications/InspectorNotification.vue'
import Overlay from '@/components/modals/Overlay.vue'

import TasksListNew from '@/components/TasksListNew.vue'
import MainSection from '@/components/MainSection.vue'
import Projects from '@/components/Projects.vue'
import Reglaments from '@/components/Reglaments/Reglaments.vue'
import Boards from '@/components/Boards.vue'
import BoardWithChildren from '@/components/Board/BoardWithChildren.vue'
import ProjectWithChildren from '@/components/Projects/ProjectWithChildren.vue'
import ReglamentContent from '@/components/Reglaments/ReglamentContent.vue'
import Employees from '@/components/Employees.vue'
import Tags from '@/components/Tags/Tags.vue'
import Colors from '@/components/Colors.vue'
import Assignments from '@/components/Assignments.vue'
import ModalBoxNotificationInstruction from '@/components/modals/ModalBoxNotificationInstruction.vue'
import Dashboard from '@/components/Dashboard.vue'
import Other from '@/components/Other.vue'
import Doitnow from '@/components/Doitnow.vue'
import TagWithChildren from '@/components/Tags/TagWithChildren.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'
import * as TASK from '@/store/actions/tasks'
import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'

export default {
  components: {
    ModalBoxNotificationInstruction,
    MainSection,
    AsideMenu,
    Overlay,
    NavBar,
    PropertiesRight,
    ErrorNotification,
    Notification,
    InspectorNotification,
    TasksListNew,
    Projects,
    Reglaments,
    Boards,
    Doitnow,
    Dashboard,
    Other,
    Tags,
    TagWithChildren,
    ProjectWithChildren,
    BoardWithChildren,
    ReglamentContent,
    Employees,
    Colors,
    Assignments
  },
  data () {
    return {
      shouldShowModalBox: false
    }
  },
  computed: {
    mainSectionState () {
      return this.$store.state.mainSectionState
    },
    greedPath () {
      return this.$store.state.greedPath
    },
    greedSource () {
      return this.$store.state.greedSource
    },
    isAsideLgActive () {
      return this.$store.state.isAsideLgActive
    },
    isFileRedirect () {
      return (this.$router.currentRoute.value.name === 'taskfile' || this.$router.currentRoute.value.name === 'cardfile') && this.$router.currentRoute.value.params.id
    },
    menu () {
      return this.$store.state.navigator.menu
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  mounted () {
    this.requestNotificationPermissionOrShowModalBox()

    this.$store.dispatch(USER_REQUEST).then(resp => {
      this.$store.dispatch('GET_SOUND_SETTING', resp.data.current_user_uid)
      this.getNavigator()
      if (this.$router.currentRoute.value.name === 'task' && this.$router.currentRoute.value.params.id) {
        this.getTask(this.$router.currentRoute.value.params.id)
      } else {
        this.getTasks()
      }
    })
  },
  methods: {
    setShouldShowModalValue (value) {
      setLocalStorageItem('shouldShowModal', value)
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          setLocalStorageItem('shouldShowModal', '0')
        } else if (permission === 'denied') {
          setLocalStorageItem('shouldShowModal', '0')
        }
      })
    },
    requestNotificationPermissionOrShowModalBox () {
      if (parseInt(localStorage.getItem('shouldShowModal')) === 0) {
        return
      }

      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
        setLocalStorageItem('shouldShowModal', '0')
      } else if (Notification.permission === 'granted') {
        setLocalStorageItem('shouldShowModal', '0')
      } else if (Notification.permission === 'default') {
        setLocalStorageItem('shouldShowModal', '1')
      } else if (Notification.permission === 'denied') { // handle denied case
        setLocalStorageItem('shouldShowModal', '1')
      }

      if (parseInt(localStorage.getItem('shouldShowModal')) === 1) {
        this.shouldShowModalBox = true
      }
    },
    overlayClick () {
      this.$store.dispatch('asideLgToggle', false)
    },
    getTask (uid) {
      if (this.$store.state.auth.token) {
        this.$store.dispatch(TASK.ONE_TASK_REQUEST, uid).then((resp) => {
          const navElem = {
            name: 'Поиск',
            key: 'taskListSource',
            value: {
              uid: '47a38aa5-19c4-40d0-b8c0-56c3a420935d',
              param: uid
            }
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', {
            key: 'mainSectionState',
            value: 'tasks'
          })
          this.$store.commit('basic', {
            key: 'taskListSource',
            value: navElem.value
          })

          this.$store.commit('basic', {
            key: 'propertiesState',
            value: 'task'
          })

          if (resp.data.tasks.length > 0) {
            this.$store.dispatch(TASK.SELECT_TASK, resp.data.tasks[0])
            if (!this.isPropertiesMobileExpanded) {
              this.$store.dispatch('asidePropertiesToggle', true)
            }
          }
          window.history.replaceState(null, null, '/')
        })
      }
    },
    getTasks () {
      if (this.$store.state.auth.token) {
        if (this.navStack.length && this.navStack.length > 0) {
          if (this.navStack[this.navStack.length - 1].key === 'taskListSource') {
            const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].value.uid]
            if (!action) {
              console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].uid)
              return
            }
            this.$store.dispatch(action, this.navStack[this.navStack.length - 1].value.param)
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'tasks'
            })
            this.$store.commit('basic', {
              key: this.navStack[this.navStack.length - 1].key,
              value: this.navStack[this.navStack.length - 1].value
            })
          }
        } else {
          this.$store.commit('basic', {
            key: 'taskListSource',
            value: {
              uid: '901841d9-0016-491d-ad66-8ee42d2b496b',
              param: null
            }
          })
          this.$store.commit(
            'updateStackWithInitValue',
            {
              name: 'Сегодня',
              key: 'taskListSource',
              type: 'date',
              typeVal: new Date(),
              value: {
                uid: '901841d9-0016-491d-ad66-8ee42d2b496b',
                param: new Date()
              }
            }
          )
          this.$store.dispatch(TASK.TASKS_REQUEST, new Date())
            .then(() => {
              this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
            })
            .catch((err) => console.log(err))
        }
      }
    },
    initNavStackWithFoundProjects (projectUid) {
      let project
      visitChildren(this.storeNavigator.new_private_projects[0].items, value => {
        if (value.uid === projectUid) {
          project = value
        }
      })
      visitChildren(this.storeNavigator.new_private_projects[1].items, value => {
        if (value.uid === projectUid) {
          project = value
        }
      })

      const navElem = {
        name: project.name,
        key: 'greedSource',
        uid: project.uid,
        global_property_uid: project.global_property_uid,
        greedPath: 'projects_children',
        value: project.children
      }
      this.$store.commit('pushIntoNavStack', navElem)
    },
    initNavStackWithFoundBoards (boardUid) {
      let board
      visitChildren(this.storeNavigator.new_private_boards[0].items, value => {
        if (value.uid === boardUid) {
          board = value
        }
      })
      visitChildren(this.storeNavigator.new_private_boards[1].items, value => {
        if (value.uid === boardUid) {
          board = value
        }
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
    },
    initNavStackWithFoundReglaments (reglamentUid) {
      let reglament
      visitChildren(this.storeNavigator.reglaments.items, value => {
        if (value.uid === reglamentUid) {
          reglament = value
        }
      })

      const navElem = {
        name: reglament.name,
        key: 'greedSource',
        uid: reglamentUid,
        global_property_uid: reglament.global_property_uid,
        greedPath: 'reglament_content',
        value: reglament.children
      }
      this.$store.commit('pushIntoNavStack', navElem)
    },
    getProject (uid) {
      const navElem = {
        name: 'Проекты',
        key: 'greedSource',
        greedPath: 'new_private_projects',
        value: this.storeNavigator.new_private_projects
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.initNavStackWithFoundProjects(uid)
      window.history.replaceState(null, null, '/')
    },
    getBoard (uid) {
      const navElem = {
        name: 'Доски',
        key: 'greedSource',
        greedPath: 'new_private_boards',
        value: this.storeNavigator.new_private_boards
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.initNavStackWithFoundBoards(uid)
      window.history.replaceState(null, null, '/')
    },
    getReglamentByLink (uid) {
      const navElem = {
        name: 'Регламенты',
        key: 'greedSource',
        greedPath: 'reglament_content',
        value: this.storeNavigator.reglaments.uid
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.initNavStackWithFoundReglaments(uid)
      window.history.replaceState(null, null, '/')
    },
    initNavStackGreedView () {
      if (this.$router.currentRoute.value.name === 'project' && this.$router.currentRoute.value.params.id) {
        this.getProject(this.$router.currentRoute.value.params.id)
      }
      if (this.$router.currentRoute.value.name === 'board' && this.$router.currentRoute.value.params.id) {
        this.getBoard(this.$router.currentRoute.value.params.id)
      }
      if (this.$router.currentRoute.value.name === 'reglament' && this.$router.currentRoute.value.params.id) {
        this.getReglamentByLink(this.$router.currentRoute.value.params.id)
      }
      // After navigator is loaded we are trying to set up last visited navElement
      // Checking if last navElement is a gridSource
      if (this.navStack.length && this.navStack.length > 0) {
        if (this.navStack[this.navStack.length - 1].key === 'greedSource') {
          const navStackUid = this.navStack[this.navStack.length - 1]?.uid

          if (navStackUid === '2bad1413-a373-4926-8a3c-58677a680714') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'dashboard'
            })
          } else if (navStackUid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'doitnow'
            })
          } else if (navStackUid === 'ed8039ae-f3de-4369-8f32-829d401056e9') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'colors'
            })
          } else if (navStackUid === '00a5b3de-9474-404d-b3ba-83f488ac6d30') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'tags'
            })
          } else if (navStackUid === '757be87d-c269-40e0-b224-6b2bb0e4f97d') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'other'
            })
          } else {
            this.$store.commit('basic', {
              key: 'greedPath',
              value: this.navStack[this.navStack.length - 1].greedPath
            })
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
          }

          // If last navElement is related to processed navigator instance with 'new_' prefix
          // then we pass entire object from storeNavigator
          if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            this.$store.commit('basic', {
              key: this.navStack[this.navStack.length - 1].key,
              value: this.storeNavigator[this.navStack[this.navStack.length - 1].greedPath]
            })

            // if last visited navElemen is in nested in children, then we trying to find these children with visitChildren fucntion
            // from storeNavigator
          } else if (['tags_children', 'projects_children', 'boards_children', 'reglament_content'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            if (['tags_children', 'projects_children', 'boards_children'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
              const pathToNavigatorItem = {
                tags_children: 'tags',
                projects_children: 'new_private_projects',
                boards_children: 'new_private_boards'
              }
              const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].global_property_uid]
              if (!action) {
                console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].global_property_uid)
                return
              }

              this.$store.dispatch(action, this.navStack[this.navStack.length - 1].uid)
              this.$store.commit('basic', {
                key: 'taskListSource',
                value: {
                  uid: this.navStack[this.navStack.length - 1].global_property_uid,
                  param: this.navStack[this.navStack.length - 1].uid
                }
              })

              // мы здесь смотрим, если у нас элемент из навигатора это массив по типу как projects или boards, мы идем по этому массиву и пытаемся найти детей
              if (Array.isArray(this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]])) {
                for (let i = 0; i < this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]].length; i++) {
                  visitChildren(this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]][i].items, value => {
                    if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                      this.$store.commit('basic', {
                        key: this.navStack[this.navStack.length - 1].key,
                        value: value.children
                      })
                    }
                  })
                }
              } else {
                visitChildren(this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]].items, value => {
                  if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                    this.$store.commit('basic', {
                      key: this.navStack[this.navStack.length - 1].key,
                      value: value.children
                    })
                  }
                })
              }
            }
            if (this.navStack[this.navStack.length - 1].greedPath === 'reglament_content') {
              visitChildren(this.storeNavigator.reglaments.items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', {
                    key: this.navStack[this.navStack.length - 1].key,
                    value: value
                  })
                }
              })
            }
          } else {
            // colors and reglaments
            this.$store.commit('basic', {
              key: this.navStack[this.navStack.length - 1].key,
              value: this.storeNavigator[this.navStack[this.navStack.length - 1].greedPath].items
            })
          }
        }
      }
    },
    getNavigator () {
      if (this.$store.state.auth.token) {
        const data = {
          organization: this.$store?.state?.user?.user?.owner_email,
          user_uid: this.$store?.state?.user?.user?.current_user_uid
        }
        let reglaments = []
        this.$store.commit(NAVIGATOR_REQUEST)
        this.$store.dispatch('REGLAMENTS_REQUEST', data).then(resp => {
          reglaments = resp.data
        }).finally(() => {
          this.$store.dispatch(NAVIGATOR_REQUEST).then(() => {
            this.storeNavigator.reglaments = {
              uid: 'fake-uid',
              items: reglaments
            }
            initWebSync()
            initInspectorSocket()
            this.initNavStackGreedView()
          })
        })
      }
    }
  }
}
</script>
