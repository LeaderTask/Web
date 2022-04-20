<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['AccLogout'])
const store = useStore()
const user = computed(() => store.state.user.user)
const lab = user.value.current_user_name
const tarif = () => {
  store.commit('basic', { key: 'navig', value: 1 })
}
const pass = () => {
  store.commit('basic', { key: 'navig', value: 3 })
}
const logout = () => {
  emit('AccLogout')
}
</script>

<template>
<form class=" mx-12 overscroll-auto">
  <div class="flex pb-3">
    <form class="text-left w-3/4">
      <strong>Тариф</strong>
      <br>
      <p v-if="user.license_type === 0" class="font-bold">Пробный</p>
      <p v-if="user.license_type === 1" class="font-bold">Премиум</p>
      <p v-if="user.license_type === 2" class="font-bold">Бизнесс</p>
      <a>{{ user.date_expired }}({{ user.days_left }})</a>
    </form>
    <form class="text-right w-1/4">
      <button class="bg-[#FF9123] hover:bg-[#EB7500]  rounded-xl text-white py-1 mt-4 px-2"
      type="button"
      @click="tarif()"
      >
        Управление тарифом
      </button>
    </form>
  </div>
  <hr>
  <div class="text-left mt-3 mb-3 flex flex-wrap">
    <strong class="w-full">Фото</strong>
    <br>
    <div class="pr-2 pt-3">
      <img
      :src="user.foto_link"
      width="110"
      height="110"
      class=" rounded-full  content-center float-left-">
    </div>
    <div class="mt-[60px]">
        <input id="iconfile" type="file" class="hidden">
        <label for="iconfile" class="bg-gray-100 hover:bg-gray-200 rounded-xl ml-2 px-3 p-1">Выберите фото</label>
        <br>
    </div>
  </div>
    <strong>Имя пользователя</strong>
    <br>
    <input v-model="user.current_user_name" type="text" class="border mt-2">
    <br>
    <form class="mb-2">
      <button
      v-if="lab != user.current_user_name"
      class="bg-gray-100 rounded-xl mt-4 px-3 p-1 hover:bg-gray-200">Изменить имя</button>
    </form>
    <div class="mb-2">
      <strong>Email</strong>
      <br>
      <span>{{ user.current_user_email }}</span>
    </div>
    <strong>Пароль</strong>
    <br>
    <form>
      <button
      @click="pass()"
      class="bg-gray-100 mt-2 rounded-xl px-3 p-1 hover:bg-gray-200">Изменить пароль</button>
    </form>
    <br>
    <form class="text-center">
      <button class="bg-gray-100 rounded-xl px-10 p-1 hover:bg-gray-200"
      @click="logout()">
      Выйти из аккаунта</button>
    </form>
</form>
</template>
