<template>
  <div
    class="messages"
  >
    <div
      v-for="(message, index) in messages"
      :key="message.uid"
      class="message"
    >
      <div
        v-if="
          showAllMessages ||
            index == messages.length - 1 ||
            index == messages.length - 2
        "
      >
        <!-- День недели -->
        <div
          v-if="isChangedDate(index)"
          class="text-center"
        >
          <p class="text-xs text-gray-500 dark:text-gray-300 my-3">
            {{ getMessageWeekDateString(message.date_create) }}
          </p>
        </div>
        <!-- Облачко с текстом -->
        <TaskPropsChatMessageText
          v-if="message.isMessage && !showOnlyFiles"
          :class="message.isMyMessage ? 'mr-2' : 'ml-2'"
          :is-my-message="message.isMyMessage"
          :deleted-status="message.deleted"
          :show-creator="isChangeCreator(index)"
          :show-loader="uploadStarted && message.loading"
          :quote="message.deleted ? '' : getMessageQuoteString(message.uid_quote)"
          :quote-user="message.deleted ? '' : getMessageQuoteUser(message.uid_quote)"
          :creator-name="employees[message.uid_creator]?.name ?? '???'"
          :message="message.msg"
          :time="getMessageTimeString(message.date_create)"
          @answer="answerMessage(message.uid)"
          @deleted="deleteTaskMsg(message.uid)"
        />

        <!-- Сообщение от инспектора -->
        <div>
          <div
            v-if="message.isInspectorMessage && !showOnlyFiles"
          >
            <div
              v-if="isChangeCreator(index)"
              class="flex"
            >
              <p class="name-chat-custom dark:text-gray-100">
                Инспектор
              </p>
            </div>
            <div class="flex flex-col w-full my-[10px]">
              <div
                class="text-[#4C4C4D] font-[400] text-[14px] leading-[19px] py-[12px] px-[15px]"
                style="border: 2px solid rgba(0, 0, 0, 0.12); border-radius: 14px 14px 14px 0px;"
              >
                <div
                  v-linkify:options="{ className: 'text-blue-600' }"
                  v-html="getInspectorMessage(message.type, (task.uid ? task : selectedTask)).replaceAll('\n', '<br/>')"
                />

                <div
                  v-if="message.date_create"
                  class="time-chat dark:text-gray-300"
                >
                  {{ getMessageTimeString(message.date_create) }}
                </div>
              </div>

              <!-- Origin message -->
              <div
                v-if="message.type == 1 && message.shouldShowInspectorButtons"
                class="flex space-x-[4px] mt-[10px]"
              >
                <div
                  class="flex items-center bg-[#F2F3F5] cursor-pointer py-[10px] px-[14px] rounded-[5px]"
                  @click="
                    answerInspectorMessage(message, 1, 'Да')
                  "
                >
                  <span class="text-sm text-gray-600"> Да </span>
                </div>
                <div
                  class="flex items-center bg-[#F2F3F5] cursor-pointer py-[10px] px-[14px] rounded-[5px]"
                  @click="
                    answerInspectorMessage(message, 0, 'Нет')
                  "
                >
                  <span class="text-sm text-gray-600"> Нет </span>
                </div>
              </div>

              <!-- Ignore message -->
              <div
                v-if="message.type == 2 && message.shouldShowInspectorButtons"
                class="flex mt-2"
              >
                <div
                  class="flex items-center bg-[#F2F3F5] cursor-pointer py-[10px] px-[14px] rounded-[5px]"
                  @click="
                    answerInspectorMessage(
                      message,
                      1,
                      'Вопросов нет - приступаю - будет готово ' +
                        dateToLabelFormat(new Date(task.customer_date_end ?? selectedTask.customer_date_end)) +
                        ' до ' +
                        dateToTimeFormat(new Date(task.customer_date_end ?? selectedTask.customer_date_end))
                    )
                  "
                >
                  <span class="text-sm text-gray-600">
                    Вопросов нет - приступаю - будет готово
                    {{
                      dateToLabelFormat(new Date(task.customer_date_end ?? selectedTask.customer_date_end))
                    }}
                    до
                    {{
                      dateToTimeFormat(new Date(task.customer_date_end ?? selectedTask.customer_date_end))
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- Файл -->
          <TaskPropsChatMessageFile
            v-if="message.isFile"
            :is-my-file="message.isMyMessage"
            :show-creator="isChangeCreator(index)"
            :creator-name="employees[message.uid_creator]?.name ?? '???'"
            :file-name="message.msg"
            :time="getMessageTimeString(message.date_create)"
            :quote="getFileQuoteString(message.uid_quote)"
            :quotefile="getFileQuoteString(message.uid_quote)"
            :quote-user="getMessageQuoteUser(message.uid_quote)"
            :size="formatBytes(message.file_size)"
            :file="message"
            @answer="answerMessage(message.uid)"
            @PasteEvent="PasteEvent($event)"
            @deleteFiles="deleteFiles(message.uid)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskPropsChatMessageText from '@/components/TaskProperties/TaskPropsChatMessageText.vue'
import TaskPropsChatMessageFile from '@/components/TaskProperties/TaskPropsChatMessageFile.vue'

import { getInspectorMessage } from '@/inspector/message'
import linkify from 'vue-linkify'

import * as INSPECTOR from '@/store/actions/inspector'

export default {
  directives: {
    linkify
  },
  components: {
    TaskPropsChatMessageText,
    TaskPropsChatMessageFile
  },
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    currentUserUid: {
      type: String,
      default: ''
    },
    deleted: {
      type: String,
      default: '1'
    },
    taskMessages: {
      type: Object,
      default: () => ({})
    },
    showAllMessages: {
      type: Boolean,
      default: true
    },
    showOnlyFiles: {
      type: Boolean,
      default: false
    }
  },
  emits: ['answerMessage', 'sendTaskMsg', 'deleteTaskMsg', 'deleteFiles', 'onPasteEvent', 'readTask'],
  data: () => {
    return {
      getInspectorMessage
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    employees () {
      return this.$store.state.employees.employees
    },
    // need for inspector messages
    selectedTask () {
      return this.$store.state.tasks.selectedTask
    },
    uploadStarted () {
      return this.$store.state.taskfilesandmessages.uploadStarted
    },
    messages () {
      return this.taskMessages.map((message) => ({
        ...message,
        isFile: !!message.uid_file,
        isMessage: !message.uid_file && message.uid_creator !== 'inspector',
        isInspectorMessage: message.uid_creator === 'inspector',
        isMyMessage: message.uid_creator === this.currentUserUid,
        shouldShowInspectorButtons: message?.performer_answer == null && ![1, 5, 7, 8].includes(this.task.status) && (this.selectedTask.uid_performer === this.currentUserUid)
      }))
    }
  },
  methods: {
    print (msg, val) {
      val ? console.log(msg, val) : console.log(msg)
    },
    readTask () {
      this.$emit('readTask')
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    isChangedDate (index) {
      if (index === 0) return true
      const messagePrev = this.messages[index - 1]
      const messageCurr = this.messages[index]
      if (!messagePrev || !messageCurr) return false
      return new Date(messagePrev.date_create).toDateString() !==
                new Date(messageCurr.date_create).toDateString()
    },
    isChangeCreator (index) {
      if (this.showAllMessages === true) {
        if (index === 0) return true
      } else {
        if (index === this.messages.length - 2) {
          return true
        } else if (index === 0) {
          return true
        }
      }
      const messagePrev = this.messages[index - 1]
      const messageCurr = this.messages[index]
      if (!messagePrev || !messageCurr) return false
      return messagePrev.uid_creator !== messageCurr.uid_creator
    },
    sendTaskMsg (msg) {
      this.$emit('sendTaskMsg', msg)
    },
    answerInspectorMessage (message, answerType, answer) {
      if (message.performer_answer === null) {
        this.$store
          .dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, {
            id: message.id,
            answer: answerType
          })
          .then(() => {
            message.performer_answer = answerType
            this.sendTaskMsg(answer)
          })
      }
      this.readTask()
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    dateToTimeFormat (date) {
      const hours = this.pad2(date.getHours())
      const seconds = this.pad2(date.getSeconds())
      return hours + ':' + seconds
    },
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      return day + ' ' + month
    },
    getMessageTimeString (dateCreate) {
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    getMessageWeekDateString (dateCreate) {
      const today = new Date()
      const date = new Date(dateCreate)
      let weekDay = date.toLocaleString('default', { weekday: 'long' })
      weekDay = weekDay.slice(0, 1).toUpperCase() + weekDay.slice(1)
      const dayNum = date.getDate()
      const day = (dayNum < 10 ? '0' : '') + dayNum
      const month = date.toLocaleString('default', { month: 'short' }).slice(0, 3)
      const year = (today.getFullYear() !== date.getFullYear()) ? date.getFullYear().toString() : ''
      return `${weekDay}, ${day} ${month} ${year}`
    },
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    getMessageQuoteString (uidQuote) {
      if (!uidQuote || uidQuote === '00000000-0000-0000-0000-000000000000') return ''
      const quotedMessage = this.messages.find(message => message.uid === uidQuote)
      if (!quotedMessage) return ''
      let msg = quotedMessage.msg.trim()
      msg = msg.replaceAll('&amp;', '&')
      msg = msg.replaceAll('&lt;', '<')
      msg = msg.replaceAll('&gt;', '>')
      return msg
    },
    getFileQuoteString (uidQuote) {
      if (!uidQuote || uidQuote === '00000000-0000-0000-0000-000000000000') return ''
      const quotedMessage = this.messages.find(message => message.uid === uidQuote)
      if (!quotedMessage) return ''
      return quotedMessage
    },
    getMessageQuoteUser (uidQuote) {
      if (!uidQuote || uidQuote === '00000000-0000-0000-0000-000000000000') return ''
      const quotedMessage = this.messages.find(message => message.uid === uidQuote)
      if (!quotedMessage) return ''
      return this.employees[quotedMessage.uid_creator]?.name ?? '???'
    },
    answerMessage (uid) {
      this.$emit('answerMessage', uid)
    },
    deleteTaskMsg (uid) {
      this.$emit('deleteTaskMsg', uid)
    },
    deleteFiles (uid) {
      this.$emit('deleteFiles', uid)
    },
    PasteEvent (e) {
      this.$emit('onPasteEvent', e)
    }
  }
}
</script>

<style scoped>
img,
video {
  max-height: 150px;
}
.name-chat-custom {
  font-size: 13px;
  color: #a6a6a6;
}
.chat-author-custom-right {
  text-align: right;
  float: right;
  /* width: 100%; */
  display: flex;
}
.chat-main {
  width: 100%;
  display: inline-block;
}
.msg-custom-chat-left {
  float: left;
  padding: 8px 10px;
  width: 80%;
  min-height: 40px;
  display: table-cell;
  max-width: 80%;
  min-width: 50%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.msg-custom-chat-right {
  float: right;
  padding: 8px 10px;
  min-height: 40px;
  display: table-cell;
  max-width: 80%;
  min-width: 50%;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.time-chat {
  text-align: right;
  font-size: 12px;
  color: #a8afca;
}
</style>
