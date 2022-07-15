<script>

import ImagePreloader from '@/components/CardProperties/ImagePreloader.vue'
import AudioPreloader from '@/components/CardProperties/AudioPreloader.vue'
import DocPreloader from '@/components/CardProperties/DocPreloader.vue'
import MoviePreloader from '@/components/CardProperties/MoviePreloader.vue'
import FilePreloader from '@/components/CardProperties/FilePreloader.vue'
import CardChatDeletedMessageContent from '@/components/CardProperties/CardChatDeletedMessageContent.vue'

export default {
  components: {
    ImagePreloader,
    AudioPreloader,
    DocPreloader,
    MoviePreloader,
    FilePreloader,
    CardChatDeletedMessageContent
  },

  props: {
    message: Object
  },

  emits: ['onQuoteMessage', 'onDeleteFile'],

  computed: {
    fileExtension () {
      const splittedValue = this.message.file_name.split('.')
      return splittedValue[splittedValue.length - 1].toLowerCase()
    },
    FileIsImage () { return ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif'].includes(this.fileExtension) },
    FileIsMovie () { return ['mov', 'mp4', 'wmv', 'avi', 'avchd', 'mkv', 'webm', 'mpeg-2'].includes(this.fileExtension) },
    FileIsDoc () { return ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf'].includes(this.fileExtension) },
    FileIsAudio () { return ['mp3', 'wav', 'm4a'].includes(this.fileExtension) }
  },
  methods: {
    setCurrentQuote () {
      this.$emit('onQuoteMessage', this.message)
    },

    deleteFile () {
      this.$emit('onDeleteFile', this.message.uid)
    },

    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },

    getMessageTimeString (dateCreate) {
      if (!dateCreate) return ''
      // добавляем Z в конец, чтобы он посчитал что это UTC время
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
    class="bg-[#F4F5F7] py-[10px] px-[12px] rounded-t-[12px] rounded-bl-[12px] mb-[5px] float-right relative max-w-[300px] group"
  >
    <card-chat-deleted-message-content v-if="message.deleted" />
    <image-preloader
      v-else-if="FileIsImage"
      :file-uid="message.uid"
      :file-extension="fileExtension"
      :file-name="message.file_name"
      :file-date-create="getMessageTimeString(message.date_create)"
      preloader-color="#F4F5F7"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <audio-preloader
      v-else-if="FileIsAudio"
      :file-uid="message.uid"
      :file-extension="fileExtension"
      :file-name="message.file_name"
      :file-date-create="getMessageTimeString(message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <doc-preloader
      v-else-if="FileIsDoc"
      :file-uid="message.uid"
      :file-name="message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(message.file_size)"
      :file-date-create="getMessageTimeString(message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <movie-preloader
      v-else-if="FileIsMovie"
      :file-uid="message.uid"
      :file-extension="fileExtension"
      :file-name="message.file_name"
      :file-size="formatBytes(message.file_size)"
      :file-date-create="getMessageTimeString(message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <file-preloader
      v-else
      :file-uid="message.uid"
      :file-extension="fileExtension"
      :file-name="message.file_name"
      :file-size="formatBytes(message.file_size)"
      :file-date-create="getMessageTimeString(message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
  </div>
</template>
