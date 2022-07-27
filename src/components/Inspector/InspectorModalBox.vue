<script setup>
import { computed, ref, watch, provide, nextTick } from 'vue'
import { useStore } from 'vuex'
import { shouldAddTaskIntoList } from '@/websync/utils'

// import JbButton from '@/components/JbButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import Overlay from '@/components/modals/Overlay.vue'
import InspectorContent from '@/components/Inspector/InspectorContent.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'white'
  },
  buttonLabel: {
    type: String,
    default: 'Done'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  hasButton: Boolean
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmCancel = (mode) => {
  value.value = false
  emit(mode)
}

// const confirm = () => confirmCancel('confirm')
const store = useStore()
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)
const cancel = () => confirmCancel('cancel')

const delegatedTask = {}
const input = ref()
const currentState = ref('taskName')
const inputMessage = ref('')
const messages = ref([
  {
    message: 'Привет, что нужно сделать?',
    messageFromInspector: true,
    type: 'taskName',
    createDate: new Date().toISOString()
  }
])

provide('inputMessage', inputMessage)
provide('currentState', currentState)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const pad2 = (n) => {
  return (n < 10 ? '0' : '') + n
}

const getTodaysDate = (val, isYearFirst = true) => {
  if (val == null) {
    val = new Date()
  }
  if (typeof val === 'string') {
    // parse date from ISO 8601 string
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

watch(value, (newVal) => {
  if (!newVal) {
    // очищаем объект новой задачи
    Object.keys(delegatedTask).forEach((key) => delete delegatedTask[key])
    // очищаем все сообщения
    messages.value.splice(0)
    // запускаем первое сообщение
    messages.value.push({
      message: 'Привет, что нужно сделать?',
      messageFromInspector: true,
      type: 'taskName',
      createDate: new Date().toISOString()
    })
    currentState.value = 'taskName'
  } else {
    // ставим фокус в edit
    setTimeout(() => {
      input.value.focus({ preventScroll: false })
    }, 250)
  }
})

const createTask = () => {
  delegatedTask.uid = uuidv4()
  delegatedTask.uid_parent = '00000000-0000-0000-0000-000000000000'
  delegatedTask.uid_customer = user.value.current_user_uid
  delegatedTask.status = 0
  delegatedTask.type = 1
  delegatedTask._addToList = false
  store.dispatch('CREATE_TASK', delegatedTask).then((resp) => {
    // manually setup uid_performer beacuse
    // we get empty uid_performer after CREATE_TASK request
    resp.data.uid_performer = delegatedTask.uid_performer
    store.dispatch('CREATE_INSPECTOR_TASK', {
      uid: delegatedTask.uid,
      uid_customer: delegatedTask.uid_customer,
      is_inspectable: 1,
      taskJson: JSON.stringify(resp.data)
    })
    // update both, performer and customer in inspector service
    const performer = employees.value[resp.data.uid_performer]
    const myself = employees.value[user.value.current_user_uid]
    store.dispatch('CREATE_OR_UPDATE_INSPECTOR_USER', {
      uid: performer.uid,
      userJson: JSON.stringify(performer)
    })
    store.dispatch('CREATE_OR_UPDATE_INSPECTOR_USER', {
      uid: myself.uid,
      userJson: JSON.stringify(myself)
    })
    if (shouldAddTaskIntoList(resp.data)) {
      store.commit('ADD_TASK', resp.data)
    }
  })
}

let lastSelectedObj = null
const lastSelected = (obj) => {
  lastSelectedObj = obj ? { ...obj } : null
}

function clearInputMessageAndFocus () {
  inputMessage.value = ''
  nextTick(() => {
    input.value.focus({ preventScroll: false })
  })
}

function onMessageSelectEmployee (message) {
  if (lastSelectedObj) {
    selectEmployee(lastSelectedObj)
    clearInputMessageAndFocus()
  }
}

function onMessageSelectProject (message) {
  if (lastSelectedObj) {
    selectProject(lastSelectedObj)
    clearInputMessageAndFocus()
  }
}

function onMessageSelectTag (message) {
  if (lastSelectedObj) {
    selectTag(lastSelectedObj)
    clearInputMessageAndFocus()
  }
}

function onMessageSelectColor (message) {
  if (lastSelectedObj) {
    selectColor(lastSelectedObj)
    clearInputMessageAndFocus()
  }
}

function onMessageSelectAccess (message) {
  if (lastSelectedObj) {
    selectAccess(lastSelectedObj)
    clearInputMessageAndFocus()
  }
}

function onMessageSelectTime (message) {
  if (lastSelectedObj) {
    selectTime({
      name: lastSelectedObj.name,
      date: lastSelectedObj.value.toISOString()
    })
    clearInputMessageAndFocus()
  }
}

function onMessageAddParams (message) {
  if (lastSelectedObj) {
    actionConfirmNewParams(lastSelectedObj.value)
    clearInputMessageAndFocus()
  }
}

function onMessageConfirm (message) {
  if (lastSelectedObj) {
    actionConfirmDelegate(lastSelectedObj.value)
    clearInputMessageAndFocus()
  }
}

const addCustomerMessage = () => {
  if (!inputMessage.value) {
    if (currentState.value === 'taskComment') {
      delegatedTask.comment = ''
      messages.value.push({
        message:
        'Отлично, теперь выберите исполнителя. Если сотрудника нет в списке - начните вводить его имя, а я его найду.',
        messageFromInspector: true,
        type: 'employeeSelection',
        createDate: new Date().toISOString()
      })
      currentState.value = 'employeeSelection'
      clearInputMessageAndFocus()
      return
    } else {
      return
    }
  }
  if (currentState.value === 'employeeSelection') {
    onMessageSelectEmployee(inputMessage.value)
    return
  }
  if (currentState.value === 'projectSelection') {
    onMessageSelectProject(inputMessage.value)
    return
  }
  if (currentState.value === 'tagSelection') {
    onMessageSelectTag(inputMessage.value)
    return
  }
  if (currentState.value === 'colorSelection') {
    onMessageSelectColor(inputMessage.value)
    return
  }
  if (currentState.value === 'accessSelection') {
    onMessageSelectAccess(inputMessage.value)
    return
  }
  if (currentState.value === 'timeSelection') {
    onMessageSelectTime(inputMessage.value)
    return
  }
  if (currentState.value === 'confirmParams') {
    onMessageAddParams(inputMessage.value)
    return
  }
  if (currentState.value === 'confirmDelegate') {
    onMessageConfirm(inputMessage.value)
    return
  }

  if (currentState.value !== 'taskName' && currentState.value !== 'taskComment') return
  messages.value.push({
    message: inputMessage.value,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })

  if (currentState.value === 'taskName') {
    delegatedTask.name = inputMessage.value
    messages.value.push({
      message:
        'Теперь добавим заметку для задачи. Чтобы пропустить - нажмите Enter',
      messageFromInspector: true,
      type: 'taskComment',
      createDate: new Date().toISOString()
    })
    currentState.value = 'taskComment'
    clearInputMessageAndFocus()
    return
  }

  if (currentState.value === 'taskComment') {
    delegatedTask.comment = inputMessage.value

    messages.value.push({
      message:
        'Отлично, теперь выберите исполнителя. Если сотрудника нет в списке - начните вводить его имя, а я его найду.',
      messageFromInspector: true,
      type: 'employeeSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'employeeSelection'
    clearInputMessageAndFocus()
    return
  }
  clearInputMessageAndFocus()
}

const selectEmployee = (emp) => {
  if (currentState.value !== 'employeeSelection') return
  messages.value.push({
    message: emp.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'employeeSelection') {
    delegatedTask.email_performer = emp.email
    delegatedTask.uid_performer = emp.uid
    messages.value.push({
      message: 'Очень хорошо, когда выполнить?',
      messageFromInspector: true,
      type: 'timeSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'timeSelection'
    clearInputMessageAndFocus()
  }
}

const selectProject = (project) => {
  if (currentState.value !== 'projectSelection') return
  messages.value.push({
    message: project.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'projectSelection') {
    if (project.uid !== 'no_set') delegatedTask.uid_project = project.uid
    messages.value.push({
      message: 'Нет проблем, проставим дополнительные параметры?',
      messageFromInspector: true,
      type: 'confirmParams',
      createDate: new Date().toISOString()
    })
    currentState.value = 'confirmParams'
  }
}

const selectTag = (tag) => {
  if (currentState.value !== 'tagSelection') return
  messages.value.push({
    message: tag.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'tagSelection') {
    if (tag.uid !== 'no_set') delegatedTask.tags = [tag.uid]
    messages.value.push({
      message: 'Какой цвет присвоить задаче?',
      messageFromInspector: true,
      type: 'colorSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'colorSelection'
    clearInputMessageAndFocus()
  }
}

const selectColor = (color) => {
  if (currentState.value !== 'colorSelection') return
  messages.value.push({
    message: color.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'colorSelection') {
    if (color.uid !== 'no_set') delegatedTask.uid_marker = color.uid
    messages.value.push({
      message: 'Кто будет иметь доступ к задаче?',
      messageFromInspector: true,
      type: 'accessSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'accessSelection'
    clearInputMessageAndFocus()
  }
}

const selectAccess = (emp) => {
  if (currentState.value !== 'accessSelection') return
  messages.value.push({
    message: emp.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  if (currentState.value === 'accessSelection') {
    if (emp.uid !== 'no_set') delegatedTask.emails = emp.email
    messages.value.push({
      message: 'На этом все, я поручу задачу?',
      messageFromInspector: true,
      type: 'confirmDelegate',
      createDate: new Date().toISOString()
    })
    currentState.value = 'confirmDelegate'
    clearInputMessageAndFocus()
  }
}

const selectTime = (time) => {
  if (currentState.value !== 'timeSelection') return
  messages.value.push({
    message: time.name,
    messageFromInspector: false,
    createDate: new Date().toISOString()
  })
  delegatedTask.date_begin = getTodaysDate(time.date) + 'T00:00:00'
  delegatedTask.date_end = getTodaysDate(time.date) + 'T23:59:59'
  if (currentState.value === 'timeSelection') {
    delegatedTask.customer_date = time.date
    messages.value.push({
      message: 'В какой проект поместить задачу?',
      messageFromInspector: true,
      type: 'projectSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'projectSelection'
  }
}

const actionConfirmNewParams = (confirmed) => {
  if (currentState.value !== 'confirmParams') return
  if (confirmed) {
    messages.value.push({
      message: 'Да',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    messages.value.push({
      message: 'Супер, что насчет меток?',
      messageFromInspector: true,
      type: 'tagSelection',
      createDate: new Date().toISOString()
    })
    currentState.value = 'tagSelection'
    clearInputMessageAndFocus()
  } else {
    messages.value.push({
      message: 'Нет',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    messages.value.push({
      message: 'Я поручу задачу?',
      messageFromInspector: true,
      type: 'confirmDelegate',
      createDate: new Date().toISOString()
    })
    currentState.value = 'confirmDelegate'
  }
}

const actionConfirmDelegate = (confirmed) => {
  if (currentState.value !== 'confirmDelegate') return
  if (confirmed) {
    messages.value.push({
      message: 'Да',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    createTask()
    messages.value.push({
      message: 'Я поручил вашу задачу, она будет выполнена неизбежно',
      messageFromInspector: true,
      type: 'end',
      createDate: new Date().toISOString()
    })
    currentState.value = 'end'
  } else {
    messages.value.push({
      message: 'Нет',
      messageFromInspector: false,
      createDate: new Date().toISOString()
    })
    messages.value.push({
      message: 'Жаль, обращайтесь когда я потребуюсь',
      messageFromInspector: true,
      type: 'end',
      createDate: new Date().toISOString()
    })
    currentState.value = 'end'
  }
  // закрываемся
  setTimeout(() => {
    cancel()
  }, 3000)
}

function onSelectItem (item) {
  const selector = `.inspector-option-item${item}`
  const option = document.querySelector(selector)
  if (option) option.click({ preventScroll: false })
}
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      has-table
      :title="title"
      class="shadow-xl  md:w-2/5 lg:w-[440px] z-50 px-[25px] py-[30px] rounded-[12px]"
      style="box-shadow: 0px 0px 24px rgba(27, 29, 37, 0.08), 0px 2px 6px rgba(27, 29, 37, 0.06);"
      @header-icon-click="cancel"
    >
      <div class="items-center justify-center">
        <InspectorContent
          :messages="messages"
          :select-employee="selectEmployee"
          :select-project="selectProject"
          :select-tag="selectTag"
          :select-color="selectColor"
          :select-access="selectAccess"
          :select-time="selectTime"
          :action-confirm-new-params="actionConfirmNewParams"
          :action-confirm-delegate="actionConfirmDelegate"
          :last-selected="lastSelected"
          class="max-h-[40vh] h-[40vh] overflow-auto scroll-style pr-1"
        />
        <slot />
      </div>

      <div class="flex items-stretch">
        <input
          ref="input"
          v-model="inputMessage"
          :disabled="currentState === 'end'"
          type="text"
          class="bg-[#F2F4F7] w-full px-[15px] py-[16px] rounded-[10px] font-[400] text-[15px] leading-[18px] focus:ring-0"
          style="color: rgba(0, 0, 0, 0.5); border: none"
          placeholder="Написать сообщение..."
          @keyup.enter="addCustomerMessage"
          @keyup.esc="cancel"
          @keydown.meta.1.prevent="onSelectItem(1)"
          @keydown.ctrl.1.prevent="onSelectItem(1)"
          @keydown.meta.2.prevent="onSelectItem(2)"
          @keydown.ctrl.2.prevent="onSelectItem(2)"
          @keydown.meta.3.prevent="onSelectItem(3)"
          @keydown.ctrl.3.prevent="onSelectItem(3)"
          @keydown.meta.4.prevent="onSelectItem(4)"
          @keydown.ctrl.4.prevent="onSelectItem(4)"
        >
      </div>
    </card-component>
  </overlay>
</template>
