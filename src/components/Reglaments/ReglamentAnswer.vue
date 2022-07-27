<script>
import ReglamentAnswerPopMenu from './ReglamentAnswerPopMenu.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    ReglamentAnswerPopMenu,
    BoardModalBoxDelete
  },
  props: {
    answer: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['addAnswer', 'deleteAnswer', 'setRightAnswer', 'onSelectAnswer', 'resetRightAnswer', 'updateAnswerName'],
  expose: ['onFocus'],
  data () {
    return {
      name: '',
      showDeleteAnswer: false,
      rightAnswer: false
    }
  },
  computed: {
    selected () {
      return this.answer.selected
    }
  },
  methods: {
    deleteAnswer () {
      this.showDeleteAnswer = false
      this.$emit('deleteAnswer', this.answer.uid)
    },
    onSelectAnswer () {
      if (this.isEditing) return
      this.$emit('onSelectAnswer', this.answer.uid)
    },
    setRightAnswer (val) {
      this.rightAnswer = val
      this.$emit('setRightAnswer', [this.answer, val])
    },
    resetRightAnswer () {
      this.rightAnswer = false
    },
    updateAnswerName (event) {
      this.$emit('updateAnswerName', [event.target.innerText, this.answer])
    },
    onFocus () {
      this.$refs[this.answer.uid + 'input'].focus()
      const range = document.createRange()
      const sel = document.getSelection()
      range.setStart(this.$refs[this.answer.uid + 'input'], 0)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}
</script>

<template>
  <BoardModalBoxDelete
    v-if="showDeleteAnswer"
    title="Удалить ответ"
    text="Вы действительно хотите удалить ответ?"
    @cancel="showDeleteAnswer = false"
    @yes="deleteAnswer"
  />
  <div
    class="border-[1px] border-[#eaeaea] p-2 px-2 flex justify-between items-start group rounded-[8px] mb-[5px]"
    :class="{ 'border-[#d7f7e2] bg-[#e8faee]': ((rightAnswer || answer.is_right) && isEditing), 'bg-slate-200': selected, 'cursor-pointer': !isEditing }"
    @click="onSelectAnswer"
  >
    <div
      :ref="answer.uid + 'input'"
      placeholder="Текст ответа"
      class="font-[300] text-[14px] min-w-[10px] min-h-[10px]"
      :class="{'cursor-editing': isEditing}"
      :contenteditable="isEditing"
      @blur="false"
      @keyup="false"
      @keydown.enter.exact.prevent="$emit('addAnswer')"
      @focusout="updateAnswerName"
      v-text="answer.name"
    />
    <ReglamentAnswerPopMenu
      v-if="isEditing"
      :is-editing="isEditing"
      @deleteAnswer="deleteAnswer"
      @setRightAnswer="setRightAnswer(true)"
      @resetRightAnswer="setRightAnswer(false)"
    />
  </div>
</template>

<style scoped>
[placeholder]:empty::before {
    content: attr(placeholder);
    color: #555;
}
</style>
