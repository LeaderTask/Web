<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import PopMenuHeader from '@/components/modals/PopMenuHeader.vue'
defineEmits(['clickRemoveButton', 'toggleShowOnlyFiles'])

const store = useStore()

const props = defineProps({
  dateCreate: String,
  showFilesOnly: Boolean,
  creator: String,
  canEdit: Boolean
})

const employees = computed(() => store.state.employees.employees)

const cardDateCreate = computed(() => {
  return new Date(props.dateCreate).toLocaleString()
})

</script>
<template>
  <div class="flex items-center bg-[#F4F5F7] rounded-[6px] text-[#575758] text-[12px] font-[500]">
    <PopMenu>
      <div class="px-[13px] py-[5px] cursor-pointer">
        <svg
          width="4"
          height="16"
          viewBox="0 0 4 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12C3.10457 12 4 12.8954 4 14C4 15.1046 3.10457 16 2 16C0.89543 16 0 15.1046 0 14C0 12.8954 0.89543 12 2 12Z"
            fill="#7F7F80"
          />
          <path
            d="M2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10C0.89543 10 0 9.10457 0 8C0 6.89543 0.89543 6 2 6Z"
            fill="#7F7F80"
          />
          <path
            d="M2 0C3.10457 0 4 0.895431 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.895431 0.89543 0 2 0Z"
            fill="#7F7F80"
          />
        </svg>
      </div>
      <template #menu>
        <PopMenuHeader
          title="Дата создания:"
        >
          {{ cardDateCreate }}
        </PopMenuHeader>
        <PopMenuHeader
          title="Автор:"
        >
          <div class="flex items-center">
            <img
              class="rounded-lg h-[14px] w-[14px]"
              :src="employees[creator]?.fotolink"
            >
            <span class="ml-1">{{ employees[creator]?.name }}</span>
          </div>
        </PopMenuHeader>
        <PopMenuItem
          v-if="!props.showFilesOnly"
          @click="$emit('toggleShowOnlyFiles')"
        >
          Показать только файлы
        </PopMenuItem>
        <PopMenuItem
          v-if="props.showFilesOnly"
          @click="$emit('toggleShowOnlyFiles')"
        >
          Отображать файлы и сообщения
        </PopMenuItem>
        <PopMenuItem
          v-if="props.canEdit"
          @click="$emit('clickRemoveButton')"
        >
          Удалить
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>
