<script setup>

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { AUTH_LOGOUT } from '@/store/actions/auth'

const localization = computed(() => store.state.localization.localization)

const store = useStore()
const router = useRouter()
const user = computed(() => store.state.user.user)
let modalOneActive = ref(false)

const logout = () => {
  modalOneActive = false
  store.dispatch(AUTH_LOGOUT)
  router.push('/login')
}

</script>

<template>
<form class="mx-12 overscroll-auto h-4/5">
  <div class="flex pb-6">
    <form class="text-left w-3/4">
      <strong>Тариф</strong>
      <br>
      <p v-if="user.license_type === 0">Пробный</p>
      <p v-if="user.license_type === 1">Премиум</p>
      <p v-if="user.license_type === 2">Бизнесс</p>
      <a>{{ user.date_expired }}({{ user.days_left }})</a>
    </form>
    <form class="text-right w-1/4">
      <button class="bg-[#FF9123] rounded-xl p-3 text-white py-2 mt-4 px-3" type="button">
        Управление тарифом
      </button>
    </form>
  </div>
  <hr>
  <div class="text-left mt-6 flex flex-wrap">
    <strong class="w-full">Фото</strong>
    <div class="pr-2">
      <img
      :src="user.foto_link"
      width="80"
      height="80"
      class=" rounded-full  content-center float-left-">
    </div>
    <div class="mt-[20px]">
      <button
      class="bg-[#FF9123] rounded-xl px-3 p-2 text-white">
      Загрузить фото
      </button>
      <br>
      <a>Разрешённый размер</a>
    </div>
  </div>
  <br>
    <strong>Имя пользователя</strong>
    <br>
    <span>{{ user.current_user_name }}</span>
    <br>
    <form>
      <button class="bg-[#FF9123] rounded-xl px-3 p-2 text-white">Изменить имя</button>
    </form>
    <br>
    <strong>Email</strong>
    <br>
    <span>{{ user.owner_email }}</span>
    <br>
    <br>
    <strong>Пароль</strong>
    <br>
    <form>
      <button class="bg-[#FF9123] rounded-xl px-3 p-2 text-white">Изменить пароль</button>
    </form>
    <br>
    <form class="text-center">
      <button class="bg-[#FF9123] rounded-xl px-10 p-3 text-white"
      @click="logout()">
      Выйти из аккаунта</button>
    </form>
    <hr class="my-3">
    <strong>{{ localization.owner_license }}</strong>
    <br>
    <span>{{ user.owner_title }}</span>
    <br>
    <br>
    <strong>Количество рабочих мест</strong>
    <br>
    <span>18</span>
    <br>
    <br>
    <strong>Занято места на сервере</strong>
    <br>
    <span>{{ user.total_mb }} {{ localization.megabytes }} ({{ user.percent_mb }}%)</span>
    <br>
    <br>
    <strong>Последняя синхронизация</strong>
    <br>
    <span>синхронизация</span>
    <br>
</form>
<form class="text-center" action="https://www.leadertask.ru/market">
  <button type="submit" class="bg-[#FF9123] rounded-xl px-10 p-3 text-white">
    Продлить лицензию
  </button>
</form>
</template>
