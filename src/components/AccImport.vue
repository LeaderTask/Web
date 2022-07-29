<script>
import { CREATE_TASK } from '@/store/actions/tasks'
import { CREATE_PROJECT_REQUEST } from '@/store/actions/projects'
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  data () {
    return {
      fileString: '',
      bitrixProjectUid: null,
      projects: {},
      showProgress: false,
      currentAction: '',
      progressIterations: 0,
      progressIterationsTotal: 0,
      error: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    progressPercents () {
      return (this.progressIterations / this.progressIterationsTotal) * 100
    }
  },
  methods: {
    readFile (e) {
      this.showProgress = true
      const files = e.target.files
      if (!files.length) {
        return
      }
      const file = files[0]
      const fileReader = new FileReader()
      fileReader.readAsText(file)

      fileReader.onload = () => {
        this.fileString = fileReader.result
        this.parseFile()
      }
    },
    parseFile () {
      const lines = this.fileString.split('\n')

      this.progressIterationsTotal = lines.length - 2

      const headerLine = lines[0].split(';')
      console.log(headerLine)
      if (headerLine.length !== 20 || !headerLine[19] || (headerLine[0] !== 'TITLE' && headerLine[0] !== 'Название')) {
        this.showProgress = false
        this.error = 'Некорректный файл'
        return
      }

      this.addBitrixProject()

      for (let i = 1; i < (lines.length - 1); i++) {
        this.currentAction = 'Создается задача'

        let modifiedLine = []
        modifiedLine = lines[i].split(';')

        if (modifiedLine[0] === '') {
          continue
        }

        let dateBegin = ''
        let dateEnd = ''
        if (modifiedLine[8] !== '' && modifiedLine[9] !== '') {
          const pattern = /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}:\d{2})/g
          dateBegin = modifiedLine[8].replace(pattern, '$3-$2-$1T$4:00')
          dateEnd = modifiedLine[9].replace(pattern, '$3-$2-$1T$4:00')
        }

        const task = {
          name: modifiedLine[0],
          uid: this.uuidv4(),
          uid_customer: this.user.current_user_uid,
          uid_project: this.bitrixProjectUid,
          uid_parent: '00000000-0000-0000-0000-000000000000',
          status: 0,
          email_performer: '',
          type: 1,
          comment: '',
          _addToList: true,
          date_begin: dateBegin,
          date_end: dateEnd
        }
        if (modifiedLine[15] !== '') {
          if (!this.projects[modifiedLine[15]]) {
            this.addSubProject(modifiedLine[15])
          }
          task.uid_project = this.projects[modifiedLine[15]]
        }
        this.$store.dispatch(CREATE_TASK, task)
      }

      this.showProgress = false
    },
    addBitrixProject () {
      this.currentAction = 'Создается проект Битрикс24'
      const project = {
        uid_parent: '00000000-0000-0000-0000-000000000000',
        color: '#A998B6',
        comment: '',
        plugin: '',
        collapsed: 0,
        isclosed: 0,
        order: 0,
        group: 0,
        show: 1,
        favorite: 0,
        quiet: 0,
        email_creator: this.user.current_user_email,
        members: [
          ''
        ],
        uid: this.uuidv4(),
        name: 'Битрикс24',
        bold: 0
      }
      this.$store.dispatch(CREATE_PROJECT_REQUEST, project)
      this.bitrixProjectUid = project.uid
      this.currentAction = 'Создан проект Битрикс24'
    },
    addSubProject (name) {
      this.currentAction = 'Создается проект'
      const project = {
        uid_parent: this.bitrixProjectUid,
        color: '#A998B6',
        comment: '',
        plugin: '',
        collapsed: 0,
        isclosed: 0,
        order: 0,
        group: 0,
        show: 1,
        favorite: 0,
        quiet: 0,
        email_creator: this.user.current_user_email,
        members: [
          ''
        ],
        uid: this.uuidv4(),
        name: name,
        bold: 0
      }
      this.$store.dispatch(CREATE_PROJECT_REQUEST, project)
      this.projects[name] = project.uid
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    }
  }
}
</script>
<template>
  <form class="px-5">
    <div class="my-2">
      <label
        class="block text-base font-mediums"
      >
        Битрикс24 (.csv файл)
      </label>
      <input
        id="import-bitrix"
        class="file:mt-2 file:border-0 file:border-orange-400 file:text-white file:bg-orange-400 file:rounded-md file:px-6 file:p-2 file:text-base"
        type="file"
        accept=".csv"
        @change="readFile"
      >
    </div>
    <ModalBox
      v-if="showProgress"
      title="Импорт выполняется"
      @cancel="showProgress = false"
    >
      <div class="flex flex-col w-full">
        <div class="w-full bg-gray-200 h-1">
          <div
            class="bg-blue-600 h-1"
            :style="{ width: progressPercents + '%' }"
          />
        </div>
        <p>{{ currentAction }}</p>
      </div>
    </ModalBox>
    <ModalBox
      v-if="error !== ''"
      title="Ошибка"
      @cancel="error = ''"
    >
      <div class="flex flex-col w-full">
        <p>{{ error }}</p>
      </div>
    </ModalBox>
  </form>
</template>

<style scoped>
</style>
