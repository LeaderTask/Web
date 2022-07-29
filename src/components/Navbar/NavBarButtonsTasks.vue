<template>
  <div class="flex items-center gap-[10px]">
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          @click="clickCompletedTasks"
        >
          {{ showCompletedTasks ? 'Скрыть завершенные задачи' : 'Показать завершенные задачи' }}
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem
  },
  props: {
    showCompletedTasks: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggleCompletedTasks'],
  methods: {
    clickCompletedTasks () {
      this.$emit('toggleCompletedTasks')
    }
  }
}
</script>

<style>

</style>
