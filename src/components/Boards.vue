<template>
  <div class="w-full">
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
    <div
      v-for="(value, index) in boards"
      :key="index"
    >
      <div
        class="flex items-center w-full"
        :class="{ 'justify-between': index == 0, 'mt-[28px]': index == 1 }"
      >
        <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
          {{ value.dep }}
        </p>
        <div
          v-if="index == 0"
          class="flex"
        >
          <icon
            :path="listView.path"
            :width="listView.width"
            :height="listView.height"
            :box="listView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': !isGridView,
              'text-gray-400': isGridView
            }"
            @click="updateGridView(false)"
          />
          <icon
            :path="gridView.path"
            :width="gridView.width"
            :height="gridView.height"
            :box="gridView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': isGridView,
              'text-gray-400': !isGridView
            }"
            @click="updateGridView(true)"
          />
        </div>
      </div>
      <div
        class="grid gap-2 mt-3 grid-cols-1"
        :class="{
          'md:grid-cols-2 lg:grid-cols-4': isGridView,
          'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
        }"
      >
        <template
          v-for="board in value.items"
          :key="board.uid"
        >
          <BoardBlocItem
            :board="board"
            @click.stop="gotoChildren(board)"
          />
        </template>
        <ListBlocAdd
          v-if="index == 0"
          @click.stop="clickAddBoard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import * as CARD from '@/store/actions/cards.js'
import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

export default {
  components: {
    Icon,
    BoardModalBoxRename,
    BoardModalBoxBoardsLimit,
    BoardBlocItem,
    ListBlocAdd
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
      showBoardsLimit: false,
      gridView,
      listView
    }
  },
  computed: {
    isGridView () {
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
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
          this.boards[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const user = this.$store.state.user.user
        const members = {}
        members[user.current_user_uid] = 1
        const board = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
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
