<template>
  <Popper
    class="popper-project light"
    arrow
    trigger="hover"
    placement="bottom"
    :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,10px' } }
    }"
    :disabled="!canEdit"
    @open:popper="onShowSelectProject"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div
        v-if="myProjects.length || sharedProjects.length"
        class="popper"
        @click="close"
      >
        <div class="text-white body-popover-custom max-w-[320px] truncate overflow-x-hidden">
          <div class="container-project-popover">
            <TaskPropsButtonProjectItem
              v-for="(project, index) in myProjects"
              :key="index"
              :check-project="currProject"
              :collapsed-project="collapsedProject"
              :project="project"
              @collapseProject="onCollapseProject"
              @checkProject="onCheckProject"
            />
            <div
              v-if="sharedProjects?.length"
              class="mt-4"
            >
              <TaskPropsButtonProjectItem
                v-for="(project, index) in sharedProjects"
                :key="index"
                :check-project="currProject"
                :collapsed-project="collapsedProject"
                :project="project"
                @collapseProject="onCollapseProject"
                @checkProject="onCheckProject"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-sm text-center max-w-[176px]"
      >
        На данный момент у Вас нет проектов. Их можно добавить на вкладке "Проекты"
      </div>
    </template>
    <div
      v-if="selectedProject !== '00000000-0000-0000-0000-000000000000'"
      class="mt-3 tags-custom-project dark:bg-gray-800 dark:text-gray-100 project-hover-close"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 90 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-if="
            projects[selectedProject] &&
              projects[selectedProject].color !== '#A998B6' && projects[selectedProject].color !== ''
          "
          d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
          :fill="projects[selectedProject].color"
          fill-opacity="1"
        />
        <path
          v-else
          d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      <span class="truncate ... max-w-[300px]">
        {{ projects[selectedProject]?.name ?? '???' }}
      </span>
      <button
        v-if="canEdit"
        class="btn-close-popover"
        @click.stop="removeProject"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"
            fill="#7E7E80"
          />
        </svg>
      </button>
    </div>
    <div
      v-else
      class="mt-3 tags-custom-project dark:bg-gray-800 dark:text-gray-100"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 90 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      <span class="rounded">Проект</span>
    </div>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'
import TaskPropsButtonProjectItem from '@/components/TaskProperties/TaskPropsButtonProjectItem.vue'

export default {
  components: {
    Popper,
    TaskPropsButtonProjectItem
  },
  props: {
    selectedProject: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeProject'],
  data: () => ({
    currProject: this?.selectedProject,
    collapsedProject: []
  }),
  computed: {
    projects () {
      return this.$store.state.projects.projects
    },
    myProjects () {
      return Object.values(this.$store.state.projects.projects).filter(
        (project) =>
          project.uid_parent === '00000000-0000-0000-0000-000000000000' &&
          project.email_creator === this.currUserEmail
      )
    },
    sharedProjects () {
      return Object.values(this.$store.state.projects.projects).filter(
        (project) =>
          project.uid_parent === '00000000-0000-0000-0000-000000000000' &&
          project.email_creator !== this.currUserEmail
      )
    },
    currUserEmail () {
      return this.$store.state.user.user.current_user_email
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onShowSelectProject () {
      this.currProject = this.selectedProject
      this.collapsedProject = []
    },
    isCheckedProject (projectUid) {
      return this.currProject === projectUid
    },
    onCheckProject (projectUid) {
      if (this.currProject !== projectUid) {
        this.currProject = projectUid
        this.onSave()
      } else {
        this.removeProject()
      }
    },
    onCollapseProject (projectUid) {
      const index = this.collapsedProject.findIndex((uid) => uid === projectUid)
      if (index === -1) {
        this.collapsedProject.push(projectUid)
      } else {
        this.collapsedProject.splice(index, 1)
      }
    },
    onSave () {
      this.$emit('changeProject', this.currProject)
    },
    removeProject () {
      if (this.currProject !== '00000000-0000-0000-0000-000000000000') {
        this.currProject = '00000000-0000-0000-0000-000000000000'
        this.onSave()
      }
    }
  }
}
</script>

<style scoped>
.tags-custom-project {
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  margin: 2px 2px 2px 2px;
  font-size: 12px;
  float: left;
  position: relative;
  display: flex;
  background: #f4f5f7;
}
.tags-custom-project svg {
  position: relative;
  top: 3px;
  float: left;
  display: flex;
  font-size: 18px;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: #9e9e9e;
}
.btn-close-popover
{
  margin-right: 5px;
  margin-left: 5px;
  font-size: 11px;
  display: none;
  position: absolute;
  left: -2px;
  width: 16px;
  height: 20px;
  top: 5px;
  color: #3F3F4O;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  background: #F4F5F7;
  animation-delay: -2s;
  opacity: 0;
  z-index: 9999;
  animation: ani 2.5s forwards;
}
.btn-close-popover svg
{
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
}
</style>
