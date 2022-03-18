<script setup>
import { mdiCog } from '@mdi/js'
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import { useStore } from 'vuex'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  headerIcon: {
    type: String,
    default: null
  },
  rounded: {
    type: String,
    default: 'rounded-md'
  },
  hasTable: Boolean,
  empty: Boolean,
  form: Boolean,
  hoverable: Boolean
})

const emit = defineEmits(['header-icon-click', 'acc', 'tarif', 'submit'])

const is = computed(() => props.form ? 'form' : 'div')

const store = useStore()

const user = computed(() => store.state.user.user)

const componentClass = computed(() => {
  const base = [
    props.rounded
  ]

  if (props.hoverable) {
    base.push('hover:shadow-lg transition-shadow duration-500')
  }

  return base
})

const computedHeaderIcon = computed(() => props.headerIcon ?? mdiCog)

const acc = () => {
  emit('acc')
}
const tarif = () => {
  emit('tarif')
}
const headerIconClick = () => {
  emit('header-icon-click')
}
const submit = e => {
  emit('submit', e)
}
</script>

<template>
  <component
    :is="is"
    :class="componentClass"
    class="bg-white dark:bg-zinc-900s"
    @submit="submit"
  >
<fieldset class="flex h-full">
<form
class=" bg-gray-100 rounded-l-md pd-0 pr-6 pt-3"
v-if="title">
<h1 class="pl-3 pb-5">Настройки</h1>
<div>
  <div class="pl-6 pb-2">
    <button @click="acc" type="button">
      Аккаунт
    </button>
  </div>
  <div class="pl-6 pb-2">
    <button @click="tarif" type="button">
      Тариф
    </button>
  </div>
  <div class="pl-6 pb-2" >
    <button type="button">
      Основное
    </button>
  </div>
</div>
    </form>
    <div class="w-full flex-wrap">
    <header
      v-if="title"
      :class="{'bg-[#FFF2E0]': user.license_type == 0, 'bg-[#FFF2E0]': user.license_type == 1, 'bg-[#FFF2E0]': user.license_type == 2, 'bg-[#FFF2E0]': user.license_type == 3}"
      class=" flex w-full h-[10%] items-stretch pb-4 mb-2 mt-3 w-full border-b-[1px] border-gray-100 dark:border-gray-700"
    >
      <p
        class=" text-center items-center w-fit py-3 grow font-bold"
        :class="[ icon ? 'px-4' : 'px-6' ]"
      >
        <icon
          v-if="icon"
          :path="icon"
          class="mr-3"
        />
        {{ title }}
      </p>
      <a v-if="computedHeaderIcon"
      href="#"
      class="flex items-center py-3 px-4 justify-center ring-blue-700 focus:ring"
      aria-label="more options"
      @click="headerIconClick">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.0811 23.7778H3.40141C2.79878 23.7778 2.34681 23.2882 2.34681 22.7232V3.40144C2.34681 2.83648 2.83645 2.34684 3.40141 2.34684H13.0435C13.6461 2.34684 14.0981 1.85721 14.0981 1.29224C14.0981 0.727281 13.6461 0.199982 13.0811 0.199982H3.40141C1.63119 0.199982 0.199951 1.63122 0.199951 3.40144V22.6855C0.199951 24.4557 1.63119 25.887 3.40141 25.887H13.0435C13.6461 25.887 14.0981 25.3974 14.0981 24.8324C14.1357 24.2674 13.6461 23.7778 13.0811 23.7778Z" fill="#000000E5"/>
        <path d="M25.6986 12.2902L19.1827 5.88728C18.7684 5.47297 18.0905 5.47297 17.6762 5.88728C17.2618 6.30159 17.2618 6.97954 17.6762 7.39385L22.3465 11.9889H9.84199C9.23937 11.9889 8.7874 12.4785 8.7874 13.0435C8.7874 13.6084 9.23937 14.1357 9.84199 14.1357H22.3089L17.6762 18.7308C17.2618 19.1451 17.2618 19.823 17.6762 20.2374C17.9021 20.4633 18.1658 20.5387 18.4294 20.5387C18.6931 20.5387 18.9567 20.4257 19.1827 20.2374L25.6986 13.7968C25.887 13.6084 26 13.3071 26 13.0435C26 12.7798 25.9246 12.5162 25.6986 12.2902Z" fill="#000000E5"/>
        </svg>
      </a>
    </header>
    <div
      v-if="empty"
     b class="text-center py-24 text-gray-500 dark:text-gray-400"
    >
      <p>Nothing's here…</p>
    </div>
    <div
      v-else
      class=""
      :class="{'p-6':!hasTable ,'overflow-y-scroll max-h-[85%]':hasTable}"
    >
      <slot />
    </div>
  </div>
  </fieldset>
  </component>
</template>
