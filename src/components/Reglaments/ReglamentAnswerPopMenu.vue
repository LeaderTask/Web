<template>
  <PopMenu>
    <div
      class="cursor-pointer invisible group-hover:visible mt-[3px]"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          :fill="'#7e7e80'"
          d="M9.35524 16.6055C8.37421 16.6055 7.57892 15.8102 7.57892 14.8291C7.57892 13.8481 8.37421 13.0528 9.35524 13.0528C10.3363 13.0528 11.1316 13.8481 11.1316 14.8291C11.1316 15.8102 10.3363 16.6055 9.35524 16.6055ZM9.35524 11.2765C8.37421 11.2765 7.57892 10.4812 7.57892 9.50016C7.57892 8.51912 8.37421 7.72383 9.35524 7.72383C10.3363 7.72383 11.1316 8.51912 11.1316 9.50016C11.1316 10.4812 10.3363 11.2765 9.35524 11.2765ZM7.57892 4.17118C7.57892 5.15222 8.37421 5.9475 9.35524 5.9475C10.3363 5.9475 11.1316 5.15222 11.1316 4.17118C11.1316 3.19015 10.3363 2.39486 9.35524 2.39486C8.37421 2.39486 7.57892 3.19015 7.57892 4.17118Z"
        />
      </svg>
    </div>
    <template #menu>
      <PopMenuItem
        v-show="isEditing"
        icon="check"
        @click="$emit('setRightAnswer')"
      >
        Отметить
      </PopMenuItem>
      <PopMenuItem
        v-show="isEditing"
        icon="close"
        @click="$emit('resetRightAnswer')"
      >
        Cбросить
      </PopMenuItem>
      <PopMenuItem
        v-show="isEditing"
        icon="delete"
        @click="$emit('deleteAnswer')"
      >
        Удалить
      </PopMenuItem>
    </template>
  </PopMenu>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
export default {
  components: {
    PopMenu,
    PopMenuItem
  },
  props: {
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deleteAnswer', 'setRightAnswer', 'resetRightAnswer']
}

</script>

<style>
</style>
