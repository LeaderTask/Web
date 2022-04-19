<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import { CREATE_EMPLOYEE_REQUEST, UPDATE_EMPLOYEE_REQUEST, REMOVE_EMPLOYEE_REQUEST } from '@/store/actions/employees'
import { NAVIGATOR_PUSH_EMPLOYEE, NAVIGATOR_REMOVE_EMPLOYEE } from '@/store/actions/navigator'

const store = useStore()
const selectedEmployee = computed(() => store.state.employees.selectedEmployee)
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)
const hasChanged = ref(false)
const showConfirm = ref(false)

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

watch(selectedEmployee, () => {
  hasChanged.value = false
})

onMounted(() => {
  hasChanged.value = false
})

const createOrUpdateEmployee = (employee) => {
  if (!employee.uid) {
    employee.uid = uuidv4()
    store.dispatch(CREATE_EMPLOYEE_REQUEST, employee)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
        store.commit(NAVIGATOR_PUSH_EMPLOYEE, [employee])
      })
  } else {
    store.dispatch(UPDATE_EMPLOYEE_REQUEST, employee)
      .then(() => {
        hasChanged.value = false
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const removeEmployee = (employee) => {
  store.dispatch(REMOVE_EMPLOYEE_REQUEST, employee)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_EMPLOYEE, employee)
    })
}
</script>

<template>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeEmployee(selectedEmployee)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedEmployee.name }}</strong>" employee?
    </p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства сотрудника
      </p>
      <img
        v-if="selectedEmployee.uid"
        class="mx-auto rounded-full mt-8"
        :src="selectedEmployee.fotolink"
      >
      <p
        class="mt-4"
      >
        Имя
      </p>
      <input
        v-model="selectedEmployee.name"
        type="text"
        placeholder="Имя сотрудника"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        @input="hasChanged = true"
      >
      <p
        class="mt-4"
      >
        Email
      </p>
      <input
        v-model="selectedEmployee.email"
        type="text"
        placeholder="Email"
        class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
        :disabled="selectedEmployee.uid"
        @input="hasChanged = true"
      >
      <div
        v-if="!selectedEmployee.uid"
      >
        <p
          class="mt-4"
        >
          Пароль
        </p>
        <input
          v-model="selectedEmployee.password"
          type="text"
          placeholder="Пароль"
          class="mt-2 p-3 rounded-xl bg-gray-100 font-bold text-gray-700 w-full border-none ring-0 outline-none"
          :disabled="employees[user.current_user_uid].type == 3"
          @input="hasChanged = true"
        >
      </div>
      <button
        v-if="employees[user.current_user_uid].type != 3"
        class="w-full bg-gray-100 rounded-xl mt-8 p-3 text-gray-700 font-bold hover:bg-gray-200"
        :class="{ 'bg-orange-400 hover:bg-orange-500': hasChanged }"
        @click="createOrUpdateEmployee(selectedEmployee)"
      >
        {{ selectedEmployee.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedEmployee.uid && employees[user.current_user_uid].type != 3 && selectedEmployee.type != 1"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
    </div>
  </div>
</template>
