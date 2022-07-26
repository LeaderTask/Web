<script>
export default {
  props: {
    isPassed: {
      type: Number
    }
  },
  emits: ['confirm'],
  data () {
  }
}
</script>

<template>
  <div class="py-3 rounded-[10px] flex flex-col items-center space-y-4">
    <p
      v-if="isPassed"
      class="font-[500] text-[22px]"
    >
      Поздравляем, вы прошли регламент!
    </p>
    <p
      v-else
      class="font-[500] text-[20px]"
    >
      Пожалуйста, еще раз внимательно ознакомьтесь с регламентом и пройдите текст повторно
    </p>
    <div class="w-full flex justify-center">
      <button
        class="flex bg-[#FF912380] p-3 px-10 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
        @click="$emit('confirm', isPassed)"
      >
        Завершить
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
