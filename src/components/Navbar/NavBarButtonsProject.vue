<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-if="showDeleteProject"
      title="Удалить проект"
      text="Вы действительно хотите удалить проект?"
      @cancel="showDeleteProject = false"
      @yes="onDeleteProject"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          @click="clickCompletedTasks"
        >
          {{ showCompletedTasks ? 'Скрыть завершенные задачи' : 'Показать завершенные задачи' }}
        </PopMenuItem>
        <PopMenuDivider />
        <PopMenuItem
          icon="edit"
          @click="clickEditProject"
        >
          Свойства проекта
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          @click="clickDeleteProject"
        >
          Удалить проект
        </PopMenuItem>
        <PopMenuItem
          @click="favoriteToggle"
        >
          {{ !isFavorite ? 'Добавить в избранное' : 'Удалить из избранного' }}
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import PopMenuDivider from '@/components/modals/PopMenuDivider.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'

import {
  ADD_PROJECT_TO_FAVORITE,
  REMOVE_PROJECT_FROM_FAVORITE,
  REMOVE_PROJECT_REQUEST,
  SELECT_PROJECT
} from '@/store/actions/projects'
import { NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxDelete
  },
  props: {
    projectUid: {
      type: String,
      default: ''
    },
    showCompletedTasks: {
      type: Boolean,
      default: false
    }
  },
  emits: ['popNavBar', 'toggleCompletedTasks'],
  data () {
    return {
      showDeleteProject: false
    }
  },
  computed: {
    project () {
      return this.$store.state.projects.projects[this.projectUid]
    },
    canDelete () {
      return this.project?.email_creator === this.$store.state.user?.user?.current_user_email
    },
    isFavorite () {
      return this.project?.favorite
    }
  },
  methods: {
    clickEditProject () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'project' })
      this.$store.commit(SELECT_PROJECT, this.project)
    },
    clickDeleteProject () {
      this.showDeleteProject = true
    },
    onDeleteProject () {
      this.showDeleteProject = false
      //
      this.$store.dispatch(REMOVE_PROJECT_REQUEST, this.projectUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(SELECT_PROJECT, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.project)
          // для актуального значения количества проектов
          this.$store.commit(REMOVE_PROJECT_REQUEST, this.projectUid)
          //
          this.$emit('popNavBar')
        })
    },
    clickCompletedTasks () {
      this.$emit('toggleCompletedTasks')
    },
    favoriteToggle () {
      if (!this.isFavorite) {
        this.$store.dispatch(ADD_PROJECT_TO_FAVORITE, this.project)
          .then(res => {
            this.project.favorite = res.data.favorite
          })
      } else {
        this.$store.dispatch(REMOVE_PROJECT_FROM_FAVORITE, this.project)
          .then(res => {
            this.project.favorite = res.data.favorite
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
