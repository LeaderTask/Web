<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'

const localization = computed(() => store.state.localization.localization)

const store = useStore()
const user = computed(() => store.state.user.user)

</script>
<template>
  <form class="m-6 text-lg">
    <br>
    <strong>{{ localization.owner_license }}</strong>
    <br>
    <span>{{ user.owner_title }}</span>
    <br>
    <br>
    <br>
    <strong>Почта владельца лицензии</strong>
    <br>
    <span>{{ user.owner_email }}</span>
    <br>
    <br>
    <br>
    <strong>Количество рабочих мест</strong>
    <br>
    <span>18</span>
    <br>
    <br>
    <br>
    <strong>Занято места на сервере</strong>
    <br>
    <span>{{ user.total_mb }} {{ localization.megabytes }} ({{ user.percent_mb }}%)</span>
    <br>
    <br>
    <br>
    <strong>Последняя синхронизация</strong>
    <br>
    <span>синхронизация</span>
    <br>
  </form>
  <form
    class="text-center text-lg"
    action="https://www.leadertask.ru/market"
  >
    <button
      type="submit"
      class="bg-[#FF9123] rounded-xl px-10 p-3 text-white"
    >
      Продлить лицензию
    </button>
  </form>
</template>
