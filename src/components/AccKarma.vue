<script>
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      successChartData: null,
      overdueChartData: null
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    currentLocation () {
      return window.location.href
    },
    employees () {
      return this.$store.state.employees.employees
    },
    karmaList () {
      return this.$store.state.inspector.karma
    },
    karmaQuantity () {
      let quantity = 0
      for (const karma of this.karmaList) quantity += karma.points
      return quantity
    },
    successQuantity () {
      let quantity = 0
      for (const karma of this.karmaList) {
        if (karma.points > 0) {
          quantity += 1
        }
      }
      return quantity
    },
    overdueQuantity () {
      let quantity = 0
      for (const karma of this.karmaList) {
        if (karma.points < 0) {
          quantity += 1
        }
      }
      return quantity
    },
    sortedKarmaListByDate () {
      return [...this.karmaList].sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
    }
  },
  mounted () {
    this.$store.dispatch('KARMA_REQUEST', this.user.current_user_uid).then((resp) => {
      const success = []
      const overdue = []
      for (const karma of resp.data) {
        if (karma.points > 0) success.push(karma)
        else if (karma.points < 0) overdue.push(karma)
      }
      this.successChartData = chartConfig.karmaChartData(success, 'success')
      this.overdueChartData = chartConfig.karmaChartData(overdue, 'danger')
    })
  },
  methods: {
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      return day + ' ' + month + ', ' + weekday
    }
  }
}
</script>

<template>
  <p class="text-center">
    <span
      class="text-6xl tracking-tighter"
      :class="{'text-green-500': karmaQuantity, 'text-red-500': !karmaQuantity, 'text-gray-600': karmaQuantity === 0 }"
    >
      <span v-if="karmaQuantity > 0">+</span>
      {{ karmaQuantity }}
    </span>
  </p>
  <p class="text-center mt-2">
    <span class="text-sm text-gray-600">В срок:</span> <span class="text-xl mr-6 text-green-500"> {{ successQuantity }}</span>
    <span class="text-sm text-gray-600">Просроченныx:</span> <span class="text-xl text-red-500">{{ overdueQuantity }}</span>
  </p>
  <br>
  <div class="grid grid-cols-1 gap-4 p-5">
    <div class="grid grid-cols-1 ">
      <p class="text-center text-2xl font-bold">
        Графики
      </p>
      <p class="text-left text-sm font-semibold px-2.5">
        В срок
      </p>
      <line-chart
        :data="successChartData"
        class="max-h-[120px]"
      />
      <p class="text-left text-sm font-semibold mt-4 px-2.5">
        Просрочено
      </p>
      <line-chart
        :data="overdueChartData"
        class="max-h-[120px]"
      />
    </div>
    <div>
      <p class="text-center text-2xl mt-2 font-bold">
        История кармы
      </p>
      <div v-if="!sortedKarmaListByDate.length">
        <p class="text-center text-md text-gray-400 mt-10">
          У Вас еще нет истории :( <br> Завершите инспектируемые задачи
        </p>
      </div>
      <div class="flex flex-col mt-3">
        <div
          v-for="karma in sortedKarmaListByDate"
          :key="karma"
          class="mb-1 rounded-[11px] border-[1px]"
        >
          <div class="flex justify-between pl-3 pt-3 pr-3 ">
            <div class="flex items-center min-w-[40%]">
              <div class="flex items-center break-words min-w-[40%]">
                <a
                  class="text text-gray-500 text-sm min-w-[40%] hover:text-blue-500"
                  :href="currentLocation + 'task/' + karma.taskJson.uid"
                >
                  {{ karma.taskJson.name }}
                </a>
              </div>
            </div>
            <p
              class="text-[14px] font-bold whitespace-nowrap leading-0"
              :class="{'text-green-500': karma.points > 0, 'text-red-500': karma.points < 0 }"
            >
              <span v-if="karma.points > 0">+</span>
              {{ karma.points }}
            </p>
          </div>
          <div class="whitespace-nowrap flex items-center p-2 ml-1 ">
            <div class="bg-gray-100 rounded-[4px] pr-3 mr-4">
              <span class="inline-flex justify-center items-center h-[30px] ">
                <span class=" text-red-600"><!--v-if-->
                  <svg
                    fill="none"
                    viewBox="0 0 16 16"
                    width="13"
                    height="15"
                    class=" ml-2 inline-block"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M12.9779 2.84449H11.9112H10.6668H5.33343H4.08899H3.02232C2.77686 2.84449 2.57788 3.04348 2.57788 3.28894V12.5334C2.57788 12.7788 2.77686 12.9778 3.02232 12.9778H12.9779C13.2233 12.9778 13.4223 12.7788 13.4223 12.5334V3.28894C13.4223 3.04348 13.2233 2.84449 12.9779 2.84449ZM3.02232 1.86672C2.23685 1.86672 1.6001 2.50347 1.6001 3.28894V12.5334C1.6001 13.3189 2.23685 13.9556 3.02232 13.9556H12.9779C13.7633 13.9556 14.4001 13.3189 14.4001 12.5334V3.28894C14.4001 2.50347 13.7633 1.86672 12.9779 1.86672H11.9112H10.6668H5.33343H4.08899H3.02232Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M9.27687 5.06671C8.78595 5.06671 8.38798 5.46468 8.38798 5.9556C8.38798 6.44652 8.78595 6.84449 9.27687 6.84449C9.76779 6.84449 10.1658 6.44652 10.1658 5.9556C10.1658 5.46468 9.76779 5.06671 9.27687 5.06671Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M9.27687 7.5556C8.78595 7.5556 8.38798 7.95357 8.38798 8.44449C8.38798 8.93541 8.78595 9.33338 9.27687 9.33338C9.76779 9.33338 10.1658 8.93541 10.1658 8.44449C10.1658 7.95357 9.76779 7.5556 9.27687 7.5556Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M8.38798 10.9334C8.38798 10.4425 8.78595 10.0445 9.27687 10.0445C9.76779 10.0445 10.1658 10.4425 10.1658 10.9334C10.1658 11.4243 9.76779 11.8223 9.27687 11.8223C8.78595 11.8223 8.38798 11.4243 8.38798 10.9334Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M11.7658 5.06671C11.2748 5.06671 10.8769 5.46468 10.8769 5.9556C10.8769 6.44652 11.2748 6.84449 11.7658 6.84449C12.2567 6.84449 12.6546 6.44652 12.6546 5.9556C12.6546 5.46468 12.2567 5.06671 11.7658 5.06671Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M10.8769 8.44449C10.8769 7.95357 11.2748 7.5556 11.7658 7.5556C12.2567 7.5556 12.6546 7.95357 12.6546 8.44449C12.6546 8.93541 12.2567 9.33338 11.7658 9.33338C11.2748 9.33338 10.8769 8.93541 10.8769 8.44449Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M11.7658 10.0445C11.2748 10.0445 10.8769 10.4425 10.8769 10.9334C10.8769 11.4243 11.2748 11.8223 11.7658 11.8223C12.2567 11.8223 12.6546 11.4243 12.6546 10.9334C12.6546 10.4425 12.2567 10.0445 11.7658 10.0445Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M4.33143 5.06671C3.84051 5.06671 3.44254 5.46468 3.44254 5.9556C3.44254 6.44652 3.84051 6.84449 4.33143 6.84449C4.82235 6.84449 5.22032 6.44652 5.22032 5.9556C5.22032 5.46468 4.82235 5.06671 4.33143 5.06671Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M4.33143 7.5556C3.84051 7.5556 3.44254 7.95357 3.44254 8.44449C3.44254 8.93541 3.84051 9.33338 4.33143 9.33338C4.82235 9.33338 5.22032 8.93541 5.22032 8.44449C5.22032 7.95357 4.82235 7.5556 4.33143 7.5556Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M3.44254 10.9334C3.44254 10.4425 3.84051 10.0445 4.33143 10.0445C4.82235 10.0445 5.22032 10.4425 5.22032 10.9334C5.22032 11.4243 4.82235 11.8223 4.33143 11.8223C3.84051 11.8223 3.44254 11.4243 3.44254 10.9334Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M6.82032 5.06671C6.3294 5.06671 5.93143 5.46468 5.93143 5.9556C5.93143 6.44652 6.3294 6.84449 6.82032 6.84449C7.31124 6.84449 7.70921 6.44652 7.70921 5.9556C7.70921 5.46468 7.31124 5.06671 6.82032 5.06671Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M5.93143 8.44449C5.93143 7.95357 6.3294 7.5556 6.82032 7.5556C7.31124 7.5556 7.70921 7.95357 7.70921 8.44449C7.70921 8.93541 7.31124 9.33338 6.82032 9.33338C6.3294 9.33338 5.93143 8.93541 5.93143 8.44449Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M6.82032 10.0445C6.3294 10.0445 5.93143 10.4425 5.93143 10.9334C5.93143 11.4243 6.3294 11.8223 6.82032 11.8223C7.31124 11.8223 7.70921 11.4243 7.70921 10.9334C7.70921 10.4425 7.31124 10.0445 6.82032 10.0445Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M5.33343 1.42227C5.33343 1.07863 5.05485 0.800049 4.71121 0.800049C4.36756 0.800049 4.08899 1.07863 4.08899 1.42227V1.86672H5.33343V1.42227Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M4.08899 3.5556C4.08899 3.89925 4.36756 4.17783 4.71121 4.17783C5.05485 4.17783 5.33343 3.89925 5.33343 3.5556V2.84449H4.08899V3.5556Z"
                    /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M11.9112 1.42227C11.9112 1.07863 11.6326 0.800049 11.289 0.800049C10.9453 0.800049 10.6668 1.07863 10.6668 1.42227V1.86672H11.9112V1.42227Z"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      fill="currentColor"
                      d="M10.6668 3.5556C10.6668 3.89925 10.9453 4.17783 11.289 4.17783C11.6326 4.17783 11.9112 3.89925 11.9112 3.55561V2.84449H10.6668V3.5556Z"
                    />
                  </svg>
                </span>
                <span class="cursor-default pl-1 text-xs text-black-600">
                  {{ dateToLabelFormat(new Date(karma.creation_date)) }}</span>
              </span>
            </div>
            <div class="tag-label cursor-default p-1 py-1.5 px-2 text-xs whitespace-nowrap rounded-[4px] flex items-center max-w-full text-white border-red-500 bg-opacity-50 bg-red-500 h-[30px]">
              <img
                v-if="employees[karma.taskJson.uid_customer]"
                :src="employees[karma.taskJson.uid_customer].fotolink"
                width="40"
                height="40"
                class="w-[22px] h-[22px] rounded-[5px] border border-black/10"
              >
              <p
                v-if="employees[karma.taskJson.uid_customer]"
                class="ml-1 text-[12px] leading-[14px] text-[#ffffff] whitespace-nowrap"
              >
                {{ employees[karma.taskJson.uid_customer].name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
