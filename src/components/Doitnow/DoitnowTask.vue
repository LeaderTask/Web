<template>
  <div
    class="bg-white py-6 px-5 rounded-lg flex justify-between"
    :style="{ borderColor: colors[task.uid_marker] ? colors[task.uid_marker].back_color : ''}"
    :class="{
      'bg-gray-200 dark:bg-gray-800':
        isTaskComplete &&
        task.uid_marker !== '00000000-0000-0000-0000-000000000000'
    }"
  >
    <div class="w-5/6">
      <div
        class="flex justify-between items-center mb-6 p-2 rounded-[8px]"
        :style="{ backgroundColor: colors[task.uid_marker] ? colors[task.uid_marker].back_color : '', color: getValidForeColor(colors[task.uid_marker]?.fore_color) }"
      >
        <!-- task info/status -->
        <div class="flex items-center -ml-2">
          <TaskStatus
            class="pl-2"
            :task="task"
            @changeStatus="changeStatus"
          />
          <contenteditable
            v-model="name"
            v-linkify:options="{ className: 'text-blue-600', tagName: 'a' }"
            tag="div"
            class="taskName p-0.5 ring-0 outline-none max-w-7xl mt-0.5 ml-1 flex overflow-x-hidden"
            :contenteditable="task._isEditable"
            placeholder="Введите название задачи"
            :no-nl="false"
            :no-html="false"
            :style="{ color: getValidForeColor(colors[task.uid_marker]?.fore_color) }"
            :class="{ 'uppercase': !task._isEditable && colors[task.uid_marker] && colors[task.uid_marker].uppercase, 'text-gray-500': task.status == 1 || task.status == 7, 'line-through': task.status == 1 || task.status == 7 }"
            @focusout="clearTaskFocus(task)"
            @dblclick.stop="editTaskName(task)"
            @keydown.enter="updateTask($event, task)"
          />
        </div>
        <Popper
          class="items-center"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
          @click.stop="toggleTaskHoverPopper(true)"
          @open:popper="toggleTaskHoverPopper(true)"
          @close:popper="toggleTaskHoverPopper(false)"
        >
          <Icon
            :path="dots.path"
            class="text-gray-600 dark:text-white cursor-pointer ml-1"
            :box="dots.viewBox"
            :width="dots.width"
            :style="{ color: 'gray' }"
            :height="dots.height"
          />
          <template #content>
            <div class="flex flex-col">
              <!-- date create -->
              <div class="flex flex-col gap-[4px] px-[10px] text-[#7e7e80] text-[13px] leading-[15px] font-roboto">
                <div class="text-[#4c4c4d] text-[14px] leading-[16px] font-medium">
                  Дата создания:
                </div>
                {{ dateClear(task.date_create) }}
                <div class="my-[4px] flex h-px bg-[#dddddd]" />
              </div>
              <!-- link -->
              <span
                class="h-[30px] flex items-center gap-[10px] px-[10px] py-[6px] cursor-pointer hover:bg-[#f4f5f7] rounded-[6px] text-[#4c4c4d] text-[13px] leading-[15px] font-roboto"
                @click="copyUrl(task)"
              >
                Копировать как ссылку
              </span>
              <!-- only files -->
              <span
                class="h-[30px] flex items-center gap-[10px] px-[10px] py-[6px] cursor-pointer hover:bg-[#f4f5f7] rounded-[6px] text-[#4c4c4d] text-[13px] leading-[15px] font-roboto"
                :class="showOnlyFiles ? 'bg-slate-200' : ''"
                @click="showOnlyFiles = !showOnlyFiles"
              >
                В чате показывать только файлы
              </span>
            </div>
          </template>
        </Popper>
      </div>
      <div class="flex text-sm text-left justify-between w-[400px]">
        <div class="flex flex-col font-medium w-[720px]">
          <div
            v-if="task.emails.includes(user.current_user_email) && task.uid_performer !== user.current_user_uid"
            class="border-[#FF912380] w-[150px] text-center py-1 px-2 mb-2 border-2 rounded-[8px] inline-block"
          >
            Задача в доступе
          </div>
          <!-- customer -->
          <div
            v-show="task.type !== 1"
            class="flex mb-2"
          >
            <span
              class="mr-2 w-[90px] shrink-0"
            >
              Заказчик:
            </span>
            <div
              class="flex"
            >
              <img
                :src="employees[task.uid_customer] ? employees[task.uid_customer]?.fotolink : ''"
                class="rounded-lg ml-1 h-[20px] w-[20px]"
              >
              <span class="ml-1 text-black">{{ getByNameOrEmail(employees) }}</span>
            </div>
          </div>
          <!-- performer -->
          <div
            v-show="(task.type !== 1) && (task.uid_performer !== task.uid_customer)"
            class="flex mb-2"
          >
            <span
              class="mr-2 w-[90px] shrink-0"
            >
              Исполнитель:
            </span>
            <div
              class="flex"
            >
              <img
                :src="employees[task.uid_performer] ? employees[task.uid_performer]?.fotolink : ''"
                class="rounded-lg ml-1 h-[20px] w-[20px]"
              >
              <span class="ml-1 text-black">{{ employees[task.uid_performer]?.name }}</span>
            </div>
          </div>
          <!-- days -->
          <div
            v-show="dateClearWords"
            class="flex mb-2"
          >
            <span
              class="mr-2 w-[90px] shrink-0"
            >
              Срок:
            </span>
            <div
              v-show="dateClearWords"
              class="flex"
            >
              <span class="text-black">{{ dateClearWords + getTime }}</span>
            </div>
          </div>
          <!-- overdue -->
          <div
            v-show="plural"
            class="flex mb-2"
          >
            <span class="mr-2 w-[90px] shrink-0">
              Просрочено:
            </span>
            <div
              class="flex mb-2"
            >
              <span class="text-red-500">{{ plural }}</span>
            </div>
          </div>
          <!-- project -->
          <div
            v-if="projects[task.uid_project]"
            class="flex mb-2"
          >
            <span
              class="mr-2 w-[90px] shrink-0"
            >
              Проект:
            </span>
            <div
              class="flex mb-2"
            >
              <span class="text-black overflow-hidden truncate">{{ projects[task.uid_project]?.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <TaskPropsCommentEditor
        v-show="task.comment.length || task.uid_customer === user.current_user_uid"
        class="mt-3"
        :comment="task.comment"
        :can-edit="task.uid_customer === user.current_user_uid"
        @changeComment="onChangeComment"
      />
      <Checklist
        class="mt-3 checklist-custom font-medium"
        :task-uid="task.uid"
        :checklist="task.checklist"
        :is-customer="task.uid_customer === user.current_user_uid"
        :is-performer="task.uid_performer === user.current_user_uid"
        :task="task"
      />
      <div
        class="flex flex-col max-w-1/2 border-t mt-2 pt-2"
        :class="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? 'bg-white p-1 mt-1 rounded-lg' : ''"
      >
        <!-- input -->
        <TaskPropsInputForm
          :task="task"
          @readTask="readTask"
        />
        <!-- chat -->
        <TaskPropsChatMessages
          v-if="taskMessages?.length"
          id="content"
          class="mt-3"
          :task="task"
          :task-messages="taskMessages"
          :current-user-uid="user.current_user_uid"
          :show-all-messages="true"
          :show-only-files="showOnlyFiles"
          @answerMessage="answerMessage"
          @sendTaskMsg="sendTaskMsg"
          @onPasteEvent="onPasteEvent"
          @deleteFiles="deleteFiles"
          @deleteTaskMsg="deleteTaskMsg"
          @readTask="readTask"
        />
      </div>
    </div>
    <!-- accept/redo/decline -->
    <div>
      <div
        v-if="task"
        class="flex flex-col min-w-[200px] items-end"
      >
        <!-- accept -->
        <button
          v-if="task.uid_customer === user.current_user_uid || task.uid_performer === user.current_user_uid"
          class="flex py-0.5 items-center justify-center text-sm hover:bg-white bg-green-100 hover:bg-opacity-90 font-medium border-green-400 min-h-[40px] w-[181px] rounded-lg border hover:text-green-500 mb-2 hover:animate-fadeIn"
          @click="accept"
        >
          <span
            class="ml-8 w-[70px]"
          >{{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Завершить' : 'Принять и завершить') : 'Готово к сдаче'
          }}</span>
          <Icon
            :path="check.path"
            :width="check.width"
            :height="check.height"
            :box="check.viewBox"
            class="ml-8"
          />
        </button>
        <!-- redo -->
        <button
          v-if="task.uid_customer === user.current_user_uid || task.uid_performer === user.current_user_uid"
          class="flex py-0.5 items-center justify-center text-sm bg-gray-100 w-[181px] hover:bg-red-200 hover:border hover:border-red-300 min-h-[40px] hover:bg-opacity-90 font-medium rounded-lg hover:text-red-500 mb-2 hover:animate-fadeIn"
          @click="reDo"
        >
          <span
            class="ml-8 w-[70px]"
          >{{ task.uid_customer === user.current_user_uid ? (task.uid_performer === user.current_user_uid ? 'Отменить' : 'На доработку') : 'Отклонить'
          }}</span>
          <Icon
            :path="close.path"
            :width="close.width"
            :height="close.height"
            :box="close.viewBox"
            class="ml-8"
          />
        </button>
        <!-- decline -->
        <button
          v-if="task.uid_customer === user.current_user_uid || task.uid_performer === user.current_user_uid"
          class="flex py-0.5 w-[181px] justify-center items-center text-sm bg-gray-100 hover:bg-gray-50 hover:border hover:border-gray-500 hover:bg-opacity-90 font-medium min-h-[40px] rounded-lg mb-2 hover:animate-fadeIn"
          @click="decline"
        >
          <span class="ml-8 w-[70px]">Отложить</span>
          <Icon
            :path="pauseD.path"
            :width="pauseD.width"
            :height="pauseD.height"
            :box="pauseD.viewBox"
            class="ml-8"
          />
        </button>
        <PerformButton
          v-if="task.status !== 3 && task.type !== 4 && (task.uid_customer === user.current_user_uid || task.uid_customer === task.uid_performer)"
          class="hover:animate-fadeIn hover:cursor-pointer"
          :task-type="task.type"
          :current-user-uid="user.current_user_uid"
          :performer-email="task.email_performer"
          @changePerformer="onChangePerformer"
          @reAssign="onReAssignToUser"
        />
        <!-- Change access -->
        <button
          v-if="task.status !== 3 && (task.type !== 4 || task.emails.includes(user.current_user_email)) && task.uid_customer !== user.current_user_uid && task.uid_performer !== user.current_user_uid"
          class="flex py-0.5 items-center justify-center text-sm bg-gray-100 w-[181px] hover:bg-red-200 hover:border hover:border-red-300 min-h-[40px] hover:bg-opacity-90 font-medium rounded-lg hover:text-red-500 mb-2 hover:animate-fadeIn"
          @click="() => onChangeAccess(task.emails)"
        >
          <span
            class="ml-8 w-[70px]"
          >
            Выйти из доступа
          </span>
          <Icon
            :path="close.path"
            :width="close.width"
            :height="close.height"
            :box="close.viewBox"
            class="ml-8"
          />
        </button>
        <SetDate
          v-if="task.status !== 3 && task.type !== 4 && task.uid_customer === user.current_user_uid"
          class="hover:animate-fadeIn hover:cursor-pointer"
          :name="'Назначить срок'"
          :date-begin="task.date_begin"
          :date-end="task.date_end"
          :date-text="task.term_user"
          @changeDates="onChangeDates"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { copyText } from 'vue3-clipboard'
import contenteditable from 'vue-contenteditable'
import linkify from 'vue-linkify'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import PerformButton from '@/components/Doitnow/PerformButton.vue'
import Popper from 'vue3-popper'
import SetDate from '@/components/Doitnow/SetDate.vue'
import Checklist from '@/components/Doitnow/Checklist.vue'
import TaskPropsChatMessages from '@/components/TaskProperties/TaskPropsChatMessages.vue'
import TaskPropsInputForm from '@/components/TaskProperties/TaskPropsInputForm.vue'
import TaskStatus from '@/components/TasksList/TaskStatus.vue'
import Icon from '@/components/Icon.vue'

import * as TASK from '@/store/actions/tasks'
import * as INSPECTOR from '@/store/actions/inspector.js'
import * as MSG from '@/store/actions/taskmessages'
import * as FILES from '@/store/actions/taskfiles.js'

/* Icons */
import taskoptions from '@/icons/taskoptions.js'
import file from '@/icons/file.js'
import inaccess from '@/icons/inaccess.js'
import doublecheck from '@/icons/doublecheck.js'
import close from '@/icons/doitnow/close.js'
import dots from '@/icons/doitnow/dots.js'
import pauseD from '@/icons/doitnow/pause.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import project from '@/icons/doitnow/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import check from '@/icons/doitnow/check.js'
import clock from '@/icons/clock.js'
// Statuses icons
import readyStatus from '@/icons/ready-status.js'
import note from '@/icons/note.js'
import inwork from '@/icons/inwork.js'
import pause from '@/icons/pause.js'
import canceled from '@/icons/canceled.js'
import improve from '@/icons/improve.js'
import repeat from '@/icons/repeat.js'
/* /Icons */

export default {
  components: {
    Icon,
    SetDate,
    TaskPropsChatMessages,
    TaskPropsCommentEditor,
    PerformButton,
    Checklist,
    TaskPropsInputForm,
    contenteditable,
    Popper,
    TaskStatus
  },
  directives: {
    linkify
  },
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    subTasks: {
      type: Array,
      default: () => ([])
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    tags: {
      type: Object,
      default: () => ({})
    },
    employees: {
      type: Object,
      default: () => ({})
    },
    projects: {
      type: Object,
      default: () => ({})
    },
    user: {
      type: Object,
      default: () => ({})
    },
    taskMessages: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['clickTask', 'nextTask', 'changeValue', 'readTask'],
  data (props) {
    const name = props.task.name
    let isTaskHoverPopperActive = false
    const checklistshow = true
    const toggleTaskHoverPopper = (val) => {
      isTaskHoverPopperActive = val
    }
    const showConfirm = false
    const showAllMessages = false
    const isChatVisible = false
    const createChecklist = () => {
      checklistshow.value = true
    }
    const currentAnswerMessageUid = ''
    const statuses = [
      undefined, // we don't have 0 status
      readyStatus,
      readyStatus,
      note,
      inwork,
      readyStatus,
      pause,
      canceled,
      canceled,
      improve
    ]
    return {
      isTaskHoverPopperActive,
      toggleTaskHoverPopper,
      isChatVisible,
      createChecklist,
      showConfirm,
      checklistshow,
      currentAnswerMessageUid,
      showAllMessages,
      taskoptions,
      close,
      statuses,
      file,
      dots,
      pause,
      inaccess,
      msgs,
      name,
      pauseD,
      isloading: false,
      showOnlyFiles: false,
      check,
      doublecheck,
      taskcomment,
      checklist,
      project,
      tagIcon,
      performerRead,
      performerNotRead,
      taskfocus,
      clock,
      readyStatus,
      note,
      inwork,
      canceled,
      improve,
      repeat
    }
  },
  mutations: {
    PopperState (val) {
      this.isTaskHoverPopperActive = val
    }
  },
  computed: {
    taskMessagesAndFiles () {
      return this.$store.state.taskfilesandmessages.messages
    },
    isCustomer () {
      return this.task.uid_customer === this.user.current_user_uid
    },
    getTime () {
      let time
      if (this.isCustomer) {
        time = new Date(this.task.date_end)
      } else {
        time = new Date(this.task.customer_date_end)
      }
      let hours = String(time.getHours())
      let minutes = String(time.getMinutes())
      if (hours === '0') {
        hours += '0'
      } else if (minutes === '0') {
        minutes += '0'
      }
      if (!this.task.customer_date_end.includes('23:59:59')) {
        return '(' + hours + ':' + minutes + ')'
      } else {
        return ''
      }
    },
    dateClearWords () {
      let time
      if (this.isCustomer) {
        time = this.task.date_end
      } else {
        time = this.task.customer_date_end
      }
      if (time === '0001-01-01T00:00:00') {
        return false
      }
      const month = new Date(time).getMonth() + 1
      const months = [' Января ', ' Февраля ', ' Марта ', ' Апреля ', ' Мая ', ' Июня ', ' Июля ', ' Августа ', ' Сентября ', ' Октября ', ' Ноября ', ' Декабря ']
      const date = new Date(time).getDate() + months[month - 1] + (new Date().getFullYear() === new Date(time).getUTCFullYear() ? '' : new Date(time).getUTCFullYear())
      return date
    },
    isAccessVisible () {
      if (this.task.emails) return true
      if (this.task.type === 1 || this.task.type === 2) return true
      return false
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    computed () {
      return this.$store.state.projects
    },
    statusColor () {
      const statusColor = {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600',
        9: 'text-blue-500'
      }
      return statusColor[this.task.status]
        ? statusColor[this.task.status]
        : 'text-gray-500 dark:text-gray-100'
    },
    performerName () {
      return this.employees[this.task.uid_performer]?.name ?? '???'
    },
    customerName () {
      return this.employees[this.task.uid_customer]?.name ?? '???'
    },
    isTaskComplete () {
      return this.task.status === 1 || this.task.status === 7
    },
    backgroundColor () {
      return this.getValidBackColor(
        this.colors[this.task.uid_marker]?.back_color
      )
    },
    checkBoxText () {
      return `${this.countChecklist(this.task.checklist).done} / ${
        this.countChecklist(this.task.checklist).undone
      }`
    },
    forecolor () {
      return this.getValidForeColor(
        this.colors[this.task.uid_marker]?.fore_color
      )
    },
    uppercase () {
      return this.colors[this.task.uid_marker]?.uppercase ?? false
    },
    plural () {
      let time
      if (this.isCustomer) {
        time = this.task.date_end
      } else {
        time = this.task.customer_date_end
      }
      if (time === '0001-01-01T00:00:00') {
        return false
      }
      const todayDate = new Date()
      const dateEnd = new Date(time)
      todayDate.setHours(0, 0, 0, 0)
      dateEnd.setHours(0, 0, 0, 0)
      const date = Math.floor((todayDate - dateEnd) / (60 * 60 * 24 * 1000))
      const dayName = date % 10 === 1 && date % 100 !== 11 ? 'день' : (((date >= 2) && (date % 10 <= 4)) && (date % 100 < 10 || date % 100 >= 20) ? 'дня' : 'дней')
      if (date === 0 || date < 0) {
        return false
      } else {
        return date + ' ' + dayName
      }
    }
  },
  watch: {
    task (newval, oldval) {
      this.showAllMessages = false
      this.isChatVisible = false
      this.name = this.task.name
    }
  },
  methods: {
    readTask () {
      this.$emit('readTask')
    },
    resetFocusChecklist () {
      this.checklistshow = false
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    onChangeComment (text) {
      const data = {
        uid: this.task.uid,
        value: text
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COMMENT, data)
      this.$emit('changeValue', { comment: text })
    },
    getByNameOrEmail (employees) {
      return employees[this.task.uid_customer]?.name || employees[this.task.uid_customer]?.email
    },
    _linkify (text) {
      return text.replace(/(lt?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    },
    copyUrl (task) {
      copyText(`${window.location.origin}/task/${task.uid}`, undefined, (error, event) => {
        if (error) {
          console.log(error)
        } else {
          console.log(event)
        }
      })
    },
    dateClear (time) {
      return new Date(time).getDate() + '.' + (new Date(time).getMonth() + 1) + '.' + new Date(time).getFullYear()
    },
    removeTask (uid) {
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      this.$store.dispatch(TASK.REMOVE_TASK, uid)
    },
    // copypaste
    onPasteEvent: function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      let loadFile = false
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_task: this.task.uid,
            name: formData
          }
          loadFile = true
          this.isloading = true
          this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data).then(
            resp => {
              this.isloading = false
              // ставим статус "на доработку" когда прикладываем файл
              if (this.task.type === 2 || this.task.type === 3) {
                if ([1, 5, 7, 8].includes(this.task.status)) {
                  if (((this.task.uid_customer === this.cusers.current_user_uid) && ((this.task.status === 1) || (this.task.status === 5)))) {
                    this.$emit('changeValue', { status: 9 })
                  }
                }
              }
              // загрузка завершена - подписываемся опять
              this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
            })
          setTimeout(() => {
            const elmnt = document.getElementById('content').lastElementChild
            elmnt.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
      if (!loadFile) {
        // не вставка файла - подписываемся опять
        this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
      }
    },
    updateTask (event, task) {
      this.$store.dispatch(TASK.CHANGE_TASK_NAME, {
        uid: task.uid,
        value: this.name.replace(/\r?\n|\r/g, '')
      })
      if (task.name.length > 0) {
        if (task._justCreated) {
          task._addToList = true
          this.$store.dispatch(TASK.CREATE_TASK, task)
        } else {
          this.$store.dispatch(TASK.CHANGE_TASK_NAME, {
            uid: task.uid,
            value: this.name
          })
        }
        const data = {
          _isEditing: false
        }
        this.$emit('changeValue', data)
      } else if (task.name.length === 0) {
        if (task._justCreated) {
          if (this.isPropertiesMobileExpanded) {
            this.$store.dispatch('asidePropertiesToggle', false)
          }
          this.$store.commit(TASK.REMOVE_TASK, task.uid)
        } else {
          this.showConfirm = true
          // removeTask(task.uid)
        }
      }
    },
    deleteFiles (uid) {
      this.$store.dispatch(FILES.DELETE_FILE_REQUEST, { uid: uid })
    },
    deleteTaskMsg (uid) {
      this.$store.dispatch(MSG.DELETE_MESSAGE_REQUEST, { uid: uid })
        .then((resp) => {
          this.$store.state.tasks.selectedTask.has_msgs = true
          this.$store.state.taskfilesandmessages.messages.find(message => message.uid === uid).deleted = 1
        })
    },
    editTaskName (task) {
      const data = {
        _isEditable: this.user.current_user_uid === task.uid_customer
      }
      this.$emit('changeValue', data)
    },
    clearTaskFocus (task) {
      if (task.name === '') {
        this.removeTask(task.uid)
      } else if (task.name !== '' && !task.enterPress) {
        this.updateTask(event, task)
      }
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      const data = {
        _isEditing: false
      }
      this.$emit('changeValue', data)
    },
    print (message) {
      alert(message)
    },
    showChat () {
      if (!this.isChatVisible) {
        this.isChatVisible = true
      } else {
        this.isChatVisible = false
      }
    },
    scrollDown () {
      this.showAllMessages = true
      this.infoComplete = true
      setTimeout(() => {
        const elem = document.getElementById('content').lastElementChild
        elem.scrollIntoView()
      }, 200)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    countChecklist (checklist) {
      const data = {
        done: 0,
        undone: 0
      }
      // нормализуем перенос строки (разные на windows и на mac)
      const chlist = checklist.replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '\r\n')
      for (const line of chlist.split('\r\n\r\n')) {
        data.undone++
        if (+line.split('\r\n')[0] === 1) {
          data.done++
        }
      }
      return data
    },
    changeValue (value) {
      this.$emit('changeValue', value)
    },
    nextTask () {
      this.$emit('nextTask')
    },
    changeFocus (uid, value) {
      this.$store.dispatch(TASK.CHANGE_TASK_FOCUS, {
        uid: uid,
        value: value
      })
        .then(() => {
          const data = {
            focus: value
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeAccess (checkEmails) {
      let emails = checkEmails
      if (Array.isArray(checkEmails)) {
        emails = checkEmails.join('..')
      }
      const data = {
        uid: this.task.uid,
        value: emails
      }
      this.$store.dispatch(TASK.CHANGE_TASK_ACCESS, data)
        .then((resp) => {
          const data = {
            emails: emails
          }
          this.$emit('changeValue', data)
        })
      this.nextTask()
    },
    onChangeProject (projectUid) {
      const data = {
        uid: this.task.uid,
        value: projectUid
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PROJECT, data)
        .then((resp) => {
          const data = {
            uid_project: projectUid
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeColor (colorUid) {
      const data = {
        uid: this.task.uid,
        value: colorUid
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COLOR, data)
        .then((resp) => {
          const data = {
            uid_marker: colorUid
          }
          this.$emit('changeValue', data)
        })
    },
    onChangeTags (tags) {
      const data = {
        uid: this.task.uid,
        tags: tags
      }
      this.$store.dispatch(TASK.CHANGE_TASK_TAGS, data)
        .then((resp) => {
          const data = {
            tags: [...tags]
          }
          this.$emit('changeValue', data)
        })
    },
    onClick (task) {
      this.$emit('clickTask', task)
    },
    reDo () {
      this.readTask()
      if (this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 7
        })
        this.$emit('changeValue', { status: 7 })
      }
      if (this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer !== this.user.current_user_uid) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 8
        })
        this.$emit('changeValue', { status: 8 })
      }
      if (this.task.uid_performer !== this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 9
        })
        this.$emit('changeValue', { status: 9 })
      }
      this.nextTask()
    },
    accept () {
      this.readTask()
      if ((this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) ||
        (this.task.uid_performer !== this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid)) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 1
        })
        this.$emit('changeValue', { status: 1 })
      } else {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 5
        })
        this.$emit('changeValue', { status: 5 })
      }
      this.nextTask()
    },
    decline () {
      this.readTask()
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: 6
      })
      this.$emit('changeValue', { status: 6 })
      this.nextTask()
    },
    onReAssignToUser: function (userEmail) {
      const data = {
        uid: this.task.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_REDELEGATE, data)
        .then(
          resp => {
            this.$store.commit(TASK.SUBTASKS_REQUEST, resp.data)
          }
        )
    },
    onChangePerformer: function (userEmail) {
      console.log('onChangePerformer', userEmail)
      const user = this.$store.state.user.user
      const taskUid = this.task.uid
      const data = {
        uid: this.task.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, data)
        .then(
          resp => {
            const data = {
              email_performer: resp.data.email_performer,
              perform_time: resp.data.perform_time,
              performerreaded: resp.data.performerreaded,
              uid_performer: resp.data.uid_performer,
              type: resp.data.type
            }
            this.changeValue(data)
          }
        )
      if (user.current_user_email !== userEmail) {
        this.$store.commit(TASK.REMOVE_TASK, taskUid)
        this.$store.dispatch('asidePropertiesToggle', false)
      }
    },
    uuidv4: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    sendTaskMsg (msg) {
      const date = new Date()
      const month = this.pad2(date.getUTCMonth() + 1)
      const day = this.pad2(date.getUTCDate())
      const year = this.pad2(date.getUTCFullYear())
      const hours = this.pad2(date.getUTCHours())
      const minutes = this.pad2(date.getUTCMinutes())
      const seconds = this.pad2(date.getUTCSeconds())
      const dateCreate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
      const msgtask = this._linkify(msg)
      const uid = this.uuidv4()

      const data = {
        uid_task: this.task.uid,
        uid_creator: this.user.current_user_uid,
        uid: uid,
        uid_msg: uid,
        date_create: dateCreate,
        deleted: 0,
        text: msg,
        msg: msgtask
      }

      this.$store.dispatch(MSG.CREATE_MESSAGE_REQUEST, data)
        .then((resp) => {
          const lastInspectorMessage = this.taskMessagesAndFiles[this.taskMessagesAndFiles.length - 2].uid_creator === 'inspector' ? this.taskMessagesAndFiles[this.taskMessagesAndFiles.length - 2] : false
          console.log('lastInspectorMessage: ', lastInspectorMessage)
          if (lastInspectorMessage) {
            this.$store.dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, {
              id: lastInspectorMessage.id,
              answer: 1
            }).then(() => {
              lastInspectorMessage.performer_answer = 1
            })
          }

          if (this.task.type === 2 || this.task.type === 3) {
            if ([1, 5, 7, 8].includes(this.task.status)) {
              this.$emit('changeValue', { status: 9 })
            }
          }
        })
      this.$emit('changeValue', { has_msgs: true })
      this.taskMsg = ''
    },
    onAnswerMessage: function (uid) {
      this.currentAnswerMessageUid = uid
    },
    onChangeDates: function (begin, end) {
      const data = {
        uid_task: this.task.uid,
        str_date_begin: begin,
        str_date_end: end,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data)
        .then(
          resp => {
            const data = {
              is_overdue: resp.is_overdue,
              term_user: resp.term,
              date_begin: resp.str_date_begin,
              date_end: resp.str_date_end
            }
            this.$emit('changeValue', data)
            this.readTask()
          })
    },
    changeStatus (status) {
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: status
      }).then(() => {
        this.$emit('changeValue', { status: status })
      })
    }
  }
}
</script>

<style scoped>
</style>
