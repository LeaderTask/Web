<template>
  <div class="w-full h-full flex flex-col">
    <BoardModalBoxRename
      v-if="showAddBoard"
      :show="showAddBoard"
      title="Добавить доску"
      @cancel="showAddBoard = false"
      @save="onAddNewBoard"
    />
    <BoardModalBoxBoardsLimit
      v-if="showBoardsLimit"
      @cancel="showBoardsLimit = false"
      @ok="showBoardsLimit = false"
    />
    <div class="grid gap-2 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <template
        v-for="(board, pindex) in boards"
        :key="pindex"
      >
        <BoardBlocItem
          :board="board"
          @click.stop="gotoChildren(board)"
        />
      </template>
      <ListBlocAdd
        v-if="canAddChild"
        @click.stop="clickAddBoard"
      />
    </div>
    <div class="mt-5 h-full min-h-0">
      <Board
        :store-cards="storeCards"
        :board="currentBoard"
      />
    </div>
  </div>
</template>

<script>
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import Board from '@/components/Board.vue'
import * as CARD from '@/store/actions/cards'
import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    BoardModalBoxRename,
    BoardModalBoxBoardsLimit,
    BoardBlocItem,
    ListBlocAdd,
    Board
  },
  props: {
    boards: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
    }
  },
  computed: {
    currentBoard () {
      const boards = this.$store.state.boards.boards
      const navStack = this.$store.state.navbar.navStack
      const currBoardUid = navStack[navStack.length - 1].uid
      const board = boards[currBoardUid]
      return board
    },
    canAddChild () {
      const user = this.$store.state.user.user
      return this.currentBoard?.email_creator === user.current_user_email
    },
    storeCards () {
      return this.$store.state.cards.cards
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    gotoChildren (board) {
      this.$store.dispatch(CARD.BOARD_CARDS_REQUEST, board.uid)
      this.$store.commit('basic', {
        key: 'cardSource',
        value: { uid: board.global_property_uid, param: board.uid }
      })
      // store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: board.name,
        key: 'greedSource',
        uid: board.uid,
        global_property_uid: board.global_property_uid,
        greedPath: 'boards_children',
        value: board.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: board.children })
      this.$store.commit('basic', {
        key: 'greedPath',
        value: 'boards_children'
      })
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    clickAddBoard () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.boards.boards).length >= 3 && user.days_left <= 0) {
        this.showBoardsLimit = true
        return
      }
      this.showAddBoard = true
    },
    onAddNewBoard (name) {
      this.showAddBoard = false
      const title = name.trim()
      if (title) {
        // добавляем новую доску и переходим в неё
        const maxOrder =
          this.currentBoard?.children?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) ?? 0
        const user = this.$store.state.user.user
        const members = {}
        members[user.current_user_uid] = 1
        const board = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: this.currentBoard.uid,
          email_creator: user.current_user_email,
          order: maxOrder + 1,
          collapsed: 0,
          color: '',
          public_link_status: 0,
          show_date: 0,
          favorite: 0,
          stages: [],
          children: [],
          members
        }
        console.log(`create board uid: ${board.uid}`, board)
        this.$store.dispatch(BOARD.CREATE_BOARD_REQUEST, board).then((res) => {
          // заполняем недостающие параметры
          board.global_property_uid = '1b30b42c-b77e-40a4-9b43-a19991809add'
          board.type_access = res.data.type_access
          board.color = '#A998B6'
          //
          this.$store.commit(BOARD.PUSH_BOARD, [board])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_BOARD, [board])
          this.gotoChildren(board)
        })
      }
    }
  }
}
</script>

<style scoped></style>
