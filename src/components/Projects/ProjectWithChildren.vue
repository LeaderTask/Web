<template>
  <div class="w-full">
    <BoardModalBoxRename
      v-if="showAdd"
      :show="showAdd"
      title="Добавить подпроект"
      @cancel="showAdd = false"
      @save="onAddNewProject"
    />
    <ProjectModalBoxProjectsLimit
      v-if="showProjectsLimit"
      @cancel="showProjectsLimit = false"
      @ok="showProjectsLimit = false"
    />
    <div class="grid gap-2 mt-3 md:grid-cols-2 lg:grid-cols-4">
      <template
        v-for="project in projects"
        :key="project.uid"
      >
        <ProjectBlocItem
          :project="project"
          @click.stop="gotoChildren(project)"
        />
      </template>
      <ListBlocAdd
        v-if="canAddChild"
        @click.stop="clickAddProject"
      />
    </div>
    <div class="mt-5">
      <TasksListNew
        :store-tasks="storeTasks"
        :new-config="newConfig"
      />
    </div>
  </div>
</template>

<script>
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import TasksListNew from '@/components/TasksListNew.vue'
import * as TASK from '@/store/actions/tasks'
import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    BoardModalBoxRename,
    ProjectBlocItem,
    ProjectModalBoxProjectsLimit,
    ListBlocAdd,
    TasksListNew
  },
  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showAdd: false,
      showProjectsLimit: false

    }
  },
  computed: {
    currentProject () {
      const projects = this.$store.state.projects.projects
      const navStack = this.$store.state.navbar.navStack
      const currProjectUid = navStack[navStack.length - 1].uid
      const project = projects[currProjectUid]
      return project
    },
    canAddChild () {
      const user = this.$store.state.user.user
      return this.currentProject?.email_creator === user.current_user_email
    },
    storeTasks () {
      return this.$store.state.tasks.newtasks
    }
  },
  methods: {
    print (msg, val) {
      console.log(msg, val)
    },
    gotoChildren (project) {
      this.$store.dispatch('asidePropertiesToggle', false)

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
      this.showAdd = true
    },
    onAddNewProject (name) {
      this.showAdd = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.currentProject?.children?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) ?? 0
        const user = this.$store.state.user.user

        const project = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: this.currentProject?.uid ?? '00000000-0000-0000-0000-000000000000',
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
        console.log(`create project uid: ${project.uid}`, project)

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
