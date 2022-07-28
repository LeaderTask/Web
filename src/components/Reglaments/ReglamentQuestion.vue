<script>
import ReglamentAnswer from './ReglamentAnswer.vue'
import * as ANSWER from '@/store/actions/reglament_answers.js'
import ReglamentQuestionPopMenu from './ReglamentQuestionPopMenu.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    ReglamentAnswer,
    ReglamentQuestionPopMenu,
    BoardModalBoxDelete
  },
  props: {
    question: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['deleteQuestion', 'deleteAnswer', 'setRightAnswer', 'addQuestion', 'pushAnswer', 'selectAnswer', 'updateAnswerName', 'updateQuestionName'],
  expose: ['onFocus'],
  data () {
    return {
      showDeleteQuestion: false,
      showDeleteAnswer: false,
      rightAnswer: false
    }
  },
  computed: {
    canEdit () {
      const userType = this.$store.state.employees.employees[this.$store.state.user.user.current_user_uid].type
      return (this.$store.state.greedSource?.email_creator === this.$store.state.user.user.current_user_email) || (this.editorsCanEdit) || (userType === 2 || userType === 1)
    },
    editorsCanEdit () {
      return this.reglament.editors.includes(this.$store.state.user.user.current_user_email)
    }
  },
  methods: {
    gotoNode (uid) {
      this.$refs[uid][0].onFocus()
    },
    rightAnswersAmount (question) {
      let count = 0
      for (let i = 0; i < question.answers.length; i++) {
        if (question.answers[i].is_right) {
          count++
        }
      }
      return count
    },
    onAddAnswer () {
      const data = {
        name: '',
        uid: this.uuidv4(),
        uid_question: this.question.uid,
        is_right: false
      }
      this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, data)
      this.$emit('pushAnswer', data)
      this.$nextTick(() => {
        this.gotoNode(data.uid)
      })
    },
    setRightAnswer (answer) {
      console.log(answer[0])
      const data = {
        uid: answer[0].uid,
        uid_question: this.question.uid,
        name: answer[0].name,
        is_right: answer[1]
      }
      this.$store.dispatch(ANSWER.UPDATE_REGLAMENT_ANSWER_REQUEST, data)
      this.$emit('setRightAnswer', data)
    },
    onSelectAnswer (uid) {
      for (let i = 0; i < this.question.answers.length; i++) {
        if (this.question.answers[i].uid === uid) {
          if (this.question.answers[i].selected) {
            this.$emit('selectAnswer', [this.question.answers[i], false])
            return
          }
          console.log(this.question)
          this.$emit('selectAnswer', [this.question.answers[i], true])
          return
        }
      }
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    onDeleteAnswer (uid) {
      this.$emit('deleteAnswer', uid)
      this.$store.dispatch(ANSWER.DELETE_REGLAMENT_ANSWER_REQUEST, uid)
    },
    updateAnswerName (resp) {
      console.log(resp)
      const data = {
        uid: resp[1].uid,
        uid_question: this.question.uid,
        name: resp[0],
        is_right: resp[1].is_right
      }
      this.$emit('updateAnswerName', data)
      this.$store.dispatch(ANSWER.UPDATE_REGLAMENT_ANSWER_REQUEST, data)
    },
    deleteQuestion () {
      this.showDeleteQuestion = false
      this.$emit('deleteQuestion', this.question.uid)
    },
    changeQuestionName (event) {
      const data = {
        uid: this.question.uid,
        name: event.target.innerText
      }
      this.$emit('updateQuestionName', data)
      this.$store.dispatch('UPDATE_REGLAMENT_QUESTION_REQUEST', data)
    },
    onFocus () {
      this.$refs[this.question.uid + 'input'].focus()
      const range = document.createRange()
      const sel = document.getSelection()
      range.setStart(this.$refs[this.question.uid + 'input'], 0)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}
</script>

<template>
  <BoardModalBoxDelete
    v-if="showDeleteQuestion"
    title="Удалить вопрос"
    text="Вы действительно хотите удалить вопрос?"
    @cancel="showDeleteQuestion = false"
    @yes="deleteQuestion"
  />
  <div
    v-if="isEditing ? true: rightAnswersAmount(question)"
    class="bg-white p-3 rounded-[10px] mb-2"
  >
    <div class="px-1 flex justify-between items-center group">
      <div
        :ref="question.uid + 'input'"
        placeholder="Текст вопроса"
        class="font-[500] text-[18px] my-3 min-w-[10px] min-h-[10px]"
        :contenteditable="isEditing && canEdit"
        @blur="changeQuestionName($event)"
        @keydown.enter.exact.prevent="$emit('addQuestion')"
        v-html="question.name"
      />
      <span
        v-if="rightAnswersAmount(question) === 1"
        class="flex whitespace-nowrap font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] breadcrumbs font-medium"
      >
        В данном вопросе один правильный ответ.
      </span>
      <span
        v-if="rightAnswersAmount(question) > 1"
        class="flex whitespace-nowrap font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] breadcrumbs font-medium"
      >
        В данном вопросе более одного правильного ответа.
      </span>
      <ReglamentQuestionPopMenu
        v-if="isEditing && canEdit"
        :question="question"
        @deleteQuestion="showDeleteQuestion = true"
      />
    </div>
    <template
      v-for="(answer) in question.answers"
      :key="answer.uid"
    >
      <ReglamentAnswer
        :ref="answer.uid"
        class="mb-1"
        :is-editing="isEditing"
        :answer="answer"
        @set-right-answer="setRightAnswer"
        @onSelectAnswer="onSelectAnswer"
        @addAnswer="onAddAnswer"
        @deleteAnswer="onDeleteAnswer"
        @update-answer-name="updateAnswerName"
      />
    </template>
    <button
      v-if="canEdit && isEditing"
      class="ml-[5px] mt-2 font-[300] text-[14px] bg-[#F4F5F7] p-1 px-3 rounded-[5px] hover:cursor-pointer transition hover:opacity-[0.6]"
      @click.stop="onAddAnswer"
    >
      Добавить ответ
    </button>
  </div>
</template>

<style scoped>
[placeholder]:empty::before {
    content: attr(placeholder);
    color: #555;
}
</style>
