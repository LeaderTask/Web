<template>
  <BoardModalBoxDelete
    v-if="showDeleteCard"
    title="Удалить карточку"
    text="Вы действительно хотите удалить карточку?"
    @cancel="showDeleteCard = false"
    @yes="removeCard"
  />
  <CardMessagesModalBoxLimit
    v-if="showMessagesLimit"
    @cancel="showMessagesLimit = false"
    @ok="showMessagesLimit = false"
  />
  <CardModalBoxBudget
    v-if="showChangeCardBudget"
    :value="selectedCard?.cost / 100"
    :show="showChangeCardBudget"
    title="Бюджет карточки"
    @cancel="showChangeCardBudget = false"
    @save="changeCardBudget"
  />
  <div class="relative min-h-full">
    <div class="flex items-center justify-between mb-[10px]">
      <card-options
        :date-create="selectedCard?.date_create"
        :can-edit="canEdit"
        :creator="selectedCard?.uid_creator"
        :show-files-only="showFilesOnly"
        @clickRemoveButton="showDeleteCard = true"
        @toggleShowOnlyFiles="showFilesOnly = !showFilesOnly"
      />
      <PropsButtonClose
        @click="closeProperties"
      />
    </div>
    <card-cover
      :cover-color="
        selectedCard?.cover_color === '#A998B6' ? '' : selectedCard?.cover_color
      "
      :cover-link="selectedCard?.cover_link"
      :can-edit="canEdit"
      @onChangeCardColor="changeCardColor"
      @onChangeCardCover="changeCardCover"
      @onChangeCardClearCover="changeCardClearCover"
    />

    <card-name
      :card-name="selectedCard?.name"
      :can-edit="canEdit"
      @changeName="changeName"
    />

    <div class="flex justify-start mb-[25px] space-x-[4px]">
      <card-responsible-user
        :responsible="selectedCard?.user"
        :employees-by-email="employeesByEmail"
        :can-edit="canEdit"
        @changeResponsible="changeResponsible"
      />
      <card-budget
        :budget="selectedCard?.cost"
        :can-edit="canEdit"
        @click="showChangeCardBudget = true"
        @onWipeBudget="changeCardBudget"
      />
    </div>

    <TaskPropsCommentEditor
      class="mt-3 h-32 break-words"
      :comment="selectedCard?.comment"
      :can-edit="canEdit"
      @changeComment="changeComment"
    />
    <!-- Chat skeleton -->
    <MessageSkeleton v-if="status=='loading'" />
    <!-- Card chat -->
    <card-chat
      v-if="status=='success'"
      :messages="cardMessages"
      :current-user-uid="user.current_user_uid"
      :employees="employees"
      :show-files-only="showFilesOnly"
      @onQuote="setCurrentQuote"
      @onDeleteMessage="deleteCardMessage"
      @onDeleteFile="deleteCardFileMessage"
    />

    <!-- Card chat input -->
    <div class="flex flex-col fixed bottom-[0px] w-[340px] bg-white pt-2 pb-5">
      <card-message-quote-under-input
        v-if="currentQuote"
        class="mb-[14px] mt-[19px]"
        :quote-message="currentQuote"
        :employee="employees[currentQuote.uid_creator]"
        @onClearQuote="currentQuote = false"
      />
      <card-message-input
        v-model="cardMessageInputValue"
        :can-add-files="canAddFiles"
        @createCardMessage="createCardMessage"
        @createCardFile="createCardFile"
        @onPaste="onPasteEvent"
      />
    </div>
  </div>
</template>

<script>
import {
  CREATE_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  CREATE_FILES_REQUEST,
  DELETE_FILE_REQUEST,
  ADD_MESSAGE_LOCALLY,
  REMOVE_MESSAGE_LOCALLY
} from '@/store/actions/cardfilesandmessages'
import {
  CHANGE_CARD_RESPONSIBLE_USER,
  CHANGE_CARD_BUDGET,
  CHANGE_CARD_NAME,
  CHANGE_CARD_COMMENT,
  CHANGE_CARD_COLOR,
  CHANGE_CARD_COVER,
  CHANGE_CARD_CLEAR_COVER,
  DELETE_CARD
} from '@/store/actions/cards'

import CardName from '@/components/CardProperties/CardName.vue'
import CardCover from '@/components/CardProperties/CardCover.vue'
import CardChat from '@/components/CardProperties/CardChat.vue'
import CardResponsibleUser from '@/components/CardProperties/CardResponsibleUser.vue'
import CardOptions from '@/components/CardProperties/CardOptions.vue'
import CardBudget from '@/components/CardProperties/CardBudget.vue'
import CardMessageInput from '@/components/CardProperties/CardMessageInput.vue'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import CardModalBoxBudget from '@/components/CardProperties/CardModalBoxBudget.vue'
import CardMessageQuoteUnderInput from '@/components/CardProperties/CardMessageQuoteUnderInput.vue'
import CardMessagesModalBoxLimit from '../CardProperties/CardMessagesModalBoxLimit.vue'
import MessageSkeleton from '@/components/TaskProperties/MessageSkeleton.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'

export default {
  components: {
    CardName,
    CardCover,
    CardChat,
    CardResponsibleUser,
    CardOptions,
    CardBudget,
    CardMessageInput,
    TaskPropsCommentEditor,
    BoardModalBoxDelete,
    CardModalBoxBudget,
    CardMessageQuoteUnderInput,
    CardMessagesModalBoxLimit,
    MessageSkeleton,
    PropsButtonClose
  },
  data () {
    return {
      showMessagesLimit: false,
      showChangeCardBudget: false,
      showFilesOnly: false,
      currentQuote: false,
      showDeleteCard: false,
      cardMessageInputValue: ''
    }
  },
  computed: {
    status () { return this.$store.state.cardfilesandmessages.status },
    selectedCard () { return this.$store.state.cards.selectedCard },
    user () { return this.$store.state.user.user },
    boards () { return this.$store.state.boards.boards },
    employees () { return this.$store.state.employees.employees },
    employeesByEmail () { return this.$store.state.employees.employeesByEmail },
    cardMessages () { return this.$store.state.cardfilesandmessages.messages },
    canAddFiles () {
      if (this.user.days_left <= 0) {
        return false
      }
      return true
    },
    canEdit () { return this.boards[this.selectedCard?.uid_board]?.type_access !== 0 }
  },
  watch: {
    selectedCard (oldValue, newValue) {
      this.currentQuote = false
      this.cardMessageInputValue = ''
    }
  },
  methods: {
    onPasteEvent (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_card: this.selectedCard?.uid,
            name: formData
          }
          this.$store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
            this.scrollDown()
          })
        }
      }
    },

    scrollDown () {
      const asideRight = document.getElementById('aside-right')
      asideRight.scroll({ top: asideRight.scrollHeight + 100000 })
    },

    focusMessageInput () {
      const messageInput = document.getElementById('card-message-textarea')
      messageInput.focus()
    },

    changeResponsible (userEmail) {
      this.$store
        .dispatch(CHANGE_CARD_RESPONSIBLE_USER, {
          cardUid: this.selectedCard?.uid,
          email: userEmail
        })
        .then(() => {
          if (this.selectedCard) this.selectedCard.user = userEmail
        })
    },

    changeName (arg) {
      const data = { cardUid: this.selectedCard?.uid, name: arg.target.innerText.trim() }
      if (data.name === '') {
        data.name = 'Карточка без названия'
      }
      this.$store.dispatch(CHANGE_CARD_NAME, data)
    },

    changeCardBudget (budget) {
      const data = { cardUid: this.selectedCard?.uid, budget: budget * 100 }
      this.$store.dispatch(CHANGE_CARD_BUDGET, data).then((resp) => {
        if (this.selectedCard) this.selectedCard.cost = resp.data.cost
        this.showChangeCardBudget = false
      })
    },

    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },

    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },

    changeComment (text) {
      if (!this.selectedCard) return
      const data = { cardUid: this.selectedCard.uid, comment: text }
      this.$store.dispatch(CHANGE_CARD_COMMENT, data)
      this.selectedCard.comment = text
    },

    createCardFile (event) {
      if (event === false) {
        this.showMessagesLimit = true
        return
      }
      const files = event.target.files ? event.target.files : event.dataTransfer.files
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        uid_card: this.selectedCard?.uid,
        name: formData
      }
      this.$store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
        if (this.selectedCard) this.selectedCard.has_files = true
        this.scrollDown()
      })
    },

    setCurrentQuote (quote) {
      this.currentQuote = quote
      this.focusMessageInput()
    },

    deleteCardMessage (uid) {
      this.$store.dispatch(DELETE_MESSAGE_REQUEST, uid)
    },

    deleteCardFileMessage (uid) {
      this.$store.dispatch(DELETE_FILE_REQUEST, uid)
    },

    createCardMessage () {
      // если лицензия истекла
      if (this.user.days_left <= 0) {
        this.showMessagesLimit = true
        return
      }
      if (this.cardMessageInputValue <= 0) {
        return
      }
      let msgcard = this.cardMessageInputValue
      msgcard = msgcard.trim()
      msgcard = msgcard.replaceAll('&', '&amp;')
      msgcard = msgcard.replaceAll('>', '&gt;')
      msgcard = msgcard.replaceAll('<', '&lt;')
      const uid = this.uuidv4()
      const data = {
        uid_card: this.selectedCard?.uid,
        uid: uid,
        uid_msg: uid,
        date_create: new Date().toISOString(),
        uid_creator: this.user.current_user_uid,
        uid_quote: this.currentQuote?.uid ?? '',
        text: msgcard,
        msg: msgcard,
        order: 0,
        deleted: 0
      }
      this.$store.dispatch(CREATE_MESSAGE_REQUEST, data).then(() => {
        if (this.selectedCard) this.selectedCard.has_msgs = true
        this.cardMessageInputValue = ''
        this.currentQuote = false
        this.scrollDown()
      })
    },

    changeCardClearCover () {
      this.$store
        .dispatch(CHANGE_CARD_CLEAR_COVER, { cardUid: this.selectedCard?.uid })
        .then((resp) => {
          if (this.selectedCard) {
            this.selectedCard.cover_color = '#A998B6'
            this.selectedCard.cover_link = ''
          }
          // Replacing old cover file with new cover file
          for (const message of resp.data.deletefiles) {
            this.$store.commit(REMOVE_MESSAGE_LOCALLY, message)
          }
          // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
          this.$nextTick(() => {
            for (const message of resp.data.newfiles) {
              this.$store.commit(ADD_MESSAGE_LOCALLY, message)
            }
          })
        })
    },

    changeCardColor (color) {
      if (color) {
        this.$store
          .dispatch(CHANGE_CARD_COLOR, {
            cardUid: this.selectedCard?.uid,
            color: color
          })
          .then((resp) => {
            if (this.selectedCard) {
              this.selectedCard.cover_color = color
              this.selectedCard.cover_link = ''
            }
            // Replacing old cover file with new cover file
            for (const message of resp.data.deletefiles) {
              this.$store.commit(REMOVE_MESSAGE_LOCALLY, message)
            }
            // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
            this.$nextTick(() => {
              for (const message of resp.data.newfiles) {
                this.$store.commit(ADD_MESSAGE_LOCALLY, message)
              }
            })
          })
      } else {
        this.changeCardClearCover()
      }
    },

    changeCardCover (event) {
      const files = event.target.files
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        cardUid: this.selectedCard?.uid,
        file: formData
      }
      this.$store.dispatch(CHANGE_CARD_COVER, data).then((resp) => {
        if (this.selectedCard) {
          this.selectedCard.cover_color = resp.data.card.cover_color
          this.selectedCard.cover_link = resp.data.card.cover_link
        }
        // Replacing old cover file with new cover file
        for (const message of resp.data.deletefiles) {
          this.$store.commit(REMOVE_MESSAGE_LOCALLY, message)
        }
        // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
        this.$nextTick(() => {
          for (const message of resp.data.newfiles) {
            this.$store.commit(ADD_MESSAGE_LOCALLY, message)
          }
        })
      })
    },

    removeCard () {
      this.$store.dispatch(DELETE_CARD, { uid: this.selectedCard?.uid })
        .then(() => {
          this.closeProperties()
          this.showDeleteCard = false
        })
    }
  }
}

</script>
