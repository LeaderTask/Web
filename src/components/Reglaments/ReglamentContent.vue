<template>
  <div
    v-if="canEdit && !showCompleteMessage"
    class="flex justify-end mb-2"
  >
    <PopMenuItem
      v-if="!isTesting"
      class="bg-white mr-1"
      icon="edit"
      @click="isEdit"
    >
      {{ editButtonText }}
    </PopMenuItem>
  </div>
  <ReglamentInfo
    v-if="!isTesting"
    :is-editing="isEditing"
  />
  <QuillEditor
    v-if="!isEditing && text?.length && !isTesting"
    v-model:content="text"
    content-type="html"
    :read-only="true"
    :toolbar="['']"
    class="h-auto mb-5 bg-white"
  />
  <QuillEditor
    v-if="isEditing"
    v-model:content="text"
    content-type="html"
    :toolbar="'full'"
    class="h-auto mb-5 bg-white"
  />
  <div
    v-if="isEditing"
    class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium"
  >
    В тесте будут представлены следующие вопросы:
  </div>
  <template
    v-for="(question , index) in questions"
    :key="index"
  >
    <ReglamentQuestion
      v-if="(isTesting || isEditing) && !showCompleteMessage"
      :ref="question.uid"
      :is-editing="isEditing"
      :question="question"
      @deleteQuestion="onDeleteQuestion"
      @deleteAnswer="deleteAnswer"
      @addQuestion="onAddQuestion"
      @updateQuestionName="updateQuestionName"
      @updateAnswerName="updateAnswerName"
      @pushAnswer="pushAnswer"
      @selectAnswer="selectAnswer"
      @setRightAnswer="setRightAnswer"
    />
  </template>
  <div class="flex w-full pb-5">
    <ListBlocAdd
      v-if="canEdit && isEditing"
      class="mt-5 w-full"
      @click.stop="onAddQuestion"
    />
  </div>
  <div
    v-if="!isEditing && !isTesting && questions.length > 0"
    class="flex justify-end"
  >
    <button
      v-if="!isPassed"
      class="flex items-end bg-[#FF912380] p-3 px-10 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
      @click="isTesting = true"
    >
      Пройти тест
    </button>
  </div>
  <div
    v-if="!isEditing && isTesting && questions.length > 0 && !showCompleteMessage"
    class="flex justify-end"
  >
    <button
      class="flex items-end bg-[#FF912380] p-3 px-10 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
      @click="clickComplete"
    >
      Завершить
    </button>
  </div>
  <div
    v-if="showCompleteMessage && !isPassed"
    class="py-3 rounded-[10px] mb-2 font-[500] text-[20px] my-3 min-w-[10px] min-h-[10px]"
  >
    Вы неправильно ответили на следующие вопросы:
  </div>
  <template
    v-for="question in questions"
    :key="question.uid"
  >
    <ReglamentWrong
      v-if="showCompleteMessage"
      :question="question"
    />
  </template>
  <ReglamentCompleteMessage
    v-if="showCompleteMessage"
    :is-passed="isPassed"
    @confirm="confirm"
  />
  <div class="h-[20px]" />
</template>
<script>
import { QuillEditor } from '@vueup/vue-quill'

import ReglamentWrong from '@/components/Reglaments/ReglamentWrong.vue'
import ReglamentInfo from '@/components/Reglaments/ReglamentInfo.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentQuestion from './ReglamentQuestion.vue'
import ReglamentCompleteMessage from './ReglamentCompleteMessage.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'

import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor,
    ListBlocAdd,
    ReglamentQuestion,
    ReglamentInfo,
    ReglamentCompleteMessage,
    ReglamentWrong,
    PopMenuItem
  },
  props: {
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      text: this.reglament?.content,
      isEditing: this.$store.state.greedSource.email_creator === this.$store.state.user.user.current_user_email,
      questions: [],
      isTesting: false,
      saveContentStatus: 1, // 1 - is saved, 2 error, 0 request processing
      showCompleteMessage: false,
      isPassed: 0
    }
  },
  computed: {
    navStack () {
      return this.$store.state.navbar.navStack
    },
    currentReglament () {
      return this.$store.state.greedSource
    },
    canEdit () {
      return this.currentReglament?.email_creator === this.user.current_user_email
    },
    user () {
      return this.$store.state.user.user
    },
    editButtonText () {
      if (this.isEditing && this.saveContentStatus === 1) {
        return 'Завершить редактирование'
      } else if (!this.isEditing && this.saveContentStatus === 1) {
        return 'Редактировать'
      } else if (this.saveContentStatus === 2) {
        return 'Ошибка сохранения регламента'
      } else if (this.saveContentStatus === 0) {
        return 'Сохраняется'
      }
      return 'Сохраняется'
    }
  },
  watch: {
    isEditing (newval, oldval) {
      if (!newval) {
        setTimeout(() => {
          try {
            document.querySelector('div.ql-toolbar').remove()
          } catch (e) {}
        }, 50)
      }
    }
  },
  mounted () {
    this.$store.dispatch('REGLAMENT_REQUEST', this.reglament.uid).then(resp => {
      this.questions = resp.data
    })
    try {
      if (!this.isEditing) {
        document.querySelector('div.ql-toolbar').remove()
      }
    } catch (e) {}
  },
  methods: {
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    confirm () {
      this.$store.dispatch('popNavStack')
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    updateQuestionName (data) {
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].uid === data.uid) {
          this.questions[i].name = data.name
          return
        }
      }
    },
    gotoNode (uid) {
      this.$refs[uid][0].onFocus()
    },
    deleteAnswer (uid) {
      console.log(uid)
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].uid === uid) {
            this.questions[i].answers.splice(j, 1)
            return
          }
        }
      }
    },
    pushAnswer (data) {
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].uid === data.uid_question) {
          if (!this.questions[i].answers) {
            this.questions[i].answers = []
          }
          this.questions[i].answers.push(data)
          return
        }
      }
    },
    updateAnswerName (data) {
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].uid === data.uid) {
            this.questions[i].answers[j] = data
          }
        }
      }
    },
    selectAnswer (data) {
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].uid === data[0].uid) {
            this.questions[i].answers[j].selected = data[1]
            return
          }
        }
      }
    },
    setRightAnswer (data) {
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].uid === data.uid) {
            this.questions[i].answers[j] = data
            return
          }
        }
      }
    },
    onAddQuestion () {
      const question = {
        uid: this.uuidv4(),
        name: '',
        uid_reglament: this.reglament.uid
      }
      this.$store.dispatch('CREATE_REGLAMENT_QUESTION_REQUEST', question).then(() => {
        const questionToPush = {
          uid: question.uid,
          name: question.name,
          uid_reglament: question.uid_reglament,
          answers: [
            {
              uid: this.uuidv4(),
              uid_question: question.uid,
              name: 'Новый вопрос',
              is_right: 0
            }
          ]
        }

        this.questions.push(questionToPush)
        this.$nextTick(() => {
          this.gotoNode(questionToPush.uid)
        })
      })
    },
    onDeleteQuestion (uid) {
      this.$store.dispatch('DELETE_REGLAMENT_QUESTION_REQUEST', uid).then(() => {
        this.showDeleteQuestion = false
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].uid === uid) {
            this.questions.splice(i, 1)
          }
        }
      })
    },
    isEdit () {
      this.currentReglament.content = this.text
      if (this.isEditing) {
        this.saveContentStatus = 0
        this.$store.dispatch('UPDATE_REGLAMENT_REQUEST', this.currentReglament).then(() => {
          this.isEditing = !this.isEditing
          this.saveContentStatus = 1
        }).catch(() => {
          this.saveContentStatus = 2
        })
      } else {
        this.isEditing = !this.isEditing
      }
    },
    clickComplete () {
      const data = {
        uid_user: this.user.current_user_uid,
        uid_reglament: this.reglament.uid,
        answerJson: JSON.stringify(this.questions)
      }
      console.log(this.questions)
      this.$store.dispatch('CRATE_USER_REGLAMENT_ANSWER', data).then((resp) => {
        this.showCompleteMessage = true
        this.isPassed = resp.data.is_passed
      })
    }
  }
}
</script>
<style scoped>
</style>
