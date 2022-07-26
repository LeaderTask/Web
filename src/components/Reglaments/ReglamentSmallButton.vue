<template>
  <div
    class="h-[30px] flex items-center gap-[10px] px-[10px] cursor-pointer bg-white hover:bg-[#f4f5f7] rounded-[6px] text-[#4c4c4d] text-[13px] leading-[15px] font-roboto"
  >
    <svg
      v-if="icon === 'edit'"
      class="flex-none m-[2px]"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66658 13.5002L9.33325 10.8335H14.6666V13.5002H6.66658ZM2.66659 12.1668H3.59992L10.2999 5.4835L9.83325 5.00016L9.34992 4.5335L2.66659 11.2335V12.1668ZM1.33325 13.5002V10.6668L10.2999 1.71683C10.5555 1.46127 10.8695 1.3335 11.2419 1.3335C11.6139 1.3335 11.9277 1.46127 12.1833 1.71683L13.1166 2.66683C13.3721 2.92238 13.4999 3.2335 13.4999 3.60016C13.4999 3.96683 13.3721 4.27794 13.1166 4.5335L4.16659 13.5002H1.33325ZM12.1666 3.60016L11.2333 2.66683L12.1666 3.60016ZM10.2999 5.4835L9.83325 5.00016L9.34992 4.5335L10.2999 5.4835Z"
        fill="#7E7E80"
      />
    </svg>
    <svg
      v-if="icon === 'check'"
      class="flex-none m-[2px]"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3334 4L6.00008 11.3333L2.66675 8"
        stroke="#757575"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-if="icon === 'uncheck'"
      class="flex-none"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="20"
        height="20"
        fill="none"
      />
    </svg>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
