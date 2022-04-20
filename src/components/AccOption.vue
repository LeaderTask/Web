<script setup>

import { computed } from 'vue'
import { useStore } from 'vuex'
import Toggle from '@vueform/toggle'
import { PATCH_SETTINGS } from '@/store/actions/navigator.js'

const store = useStore()
const settings = computed(() => {
  return store.state.navigator.navigator.settings
})

const updateSettings = () => {
  store.dispatch(
    PATCH_SETTINGS,
    {
      show_completed_tasks: settings.value.show_completed_tasks ? 1 : 0,
      add_task_to_begin: settings.value.add_task_to_begin ? 1 : 0,
      cal_number_of_first_week: settings.value.cal_number_of_first_week ? 1 : 0,
      cal_show_week_number: settings.value.cal_show_week_number ? 1 : 0,
      nav_show_tags: settings.value.nav_show_tags,
      nav_show_overdue: settings.value.nav_show_overdue,
      nav_show_summary: settings.value.nav_show_summary,
      nav_show_emps: settings.value.nav_show_emps,
      nav_show_markers: settings.value.nav_show_markers,
      language: settings.value.language,
      stopwatch: settings.value.stopwatch,
      cal_work_time: settings.value.cal_work_time,
      reminders_in_n_minutes: settings.value.reminders_in_n_minutes,
      cal_work_week: settings.value.cal_work_week,
      compact_mode: settings.value.compact_mode
    }
  )
}

</script>
    <template>
    <form class="px-5">
        <div class="my-2">
            <strong>Добавлять задачи в начало списка</strong>
            <div class="flex mt-2">
                <Toggle
                  v-model="settings.add_task_to_begin"
                  @change="updateSettings()"
                  class="outline-none ring-0"
                  :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
                />
                <a class="ml-2" v-if="settings.add_task_to_begin === true">Вкл.</a>
                <a class="ml-2" v-if="settings.add_task_to_begin === false">Выкл.</a>
            </div>
        </div>
        <div class="my-2">
            <strong>Первая неделя с 1 января</strong>
            <div class="flex mt-2">
                <Toggle
                v-model="settings.cal_number_of_first_week"
                  @change="updateSettings()"
                  class="outline-none ring-0"
                  :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
                />
                <a class="ml-2" v-if="settings.cal_number_of_first_week === true">Вкл.</a>
                <a class="ml-2" v-if="settings.cal_number_of_first_week === false">Выкл.</a>
            </div>
        </div>
        <div class="my-2">
            <strong>Показывать номера недель в календаре</strong>
            <div class="flex mt-2">
                <Toggle
                    v-model="settings.cal_show_week_number"
                    @change="updateSettings()"
                    class="outline-none ring-0"
                    :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
                />
                <a class="ml-2" v-if="settings.cal_show_week_number === true">Вкл.</a>
                <a class="ml-2" v-if="settings.cal_show_week_number === false">Выкл.</a>
            </div>
        </div>
        <div class="my-2">
            <strong>Показываать раздел Просрочено</strong>
            <div class="flex mt-2">
                <Toggle
                  @change="hasChanged = true"
                  class="outline-none ring-0"
                  :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
                />
                <a class="ml-2" v-if="settings.nav_show_overdue === 1">Вкл.</a>
                <a class="ml-2" v-if="settings.nav_show_overdue === 0">Выкл.</a>
            </div>
        </div>
        <div class="my-2">
            <strong>Показывать количество задач</strong>
            <div class="flex mt-2">
                <Toggle
                  class="outline-none ring-0"
                  :classes="{ toggleOn: 'bg-blue-400 border-blue-400 justify-start text-white', container: 'focus:ring-0' }"
                />
                <a class="ml-2" v-if="settings.nav_show_summary === 1">Вкл.</a>
                <a class="ml-2" v-if="settings.nav_show_summary === 0">Выкл.</a>
            </div>
        </div>
        <div class="my-2">
            <strong>Язык</strong>
            <div class="flex mt-2">
                <select v-model="settings.language" @change="updateSettings()">
                    <option value="russian">Русский</option>
                    <option value="english">Английский</option>
                </select>
            </div>
        </div>
        <div class="my-2">
            <strong>Напиоминание о задаче за </strong>
            <div class="flex mt-2">
                <select v-model="settings.reminders_in_n_minutes" @change="updateSettings()">
                    <option value="0">0 мин</option>
                    <option value="10">10 мин</option>
                    <option value="15">15 мин</option>
                    <option value="30">30 мин</option>
                    <option value="60">60 мин</option>
                </select>
            </div>
        </div>
    </form>
    </template>
