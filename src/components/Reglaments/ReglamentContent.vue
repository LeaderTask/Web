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
      <PopMenu v-if="!editorsCanEdit">
        <ReglamentSmallButton>
          Добавить редактора
        </ReglamentSmallButton>
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
      <PopMenu>
        <ReglamentSmallButton>
          {{ currDepTitle }}
        </ReglamentSmallButton>
        <template #menu>
          <div class="max-h-[220px] overflow-y-auto scroll-style max-w-[260px]">
            <PopMenuItem
              @click="currDep = ''"
            >
              Общий для всех отделов
            </PopMenuItem>
            <PopMenuItem
              v-for="dep in allDepartments"
              :key="dep.uid"
              @click="currDep = dep.uid"
            >
              {{ dep.name }}
            </PopMenuItem>
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
      v-model:content="currText"
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
      :title="reglamentTitle"
      :creator="reglamentCreatorEmail"
      :editors="reglamentEditors"
      :contributors="contributors"
      :department="reglamentDep"
    />
    <QuillEditor
      v-if="reglamentContent.length && !isTesting"
      v-model:content="reglamentContent"
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
    v-if="!isEditing && !isTesting && questions.length > 0 && !isContributor && shouldShowButton"
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
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
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
    PopMenuItem,
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
      currEditors: [],
      currName: '',
      currDep: '',
      currText: '',
      //
      showTestLimit: false,
      isEditing: false,
      showEditLimit: false,
      isTesting: false,
      saveContentStatus: 1, // 1 - is saved, 2 error, 0 request processing
      showCompleteMessage: false,
      isPassed: 0,
      shouldClear: false,
      showCheckMark: false
    }
  },
  computed: {
    currReglament () {
      return this.$store.state.reglaments.reglaments[this.reglament?.uid]
    },
    questions () {
      return this.$store?.state?.reglaments?.reglamentQuestions
    },
    reglamentTitle () {
      return this.currReglament?.name ?? ''
    },
    reglamentContent () {
      return this.currReglament?.content ?? ''
    },
    reglamentCreatorEmail () {
      return this.currReglament?.email_creator ?? ''
    },
    reglamentDep () {
      return this.currReglament?.department_uid ?? ''
    },
    reglamentEditors () {
      return this.currReglament?.editors ?? []
    },
    isContributor () {
      for (let i = 0; i < this.contributors.length; i++) {
        if (this.contributors[i].uid_user === this.user.current_user_uid) {
          return true
        }
      }
      return false
    },
    contributors () {
      return this.$store?.state?.reglaments?.contributors
    },
    needStartEdit () {
      return this.currReglament?.needStartEdit ?? false
    },
    editorsCanEdit () {
      return this.currReglament?.editors?.includes(this.$store.state.user.user.current_user_email)
    },
    canEdit () {
      const userType = this.$store.state.employees.employees[this.$store.state.user.user.current_user_uid].type
      return (this.currReglament?.email_creator === this.user.current_user_email) || (this.editorsCanEdit) || (userType === 2 || userType === 1)
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
      const creator = this.reglamentCreatorEmail.toLowerCase()
      for (const emp of employees) {
        if (emp.email.toLowerCase() !== creator) {
          users.push({
            uid: emp.uid,
            email: emp.email
          })
        }
      }
      return users
    },
    currDepTitle () {
      const dep = this.$store.state.departments.deps[this.currDep]
      return dep?.name || 'Общий для всех отделов'
    },
    allDepartments () {
      const deps = Object.values(this.$store.state.departments.deps)
      deps.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.name > item2.name) return 1
        if (item1.name < item2.name) return -1
        return 0
      })
      if (this.showAllReglaments) return deps
      const currentUserEmail = this.$store.state.user.user.current_user_email.toLowerCase()
      return deps.filter(dep => dep.emails.find(email => email.toLowerCase() === currentUserEmail))
    },
    showAllReglaments () {
      return this.$store.state.reglaments.showAll
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
          const index = reglaments.items.findIndex(item => item.uid === this.currReglament?.uid)
          if (index !== -1) reglaments.items[index].needStartEdit = false
          //
          this.setEdit()
        }
      }
    }
  },
  mounted () {
    if (!this.currReglament) return
    this.$store.dispatch(REGLAMENTS.REGLAMENT_REQUEST, this.currReglament?.uid)
    this.$store.dispatch(REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS, this.currReglament?.uid)
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
      this.$store.commit(REGLAMENTS.REGLAMENT_RESTORE_SELECTED)
    },
    updateQuestionName (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_UPDATE_QUESTION_NAME, data)
    },
    gotoNode (uid) {
      this.$refs[uid][0].onFocus()
    },
    deleteAnswer (uid) {
      this.$store.commit(REGLAMENTS.REGLAMENT_DELETE_ANSWER, uid)
    },
    pushAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_PUSH_ANSWER, data)
    },
    updateAnswerName (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_UPDATE_ANSWER_NAME, data)
    },
    selectAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_SELECT_ANSWER, data)
    },
    setRightAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_SET_RIGHT_ANSWER, data)
    },
    onAddQuestion () {
      const question = {
        uid: this.uuidv4(),
        name: '',
        uid_reglament: this.currReglament.uid
      }
      const answer = {
        uid: this.uuidv4(),
        uid_question: question.uid,
        name: '',
        is_right: 0
      }
      this.$store.dispatch('CREATE_REGLAMENT_QUESTION_REQUEST', question).then(() => {
        this.$store.dispatch('CREATE_REGLAMENT_ANSWER_REQUEST', answer).then(() => {
          const questionToPush = {
            uid: question.uid,
            name: question.name,
            uid_reglament: question.uid_reglament,
            answers: [answer]
          }

          this.$store.commit(REGLAMENTS.REGLAMENT_PUSH_QUESTION, questionToPush)
          this.$nextTick(() => {
            this.gotoNode(questionToPush.uid)
          })
        })
      })
    },
    onDeleteQuestion (uid) {
      this.$store.dispatch('DELETE_REGLAMENT_QUESTION_REQUEST', uid).then(() => {
        this.showDeleteQuestion = false
        this.$store.commit(REGLAMENTS.REGLAMENT_DELETE_QUESTION, uid)
      })
    },
    setEdit () {
      if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
        this.showEditLimit = true
        return
      }
      if (this.isEditing) {
        const reglament = { ...this.currReglament }
        reglament.content = this.currText
        reglament.name = this.currName.trim()
        reglament.department_uid = this.currDep
        reglament.editors = [...this.currEditors]
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
        this.currName = this.reglamentTitle
        this.currText = this.reglamentContent
        this.currEditors = [...this.reglamentEditors]
        this.currDep = this.reglamentDep
      }
    },
    clickComplete () {
      const data = {
        uid_user: this.user.current_user_uid,
        uid_reglament: this.currReglament.uid,
        answerJson: JSON.stringify(this.questions)
      }
      console.log(this.questions)
      this.$store.dispatch('CRATE_USER_REGLAMENT_ANSWER', data).then((resp) => {
        const reglament = { ...this.currReglament }
        reglament.is_passed = resp.data.is_passed
        this.$store.commit('NAVIGATOR_UPDATE_REGLAMENT', reglament)
        this.showCompleteMessage = true
        this.isPassed = resp.data.is_passed
      })
    },
    addReglamentEditor (email) {
      const index = this.currEditors.findIndex(editor => editor.toLowerCase() === email.toLowerCase())
      if (index !== -1) {
        this.currEditors.splice(index, 1)
      } else {
        this.currEditors.push(email)
      }
    },
    checkEditor (email) {
      return this.currEditors.includes(email)
    },
    startTheReglament () {
      if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
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
