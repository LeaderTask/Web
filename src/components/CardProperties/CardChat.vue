<script>

import CardChatInterlocutorMessage from '@/components/CardProperties/CardChatInterlocutorMessage.vue'
import CardChatInterlocutorFileMessage from '@/components/CardProperties/CardChatInterlocutorFileMessage.vue'
import CardChatSelfMessage from '@/components/CardProperties/CardChatSelfMessage.vue'
import CardChatSelfFileMessage from '@/components/CardProperties/CardChatSelfFileMessage.vue'
import CardChatQuoteMessage from '@/components/CardProperties/CardChatQuoteMessage.vue'

export default {
  components: {
    CardChatInterlocutorMessage,
    CardChatInterlocutorFileMessage,
    CardChatSelfMessage,
    CardChatSelfFileMessage,
    CardChatQuoteMessage
  },

  props: {
    key: String,
    messages: Array,
    currentUserUid: String,
    employees: Object,
    showFilesOnly: Boolean
  },

  emits: ['onQuote, onDeleteMessage', 'onDeleteFile'],
  computed: {
    cardmessages () {
      const mutatedMessages = this.messages.map((message) => ({
        ...message,
        isFile: !!message.uid_file,
        isMessage: !message.uid_file && message.uid_creator !== 'inspector',
        hasQuote: message.uid_quote && message.uid_quote !== '00000000-0000-0000-0000-000000000000' && message.deleted !== 1,
        quoteMessage: this.getMessageByUid(message?.uid_quote),
        isInspectorMessage: message.uid_creator === 'inspector',
        isMyMessage: message.uid_creator === this.currentUserUid
      }))
      return mutatedMessages
    }
  },

  methods: {

    getMessageByUid (uid) {
      for (const message of this.messages) {
        if (message.uid === uid) return message
      }
      return false
    },

    isChangedDate (index) {
      if (index === 0) return true
      const messagePrev = this.messages[index - 1]
      const messageCurr = this.messages[index]
      if (!messagePrev || !messageCurr) return false
      return new Date(messagePrev.date_create).toDateString() !==
            new Date(messageCurr.date_create).toDateString()
    },

    isChangedCreator (index) {
      if (index === 0) return true
      const messagePrev = this.messages[index - 1]
      const messageCurr = this.messages[index]
      if (!messagePrev || !messageCurr) return false
      return messagePrev.uid_creator !== messageCurr.uid_creator
    },

    setCurrentQuote (quoteMessage) {
      this.$emit('onQuote', quoteMessage)
    },

    deleteMessage (uid) {
      this.$emit('onDeleteMessage', uid)
    },

    deleteFile (uid) {
      this.$emit('onDeleteFile', uid)
    },

    getMessageWeekDateString (dateCreate) {
      if (!dateCreate) return ''
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      if (dateCreate[dateCreate.length - 1] !== 'Z') {
        dateCreate += 'Z'
      }
      const today = new Date()
      const date = new Date(dateCreate)
      let weekDay = date.toLocaleString('default', { weekday: 'long' })
      weekDay = weekDay.slice(0, 1).toUpperCase() + weekDay.slice(1)
      const dayNum = date.getDate()
      const day = (dayNum < 10 ? '0' : '') + dayNum
      const month = date.toLocaleString('default', { month: 'short' }).slice(0, 3)
      const year = (today.getFullYear() !== date.getFullYear()) ? date.getFullYear().toString() : ''
      return `${weekDay}, ${day} ${month} ${year}`
    }
  }
}
</script>

<template>
  <div class="flex flex-col pb-[100px]">
    <div
      v-for="(message, index,key) in cardmessages"
      :key="`${key}`"
    >
      <div
        v-if="isChangedDate(index)"
        class="text-[#88888A] text-[11px] font-[400] leading-[13px] tracking-wide my-[15px] text-center"
      >
        {{ getMessageWeekDateString(message.date_create) }}
      </div>

      <!-- New creator -->
      <div
        v-if="isChangedCreator(index) && employees[message.uid_creator]"
        class="text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'text-left': !message.isMyMessage, 'text-right': message.isMyMessage }"
      >
        {{ employees[message.uid_creator].name }}
      </div>

      <card-chat-quote-message
        v-if="message.hasQuote"
        class="mb-[14px] mt-[19px]"
        :quote-message="message.quoteMessage"
        :employee="employees[message.quoteMessage.uid_creator]"
      />

      <card-chat-interlocutor-message
        v-if="!message.isMyMessage && message.isMessage && !showFilesOnly"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
      />
      <card-chat-interlocutor-file-message
        v-if="!message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
      />

      <card-chat-self-message
        v-if="message.isMyMessage && message.isMessage && !showFilesOnly"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
        @onDeleteMessage="deleteMessage"
      />
      <card-chat-self-file-message
        v-if="message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
        @onDeleteFile="deleteFile"
      />
    </div>
  </div>
</template>
