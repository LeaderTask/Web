<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
import Overlay from '@/components/Overlay.vue'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

const store = useStore()

console.log('localization request', LOCALIZATION_REQUEST)
store.dispatch(LOCALIZATION_REQUEST)

const menu = computed(() => store.state.navigator.menu)
const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}

</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  <!-- <footer-bar /> -->
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
  <properties-right />
  <NotificationGroup
    group="api"
    position="bottom"
  >
    <div class="fixed inset-x-0 bottom-0 flex items-start justify-end p-6 px-4 py-6 z-49" style="position: relative;">
      <div class="w-full max-w-sm">
        <Notification
          v-slot="{ notifications, close }"
          enter="ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
          move="transition duration-500"
          move-delay="delay-300"
        >
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
          >
            <div class="flex items-center justify-center w-12 bg-red-500">
              <svg
                class="w-6 h-6 text-white fill-current"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-sm text-red-500">{{ notification.title }}</span>
                <p
                  v-if="notification.action"
                  class="font-semibold text-sm text-orange-500"
                >
                  {{ notification.action }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ notification.text }}
                </p>
              </div>
            </div>
            <div class="flex ml-5 shrink-0">
              <button
                class="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 m-2"
                @click="close(notification.id)"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>
</template>
