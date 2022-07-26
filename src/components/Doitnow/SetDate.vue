<template>
  <Popper
    class="popper-calendar light"
    append-to-body="true"
    trigger="hover"
    placement="auto"
    @open:popper="onShowCalendar"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="form-inline"
          style="width: 0; display: table"
        >
          <div class="title-popover-main">
            <button
              class="btn-clear-popover"
              @click="close"
            >
              Отменить
            </button>
            <button
              class="btn-save-popover"
              @click="onSave"
              @click.stop="close"
            >
              Сохранить
            </button>
          </div>
          <DatePicker
            ref="datePicker"
            v-model="datePickerDate"
            class="border-none text-xs calendar-properties"
            style="border: none !important"
            title-position="left"
            :masks="{ weekdays: 'WW' }"
            @dayclick="onDayClick"
          >
            <template #footer>
              <div>
                <div class="timestamp-custom">
                  Установить напоминание
                </div>
                <div class="form-group form-arrow">
                  <div class="input-group">
                    <input
                      v-model="time"
                      v-maska="'##:##'"
                      type="text"
                      placeholder="Время"
                    >
                    <span class="input-group-addon input-group-time-addon">
                      <button
                        class="toggleStartTime"
                        @click="toggleTimeSelector"
                      >
                        <svg
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M14.2222 2.55556H12.8889H11.3333H4.66667H3.11111H1.77778C1.47095 2.55556 1.22222 2.80429 1.22222 3.11111V14.6667C1.22222 14.9735 1.47095 15.2222 1.77778 15.2222H14.2222C14.529 15.2222 14.7778 14.9735 14.7778 14.6667V3.11111C14.7778 2.80429 14.529 2.55556 14.2222 2.55556ZM1.77778 1.33333C0.795938 1.33333 0 2.12927 0 3.11111V14.6667C0 15.6485 0.795938 16.4444 1.77778 16.4444H14.2222C15.2041 16.4444 16 15.6485 16 14.6667V3.11111C16 2.12927 15.2041 1.33333 14.2222 1.33333H12.8889H11.3333H4.66667H3.11111H1.77778Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M9.59596 5.33333C8.98231 5.33333 8.48485 5.83079 8.48485 6.44444C8.48485 7.05809 8.98231 7.55555 9.59596 7.55555C10.2096 7.55555 10.7071 7.05809 10.7071 6.44444C10.7071 5.83079 10.2096 5.33333 9.59596 5.33333Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M9.59596 8.44444C8.98231 8.44444 8.48485 8.9419 8.48485 9.55555C8.48485 10.1692 8.98231 10.6667 9.59596 10.6667C10.2096 10.6667 10.7071 10.1692 10.7071 9.55555C10.7071 8.9419 10.2096 8.44444 9.59596 8.44444Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M8.48485 12.6667C8.48485 12.053 8.98231 11.5556 9.59596 11.5556C10.2096 11.5556 10.7071 12.053 10.7071 12.6667C10.7071 13.2803 10.2096 13.7778 9.59596 13.7778C8.98231 13.7778 8.48485 13.2803 8.48485 12.6667Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M12.7071 5.33333C12.0934 5.33333 11.596 5.83079 11.596 6.44444C11.596 7.05809 12.0934 7.55555 12.7071 7.55555C13.3207 7.55555 13.8182 7.05809 13.8182 6.44444C13.8182 5.83079 13.3207 5.33333 12.7071 5.33333Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M11.596 9.55555C11.596 8.9419 12.0934 8.44444 12.7071 8.44444C13.3207 8.44444 13.8182 8.9419 13.8182 9.55555C13.8182 10.1692 13.3207 10.6667 12.7071 10.6667C12.0934 10.6667 11.596 10.1692 11.596 9.55555Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M12.7071 11.5556C12.0934 11.5556 11.596 12.053 11.596 12.6667C11.596 13.2803 12.0934 13.7778 12.7071 13.7778C13.3207 13.7778 13.8182 13.2803 13.8182 12.6667C13.8182 12.053 13.3207 11.5556 12.7071 11.5556Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M3.41416 5.33333C2.80051 5.33333 2.30305 5.83079 2.30305 6.44444C2.30305 7.05809 2.80051 7.55555 3.41416 7.55555C4.02781 7.55555 4.52527 7.05809 4.52527 6.44444C4.52527 5.83079 4.02781 5.33333 3.41416 5.33333Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M3.41416 8.44444C2.80051 8.44444 2.30305 8.9419 2.30305 9.55555C2.30305 10.1692 2.80051 10.6667 3.41416 10.6667C4.02781 10.6667 4.52527 10.1692 4.52527 9.55555C4.52527 8.9419 4.02781 8.44444 3.41416 8.44444Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M2.30305 12.6667C2.30305 12.053 2.80051 11.5556 3.41416 11.5556C4.02781 11.5556 4.52527 12.053 4.52527 12.6667C4.52527 13.2803 4.02781 13.7778 3.41416 13.7778C2.80051 13.7778 2.30305 13.2803 2.30305 12.6667Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M6.52528 5.33333C5.91163 5.33333 5.41416 5.83079 5.41416 6.44444C5.41416 7.05809 5.91163 7.55555 6.52528 7.55555C7.13893 7.55555 7.63639 7.05809 7.63639 6.44444C7.63639 5.83079 7.13893 5.33333 6.52528 5.33333Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M5.41416 9.55555C5.41416 8.9419 5.91163 8.44444 6.52528 8.44444C7.13893 8.44444 7.63639 8.9419 7.63639 9.55555C7.63639 10.1692 7.13893 10.6667 6.52528 10.6667C5.91163 10.6667 5.41416 10.1692 5.41416 9.55555Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M6.52528 11.5556C5.91163 11.5556 5.41416 12.053 5.41416 12.6667C5.41416 13.2803 5.91163 13.7778 6.52528 13.7778C7.13893 13.7778 7.63639 13.2803 7.63639 12.6667C7.63639 12.053 7.13893 11.5556 6.52528 11.5556Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M4.66667 0.777778C4.66667 0.348223 4.31844 0 3.88889 0C3.45933 0 3.11111 0.348223 3.11111 0.777777V1.33333H4.66667V0.777778Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M3.11111 3.44444C3.11111 3.874 3.45933 4.22222 3.88889 4.22222C4.31844 4.22222 4.66667 3.874 4.66667 3.44444V2.55556H3.11111V3.44444Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M12.8889 0.777777C12.8889 0.348222 12.5407 0 12.1111 0C11.6816 0 11.3333 0.348222 11.3333 0.777776V1.33333H12.8889V0.777777Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M11.3333 3.44444C11.3333 3.874 11.6816 4.22222 12.1111 4.22222C12.5407 4.22222 12.8889 3.874 12.8889 3.44445V2.55556H11.3333V3.44444Z"
                            fill="black"
                            fill-opacity="0.5"
                          />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>
                <div
                  v-if="showTimeSelector"
                  class="showtimeselector"
                >
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c1' + value"
                        type="radio"
                        :value="pad2(value) + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            pad2(value) + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label :for="'c1' + value">{{ pad2(value) }}:00</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c2' + value"
                        type="radio"
                        :value="pad2(value + 6) + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            pad2(value + 6) + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label
                        :for="'c2' + value"
                      >{{ pad2(value + 6) }}:00</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c3' + value"
                        type="radio"
                        :value="value + 12 + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            value + 12 + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label :for="'c3' + value">{{ value + 12 }}:00</label>
                    </div>
                  </div>
                  <div class="col-md-3 col-time-custome">
                    <div
                      v-for="(key, value) in 6"
                      :key="value"
                      class="form_radio_btn"
                    >
                      <input
                        :id="'c4' + value"
                        type="radio"
                        :value="value + 18 + ':00'"
                        name="radio"
                        :checked="
                          pad2(new Date(dateBegin).getHours()) +
                            ':' +
                            pad2(new Date(dateBegin).getMinutes()) ===
                            value + 18 + ':00'
                        "
                        @change="calendarTimeChange"
                      >
                      <label :for="'c4' + value">{{ value + 18 }}:00</label>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DatePicker>
        </div>
      </div>
    </template>
    <a
      class="group flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-50 hover:border hover:border-gray-500 hover:bg-opacity-90 font-medium min-h-[40px] w-[181px] rounded-lg mb-2 hover:animate-fadeIn"
    >
      <span
        v-if="dateText !== ''"
        class="flex items-center"
      >
        <button
          class="hidden group-hover:block"
          @click.stop="resetCalendar"
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
        <span class="w-[70px] text-center ml-8">Изменить дату</span>
        <svg
          class="ml-8"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.2222 2.55556H12.8889H11.3333H4.66667H3.11111H1.77778C1.47095 2.55556 1.22222 2.80429 1.22222 3.11111V14.6667C1.22222 14.9735 1.47095 15.2222 1.77778 15.2222H14.2222C14.529 15.2222 14.7778 14.9735 14.7778 14.6667V3.11111C14.7778 2.80429 14.529 2.55556 14.2222 2.55556ZM1.77778 1.33333C0.795938 1.33333 0 2.12927 0 3.11111V14.6667C0 15.6485 0.795938 16.4444 1.77778 16.4444H14.2222C15.2041 16.4444 16 15.6485 16 14.6667V3.11111C16 2.12927 15.2041 1.33333 14.2222 1.33333H12.8889H11.3333H4.66667H3.11111H1.77778Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M9.59596 5.33333C8.98231 5.33333 8.48485 5.83079 8.48485 6.44444C8.48485 7.05809 8.98231 7.55555 9.59596 7.55555C10.2096 7.55555 10.7071 7.05809 10.7071 6.44444C10.7071 5.83079 10.2096 5.33333 9.59596 5.33333Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M9.59596 8.44444C8.98231 8.44444 8.48485 8.9419 8.48485 9.55555C8.48485 10.1692 8.98231 10.6667 9.59596 10.6667C10.2096 10.6667 10.7071 10.1692 10.7071 9.55555C10.7071 8.9419 10.2096 8.44444 9.59596 8.44444Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M8.48485 12.6667C8.48485 12.053 8.98231 11.5556 9.59596 11.5556C10.2096 11.5556 10.7071 12.053 10.7071 12.6667C10.7071 13.2803 10.2096 13.7778 9.59596 13.7778C8.98231 13.7778 8.48485 13.2803 8.48485 12.6667Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M12.7071 5.33333C12.0934 5.33333 11.596 5.83079 11.596 6.44444C11.596 7.05809 12.0934 7.55555 12.7071 7.55555C13.3207 7.55555 13.8182 7.05809 13.8182 6.44444C13.8182 5.83079 13.3207 5.33333 12.7071 5.33333Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M11.596 9.55555C11.596 8.9419 12.0934 8.44444 12.7071 8.44444C13.3207 8.44444 13.8182 8.9419 13.8182 9.55555C13.8182 10.1692 13.3207 10.6667 12.7071 10.6667C12.0934 10.6667 11.596 10.1692 11.596 9.55555Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M12.7071 11.5556C12.0934 11.5556 11.596 12.053 11.596 12.6667C11.596 13.2803 12.0934 13.7778 12.7071 13.7778C13.3207 13.7778 13.8182 13.2803 13.8182 12.6667C13.8182 12.053 13.3207 11.5556 12.7071 11.5556Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M3.41416 5.33333C2.80051 5.33333 2.30305 5.83079 2.30305 6.44444C2.30305 7.05809 2.80051 7.55555 3.41416 7.55555C4.02781 7.55555 4.52527 7.05809 4.52527 6.44444C4.52527 5.83079 4.02781 5.33333 3.41416 5.33333Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M3.41416 8.44444C2.80051 8.44444 2.30305 8.9419 2.30305 9.55555C2.30305 10.1692 2.80051 10.6667 3.41416 10.6667C4.02781 10.6667 4.52527 10.1692 4.52527 9.55555C4.52527 8.9419 4.02781 8.44444 3.41416 8.44444Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M2.30305 12.6667C2.30305 12.053 2.80051 11.5556 3.41416 11.5556C4.02781 11.5556 4.52527 12.053 4.52527 12.6667C4.52527 13.2803 4.02781 13.7778 3.41416 13.7778C2.80051 13.7778 2.30305 13.2803 2.30305 12.6667Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M6.52528 5.33333C5.91163 5.33333 5.41416 5.83079 5.41416 6.44444C5.41416 7.05809 5.91163 7.55555 6.52528 7.55555C7.13893 7.55555 7.63639 7.05809 7.63639 6.44444C7.63639 5.83079 7.13893 5.33333 6.52528 5.33333Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M5.41416 9.55555C5.41416 8.9419 5.91163 8.44444 6.52528 8.44444C7.13893 8.44444 7.63639 8.9419 7.63639 9.55555C7.63639 10.1692 7.13893 10.6667 6.52528 10.6667C5.91163 10.6667 5.41416 10.1692 5.41416 9.55555Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M6.52528 11.5556C5.91163 11.5556 5.41416 12.053 5.41416 12.6667C5.41416 13.2803 5.91163 13.7778 6.52528 13.7778C7.13893 13.7778 7.63639 13.2803 7.63639 12.6667C7.63639 12.053 7.13893 11.5556 6.52528 11.5556Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M4.66667 0.777778C4.66667 0.348223 4.31844 0 3.88889 0C3.45933 0 3.11111 0.348223 3.11111 0.777777V1.33333H4.66667V0.777778Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M3.11111 3.44444C3.11111 3.874 3.45933 4.22222 3.88889 4.22222C4.31844 4.22222 4.66667 3.874 4.66667 3.44444V2.55556H3.11111V3.44444Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M12.8889 0.777777C12.8889 0.348222 12.5407 0 12.1111 0C11.6816 0 11.3333 0.348222 11.3333 0.777776V1.33333H12.8889V0.777777Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
          <path
            d="M11.3333 3.44444C11.3333 3.874 11.6816 4.22222 12.1111 4.22222C12.5407 4.22222 12.8889 3.874 12.8889 3.44445V2.55556H11.3333V3.44444Z"
            fill="#3FBF64"
            fill-opacity="0.5"
          />
        </svg>
      </span>
      <span
        v-else
        class="flex items-center"
      >
        <button class="btn-calendar" /><span class="w-[70px] text-center ml-8">Назначить дату</span>
        <svg
          class="ml-8"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.2222 2.55556H12.8889H11.3333H4.66667H3.11111H1.77778C1.47095 2.55556 1.22222 2.80429 1.22222 3.11111V14.6667C1.22222 14.9735 1.47095 15.2222 1.77778 15.2222H14.2222C14.529 15.2222 14.7778 14.9735 14.7778 14.6667V3.11111C14.7778 2.80429 14.529 2.55556 14.2222 2.55556ZM1.77778 1.33333C0.795938 1.33333 0 2.12927 0 3.11111V14.6667C0 15.6485 0.795938 16.4444 1.77778 16.4444H14.2222C15.2041 16.4444 16 15.6485 16 14.6667V3.11111C16 2.12927 15.2041 1.33333 14.2222 1.33333H12.8889H11.3333H4.66667H3.11111H1.77778Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M9.59596 5.33333C8.98231 5.33333 8.48485 5.83079 8.48485 6.44444C8.48485 7.05809 8.98231 7.55555 9.59596 7.55555C10.2096 7.55555 10.7071 7.05809 10.7071 6.44444C10.7071 5.83079 10.2096 5.33333 9.59596 5.33333Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M9.59596 8.44444C8.98231 8.44444 8.48485 8.9419 8.48485 9.55555C8.48485 10.1692 8.98231 10.6667 9.59596 10.6667C10.2096 10.6667 10.7071 10.1692 10.7071 9.55555C10.7071 8.9419 10.2096 8.44444 9.59596 8.44444Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M8.48485 12.6667C8.48485 12.053 8.98231 11.5556 9.59596 11.5556C10.2096 11.5556 10.7071 12.053 10.7071 12.6667C10.7071 13.2803 10.2096 13.7778 9.59596 13.7778C8.98231 13.7778 8.48485 13.2803 8.48485 12.6667Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M12.7071 5.33333C12.0934 5.33333 11.596 5.83079 11.596 6.44444C11.596 7.05809 12.0934 7.55555 12.7071 7.55555C13.3207 7.55555 13.8182 7.05809 13.8182 6.44444C13.8182 5.83079 13.3207 5.33333 12.7071 5.33333Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M11.596 9.55555C11.596 8.9419 12.0934 8.44444 12.7071 8.44444C13.3207 8.44444 13.8182 8.9419 13.8182 9.55555C13.8182 10.1692 13.3207 10.6667 12.7071 10.6667C12.0934 10.6667 11.596 10.1692 11.596 9.55555Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M12.7071 11.5556C12.0934 11.5556 11.596 12.053 11.596 12.6667C11.596 13.2803 12.0934 13.7778 12.7071 13.7778C13.3207 13.7778 13.8182 13.2803 13.8182 12.6667C13.8182 12.053 13.3207 11.5556 12.7071 11.5556Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M3.41416 5.33333C2.80051 5.33333 2.30305 5.83079 2.30305 6.44444C2.30305 7.05809 2.80051 7.55555 3.41416 7.55555C4.02781 7.55555 4.52527 7.05809 4.52527 6.44444C4.52527 5.83079 4.02781 5.33333 3.41416 5.33333Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M3.41416 8.44444C2.80051 8.44444 2.30305 8.9419 2.30305 9.55555C2.30305 10.1692 2.80051 10.6667 3.41416 10.6667C4.02781 10.6667 4.52527 10.1692 4.52527 9.55555C4.52527 8.9419 4.02781 8.44444 3.41416 8.44444Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M2.30305 12.6667C2.30305 12.053 2.80051 11.5556 3.41416 11.5556C4.02781 11.5556 4.52527 12.053 4.52527 12.6667C4.52527 13.2803 4.02781 13.7778 3.41416 13.7778C2.80051 13.7778 2.30305 13.2803 2.30305 12.6667Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M6.52528 5.33333C5.91163 5.33333 5.41416 5.83079 5.41416 6.44444C5.41416 7.05809 5.91163 7.55555 6.52528 7.55555C7.13893 7.55555 7.63639 7.05809 7.63639 6.44444C7.63639 5.83079 7.13893 5.33333 6.52528 5.33333Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M5.41416 9.55555C5.41416 8.9419 5.91163 8.44444 6.52528 8.44444C7.13893 8.44444 7.63639 8.9419 7.63639 9.55555C7.63639 10.1692 7.13893 10.6667 6.52528 10.6667C5.91163 10.6667 5.41416 10.1692 5.41416 9.55555Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M6.52528 11.5556C5.91163 11.5556 5.41416 12.053 5.41416 12.6667C5.41416 13.2803 5.91163 13.7778 6.52528 13.7778C7.13893 13.7778 7.63639 13.2803 7.63639 12.6667C7.63639 12.053 7.13893 11.5556 6.52528 11.5556Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M4.66667 0.777778C4.66667 0.348223 4.31844 0 3.88889 0C3.45933 0 3.11111 0.348223 3.11111 0.777777V1.33333H4.66667V0.777778Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M3.11111 3.44444C3.11111 3.874 3.45933 4.22222 3.88889 4.22222C4.31844 4.22222 4.66667 3.874 4.66667 3.44444V2.55556H3.11111V3.44444Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M12.8889 0.777777C12.8889 0.348222 12.5407 0 12.1111 0C11.6816 0 11.3333 0.348222 11.3333 0.777776V1.33333H12.8889V0.777777Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M11.3333 3.44444C11.3333 3.874 11.6816 4.22222 12.1111 4.22222C12.5407 4.22222 12.8889 3.874 12.8889 3.44445V2.55556H11.3333V3.44444Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </span>
    </a>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'
import { DatePicker } from 'v-calendar'
import { maska } from 'maska'

export default {
  components: {
    Popper,
    DatePicker
  },
  directives: {
    maska
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    dateBegin: {
      type: String,
      default: ''
    },
    dateEnd: {
      type: String,
      default: ''
    },
    dateText: {
      type: String,
      default: ''
    }
  },
  emits: ['changeDates'],
  data: () => ({
    datePickerDate: {
      date: new Date()
    },
    date: null,
    time: '',
    canEdit: true,
    showTimeSelector: false
  }),
  methods: {
    pad2 (n) {
      return (n < 10 ? '0' : '') + n.toString()
    },
    getDateValue () {
      if (this.dateBegin !== '0001-01-01T00:00:00') {
        return new Date(this.dateBegin)
      }
      return null
    },
    getTimeValue () {
      if (
        this.dateBegin !== '0001-01-01T00:00:00' &&
        this.dateEnd !== '0001-01-01T00:00:00'
      ) {
        const begin = new Date(this.dateBegin)
        const end = new Date(this.dateEnd)
        if (
          begin.getHours() !== 0 ||
          begin.getMinutes() !== 0 ||
          begin.getSeconds() !== 0 ||
          end.getHours() !== 23 ||
          end.getMinutes() !== 59 ||
          end.getSeconds() !== 59
        ) {
          const hours = this.pad2(begin.getHours())
          const minutes = this.pad2(begin.getMinutes())
          return `${hours}:${minutes}`
        }
      }
      return ''
    },
    getValidTimeString () {
      const [hoursStr, minutesStr] = this.time.split(':')
      if (
        Number(hoursStr) >= 0 &&
        Number(hoursStr) < 24 &&
        Number(minutesStr) >= 0 &&
        Number(minutesStr) < 60
      ) {
        const hours = this.pad2(Number(hoursStr))
        const minutes = this.pad2(Number(minutesStr))
        return `${hours}:${minutes}`
      }
      return ''
    },
    onShowCalendar () {
      // устанавливаем выбранную дату в календарике
      this.date = this.getDateValue()
      const moveDate = this.date ? new Date(this.date) : new Date()
      this.$refs.datePicker.move(moveDate)
      this.$refs.datePicker.updateValue(new Date(this.date))
      // устанавливаем время
      this.time = this.getTimeValue()
    },
    onDayClick (day) {
      // не даём развыделять календарь
      if (this.datePickerDate === null) {
        this.$refs.datePicker.updateValue(day.date)
      }
    },
    toggleTimeSelector () {
      this.showTimeSelector = !this.showTimeSelector
    },
    calendarTimeChange (event) {
      const timeValue = event.target.value
      this.time = timeValue
    },
    onSave () {
      if (this.datePickerDate === null || !Number(this.datePickerDate)) return
      const year = this.pad2(this.datePickerDate.getFullYear())
      const month = this.pad2(this.datePickerDate.getMonth() + 1)
      const day = this.pad2(this.datePickerDate.getDate())
      const time = this.getValidTimeString()
      const dateString = `${year}-${month}-${day}`
      const timeBegin = time ? time + ':00' : '00:00:00'
      const timeEnd = time ? time + ':00' : '23:59:59'
      const begin = `${dateString}T${timeBegin}`
      const end = `${dateString}T${timeEnd}`
      this.$emit('changeDates', begin, end)
    },
    resetCalendar () {
      const begin = '0001-01-01T00:00:00'
      const end = '0001-01-01T00:00:00'
      this.$emit('changeDates', begin, end)
    }
  }
}
</script>

<style scoped>
.popper-calendar .popper {
  top: 5% !important;
}
</style>
