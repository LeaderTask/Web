<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import ColorPicker from '@/components/properties/ColorPicker.vue'
import Toggle from '@vueform/toggle'
import add from '@/icons/add.js'
import close from '@/icons/close.js'
import Popper from 'vue3-popper'

import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'

import {
  CREATE_PROJECT_REQUEST,
  UPDATE_PROJECT_REQUEST,
  PUSH_PROJECT,
  QUIT_PROJECT_REQUEST,
  REMOVE_PROJECT_REQUEST
} from '@/store/actions/projects'
import { NAVIGATOR_PUSH_PROJECT, NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'

const store = useStore()
const selectedProject = computed(() => store.state.projects.selectedProject)
const user = computed(() => store.state.user.user)
const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
const isDark = computed(() => store.state.darkMode)
const showConfirm = ref(false)
const showConfirmQuit = ref(false)
const hasChanged = ref(false)
const showAllMembers = ref(false)

function arrayRemove (arr, value) {
  return arr.filter(function (ele) {
    return ele !== value
  })
}

onMounted(() => {
  hasChanged.value = false
})

watch(selectedProject, () => {
  showAllMembers.value = false
  selectedProject.value.quiet = !!selectedProject.value.quiet
  hasChanged.value = false
})

const addRemoveMember = (email) => {
  hasChanged.value = true
  if (email.included) {
    selectedProject.value.members.push(email.email)
  } else {
    selectedProject.value.members = arrayRemove(selectedProject.value.members, email.email)
  }
}

const removeMember = (member) => {
  selectedProject.value.members = arrayRemove(selectedProject.value.members, member.email)
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const createOrUpdateProject = (project) => {
  project.quiet = project.quiet ? 1 : 0
  // TODO: should not be hardcoded
  project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
  if (!project.uid) {
    project.uid = uuidv4()
    store.dispatch(CREATE_PROJECT_REQUEST, project)
      .then(() => {
        hasChanged.value = false
        project.quiet = !!project.quiet
        store.dispatch('asidePropertiesToggle', false)
        store.commit(PUSH_PROJECT, [project])
        store.commit(NAVIGATOR_PUSH_PROJECT, [project])
      })
  } else {
    store.dispatch(UPDATE_PROJECT_REQUEST, project)
      .then(() => {
        hasChanged.value = false
        project.quiet = !!project.quiet
        store.dispatch('asidePropertiesToggle', false)
      })
  }
}

const quitProject = (project) => {
  store.dispatch(QUIT_PROJECT_REQUEST, { uid: project.uid, value: user.value.current_user_email })
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_PROJECT, project)
    })
}

const removeProject = (project) => {
  store.dispatch(REMOVE_PROJECT_REQUEST, project.uid)
    .then(() => {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(NAVIGATOR_REMOVE_PROJECT, project)
    })
}
</script>

<template>
  <modal-box-confirm
    v-model="showConfirmQuit"
    button="warning"
    has-button
    has-cancel
    button-label="Quit"
    @confirm="quitProject(selectedProject)"
  >
    <p class="text-center">
      Do you really wanna quit "<strong>{{ selectedProject.name }}</strong>" project?
    </p>
  </modal-box-confirm>
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeProject(selectedProject)"
  >
    <p class="text-center">
      Do you really wanna delete "<strong>{{ selectedProject.name }}</strong>" project?
    </p>
  </modal-box-confirm>
  <div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-200">
        Свойства проекта
      </p>
      <p
        class="mt-4"
      >
        Название
      </p>
      <input
        v-model="selectedProject.name"
        type="text"
        placeholder="Название проекта"
        class="mt-2 rounded-xl bg-gray-100 font-bold text-gray-700 dark:text-gray-100 w-full border-none ring-0 outline-none p-3 bg-transparent"
        :disabled="selectedProject.email_creator != user.current_user_email"
        @input="hasChanged = true"
      >
      <div
        class="mt-8"
      >
        <ColorPicker
          v-model="selectedProject.color"
          :update="() => hasChanged = true "
          :label="'Цвет проекта'"
          :disabled="selectedProject.email_creator != user.current_user_email"
        />
      </div>
      <hr class="my-6">
      <div
        class="flex items-center mb-6"
      >
        <p class="text-sm mr-3">
          Не следить за изменениями
        </p>
        <Toggle
          v-model="selectedProject.quiet"
          class="outline-none ring-0"
          :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
          @change="hasChanged = true"
        />
      </div>
      <p class="dark:text-gray-200">
        Доступ
      </p>
      <Popper
        arrow
        :z-index="999999999999999999"
        class="z-auto"
        :class="isDark ? 'dark' : 'light'"
        placement="top"
      >
        <template #content>
          <div
            style="max-height: 15rem;"
            class="overflow-scroll"
          >
            <div
              v-for="(email, index) in employeesByEmail"
              :key="index"
              class="px-3 py-1 bg-gray-50 rounded-xl mt-1 flex items-center justify-between border border-gray-100"
            >
              <div class="flex items-center">
                <img
                  :src="email.fotolink"
                  class="rounded-xl mr-2"
                  width="35"
                  height="35"
                >
                <p>{{ email.name }}</p>
              </div>
              <input
                v-model="email.included"
                class="ml-2 bg-gray-300 rounded border border-gray-100"
                :checked="selectedProject.members.includes(email.email)"
                type="checkbox"
                @change="addRemoveMember(email)"
              >
            </div>
          </div>
        </template>
        <div
          v-if="selectedProject.email_creator == user.current_user_email"
          class="flex items-center justify-center my-6 cursor-pointer"
        >
          <Icon
            :path="add.path"
            :box="add.viewBox"
            :width="add.width"
            :height="add.height"
            class="text-gray-500 dark:text-gray-100 mx-3"
          />
          <p class="text-gray-600 dark:text-gray-100">
            Добавить участника проекта
          </p>
        </div>
      </Popper>
      <div
        class="grid grid-cols-1"
      >
        <template
          v-for="(employee, pindex) in selectedProject.members"
          :key="pindex"
        >
          <div
            v-if="employeesByEmail[employee]"
            v-show="pindex < 4 || showAllMembers"
            class="flex items-center bg-white dark:bg-gray-700 rounded-xl shadow h-30 px-3 py-5 mt-1"
          >
            <img
              :src="employeesByEmail[employee].fotolink"
              class="rounded-lg mx-2 my-auto"
              width="38"
              height="38"
            >
            <div class="w-full">
              <div class="flex items-start justify-between">
                <p
                  class="font-normal cursor-pointer"
                >
                  {{ employeesByEmail[employee].name }}
                </p>
                <icon
                  v-if="employeesByEmail[employee].uid !== user.current_user_uid && selectedProject.email_creator == user.current_user_email"
                  :path="close.path"
                  :width="10"
                  :height="10"
                  :box="close.viewBox"
                  class="text-grayemployeesByEmail[employee]-400 cursor-pointer hover:text-gray-800"
                  @click="removeMember(employeesByEmail[employee])"
                />
              </div>
              <p class="font-light text-xs break-all">
                {{ employeesByEmail[employee].email }}
              </p>
            </div>
          </div>
        </template>
        <p
          v-if="selectedProject.members && selectedProject.members.length > 4 && !showAllMembers"
          class="text-gray-500 text-center decoration-dashed underline mt-3 cursor-pointer"
          @click="showAllMembers = true"
        >
          Show all members
        </p>
      </div>
      <button
        v-if="selectedProject.email_creator == user.current_user_email"
        class="w-full bg-gray-100 dark:bg-gray-800 rounded-xl mt-4 p-3 text-gray-700 dark:text-gray-100 font-bold hover:bg-gray-200 hover:dark:bg-gray-700"
        :class="{ 'bg-orange-400 dark:bg-orange-400 hover:bg-orange-500 hover:dark:bg-orange-500': hasChanged }"
        @click="createOrUpdateProject(selectedProject)"
      >
        {{ selectedProject.uid ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="selectedProject.email_creator == user.current_user_email && selectedProject.uid"
        class="w-full bg-red-600 rounded-xl mt-4 p-3 text-white font-bold hover:bg-red-800"
        @click="showConfirm = true"
      >
        Удалить
      </button>
      <button
        v-if="selectedProject.email_creator !== user.current_user_email"
        class="w-full bg-gray-100 rounded-xl mt-4 p-3 text-gray-700 font-bold hover:bg-gray-200"
        @click="showConfirmQuit = true"
      >
        Выйти из проекта
      </button>
    </div>
  </div>
</template>

<style>
.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

</style>
