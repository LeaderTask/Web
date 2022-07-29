<template>
  <div
    class="flex flex-col gap-[4px] px-[10px] text-[#7e7e80] text-[13px] leading-[15px] font-roboto"
  >
    <div
      v-if="title"
      class="text-[#4c4c4d] text-[14px] leading-[16px] font-medium"
    >
      {{ title }}
    </div>
    <slot />
    <div class="my-[4px] flex h-px bg-[#dddddd]" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
