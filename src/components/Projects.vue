<template>
  <div class="w-full">
    <BoardModalBoxRename
      v-if="showAddProject"
      :show="showAddProject"
      title="Добавить проект"
      @cancel="showAddProject = false"
      @save="onAddNewProject"
    />
    <ProjectModalBoxProjectsLimit
      v-if="showProjectsLimit"
      @cancel="showProjectsLimit = false"
      @ok="showProjectsLimit = false"
    />
    <div
      v-for="(value, index) in items"
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
          v-for="project in value.items"
          :key="project.uid"
        >
          <ProjectBlocItem
            :project="project"
            @click.stop="gotoChildren(project)"
          />
        </template>
        <ListBlocAdd
          v-if="index == 0"
          @click.stop="clickAddProject"
        />
      </div>
    </div>

    <EmptyTasksListPics v-if="isEmpty" />
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'

import * as TASK from '@/store/actions/tasks'
import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
export default {
  components: {
    Icon,
    BoardModalBoxRename,
    ProjectBlocItem,
    ListBlocAdd,
    ProjectModalBoxProjectsLimit,
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
      showProjectsLimit: false,
      showAddProject: false,
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
      return !this.items[0].items.length && !this.items[1].items.length
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
    gotoChildren (project) {
      this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, project.uid)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: project.global_property_uid, param: project.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: project.name,
        key: 'greedSource',
        uid: project.uid,
        global_property_uid: project.global_property_uid,
        greedPath: 'projects_children',
        value: project.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: project.children })
      this.$store.commit('basic', { key: 'greedPath', value: 'projects_children' })
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    clickAddProject () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && user.days_left <= 0) {
        this.showProjectsLimit = true
        return
      }
      this.showAddProject = true
    },
    onAddNewProject (name) {
      this.showAddProject = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.items[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const user = this.$store.state.user.user
        const project = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
          email_creator: user.current_user_email,
          order: maxOrder + 1,
          comment: '',
          plugin: '',
          collapsed: 0,
          isclosed: 0,
          group: 0,
          show: 1,
          favorite: 0,
          quiet: 0,
          members: [user.current_user_email],
          children: [],
          bold: 0
        }
        this.$store.dispatch(PROJECT.CREATE_PROJECT_REQUEST, project).then((res) => {
          // заполняем недостающие параметры
          project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
          project.order = res.data.order
          project.color = '#A998B6'

          this.$store.commit(PROJECT.PUSH_PROJECT, [project])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_PROJECT, [project])
          this.gotoChildren(project)
        })
      }
    }
  }
}
</script>

<style scoped></style>
