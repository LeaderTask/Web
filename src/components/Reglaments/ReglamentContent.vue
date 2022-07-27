<template>
  <ReglamentTestLimit
    v-if="showTestLimit"
    @cancel="showTestLimit = false"
    @ok="showTestLimit = false"
  />
  <ReglamentEditLimit
    v-if="showEditLimit"
    @cancel="showEditLimit = false"
    @ok="showEditLimit = false"
  />
  <div
    v-if="isEditing"
  >
    <div
      class="flex justify-end gap-[8px] mb-2"
    >
      <PopMenu>
        <ReglamentSmallButton>Добавить редактора</ReglamentSmallButton>
        <template #menu>
          <div class="max-h-[220px] overflow-y-auto scroll-style max-w-[260px]">
            <BoardPropsMenuItemUser
              v-for="editor in usersCanAddToAccess"
              :key="editor.email"
              :show-check-mark="checkEditor(editor.email)"
              :user-email="editor.email"
              @click="addReglamentEditor(editor.email)"
            />
          </div>
        </template>
      </PopMenu>
      <ReglamentSmallButton
        :icon="shouldClear ? 'check' : 'uncheck'"
        @click="shouldClear = !shouldClear"
      >
        Очистить сотрудников, прошедших регламент
      </ReglamentSmallButton>
      <ReglamentSmallButton
        class="w-[224px]"
        icon="edit"
        @click="setEdit"
      >
        {{ editButtonText }}
      </ReglamentSmallButton>
    </div>
    <div class="bg-white p-3 rounded mb-3">
      <input
        v-model="currName"
        type="text"
        placeholder="Наименование"
        class="p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      >
    </div>
    <QuillEditor
      v-model:content="text"
      content-type="html"
      :toolbar="'full'"
      class="h-auto mb-5 bg-white"
    />
    <div
      class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium"
    >
      В тесте будут представлены следующие вопросы:
    </div>
  </div>
  <div v-else>
    <div
      v-if="canEdit && !showCompleteMessage"
      class="flex justify-end mb-2"
    >
      <ReglamentSmallButton
        v-if="!isTesting"
        class="w-[224px]"
        icon="edit"
        @click="setEdit"
      >
        {{ editButtonText }}
      </ReglamentSmallButton>
    </div>
    <ReglamentInfo
      v-if="!isTesting"
      :title="reglament?.name ?? ''"
      :creator="reglament?.email_creator ?? ''"
      :editors="currentEditors"
      :contributors="contributors"
    />
    <QuillEditor
      v-if="text?.length && !isTesting"
      v-model:content="text"
      content-type="html"
      :read-only="true"
      :toolbar="['']"
      class="h-auto mb-5 bg-white"
    />
  </div>

  <div
    v-if="(isTesting || isEditing) && !showCompleteMessage"
  >
    <template
      v-for="(question , index) in questions"
      :key="index"
    >
      <ReglamentQuestion
        :ref="question.uid"
        :is-editing="isEditing"
        :question="question"
        :reglament="reglament"
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
  </div>
  <ListBlocAdd
    v-if="canEdit && isEditing"
    class="mt-5 w-full mb-5"
    @click.stop="onAddQuestion"
  />
  <div
    v-if="!isEditing && !isTesting && questions.length > 0 && reglament.is_passed !== 1 && shouldShowButton"
    class="flex justify-end"
  >
    <button
      class="flex items-end bg-[#FF912380] p-3 px-10 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
      @click="startTheReglament"
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
import * as REGLAMENTS from '@/store/actions/reglaments.js'

import ReglamentWrong from '@/components/Reglaments/ReglamentWrong.vue'
import ReglamentInfo from '@/components/Reglaments/ReglamentInfo.vue'
import ReglamentTestLimit from '@/components/Reglaments/ReglamentTestLimit.vue'
import ReglamentEditLimit from '@/components/Reglaments/ReglamentEditLimit.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentQuestion from './ReglamentQuestion.vue'
import ReglamentCompleteMessage from './ReglamentCompleteMessage.vue'
import ReglamentSmallButton from '@/components/Reglaments/ReglamentSmallButton.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import BoardPropsMenuItemUser from '@/components/Board/BoardPropsMenuItemUser.vue'

import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor,
    ListBlocAdd,
    ReglamentQuestion,
    ReglamentInfo,
    ReglamentCompleteMessage,
    ReglamentWrong,
    ReglamentSmallButton,
    PopMenu,
    BoardPropsMenuItemUser,
    ReglamentEditLimit,
    ReglamentTestLimit
  },
  props: {
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      currName: this.reglament?.name ?? '',
      showTestLimit: false,
      text: this.reglament?.content ?? '',
      isEditing: false,
      showEditLimit: false,
      questions: [],
      contributors: [],
      isTesting: false,
      saveContentStatus: 1, // 1 - is saved, 2 error, 0 request processing
      showCompleteMessage: false,
      isPassed: 0,
      shouldClear: false,
      showCheckMark: false
    }
  },
  computed: {
    currentEditors () {
      return this.reglament.editors
    },
    needStartEdit () {
      return this.reglament?.needStartEdit ?? false
    },
    editorsCanEdit () {
      return this.reglament.editors.includes(this.$store.state.user.user.current_user_email)
    },
    canEdit () {
      const userType = this.$store.state.employees.employees[this.$store.state.user.user.current_user_uid].type
      return (this.reglament?.email_creator === this.user.current_user_email) || (this.editorsCanEdit) || (userType === 2 || userType === 1)
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
    },
    shouldShowButton () {
      let hasRightAnswers = false
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].is_right) {
            hasRightAnswers = true
            return hasRightAnswers
          }
        }
      }
      return hasRightAnswers
    },
    usersCanAddToAccess () {
      const users = []
      const employees = Object.values(this.$store.state.employees.employees)
      const editors = this.currentEditors || {}
      for (const emp of employees) {
        if (editors[emp.uid] === undefined && emp.email !== this.reglament.email_creator) {
          users.push({
            uid: emp.uid,
            email: emp.email
          })
        }
      }
      return users
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
    },
    needStartEdit: {
      immediate: true,
      handler: function (val) {
        if (val) {
          // убираем needStartEdit - чтобы следующий раз не редактировался
          const reglaments = this.$store.state.navigator.navigator.reglaments
          const index = reglaments.items.findIndex(item => item.uid === this.reglament?.uid)
          if (index !== -1) reglaments.items[index].needStartEdit = false
          //
          this.setEdit()
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('REGLAMENT_REQUEST', this.reglament.uid).then(resp => {
      this.questions = resp.data
    })
    this.$store.dispatch('GET_USERS_REGLAMENT_ANSWERS', this.reglament.uid).then(resp => {
      const contributors = resp.data
      const seen = []
      const cleared = []
      for (let i = 0; i < contributors.length; i++) {
        if (!(seen.includes(contributors[i].uid_user))) {
          seen.push(contributors[i].uid_user)
          cleared.push(contributors[i])
        }
      }
      this.contributors = cleared
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
    confirm (val) {
      if (val) {
        this.$store.dispatch('popNavStack')
        this.$store.dispatch('asidePropertiesToggle', false)
        return
      }
      // обнуляем значения, чтобы юзер ещё раз прочитал регламент
      this.showCompleteMessage = false
      this.isEditing = false
      this.isTesting = false
      // обнуляем значение selected
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].selected) {
            this.questions[i].answers[j].selected = false
          }
        }
      }
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
      let rightAnswers = 0
      // считаем кол-во правильных ответов в вопросе и решаем, что будем делать дальше
      for (let i = 0; i < this.questions.length; i++) {
        // ищем вопрос, который мы выбрали, а потом проверяем считаем ответы
        if (this.questions[i].uid === data[0].uid_question) {
          for (let j = 0; j < this.questions[i].answers.length; j++) {
            if (this.questions[i].answers[j].is_right) {
              rightAnswers++
            }
          }
        }
      }
      // запускаем логику для одного вопроса
      if (rightAnswers === 1) {
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].uid === data[0].uid_question) {
            for (let j = 0; j < this.questions[i].answers.length; j++) {
              // убираем selected с предыдущего вопроса
              if (this.questions[i].answers[j].selected && (this.questions[i].answers[j].uid !== data[0].uid)) {
                this.questions[i].answers[j].selected = false
              }
              // ставим selected новому вопросу
              if (!this.questions[i].answers[j].selected && (this.questions[i].answers[j].uid === data[0].uid)) {
                this.questions[i].answers[j].selected = true
              } else {
                this.questions[i].answers[j].selected = false
              }
            }
          }
        }
      } else {
        // выделяет/развыделяет множество ответов
        for (let i = 0; i < this.questions.length; i++) {
          for (let j = 0; j < this.questions[i].answers.length; j++) {
            if (this.questions[i].answers[j].uid === data[0].uid) {
              this.questions[i].answers[j].selected = data[1]
              return
            }
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
              name: '',
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
    setEdit () {
      if (this.user.tarif !== 'alpha') {
        this.showEditLimit = true
        return
      }
      if (this.isEditing) {
        const reglament = { ...this.reglament }
        reglament.content = this.text
        reglament.name = this.currName.trim()
        if (!reglament.name.length) {
          reglament.name = 'Регламент без названия'
        }
        //
        this.saveContentStatus = 0
        this.$store.dispatch('UPDATE_REGLAMENT_REQUEST', reglament).then(() => {
          if (this.shouldClear) {
            this.$store.dispatch(REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS, reglament.uid)
            this.shouldClear = false
          }
          this.isEditing = !this.isEditing
          this.saveContentStatus = 1
          // обновляем регламент в сторе
          // надо бы сделать по нормальному через мутацию
          const reglaments = this.$store.state.navigator.navigator.reglaments
          const index = reglaments.items.findIndex(item => item.uid === reglament.uid)
          if (index !== -1) reglaments.items[index] = reglament
        }).catch(() => {
          this.saveContentStatus = 2
        })
      } else if (this.canEdit) {
        this.isEditing = true
        this.currName = this.reglament?.name
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
        const reglament = { ...this.reglament }
        reglament.is_passed = resp.data.is_passed
        this.$store.commit('NAVIGATOR_UPDATE_REGLAMENT', reglament)
        this.showCompleteMessage = true
        this.isPassed = resp.data.is_passed
      })
    },
    addReglamentEditor (email) {
      for (let i = 0; i < this.currentEditors.length; i++) {
        if (this.currentEditors[i] === email) {
          this.currentEditors.splice(i, 1)
          return
        }
      }
      this.currentEditors.push(email)
    },
    checkEditor (email) {
      return this.currentEditors?.includes(email)
    },
    startTheReglament () {
      if (this.user.tarif !== 'alpha') {
        this.showTestLimit = true
        return
      }
      this.isTesting = true
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style scoped>
</style>
