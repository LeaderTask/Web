<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-if="showDeleteProject"
      title="Удалить регламент"
      text="Вы действительно хотите удалить регламент?"
      @cancel="showDeleteProject = false"
      @yes="onDeleteProject"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          icon="edit"
          @click="clickEditProject"
        >
          Свойства регламента
        </PopMenuItem>
        <PopMenuItem
          @click="сlickCopyLink"
        >
          Скопировать ссылку на регламент
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import { copyText } from 'vue3-clipboard'
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'

import { SELECT_PROJECT, REMOVE_PROJECT_REQUEST } from '@/store/actions/projects'
import { NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
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
    }
  },
  methods: {
    clickEditProject () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'reglament' })
      this.$store.commit(SELECT_PROJECT)
    },
    сlickCopyLink () {
      copyText(`${window.location.origin}/reglament/${this.projectUid}`, undefined, (error, event) => {
        console.log(error, event)
      })
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
    }
  }
}
</script>

<style scoped>

</style>
