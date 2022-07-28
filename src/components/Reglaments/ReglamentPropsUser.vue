<template>
  <div class="group w-full h-[34px] flex items-center border-[2px] px-2 mb-1 rounded">
    <img
      v-if="userPhoto"
      :src="userPhoto"
      class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
    >
    <span class="grow font-roboto text-[13px] leading-[20px] font-medium text-[#4c4c4d] mr-[7px]">
      {{ userName }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    userUid: {
      type: String,
      default: () => ('')
    }
  },
  computed: {
    user () {
      return this.$store.state.employees.employees[this.userUid]
    },
    userPhoto () {
      return this.user?.fotolink ?? ''
    },
    userName () {
      return this.user?.name || this.user?.email || '???'
    }
  }
}
</script>
