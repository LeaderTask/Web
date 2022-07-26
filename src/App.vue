<script setup>

import { useStore } from 'vuex'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

// очищаем консоль - по идее выше ошибки которые
// мы не можем поправить из fm.websync и fm.min
// по этому консоль очищаем
console.clear()

const store = useStore()

store.dispatch(LOCALIZATION_REQUEST)

const fm = document.createElement('script')
fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
fm.onload = () => {
  // подключаем скрыпты в правильном порядке - сначала fm.min потом fm.websync.min
  const websync = document.createElement('script')
  websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
  document.head.appendChild(websync)
}
document.head.appendChild(fm)

</script>

<template>
  <router-view />
</template>
