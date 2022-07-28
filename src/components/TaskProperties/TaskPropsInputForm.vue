<template>
  <img
    v-if="isloading"
    src="/ajaxloader.gif"
  >
  <div class="w-full mt-[40px]">
    <div class="mx-auto max-w-[520px]">
      <card-message-input
        v-model="taskMsg"
        :can-add-files="true"
        @createCardMessage="sendTaskMsg"
        @createCardFile="createTaskFile($event)"
      />
    </div>
  </div>
</template>
<script>
import * as INSPECTOR from '@/store/actions/inspector.js'
import * as TASK from '@/store/actions/tasks.js'
import * as FILES from '@/store/actions/taskfiles.js'
import * as MSG from '@/store/actions/taskmessages'
import CardMessageInput from '@/components/CardProperties/CardMessageInput'

export default {
  components: { CardMessageInput },
  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['readTask'],
  data: () => ({
    isloading: false,
    files: [],
    taskMsg: ''
  }),
  computed: {
    user () {
      return this.$store.state.user.user
    },
    selectedTask () {
      return this.$store.state.tasks.selectedTask
    },
    cusers () {
      return this.$store.state.user.user
    },
    taskMessagesAndFiles () {
      return this.$store.state.taskfilesandmessages.messages
    }
  },
  watch: {
    task (newval, oldval) {
      this.taskMsg = ''
    }
  },
  methods: {
    readTask () {
      this.$emit('readTask')
    },
    pad2: function (n) {
      return (n < 10 ? '0' : '') + n
    },
    uuidv4: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    _linkify: function (text) {
      return text.replace(/(lt?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    },
    onPasteEvent: function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_task: this.task.uid,
            name: formData
          }
          this.isloading = true
          this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data)
            .then((resp) => {
              this.isloading = false
              if (this.task.type === 2 || this.task.uid.type === 3) {
                if ([1, 5, 7, 8].includes(this.task.status)) {
                  this.selectedTask.status = 9
                }
              }
            })
        }
      }
    },
    sendTaskMsg: function (msg) {
      let msgtask = msg || this.taskMsg
      console.log('msgtask', msgtask, msg, this.taskMsg)
      msgtask = this.taskMsg.trim()
      msgtask = this.taskMsg.replaceAll('&', '&amp;')
      msgtask = this.taskMsg.replaceAll('<', '&lt;')
      msgtask = this.taskMsg.replaceAll('>', '&gt;')
      const uid = this.uuidv4()
      const data = {
        uid_task: this.selectedTask.uid,
        uid_creator: this.cusers.current_user_uid,
        uid: uid,
        uid_msg: uid,
        date_create: new Date().toISOString(),
        deleted: 0,
        uid_quote: this.currentAnswerMessageUid,
        text: msgtask,
        msg: msgtask
      }
      this.$store.dispatch(MSG.CREATE_MESSAGE_REQUEST, data).then(
        resp => {
          // Answer last inspector message
          const lastInspectorMessage = this.taskMessagesAndFiles.slice().reverse().find(message => message.uid_creator === 'inspector')
          if (lastInspectorMessage && this.selectedTask.uid_performer === this.cusers.current_user_uid) {
            this.$store.dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, { id: lastInspectorMessage.id, answer: 1 }).then(() => {
              lastInspectorMessage.performer_answer = 1
            })
          }

          this.selectedTask.has_msgs = true
          if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
            if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
              if (((this.selectedTask.uid_customer === this.cusers.current_user_uid) && ((this.selectedTask.status === 1) || (this.selectedTask.status === 5)))) {
                this.selectedTask.status = 9
              }
            }
          }
          this.selectedTask.msg = decodeURIComponent(this.taskMsg)
        })
      this.currentAnswerMessageUid = ''
      this.taskMsg = ''
      this.readTask()
    },
    createTaskMsg: function () {
      const date = new Date()
      const month = this.pad2(date.getUTCMonth() + 1)
      const day = this.pad2(date.getUTCDate())
      const year = this.pad2(date.getUTCFullYear())
      const hours = this.pad2(date.getUTCHours())
      const minutes = this.pad2(date.getUTCMinutes())
      const seconds = this.pad2(date.getUTCSeconds())
      const dateCreate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
      const uid = this.uuidv4()

      const data = {
        uid_task: this.task.uid,
        uid_creator: this.user.current_user_uid,
        uid: uid,
        uid_msg: uid,
        date_create: dateCreate,
        text: this.taskMsg,
        msg: this.taskMsg
      }

      this.$store.dispatch(MSG.CREATE_MESSAGE_REQUEST, data)
        .then((resp) => {
          this.$store.commit(TASK.HAS_MSGS, this.task.uid, true)
          if (this.task.type === 2 || this.task.type === 3) {
            if ([1, 5, 7, 8].includes(this.task.status)) {
              this.selectedTask.status = 9
            }
          }
          this.$store.commit(TASK.MSG_EQUAL, this.task, decodeURIComponent(this.taskMsg))
          this.infoComplete = true
        })
      this.taskMsg = ''
    },
    createTaskFile (event) {
      this.files = event.target.files ? event.target.files : event.dataTransfer.files
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        uid_task: this.task.uid,
        name: formData
      }

      for (const formItem of formData) {
        this.$store.commit(
          'createLoadingFile',
          {
            msg: formItem[1].name,
            uid_creator: this.user.current_user_uid,
            date_create: new Date().toISOString(),
            file_size: formItem[1].size
          })
      }

      this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data)
        .then((resp) => {
          if (this.task.type === 2 || this.task.type === 3) {
            if ([1, 5, 7, 8].includes(this.task.status)) {
              this.selectedTask.status = 9
            }
          }
          this.selectedTask.has_files = true
          if (this.task.uid_customer === this.user.current_user_uid && (this.task.status === 5 || this.task.status === 7)) {
            this.selectedTask.status = 9
          }
        })
      this.infoComplete = true
      this.$store.commit(FILES.REFRESH_FILES)
    }
  }
}
</script>
