<script setup>
import contenteditable from 'vue-contenteditable'
import * as TASK from '@/store/actions/tasks.js'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import { computed, reactive, ref, watch, nextTick, onMounted } from 'vue'
import close from '@/icons/close.js'

const props = defineProps({
  taskUid: {
    type: String,
    default: ''
  },
  task: {
    type: Object,
    default: () => {}
  },
  isCustomer: {
    type: Boolean,
    default: false
  },
  isPerformer: {
    type: Boolean,
    default: false
  },
  checklist: {
    type: String,
    default: ''
  }
})

const store = useStore()

const processedChecklist = ref('')

const computedChecklist = computed(() => {
  const _renderedChecklist = []

  if (!props.checklist) {
    _renderedChecklist.push({ checked: false, text: '' })
    return _renderedChecklist
  }

  // нормализуем перенос строки (разные на windows и на mac)
  const chlist = props.checklist.replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '\r\n')
  for (const check of chlist.split('\r\n\r\n')) {
    _renderedChecklist.push({ checked: !!+check.split('\r\n')[0], text: check.split('\r\n')[1] })
  }
  return _renderedChecklist
})

const renderedChecklist = reactive({ checklist: computedChecklist.value })
const shouldUpdate = ref(false)
watch(() => props.taskUid, (oldValue, newValue) => {
  if (oldValue !== newValue) shouldUpdate.value = true
})

watch(() => computedChecklist.value, (oldValue, newValue) => {
  if (shouldUpdate.value) {
    renderedChecklist.checklist = oldValue
    shouldUpdate.value = false
  }
})

const processChecklist = () => {
  processedChecklist.value = ''
  for (const [i, check] of renderedChecklist.checklist.entries()) {
    if (!check.text) continue
    processedChecklist.value += (check.checked ? '1' : '0') + '\r\n' + check.text
    if (i !== renderedChecklist.checklist.length - 1) {
      processedChecklist.value += '\r\n\r\n'
    }
  }
  if (!Object.keys(store.state.tasks.newtasks).includes(props.taskUid)) {
    store.commit(TASK.ADD_TO_NEWTASKS, props.task)
  }
  store.state.tasks.newtasks[props.taskUid].info.cheklist = processedChecklist.value
  store.dispatch('CHANGE_TASK_CHECKLIST', { uid_task: props.taskUid, checklist: processedChecklist.value })
}

const addEmptyChecklist = (index = -1) => {
  if (!index && index !== 0) {
    renderedChecklist.checklist.push({ checked: false, text: '' })
    nextTick(() => {
      document.getElementById('check_' + (renderedChecklist.checklist.length - 1)).focus()
    })
  } else {
    renderedChecklist.checklist.splice(index + 1, 0, { checked: false, text: '' })
    nextTick(() => {
      document.getElementById('check_' + (index + 1)).focus()
    })
  }
}

const removeChecklistItem = (index) => {
  renderedChecklist.checklist.splice(index, 1)
  processChecklist()
}

const saveChecklist = (index) => {
  if (renderedChecklist.checklist.length === 1) {
    return false
  }
  if (!renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')) {
    renderedChecklist.checklist.splice(index, 1)
    return
  }
  renderedChecklist.checklist[index].text = renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')
  processChecklist()
}

const updateChecklist = (index) => {
  if (!renderedChecklist.checklist[renderedChecklist.checklist.length - 1].text) {
    return false
  }
  if (!renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')) {
    if (renderedChecklist.checklist.length === 1) {
      return false
    }
    renderedChecklist.checklist.splice(index, 1)
  } else {
    renderedChecklist.checklist[index].text = renderedChecklist.checklist[index].text.replace(/\r?\n|\r/g, '')
    processChecklist()
    addEmptyChecklist(index)
  }
}

for (let i = 0; i < renderedChecklist.checklist; i++) {
  if (!renderedChecklist.checklist[i].text.length) {
    renderedChecklist.checklist.splice(i, 1)
  }
}

onMounted(() => {
  document.getElementById('check_0').focus()
})

</script>

<template>
  <div v-show="renderedChecklist.checklist[0].text.length">
    <div
      v-for="check, index of renderedChecklist.checklist"
      :key="index"
    >
      <div
        class="flex items-start group"
      >
        <div style="min-width: 10px;">
          <input
            v-model="check.checked"
            type="checkbox"
            class="m-1 w-[20px] h-[20px] rounded-[4px] mr-2 border-gray-300 bg-gray-100"
            :disabled="isCustomer || isPerformer ? false : true"
            @change="saveChecklist(index)"
          >
          <label />
        </div>
        <contenteditable
          :id="'check_' + index"
          v-model="check.text"
          tag="div"
          style="max-width: 80%;"
          placeholder="добавить чек-лист..."
          :class="{ 'ml-1 text-gray-500 line-through': check.checked }"
          :contenteditable="isCustomer"
          :no-n-l="true"
          :no-h-t-m-l="true"
          @keyup.enter="updateChecklist(index)"
          @blur="saveChecklist(index)"
        />
        <Icon
          v-show="isCustomer"
          :path="close.path"
          class="invisible group-hover:visible px-2 py-1.5 text-gray-400 dark:text-white float-right mt-0.5 cursor-pointer"
          :box="close.viewBox"
          :width="8"
          :height="8"
          @click="removeChecklistItem(index)"
        />
      </div>
    </div>
    <button
      v-show="isCustomer"
      class="mt-2.5 text-sm p-1 px-2 rounded-lg text-gray-500 flex font-medium"
      @click="addEmptyChecklist(false)"
    >
      <svg
        class="mr-1.5"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8352 9.17286L10.8411 4.11116C10.8411 3.88924 10.7529 3.67641 10.596 3.51949C10.4391 3.36257 10.2262 3.27441 10.0043 3.27441C9.78241 3.27441 9.56958 3.36257 9.41266 3.51949C9.25574 3.67641 9.16758 3.88924 9.16758 4.11116L9.17347 9.17286L4.11177 9.16697C3.88985 9.16697 3.67702 9.25513 3.5201 9.41205C3.36318 9.56897 3.27502 9.7818 3.27502 10.0037C3.27502 10.2256 3.36318 10.4385 3.5201 10.5954C3.67702 10.7523 3.88985 10.8405 4.11177 10.8405L9.17347 10.8346L9.16758 15.8963C9.16713 16.0063 9.18847 16.1153 9.23036 16.217C9.27225 16.3187 9.33386 16.4112 9.41165 16.4889C9.48944 16.5667 9.58186 16.6284 9.68358 16.6702C9.78531 16.7121 9.89432 16.7335 10.0043 16.733C10.1143 16.7335 10.2233 16.7121 10.3251 16.6702C10.4268 16.6284 10.5192 16.5667 10.597 16.4889C10.6748 16.4112 10.7364 16.3187 10.7783 16.217C10.8202 16.1153 10.8415 16.0063 10.8411 15.8963L10.8352 10.8346L15.8969 10.8405C16.0069 10.8409 16.1159 10.8196 16.2176 10.7777C16.3193 10.7358 16.4118 10.6742 16.4896 10.5964C16.5673 10.5186 16.629 10.4262 16.6709 10.3245C16.7127 10.2227 16.7341 10.1137 16.7336 10.0037C16.7341 9.8937 16.7127 9.78469 16.6709 9.68297C16.629 9.58125 16.5673 9.48883 16.4896 9.41104C16.4118 9.33325 16.3193 9.27164 16.2176 9.22974C16.1159 9.18785 16.0069 9.16652 15.8969 9.16697L10.8352 9.17286Z"
          fill="#7E7E80"
        />
      </svg>

      Добавить
    </button>
  </div>
</template>

<style>
[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: gray
}
</style>
