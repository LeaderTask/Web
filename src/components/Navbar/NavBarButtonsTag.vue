<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-if="showDeleteTag"
      title="Удалить метку"
      text="Вы действительно хотите удалить метку?"
      @cancel="showDeleteTag = false"
      @yes="onDeleteTag"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem @click="clickCompletedTasks">
          {{
            showCompletedTasks
              ? 'Скрыть завершенные задачи'
              : 'Показать завершенные задачи'
          }}
        </PopMenuItem>
        <PopMenuDivider />
        <PopMenuItem
          icon="edit"
          @click="clickEditTag"
        >
          Свойства метки
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          @click="clickDeleteTag"
        >
          Удалить метку
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

import { SELECT_TAG, REMOVE_TAG_REQUEST } from '@/store/actions/tasks'
import { NAVIGATOR_REMOVE_TAG } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxDelete
  },
  props: {
    tagUid: {
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
      showDeleteTag: false
    }
  },
  computed: {
    tag () {
      return this.$store.state.tasks.tags[this.tagUid]
    },
    mytags () {
      function getAllChilds (arr, obj) {
        arr.forEach((tag) => {
          obj[tag.uid] = tag
          getAllChilds(tag.children, obj)
        })
      }
      const navigatorTagsArray = this.$store.state.navigator?.navigator?.tags?.items ?? []
      const mytags = {}
      getAllChilds(navigatorTagsArray, mytags)
      return mytags
    },
    canDelete () {
      return this.mytags[this.tagUid] !== undefined
    }
  },
  methods: {
    clickEditTag () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'tag' })
      this.$store.commit(SELECT_TAG, this.tag)
    },
    clickDeleteTag () {
      this.showDeleteTag = true
    },
    onDeleteTag () {
      this.showDeleteTag = false
      //
      this.$store.dispatch(REMOVE_TAG_REQUEST, this.tagUid).then(() => {
        this.$store.dispatch('asidePropertiesToggle', false)
        this.$store.commit(SELECT_TAG, undefined)
        //
        this.$store.commit(NAVIGATOR_REMOVE_TAG, this.tag)
        // для актуального значения количества цветов
        this.$store.commit(REMOVE_TAG_REQUEST, this.tagUid)
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

<style scoped></style>
