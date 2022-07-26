<template>
  <Popper
    class="popper-employees light"
    arrow
    placement="bottom"
  >
    <!-- Поручить -->
    <div
      v-if="taskType === 1"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 active project-hover-close"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.00417 3.33334C7.36872 3.33334 6.04293 4.65913 6.04293 6.29457C6.04293 7.93002 7.36872 9.25581 9.00417 9.25581C10.6396 9.25581 11.9654 7.93002 11.9654 6.29457C11.9654 4.65913 10.6396 3.33334 9.00417 3.33334ZM4.70959 6.29457C4.70959 3.92275 6.63234 2 9.00417 2C11.376 2 13.2987 3.92275 13.2987 6.29457C13.2987 8.6664 11.376 10.5891 9.00417 10.5891C6.63234 10.5891 4.70959 8.6664 4.70959 6.29457Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.12137 12.0406C4.7532 12.0405 4.39766 12.1748 4.12161 12.4184C3.84558 12.662 3.66805 12.9981 3.62238 13.3634C3.62237 13.3634 3.62238 13.3633 3.62238 13.3634L3.3394 15.6301C3.32561 15.7405 3.33544 15.8526 3.36826 15.9589C3.40109 16.0652 3.45614 16.1633 3.52978 16.2467C3.60341 16.3301 3.69394 16.3969 3.79536 16.4426C3.89677 16.4883 4.00675 16.5119 4.118 16.5119H12.6321C13.0003 16.5119 13.2988 16.8104 13.2988 17.1786C13.2988 17.5468 13.0003 17.8453 12.6321 17.8453H4.11829C4.11824 17.8453 4.11834 17.8453 4.11829 17.8453C3.81801 17.8453 3.52101 17.7815 3.24728 17.6581C2.9735 17.5346 2.7291 17.3543 2.53032 17.1292C2.33153 16.9041 2.1829 16.6393 2.09429 16.3523C2.00568 16.0654 1.97911 15.7629 2.01633 15.4649C2.01634 15.4649 2.01633 15.4649 2.01633 15.4649L2.29931 13.1982C2.38527 12.5103 2.71959 11.8774 3.23938 11.4187C3.75911 10.9601 4.42847 10.7071 5.12163 10.7073H5.3763C5.74449 10.7073 6.04297 11.0058 6.04297 11.3739C6.04297 11.7421 5.74449 12.0406 5.3763 12.0406L5.12137 12.0406Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.6666 12.9999C10.6666 12.6563 10.9763 12.3777 11.3584 12.3777H15.5014L14.824 11.7074C14.567 11.4531 14.5878 11.0596 14.8705 10.8284C15.1532 10.5972 15.5907 10.616 15.8476 10.8703L18 12.9999L15.8476 15.1296C15.5907 15.3839 15.1532 15.4026 14.8705 15.1714C14.5878 14.9403 14.567 14.5467 14.824 14.2925L15.5014 13.6221H11.3584C10.9763 13.6221 10.6666 13.3436 10.6666 12.9999Z"
          fill="white"
        />
      </svg>
      <span class="rounded"> Поручить </span>
    </div>
    <!-- Исполнитель -->
    <div
      v-else-if="taskType === 2"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 project-hover-close"
    >
      <img
        v-if="employeesByEmail[performerEmail]?.fotolink"
        :src="employeesByEmail[performerEmail]?.fotolink"
        class="mr-1 mt-0.5 border-fotolink border-solid border-2 border-green-400 rounded-[4px] w-[20px] h-[20px]"
      >
      <svg
        v-else
        class="mr-1 mt-0.5"
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
          fill="#22C55E"
        />
      </svg>
      <span> {{ getEmpNameByEmail(performerEmail) }} </span>
      <button
        class="btn-close-popover"
        @click.stop="setPerformerCurrentUser"
      >
        <svg
          width="5"
          height="5"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </button>
    </div>
    <!-- Перепоручить -->
    <div
      v-else-if="taskType === 3"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 active project-hover-close"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.00417 3.33334C7.36872 3.33334 6.04293 4.65913 6.04293 6.29457C6.04293 7.93002 7.36872 9.25581 9.00417 9.25581C10.6396 9.25581 11.9654 7.93002 11.9654 6.29457C11.9654 4.65913 10.6396 3.33334 9.00417 3.33334ZM4.70959 6.29457C4.70959 3.92275 6.63234 2 9.00417 2C11.376 2 13.2987 3.92275 13.2987 6.29457C13.2987 8.6664 11.376 10.5891 9.00417 10.5891C6.63234 10.5891 4.70959 8.6664 4.70959 6.29457Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.12137 12.0406C4.7532 12.0405 4.39766 12.1748 4.12161 12.4184C3.84558 12.662 3.66805 12.9981 3.62238 13.3634C3.62237 13.3634 3.62238 13.3633 3.62238 13.3634L3.3394 15.6301C3.32561 15.7405 3.33544 15.8526 3.36826 15.9589C3.40109 16.0652 3.45614 16.1633 3.52978 16.2467C3.60341 16.3301 3.69394 16.3969 3.79536 16.4426C3.89677 16.4883 4.00675 16.5119 4.118 16.5119H12.6321C13.0003 16.5119 13.2988 16.8104 13.2988 17.1786C13.2988 17.5468 13.0003 17.8453 12.6321 17.8453H4.11829C4.11824 17.8453 4.11834 17.8453 4.11829 17.8453C3.81801 17.8453 3.52101 17.7815 3.24728 17.6581C2.9735 17.5346 2.7291 17.3543 2.53032 17.1292C2.33153 16.9041 2.1829 16.6393 2.09429 16.3523C2.00568 16.0654 1.97911 15.7629 2.01633 15.4649C2.01634 15.4649 2.01633 15.4649 2.01633 15.4649L2.29931 13.1982C2.38527 12.5103 2.71959 11.8774 3.23938 11.4187C3.75911 10.9601 4.42847 10.7071 5.12163 10.7073H5.3763C5.74449 10.7073 6.04297 11.0058 6.04297 11.3739C6.04297 11.7421 5.74449 12.0406 5.3763 12.0406L5.12137 12.0406Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.6666 12.9999C10.6666 12.6563 10.9763 12.3777 11.3584 12.3777H15.5014L14.824 11.7074C14.567 11.4531 14.5878 11.0596 14.8705 10.8284C15.1532 10.5972 15.5907 10.616 15.8476 10.8703L18 12.9999L15.8476 15.1296C15.5907 15.3839 15.1532 15.4026 14.8705 15.1714C14.5878 14.9403 14.567 14.5467 14.824 14.2925L15.5014 13.6221H11.3584C10.9763 13.6221 10.6666 13.3436 10.6666 12.9999Z"
          fill="white"
        />
      </svg>
      <span class="rounded"> Перепоручить </span>
    </div>
    <!-- Взять на исполнение -->
    <div
      v-else-if="taskType === 5"
      class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 active project-hover-close"
      @click.stop="setPerformerCurrentUser"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.00453 3.33334C7.36909 3.33334 6.0433 4.65913 6.0433 6.29457C6.0433 7.93002 7.36909 9.25581 9.00453 9.25581C10.64 9.25581 11.9658 7.93002 11.9658 6.29457C11.9658 4.65913 10.64 3.33334 9.00453 3.33334ZM4.70996 6.29457C4.70996 3.92275 6.63271 2 9.00453 2C11.3764 2 13.2991 3.92275 13.2991 6.29457C13.2991 8.6664 11.3764 10.5891 9.00453 10.5891C6.63271 10.5891 4.70996 8.6664 4.70996 6.29457Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.12137 12.0406C4.7532 12.0404 4.39766 12.1748 4.12161 12.4184C3.84558 12.662 3.66805 12.998 3.62238 13.3633C3.62237 13.3634 3.62238 13.3633 3.62238 13.3633L3.3394 15.63C3.32561 15.7404 3.33544 15.8526 3.36826 15.9589C3.40109 16.0652 3.45614 16.1633 3.52978 16.2467C3.60341 16.33 3.69394 16.3968 3.79536 16.4426C3.89677 16.4883 4.00675 16.5119 4.118 16.5119H12.6321C13.0003 16.5119 13.2988 16.8104 13.2988 17.1786C13.2988 17.5468 13.0003 17.8452 12.6321 17.8452H4.11829C4.11824 17.8452 4.11834 17.8452 4.11829 17.8452C3.81801 17.8453 3.52101 17.7815 3.24728 17.658C2.9735 17.5346 2.7291 17.3543 2.53032 17.1292C2.33153 16.9041 2.1829 16.6392 2.09429 16.3523C2.00568 16.0653 1.97911 15.7629 2.01633 15.4649C2.01634 15.4648 2.01633 15.4649 2.01633 15.4649L2.29931 13.1982C2.38527 12.5103 2.71959 11.8774 3.23938 11.4187C3.75911 10.96 4.42847 10.707 5.12163 10.7072H5.3763C5.74449 10.7072 6.04297 11.0057 6.04297 11.3739C6.04297 11.7421 5.74449 12.0406 5.3763 12.0406L5.12137 12.0406Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.667 12.9998C10.667 12.6562 10.9767 12.3776 11.3587 12.3776H15.5018L14.8243 11.7073C14.5673 11.453 14.5882 11.0595 14.8709 10.8283C15.1535 10.5971 15.591 10.6159 15.848 10.8702L18.0003 12.9998L15.848 15.1295C15.591 15.3838 15.1535 15.4025 14.8709 15.1713C14.5882 14.9402 14.5673 14.5467 14.8243 14.2924L15.5018 13.622H11.3587C10.9767 13.622 10.667 13.3435 10.667 12.9998Z"
          fill="white"
        />
      </svg>

      <span class="rounded"> Взять на исполнение </span>
    </div>
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="text-white body-popover-custom"
          @click="close"
        >
          <div class="container-employee-popover">
            <div
              v-for="emp in employees"
              :key="emp.uid"
            >
              <div
                v-if="emp.uid !== currentUserUid"
                class="list-employee-access"
                @click="changePerformer(emp.email)"
              >
                <img
                  v-if="emp.fotolink"
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
                <svg
                  v-else
                  class="mr-[10px] mt-[5px] flex-none"
                  width="30"
                  height="30"
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
                <label class="employee-name-custom">
                  {{ emp.name }}
                  <div class="popover-employee-email">{{ emp.email }}</div>
                </label>
                <span
                  v-if="isCurrentPerformerEmail(emp.email)"
                  class="inline-flex justify-center items-center"
                >
                  <svg
                    viewBox="0 0 26 20"
                    width="10"
                    height="10"
                    class="inline-block"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    performerEmail: {
      type: String,
      default: ''
    },
    taskType: {
      type: Number,
      default: 0
    }
  },
  emits: ['changePerformer', 'reAssign'],
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    isCurrentPerformerEmail (userEmail) {
      return this.performerEmail.toLowerCase() === userEmail.toLowerCase()
    },
    setPerformerCurrentUser () {
      // ставим исполнителем себя
      const currentUserEmail = this.employees[this.currentUserUid]?.email
      this.changePerformer(currentUserEmail)
    },
    changePerformer (userEmail) {
      if (this.isCurrentPerformerEmail(userEmail)) return
      if (this.taskType === 3) {
        this.$emit('reAssign', userEmail)
        return
      }
      this.$emit('changePerformer', userEmail)
    }
  }
}
</script>

<style scoped></style>
