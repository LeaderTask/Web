<template>
  <ModalBox
    title="Обновите тариф"
    @cancel="onCancel"
  >
    <div class="flex flex-col">
      <div class="text-[#7e7e80] text-[13px] leading-[18px] font-roboto whitespace-pre-line">
        Чтобы пройти редактировать регламент необходимо обновить тариф до уровня "Альфа".
      </div>
      <div class="gap-[4px] flex justify-end mt-4">
        <a
          href="https://www.leadertask.ru/alpha"
          target="_blank"
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
        >
          Купить
        </a>
      </div>
    </div>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  emits: ['cancel'],
  methods: {
    onCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
