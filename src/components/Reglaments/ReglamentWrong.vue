<template>
  <div
    v-if="showQuestion"
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
  computed: {
    test () {
      return 1
    },
    showQuestion () {
      // правильные ответы
      const creatorAnswers = []
      // ответы пользователя
      const userAnswers = []
      let shouldShow = creatorAnswers.length
      for (let i = 0; i < this.question.answers.length; i++) {
        if (this.question.answers[i].is_right) {
          creatorAnswers.push(this.question.answers[i])
        }
        if (this.question.answers[i].selected) {
          userAnswers.push(this.question.answers[i])
        }
      }
      // проверяем совпадают ли элементы в массивах
      for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i]?.uid === creatorAnswers[i]?.uid) {
          shouldShow = false
        } else {
          shouldShow = true
          return shouldShow
        }
      }
      return shouldShow
    }
  }
}
</script>
<style scoped>
</style>
