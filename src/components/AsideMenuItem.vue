<script setup>
import { ref, computed } from 'vue'
import { mdiMinus, mdiPlus } from '@mdi/js'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
const store = useStore()
const navStack = computed(() => store.state.navbar.navStack)
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSubmenuList: Boolean
})

const emit = defineEmits(['menu-click'])
const isDropdownActive = ref(false)
const componentIs = computed(() => (props.item.to ? 'router-link' : 'a'))
const hasDropdown = computed(() => !!props.item.menu)
const dropdownIcon = computed(() =>
  isDropdownActive.value ? mdiMinus : mdiPlus
)
const itemTo = computed(() => props.item.to || null)
const itemHref = computed(() => props.item.href || null)
const itemTarget = computed(() =>
  componentIs.value === 'a' && props.item.target ? props.item.target : null
)
const isActive = computed(() => props.item.uid === navStack.value[0].value.uid || props.item.label === navStack.value[0].name ? 1 : 0)

const menuClick = (event) => {
  emit('menu-click', event, props.item)

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value
  }
}

const styleActive = 'font-bold text-[#424242]'
const styleInactive = 'font-medium text-[#606061]'

</script>

<template>
  <li class="px-[16px]">
    <component
      :is="componentIs"
      v-slot="vSlot"
      :to="itemTo"
      :href="itemHref"
      :target="itemTarget"
      class="h-[40px] flex items-center cursor-pointer hover:bg-white hover:rounded-[10px]"
      :class="{
        'p-3 text-sm': isSubmenuList,
        'bg-white rounded-[10px]': isActive
      }"
      @click="menuClick"
    >
      <div class="flex items-center justify-center ml-[5px] mr-[8px]">
        <icon
          :path="item.icon"
          class="flex-none"
          :box="item.iconBox"
          :width="item.width"
          :height="item.height"
          :class="[isActive ? styleActive : styleInactive, item.iconBackgroundClass]"
        />
      </div>
      <span
        class="font-roboto text-[13px] leading-[15px]"
        :class="[isActive ? styleActive : styleInactive]"
      >
        {{ item.label }}
      </span>
      <icon
        v-if="hasDropdown"
        :path="dropdownIcon"
        class="flex-none"
        :class="[vSlot && vSlot.isExactActive ? styleActive : styleInactive]"
      />
    </component>
    <aside-menu-list
      v-if="hasDropdown"
      :menu="item.menu"
      :class="{
        hidden: !isDropdownActive,
        'block bg-gray-700 dark:bg-gray-800': isDropdownActive
      }"
      is-submenu-list
    />
  </li>
</template>
