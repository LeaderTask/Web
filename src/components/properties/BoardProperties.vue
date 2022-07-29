<template>
  <div>
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить доску"
      :text="`Вы действительно хотите удалить доску ${selectedBoardName}?`"
      @cancel="showConfirm = false"
      @yes="removeBoard"
    />
    <ModalBoxDelete
      v-if="showConfirmQuit"
      title="Покинуть доску"
      :text="`Вы действительно хотите покинуть доску ${selectedBoardName}? Обратно можно попасть, только если владелец доски опять вас добавит.`"
      @cancel="showConfirmQuit = false"
      @yes="quitBoard"
    />
    <div class="flex justify-between items-center">
      <PopMenu>
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem @click="copyLinkToBoard">
            Копировать ссылку на доску
          </PopMenuItem>
          <PopMenuItem
            v-if="isCanDelete"
            icon="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
          <PopMenuItem
            v-else
            icon="delete"
            @click="showConfirmQuit = true"
          >
            Покинуть доску
          </PopMenuItem>
        </template>
      </PopMenu>
      <PropsButtonClose @click="closeProperties" />
    </div>
    <input
      v-if="isCanEdit"
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[25px] p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeBoardName"
    >
    <div
      v-else
      class="mt-[25px] w-full font-roboto font-bold font-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ currName }}
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :class="{ 'cursor-pointer': isCanEdit }"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeBoardColor"
        />
      </div>
    </div>
    <div
      class="mt-[30px] mb-[8px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Доступ
    </div>
    <PopMenu
      v-if="isCanEdit && usersCanAddToAccess.length"
      class="w-full"
    >
      <div
        class="w-full h-[34px] gap-[5px] flex items-center text-[#4c4c4d] hover:text-[#4c4c4d]/75 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.66824 7.3379L8.67295 3.28854C8.67295 3.111 8.60243 2.94074 8.47689 2.8152C8.35135 2.68967 8.18109 2.61914 8.00356 2.61914C7.82602 2.61914 7.65576 2.68967 7.53022 2.8152C7.40469 2.94074 7.33416 3.111 7.33416 3.28853L7.33888 7.3379L3.28951 7.33319C3.11198 7.33319 2.94171 7.40371 2.81618 7.52925C2.69064 7.65478 2.62012 7.82505 2.62012 8.00258C2.62012 8.18011 2.69064 8.35038 2.81618 8.47591C2.94171 8.60145 3.11198 8.67197 3.28951 8.67197L7.33888 8.66726L7.33416 12.7166C7.3338 12.8046 7.35087 12.8918 7.38438 12.9732C7.41789 13.0546 7.46719 13.1285 7.52942 13.1908C7.59165 13.253 7.66559 13.3023 7.74696 13.3358C7.82834 13.3693 7.91555 13.3864 8.00356 13.386C8.09156 13.3864 8.17877 13.3693 8.26015 13.3358C8.34153 13.3023 8.41546 13.253 8.47769 13.1908C8.53993 13.1285 8.58922 13.0546 8.62273 12.9732C8.65624 12.8918 8.67331 12.8046 8.67295 12.7166L8.66824 8.66726L12.7176 8.67197C12.8056 8.67233 12.8928 8.65527 12.9742 8.62176C13.0556 8.58824 13.1295 8.53895 13.1917 8.47672C13.254 8.41449 13.3033 8.34055 13.3368 8.25917C13.3703 8.17779 13.3874 8.09059 13.387 8.00258C13.3874 7.91457 13.3703 7.82736 13.3368 7.74599C13.3033 7.66461 13.254 7.59067 13.1917 7.52844C13.1295 7.46621 13.0556 7.41692 12.9742 7.3834C12.8928 7.34989 12.8056 7.33283 12.7176 7.33319L8.66824 7.3379Z"
            fill="currentColor"
          />
        </svg>

        <div
          class="font-roboto text-[13px] leading-[15px] font-medium"
        >
          Добавить сотрудника
        </div>
      </div>
      <template #menu>
        <div class="max-h-[220px] overflow-y-auto w-[220px] scroll-style">
          <BoardPropsMenuItemUser
            v-for="user in usersCanAddToAccess"
            :key="user.email"
            :user-email="user.email"
            @click="addBoardMember(user.uid)"
          />
        </div>
      </template>
    </PopMenu>
    <BoardPropsUserButton
      class="mt-[8px]"
      :user-email="selectedBoardCreatorEmail"
      status="Владелец"
      disabled
    />
    <BoardPropsUserButton
      v-for="user in usersBoard"
      :key="user.email"
      :user-email="user.email"
      :status="user.status"
      :disabled="!isCanEdit"
      @delete="deleteMember(user.uid)"
      @admin="setMemberStatus(user.uid, 1)"
      @reader="setMemberStatus(user.uid, 0)"
      @writer="setMemberStatus(user.uid, 2)"
    />
  </div>
</template>

<script>
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PropsColorBoxItem from '@/components/Common/PropsColorBoxItem.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'
import BoardPropsUserButton from '@/components/Board/BoardPropsUserButton.vue'
import BoardPropsMenuItemUser from '@/components/Board/BoardPropsMenuItemUser.vue'

import * as BOARD from '@/store/actions/boards'
import { NAVIGATOR_REMOVE_BOARD } from '@/store/actions/navigator'
import { copyText } from 'vue3-clipboard'

export default {
  components: {
    ModalBoxDelete,
    PropsColorBoxItem,
    PopMenu,
    PopMenuItem,
    PropsButtonMenu,
    PropsButtonClose,
    BoardPropsUserButton,
    BoardPropsMenuItemUser
  },
  data () {
    return {
      showConfirm: false,
      showConfirmQuit: false,
      currName: ''
    }
  },
  computed: {
    defaultColors () {
      const allColors = [
        '',
        '#7fc870',
        '#69c494',
        '#dff2e1',
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
        '#e5e5e5',
        '#ddd1c2',
        '#ef7665',
        '#ffc6b5',
        '#ff8ed4',
        '#f5dbf5',
        '#6a7077',
        '#f6dd29',
        '#f5f547'
      ]
      // добавляем в конец выбранный цвет если его тут нет
      const usedColor = this.selectedBoardColor.toLowerCase()
      if (!allColors.includes(usedColor)) {
        allColors.splice(allColors.length - 1, 1, usedColor)
      }
      const colors = allColors.map((color) => ({
        color: color,
        selected: color === usedColor
      }))
      // разбираем на ряды по 9
      const rowLength = 9
      const arrColors = []
      while (colors.length) arrColors.push(colors.splice(0, rowLength))
      return arrColors
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    selectedBoard () {
      return this.$store.state.boards.selectedBoard
    },
    selectedBoardUid () {
      return this.selectedBoard?.uid || ''
    },
    selectedBoardName () {
      return this.selectedBoard?.name || ''
    },
    selectedBoardCreatorEmail () {
      return this.selectedBoard?.email_creator || ''
    },
    selectedBoardColor () {
      const backColor = this.selectedBoard?.color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedBoardCreatorEmail === user.current_user_email
    },
    isCanEdit () {
      // могу менять доску если она моя или я есть в админах
      return this.selectedBoard?.type_access === 1
    },
    usersBoard () {
      const statuses = ['Читатель', 'Администратор', 'Редактор']
      const users = []
      const employees = this.$store.state.employees.employees
      const members = this.selectedBoard?.members || {}
      for (const userUid in members) {
        const emp = employees[userUid]
        if (emp && emp?.email !== this.selectedBoardCreatorEmail) {
          users.push({
            uid: userUid,
            email: emp?.email,
            status: statuses[members[userUid]]
          })
        }
      }
      return users
    },
    usersCanAddToAccess () {
      const users = []
      const employees = Object.values(this.$store.state.employees.employees)
      const members = this.selectedBoard?.members || {}
      for (const emp of employees) {
        if (members[emp.uid] === undefined) {
          users.push({
            uid: emp.uid,
            email: emp.email
          })
        }
      }
      return users
    }
  },
  watch: {
    selectedBoardName: {
      immediate: true,
      handler: function (val) {
        this.currName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    removeBoard () {
      this.showConfirm = false

      this.$store
        .dispatch(BOARD.REMOVE_BOARD_REQUEST, this.selectedBoardUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_BOARD, this.selectedBoard)
          // выходим выше на один уровень навигации (надеемся что эта доска последняя в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    quitBoard () {
      this.showConfirmQuit = false

      this.$store.dispatch(BOARD.QUIT_BOARD_REQUEST, {
        uid: this.selectedBoardUid,
        uid_user: this.$store.state.user.user.current_user_uid
      })
        .then((resp) => {
          console.log('quitBoard', resp)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_BOARD, this.selectedBoard)
          // выходим выше на один уровень навигации (надеемся что эта доска последняя в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeBoardName () {
      const title = this.currName.trim()
      if (this.isCanEdit && title && this.selectedBoardName !== title) {
        this.selectedBoard.name = title
        this.$store
          .dispatch(BOARD.CHANGE_BOARD_NAME, {
            boardUid: this.selectedBoardUid,
            newBoardTitle: title
          })
          .then((resp) => {
            console.log('changeBoardName', resp, title)
          })
      }
    },
    changeBoardColor (color) {
      if (this.isCanEdit && this.selectedBoardColor.toLowerCase() !== color) {
        this.selectedBoard.color = color || '#A998B6'
        const data = {
          boardUid: this.selectedBoardUid,
          newBoardColor: color || '#A998B6'
        }
        this.$store.dispatch(BOARD.CHANGE_BOARD_COLOR, data).then((resp) => {
          console.log('changeBoardColor', resp, color)
        })
      }
    },
    addBoardMember (userUId) {
      if (
        this.isCanEdit &&
        this.selectedBoard?.members &&
        this.selectedBoard?.members[userUId] === undefined
      ) {
        const users = { ...this.selectedBoard.members }
        users[userUId] = 0
        this.selectedBoard.members = users
        const data = {
          boardUid: this.selectedBoardUid,
          newBoardMembers: users
        }
        this.$store.dispatch(BOARD.CHANGE_BOARD_MEMBERS, data).then((resp) => {
          console.log('changeBoardMembers', resp, users)
        })
      }
    },
    deleteMember (userUId) {
      if (
        this.isCanEdit &&
        this.selectedBoard?.members &&
        this.selectedBoard?.members[userUId] !== undefined
      ) {
        const users = { ...this.selectedBoard.members }
        delete users[userUId]
        this.selectedBoard.members = users
        const data = {
          boardUid: this.selectedBoardUid,
          newBoardMembers: users
        }
        this.$store.dispatch(BOARD.CHANGE_BOARD_MEMBERS, data).then((resp) => {
          console.log('changeBoardMembers', resp, users)
        })
      }
    },
    setMemberStatus (userUId, status) {
      console.log(this.selectedBoard?.members[userUId], status)
      if (
        this.isCanEdit &&
        this.selectedBoard?.members &&
        this.selectedBoard?.members[userUId] !== undefined &&
        this.selectedBoard?.members[userUId] !== status
      ) {
        const users = { ...this.selectedBoard.members }
        users[userUId] = status
        this.selectedBoard.members = users
        const data = {
          boardUid: this.selectedBoardUid,
          newBoardMembers: users
        }
        this.$store.dispatch(BOARD.CHANGE_BOARD_MEMBERS, data).then((resp) => {
          console.log('changeBoardMembers', resp, users)
        })
      }
    },
    copyLinkToBoard () {
      copyText(
        `${window.location.origin}/board/${this.selectedBoardUid}`,
        undefined,
        (error, event) => {
          if (error) {
            console.log('copyLinkToBoard error', error)
          } else {
            console.log('copyLinkToBoard', event)
          }
        }
      )
    }
  }
}
</script>

<style scoped></style>
