<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { PATCH_SETTINGS } from '@/store/actions/navigator.js'
import { UPDATE_SOUND_SETTING } from '@/store/actions/inspector'

const store = useStore()
const user = computed(() => store.state.user.user)
const settings = computed(() => store.state.navigator.navigator.settings)

const isNotificationSoundOn = ref(store.state.inspector.is_notification_sound_on)

const updateSoundSetting = () => {
  store.dispatch(UPDATE_SOUND_SETTING, { uid_user: user.value.current_user_uid, value: isNotificationSoundOn.value })
}
const updateSettings = () => {
  const data = {
    add_task_to_begin: settings.value.add_task_to_begin === true ? 1 : 0,
    cal_number_of_first_week: settings.value.cal_number_of_first_week === true ? 1 : 0,
    cal_show_week_number: settings.value.cal_show_week_number === true ? 1 : 0,
    nav_show_tags: settings.value.nav_show_tags === true ? 1 : 0,
    nav_show_overdue: settings.value.nav_show_overdue === true ? 1 : 0,
    nav_show_summary: settings.value.nav_show_summary === true ? 1 : 0,
    nav_show_emps: settings.value.nav_show_emps === true ? 1 : 0,
    nav_show_markers: settings.value.nav_show_markers === true ? 1 : 0,
    language: settings.value.language,
    stopwatch: settings.value.stopwatch === true ? 1 : 0,
    cal_work_time: settings.value.cal_work_time === true ? 1 : 0,
    reminders_in_n_minutes: settings.value.reminders_in_n_minutes,
    cal_work_week: settings.value.cal_work_week === true ? 1 : 0,
    compact_mode: settings.value.compact_mode === true ? 1 : 0
  }
  store.dispatch(PATCH_SETTINGS, data).then(resp => {
  })
}
</script>
<template>
  <form class="px-5">
    <div class="my-2">
      <div class="flex mt-[15px]">
        <div class="checkbox">
          <input
            id="opt_1"
            v-model="settings.add_task_to_begin"
            type="checkbox"
            value="0"
            class="custom-checkbox-orange"
            @change="updateSettings()"
          >
          <label
            class="text-sm text-[#606061]"
            for="opt_1"
          >Добавлять задачи в начало списка</label>
        </div>
      </div>
    </div>
    <div class="my-2 mt-[15px]">
      <div class="flex mt-2">
        <div class="checkbox">
          <input
            id="opt_4"
            v-model="settings.nav_show_overdue"
            type="checkbox"
            class="custom-checkbox-orange outline-none"
            @change="updateSettings()"
          >
          <label
            class="text-sm text-[#606061]"
            for="opt_4"
          >Показывать раздел Просрочено</label>
        </div>
      </div>
    </div>
    <div class="my-2 mt-[15px]">
      <div class="flex mt-2">
        <div class="checkbox">
          <input
            id="sound"
            v-model="isNotificationSoundOn"
            type="checkbox"
            class="custom-checkbox-orange outline-none"
            @change="updateSoundSetting"
          >
          <label
            class="text-sm text-[#606061]"
            for="sound"
          >Сопровождать уведомления звуковым сообщением</label>
        </div>
      </div>
    </div>
    <div class="my-2 mt-[50px]">
      <p class="text-base font-medium text-[#4C4C4D]">
        Напоминание о задаче за:
      </p>
      <div class="flex mt-2">
        <select
          v-model="settings.reminders_in_n_minutes"
          class="border border-gray-300 p-2 w-40 rounded-md text-sm custom-select"
          @change="updateSettings()"
        >
          <option value="0">
            0 мин
          </option>
          <option value="10">
            10 мин
          </option>
          <option value="15">
            15 мин
          </option>
          <option value="30">
            30 мин
          </option>
          <option value="60">
            60 мин
          </option>
        </select>
      </div>
    </div>
    <div class="my-2 mt-[30px]">
      <p class="text-base font-medium text-[#4C4C4D]">
        Язык
      </p>
      <div class="flex mt-2">
        <select
          v-model="settings.language"
          class="border border-gray-300 p-2 w-40 rounded-md text-sm custom-select"
          @change="updateSettings()"
        >
          <option value="russian">
            Русский
          </option>
          <option value="english">
            Английский
          </option>
        </select>
      </div>
    </div>
  </form>
</template>
<style scoped>
/* для элемента input c type="checkbox" */
.custom-checkbox-orange {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label, связанного с .custom-checkbox */
.custom-checkbox-orange + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

/* создание в label псевдоэлемента before со следующими стилями */
.custom-checkbox-orange + label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1.63582px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}

/* стили при наведении курсора на checkbox */
.custom-checkbox-orange:not(:disabled):not(:checked) + label:hover::before {
  border-color: gray;
}

/* стили для активного чекбокса (при нажатии на него) */
.custom-checkbox-orange:not(:disabled):active + label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox-orange:focus + label::before {
}

/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox-orange:focus:not(:checked) + label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в состоянии checked */
.custom-checkbox-orange:checked + label::before {
  background-color: rgb(251 146 60);
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23fff' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
  border: 1px solid #ff9123;
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox-orange:disabled + label::before {
  background-color: #e9ecef;
}
.custom-select {
}
/* remove the original arrow */
.custom-select {
  font-size: 14px;
  border: 1px solid #ccc;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 40px;
  color:#606061;
  background: transparent
    url('http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png')
    no-repeat 130px center;
  background-size: 8%;
}
/* CAUTION: IE hackery ahead */
.custom-select::-ms-expand {
  display: none; /* remove default arrow on ie10 and ie11 */
}

/* target Internet Explorer 9 to undo the custom arrow */
@media screen and (min-width: 0\0) {
  .custom-select {
    background: none\9;
    padding: 5px\9;
  }
}
</style>
