<template>
  <div
    class="description-content"
    @click.stop="editComment"
  >
    <div
      id="taskPropsCommentEditor"
      v-linkify:options="{ className: 'text-blue-600' }"
      class="font-[400] text-[14px] leading-[21px] text-[#4C4C4D]"
      :contenteditable="isEditable"
      :data-placeholder="placeholderComment()"
      @blur="changeComment($event)"
      @keyup="changeComment($event)"
      @focusout="removeEditComment($event)"
      @paste="OnPaste_StripFormatting(this, $event);"
      v-html="getFixedCommentText()"
    />
  </div>
</template>

<script>
import linkify from 'vue-linkify'

export default {
  directives: {
    linkify
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    comment: {
      type: String,
      default: ''
    }
  },
  emits: ['changeComment', 'endChangeComment'],
  data: () => ({
    isEditable: false,
    currText: '',
    onPaste_StripFormatting_IEPaste: false
  }),
  watch: {
    comment: {
      immediate: true,
      handler: function (val) {
        this.currText = val
      }
    }
  },
  methods: {
    OnPaste_StripFormatting (elem, e) {
      let text = ''
      if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
        e.preventDefault()
        text = e.originalEvent.clipboardData.getData('text/plain')
        window.document.execCommand('insertText', false, text)
      } else if (e.clipboardData && e.clipboardData.getData) {
        e.preventDefault()
        text = e.clipboardData.getData('text/plain')
        window.document.execCommand('insertText', false, text)
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!this.onPaste_StripFormatting_IEPaste) {
          this.onPaste_StripFormatting_IEPaste = true
          e.preventDefault()
          window.document.execCommand('ms-pasteTextOnly', false)
        }
        this.onPaste_StripFormatting_IEPaste = false
      }
    },
    getFixedCommentText () {
      return this.comment.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br/>')
    },
    placeholderComment () {
      if (this.canEdit) return 'Добавить заметку...'
      return ''
    },
    editComment () {
      if (!this.canEdit) return
      if (this.isEditable) return
      this.isEditable = true
      this.$nextTick(function () {
        const commentEditor = document.getElementById('taskPropsCommentEditor')
        commentEditor.focus({ preventScroll: false })
        const range = document.createRange()
        // condition for removing console errors
        if (this.comment.length !== 0) {
          range.setStart(commentEditor, 1)
          range.setEnd(commentEditor, 1)
        } else {
          range.setStart(commentEditor, 0)
        }
        const sel = document.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      })
    },
    /**
     * @param {Element} el
     * @returns {String}
     */
    getElementText (el) {
      // пытаемся достать текст из едита браузера
      // в котором сейчас идет ввод через Selection
      if (typeof window.getSelection !== 'undefined') {
        const sel = window.getSelection()
        // condition for removing console errors
        if (sel && sel.rangeCount > 0) {
          const tempRange = sel.getRangeAt(0)
          sel.removeAllRanges()
          const range = document.createRange()
          range.selectNodeContents(el)
          sel.addRange(range)
          const text = sel.toString()
          sel.removeAllRanges()
          sel.addRange(tempRange)
          return text.trim()
        }
      }
      return el.innerText.trim()
    },

    removeEditComment (e) {
      if (!this.canEdit) return
      this.isEditable = false
      // чтобы у нас в интерфейсе поменялось
      // потому что на changeComment он только
      // на сервер отправляет и всё
      this.$emit('endChangeComment', this.currText)
    },
    changeComment (e) {
      if (!this.canEdit) return
      const text = this.getElementText(e.target)
      if (text === this.currText) return
      this.currText = text
      this.$emit('changeComment', text)
    }
  }
}
</script>

<style scoped>
h2{
  font-size: 10px;
}

.description-content {
  width: 100%;
  font-size: 14px;
  padding-right: 5px;
  min-height: 100px;
  display: inline-block;
}
.description-content div:empty:before {
  content: attr(data-placeholder);
  color: gray;
}
</style>
