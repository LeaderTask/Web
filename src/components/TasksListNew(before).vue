<template>
  <!-- Confirm modal -->
  <ModalBoxDelete
    v-if="showConfirm"
    title="Удалить задачу"
    :text="modalBoxDeleteText"
    @cancel="showConfirm = false"
    @yes="removeTask(lastSelectedTaskUid)"
  />
  <TaskListModalBoxLicenseLimit
    v-if="showTasksLimit"
    @cancel="showTasksLimit = false"
    @ok="showTasksLimit = false"
  />
  <inspector-modal-box
    v-model="showInspector"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
  />
  <InspectorLimit
    v-if="showFreeModal"
    @cancel="showFreeModal = false"
  />

  <!-- Add task input -->
  <div
    v-if="taskListSource && !DONT_SHOW_TASK_INPUT_UIDS[taskListSource.uid]"
    class="fixed-create z-[2] flex bg-[#f4f5f7] px-px pt-px"
  >
    <button
      class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
      @click="shouldShowInspector"
    >
      Поручить
    </button>
    <div
      class="flex items-center bg-[#FAFAFB] border dark:bg-gray-700 rounded-[8px] w-full"
    >
      <div
        class="flex items-center pl-3"
        :class="{ 'bg-white p-3 rounded-l-lg cursor-pointer': Object.keys(copiedTasks).length }"
        @click="pasteCopiedTasks('00000000-0000-0000-0000-000000000000')"
      >
        <svg
          :class="{ 'mr-2': Object.keys(copiedTasks).length }"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
            stroke="#7E7E80"
            stroke-width="1"
            stroke-linecap="round"
          />
        </svg>
        <div
          v-if="Object.keys(copiedTasks).length"
          class="flex items-center justify-center bg-rose-600 rounded-full w-6 h-6"
        >
          <p class="text-white text-sm font-bold">
            {{ Object.keys(copiedTasks).length }}
          </p>
        </div>
      </div>
      <TaskListEdit
        id="task"
        ref="root"
        v-model="createTaskText"
        bg-transperant
        class="w-full text-black"
        placeholder="Добавить задачу"
        @keyup.enter="createTask($event)"
      />
    </div>
  </div>

  <EmptyTasksListPics
    v-if="!Object.keys(storeTasks).length && status === 'success'"
  />

  <!-- Skeleton -->
  <TasksSkeleton
    v-if="status == 'loading'"
  />
  <!-- vue3-treeview -->
  <div
    v-if="status == 'success'"
    class="overflow-y-auto pt-[4px] px-px min-h-[300px] w-full"
  >
    <tree
      :nodes="storeTasks"
      :config="newConfig"
      class="w-full h-full"
      @nodeOpened="nodeExpanding"
      @nodeFocus="nodeSelected"
      @nodeDragend="nodeDragEnd"
    >
      <template #before-input="props">
        <div
          :id="props.node.info.uid"
          class="group shrink-0 w-full pl-[31px] pr-[6px] py-[11px] mb-[4px] min-h-[42px] font-roboto flex flex-col bg-white rounded-[8px] relative"
          :style="{ backgroundColor: getValidBackColor(colors[props.node.info.uid_marker]?.back_color) }"
          :class="{ 'ring-1 ring-orange-400': props.node.id === lastSelectedTaskUid}"
        >
          <!-- Name, Status -->
          <div
            class="flex gap-[6px] items-center w-full"
          >
            <div class="flex-none h-[20px] w-[20px] leading-[20px]">
              <TaskStatus
                :task="props.node.info"
                @changeStatus="onChangeStatus($event, props.node.info)"
                @click.stop
              />
            </div>

            <!-- Editable name -->
            <contenteditable
              v-model="props.node.info.name"
              tag="div"
              class="taskName p-0 ring-0 outline-none w-[calc(100%-26px)] overflow-x-clip break-words cursor-default"
              :contenteditable="props.node.info._isEditable"
              placeholder="Введите название задачи"
              :no-nl="true"
              :no-html="true"
              :class="{ 'uppercase': !props.node.info._isEditable && colors[props.node.info.uid_marker] && colors[props.node.info.uid_marker].uppercase, 'text-gray-500': props.node.info.status == 1 || props.node.info.status == 7, 'line-through': props.node.info.status == 1 || props.node.info.status == 7, 'font-extrabold': props.node.info.readed == 0 }"
              :style="{ color: getValidForeColor(colors[props.node.info.uid_marker]?.fore_color) }"
              @focusout="clearTaskFocus(props.node.info)"
              @dblclick.stop="editTaskName(props.node.id)"
              @keydown.enter="updateTask($event, props.node.info); props.node.info._isEditable = false;"
            />
          </div>

          <!-- Tags, Overdue, Customer, Performer -->
          <div
            v-if="props.node.info.uid_customer == '00000000-0000-0000-0000-000000000000' || props.node.info.email_performer || props.node.info.is_overdue || props.node.info.tags || props.node.info.uid_project == '00000000-0000-0000-0000-000000000000' || props.node.info.term_customer || props.node.info.checklist || props.node.info.has_files || props.node.info.has_msgs || props.node.info.comment || props.node.info.focus"
            class="flex flex-wrap gap-[4px] items-center mt-[6px]"
          >
            <!-- Focus -->
            <TaskListIconLabel
              v-if="props.node.info.focus"
              :icon-path="taskfocus.path"
              :icon-box="taskfocus.viewBox"
              icon-class="text-red-600"
              icon-height="15"
              class="h-[22px]"
            />
            <!-- Data -->
            <TaskListIconLabel
              v-if="props.node.info.type === 1 || props.node.info.type === 2"
              :icon-path="clock.path"
              :icon-box="clock.viewBox"
              :text="props.node.info.term_user ? props.node.info.term_user : props.node.info.term_customer"
              icon-width="16"
              class="h-[22px]"
              icon-height="16"
            />
            <TaskListIconLabel
              v-if="props.node.info.type !== 1 && props.node.info.type !== 2"
              :icon-path="clock.path"
              :icon-box="clock.viewBox"
              :text="props.node.info.term_customer"
              icon-class="text-red-600"
              class="h-[22px]"
              icon-height="15"
            />
            <!-- Customer -->
            <TaskListTagLabel
              v-if="props.node.info.uid_customer != '00000000-0000-0000-0000-000000000000' && employees[props.node.info.uid_customer] && props.node.info.uid_customer != currentUserUid"
              :text="employees[props.node.info.uid_customer].name"
              :color-bg-class="{ 'border-red-500': currentUserEmail == props.node.info.email_performer, 'bg-gray-400': currentUserEmail != props.node.info.email_performer, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7, 'bg-red-500': currentUserEmail == props.node.info.email_performer }"
              icon-height="15"
              :image="employees[props.node.info.uid_customer] ? employees[props.node.info.uid_customer].fotolink : ''"
              class="h-[22px]"
            />
            <!-- Performer -->
            <TaskListTagLabel
              v-if="props.node.info.email_performer && employeesByEmail[props.node.info.email_performer] && currentUserEmail != props.node.info.email_performer && employees[props.node.info.uid_customer] && employees[props.node.info.uid_customer].email != props.node.info.email_performer"
              :text="employeesByEmail[props.node.info.email_performer].name"
              :icon-width="props.node.info.performerreaded ? performerRead.width : performerNotRead.width"
              :icon-height="props.node.info.performerreaded ? performerRead.height : performerNotRead.height"
              :icon-box="props.node.info.performerreaded ? performerRead.viewBox : performerNotRead.viewBox"
              :icon-path="props.node.info.performerreaded ? performerRead.path : performerNotRead.path"
              :image="employeesByEmail[props.node.info.email_performer] ? employeesByEmail[props.node.info.email_performer].fotolink : ''"
              :color-bg-class="{ 'bg-gray-400': currentUserEmail != props.node.info.email_performer, 'bg-green-500': currentUserUid == props.node.info.uid_customer, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
              class="h-[22px]"
            />
            <!-- Overdue -->
            <TaskListTagLabel
              v-if="props.node.info.is_overdue"
              text="Просрочено"
              color-text-class="text-red-600"
              color-bg-class="bg-red-300 opacity-70"
              icon-height="15"
              class="h-[22px]"
            />
            <!-- Tags -->
            <template
              v-for="(tag, index) in props.node.info.tags"
              :key="index"
            >
              <TaskListTagLabel
                v-if="tags[tag]"
                :icon-path="tagIcon.path"
                :icon-box="tagIcon.viewBox"
                :text="tags[tag].name"
                :color-bg-style="{ backgroundColor: tags[tag] ? tags[tag].back_color : '' }"
                class="h-[22px]"
              />
            </template>
            <!-- Project -->
            <TaskListTagLabel
              v-if="taskListSource && props.node.info.uid_project != '00000000-0000-0000-0000-000000000000' && projects[props.node.info.uid_project] && props.node.info.uid_project !== taskListSource.param"
              :icon-path="project.path"
              :icon-box="project.viewBox"
              :text="projects[props.node.info.uid_project].name"
              :color-bg-class="{ 'bg-yellow-400': true, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
              class="h-[22px]"
            />
            <!-- Files -->
            <TaskListIconLabel
              v-if="props.node.info.has_files"
              :icon-path="file.path"
              :icon-box="file.viewBox"
              icon-width="11"
              icon-height="15"
              class="h-[22px]"
            />
            <!-- Checklist -->
            <TaskListIconLabel
              v-if="props.node.info.checklist"
              :icon-path="checklist.path"
              :icon-box="checklist.viewBox"
              :text="`${countChecklist(props.node.info.checklist).done} / ${countChecklist(props.node.info.checklist).undone}`"
              icon-height="15"
              icon-width="14"
              class="h-[22px]"
            />
            <!-- Access -->
            <TaskListIconLabel
              v-if="props.node.info.emails"
              :icon-path="inaccess.path"
              :icon-box="inaccess.viewBox"
              icon-width="15"
              icon-height="15"
              class="h-[22px]"
            />
            <!-- Messages -->
            <TaskListIconLabel
              v-if="props.node.info.has_msgs"
              :icon-path="msgs.path"
              :icon-box="msgs.viewBox"
              icon-height="15"
              class="h-[22px]"
            />
            <!-- Comment -->
            <TaskListIconLabel
              v-if="props.node.info.comment.replace(/\r?\n|\r/g, '')"
              :icon-path="taskcomment.path"
              :icon-box="taskcomment.viewBox"
              icon-height="14"
              class="h-[22px]"
            />
          </div>

          <TaskListActionHoverPanel
            :id="`hover-panel-${props.node.id}`"
            class="absolute right-[8px] top-[calc(50%-18px)] invisible group-hover:visible"
            :is-my-task="props.node.info.uid_customer == currentUserUid"
            :can-paste="Object.keys(copiedTasks).length"
            @click.stop
            @addSubtask="addSubtask(props.node.info)"
            @changeFocus="changeFocus(props.node.info)"
            @openMenu="toggleTaskHoverPopper(true, props.node.id)"
            @closeMenu="toggleTaskHoverPopper(false, props.node.id)"
            @tomorrow="moveTaskTomorrow(props.node.info)"
            @copyName="copyTaskName(props.node.info)"
            @copy="copyTask(props.node.info)"
            @cut="cutTask(props.node.info)"
            @paste="pasteCopiedTasks(props.node.id)"
            @delete="clickDeleteTask(props.node.id)"
          />
        </div>
      </template>
    </tree>
  </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import treeview from 'vue3-treeview'
import { useStore } from 'vuex'
import InspectorLimit from '@/components/TasksList/InspectorLimit.vue'
import TaskStatus from '@/components/TasksList/TaskStatus.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics.vue'
import ModalBoxDelete from './Common/ModalBoxDelete.vue'
import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import contenteditable from 'vue-contenteditable'
import TaskListIconLabel from '@/components/TasksList/TaskListIconLabel.vue'
import TaskListTagLabel from '@/components/TasksList/TaskListTagLabel.vue'
import TaskListActionHoverPanel from '@/components/TasksList/TaskListActionHoverPanel.vue'
import TaskListModalBoxLicenseLimit from '@/components/TasksList/TaskListModalBoxLicenseLimit.vue'
import TaskListEdit from '@/components/TasksList/TaskListEdit.vue'
import TasksSkeleton from '@/components/TasksList/TasksSkeleton.vue'

import * as TASK from '@/store/actions/tasks'

/* Icons */
import file from '@/icons/file.js'
import inaccess from '@/icons/inaccess.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import project from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import panelfocus from '@/icons/panelfocus.js'
import clock from '@/icons/clock.js'
import subtask from '@/icons/subtask.js'
import taskoptions from '@/icons/taskoptions.js'
import repeat from '@/icons/repeat.js'
import fortomorrow from '@/icons/for-tomorrow.js'
import copy from '@/icons/copy.js'
import cut from '@/icons/cut.js'
import bin from '@/icons/bin.js'
/* /Icons */

export default {
  components: {
    tree: treeview,
    TaskListIconLabel,
    TaskListTagLabel,
    TaskListEdit,
    TasksSkeleton,
    ModalBoxDelete,
    InspectorLimit,
    InspectorModalBox,
    EmptyTasksListPics,
    TaskStatus,
    contenteditable,
    TaskListActionHoverPanel,
    TaskListModalBoxLicenseLimit
  },
  setup (props) {
    const store = useStore()
    const loadedTasks = computed(() => store.state.tasks.loadedTasks)
    const employees = computed(() => store.state.employees.employees)
    const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
    const taskListSource = computed(() => store.state.taskListSource)
    const projects = computed(() => store.state.projects.projects)
    const createTaskText = ref('')
    const status = computed(() => store.state.tasks.status)
    const user = computed(() => store.state.user.user)
    const newConfig = computed(() => store.state.tasks.newConfig)
    const storeTasks = computed(() => store.state.tasks.newtasks)
    const overdue = computed(() => store.state.tasks.overdue)
    const isDark = computed(() => store.state.darkMode)
    const navStack = computed(() => store.state.navbar.navStack)
    const settings = computed(() => {
      return store.state.navigator.navigator.settings
    })

    const lastVisitedDate = computed(() => {
      return (navStack.value && navStack.value.length && navStack.value[navStack.value.length - 1].value && navStack.value[navStack.value.length - 1].value.uid && navStack.value[navStack.value.length - 1].value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b' && navStack.value[navStack.value.length - 1].value.param ? new Date(navStack.value[navStack.value.length - 1].value.param) : new Date())
    })

    const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
    const copiedTasks = computed(() => store.state.tasks.copiedTasks)
    const lastSelectedTaskUid = ref('')
    const showConfirm = ref(false)
    const showTasksLimit = ref(false)
    const showFreeModal = ref(false)
    const showInspector = ref(false)
    const isTaskStatusPopperActive = ref(false)
    const date = computed(() => {
      return lastVisitedDate.value.getDate() + '-' + lastVisitedDate.value.getMonth() + '-' + lastVisitedDate.value.getFullYear()
    })

    const stop = ref(true)
    const draggables = document.querySelectorAll('.draggable')
    draggables.forEach(node => {
      node.addEventListener('drag', e => {
        stop.value = true
        console.log(e.originalEvent.clientY)
        if (e.originalEvent.clientY < 300) {
          stop.value = false
          scroll(-1)
        }
        if (e.originalEvent.clientY > (window.innerHeight - 150)) {
          stop.value = false
          scroll(1)
        }
      })
      node.addEventListener('dragend', e => {
        stop.value = true
      })
    })

    const scroll = (step) => {
      const scrollY = window.scrollTop()
      window.scrollTop(scrollY + step)
      if (!stop.value) {
        setTimeout(() => {
          scroll(step)
        }, 20)
      }
    }

    const SHOW_TASK_INPUT_UIDS = {
      '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
      '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
      '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
      '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
      '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
      '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
      'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
      'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
      '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
    }

    const toggleTaskHoverPopper = (visible, uid) => {
      const el = document.getElementById(`hover-panel-${uid}`)
      if (el) el.style.visibility = visible ? 'visible' : null
    }

    const editTaskName = (uid) => {
      storeTasks.value[uid].info._isEditable = user.value.current_user_uid === storeTasks.value[uid].info.uid_customer
      document.getElementById(uid).parentNode.draggable = false
      nextTick(() => {
        // select all content in editing task
        const taskName = document.getElementById(uid).querySelector('.taskName')
        const range = document.createRange()
        const sel = document.getSelection()
        taskName.focus({ preventScroll: false })
        range.setStart(taskName, 0)
        range.setEnd(taskName, 1)
        sel.addRange(range)
      })
    }

    const nodeExpanding = (arg) => {
      if (loadedTasks.value[arg.id]) return
      store.dispatch(TASK.SUBTASKS_REQUEST, arg.id)
        .then(() => {
          store.commit(TASK.ADD_LOADED_TASK, arg.id)
          store.commit(TASK.UPDATE_NEW_TASK_LIST, store.state.tasks.subtasks.tasks)
          // remove fake-uid from children array if subtasks are loaded
          for (let i = 0; i < arg.children.length; i++) {
            if (arg.children[i] === 'fake-uid') {
              arg.children.splice(i, 1)
            }
          }
          for (const task of store.state.tasks.subtasks.tasks) {
            if (!arg.children.includes(task.uid)) {
              arg.children.push(task.uid)
            }
          }
        })
    }

    const countChecklist = (checklist) => {
      const data = { done: 0, undone: 0 }
      for (const line of checklist.split('\r\n\r\n')) {
        data.undone++
        if (+line.split('\r\n')[0] === 1) {
          data.done++
        }
      }
      return data
    }

    function uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }

    const pad2 = (n) => {
      return (n < 10 ? '0' : '') + n
    }

    const getTodaysDate = (val, isYearFirst = true) => {
      if (val == null) {
        val = new Date()
      }
      if (typeof val === 'string') { // parse date from ISO 8601 string
        val = new Date(val)
      }
      const month = pad2(val.getMonth() + 1)
      const day = pad2(val.getDate())
      const year = pad2(val.getFullYear())
      if (isYearFirst) {
        return year + '-' + month + '-' + day
      } else {
        return day + '-' + month + '-' + year
      }
    }

    const handleTaskSource = (taskData, uidParent) => {
      let data
      if (taskData) {
        taskData.uid = uuidv4()
        taskData.status = 0
        taskData.uid_parent = uidParent
        taskData.uid_customer = user.value.current_user_uid
        taskData.email_performer = ''
        taskData.tags = []
        taskData.uid_marker = ''
        taskData.has_files = false
        taskData.has_msgs = false
        taskData.type = 1
        taskData._addToList = true
        data = taskData
      } else {
        data = {
          uid: uuidv4(),
          uid_parent: uidParent,
          uid_customer: user.value.current_user_uid,
          uid_project: '00000000-0000-0000-0000-000000000000',
          status: 0,
          email_performer: '',
          type: 1,
          name: createTaskText.value,
          comment: '',
          _addToList: true
        }
      }

      switch (SHOW_TASK_INPUT_UIDS[taskListSource.value.uid]) {
        case TASK.TASKS_REQUEST:
          data.date_begin = getTodaysDate(taskListSource.value.param) + 'T00:00:00'
          data.date_end = getTodaysDate(taskListSource.value.param) + 'T23:59:59'
          break
        case TASK.IN_FOCUS_TASKS_REQUEST:
          data.focus = 1
          break
        case TASK.DELEGATED_TASKS_REQUEST:
          data.email_performer = taskListSource.value.param
          break
        case TASK.PROJECT_TASKS_REQUEST:
          data.uid_project = taskListSource.value.param
          break
        case TASK.EMPLOYEE_TASKS_REQUEST:
          data.email_performer = employees.value[taskListSource.value.param].email
          break
        case TASK.COLOR_TASKS_REQUEST:
          data.uid_marker = taskListSource.value.param
          break
        case TASK.TAG_TASKS_REQUEST:
          data.tags = [taskListSource.value.param]
          break
      }
      console.log(data)
      return data
    }

    const pasteCopiedTasks = (uidParent) => {
      if (!copiedTasks.value) {
        return
      }

      for (const uid in copiedTasks.value) {
        const data = handleTaskSource(copiedTasks.value[uid], uidParent)
        store.dispatch(TASK.CREATE_TASK, data)
        // actually remove task from server if this task was with _deleteAfterPaste flag (cut task)
        if (copiedTasks.value[uid]._deleteAfterPaste && copiedTasks.value[uid]._originTaskUid) {
          store.dispatch(TASK.REMOVE_TASK, copiedTasks.value[uid]._originTaskUid)
        }
      }
      store.commit(TASK.RESET_COPY_TASK)
    }

    const createTask = (e) => {
      const data = handleTaskSource()
      e.preventDefault()
      e.target.value = ''
      e.target.blur()
      e.target.focus()
      const title = data.name.trim()
      if (title) {
        data.name = title
        store.dispatch(TASK.CREATE_TASK, data)
          .then((resp) => {
          // выделяем добавленную задачу
          // и отображаем её свойства
            nodeSelected({ id: data.uid, info: resp.data })
            if (navStack.value && navStack.value[navStack.value.length - 1].value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') {
              store.commit('addDot', new Date(navStack.value[navStack.value.length - 1].value.param))
            }
            document.getElementById('task').firstElementChild.focus({ preventScroll: false })
            setTimeout(() => {
              document.getElementById(data.uid).parentNode.draggable = false
              gotoNode(data.uid)
            }, 200)
          })
          .catch((e) => {
            if (e.response?.data?.error === 'limit. invalid license.') {
              showTasksLimit.value = true
            }
          })
      }
      createTaskText.value = ''

      return false
    }

    const updateTask = (event, task) => {
      if (task._isEditable) {
        task.enterPress = true
        task.name = task.name.replace(/\r?\n|\r/g, '')
        if (task.name.length > 0) {
          if (task._justCreated) {
            task._justCreated = false
            store.dispatch(TASK.CREATE_TASK, task)
              .catch((e) => {
                if (e.response?.data?.error === 'limit. invalid license.') {
                  showTasksLimit.value = true
                  store.commit(TASK.REMOVE_TASK, task.uid)
                }
              })
          } else {
            store.dispatch(TASK.CHANGE_TASK_NAME, { uid: task.uid, value: task.name })
          }
          task._isEditing = false
        } else if (task.name.length === 0) {
          if (task._justCreated) {
            if (isPropertiesMobileExpanded.value) {
              store.dispatch('asidePropertiesToggle', false)
            }
            store.commit(TASK.REMOVE_TASK, task.uid)
          } else {
            showConfirm.value = true
            // removeTask(task.uid)
          }
        }
        if (task.uid_customer === user.value.current_user_uid) {
          document.getElementById(task.uid).parentNode.draggable = true
        }
        store.dispatch(TASK.SELECT_TASK, task)
        nextTick(() => { document.getElementById(task.uid).parentNode.click() })
      }
    }
    const clearTaskFocus = (task) => {
      console.log(task.name)
      if (task.name === '') {
        removeTask(task.uid)
      } else if (task.name !== '' && !task.enterPress) {
        updateTask(event, task)
      }
      if (isPropertiesMobileExpanded.value) {
        store.dispatch('asidePropertiesToggle', false)
      }
      task._isEditing = false
    }
    const moveTaskTomorrow = (task) => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      store.dispatch(
        TASK.CHANGE_TASK_DATE,
        {
          uid_task: task.uid,
          str_date_begin: getTodaysDate(tomorrow) + 'T00:00:00',
          str_date_end: getTodaysDate(tomorrow) + 'T23:59:59',
          reset: 0
        }
      ).then((resp) => {
        task.term_user = resp.term
        task.is_overdue = resp.is_overdue
        if (task.uid_parent && task.uid_parent === '00000000-0000-0000-0000-000000000000') {
          store.commit(TASK.REMOVE_TASK, task.uid)
        }
      })
    }

    const copyTaskName = (task) => {
      navigator.clipboard.writeText(task.name)
    }

    const removeTask = (uid) => {
      if (isPropertiesMobileExpanded.value) {
        store.dispatch('asidePropertiesToggle', false)
      }
      store.dispatch(TASK.REMOVE_TASK, uid)
        .then(() => {
          showConfirm.value = false
          store.dispatch(TASK.DAYS_WITH_TASKS)
            .then(() => {
              const calendarDates = computed(() => store.state.calendar[1].dates)
              const daysWithTasks = computed(() => store.state.tasks.daysWithTasks)
              for (let i = 0; i < calendarDates.value.length; i++) {
                const date = calendarDates.value[i].getDate() + '-' + (calendarDates.value[i].getMonth() + 1) + '-' + calendarDates.value[i].getFullYear()
                if (!daysWithTasks.value.includes(date)) {
                  store.state.calendar[1].dates.splice(store.state.calendar[1].dates.indexOf(calendarDates.value[i]), 1)
                }
              }
            })
        })
    }
    const gotoNode = (uid) => {
      document.getElementById(uid).parentElement.focus({ preventScroll: false })
      const taskName = document.getElementById(uid).querySelector('.taskName')
      const range = document.createRange()
      const sel = document.getSelection()
      taskName.focus({ preventScroll: false })
      range.setStart(taskName, 1)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      lastSelectedTaskUid.value = uid
    }

    const addSubtask = (parent) => {
      const newSubtask = {
        date_create: new Date(),
        uid: uuidv4(),
        uid_customer: user.value.current_user_uid,
        email_performer: parent.uid_customer === user.value.current_user_uid ? parent.email_performer : '',
        name: '',
        emails: '',
        comment: '',
        tags: [],
        uid_marker: '00000000-0000-0000-0000-000000000000',
        status: 0,
        uid_parent: parent.uid,
        uid_project: parent.uid_project !== '00000000-0000-0000-0000-000000000000' ? parent.uid_project : '00000000-0000-0000-0000-000000000000',
        type: 1,
        SeriesType: 0,
        _isEditing: true,
        _isEditable: true,
        _justCreated: true
      }
      console.log(parent)
      store.dispatch(TASK.SELECT_TASK, newSubtask)
      store.dispatch(TASK.ADD_SUBTASK, newSubtask)
        .then(() => {
          // Don't know the event when I can call edit just created subtask
          // If we don't wait, then we won't focus on just created subtask
          setTimeout(() => {
            document.getElementById(newSubtask.uid).parentNode.draggable = false
            gotoNode(newSubtask.uid)
          }, 200)
        })
    }
    const copyTask = (task) => {
      const copiedTask = { ...task }
      copiedTask._deleteAfterPaste = false
      store.commit(TASK.COPY_TASK, copiedTask)
    }

    const cutTask = (task) => {
      store.commit(TASK.REMOVE_TASK, task.uid)
      const copiedTask = { ...task }
      copiedTask._originTaskUid = task.uid
      copiedTask._deleteAfterPaste = true
      store.commit(TASK.COPY_TASK, copiedTask)
    }

    const nodeSelected = (arg) => {
      lastSelectedTaskUid.value = arg.id
      // nextTick поставил чтобы сначала выделилось, а потом делало
      // всё остальное
      nextTick(() => {
        if (!isPropertiesMobileExpanded.value && arg.info.name) {
          store.dispatch('asidePropertiesToggle', true)
        }
        store.commit('basic', { key: 'propertiesState', value: 'task' })
        store.dispatch(TASK.SELECT_TASK, arg.info)
      })
    }
    const nodeDragEnd = (node) => {
      if (storeTasks.value[node.dragged.node.id]) {
        // change order in children
        if (storeTasks.value[node.dragged.node.id].parent) {
          const parent = storeTasks.value[storeTasks.value[node.dragged.node.id].parent]
          if (parent.children.length >= 1) {
            for (let i = 0; i < parent.children.length; i++) {
              if (parent.children[i] === node.dragged.node.id) {
                if (i === 0) {
                  if (storeTasks.value[parent.children[i + 1]]?.info) {
                    storeTasks.value[parent.children[i]].info.order_new = storeTasks.value[parent.children[i + 1]].info.order_new - 0.1
                  } else {
                    storeTasks.value[parent.children[i]].info.order_new = 1
                  }
                } else if (i > 0 && i !== parent.children.length - 1) {
                  if (storeTasks.value[parent.children[i + 1]]?.info) {
                    storeTasks.value[parent.children[i]].info.order_new = (storeTasks.value[parent.children[i - 1]].info.order_new + storeTasks.value[parent.children[i + 1]].info.order_new) / 2
                  } else {
                    storeTasks.value[parent.children[i]].info.order_new = 1
                  }
                } else {
                  storeTasks.value[parent.children[i]].info.order_new = storeTasks.value[parent.children[i - 1]].info.order_new + 0.1
                }
              }
            }
          }
        } else {
          // change order in root
          if (newConfig.value.roots.length >= 1) {
            for (let i = 0; i < newConfig.value.roots.length; i++) {
              if (newConfig.value.roots[i] === node.dragged.node.id) {
                if (i === 0) {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = storeTasks.value[newConfig.value.roots[i + 1]].info.order_new - 0.1
                } else if (i > 0 && i !== newConfig.value.roots.length - 1) {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = (storeTasks.value[newConfig.value.roots[i - 1]].info.order_new + storeTasks.value[newConfig.value.roots[i + 1]].info.order_new) / 2
                } else {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = storeTasks.value[newConfig.value.roots[i - 1]].info.order_new + 0.1
                }
              }
            }
          }
        }
      }
      let parentUid
      for (const elem in storeTasks.value) {
        if (storeTasks.value[elem].children.includes(node.dragged.node.id)) {
          parentUid = elem
        }
      }
      store.dispatch(
        TASK.CHANGE_TASK_PARENT_AND_ORDER,
        {
          uid: node.dragged.node.id,
          parent: parentUid ?? '00000000-0000-0000-0000-000000000000',
          order: node.dragged.node.info.order_new ?? 0
        }
      ).then(() => {
        store.commit(TASK.REMOVE_TASK_FROM_LEAVES, parentUid)
      })
    }
    const shouldShowInspector = () => {
      if (user.value.tarif !== 'alpha') {
        showFreeModal.value = true
        return
      }
      showInspector.value = true
    }
    const changeFocus = (task) => {
      const newFocus = task.focus === 1 ? 0 : 1
      store.dispatch(TASK.CHANGE_TASK_FOCUS, { uid: task.uid, value: newFocus }).then(
        resp => {
          task.focus = newFocus
        })
    }
    const isActive = true
    return {
      isActive,
      shouldShowInspector,
      changeFocus,
      clearTaskFocus,
      editTaskName,
      navStack,
      date,
      settings,
      overdue,
      store,
      storeTasks,
      newConfig,
      showConfirm,
      showFreeModal,
      showInspector,
      showTasksLimit,
      nodeDragEnd,
      isDark,
      status,
      tags: computed(() => store.state.tasks.tags),
      employees,
      employeesByEmail,
      isTaskStatusPopperActive,
      projects,
      toggleTaskHoverPopper,
      nodeExpanding,
      nodeSelected,
      lastSelectedTaskUid,
      countChecklist,
      createTask,
      pasteCopiedTasks,
      copiedTasks,
      copyTask,
      cutTask,
      updateTask,
      removeTask,
      copyTaskName,
      moveTaskTomorrow,
      addSubtask,
      createTaskText,
      taskListSource,
      SHOW_TASK_INPUT_UIDS,
      file,
      inaccess,
      msgs,
      user,
      taskcomment,
      checklist,
      colors: computed(() => store.state.colors.colors)
    }
  },
  data () {
    const DONT_SHOW_TASK_INPUT_UIDS = {
      '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
      '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
      'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
      '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
      'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
      '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
      '11212e94-cedf-11ec-9d64-0242ac120002': TASK.SEARCH_TASK,
      '47a38aa5-19c4-40d0-b8c0-56c3a420935d': TASK.ONE_TASK_REQUEST
    }
    return {
      DONT_SHOW_TASK_INPUT_UIDS,
      project,
      tagIcon,
      performerNotRead,
      performerRead,
      taskfocus,
      panelfocus,
      clock,
      subtask,
      taskoptions,
      repeat,
      fortomorrow,
      copy,
      cut,
      bin
    }
  },
  computed: {
    currentUserEmail () {
      return this.$store.state.user.user?.current_user_email ?? ''
    },
    currentUserUid () {
      return this.$store.state.user.user?.current_user_uid ?? ''
    },
    modalBoxDeleteText () {
      let text = 'Вы действительно хотите удалить задачу?'
      if (this.storeTasks[this.lastSelectedTaskUid]?.children.length > 0) {
        text = 'Вы действительно хотите удалить задачу с подзадачами в количестве: ' + this.storeTasks[this.lastSelectedTaskUid].children.length + '?'
      }
      return text
    },
    isInFocus () {
      return this.props.node.info.focus === 1
    },
    calendarDates () {
      return this.$store.state.calendar[1].dates
    },
    daysWithTasks () {
      return this.$store.state.tasks.daysWithTasks
    }
  },
  created () {
    const store = useStore()
    document.addEventListener('keyup', function (evt) {
      if (evt.keyCode === 27) {
        store.dispatch('asidePropertiesToggle', false)
      }
    })
  },
  methods: {
    print (value) {
      console.log(value)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    getStoreTasks () {
      return this.storeTasks
    },
    clickDeleteTask (uid) {
      console.log(this.lastSelectedTaskUid)
      this.lastSelectedTaskUid = uid
      this.showConfirm = true
    },
    onChangeStatus (status, task) {
      console.log('onChangeStatus', status, task)
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: task.uid, value: status }).then(() => {
        if (!this.$store.state.navigator.navigator.settings.show_completed_tasks && [1, 5, 7, 8].includes(status)) {
          this.$store.commit(TASK.REMOVE_TASK, task.uid)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.dispatch(TASK.DAYS_WITH_TASKS)
            .then(() => {
              console.log('this.calendarDates.value', this.calendarDates)
              for (let i = 0; i < this.calendarDates.length; i++) {
                const date = this.calendarDates[i].getDate() + '-' + (this.calendarDates[i].getMonth() + 1) + '-' + this.calendarDates[i].getFullYear()
                if (!this.daysWithTasks.includes(date)) {
                  this.$store.state.calendar[1].dates.splice(this.$store.state.calendar[1].dates.indexOf(this.calendarDates.value[i]), 1)
                }
              }
            })
        }
      })
    }
  }
}
window.getSelection().removeAllRanges()
</script>

<style>
.tree-level {
  flex: 1;
  margin-left: 0 !important;
}
.tree {
  margin-left: 0;
}

.icon-wrapper {
  padding: 0;
  min-width: 0;
  flex-shrink: 0;
  display: flex;
  align-items: start;
  justify-content: center;
  width: 35px;
  position: absolute;
  left: 0;
  cursor: pointer;
  z-index: 1;
  top: 18px;
}

.input-wrapper {
  margin-left: .75em
}

.icon-wrapper svg {
  height: 10px;
  width: 10px;
}

.node-wrapper {
  min-height: 32px;
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  margin-left: 0rem;
  word-wrap: break-word;
  font-size: 14px;
  outline: none
}

.node-wrapper.disabled .checkbox-wrapper.checked {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper.indeterminate {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper {
  border-color: #00000042
}

.checkbox-wrapper, checked:after {
  transform: translate(.25em, .3365384615em) rotate(-45deg);
  width: .7em;
  height: .3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none
}

.checkbox-wrapper.indeterminate:after {
  transform: translate(.25em, .3365384615em) rotate(0);
  width: .7em;
  height: .3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none;
  border-left-style: none
}

.checkbox-wrapper:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0
}

.node-over {
  border-top: solid 2px #5C6BC0
}

.node-in {
  background-color: #bdbdbd
}

.node-under {
  border-bottom: solid 2px #5C6BC0
}

.progress {
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #aab6fe;
  border-radius: 2px;
  background-clip: padding-box;
  margin: 0.5rem 0 1rem 0;
  overflow: hidden;
}
.progress .indeterminate {
  background-color: #3f51b5;
}
.progress .indeterminate:before {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
    infinite;
  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate:after {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  -webkit-animation-delay: 1.15s;
  animation-delay: 1.15s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}

.level-enter-active,
.level-leave-active {
  transition: opacity 0.2s ease;
}

.level-enter-from,
.level-leave-to {
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: 0
}

.tree-node {
  @apply ring-0 border-0
}

.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.fixed-create {
  position: sticky;
  top: 55px;
  background-color:#f4f5f7;
}

[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: gray
}
</style>
