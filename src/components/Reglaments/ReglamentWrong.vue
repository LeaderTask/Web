<template>
  <div
    v-if="showQuestion()"
    class="bg-white p-3 rounded-[10px] mb-2"
  >
    <div class="px-1 flex justify-between items-center group">
      <div class="font-[400] text-[18px] my-3 min-w-[10px] min-h-[10px]">
        {{ question.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    question: {
      type: String,
      default: ''
    }
  },
  methods: {
    showQuestion () {
      let selected = 0
      let right = 0
      for (let i = 0; i < this.question.answers.length; i++) {
        if (this.question.answers[i].is_right) {
          right++
        }
        if (this.question.answers[i].selected) {
          selected++
        }
      }
      return right !== selected
    }
  }
}
</script>
<style scoped>
</style>
