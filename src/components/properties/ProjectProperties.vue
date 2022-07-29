<template>
  <div>
    <TaskPropsAccessLimitModalBox
      v-if="showAccessLimit"
      @cancel="showAccessLimit = false"
      @ok="showAccessLimit = false"
    />
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить проект"
      :text="`Вы действительно хотите удалить проект ${selectedProjectName}?`"
      @cancel="showConfirm = false"
      @yes="removeProject"
    />
    <ModalBoxDelete
      v-if="showConfirmQuit"
      title="Покинуть проект"
      :text="`Вы действительно хотите покинуть проект ${selectedProjectName}? Обратно можно попасть, только если владелец проекта опять вас добавит.`"
      @cancel="showConfirmQuit = false"
      @yes="quitProject"
    />
    <div class="flex justify-between items-center">
      <PopMenu>
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem @click="copyLinkToProject">
            Копировать ссылку на проект
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
            Покинуть проект
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
      @blur="changeProjectName"
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
          @select="changeProjectColor"
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
          <ProjectPropsMenuItemUser
            v-for="user in usersCanAddToAccess"
            :key="user.email"
            :user-email="user.email"
            @click="addProjectMember(user.email)"
          />
        </div>
      </template>
    </PopMenu>
    <ProjectPropsUserButton
      class="mt-[8px]"
      :user-email="selectedProjectCreatorEmail"
      status="Владелец"
      disabled
    />
    <ProjectPropsUserButton
      v-for="user in usersBoard"
      :key="user.email"
      :user-email="user.email"
      :disabled="!isCanEdit"
      @delete="deleteMember(user.email)"
    />
  </div>
</template>

<script>
import ProjectPropsUserButton from '@/components/Projects/ProjectPropsUserButton.vue'
import ProjectPropsMenuItemUser from '@/components/Projects/ProjectPropsMenuItemUser.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PropsColorBoxItem from '@/components/Common/PropsColorBoxItem.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'
import TaskPropsAccessLimitModalBox from '@/components/properties/TaskPropsAccessLimitModalBox.vue'

import * as PROJECT from '@/store/actions/projects'
import { NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'
import { copyText } from 'vue3-clipboard'

export default {
  components: {
    ModalBoxDelete,
    TaskPropsAccessLimitModalBox,
    ProjectPropsUserButton,
    ProjectPropsMenuItemUser,
    PropsColorBoxItem,
    PopMenu,
    PopMenuItem,
    PropsButtonClose,
    PropsButtonMenu
  },
  data () {
    return {
      showConfirm: false,
      showAccessLimit: false,
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
      const usedColor = this.selectedProjectColor.toLowerCase()
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
    selectedProject () {
      return this.$store.state.projects.selectedProject
    },
    selectedProjectUid () {
      return this.selectedProject?.uid || ''
    },
    selectedProjectName () {
      return this.selectedProject?.name || ''
    },
    selectedProjectCreatorEmail () {
      return this.selectedProject?.email_creator || ''
    },
    selectedProjectColor () {
      const backColor = this.selectedProject?.color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedProjectCreatorEmail === user.current_user_email
    },
    isCanEdit () {
      return this.isCanDelete
    },
    usersBoard () {
      const users = []
      const members = this.selectedProject?.members || []
      for (const userEmail of members) {
        const emp = this.employeesByEmail[userEmail.toLowerCase()]
        if (emp && emp?.email !== this.selectedProjectCreatorEmail) {
          users.push({
            uid: emp?.uid,
            email: emp?.email
          })
        }
      }
      return users
    },
    selectedProjectMembers () {
      return this.selectedProject?.members.reduce((acc, userEmail) => {
        acc[userEmail.toLowerCase()] = userEmail
        return acc
      }, {}) || {}
    },
    usersCanAddToAccess () {
      const users = []
      const employees = Object.values(this.$store.state.employees.employees)
      for (const emp of employees) {
        if (this.selectedProjectMembers[emp.email.toLowerCase()] === undefined) {
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
    selectedProjectName: {
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
    removeProject () {
      this.showConfirm = false

      this.$store
        .dispatch(PROJECT.REMOVE_PROJECT_REQUEST, this.selectedProjectUid)
        .then((resp) => {
          console.log('removeProject', resp)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.selectedProject)
          // выходим выше на один уровень навигации (надеемся что этот проект последний в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    quitProject () {
      this.showConfirmQuit = false

      this.$store.dispatch(PROJECT.QUIT_PROJECT_REQUEST, {
        uid: this.selectedProjectUid,
        value: this.$store.state.user.user.current_user_email
      })
        .then((resp) => {
          console.log('quitProject', resp)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.selectedProject)
          // выходим выше на один уровень навигации (надеемся что этот проект последний в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeProjectName () {
      const title = this.currName.trim()
      if (this.isCanEdit && title && this.selectedProjectName !== title) {
        this.selectedProject.name = title
        this.$store
          .dispatch(PROJECT.CHANGE_PROJECT_NAME, {
            projectUid: this.selectedProjectUid,
            newProjectTitle: title
          })
          .then((resp) => {
            console.log('changeProjectName', resp, title)
          })
      }
    },
    changeProjectColor (color) {
      if (this.isCanEdit && this.selectedProjectColor.toLowerCase() !== color) {
        this.selectedProject.color = color || '#A998B6'
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectColor: color || '#A998B6'
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_COLOR, data).then((resp) => {
          console.log('changeProjectColor', resp, color)
        })
      }
    },
    addProjectMember (userEmail) {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (user.days_left <= 0) {
        this.showAccessLimit = true
        return
      }
      if (
        this.isCanEdit &&
        this.selectedProjectMembers[userEmail.toLowerCase()] === undefined
      ) {
        const users = [...this.selectedProject.members]
        users.push(userEmail)
        this.selectedProject.members = users
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    },
    deleteMember (userEmail) {
      if (
        this.isCanEdit &&
        this.selectedProjectMembers[userEmail.toLowerCase()] !== undefined
      ) {
        const users = this.selectedProject.members.filter((email) => email.toLowerCase() !== userEmail.toLowerCase())
        this.selectedProject.members = users
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    },
    copyLinkToProject () {
      copyText(
        `${window.location.origin}/project/${this.selectedProjectUid}`,
        undefined,
        (error, event) => {
          if (error) {
            console.log('copyLinkToProject error', error)
          } else {
            console.log('copyLinkToProject', event)
          }
        }
      )
    }
  }
}
</script>

<style scoped>
</style>
