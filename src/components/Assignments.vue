<template>
  <div class="w-full">
    <div
      v-for="(value, index) in assignments"
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
          v-for="user in value.items"
          :key="user.uid"
        >
          <ListBlocItem
            :color="index ? '#ec452e': '#3fbf64'"
            :title="user.name"
            :sub-title="user.email"
            @click.stop="gotoChildren(user)"
          >
            <img
              v-if="user.fotolink"
              :src="user.fotolink"
              class="rounded-[6px]"
              width="20"
              height="20"
            >
          </ListBlocItem>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import { setLocalStorageItem, UID_TO_ACTION } from '@/store/helpers/functions'
import * as TASK from '@/store/actions/tasks'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

export default {
  components: {
    Icon,
    ListBlocItem
  },
  props: {
    assignments: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
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
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    gotoChildren (user) {
      const action = UID_TO_ACTION[user.parentID]
      if (!action) {
        console.error('UID_TO_ACTION in undefined', user.parentID)
        return
      }
      this.$store.dispatch(action, user.email)
      const navElem = {
        name: user.name,
        key: 'taskListSource',
        value: { uid: user.parentID, param: user.email }
      }
      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: user.parentID, param: user.email } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    }
  }
}
</script>

<style scoped></style>
