<template>
  <div>
    <div class="flex flex-col gap-[12px]">
      <div
        v-for="check, index of arrChecklist"
        :key="index"
        class="group flex items-start gap-[10px] w-full"
      >
        <div
          class="flex-none"
          :class="{ 'cursor-pointer': canCheck }"
          @click="clickChecklist(index)"
        >
          <svg
            v-if="check.checked"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="20"
              height="20"
              rx="4"
              fill="#F4F5F7"
            />
            <path
              d="M15.6471 7.12003L9.30532 13.6361C8.83473 14.1213 8.07283 14.1213 7.60224 13.6361L4.35294 10.2625C3.88235 9.77728 3.88235 8.99166 4.35294 8.50642C4.82353 8.02118 5.58543 8.02118 6.05602 8.50642L8.45378 11.0019L13.944 5.36393C14.4146 4.87869 15.1765 4.87869 15.6471 5.36393C16.1176 5.84917 16.1176 6.63479 15.6471 7.12003Z"
              fill="#4C4C4D"
            />
            <rect
              x="0.5"
              y="0.5"
              width="19"
              height="19"
              rx="3.5"
              stroke="black"
              stroke-opacity="0.1"
            />
          </svg>
          <svg
            v-else
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="20"
              height="20"
              rx="4"
              fill="#F4F5F7"
            />
            <rect
              x="0.5"
              y="0.5"
              width="19"
              height="19"
              rx="3.5"
              stroke="black"
              stroke-opacity="0.1"
            />
          </svg>
        </div>
        <contenteditable
          v-model="check.text"
          tag="div"
          placeholder="Добавить"
          class="self-center w-full font-roboto font-medium text-[13px] leading-[15px]"
          :class="{ 'text-[#979799] line-through': check.checked, 'text-[#4c4c4d]': !check.checked }"
          :contenteditable="canEdit"
          :no-n-l="true"
          :no-h-t-m-l="true"
          @keydown.enter.prevent="$event.target.blur()"
          @blur="updateChecklist(index)"
        />
        <div
          v-if="canEdit"
          class="flex-none invisible group-hover:visible cursor-pointer"
          @click="removeChecklist(index)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.1798 10.0034L14.7632 6.42841C14.9201 6.27149 15.0082 6.05866 15.0082 5.83674C15.0082 5.61483 14.9201 5.402 14.7632 5.24508C14.6062 5.08816 14.3934 5 14.1715 5C13.9496 5 13.7368 5.08816 13.5798 5.24508L10.0048 8.82841L6.42983 5.24508C6.27291 5.08816 6.06008 5 5.83817 5C5.61625 5 5.40342 5.08816 5.2465 5.24508C5.08958 5.402 5.00142 5.61483 5.00142 5.83674C5.00142 6.05866 5.08958 6.27149 5.2465 6.42841L8.82983 10.0034L5.2465 13.5784C5.16839 13.6559 5.1064 13.748 5.06409 13.8496C5.02178 13.9511 5 14.0601 5 14.1701C5 14.2801 5.02178 14.389 5.06409 14.4906C5.1064 14.5921 5.16839 14.6843 5.2465 14.7617C5.32397 14.8399 5.41614 14.9018 5.51768 14.9442C5.61923 14.9865 5.72816 15.0082 5.83817 15.0082C5.94818 15.0082 6.0571 14.9865 6.15865 14.9442C6.2602 14.9018 6.35236 14.8399 6.42983 14.7617L10.0048 11.1784L13.5798 14.7617C13.6573 14.8399 13.7495 14.9018 13.851 14.9442C13.9526 14.9865 14.0615 15.0082 14.1715 15.0082C14.2815 15.0082 14.3904 14.9865 14.492 14.9442C14.5935 14.9018 14.6857 14.8399 14.7632 14.7617C14.8413 14.6843 14.9033 14.5921 14.9456 14.4906C14.9879 14.389 15.0097 14.2801 15.0097 14.1701C15.0097 14.0601 14.9879 13.9511 14.9456 13.8496C14.9033 13.748 14.8413 13.6559 14.7632 13.5784L11.1798 10.0034Z"
              fill="#7E7E80"
            />
          </svg>
        </div>
      </div>
      <div
        v-if="addNewNow"
        class="flex items-start gap-[10px] w-full"
      >
        <div class="flex-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="20"
              height="20"
              rx="4"
              fill="#F4F5F7"
            />
            <rect
              x="0.5"
              y="0.5"
              width="19"
              height="19"
              rx="3.5"
              stroke="black"
              stroke-opacity="0.1"
            />
          </svg>
        </div>
        <contenteditable
          id="addNewCheckListEdit"
          v-model="addNewText"
          tag="div"
          placeholder="Добавить"
          class="self-center w-full font-roboto font-medium text-[13px] leading-[15px] text-[#4c4c4d]"
          :contenteditable="true"
          :no-n-l="true"
          :no-h-t-m-l="true"
          @keydown.enter.prevent="addChecklist(true)"
          @blur="addChecklist(false)"
        />
      </div>
    </div>
    <button
      v-if="canEdit && !addNewNow"
      class="mt-[12px] flex items-center gap-[10px] cursor-pointer w-full"
      @click="needAddChecklist"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8352 9.17286L10.8411 4.11116C10.8411 3.88924 10.7529 3.67641 10.596 3.51949C10.4391 3.36257 10.2262 3.27441 10.0043 3.27441C9.78241 3.27441 9.56958 3.36257 9.41266 3.51949C9.25574 3.67641 9.16758 3.88924 9.16758 4.11116L9.17347 9.17286L4.11177 9.16697C3.88985 9.16697 3.67702 9.25513 3.5201 9.41205C3.36318 9.56897 3.27502 9.7818 3.27502 10.0037C3.27502 10.2256 3.36318 10.4385 3.5201 10.5954C3.67702 10.7523 3.88985 10.8405 4.11177 10.8405L9.17347 10.8346L9.16758 15.8963C9.16713 16.0063 9.18847 16.1153 9.23036 16.217C9.27225 16.3187 9.33386 16.4112 9.41165 16.4889C9.48944 16.5667 9.58186 16.6284 9.68358 16.6702C9.78531 16.7121 9.89432 16.7335 10.0043 16.733C10.1143 16.7335 10.2233 16.7121 10.3251 16.6702C10.4268 16.6284 10.5192 16.5667 10.597 16.4889C10.6748 16.4112 10.7364 16.3187 10.7783 16.217C10.8202 16.1153 10.8415 16.0063 10.8411 15.8963L10.8352 10.8346L15.8969 10.8405C16.0069 10.8409 16.1159 10.8196 16.2176 10.7777C16.3193 10.7358 16.4118 10.6742 16.4896 10.5964C16.5673 10.5186 16.629 10.4262 16.6709 10.3245C16.7127 10.2227 16.7341 10.1137 16.7336 10.0037C16.7341 9.8937 16.7127 9.78469 16.6709 9.68297C16.629 9.58125 16.5673 9.48883 16.4896 9.41104C16.4118 9.33325 16.3193 9.27164 16.2176 9.22974C16.1159 9.18785 16.0069 9.16652 15.8969 9.16697L10.8352 9.17286Z"
          fill="#7E7E80"
        />
      </svg>
      <div class="font-roboto font-medium text-[13px] leading-[15px] text-[#7e7e80]">
        Добавить
      </div>
    </button>
  </div>
</template>

<script>
import contenteditable from 'vue-contenteditable'

export default {
  components: {
    contenteditable
  },
  props: {
    checklist: {
      type: String,
      default: ''
    },
    addNew: {
      type: Boolean,
      default: false
    },
    canCheck: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeChecklist', 'endEdit'],
  data () {
    return {
      arrChecklist: [],
      addNewNow: false,
      addNewText: ''
    }
  },
  computed: {

  },
  watch: {
    checklist: {
      immediate: true,
      handler: function (val) {
        this.arrChecklist = []
        if (val) {
          // нормализуем перенос строки (разные на windows и на mac)
          const chlist = val.replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '\r\n')
          for (const check of chlist.split('\r\n\r\n')) {
            const checkValues = check.split('\r\n')
            this.arrChecklist.push({ checked: !!+checkValues[0], text: checkValues[1] })
          }
        }
      }
    },
    addNew: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.needAddChecklist()
        }
      }
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    removeChecklist (index) {
      if (!this.canEdit) return
      //
      this.arrChecklist.splice(index, 1)
      this.saveChanges()
    },
    clickChecklist (index) {
      if (!this.canCheck) return
      //
      const check = this.arrChecklist[index]
      check.checked = !check.checked
      this.saveChanges()
    },
    needAddChecklist () {
      if (this.addNewNow) return
      if (!this.canEdit) return
      //
      this.addNewText = ''
      this.addNewNow = true
      this.$nextTick(function () {
        const addEdit = document.getElementById('addNewCheckListEdit')
        if (addEdit) addEdit.focus({ preventScroll: false })
      })
    },
    addChecklist (needAddNew) {
      this.addNewNow = false
      this.$emit('endEdit')
      const text = this.addNewText.trim()
      if (text && this.canEdit) {
        this.arrChecklist.push({ checked: false, text: text })
        this.saveChanges()
        if (needAddNew) this.needAddChecklist()
      }
    },
    updateChecklist (index) {
      if (!this.canEdit) return
      //
      const check = this.arrChecklist[index]
      const text = check.text.trim()
      if (text) {
        check.text = text
        this.saveChanges()
      } else {
        this.removeChecklist(index)
      }
    },
    saveChanges () {
      let checklist = ''
      this.arrChecklist.forEach(check => {
        if (check.text) {
          if (checklist) checklist += '\r\n\r\n'
          checklist += check.checked ? '1\r\n' : '0\r\n'
          checklist += check.text
        }
      })
      this.$emit('changeChecklist', checklist)
    }
  }
}
</script>

<style scoped>

</style>
