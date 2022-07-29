<template>
  <div class="flex items-center gap-[10px]">
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить регламент"
      :text="`Вы действительно хотите удалить регламент ${currentReglament.name}?`"
      @cancel="showConfirm = false"
      @yes="removeReglament"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          @click="сlickCopyLink"
        >
          Скопировать ссылку на регламент
        </PopMenuItem>
        <PopMenuItem
          v-if="canEdit"
          icon="delete"
          @click="showConfirm = true"
        >
          Удалить
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import { copyText } from 'vue3-clipboard'
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

import { DELETE_REGLAMENT_REQUEST } from '@/store/actions/reglaments'
import { NAVIGATOR_REMOVE_REGLAMENT } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    ModalBoxDelete
  },
  props: {
    reglamentUid: {
      type: String,
      default: ''
    }
  },
  emits: ['popNavBar', 'toggleCompletedTasks'],
  data () {
    return {
      showConfirm: false
    }
  },
  computed: {
    currentReglament () {
      return this.$store.state.greedSource
    },
    user () {
      return this.$store.state.user?.user
    },
    canEdit () {
      return (this.currentReglament?.email_creator?.toLowerCase() === this.user?.current_user_email?.toLowerCase()) || (this.user?.current_user_email?.toLowerCase() === this.user?.owner_email?.toLowerCase())
    }
  },
  methods: {
    removeReglament () {
      this.showConfirm = false

      this.$store.dispatch(DELETE_REGLAMENT_REQUEST, this.currentReglament.uid).then(() => {
        this.$store.dispatch('asidePropertiesToggle', false)
        this.$store.commit(NAVIGATOR_REMOVE_REGLAMENT, this.currentReglament)
        this.$store.dispatch('popNavStack')
      })
    },
    сlickCopyLink () {
      copyText(`${window.location.origin}/reglament/${this.reglamentUid}`, undefined, (error, event) => {
        console.log(error, event)
      })
    }
  }
}
</script>

<style scoped>

</style>
