<script>
import { ref } from 'vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import TagModalBoxTagsLimit from '@/components/Tags/TagModalBoxTagsLimit.vue'
import TagIcon from '@/components/Tags/Icons/TagIcon.vue'
import Icon from '@/components/Icon.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import AddTag from '@/components/Tags/AddTag.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'

import { setLocalStorageItem } from '@/store/helpers/functions'
// import properties from '@/icons/properties.js'
// import subArrow from '@/icons/arrow-sub.js'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import * as TASK from '@/store/actions/tasks'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    ListBlocItem,
    TagIcon,
    AddTag,
    Icon,
    BoardModalBoxRename,
    TagModalBoxTagsLimit,
    EmptyTasksListPics
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const showTagsLimit = ref(false)
    const focusedTag = ref('')
    const showModal = ref(false)
    const randomColors = [
      '#F5F5DC',
      '#FFE5B4',
      '#FFC0CB',
      '#D0F0C0',
      '#C9A0DC',
      '#D8BFD8',
      '#FFCC00',
      '#F4A460',
      '#FFDB58',
      '#E6E6FA'
    ]
    return {
      gridView,
      listView,
      focusedTag,
      showTagsLimit,
      showModal,
      randomColors
    }
  },
  computed: {
    isGridView () {
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    storeTasks () {
      return this.$store.state.tasks.newtasks
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    isEmpty () {
      return this.tags.length < 1
    }
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    gotoChildren (value) {
      this.$store.dispatch(TASK.TAG_TASKS_REQUEST, value.uid)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: value.global_property_uid, param: value.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: value.name,
        key: 'greedSource',
        uid: value.uid,
        global_property_uid: value.global_property_uid,
        greedPath: 'tags_children',
        value: value.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: value.children })
      this.$store.commit('basic', { key: 'greedPath', value: 'tags_children' })
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    clickAddTag () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.tasks.tags).length >= 3 && user.days_left <= 0) {
        this.showTagsLimit = true
        return
      }
      this.showModal = true
    },
    createTag (name) {
      this.showModal = false
      const title = name.trim()
      const tag = {
        uid_parent: '00000000-0000-0000-0000-000000000000',
        back_color: this.randomColors[Math.floor(Math.random() * this.randomColors.length - 1)],
        comment: '',
        collapsed: 0,
        children: [],
        order: 1,
        group: 0,
        show: 0,
        favorite: 0,
        uid: this.uuidv4(),
        name: title,
        bold: 0
      }
      this.$store.dispatch(TASK.CREATE_TAG_REQUEST, tag)
        .then(() => {
          tag.global_property_uid = '00a5b3de-9474-404d-b3ba-83f488ac6d30'
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_TAG, [tag])
        })
    }
  }
}

// const openProperties = (tag, parentTagUid = '') => {
//   if (!isPropertiesMobileExpanded.value) {
//     store.dispatch('asidePropertiesToggle', true)
//   }

//   focusedTag.value = tag.uid

//   // add uid_parent if adding subtag in parent's children
//   if (props.tags[0].uid_parent && props.tags[0].uid_parent !== '00000000-0000-0000-0000-000000000000' && !parentTagUid) {
//     parentTagUid = props.tags[0].uid_parent
//   }
//   store.commit('basic', { key: 'propertiesState', value: 'tag' })
//   if (!tag) {
//     tag = {
//       uid_parent: parentTagUid,
//       back_color: '',
//       comment: '',
//       collapsed: 0,
//       order: 0,
//       group: 0,
//       show: 0,
//       children: [],
//       favorite: 0,
//       uid: '',
//       name: '',
//       bold: 0
//     }
//   }
//   store.commit(TASK.SELECT_TAG, tag)
// }

// const goToChildren = (value) => {
//   if (value.children && value.children.length) {
//     const navElem = {
//       name: value.name,
//       key: 'greedSource',
//       greedPath: 'tags_children',
//       uid: value.uid,
//       value: value.children
//     }
//     store.commit('pushIntoNavStack', navElem)
//     store.commit('basic', { key: 'greedSource', value: value.children })
//   }
// }
</script>

<template>
  <BoardModalBoxRename
    v-if="showModal"
    :show="showModal"
    title="Добавить метку"
    @cancel="showModal = false"
    @save="createTag"
  />
  <TagModalBoxTagsLimit
    v-if="showTagsLimit"
    @cancel="showTagsLimit = false"
    @ok="showTagsLimit = false"
  />
  <div
    class="w-full flex items-center justify-between mt-3 order-1"
  >
    <p class="text-2xl text-gray-800 font-bold second dark:text-gray-100 font-['Roboto']">
      Метки
    </p>
    <div
      class="flex"
    >
      <Icon
        :path="listView.path"
        :width="listView.width"
        :height="listView.height"
        :box="listView.viewBox"
        class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
        :class="{ 'text-gray-800': !isGridView, 'text-gray-400': isGridView }"
        @click="updateGridView(false)"
      />
      <Icon
        :path="gridView.path"
        :width="gridView.width"
        :height="gridView.height"
        :box="gridView.viewBox"
        class="cursor-pointer hover:text-gray-800 mr-2 mt-0.5"
        :class="{ 'text-gray-800': isGridView, 'text-gray-400': !isGridView }"
        @click="updateGridView(true)"
      />
    </div>
  </div>
  <div
    class="grid gap-4 mt-3 order-2"
    :class="{ 'md:grid-cols-2 lg:grid-cols-4': isGridView, 'grid-cols-1': !isGridView, 'grid-cols-1': isPropertiesMobileExpanded && !isGridView, 'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView }"
  >
    <AddTag @click="clickAddTag" />
    <template
      v-for="(tag, pindex) in tags"
      :key="pindex"
    >
      <ListBlocItem
        :count="tag.children?.length ?? 0"
        :color="tag.back_color"
        :title="tag.name"
        @click="gotoChildren(tag)"
      >
        <TagIcon />
      </ListBlocItem>
    </template>
  </div>

  <EmptyTasksListPics v-if="isEmpty" />
</template>
