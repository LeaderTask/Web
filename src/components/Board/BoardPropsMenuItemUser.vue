<template>
  <PopMenuItem
    style="padding-left: 8px;"
  >
    <div class="flex items-center">
      <img
        v-if="photo"
        :src="photo"
        class="flex-none rounded-[7px] mr-[6px]"
        width="24"
        height="24"
      >
      <div class="ml-[2px] truncate">
        {{ name }}
      </div>
      <div
        v-if="showCheckMark"
        class="ml-[10px]"
      >
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.3332 1L4.99984 8.33333L1.6665 5"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </PopMenuItem>
</template>

<script>
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

export default {
  components: {
    PopMenuItem
  },
  props: {
    userEmail: {
      type: String,
      default: ''
    },
    showCheckMark: {
      type: Boolean,
      default: false
    }
  },
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
  }
}
</script>

<style scoped>
</style>
