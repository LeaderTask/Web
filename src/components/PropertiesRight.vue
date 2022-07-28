<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import TaskProperties from '@/components/properties/TaskProperties.vue'
import CardProperties from '@/components/properties/CardProperties.vue'
import ProjectProperties from '@/components/properties/ProjectProperties.vue'
import ReglamentProperties from '@/components/properties/ReglamentProperties.vue'
import BoardProperties from '@/components/properties/BoardProperties.vue'
import ColorProperties from '@/components/properties/ColorProperties.vue'
import TagProperties from '@/components/properties/TagProperties.vue'
import EmployeeProperties from '@/components/properties/EmployeeProperties.vue'

export default {
  components: {
    TaskProperties,
    CardProperties,
    ProjectProperties,
    ReglamentProperties,
    BoardProperties,
    ColorProperties,
    TagProperties,
    EmployeeProperties
  },
  data: () => {
    const store = useStore()
    const selectedTask = computed(() => store.state.tasks.selectedTask)
    const propertiesState = computed(() => store.state.propertiesState)
    return {
      close,
      propertiesState,
      selectedTask,
      isFullScreen: computed(() => store.state.isFullScreen),
      isPropertiesMobileExpanded: computed(() => store.state.isPropertiesMobileExpanded)
    }
  },
  methods: {
  }
}
</script>
<template>
  <aside
    id="aside-right"
    class="bg-[#f4f5f7] w-[388px] fixed top-0 h-full transition-position z-[2]"
    :class="{ 'block right-0': isPropertiesMobileExpanded, 'hidden -right-[388px]': !isPropertiesMobileExpanded}"
  >
    <!-- серый отступ в 8px слева, чтобы когда панель налетала на белый элемент она не сливалась -->
    <div class="bg-white pt-[20px] px-[20px] ml-[8px] min-h-full h-auto w-[380px]">
      <TaskProperties
        v-if="propertiesState == 'task'"
      />
      <CardProperties
        v-if="propertiesState == 'card'"
      />
      <ProjectProperties
        v-if="propertiesState == 'project'"
      />
      <ReglamentProperties
        v-if="propertiesState == 'reglament'"
      />
      <BoardProperties
        v-if="propertiesState == 'board'"
      />
      <ColorProperties
        v-if="propertiesState == 'color'"
      />
      <TagProperties
        v-if="propertiesState == 'tag'"
      />
      <EmployeeProperties
        v-if="propertiesState == 'employee'"
      />
    </div>
  </aside>
</template>
<style scoped>
#aside-right {
  overflow-x: hidden;
  scrollbar-width: none;
}
</style>
