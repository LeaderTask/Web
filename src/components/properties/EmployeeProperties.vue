<template>
  <div>
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить сотрудника"
      :text="`Вы действительно хотите удалить сотрудника ${selectedEmployeeName}?`"
      @cancel="showConfirm = false"
      @yes="removeEmployee"
    />
    <div class="flex justify-between items-center">
      <PopMenu v-if="isCanDeleteEmp">
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem
            icon="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
        </template>
      </PopMenu>
      <div v-else />
      <PropsButtonClose
        @click="closeProperties"
      />
    </div>
    <div
      v-if="empFoto"
      class="flex-none mt-[20px] w-[82px] h-[82px] bg-cover bg-center bg-origin-content bg-clip-content rounded-[14px]"
      :style="{
        'background-image': `url(${empFoto})`
      }"
    />
    <input
      v-model="currEmpName"
      type="text"
      placeholder="Имя сотрудника"
      class="mt-[25px] p-0 font-roboto font-bold text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeEmpName"
    >
    <div
      v-if="selectedEmployeeEmail"
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Email
    </div>
    <div
      v-if="selectedEmployeeEmail"
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ selectedEmployeeEmail }}
    </div>
    <div
      v-if="selectedEmployeePhone"
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Телефон
    </div>
    <div
      v-if="selectedEmployeePhone"
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ selectedEmployeePhone }}
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Отдел
    </div>
    <div
      v-if="isCanChangeDepartments"
      class="mt-[15px] w-full"
    >
      <PopMenu
        class="grow w-full"
      >
        <div
          class="group w-full flex items-center gap-[12px] px-[12px] h-[42px] border border-black/12 rounded-[6px] cursor-pointer"
        >
          <div class="grow w-full font-roboto text-[#606061] text-[15px]">
            {{ selectedEmployeeDep || 'Вне отдела' }}
          </div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
              fill="#7E7E80"
            />
          </svg>
        </div>
        <template #menu>
          <PopMenuItem
            v-for="(dep, index) in allDepartments"
            :key="index"
            @click="setDepartment(index)"
          >
            {{ dep.name }}
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
    <div
      v-else
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ selectedEmployeeDep || 'Вне отдела' }}
    </div>
    <div
      v-if="openedReglaments.length"
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Доступные регламенты
    </div>
    <div
      v-if="openedReglaments.length"
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      <div
        v-for="reglament in openedReglaments"
        :key="reglament.uid"
        class="w-full h-[34px] flex items-center border-[2px] px-2 mb-1 rounded cursor-pointer"
        @click="clickReglament(reglament.uid)"
      >
        <span class="grow font-roboto text-[13px] leading-[20px] font-medium text-[#4c4c4d] overflow-hidden truncate">
          {{ reglament.name }}
        </span>
        <svg
          v-if="passedReglaments[reglament.uid]"
          class="flex-none ml-[10px]"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.2246 7.10844C18.4805 7.36437 18.4805 7.77123 18.2246 8.02715L10.783 15.4688C10.7229 15.5296 10.6514 15.5778 10.5725 15.6108C10.4937 15.6437 10.4091 15.6607 10.3236 15.6607C10.2382 15.6607 10.1535 15.6437 10.0747 15.6108C9.99584 15.5778 9.92431 15.5296 9.86425 15.4688L7.1081 12.7126C7.04731 12.6526 6.99904 12.581 6.9661 12.5022C6.93316 12.4233 6.91619 12.3387 6.91619 12.2533C6.91619 12.1678 6.93316 12.0832 6.9661 12.0043C6.99904 11.9255 7.04731 11.854 7.1081 11.7939C7.16816 11.7331 7.23969 11.6848 7.31854 11.6519C7.3974 11.619 7.482 11.602 7.56746 11.602C7.65292 11.602 7.73752 11.619 7.81638 11.6519C7.89523 11.6848 7.96676 11.7331 8.02682 11.7939L10.3236 14.0907L17.3059 7.10844C17.3659 7.04764 17.4375 6.99938 17.5163 6.96644C17.5952 6.93349 17.6798 6.91653 17.7652 6.91653C17.8507 6.91653 17.9353 6.93349 18.0141 6.96644C18.093 6.99938 18.1645 7.04764 18.2246 7.10844ZM16.8399 5.71724L10.3236 12.2336L8.49274 10.4027C7.98088 9.89084 7.14747 9.89084 6.63562 10.4027L5.7169 11.3214C5.20504 11.8333 5.20504 12.6667 5.7169 13.1785L9.39177 16.8534C9.90363 17.3653 10.737 17.3653 11.2489 16.8534L19.6158 8.49307C20.1276 7.98122 20.1276 7.14781 19.6158 6.63595L18.6971 5.71724C18.1786 5.20538 17.3518 5.20538 16.8399 5.71724Z"
            fill="#44944A"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import * as EMPLOYEE from '@/store/actions/employees'
import { NAVIGATOR_REMOVE_EMPLOYEE } from '@/store/actions/navigator'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'

export default {
  components: {
    ModalBoxDelete,
    PopMenu,
    PopMenuItem,
    PropsButtonMenu,
    PropsButtonClose
  },
  data () {
    return {
      showConfirm: false,
      currentLocation: window.location.href,
      currEmpName: ''
    }
  },
  computed: {
    selectedEmployee () {
      return this.$store.state.employees.selectedEmployee
    },
    selectedEmployeeUid () {
      return this.selectedEmployee?.uid || ''
    },
    selectedEmployeeName () {
      return this.selectedEmployee?.name || ''
    },
    selectedEmployeeEmail () {
      return this.selectedEmployee?.email || ''
    },
    selectedEmployeeType () {
      return this.selectedEmployee?.type || -1
    },
    selectedEmployeePhone () {
      const phone = this.selectedEmployee?.phone || ''
      const index = phone.lastIndexOf(' ("')
      if (index !== -1) {
        return phone.slice(0, index)
      }
      return phone
    },
    selectedEmployeeDep () {
      const dep = this.$store.state.departments.deps[this.selectedEmployee?.uid_dep]
      return dep?.name || ''
    },
    empFoto () {
      const fotolink = this.selectedEmployee?.fotolink
      if (!fotolink) return undefined
      if (fotolink.endsWith('&size=b')) {
        const foto = fotolink.slice(0, -('&size=b'.length))
        return foto + '&size=l'
      }
      return fotolink
    },
    isSelectedEmployeeCurrentUser () {
      const user = this.$store.state.user.user
      return user.current_user_uid === this.selectedEmployeeUid
    },
    isCanChangeDepartments () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      return userType === 1
    },
    isCanDeleteEmp () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      const userAdmin = userType === 1 || userType === 2
      // текущий пользователь админ
      // тот которого удаляем не суперадмин
      // тот которого удаляем не текущий пользователь
      return userAdmin && this.selectedEmployeeType !== 1 && !this.isSelectedEmployeeCurrentUser
    },
    allDepartments () {
      const deps = Object.values(this.$store.state.departments.deps)
      deps.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.name > item2.name) return 1
        if (item1.name < item2.name) return -1
        return 0
      })
      deps.unshift({
        uid: '00000000-0000-0000-0000-000000000000',
        name: 'Вне отдела'
      })
      return deps
    },
    openedReglaments () {
      const reglaments = this.$store.getters.reglamentsList
      // здесь сделать фильтрацию доступных этому пользователю
      // регламентов (по уиду отдела или общие)
      // сейчас доступны все - по этому тут ничего не делаем
      return reglaments
    },
    passedReglaments () {
      return this.openedReglaments.reduce((acc, reglament) => {
        if (reglament.passed.includes(this.selectedEmployeeUid)) acc[reglament.uid] = reglament
        return acc
      }, {})
    }
  },
  watch: {
    selectedEmployeeName: {
      immediate: true,
      handler: function (val) {
        this.currEmpName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    clickReglament (reglamentUid) {
      const link = `${window.location.origin}/reglament/${reglamentUid}`
      window.location = link
    },
    removeEmployee () {
      this.showConfirm = false
      this.$store.dispatch(EMPLOYEE.REMOVE_EMPLOYEE_REQUEST, this.selectedEmployee)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_EMPLOYEE, this.selectedEmployee)
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeEmpName () {
      const title = this.currEmpName.trim()
      if (title && this.selectedEmployee?.name !== title) {
        this.$store.dispatch(EMPLOYEE.CHANGE_EMPLOYEE_NAME, {
          email: this.selectedEmployee?.email,
          name: title
        })
          .then((resp) => {
            console.log('changeEmpName', resp)
          })
      }
    },
    setDepartment (index) {
      const dep = this.allDepartments[index]
      if (this.selectedEmployee?.uid_dep !== dep.uid) {
        const data = {
          uidDepartmentOld: this.selectedEmployee?.uid_dep,
          uidDepartmentNew: dep.uid,
          uidEmp: this.selectedEmployee?.uid,
          emailEmp: this.selectedEmployee?.email,
          depOld: this.$store.state.departments.deps[this.selectedEmployee?.uid_dep],
          depNew: this.$store.state.departments.deps[dep.uid]
        }
        this.$store.dispatch(EMPLOYEE.CHANGE_EMPLOYEE_DEP, data)
          .then((resp) => {
            console.log('setDepartment', resp, data)
          })
      }
    }
  }
}
</script>

<style scoped>
</style>
