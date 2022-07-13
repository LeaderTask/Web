<script setup>
import { computed, ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
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
import Icon from '@/components/Icon.vue'
import close from '@/icons/close.js'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import CardModalBoxBudget from '@/components/CardProperties/CardModalBoxBudget.vue'
import CardMessageQuoteUnderInput from '@/components/CardProperties/CardMessageQuoteUnderInput.vue'
import CardMessagesModalBoxLimit from '../CardProperties/CardMessagesModalBoxLimit.vue'

const store = useStore()
const selectedCard = computed(() => store.state.cards.selectedCard)
const user = computed(() => store.state.user.user)
const boards = computed(() => store.state.boards.boards)
const employees = computed(() => store.state.employees.employees)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const cardMessages = computed(() => store.state.cardfilesandmessages.messages)
const canAddFiles = computed(() => {
  const user = store.state.user.user
  if (user.days_left <= 0) {
    return false
  }
  return true
})

const showMessagesLimit = ref(false)
const showChangeCardBudget = ref(false)
const showFilesOnly = ref(false)
const currentQuote = ref(false)

const onPasteEvent = (e) => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items
  for (const index in items) {
    const item = items[index]
    if (item.kind === 'file') {
      const blob = item.getAsFile()
      const formData = new FormData()
      formData.append('files', blob)
      const data = {
        uid_card: selectedCard.value?.uid,
        name: formData
      }
      store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
        scrollDown()
      })
    }
  }
}

watch(selectedCard, (oldValue, newValue) => {
  currentQuote.value = false
})

const scrollDown = () => {
  const asideRight = document.getElementById('aside-right')
  asideRight.scroll({ top: asideRight.scrollHeight + 100000 })
}

const focusMessageInput = () => {
  const messageInput = document.getElementById('card-message-textarea')
  messageInput.focus()
}

const changeResponsible = (userEmail) => {
  store
    .dispatch(CHANGE_CARD_RESPONSIBLE_USER, {
      cardUid: selectedCard.value?.uid,
      email: userEmail
    })
    .then(() => {
      if (selectedCard.value) selectedCard.value.user = userEmail
    })
}

const changeName = (arg) => {
  const data = { cardUid: selectedCard.value?.uid, name: arg.target.innerText }
  store.dispatch(CHANGE_CARD_NAME, data)
}

const changeCardBudget = (budget) => {
  const data = { cardUid: selectedCard.value?.uid, budget: budget * 100 }
  store.dispatch(CHANGE_CARD_BUDGET, data).then((resp) => {
    if (selectedCard.value) selectedCard.value.cost = resp.data.cost
    showChangeCardBudget.value = false
  })
}

const closeProperties = () => {
  store.dispatch('asidePropertiesToggle', false)
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const cardMessageInputValue = ref('')

const canEdit = computed(
  () => boards.value[selectedCard.value?.uid_board]?.type_access !== 0
)
const endChangeComment = (text) => {
  const data = { cardUid: selectedCard.value?.uid, comment: text }
  store.dispatch(CHANGE_CARD_COMMENT, data)
}

const createCardFile = (event) => {
  if (event === false) {
    showMessagesLimit.value = true
    return
  }
  const files = event.target.files
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    formData.append('files[' + i + ']', file)
  }
  const data = {
    uid_card: selectedCard.value?.uid,
    name: formData
  }
  console.log(data)
  store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
    if (selectedCard.value) selectedCard.value.has_files = true
    scrollDown()
  })
}

const setCurrentQuote = (quote) => {
  currentQuote.value = quote
  focusMessageInput()
}

const deleteCardMessage = (uid) => {
  store.dispatch(DELETE_MESSAGE_REQUEST, uid)
}

const deleteCardFileMessage = (uid) => {
  console.log('DLEETING FILE MESSAGE')
  store.dispatch(DELETE_FILE_REQUEST, uid)
}

const createCardMessage = () => {
  // если лицензия истекла
  if (user.value.days_left <= 0) {
    showMessagesLimit.value = true
    return
  }
  const uid = uuidv4()
  const data = {
    uid_card: selectedCard.value?.uid,
    uid_msg: uid,
    uid: uid,
    date_create: new Date().toISOString(),
    uid_creator: user.value.current_user_uid,
    uid_quote: currentQuote?.value?.uid ?? '',
    text: cardMessageInputValue.value,
    msg: cardMessageInputValue.value,
    order: 0,
    deleted: 0
  }
  store.dispatch(CREATE_MESSAGE_REQUEST, data).then(() => {
    if (selectedCard.value) selectedCard.value.has_msgs = true
    cardMessageInputValue.value = ''
    currentQuote.value = false
    scrollDown()
  })
}

const changeCardClearCover = () => {
  store
    .dispatch(CHANGE_CARD_CLEAR_COVER, { cardUid: selectedCard.value?.uid })
    .then((resp) => {
      if (selectedCard.value) {
        selectedCard.value.cover_color = '#A998B6'
        selectedCard.value.cover_link = ''
      }
      // Replacing old cover file with new cover file
      for (const message of resp.data.deletefiles) {
        store.commit(REMOVE_MESSAGE_LOCALLY, message)
      }
      // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
      nextTick(() => {
        for (const message of resp.data.newfiles) {
          store.commit(ADD_MESSAGE_LOCALLY, message)
        }
      })
    })
}

const changeCardColor = (color) => {
  if (color) {
    store
      .dispatch(CHANGE_CARD_COLOR, {
        cardUid: selectedCard.value?.uid,
        color: color
      })
      .then((resp) => {
        if (selectedCard.value) {
          selectedCard.value.cover_color = color
          selectedCard.value.cover_link = ''
        }
        // Replacing old cover file with new cover file
        for (const message of resp.data.deletefiles) {
          store.commit(REMOVE_MESSAGE_LOCALLY, message)
        }
        // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
        nextTick(() => {
          for (const message of resp.data.newfiles) {
            store.commit(ADD_MESSAGE_LOCALLY, message)
          }
        })
      })
  } else {
    changeCardClearCover()
  }
}

const changeCardCover = (event) => {
  const files = event.target.files
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    formData.append('files[' + i + ']', file)
  }
  const data = {
    cardUid: selectedCard.value?.uid,
    file: formData
  }
  console.log(data)
  store.dispatch(CHANGE_CARD_COVER, data).then((resp) => {
    if (selectedCard.value) {
      selectedCard.value.cover_color = resp.data.card.cover_color
      selectedCard.value.cover_link = resp.data.card.cover_link
    }
    // Replacing old cover file with new cover file
    for (const message of resp.data.deletefiles) {
      store.commit(REMOVE_MESSAGE_LOCALLY, message)
    }
    // Here I use nextTick because if we instantly start adding new files, then onMounted hook won't be triggered, MAGIC but works
    nextTick(() => {
      for (const message of resp.data.newfiles) {
        store.commit(ADD_MESSAGE_LOCALLY, message)
      }
    })
  })
}

const showDeleteCard = ref(false)
const removeCard = () => {
  store.dispatch(DELETE_CARD, { uid: selectedCard.value?.uid })
    .then(() => {
      closeProperties()
      showDeleteCard.value = false
    })
}
</script>

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
    <!-- Close icon -->
    <Icon
      :path="close.path"
      class="text-[#7E7E80] dark:text-white cursor-pointer fixed top-[26px] right-[25px]"
      :box="close.viewBox"
      :width="close.width"
      :height="close.height"
      @click="closeProperties"
    />
    <div class="flex items-center justify-between mb-[10px]">
      <card-options
        :date-create="selectedCard?.date_create"
        :can-edit="canEdit"
        :creator="selectedCard?.uid_creator"
        :show-files-only="showFilesOnly"
        @clickRemoveButton="showDeleteCard = true"
        @toggleShowOnlyFiles="showFilesOnly = !showFilesOnly"
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
      @endChangeComment="endChangeComment"
      @blur="endChangeComment"
    />

    <!-- Card chat -->
    <card-chat
      :key="`${Math.random()}`"
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
