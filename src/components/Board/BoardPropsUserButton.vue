<template>
  <div class="group w-full h-[34px] flex items-center">
    <img
      v-if="photo"
      :src="photo"
      class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
    >
    <div class="grow font-roboto text-[13px] leading-[20px] font-medium text-[#4c4c4d] mr-[7px]">
      {{ name }}
    </div>
    <div class="flex-none">
      <PopMenu :disabled="disabled">
        <div
          class="flex items-center text-[#7e7e80]"
          :class="{ 'cursor-pointer hover:text-[#4c4c4d]': !disabled }"
        >
          <div class="mr-[4px] font-roboto text-[12px] leading-[20px]">
            {{ status }}
          </div>
          <svg
            class="invisible"
            :class="{ 'group-hover:visible': !disabled }"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <template #menu>
          <PopMenuItem @click="clickAdmin">
            Администратор
          </PopMenuItem>
          <PopMenuItem @click="clickWriter">
            Редактор
          </PopMenuItem>
          <PopMenuItem @click="clickReader">
            Читатель
          </PopMenuItem>
          <PopMenuDivider />
          <PopMenuItem @click="clickDelete">
            Удалить
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem,
    PopMenuDivider
  },
  props: {
    userEmail: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete', 'admin', 'reader', 'writer'],
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    photo () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.fotolink || ''
    },
    name () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.name || this.userEmail
    }
  },
  methods: {
    clickDelete () {
      this.$emit('delete')
    },
    clickAdmin () {
      this.$emit('admin')
    },
    clickReader () {
      this.$emit('reader')
    },
    clickWriter () {
      this.$emit('writer')
    }
  }
}
</script>

<style scoped>
</style>
