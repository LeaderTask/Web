<script setup>
import Overlay from './Overlay.vue'

const mobilePageView = () => {
  let currentMobileOC = ''
  if (window.innerWidth < 770) {
    if (navigator.appVersion.includes('Android')) {
      currentMobileOC = 'android'
    }
    if (navigator.appVersion.includes('iPhone')) {
      currentMobileOC = 'ios'
    }
  }

  return currentMobileOC
}
</script>

<template>
  <div v-if="mobilePageView()">
    <overlay @overlay-click="cancel">
      <div
        class="rounded-[20px] bg-white dark:bg-zinc-900 shadow-lg w-9/12 md:w-4/5 lg:w-3/5 z-50 h-[30%]"
      >
        <div class="w-auto !important ">
          <div class="social ">
            <div class="title text-center text-3xl py-1 mb-2.5 cursor-auto text-stone-700">
              <strong>Скачайте наше приложение на Ваш смартфон!</strong>
            </div>
            <ul class="flex justify-center ">
              <li
                v-if="mobilePageView() == 'android'"
                class="android   "
                title="Android"
              >
                <a
                  class="h-[50px ] w-[50px] text-[0] ml-1 flex items-center  "
                  href="https://play.google.com/store/apps/details?id=com.ashberrysoft.leadertask&utm_source=leadertask.ru"
                  target="_blank"
                >
                  <img
                    class="p-0 w-[50px] h-[50px]"

                    src="https://www.leadertask.ru/local/media/icons/android-platform.svg"
                    alt="android"
                  >
                </a>
              </li>
              <li
                v-if="mobilePageView() == 'ios'"
                class="ios "
                title="ios"
              >
                <a
                  class="h-[50px ] w-[50px] text-[0] ml-1 flex items-center pr-[10%]"
                  href="https://apps.apple.com/ru/app/leadertask/id648864820?ls=1"
                  title="ios"
                  target="_blank"
                >
                  <img
                    class="p-0 w-[50px] h-[50px]"
                    src="https://www.leadertask.ru/local/media/icons/ios-platform.svg"
                    alt="ios"
                  >
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </overlay>
  </div>
</template>
