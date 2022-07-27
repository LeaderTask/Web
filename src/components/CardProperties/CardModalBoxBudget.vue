<template>
  <ModalBox
    :title="title"
    ok="Сохранить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <input
      ref="inputValue"
      v-model="currentValue"
      type="number"
      class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      @keyup.enter="onSave"
      @keyup.esc="onCancel"
    >
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'save'],
  data: () => ({
    currentValue: ''
  }),
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.value !== 0 ? this.currentValue = this.value : this.currentValue = ''
          this.$nextTick(function () {
            this.$refs.inputValue.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    onCancel () {
      if (this.show) this.$emit('cancel')
    },
    onSave () {
      if (this.show) this.$emit('save', this.currentValue)
    }
  }
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
