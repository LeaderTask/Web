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
      :data-placeholder="placeholderComment"
      @keydown="$emit('scrollToEnd')"
      @blur="changeComment($event)"
      @keydown.esc="changeComment($event)"
      @paste="onPasteComment($event)"
      v-html="commentHtmlText"
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
  emits: ['changeComment', 'scrollToEnd'],
  data: () => ({
    isEditable: false,
    currText: '',
    onPaste_StripFormatting_IEPaste: false
  }),
  computed: {
    commentHtmlText () {
      return this.comment.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br/>')
    },
    placeholderComment () {
      if (this.canEdit) return 'Добавить заметку...'
      return ''
    }

  },
  watch: {
    comment: {
      immediate: true,
      handler: function (val) {
        this.currText = val
      }
    }
  },
  methods: {
    onPasteComment (e) {
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
    /**
     * @param {Element} e
     * @returns {String}
     */
    editComment (e) {
      if (!this.canEdit) return
      if (this.isEditable) return
      this.isEditable = true
      this.$nextTick(function () {
        document.getElementById('taskPropsCommentEditor').focus()
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
        const sel = document.getElementById('taskPropsCommentEditor')
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
    changeComment (e) {
      if (!this.canEdit) return
      const text = this.getElementText(e.target)
      this.isEditable = false
      if (text === this.comment) return
      if (e?.key) {
        document.getElementById('taskPropsCommentEditor').blur()
      }
      //
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
