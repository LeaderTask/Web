<template>
  <inspector-modal-box
    v-model="showInspector"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
  />
  <div
    v-if="tasksCount && !isLoading"
    class="flex items-center mb-5 justify-between"
  >
    <!-- header -->
    <div class="flex items-center">
      <div
        class="font-Roboto font-medium text-sm bg-gray-200 px-2.5 py-2 rounded-lg flex"
      >
        В очереди задач: {{ tasksCount }}
      </div>
      <button
        class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm h-[35px] ml-2 hover:bg-[#F5DEB3]"
        @click="showInspector = true"
      >
        Поручить
      </button>
    </div>
    <button
      class="border border-slate-600 py-3 px-4 rounded-lg mr-5 hover:bg-gray-300 text-sm bg-opacity-70 font-medium flex w-[181px] items-center justify-center"
      @click="nextTask"
    >
      <span class="pr-2">Следующая задача</span>
      <Icon
        :height="arrowForw.height"
        :width="arrowForw.width"
        :view="arrowForw.viewBox"
        :path="arrowForw.path"
      />
    </button>
  </div>
  <DoitnowSkeleton v-if="isLoading"/>
  <transition :name="taskTransition">
    <DoitnowTask
      v-if="tasksCount && !isLoading"
      :key="firstTask.uid"
      :task="firstTask"
      :sub-tasks="subTasks"
      :colors="colors"
      :tags="tags"
      :user="user"
      :task-messages="taskMessages.slice().reverse()"
      :employees="employees"
      :projects="projects"
      @clickTask="onClickTask"
      @nextTask="nextTask"
      @changeValue="changeValue"
      @readTask="readTask"
    />
  </transition>
  <DoitnowEmpty
    v-if="(tasksCount === 0 && !isLoading)"
    @clickPlanning="goToNextDay"
  />
</template>

<script>
import * as FILES from '@/store/actions/taskfiles.js'
import * as MSG from '@/store/actions/taskmessages.js'
import * as TASK from '@/store/actions/tasks.js'

import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import DoitnowEmpty from '@/components/Doitnow/DoitnowEmpty.vue'
import DoitnowTask from '@/components/Doitnow/DoitnowTask.vue'
import DoitnowSkeleton from '@/components/Doitnow/DoitnowSkeleton.vue'
import Icon from '@/components/Icon.vue'

import arrowForw from '@/icons/arrow-forw-sm.js'
import { PUSH_COLOR } from '@/store/actions/colors'

export default {
  components: {
    DoitnowEmpty,
    DoitnowSkeleton,
    DoitnowTask,
    InspectorModalBox,
    Icon
  },
  setup () {
    return {
      arrowForw
    }
  },
  data: () => ({
    unreadTasks: [],
    overdueTasks: [],
    todayTasks: [],
    readyTasks: [],
    unreadDelegateByMe: [],
    unreadDelegateToMe: [],
    readyTasksReaded: [],
    readyTasksUnreaded: [],
    openedTasks: [],
    projectTasks: [],
    unsortedTasks: [],
    overdueReaded: [],
    showInspector: false,
    tasksLoaded: false
  }),
  computed: {
    tasksCount () {
      return (
        this.unreadTasks.length +
        this.overdueTasks.length +
        this.readyTasks.length +
        this.todayTasks.length
      )
    },
    firstTask () {
      if (this.unreadTasks.length) {
        return this.unreadTasks[0]
      }
      if (this.readyTasks.length) {
        return this.readyTasks[0]
      }
      if (this.overdueTasks.length) {
        return this.overdueTasks[0]
      }
      if (this.todayTasks.length) {
        return this.todayTasks[0]
      }
      return null
    },
    taskMessages () {
      return this.$store.state.taskfilesandmessages.messages
    },
    taskFiles () {
      return this.$store.state.taskfilesandmessages.files
    },
    employees () {
      return this.$store.state.employees.employees
    },
    projects () {
      return this.$store.state.projects.projects
    },
    colors () {
      return this.$store.state.colors.colors
    },
    tags () {
      return this.$store.state.tasks.tags
    },
    isLoading () {
      return this.$store.state.tasks.status === 'loading'
    },
    user () {
      return this.$store.state.user.user
    },
    subTasks () {
      return this.$store.state.tasks.subtasks.tasks
    },
    taskTransition () {
      return this.tasksLoaded ? 'slide-in-fade-out' : ''
    }
  },
  watch: {
    firstTask (newtask, oldtask) {
      if (newtask) {
        this.$store.commit(TASK.SELECT_TASK, newtask)
        this.$store.dispatch(MSG.MESSAGES_REQUEST, newtask.uid)
          .then(() => {
            this.$store.dispatch(FILES.FILES_REQUEST, newtask.uid)
              .then(() => {
                this.$store.dispatch(MSG.INSPECTOR_MESSAGES_REQUEST, newtask.uid)
                  .then(() => {
                    this.$store.commit(FILES.MERGE_FILES_WITH_MESSAGES)
                  })
              })
          })
        this.$store.dispatch(MSG.INSPECTOR_MESSAGES_REQUEST, newtask.uid)
        this.$store.dispatch(TASK.SUBTASKS_REQUEST, newtask.uid)
      }
    }
  },
  mounted: function () {
    this.loadAllTasks()
  },
  methods: {
    loadAllTasks: function () {
      this.$store.dispatch(TASK.DOITNOW_TASKS_REQUEST)
        .then((result) => {
          // сортировка непрочитанных
          for (let i = 0; i < result[0].length; i++) {
            // Поручено мной
            if (result[0][i].uid_customer === this.user.current_user_uid) {
              this.unreadDelegateByMe.unshift(result[0][i])
            } else {
              // Поручено мне
              if (result[0][i].uid_performer === this.user.current_user_uid) {
                this.unreadDelegateToMe.unshift(result[0][i])
              } else {
                // Готово к сдаче
                if (result[0][i].status === 5) {
                  this.readyTasksUnreaded.push(result[0][i])
                } else {
                  // Доступ
                  if (result[0][i].emails.includes(this.user.current_user_email) || (result[0][i].uid_project !== '00000000-0000-0000-0000-000000000000')) {
                    this.openedTasks.push(result[0][i])
                  }
                }
              }
            }
          }
          // Сортировка просроченных
          for (let i = 0; i < result[1].length; i++) {
            if (result[1][i].readed) {
              this.overdueReaded.push(result[1][i])
            }
          }
          // Готово к сдаче
          this.$store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST)
            .then((resp) => {
              if (resp.data.anothers_markers.length) {
                this.$store.commit(PUSH_COLOR, resp.data.anothers_markers)
              }
              if (resp.data.anothers_tags.length) {
                this.$store.commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
              }
              for (let i = 0; i < resp.data.tasks; i++) {
                if (resp.data.tasks[i].readed) {
                  this.readyTasksReaded.push(resp.data.tasks[i])
                }
              }
            })
          // Отправляем в главный массив (непрочитанное) отсортированные массивы по очереди
          this.unreadTasks = [...this.unreadDelegateByMe, ...this.unreadDelegateToMe,
            ...this.readyTasksUnreaded, ...this.projectTasks, ...this.unsortedTasks]
          // Отправляем в главный массив (просрочено) отсортированные данные
          this.overdueTasks = [...this.overdueReaded]
          // Отправляем в главный массив (готовые) отсортированные данные
          this.readyTasks = [...this.readyTasksReaded]
          this.todayTasks = [...result[2]]
          this.openedTasks = [...this.openedTasks]
          // удаляем из массивов задачи со статусом "завершено"
          this.unreadTasks = this.unreadTasks.filter(task => (task.status !== 1) && (task.status !== 8))
          this.overdueTasks = this.overdueTasks.filter(task => (task.status !== 1) && (task.status !== 8))
          this.readyTasks = this.readyTasks.filter(task => (task.status !== 1) && (task.status !== 8))
          this.todayTasks = this.todayTasks.filter(task => (task.status !== 1) && (task.status !== 8))
          this.openedTasks = this.openedTasks.filter(task => (task.status !== 1) && (task.status !== 8))
        })
        .then(() => {
          this.tasksLoaded = true
        })
    },
    readTask: function () {
      this.$store.dispatch(TASK.CHANGE_TASK_READ, this.firstTask.uid)
    },
    dateToLabelFormat: function (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', {
        weekday: 'short'
      })
      return day + ' ' + month + ', ' + weekday
    },
    nextTask: function () {
      this.readTask()
      if (this.unreadTasks.length) {
        this.unreadTasks.shift()
        return
      }
      if (this.readyTasks.length) {
        this.readyTasks.shift()
        return
      }
      if (this.overdueTasks.length) {
        this.overdueTasks.shift()
        return
      }
      if (this.todayTasks.length) {
        this.todayTasks.shift()
        return
      }
      if (this.openedTasks.length) {
        this.openedTasks.shift()
      }
    },
    changeValue: function (objWithValues) {
      for (const elem in objWithValues) {
        this.firstTask[elem] = objWithValues[elem]
      }
    },
    goToNextDay: function () {
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))

      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.dispatch(TASK.TASKS_REQUEST, tomorrow)
      // hardcoded and messy
      const navElem = {
        name: this.dateToLabelFormat(tomorrow),
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow }
      })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    },
    onClickTask: function (task) {
      this.$store.commit('basic', { key: 'propertiesState', value: 'task' })
      this.$store.dispatch(TASK.SELECT_TASK, task)
      this.$store.dispatch('asidePropertiesToggle', true)
    }
  }
}
</script>

<style scoped>
.slide-in-fade-out-enter-from {
  transform: translateX(45px);
}

.slide-in-fade-out-enter-active {
  transition-delay: .4s;
  transition-property: opacity, transform;
  transition-duration: .4s;
}

.slide-in-fade-out-enter-from, .slide-in-fade-out-leave-to {
  opacity: 0;
}

.slide-in-fade-out-leave-active {
  transition-property: opacity, transform;
  transition-duration: .8s;
}

.slide-in-fade-out-leave-to {
  position: absolute;
  width: 100%;
}
</style>
