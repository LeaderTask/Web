<template>
  <div class="relative">
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass"
    >
      <option
        v-for="option in options"
        :key="option.id ?? option"
        :value="option"
      >
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :placeholder="placeholder"
      :required="required"
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
      :disabled="disabled"
      @blur="blur"
    >
    <control-icon
      v-if="icon"
      :icon="icon"
      :class="iconClass"
      :h="controlIconH"
    />
  </div>
</template>

<script>
import ControlIcon from '@/components/ControlIcon.vue'

export default {
  components: {
    ControlIcon
  },
  props: {
    name: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'task'
    },
    autocomplete: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    iconClass: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object],
      default: ''
    },
    required: Boolean,
    disabled: Boolean,
    borderless: Boolean,
    transparent: Boolean,
    valid: Boolean
  },

  emits: ['update:modelValue', 'right-icon-click', 'blur'],
  data () {
    return {
      inputEl: null
    }
  },
  computed: {
    computedValue: {
      get () { return this.modelValue },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    inputElClass () {
      const base = [
        'px-3 py-2 max-w-full text-sm border-gray-300 border-0 border-l-0 disabled:border-stone-500 disabled:bg-amber-50 disabled:ring-0 focus:ring-0 rounded-lg w-full',
        // 'focus:border-stone-500 focus:bg-amber-50',
        'focus:border-gray-300',
        'dark:placeholder-gray-500',
        this.computedType.value === 'textarea' ? 'h-24' : 'h-10 placeholder-gray-500',
        this.borderless ? 'border-0' : 'border-2',
        this.transparent ? '' : 'bg-[#FAFAFB] dark:bg-gray-800',
        this.valid ? 'border-stone-500 bg-amber-50' : ''
      ]
      if (this.icon) {
        base.push('pl-10')
      }
      return base
    },
    computedType () { return this.options ? 'select' : this.type },
    controlIconH () { return this.type === 'textarea' ? 'h-full' : 'h-12' }
  },
  methods: {
    blur (e) {
      this.$emit('blur', e)
    }
  }
}
</script>

<style scoped>
.white-cursor {
  cursor: url(@/icons/white-text.cur), auto;
}
</style>
