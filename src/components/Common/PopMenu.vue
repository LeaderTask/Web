<template>
  <Popper
    arrow
    class="pop-menu-light"
    :disabled="disabled"
    :placement="placement"
    @open:popper="openMenu"
    @close:popper="closeMenu"
  >
    <slot />
    <template #content="{ close }">
      <div
        class="flex flex-col"
        @click="close"
      >
        <slot name="menu" />
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['openMenu', 'closeMenu'],
  methods: {
    print (val) {
      console.log(val)
    },
    openMenu () {
      this.$emit('openMenu')
    },
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}
</script>

<style scoped>
.pop-menu-light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #4c4c4d;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgba(0, 0, 0, 0.12);
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 12px 8px;
  --popper-theme-box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
}
</style>
