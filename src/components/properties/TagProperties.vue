<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import ColorPicker from '@/components/properties/ColorPicker.vue'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import {
  CREATE_TAG_REQUEST,
  UPDATE_TAG_REQUEST,
  REMOVE_TAG_REQUEST
} from '@/store/actions/tasks'
import { NAVIGATOR_PUSH_TAG, NAVIGATOR_REMOVE_TAG } from '@/store/actions/navigator'

const store = useStore()
const selectedTag = computed(() => store.state.tasks.selectedTag)
const showConfirm = ref(false)
const hasChanged = ref(false)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

watch(selectedTag, () => {
  hasChanged.value = false
})

onMounted(() => {
  hasChanged.value = false
})

const createOrUpdateTag = (tag) => {
  if (!tag.uid) {
    tag.uid = uuidv4()
    // TODO: should not be hardcoded
    tag.global_property_uid = '00a5b3de-9474-404d-b3ba-83f488ac6d30'
    store.dispatch(CREATE_TAG_REQUEST, tag)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
        // store.commit(PUSH_PROJECT, [tag])
        store.commit(NAVIGATOR_PUSH_TAG, [tag])
      })
  } else {
    store.dispatch(UPDATE_TAG_REQUEST, tag)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const removeTag = (tag) => {
  store.dispatch(REMOVE_TAG_REQUEST, tag.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_TAG, tag)
    })
}

</script>

<template>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeTag(selectedTag)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedTag.name }}</strong>" tag?
    </p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства метки
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedTag.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        @input="hasChanged = true"
      >
      <div
        class="mt-8"
      >
        <ColorPicker
          v-model="selectedTag.back_color"
          :update="() => hasChanged = true "
          :label="'Цвет метки'"
        />
      </div>
      <button
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        :class="{ 'bg-orange-400 hover:bg-orange-500': hasChanged }"
        @click="createOrUpdateTag(selectedTag)"
      >
        {{ selectedTag.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedTag.uid"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
