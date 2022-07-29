<template>
  <div
    class="flex items-center flex-col justify-center overflow-hidden fixed inset-0"
    :class="zIndex"
  >
    <transition
      enter-active-class="transition duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="absolute inset-0 backdrop-blur-sm bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-100 opacity-90"
        @click="overlayClick"
      />
    </transition>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="animate-fadeOut"
    >
      <slot />
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    zIndex: {
      type: String,
      default: 'z-50'
    }
  },
  emits: ['overlay-click'],
  methods: {
    overlayClick (event) {
      this.$emit('overlay-click', event)
    }
  }
}
</script>
