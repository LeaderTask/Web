<script>

import CardChatMessageOptionsPopMenu from '@/components/CardProperties/CardChatMessageOptionsPopMenu.vue'
import CardChatDeletedMessageContent from '@/components/CardProperties/CardChatDeletedMessageContent.vue'

export default {
  components: {
    CardChatMessageOptionsPopMenu,
    CardChatDeletedMessageContent
  },
  props: {
    message: Object
  },

  emits: ['onQuoteMessage, onDeleteMessage'],

  methods: {

    getMessageTimeString (dateCreate) {
      if (!dateCreate) return ''
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      if (dateCreate[dateCreate.length - 1] !== 'Z') {
        dateCreate += 'Z'
      }
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  }
}
</script>

<template>
  <div
    class="bg-[#F4F5F7] py-[10px] px-[15px] rounded-t-[12px] rounded-bl-[12px] mb-[5px] float-right max-w-[300px] group"
  >
    <card-chat-deleted-message-content v-if="message.deleted" />
    <div
      v-else
      class="flex break-words"
    >
      <span
        v-linkified:options="{ className: 'text-blue-600', tagName: 'a' }"
        class="mr-[8px] font-[400] text-[14px] text-[#4C4C4D] leading-[19px] whitespace-pre-line break-words max-w-[230px]"
      >
        {{ message.msg }}
      </span>
      <p
        class="text-right font-[700] leading-[14px] text-[11px] self-end group-hover:hidden min-w-[30px]"
        style="color: rgba(0, 0, 0, 0.4);"
      >
        {{ getMessageTimeString(message.date_create) }}
      </p>
      <div class="self-end group-hover:flex hidden">
        <card-chat-message-options-pop-menu
          @onQuoteMessage="$emit('onQuoteMessage', message)"
          @onDeleteMessage="$emit('onDeleteMessage', message.uid)"
        >
          <div class="min-w-[30px] min-h-[16px] flex cursor-pointer items-end justify-center">
            <svg
              width="14"
              height="4"
              viewBox="0 0 14 4"
              class="mb-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2004 2.0001C10.2004 1.11644 10.9167 0.400098 11.8004 0.400098C12.684 0.400098 13.4004 1.11644 13.4004 2.0001C13.4004 2.88375 12.684 3.6001 11.8004 3.6001C10.9167 3.6001 10.2004 2.88375 10.2004 2.0001Z"
                fill="#4C4C4D"
              />
              <path
                d="M5.40039 2.0001C5.40039 1.11644 6.11673 0.400098 7.00039 0.400098C7.88405 0.400098 8.60039 1.11644 8.60039 2.0001C8.60039 2.88375 7.88405 3.6001 7.00039 3.6001C6.11673 3.6001 5.40039 2.88375 5.40039 2.0001Z"
                fill="#4C4C4D"
              />
              <path
                d="M0.60039 2.0001C0.60039 1.11644 1.31674 0.400098 2.20039 0.400098C3.08405 0.400098 3.80039 1.11644 3.80039 2.0001C3.80039 2.88375 3.08405 3.6001 2.20039 3.6001C1.31674 3.6001 0.60039 2.88375 0.60039 2.0001Z"
                fill="#4C4C4D"
              />
            </svg>
          </div>
        </card-chat-message-options-pop-menu>
      </div>
    </div>
  </div>
</template>
