<template>
  <div
    class="w-full pb-[28px]"
  >
    <BoardModalBoxRename
      v-if="showAddDep"
      :show="showAddDep"
      title="Добавить отдел"
      @cancel="showAddDep = false"
      @save="onAddNewDep"
    />
    <EmployeesModalBoxMove
      v-if="showMoveDep"
      :show="showMoveDep"
      :position="currentDepPosition"
      :names="depNames"
      :count-all="depNames.length"
      @cancel="showMoveDep = false"
      @changePosition="onChangeDepPosition"
    />
    <EmployeesModalBoxAdd
      v-if="showAddEmployee"
      :show="showAddEmployee"
      @cancel="showAddEmployee = false"
      @save="onAddNewEmp"
    />
    <BoardModalBoxDelete
      v-if="showDeleteDep"
      title="Удалить отдел"
      text="Вы действительно хотите удалить отдел?"
      @cancel="showDeleteDep = false"
      @yes="onDeleteDep"
    />
    <BoardModalBoxRename
      v-if="showRenameDep"
      :show="showRenameDep"
      title="Название отдела"
      :value="currentDepName"
      @cancel="showRenameDep = false"
      @save="onRenameDep"
    />
    <EmployeesModalBoxUsersLimit
      v-if="showUsersLimit"
      @cancel="showUsersLimit = false"
      @ok="showUsersLimit = false"
    />
    <EmployeesModalBoxOtherOrg
      v-if="showOtherOrg"
      @cancel="showOtherOrg = false"
      @ok="showOtherOrg = false"
    />
    <EmployeesModalBoxAlreadyExist
      v-if="alreadyExist"
      @cancel="alreadyExist = false"
    />
    <div
      v-for="(value, index) in items"
      :key="index"
    >
      <div
        class="group flex items-center w-full"
        :class="{ 'justify-between': index === 0, 'mt-[28px]': index !== 0 }"
      >
        <p class="font-roboto text-[#424242] text-[19px] leading-[22px] font-bold">
          {{ value.dep }}
        </p>
        <div
          v-if="index === 0"
          class="flex"
        >
          <icon
            :path="listView.path"
            :width="listView.width"
            :height="listView.height"
            :box="listView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': !isGridView,
              'text-gray-400': isGridView
            }"
            @click="updateGridView(false)"
          />
          <icon
            :path="gridView.path"
            :width="gridView.width"
            :height="gridView.height"
            :box="gridView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': isGridView,
              'text-gray-400': !isGridView
            }"
            @click="updateGridView(true)"
          />
        </div>
        <div
          v-if="index !== 0 && isCanChangeDepartments"
          :ref="`dep-icon-${value.uid}`"
          class="flex-none ml-[5px] h-[18px] w-[18px] cursor-pointer invisible group-hover:visible"
        >
          <PopMenu
            @openMenu="lockVisibility(value.uid)"
            @closeMenu="unlockVisibility(value.uid)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.35524 16.6055C8.37421 16.6055 7.57892 15.8102 7.57892 14.8291C7.57892 13.8481 8.37421 13.0528 9.35524 13.0528C10.3363 13.0528 11.1316 13.8481 11.1316 14.8291C11.1316 15.8102 10.3363 16.6055 9.35524 16.6055ZM9.35524 11.2765C8.37421 11.2765 7.57892 10.4812 7.57892 9.50016C7.57892 8.51912 8.37421 7.72383 9.35524 7.72383C10.3363 7.72383 11.1316 8.51912 11.1316 9.50016C11.1316 10.4812 10.3363 11.2765 9.35524 11.2765ZM7.57892 4.17118C7.57892 5.15222 8.37421 5.9475 9.35524 5.9475C10.3363 5.9475 11.1316 5.15222 11.1316 4.17118C11.1316 3.19015 10.3363 2.39486 9.35524 2.39486C8.37421 2.39486 7.57892 3.19015 7.57892 4.17118Z"
                fill="#424242"
              />
            </svg>
            <template #menu>
              <PopMenuItem
                icon="edit"
                @click="clickRenameDep(value.uid)"
              >
                Переименовать
              </PopMenuItem>
              <PopMenuItem
                icon="move"
                @click="clickMoveDep(value.uid)"
              >
                Переместить
              </PopMenuItem>
              <PopMenuItem
                icon="delete"
                @click="clickDeleteDep(value.uid)"
              >
                Удалить
              </PopMenuItem>
            </template>
          </PopMenu>
        </div>
      </div>
      <div
        class="grid gap-2 mt-3 grid-cols-1"
        :class="{
          'md:grid-cols-2 lg:grid-cols-4': isGridView,
          'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
        }"
      >
        <template
          v-for="user in value.items"
          :key="user.uid"
        >
          <ListBlocItem
            :title="user.name"
            :sub-title="user.email"
            :right-icon="empIcon(user)"
            :selected="selectedEmployee === user.email"
            @click.stop="showUserProperties(user)"
          >
            <img
              v-if="user.fotolink"
              :src="user.fotolink"
              class="rounded-[6px]"
              width="20"
              height="20"
            >
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="42"
                height="42"
                rx="8"
                fill="#EDEDED"
              />
              <path
                d="M15.75 14.583C15.75 17.4775 18.1055 19.833 21 19.833C23.8945 19.833 26.25 17.4775 26.25 14.583C26.25 11.6885 23.8945 9.33301 21 9.33301C18.1055 9.33301 15.75 11.6885 15.75 14.583ZM30.3333 31.4997H31.5V30.333C31.5 25.8308 27.8355 22.1663 23.3333 22.1663H18.6667C14.1633 22.1663 10.5 25.8308 10.5 30.333V31.4997H30.3333Z"
                fill="#979899"
              />
            </svg>
          </ListBlocItem>
        </template>
        <ListBlocAdd
          v-if="index === 0 && isCanChangeEmployees"
          @click.stop="clickAddEmployee"
        />
      </div>
    </div>
    <div
      v-if="isCanChangeDepartments && currUserWorkspaces > 1"
      class="flex items-center w-full my-[28px] text-[#7e7e80] hover:text-[#424242] cursor-pointer"
      @click.stop="clickAddDep"
    >
      <p class="font-roboto text-[17px] leading-[22px]">
        Добавить отдел
      </p>
      <svg
        class="ml-[5px]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.935 5.00389L10 5C10.1361 5.00002 10.2674 5.04998 10.3691 5.1404C10.4708 5.23082 10.5357 5.35542 10.5517 5.49056L10.5556 5.55556V9.44444H14.4444C14.5805 9.44446 14.7119 9.49442 14.8135 9.58484C14.9152 9.67526 14.9802 9.79986 14.9961 9.935L15 10C15 10.1361 14.95 10.2674 14.8596 10.3691C14.7692 10.4708 14.6446 10.5357 14.5094 10.5517L14.4444 10.5556H10.5556V14.4444C10.5555 14.5805 10.5056 14.7119 10.4152 14.8135C10.3247 14.9152 10.2001 14.9802 10.065 14.9961L10 15C9.86393 15 9.73259 14.95 9.6309 14.8596C9.52922 14.7692 9.46425 14.6446 9.44833 14.5094L9.44444 14.4444V10.5556H5.55556C5.41948 10.5555 5.28815 10.5056 5.18646 10.4152C5.08477 10.3247 5.01981 10.2001 5.00389 10.065L5 10C5.00002 9.86393 5.04998 9.73259 5.1404 9.6309C5.23082 9.52922 5.35542 9.46425 5.49056 9.44833L5.55556 9.44444H9.44444V5.55556C9.44446 5.41948 9.49442 5.28815 9.58484 5.18646C9.67526 5.08477 9.79986 5.01981 9.935 5.00389L10 5L9.935 5.00389Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import EmployeesModalBoxUsersLimit from '@/components/Employees/EmployeesModalBoxUsersLimit.vue'
import EmployeesModalBoxOtherOrg from '@/components/Employees/EmployeesModalBoxOtherOrg.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import EmployeesModalBoxAdd from '@/components/Employees/EmployeesModalBoxAdd.vue'
import EmployeesModalBoxMove from '@/components/Employees/EmployeesModalBoxMove.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import EmployeesModalBoxAlreadyExist from '@/components/Employees/EmployeesModalBoxAlreadyExist'

import * as EMPLOYEE from '@/store/actions/employees'
import * as DEPARTMENT from '@/store/actions/departments'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

export default {
  components: {
    EmployeesModalBoxAlreadyExist,
    Icon,
    ListBlocItem,
    ListBlocAdd,
    BoardModalBoxRename,
    BoardModalBoxDelete,
    EmployeesModalBoxAdd,
    EmployeesModalBoxMove,
    EmployeesModalBoxUsersLimit,
    EmployeesModalBoxOtherOrg,
    PopMenu,
    PopMenuItem
  },
  props: {
    employees: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      gridView,
      listView,
      showAddEmployee: false,
      selectedEmployee: '',
      showAddDep: false,
      showDeleteDep: false,
      currentDepUid: '',
      showRenameDep: false,
      showMoveDep: false,
      showUsersLimit: false,
      showOtherOrg: false,
      alreadyExist: false
    }
  },
  computed: {
    items () {
      const items = this.employees.map(item => ({
        dep: item.dep.uid === '' ? 'Сотрудники' : item.dep.name,
        items: item.items,
        order: item.dep?.order ?? Number.MIN_SAFE_INTEGER,
        uid: item.dep.uid,
        item: item.dep.uid === '' ? null : item.dep
      }))
      items.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.dep > item2.dep) return 1
        if (item1.dep < item2.dep) return -1
        return 0
      })
      return items
    },
    user () {
      return this.$store.state.user.user
    },
    currUserWorkspaces () {
      return this.items.reduce((sum, current) => sum + current.items.length, 0)
    },
    isGridView () {
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isCanChangeEmployees () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      return userType === 1 || userType === 2
    },
    isCanChangeDepartments () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      return userType === 1
    },
    allDepartments () {
      return this.items.filter(item => item.uid !== '').map(item => item.item)
    },
    currentDep () {
      const item = this.allDepartments.find(dep => dep.uid === this.currentDepUid)
      return item || null
    },
    currentDepName () {
      const dep = this.currentDep
      return dep?.name ?? ''
    },
    currentDepPosition () {
      return this.allDepartments.findIndex(dep => dep.uid === this.currentDepUid)
    },
    depNames () {
      return this.allDepartments.map(dep => dep.name)
    }
  },
  watch: {
    isPropertiesMobileExpanded: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.selectedEmployee = ''
        }
      }
    }
  },
  methods: {
    print (msg, val) {
      console.log(msg, val)
    },
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    empIcon (user) {
      if (user.type === 1) return 'cup'
      if (user.type === 2) return 'star'
      if (user.type === 4) return 'send'
      return ''
    },
    showUserProperties (user) {
      if (!this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }

      this.selectedEmployee = user.email

      this.$store.commit('basic', { key: 'propertiesState', value: 'employee' })
      this.$store.commit(EMPLOYEE.SELECT_EMPLOYEE, this.$store.state.employees.employees[user.uid])
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    clickAddDep () {
      // ограничение на добавление отдела на аккаунте с истекшей лицензией(не удалять)
      // if (this.user.days_left <= 0) {
      //   this.showUsersLimit = true
      //   return
      // }
      this.showAddDep = true
    },
    onAddNewDep (name) {
      this.showAddDep = false
      const title = name.trim()
      if (title) {
        const maxOrder =
          this.items.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const data = {
          uid: this.uuidv4(),
          uid_parent: '00000000-0000-0000-0000-000000000000',
          name: title,
          collapsed: 0,
          emails: [],
          order: maxOrder + 1
        }
        this.$store.dispatch(DEPARTMENT.CREATE_DEPARTMENT_REQUEST, data)
          .then((resp) => {
            console.log('onAddNewDep', resp)
          })
      }
    },
    clickAddEmployee () {
      // если лицензия истекла
      if (this.user.days_left <= 0) {
        this.showUsersLimit = true
        return
      }
      // если у нас куплены рабочие места
      // проверяем на превышение лицензии
      if (this.user.count_workplaces !== 0 && this.user.count_workplaces <= this.currUserWorkspaces) {
        this.showUsersLimit = true
        return
      }

      this.showAddEmployee = true
    },
    onAddNewEmp (name, email) {
      this.showAddEmployee = false
      const empName = name.trim()
      const empEmail = email.trim()
      if (empName && empEmail) {
        this.$store.dispatch(EMPLOYEE.CREATE_EMPLOYEE_REQUEST, {
          name: empName,
          email: empEmail
        })
          .catch((e) => {
            if (e.response?.data?.error === 'the employee is already present in this organization' || e.response?.data?.error === 'the employee has license') {
              this.showOtherOrg = true
            }
            if (e.response?.data?.error === 'the employee is the director of the organization') {
              this.alreadyExist = true
            }
          })
          .then((resp) => {
            console.log('onAddNewEmp', resp)
          })
      }
    },
    lockVisibility (uid) {
      const icon = this.$refs[`dep-icon-${uid}`][0]
      icon.style.visibility = 'visible'
    },
    unlockVisibility (uid) {
      const icon = this.$refs[`dep-icon-${uid}`][0]
      icon.style.visibility = null
    },
    clickDeleteDep (uid) {
      this.currentDepUid = uid
      this.showDeleteDep = true
    },
    onDeleteDep () {
      this.showDeleteDep = false
      if (this.currentDepUid) {
        this.$store.dispatch(DEPARTMENT.REMOVE_DEPARTMENT_REQUEST, this.currentDepUid)
          .then((resp) => {
            console.log('onDeleteDep', resp)
          })
      }
    },
    clickRenameDep (uid) {
      this.currentDepUid = uid
      this.showRenameDep = true
    },
    onRenameDep (name) {
      this.showRenameDep = false
      const title = name.trim()
      if (title && this.currentDep) {
        this.currentDep.name = title
        this.$store.dispatch(DEPARTMENT.UPDATE_DEPARTMENT_REQUEST, this.currentDep)
          .then((resp) => {
            console.log('onRenameDep', resp)
          })
      }
    },
    clickMoveDep (uid) {
      this.currentDepUid = uid
      this.showMoveDep = true
    },
    onChangeDepPosition (order) {
      this.showMoveDep = false
      if (this.currentDep) {
        // вычисляем новый order
        const index = this.currentDepPosition
        const allDep = [...this.allDepartments]
        const deps = allDep.splice(index, 1)
        allDep.splice(order, 0, ...deps)
        const prevDep = allDep[order - 1]
        const nextDep = allDep[order + 1]
        let newOrder = 0
        if (!prevDep && !nextDep) newOrder = 1
        else if (!prevDep) newOrder = nextDep.order - 1
        else if (!nextDep) newOrder = prevDep.order + 1
        else if (prevDep && nextDep) newOrder = (nextDep.order + prevDep.order) / 2
        //
        this.currentDep.order = newOrder
        this.$store.dispatch(DEPARTMENT.UPDATE_DEPARTMENT_REQUEST, this.currentDep)
          .then((resp) => {
            console.log('onChangeDepPosition', resp)
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
