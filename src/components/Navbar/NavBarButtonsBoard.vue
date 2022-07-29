<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-if="showDeleteBoard"
      title="Удалить доску"
      text="Вы действительно хотите удалить доску?"
      @cancel="showDeleteBoard = false"
      @yes="onDeleteBoard"
    />
    <PopMenu>
      <NavBarButtonIcon
        icon="filter"
        :colored="isFilterSet"
      />
      <template #menu>
        <PopMenuItem
          :icon="showOnlyCardsWhereIAmResponsible ? 'check' : 'uncheck'"
          @click="clickBoardMyCards"
        >
          Ответственный я
        </PopMenuItem>
        <PopMenuItem
          :icon="showOnlyCardsWithNoResponsible ? 'check' : 'uncheck'"
          @click="clickBoardNoResponsibleCards"
        >
          Нет ответственного
        </PopMenuItem>
        <PopMenuItem
          :icon="showOnlyMyCreatedCards ? 'check' : 'uncheck'"
          @click="clickBoardMyCardsCreated"
        >
          Создатель я
        </PopMenuItem>
        <PopMenuItem
          :icon="showArchive ? 'check' : 'uncheck'"
          @click="clickBoardArchive"
        >
          Архив
        </PopMenuItem>
        <PopMenuDivider
          v-if="isFilterSet"
        />
        <PopMenuItem
          v-if="isFilterSet"
          icon="uncheck"
          @click="clickBoardFilterClear"
        >
          Сбросить
        </PopMenuItem>
      </template>
    </PopMenu>
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          icon="edit"
          @click="clickEditBoard"
        >
          Свойства доски
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          @click="clickDeleteBoard"
        >
          Удалить доску
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
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'

import * as BOARD from '@/store/actions/boards'
import { NAVIGATOR_REMOVE_BOARD } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxDelete
  },
  props: {
    boardUid: {
      type: String,
      default: ''
    }
  },
  emits: ['popNavBar'],
  data () {
    return {
      showDeleteBoard: false
    }
  },
  computed: {
    board () {
      return this.$store.state.boards.boards[this.boardUid]
    },
    canDelete () {
      return this.board?.email_creator === this.$store.state.user.user?.current_user_email
    },
    showArchive () {
      return this.$store.state.boards.showArchive
    },
    showOnlyCardsWhereIAmResponsible () {
      return this.$store.state.boards.showOnlyCardsWhereIAmResponsible
    },
    showOnlyCardsWithNoResponsible () {
      return this.$store.state.boards.showOnlyCardsWithNoResponsible
    },
    showOnlyMyCreatedCards () {
      return this.$store.state.boards.showOnlyMyCreatedCards
    },
    isFavorite () {
      return this.board?.favorite
    },
    isFilterSet () {
      return this.showOnlyMyCreatedCards || this.showOnlyCardsWhereIAmResponsible || this.showArchive || this.showOnlyCardsWithNoResponsible
    }
  },
  methods: {
    clickEditBoard () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'board' })
      this.$store.commit(BOARD.SELECT_BOARD, this.board)
    },
    clickDeleteBoard () {
      this.showDeleteBoard = true
    },
    onDeleteBoard () {
      this.showDeleteBoard = false
      //
      this.$store.dispatch(BOARD.REMOVE_BOARD_REQUEST, this.boardUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(BOARD.SELECT_BOARD, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_BOARD, this.board)
          // для актуального значения количества досок
          this.$store.commit(BOARD.REMOVE_BOARD_REQUEST, this.boardUid)
          //
          this.$emit('popNavBar')
        })
    },
    clickBoardMyCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, !this.showOnlyCardsWhereIAmResponsible)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, false)
    },
    clickBoardNoResponsibleCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, false)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, !this.showOnlyCardsWithNoResponsible)
    },
    clickBoardMyCardsCreated () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CREATED_CARDS, !this.showOnlyMyCreatedCards)
    },
    clickBoardArchive () {
      this.$store.commit(BOARD.SHOW_BOARD_ARCHIVE, !this.showArchive)
    },
    clickBoardFilterClear () {
      this.$store.commit(BOARD.BOARD_CLEAR_FILTER)
    },
    favoriteToggle () {
      if (!this.isFavorite) {
        this.$store.dispatch(BOARD.ADD_BOARD_TO_FAVORITE, this.board)
          .then(res => {
            this.board.favorite = res.data.favorite
          })
      } else {
        this.$store.dispatch(BOARD.REMOVE_BOARD_FROM_FAVORITE, this.board)
          .then(res => {
            this.board.favorite = res.data.favorite
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
