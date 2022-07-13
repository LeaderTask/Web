<template>
  <Popper
    class="popper-employees light"
    placement="auto"
  >
    <!-- Поручить -->
    <div
      v-if="taskType === 1"
      class="text-center w-[181px] min-h-[40px] bg-gray-100 hover:cursor-pointer flex items-center justify-center text-sm font-medium rounded-lg mb-2 hover:border hover:border-gray-500 border border-transparent"
    >
      <span class="ml-8 w-[70px]"> Поручить </span>
      <Icon
        :height="change.height"
        :width="change.width"
        :box="change.viewBox"
        :path="change.path"
        class="ml-8"
      />
    </div>
    <!-- Исполнитель -->
    <div
      v-else-if="taskType === 2"
      class="w-[181px] min-h-[40px] bg-gray-100 hover:cursor-pointer flex items-center justify-center text-sm font-medium rounded-lg mb-2 hover:border hover:border-gray-500 border border-transparent"
    >
      <span class="text-center ml-8 w-[70px]"> Изменить исполнителя </span>
      <Icon
        :height="change.height"
        :width="change.width"
        :box="change.viewBox"
        :path="change.path"
        class="ml-8"
      />
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
      class="w-[181px] min-h-[40px] bg-gray-100 hover:cursor-pointer flex items-center justify-center text-sm font-medium rounded-lg mb-2 hover:border hover:border-gray-500 border border-transparent"
    >
      <span class="text-center w-[70px] ml-8"> Изменить исполнителя </span>
      <Icon
        :height="change.height"
        :width="change.width"
        :box="change.viewBox"
        :path="change.path"
        class="ml-8"
      />
    </div>
    <!-- Взять на исполнение -->
    <div
      v-else-if="taskType === 5"
      class="w-[181px] min-h-[40px] bg-gray-100 hover:cursor-pointer flex items-center justify-center text-sm font-medium rounded-lg mb-2 hover:border hover:border-gray-500 border border-transparent"
      @click.stop="setPerformerCurrentUser"
    >
      <span class="text-center w-[70px] ml-8"> Взять на исполнение </span>
      <Icon
        :height="change.height"
        :width="change.width"
        :box="change.viewBox"
        :path="change.path"
        class="ml-8"
      />
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
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
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
import Icon from '@/components/Icon.vue'

import change from '@/icons/doitnow/change.js'

export default {
  components: {
    Popper,
    Icon
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
  setup () {
    return {
      change
    }
  },
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
