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
