<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['AccLogout, AccToTarif'])

const store = useStore()
const user = computed(() => store.state.user.user)

const logout = () => {
  emit('AccLogout')
}

const tarif = () => {
  emit('AccToTarif')
}
</script>

<template>
  <form class=" mx-12 overscroll-auto">
    <div class="flex pb-6">
      <form class="text-left w-3/4">
        <strong>Тариф</strong>
        <br>
        <p v-if="user.license_type === 0">
          Пробный
        </p>
        <p v-if="user.license_type === 1">
          Премиум
        </p>
        <p v-if="user.license_type === 2">
          Бизнесс
        </p>
        <a>{{ user.date_expired }}({{ user.days_left }})</a>
      </form>
      <form class="text-right w-1/4">
        <button
          class="bg-[#FF9123] rounded-xl text-white py-2 mt-4 px-3"
          type="button"
          @click="tarif()"
        >
          Управление тарифом
        </button>
      </form>
    </div>
    <hr>
    <div class="text-left mt-6 mb-3 flex flex-wrap">
      <strong class="w-full">Фото</strong>
      <br>
      <div class="pr-2">
        <img
          :src="user.foto_link"
          width="110"
          height="110"
          class=" rounded-full  content-center float-left-"
        >
      </div>
      <div class="mt-[75px]">
        <input
          id="iconfile"
          type="file"
          class="hidden"
        >
        <label
          for="iconfile"
          class="bg-[#FF9123] rounded-xl px-3 p-2 text-white"
        >Выберите файл</label>
        <br>
      </div>
    </div>
    <strong>Имя пользователя</strong>
    <br>
    <span>{{ user.current_user_name }}</span>
    <br>
    <form>
      <button class="bg-[#FF9123] rounded-xl mt-2 px-3 p-2 text-white">
        Изменить имя
      </button>
    </form>
    <br>
    <strong>Email</strong>
    <br>
    <span>{{ user.current_user_email }}</span>
    <br>
    <br>
    <strong>Пароль</strong>
    <br>
    <form>
      <button class="bg-[#FF9123] mt-2 rounded-xl px-3 p-2 text-white">
        Изменить пароль
      </button>
    </form>
    <br>
    <form class="text-center">
      <button
        class="bg-[#FF9123] rounded-xl px-10 p-3 text-white"
        @click="logout()"
      >
        Выйти из аккаунта
      </button>
    </form>
  </form>
</template>
