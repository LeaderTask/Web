<template>
  <div class="w-full">
    <BoardModalBoxRename
      v-if="showAddReglament"
      :show="showAddReglament"
      title="Создать регламент"
      @cancel="showAddReglament = false"
      @save="onAddNewReglament"
    />
    <div>
      <div class="flex justify-between w-full">
        <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
          Регламенты
        </p>
        <div class="flex">
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
        class="grid gap-2 mt-3"
        :class="{
          'md:grid-cols-2 lg:grid-cols-4': isGridView,
          'grid-cols-1': !isGridView,
          'grid-cols-1': isPropertiesMobileExpanded && !isGridView,
          'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
        }"
      >
        <template
          v-for="reglament in items"
          :key="reglament.uid"
        >
          <ReglamentBlocItem
            :reglament="reglament"
            @click.stop="gotoReglamentContent(reglament)"
          />
        </template>
        <ListBlocAdd
          @click.stop="clickAddReglament"
        />
      </div>
    </div>
  </div>
  <EmptyTasksListPics v-if="isEmpty" />
</template>

<script>
import Icon from '@/components/Icon.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import ReglamentBlocItem from '@/components/Reglaments/ReglamentBlockItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'

import * as TASK from '@/store/actions/tasks'
import * as NAVIGATOR from '@/store/actions/navigator'
import * as REGLAMENTS from '@/store/actions/reglaments'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
export default {
  components: {
    Icon,
    BoardModalBoxRename,
    ReglamentBlocItem,
    ListBlocAdd,
    EmptyTasksListPics
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showAddReglament: false,
      gridView,
      listView
    }
  },
  computed: {
    isGridView () {
      setLocalStorageItem('isGridView', true)
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isEmpty () {
      return !this.items.length
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    user () {
      return this.$store.state.user.user
    },
    reglaments () {
      return this.navStack[0].items
    }
  },
  created () {
    setLocalStorageItem('isGridView', true)
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    gotoReglamentContent (reglament) {
      this.$store.commit('basic', {
        key: 'reglamentSource',
        value: { uid: '92413f6c-2ef3-476e-9429-e76d7818685d', param: reglament.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: reglament.name,
        key: 'greedSource',
        uid: reglament.uid,
        global_property_uid: '92413f6c-2ef3-476e-9429-e76d7818685d',
        greedPath: 'reglament_content',
        value: []
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: reglament })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglament_content' })
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    clickAddReglament () {
      this.showAddReglament = true
    },
    onAddNewReglament (name) {
      this.showAddReglament = false
      const title = name.trim()
      if (title) {
        const reglament = {
          bold: 0,
          color: '',
          organization: this.user.owner_email,
          email_creator: this.user.current_user_email,
          name: title,
          content: '',
          uid: this.uuidv4()
        }

        this.$store.dispatch(REGLAMENTS.CREATE_REGLAMENT_REQUEST, reglament).then(() => {
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_REGLAMENT, reglament)
          this.gotoReglamentContent(reglament)
        })
      }
    }
  }
}
</script>

<style scoped></style>
