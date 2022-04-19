<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import Toggle from '@vueform/toggle'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import characters from '@/icons/characters.js'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import { NAVIGATOR_PUSH_COLOR, NAVIGATOR_REMOVE_COLOR } from '@/store/actions/navigator'
import { CREATE_COLOR_REQUEST, UPDATE_COLOR_REQUEST, REMOVE_COLOR_REQUEST } from '@/store/actions/colors'

const store = useStore()
const selectedColor = computed(() => store.state.colors.selectedColor)
const showConfirm = ref(false)
const hasChanged = ref(false)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

onMounted(() => {
  hasChanged.value = false
})

watch(selectedColor, () => {
  hasChanged.value = false
  selectedColor.value.uppercase = !!selectedColor.value.uppercase
})

const createOrUpdateColor = (color) => {
  if (!color.uid) {
    color.uid = uuidv4()

    // colors action uid
    // shoudn't be hard coded TODO: create consts with all actions in uids
    color.parentID = 'ed8039ae-f3de-4369-8f32-829d401056e9'
    color.uppercase = color.uppercase ? 1 : 0
    store.dispatch(CREATE_COLOR_REQUEST, color)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
        store.commit(NAVIGATOR_PUSH_COLOR, [color])
        color.uppercase = !!color.uppercase
      })
  } else {
    color.uppercase = color.uppercase ? 1 : 0
    store.dispatch(UPDATE_COLOR_REQUEST, color)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
        color.uppercase = !!color.uppercase
      })
  }
}

const removeColor = (color) => {
  store.dispatch(REMOVE_COLOR_REQUEST, color.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_COLOR, color)
    })
}

</script>

<template>
  hasChanged:{{ hasChanged }}
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeColor(selectedColor)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedColor.name }}</strong>" color?
    </p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства цвета
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedColor.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        :class="{ 'uppercase': selectedColor.uppercase }"
        @input="hasChanged = true"
      >
      <div
        class="mt-8"
      >
        <ColorPicker
          v-model="selectedColor.fore_color"
          :update="() => hasChanged = true "
          :label="'Цвет букв'"
          :icon="characters"
        />
      </div>
      <div
        class="mt-8"
      >
        <ColorPicker
          v-model="selectedColor.back_color"
          :update="() => hasChanged = true "
          :label="'Цвет фона'"
        />
      </div>
      <hr class="my-6">
      <div
        class="flex items-center mb-6"
      >
        <p class="text-sm mr-3">
          Все прописные
        </p>
        <Toggle
          v-model="selectedColor.uppercase"
          class="outline-none ring-0"
          :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
          @change="hasChanged = true"
        />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Предосмотр задачи
      </p>
      <div
        class="p-3 rounded-xl mt-3"
        :style="{ 'background-color': selectedColor.back_color }"
      >
        <p
          :class="{ 'uppercase': selectedColor.uppercase }"
          :style="{ 'color': selectedColor.fore_color }"
        >
          Название задачи
        </p>
      </div>
      <button
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        :class="{ 'bg-orange-400 hover:bg-orange-500': hasChanged }"
        @click="createOrUpdateColor(selectedColor)"
      >
        {{ selectedColor.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedColor.uid"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
<style src="@vueform/toggle/themes/default.css"></style>
