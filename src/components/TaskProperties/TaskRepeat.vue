<template>
  <Popper
    class="popper-repeat"
    :disabled="selectedTask.type !== 1 && selectedTask.type !== 2"
    arrow
    trigger="hover"
    placement="bottom"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="text-white body-popover-custom body-repeat-custom rounded-b-lg"
        >
          <select
            ref="SeriesType"
            v-model="selectedTask.SeriesType"
            class="form-control select-repeat-control"
            @change="tabChanged($event)"
          >
            <option value="0">
              Не повторять
            </option>
            <option value="1">
              Ежедневно
            </option>
            <option value="2">
              Еженедельно
            </option>
            <option value="3">
              Ежемесячно
            </option>
            <option value="4">
              Ежегодно
            </option>
          </select>
          <div
            v-if="(noRepeat = selectedTask.SeriesType === 0 ? true : noRepeat)"
            class="top-panel-repeat"
          />
          <div
            v-if="
              (everyDayRepeat =
                selectedTask.SeriesType === 1 ? true : everyDayRepeat)
            "
            class="tab-content-repeat"
          >
            <div class="top-panel-repeat">
              <label>Каждый </label>
              <div class="every-content">
                <div class="form-group">
                  <input
                    ref="SeriesAfterCount"
                    v-model="SeriesAfterCount"
                    min="1"
                    type="number"
                    class="form-control form-control-select-repeat"
                    name="repeateveryday"
                  >
                </div>
                <div
                  class="form-group"
                  style="margin-left: 5px"
                >
                  <select
                    ref="SeriesAfterType"
                    v-model="SeriesAfterType"
                    class="form-control form-control-select-repeat"
                  >
                    <option value="1">
                      День
                    </option>
                    <option value="2">
                      Неделю
                    </option>
                    <option value="3">
                      Месяц
                    </option>
                    <option value="4">
                      Год
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              (everyWeekRepeat =
                selectedTask.SeriesType === 2 ? true : everyWeekRepeat)
            "
            class="tab-content-repeat"
          >
            <div class="top-panel-repeat">
              <div class="repeat-seleclist">
                <div>
                  <label>Каждую </label>
                  <select
                    ref="SeriesWeekCount"
                    v-model="SeriesWeekCount"
                    class="form-control form-control-width-100"
                    name=""
                  >
                    <option
                      v-for="item in 365"
                      :key="item"
                      :value="item"
                    >
                      {{ item }} неделю
                    </option>
                  </select>
                </div>
                <div
                  class="form-group"
                  style="margin-left: 5px"
                >
                  <div
                    v-for="opt in myOptions"
                    :key="opt"
                    :value="opt.id"
                    class="form_checkbox_btn-custom"
                  >
                    <input
                      :id="'opt_' + opt.id"
                      ref="SeriesWeek"
                      v-model="SeriesWeek"
                      type="checkbox"
                      name="checkbox"
                      :value="opt.id"
                    >
                    <label :for="'opt_' + opt.id">{{ opt.text }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              (everyMonthRepeat =
                selectedTask.SeriesType === 3 ? true : everyMonthRepeat)
            "
            class="tab-content-repeat"
          >
            <div class="top-panel-repeat">
              <div class="flex repeat-seleclist">
                <div class="form-group">
                  <select
                    ref="SeriesMonthType"
                    v-model="SeriesMonthType"
                    class="form-control form-control-select-repeat"
                    style="margin-right: 5px"
                    name=""
                    @change="changeEveryMonthType(SeriesMonthType)"
                  >
                    <option value="1">
                      Каждый
                    </option>
                    <option value="2">
                      Первый
                    </option>
                    <option value="3">
                      Второй
                    </option>
                    <option value="4">
                      Третий
                    </option>
                    <option value="5">
                      Четвертый
                    </option>
                    <option value="6">
                      Последний
                    </option>
                  </select>
                </div>
                <div
                  class="form-group everymonthtype"
                  :class="{ showselect: ActiveSelect == 1 }"
                >
                  <select
                    ref="SeriesMonthCount"
                    v-model="SeriesMonthCount"
                    class="form-control form-control-select-repeat"
                    name=""
                  >
                    <option
                      v-for="item in 12"
                      :key="item"
                      :value="item"
                    >
                      {{ item }} месяц
                    </option>
                  </select>
                </div>
                <div
                  class="everymonthtype"
                  :class="{ showselect: ActiveSelect > 1 }"
                >
                  <div class="form-group">
                    <select
                      ref="SeriesMonthDayOfWeek"
                      v-model="SeriesMonthDayOfWeek"
                      class="form-control form-control-select-repeat"
                    >
                      <option
                        v-for="(item, value) in days.filter((v) => v !== '')"
                        :key="value > 0"
                        :value="value + 1"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                class="form-group everymonthtype"
                :class="{ showselect: ActiveSelect > 1 }"
              >
                <select
                  ref="SeriesMonthCount"
                  v-model="SeriesMonthCount"
                  class="form-control select-repeat-control"
                  name=""
                >
                  <option
                    v-for="item in 12"
                    :key="item"
                    :value="item"
                  >
                    Каждый {{ item }} месяц
                  </option>
                </select>
              </div>
            </div>
            <div class="everymonth-content">
              <div
                class="everymonthtype"
                :class="{ showselect: ActiveSelect == 1 }"
              >
                <div class="form-group">
                  <div class="form-everymonth-container">
                    <div
                      v-for="day in 28"
                      :key="day"
                      class="form_radio_btn-custom"
                    >
                      <input
                        :id="'m1_' + day"
                        ref="SeriesMonthDay"
                        v-model="SeriesMonthDay"
                        type="radio"
                        name="radio"
                        :value="day"
                        :checked="selectedTask.SeriesMonthDay === day"
                      >
                      <label :for="'m1_' + day">{{ day }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              (everyYearRepeat =
                selectedTask.SeriesType === 4 ? true : everyYearRepeat)
            "
            class="tab-content-repeat"
          >
            <div class="top-panel-repeat">
              <div class="flex repeat-seleclist">
                <div
                  class="form-group"
                  style="margin-right: 5px"
                  aria-valuemax="SeriesYearType"
                >
                  <select
                    ref="SeriesYearType"
                    v-model="SeriesYearType"
                    class="form-control form-control-select-repeat"
                    name="SeriesYearType"
                    @change="changeEveryYearType(SeriesYearType)"
                  >
                    <option value="1">
                      Каждый
                    </option>
                    <option value="2">
                      Первый
                    </option>
                    <option value="3">
                      Второй
                    </option>
                    <option value="4">
                      Третий
                    </option>
                    <option value="5">
                      Четвертый
                    </option>
                    <option value="6">
                      Последний
                    </option>
                  </select>
                </div>
                <div
                  class="everyyeartype"
                  :class="{ showselect: ActiveYartype == 1 }"
                >
                  <div class="form-group">
                    <select
                      ref="SeriesYearMonth"
                      v-model="SeriesYearMonth"
                      class="form-control form-control-select-repeat"
                      name=""
                    >
                      <option
                        v-for="(item, value) in months"
                        :key="value"
                        :value="value + 1"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  class="everyyeartype"
                  :class="{ showselect: ActiveYartype > 1 }"
                >
                  <div class="form-group">
                    <select
                      ref="SeriesYearDayOfWeek"
                      v-model="SeriesYearDayOfWeek"
                      class="form-control form-control-select-repeat"
                    >
                      <option
                        v-for="(item, value) in days.filter((v) => v !== '')"
                        :key="value"
                        :value="value + 1"
                      >
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="everyyear-content">
              <div
                class="everyyeartype"
                :class="{ showselect: ActiveYartype == 1 }"
              >
                <div class="form-group">
                  <div class="form-everyyear-container">
                    <div
                      v-for="day in 28"
                      :key="day"
                      class="form_radio_btn-custom"
                    >
                      <input
                        :id="'y1_' + day"
                        ref="SeriesYearMonthDay"
                        v-model="SeriesYearMonthDay"
                        type="radio"
                        name="radio"
                        :value="day"
                        :checked="selectedTask.SeriesYearMonthDay === day"
                      >
                      <label :for="'y1_' + day">{{ day }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="everyyearbuttontype"
              :class="{ showselect: ActiveYartype > 1 }"
            >
              <div class="form-group">
                <select
                  ref="SeriesYearMonth"
                  v-model="SeriesYearMonth"
                  class="form-control select-repeat-control"
                >
                  <option
                    v-for="(month, value) in months"
                    :key="value"
                    :value="value + 1"
                    class="btn-month-year"
                  >
                    {{ month.substr(0, 3) }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="ready-button">
            <div class="form-group">
              <button
                class="btn-save-repeat"
                @click.stop="close"
                @click="SaveRepeat"
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div>
      <div
        v-if="selectedTask.SeriesEnd !== ''"
        class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 project-hover-close"
        :style="{
          cursor:
            selectedTask.type !== 1 && selectedTask.type !== 2
              ? 'default'
              : 'pointer'
        }"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 92 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :style="{
            cursor:
              selectedTask.type !== 1 && selectedTask.type !== 2
                ? 'default'
                : 'pointer'
          }"
        >
          <path
            d="M15.595 71.68H76.4048V66.5015C76.4048 64.3145 78.1735 62.5415 80.3554 62.5415C82.5373 62.5415 84.306 64.3145 84.306 66.5015V71.68C84.306 76.0541 80.7685 79.6 76.4048 79.6H15.595C11.2313 79.6 7.69378 76.0541 7.69378 71.68L7.69378 40H2.83583C0.728566 40 -0.380779 37.4961 1.03222 35.929L9.84079 26.1602C10.8061 25.0897 12.4827 25.0897 13.448 26.1602L22.2566 35.929C23.6696 37.4961 22.5602 40 20.453 40H15.595L15.595 71.68Z"
            fill="#5D94F7"
            fill-opacity="1"
          />
          <path
            d="M76.4048 8.32H15.595V13.4985C15.595 15.6855 13.8263 17.4585 11.6444 17.4585C9.46253 17.4585 7.69378 15.6855 7.69378 13.4985V8.32C7.69378 3.94591 11.2313 0.400002 15.595 0.400002H76.4048C80.7685 0.400002 84.306 3.9459 84.306 8.32V40H89.164C91.2712 40 92.3806 42.5039 90.9676 44.071L82.159 53.8398C81.1937 54.9103 79.5171 54.9103 78.5518 53.8398L69.7432 44.071C68.3302 42.5039 69.4396 40 71.5469 40H76.4048V8.32Z"
            fill="#5D94F7"
            fill-opacity="1"
          />
        </svg>
        <span v-if="selectedTask.SeriesType === 0">Не повторять</span>
        <span
          v-if="selectedTask.SeriesType === 1"
        ><span
          v-if="selectedTask.SeriesAfterType === 1"
        ><span
          v-if="selectedTask.SeriesAfterCount === 1"
        >Ежедневно: Каждый день.</span><span
          v-else
        >Ежедневно: Каждый {{ selectedTask.SeriesAfterCount }} день.</span></span><span
          v-else-if="selectedTask.SeriesAfterType === 2"
        ><span v-if="selectedTask.SeriesAfterCount === 1">Еженедельно </span><span
          v-else
        >Каждую {{ selectedTask.SeriesAfterCount }} неделю.</span></span><span
          v-else-if="selectedTask.SeriesAfterType === 3"
        ><span v-if="selectedTask.SeriesAfterCount === 1">Ежемесячно </span><span
          v-else
        >Ежедневно: Каждый
          {{ selectedTask.SeriesAfterCount }} месяц.</span></span><span
          v-else-if="selectedTask.SeriesAfterType === 4"
        ><span v-if="selectedTask.SeriesAfterCount === 1">Ежегодно </span><span
          v-else
        >Каждый {{ selectedTask.SeriesAfterCount }} год.</span></span>
        </span>
        <span
          v-if="selectedTask.SeriesType === 2"
        >Еженедельно: Каждую {{ selectedTask.SeriesWeekCount }} неделю, по:
          <span v-if="selectedTask.SeriesWeekMon === 1">Пн. </span>
          <span v-if="selectedTask.SeriesWeekTue === 1">Вт. </span>
          <span v-if="selectedTask.SeriesWeekWed === 1">Ср. </span>
          <span v-if="selectedTask.SeriesWeekThu === 1">Чт. </span>
          <span v-if="selectedTask.SeriesWeekFri === 1">Пт. </span>
          <span v-if="selectedTask.SeriesWeekSat === 1">Сб. </span>
          <span v-if="selectedTask.SeriesWeekSun === 1">Вс. </span>
        </span>
        <span v-if="selectedTask.SeriesType === 3">
          <span
            v-if="selectedTask.SeriesMonthType === 1"
          >Ежемесячно: Каждый {{ selectedTask.SeriesMonthCount }} месяц
            {{ selectedTask.SeriesMonthDay }} числа</span>
          <span
            v-else
          >Ежемесячно: {{ firstcount[selectedTask.SeriesMonthWeekType] }}
            <span>{{ day[selectedTask.SeriesMonthDayOfWeek] }} каждый
              {{ selectedTask.SeriesMonthCount }} месяц</span>
          </span>
        </span>
        <span v-if="selectedTask.SeriesType === 4">
          <span
            v-if="selectedTask.SeriesYearType === 1"
          >Ежегодно: Каждый год {{ selectedTask.SeriesYearMonthDay }}
            {{ months[selectedTask.SeriesYearMonth - 1] }}</span>
          <span
            v-else
          >Ежегодно: Каждый {{ months[selectedTask.SeriesYearMonth - 1] }}
            {{ firstcount[selectedTask.SeriesYearWeekType] }}
            {{ day[selectedTask.SeriesYearDayOfWeek] }}
          </span>
        </span>
        <button
          v-if="
            selectedTask.SeriesType > 0 &&
              (selectedTask.type === 1 || selectedTask.type === 2)
          "
          class="btn-close-popover"
          @click="resetRepeat"
        >
          <svg
            width="5"
            height="5"
            viewBox="0 0 16 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
        </button>
      </div>
    </div>
  </Popper>
</template>
<script>
import * as TASK from '@/store/actions/tasks'
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  data () {
    return {
      ActiveSelect: this.selectedTask?.SeriesMonthType,
      ActiveYartype: this.selectedTask?.SeriesYearType,

      SeriesType: this.selectedTask?.SeriesType,
      SeriesAfterCount: this.selectedTask?.SeriesAfterCount ?? 1,
      SeriesAfterType: this.selectedTask?.SeriesAfterType ?? 1,
      SeriesWeekCount: this.selectedTask?.SeriesWeekCount ?? 1,
      SeriesMonthType:
        this.selectedTask?.SeriesMonthType === 1
          ? this.selectedTask?.SeriesMonthType
          : this.selectedTask?.SeriesMonthWeekType,
      SeriesMonthCount: this.selectedTask?.SeriesMonthCount ?? 1,
      SeriesMonthDay: this.selectedTask?.SeriesMonthDay,
      SeriesMonthWeekType: this.selectedTask?.SeriesMonthWeekType,
      SeriesMonthDayOfWeek: this.selectedTask?.SeriesMonthDayOfWeek,
      SeriesYearType:
        this.selectedTask?.SeriesYearType === 1
          ? this.selectedTask?.SeriesYearType
          : this.selectedTask?.SeriesYearWeekType,
      SeriesYearMonth:
        this.selectedTask?.SeriesYearMonth === 0
          ? '1'
          : this.selectedTask?.SeriesYearMonth,
      SeriesYearMonthDay: this.selectedTask?.SeriesYearMonthDay,
      SeriesYearWeekType: this.selectedTask?.SeriesYearWeekType,
      SeriesYearDayOfWeek: this.selectedTask?.SeriesYearDayOfWeek,

      noRepeat: false,
      everyDayRepeat: false,
      everyWeekRepeat: false,
      everyMonthRepeat: false,
      everyYearRepeat: false,

      months: [
        'Января',
        'Февраля',
        'Марта',
        'Апреля',
        'Мая',
        'Июня',
        'Июля',
        'Августа',
        'Сентября',
        'Октября',
        'Ноября',
        'Декабря'
      ],
      days: [
        '',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
      ],
      day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      firstcount: [
        'последний',
        'первый',
        'второй',
        'третий',
        'четвертый',
        'последний'
      ],
      myOptions: [
        { id: 'mon', text: 'Пн' },
        { id: 'tue', text: 'Вт' },
        { id: 'wed', text: 'Ср' },
        { id: 'thu', text: 'Чт' },
        { id: 'fri', text: 'Пт' },
        { id: 'sat', text: 'Сб' },
        { id: 'sun', text: 'Вс' }
      ],
      SeriesWeekMon: this.selectedTask?.SeriesWeekMon === 1 ? 'mon' : ' ',
      SeriesWeekTue: this.selectedTask?.SeriesWeekTue === 1 ? 'tue' : ' ',
      SeriesWeekWed: this.selectedTask?.SeriesWeekWed === 1 ? 'wed' : ' ',
      SeriesWeekThu: this.selectedTask?.SeriesWeekThu === 1 ? 'thu' : ' ',
      SeriesWeekFri: this.selectedTask?.SeriesWeekFri === 1 ? 'fri' : ' ',
      SeriesWeekSat: this.selectedTask?.SeriesWeekSat === 1 ? 'sat' : ' ',
      SeriesWeekSun: this.selectedTask?.SeriesWeekSun === 1 ? 'sun' : ' ',
      SeriesWeek: [
        this.selectedTask?.SeriesWeekMon === 1 ? 'mon' : ' ',
        this.selectedTask?.SeriesWeekTue === 1 ? 'tue' : ' ',
        this.selectedTask?.SeriesWeekWed === 1 ? 'wed' : ' ',
        this.selectedTask?.SeriesWeekThu === 1 ? 'thu' : ' ',
        this.selectedTask?.SeriesWeekFri === 1 ? 'fri' : ' ',
        this.selectedTask?.SeriesWeekSat === 1 ? 'sat' : ' ',
        this.selectedTask?.SeriesWeekSun === 1 ? 'sun' : ' '
      ]
    }
  },
  computed: {
    selectedTask () {
      return this.$store.state.tasks.selectedTask
    }
  },
  methods: {
    resetRepeat () {
      const data = {
        uid: this.selectedTask.uid
      }
      this.$store.dispatch(TASK.RESET_REPEAT_CHANGE, data).then((resp) => {
        this.selectedTask.SeriesType = 0
        this.selectedTask.SeriesAfterType = 0
        this.selectedTask.SeriesAfterCount = 0
        this.selectedTask.SeriesWeekCount = 0
        this.selectedTask.SeriesWeekMon = 0
        this.selectedTask.SeriesWeekTue = 0
        this.selectedTask.SeriesWeekWed = 0
        this.selectedTask.SeriesWeekThu = 0
        this.selectedTask.SeriesWeekFri = 0
        this.selectedTask.SeriesWeekSat = 0
        this.selectedTask.SeriesWeekSun = 0
        this.selectedTask.SeriesMonthType = 0
        this.selectedTask.SeriesMonthCount = 0
        this.selectedTask.SeriesMonthDay = 0
        this.selectedTask.SeriesMonthWeekType = 0
        this.selectedTask.SeriesMonthDayOfWeek = 0
        this.selectedTask.SeriesYearType = 0
        this.selectedTask.SeriesYearMonth = 0
        this.selectedTask.SeriesYearMonthDay = 0
        this.selectedTask.SeriesYearWeekType = 0
        this.selectedTask.SeriesYearDayOfWeek = 0
        this.noRepeat = true
        this.everyDayRepeat = false
        this.everyWeekRepeat = false
        this.everyMonthRepeat = false
        this.everyYearRepeat = false
      })
    },
    tabChanged (event) {
      if (event.target.value === '0') {
        this.noRepeat = true
        this.everyDayRepeat = false
        this.everyWeekRepeat = false
        this.everyMonthRepeat = false
        this.everyYearRepeat = false
        this.selectedTask.SeriesType = 0
      }
      if (event.target.value === '1') {
        this.noRepeat = false
        this.everyDayRepeat = true
        this.everyWeekRepeat = false
        this.everyMonthRepeat = false
        this.everyYearRepeat = false
        this.selectedTask.SeriesType = 1
      }
      if (event.target.value === '2') {
        this.noRepeat = false
        this.everyDayRepeat = false
        this.everyWeekRepeat = true
        this.everyMonthRepeat = false
        this.everyYearRepeat = false
        this.selectedTask.SeriesType = 2
        this.selectedTask.SeriesWeekMon = 0
        this.selectedTask.SeriesWeekCount = 1
      }
      if (event.target.value === '3') {
        this.noRepeat = false
        this.everyDayRepeat = false
        this.everyWeekRepeat = false
        this.everyMonthRepeat = true
        this.everyYearRepeat = false
        this.selectedTask.SeriesType = 3
      }
      if (event.target.value === '4') {
        this.noRepeat = false
        this.everyDayRepeat = false
        this.everyWeekRepeat = false
        this.everyMonthRepeat = false
        this.everyYearRepeat = true
        this.selectedTask.SeriesType = 4
      }
    },
    changeEveryMonthType (value) {
      this.ActiveSelect = value
      this.SeriesMonthDay = 0
    },
    changeEveryYearType (value) {
      this.ActiveYartype = value
      this.SeriesYearMonth = 0
      this.SeriesYearMonthDay = 0
    },
    SaveRepeat () {
      if (this.$refs.SeriesType.value === '0') {
        const data = {
          uid: this.selectedTask.uid
        }
        this.$store.dispatch(TASK.RESET_REPEAT_CHANGE, data).then((resp) => {
          this.selectedTask.SeriesType = 0
          this.selectedTask.SeriesAfterType = 0
          this.selectedTask.SeriesAfterCount = 0
          this.selectedTask.SeriesWeekCount = 0
          this.selectedTask.SeriesWeekMon = 0
          this.selectedTask.SeriesWeekTue = 0
          this.selectedTask.SeriesWeekWed = 0
          this.selectedTask.SeriesWeekThu = 0
          this.selectedTask.SeriesWeekFri = 0
          this.selectedTask.SeriesWeekSat = 0
          this.selectedTask.SeriesWeekSun = 0
          this.selectedTask.SeriesMonthType = 0
          this.selectedTask.SeriesMonthCount = 0
          this.selectedTask.SeriesMonthDay = 0
          this.selectedTask.SeriesMonthWeekType = 0
          this.selectedTask.SeriesMonthDayOfWeek = 0
          this.selectedTask.SeriesYearType = 0
          this.selectedTask.SeriesYearMonth = 0
          this.selectedTask.SeriesYearMonthDay = 0
          this.selectedTask.SeriesYearWeekType = 0
          this.selectedTask.SeriesYearDayOfWeek = 0
        })
      }
      if (this.$refs.SeriesType.value === '1') {
        const data = {
          uid: this.selectedTask.uid,
          type: this.$refs.SeriesAfterType.value,
          every_value: this.$refs.SeriesAfterCount.value
        }
        this.$store.dispatch(TASK.EVERY_DAY_CHANGE, data).then((resp) => {
          this.selectedTask.SeriesType = 1
          this.selectedTask.SeriesAfterType = resp.data.SeriesAfterType
          this.selectedTask.SeriesAfterCount = resp.data.SeriesAfterCount
        })
      }
      if (this.$refs.SeriesType.value === '2') {
        const data = {
          uid: this.selectedTask.uid,
          days: this.SeriesWeek,
          every_value: this.$refs.SeriesWeekCount.value
        }
        this.$store.dispatch(TASK.EVERY_WEEK_CHANGE, data).then((resp) => {
          this.selectedTask.SeriesType = 2
          this.selectedTask.SeriesWeekFri = resp.data.SeriesWeekFri
          this.selectedTask.SeriesWeekMon = resp.data.SeriesWeekMon
          this.selectedTask.SeriesWeekSat = resp.data.SeriesWeekSat
          this.selectedTask.SeriesWeekSun = resp.data.SeriesWeekSun
          this.selectedTask.SeriesWeekThu = resp.data.SeriesWeekThu
          this.selectedTask.SeriesWeekTue = resp.data.SeriesWeekTue
          this.selectedTask.SeriesWeekWed = resp.data.SeriesWeekWed
          this.selectedTask.SeriesWeekCount = resp.data.SeriesWeekCount
        })
      }
      if (this.$refs.SeriesType.value === '3') {
        if (this.SeriesMonthDay > 0) {
          const data = {
            uid: this.selectedTask.uid,
            num_day: this.SeriesMonthDay,
            every_value: this.SeriesMonthCount
          }

          this.$store.dispatch(TASK.EVERY_MONTH_CHANGE, data).then((resp) => {
            this.selectedTask.SeriesType = 3
            this.selectedTask.SeriesMonthCount = resp.data.SeriesMonthCount
            this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
            this.selectedTask.SeriesMonthDayOfWeek =
              resp.data.SeriesMonthDayOfWeek
            this.selectedTask.SeriesMonthType = resp.data.SeriesMonthType
            this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
            this.selectedTask.SeriesMonthWeekType =
              resp.data.SeriesMonthWeekType
          })
        }
        if (this.SeriesMonthDay === 0) {
          const data = {
            uid: this.selectedTask.uid,
            every_value: this.SeriesMonthCount,
            num_day: this.SeriesMonthDay,
            mwt: this.SeriesMonthType - 1,
            mdw: this.SeriesMonthDayOfWeek
          }
          this.$store.dispatch(TASK.EVERY_MONTH_CHANGE, data).then((resp) => {
            this.selectedTask.SeriesType = 3
            this.selectedTask.SeriesMonthCount = resp.data.SeriesMonthCount
            this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
            this.selectedTask.SeriesMonthDayOfWeek =
              resp.data.SeriesMonthDayOfWeek
            this.selectedTask.SeriesMonthType = resp.data.SeriesMonthType
            this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
            this.selectedTask.SeriesMonthWeekType =
              resp.data.SeriesMonthWeekType
          })
        }
      }
      if (this.$refs.SeriesType.value === '4') {
        if (this.SeriesYearMonthDay > 0) {
          const data = {
            uid: this.selectedTask.uid,
            num_day: this.SeriesYearMonthDay,
            every_value: this.SeriesYearMonth
          }
          this.$store.dispatch(TASK.EVERY_YEAR_CHANGE, data).then((resp) => {
            this.selectedTask.SeriesType = 4
            this.selectedTask.SeriesYearDayOfWeek =
              resp.data.SeriesYearDayOfWeek
            this.selectedTask.SeriesYearMonth = resp.data.SeriesYearMonth
            this.selectedTask.SeriesYearType = resp.data.SeriesYearType
            this.selectedTask.SeriesYearMonthDay = resp.data.SeriesYearMonthDay
            this.selectedTask.SeriesMonthWeekType = resp.data.SeriesYearWeekType
            this.selectedTask.SeriesMonthDayOfWeek =
              resp.data.SeriesYearDayOfWeek
          })
        }
        if (this.SeriesYearMonthDay === 0) {
          const data = {
            uid: this.selectedTask.uid,
            every_value: this.SeriesYearMonth,
            num_day: this.SeriesYearMonthDay,
            mwt: this.SeriesYearType - 1,
            mdw: this.SeriesYearDayOfWeek
          }
          this.$store.dispatch(TASK.EVERY_YEAR_CHANGE, data).then((resp) => {
            this.selectedTask.SeriesType = 4
            this.selectedTask.SeriesYearDayOfWeek =
              resp.data.SeriesYearDayOfWeek
            this.selectedTask.SeriesYearMonth = resp.data.SeriesYearMonth
            this.selectedTask.SeriesYearMonthDay = resp.data.SeriesYearMonthDay
            this.selectedTask.SeriesYearWeekType = resp.data.SeriesYearWeekType
            this.selectedTask.SeriesMonthDayOfWeek =
              resp.data.SeriesYearDayOfWeek
          })
        }
      }
    }
  }
}
</script>
