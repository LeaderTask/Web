<template>
  <div
    class="flex items-center justify-center text-[#4c4c4d] bg-[#f4f5f7] rounded-[8px] h-[36px] py-[2px] px-[5px]"
  >
    <svg
      class="cursor-pointer"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="addSubtask"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.53794 10.2883L8.53794 11.6972L9.9328 11.7113C10.102 11.7113 10.2853 11.7818 10.4263 11.9228C10.5532 12.0497 10.6378 12.2189 10.6378 12.4163C10.6378 12.5855 10.5532 12.7829 10.4263 12.9098C10.2994 13.0367 10.1302 13.1213 9.9328 13.1213L8.52384 13.1213L8.52384 14.5303C8.52384 14.6995 8.45334 14.8828 8.31234 15.0238C8.18544 15.1507 8.01624 15.2353 7.81884 15.2353C7.64964 15.2353 7.46634 15.1648 7.32534 15.0238C7.19844 14.8969 7.11384 14.7277 7.11384 14.5303L7.11384 13.0931L5.70488 13.0931C5.53568 13.0931 5.33828 13.0085 5.21138 12.8816C5.08448 12.7547 4.99988 12.5855 4.99988 12.3881C4.99988 12.2189 5.08448 12.0215 5.21138 11.8946C5.33828 11.7677 5.50748 11.6831 5.70488 11.6831L7.12794 11.6972L7.12794 10.2883C7.12794 10.1191 7.19844 9.93575 7.33944 9.79475C7.46634 9.66785 7.63554 9.58325 7.83294 9.58325C8.00214 9.58325 8.18544 9.65375 8.32644 9.79475C8.45334 9.92165 8.53794 10.0909 8.53794 10.2883ZM12.901 9.97327H21.3593C21.7444 9.97327 22.0782 10.2809 22.0782 10.6912V14.3165C22.0782 14.7267 21.7444 15.0344 21.3593 15.0344H12.901C12.4902 15.0344 12.1821 14.7011 12.1821 14.3165V10.6912C12.1821 10.2809 12.5159 9.97327 12.901 9.97327ZM13.5943 11.3834V13.5986H20.6403V11.3834H13.5943ZM15.8802 17.5358H26.1718C26.5569 17.5358 26.8907 17.8434 26.8907 18.2537V21.879C26.8907 22.2892 26.5569 22.5969 26.1718 22.5969H15.8802C15.4693 22.5969 15.1612 22.2636 15.1612 21.879V18.2537C15.1612 17.8434 15.495 17.5358 15.8802 17.5358ZM16.5734 18.9459V21.1611H25.4528V18.9459H16.5734ZM13.0112 19.6475H11.5998V17.8132C11.5998 17.423 11.2655 17.0849 10.8197 17.0849C10.4018 17.0849 10.0397 17.397 10.0397 17.8132V20.3497C10.0397 20.7399 10.374 21.078 10.8197 21.078H13.0112C13.4291 21.078 13.7913 20.7659 13.7913 20.3497C13.7913 19.9596 13.4569 19.6475 13.0112 19.6475Z"
        fill="currentColor"
      />
    </svg>

    <svg
      class="cursor-pointer"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="changeFocus"
    >
      <path
        d="M20.9577 8.66675H11.0423C10.744 8.66675 10.5 8.91906 10.5 9.22744V22.7727C10.5 23.0063 10.6446 23.2166 10.857 23.3007C10.9157 23.3241 10.979 23.3334 11.0423 23.3334C11.2004 23.3334 11.354 23.2587 11.458 23.1325L16 19.1818L20.542 23.1325C20.646 23.2587 20.7951 23.3334 20.9577 23.3334C21.021 23.3334 21.0843 23.3241 21.143 23.3007C21.3554 23.2213 21.5 23.0063 21.5 22.7727V9.22744C21.5 8.91906 21.256 8.66675 20.9577 8.66675ZM15.5843 17.9167L11.7031 21.3829V9.90633L20.2969 9.89828V21.3748L16.4157 17.9167C16.3118 17.7905 16.1627 17.7158 16 17.7158C15.8373 17.7158 15.6882 17.7905 15.5843 17.9167Z"
        fill="currentColor"
      />
    </svg>

    <!-- Task action popper -->
    <PopMenu
      placement="auto"
      @openMenu="openMenu"
      @closeMenu="closeMenu"
    >
      <svg
        class="cursor-pointer"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 11.875C16.7594 11.875 17.375 11.2594 17.375 10.5C17.375 9.74061 16.7594 9.125 16 9.125C15.2406 9.125 14.625 9.74061 14.625 10.5C14.625 11.2594 15.2406 11.875 16 11.875Z"
          fill="currentColor"
        />
        <path
          d="M16 17.375C16.7594 17.375 17.375 16.7594 17.375 16C17.375 15.2406 16.7594 14.625 16 14.625C15.2406 14.625 14.625 15.2406 14.625 16C14.625 16.7594 15.2406 17.375 16 17.375Z"
          fill="currentColor"
        />
        <path
          d="M16 22.875C16.7594 22.875 17.375 22.2594 17.375 21.5C17.375 20.7406 16.7594 20.125 16 20.125C15.2406 20.125 14.625 20.7406 14.625 21.5C14.625 22.2594 15.2406 22.875 16 22.875Z"
          fill="currentColor"
        />
      </svg>
      <template #menu>
        <PopMenuItem
          v-if="isMyTask && showTomorrow"
          icon="tomorrow"
          @click="tomorrow"
        >
          Завтра
        </PopMenuItem>
        <PopMenuItem
          icon="copy"
          @click="copyTaskName"
        >
          Копировать имя задачи
        </PopMenuItem>
        <PopMenuItem
          icon="copy"
          @click="copy"
        >
          Копировать
        </PopMenuItem>
        <PopMenuItem
          v-if="isMyTask"
          icon="cut"
          @click="cutTask"
        >
          Вырезать
        </PopMenuItem>
        <PopMenuItem
          v-if="canPaste"
          icon="copy"
          @click="paste"
        >
          Вставить
        </PopMenuItem>
        <PopMenuItem
          v-if="isMyTask"
          icon="delete"
          @click="deleteTask"
        >
          Удалить
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem
  },
  props: {
    isMyTask: {
      type: Boolean,
      default: false
    },
    canPaste: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'openMenu',
    'closeMenu',
    'addSubtask',
    'changeFocus',
    'tomorrow',
    'copy',
    'copyName',
    'cut',
    'paste',
    'delete'
  ],
  computed: {
    navStack () {
      return this.$store.state.navbar.navStack
    },
    showTomorrow () {
      let today = new Date()
      let navVal = new Date(this.navStack[0].typeVal)
      today.setHours(0, 0, 0, 0)
      navVal.setHours(0, 0, 0, 0)
      today = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear()
      navVal = navVal.getDate() + '-' + navVal.getMonth() + '-' + navVal.getFullYear()
      return today === navVal
    }
  },
  methods: {
    copyTaskName () {
      this.$emit('copyName')
    },
    copy () {
      this.$emit('copy')
    },
    addSubtask () {
      this.$emit('addSubtask')
    },
    changeFocus () {
      this.$emit('changeFocus')
    },
    openMenu () {
      this.$emit('openMenu')
    },
    closeMenu () {
      this.$emit('closeMenu')
    },
    tomorrow () {
      this.$emit('tomorrow')
    },
    cutTask () {
      this.$emit('cut')
    },
    paste () {
      this.$emit('paste')
    },
    deleteTask () {
      this.$emit('delete')
    }
  }
}
</script>

<style></style>
