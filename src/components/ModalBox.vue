<script setup>
import { computed } from 'vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Divider from '@/components/Divider.vue'
import Overlay from '@/components/Overlay.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  largeTitle: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'info'
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

const emit = defineEmits(['update:modelValue', 'cancel', 'acc', 'tarif', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
const accSelect = value => { emit(value) }
const tarifSelect = value => { emit(value) }
const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
const confirm = () => confirmCancel('confirm')
const cancel = () => confirmCancel('cancel')
const acc = () => accSelect('acc')
const tarif = () => tarifSelect('tarif')
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      hasTable
      :title="title"
      class="shadow-lg w-full md:w-3/5 lg:w-3/5 z-50  h-4/5"
      @header-icon-click="cancel"
      @acc="acc"
      @tarif="tarif"
    >
      <div class="space-y-3 items-center">
        <h1
          v-if="largeTitle"
          class="text-2xl"
        >
        </h1>
        {{ largeTitle }}
        <slot />
      </div>
      <divider
        v-if="hasButton"
      />
      <jb-buttons>
        <jb-button
          v-if="hasButton"
          :label="buttonLabel"
          :color="button"
          @click="confirm"
        />
        <jb-button
          v-if="hasCancel"
          label="Cancel"
          :color="button"
          outline
          @click="cancel"
        />
      </jb-buttons>
    </card-component>
  </overlay>
</template>
