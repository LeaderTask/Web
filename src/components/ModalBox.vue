<script>
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Divider from '@/components/Divider.vue'
import Overlay from '@/components/modals/Overlay.vue'

export default {
  components: {
    JbButton,
    JbButtons,
    CardComponent,
    Divider,
    Overlay
  },
  props: {
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
  },

  emits: ['update:modelValue', 'cancel', 'confirm', 'currentSettingsTab'],

  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) { this.$emit('update:modelValue', value) }
    }
  },
  methods: {
    accSelect (value) {
      this.$emit(value)
    },
    tarifSelect (value) {
      this.$emit(value)
    },
    confirmCancel (mode) {
      this.value = false
      this.$emit(mode)
    },
    changeCurrentTab (tabName) {
      this.$emit('currentSettingsTab', tabName)
    },
    confirm () {
      return this.confirmCancel('confirm')
    },
    cancel () {
      return this.confirmCancel('cancel')
    }
  }
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
      acc-mod
      :title="title"
      class="shadow-lg w-full md:w-4/5 lg:w-3/5 z-50  h-[85%]"
      @header-icon-click="cancel"
      @tab="changeCurrentTab"
    >
      <div class="space-y-3 items-center">
        <h1
          v-if="largeTitle"
          class="text-2xl"
        />
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
