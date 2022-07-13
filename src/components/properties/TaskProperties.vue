<template>
  <ModalBoxDelete
    v-if="showConfirm"
    title="Удалить задачу"
    :text="modalBoxDeleteText"
    @cancel="showConfirm = false"
    @yes="deleteTask(selectedTask)"
  />
  <ChatLimit
    v-if="showFreeModalChat"
    @cancel="showFreeModalChat = false"
  />
  <ChecklistLimit
    v-if="showFreeModalCheck"
    @cancel="showFreeModalCheck = false"
  />
  <RepeatLimit
    v-if="showFreeModalRepeat"
    @cancel="showFreeModalRepeat = false"
  />
  <PerformerLimit
    v-if="showFreeModalPerform"
    @cancel="showFreeModalPerform = false"
  />
  <div
    class="break-words relative z-1"
    @mousedown="selectedFalse"
  >
    <div
      class="inline-flex justify-center items-center text-[#7E7E80] dark:text-white h-[11px] w-[11px] cursor-pointer absolute top-[-3px] right-[-5px] z-10"
      @click="closeProperties"
    >
      <svg
        viewBox="0 0 11 11"
        width="12"
        height="12"
        class="cursor-pointer"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"
        />
      </svg>
    </div>
    <div
      id="generalscroll"
      class="column-resize relative overflow-hidden"
    >
      <div />
      <div
        v-if="selectedTask.uid_parent !== '00000000-0000-0000-0000-000000000000' && tasks[selectedTask.uid_parent]"
        class="user_customer_custom"
        :class="selectedTask.uid_parent !== '00000000-0000-0000-0000-000000000000' && tasks[selectedTask.uid_parent] ? 'mt-3' : 'mt-0.5'"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 14.3125C12 13.9328 11.6922 13.625 11.3125 13.625H7.5L7.5 5.5H9.99877C10.1795 5.5 10.2675 5.27934 10.1365 5.15494L6.8125 2L3.8194 5.16252C3.69873 5.29002 3.78912 5.5 3.96466 5.5H6.125L6.125 15H11.3125C11.6922 15 12 14.6922 12 14.3125Z"
            fill="#7F7F80"
          />
        </svg>
        <a
          class="parent-name cursor-pointer dark:text-gray-100 mb-2"
          @click="gotoParentNode(selectedTask.uid_parent)"
        >
          {{ tasks[selectedTask.uid_parent].info.name }}
        </a>
      </div>
      <div
        class="user_child_customer_custom"
      >
        <strong>
          <div
            ref="TaskName"
            class="form-control taskName-custom dark:bg-gray-900 dark:text-gray-100 dark:border-gray-900"
            data-placeholder="Task Name"
            style="font-weight: bold; font-size: 18px"
            :contenteditable="selectedTask.uid_customer === user?.current_user_uid"
            @blur="changeName($event)"
            @keyup="changeName($event)"
            @focus="$refs.TaskName.focus()"
            @focusout="removeEditTaskName($event)"
            @keydown.enter.exact.prevent
            v-html="getFixedCommentName()"
          />
        </strong>
      </div>
      <div
        class="my-[25px] custom-list-tags"
      >
        <!-- Кнопка Поручить / Взять на исполнение / Перепоручить -->
        <TaskPropsButtonPerform
          v-if="selectedTask.status !== 3 && selectedTask.type !== 4 && !((selectedTask.uid_customer !== user?.current_user_uid) && (selectedTask.status === 1))"
          :task-type="selectedTask.type"
          :current-user-uid="user?.current_user_uid"
          :performer-email="selectedTask.email_performer"
          @changePerformer="onChangePerformer"
          @reAssign="onReAssignToUser"
          @click="shouldShowFreePerformer"
        />
        <!-- Кнопка Доступ -->
        <TaskPropsButtonAccess
          v-if="isAccessVisible && !((selectedTask.uid_customer !== user?.current_user_uid) && (selectedTask.status === 1))"
          :current-user-uid="user?.current_user_uid"
          :access-emails="selectedTask.emails ? selectedTask.emails.split('..') : []"
          :can-edit="selectedTask.type === 1 || selectedTask.type === 2"
          :is-customer="selectedTask.uid_customer === user?.current_user_uid"
          @changeAccess="onChangeAccess"
        />
        <!-- Кнопка Выбрать дату -->
        <TaskPropsButtonSetDate
          v-if="(selectedTask.type !== 4) && (selectedTask.type !== 5) && (selectedTask.status !== 1)"
          :date-begin="selectedTask.date_begin"
          :date-end="selectedTask.date_end"
          :date-text="selectedTask.term_user"
          @changeDates="onChangeDates"
        />
        <!-- Повтор -->
        <Popper
          v-if="selectedTask.uid_customer === user.current_user_uid"
          class="popper-repeat"
          arrow
          trigger="hover"
          :class="isDark ? 'dark' : 'light'"
          placement="bottom"
          :disabled="selectedTask.type !== 1 && selectedTask.type !== 2"
          @click="showFreeModalRepeat = (user.tarif === 'free')"
        >
          <template
            #content="{ close }"
            class="bottom"
          >
            <div class="popper">
              <div class="text-white body-popover-custom body-repeat-custom rounded-b-lg">
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
                  v-if="noRepeat = selectedTask.SeriesType === 0 ? true : noRepeat"
                  class="top-panel-repeat"
                />
                <div
                  v-if="everyDayRepeat = selectedTask.SeriesType === 1 ? true : everyDayRepeat"
                  class="tab-content-repeat"
                >
                  <div class="top-panel-repeat">
                    <label>Каждый </label>
                    <div class="every-content">
                      <div class="form-group">
                        <input
                          ref="SeriesAfterCount"
                          v-model="SeriesAfterCount"
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
                  v-if="everyWeekRepeat = selectedTask.SeriesType === 2 ? true : everyWeekRepeat"
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
                          <label :for="'opt_' +opt.id">{{ opt.text }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="everyMonthRepeat = selectedTask.SeriesType === 3 ? true : everyMonthRepeat"
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
                        :class="{showselect:ActiveSelect==1}"
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
                        :class="{showselect:ActiveSelect>1}"
                      >
                        <div class="form-group">
                          <select
                            ref="SeriesMonthDayOfWeek"
                            v-model="SeriesMonthDayOfWeek"
                            class="form-control form-control-select-repeat"
                          >
                            <option
                              v-for="(item, value) in days.filter(v=>v !== '')"
                              :key="value>0"
                              :value="value+1"
                            >
                              {{ item }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div
                      class="form-group everymonthtype"
                      :class="{showselect:ActiveSelect>1}"
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
                      :class="{showselect:ActiveSelect==1}"
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
                  v-if="everyYearRepeat = selectedTask.SeriesType === 4 ? true : everyYearRepeat"
                  class="tab-content-repeat"
                >
                  <div class="top-panel-repeat">
                    <div class="flex repeat-seleclist">
                      <div
                        class="form-group"
                        style="margin-right: 5px;"
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
                        :class="{showselect:ActiveYartype == 1}"
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
                              :value="value+1"
                            >
                              {{ item }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div
                        class="everyyeartype"
                        :class="{showselect:ActiveYartype>1}"
                      >
                        <div class="form-group">
                          <select
                            ref="SeriesYearDayOfWeek"
                            v-model="SeriesYearDayOfWeek"
                            class="form-control form-control-select-repeat"
                          >
                            <option
                              v-for="(item, value) in days.filter(v=>v!=='')"
                              :key="value"
                              :value="value+1"
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
                      :class="{showselect:ActiveYartype == 1}"
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
                              :checked="selectedTask.SeriesYearMonthDay===day"
                            >
                            <label :for="'y1_' + day">{{ day }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="everyyearbuttontype"
                    :class="{showselect:ActiveYartype>1}"
                  >
                    <div class="form-group">
                      <select
                        ref="SeriesYearMonth"
                        v-model="SeriesYearMonth"
                        class="form-control select-repeat-control"
                      >
                        <option
                          v-for="(month,value) in months"
                          :key="value"
                          :value="value+1"
                          class="btn-month-year"
                        >
                          {{ month.substr(0,3) }}
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
              v-if="selectedTask.SeriesEnd!==''"
              class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 project-hover-close"
              :style="{ 'cursor': selectedTask.type !== 1 && selectedTask.type !== 2 ? 'default' : 'pointer' }"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 92 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :style="{ 'cursor': selectedTask.type !== 1 && selectedTask.type !== 2 ? 'default' : 'pointer' }"
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
              <span v-if="selectedTask.SeriesType===0">Не повторять</span>
              <span v-if="selectedTask.SeriesType===1"><span v-if="selectedTask.SeriesAfterType===1"><span v-if="selectedTask.SeriesAfterCount===1">Ежедневно: Каждый 1 день.</span><span v-else>Ежедневно: Каждый {{ selectedTask.SeriesAfterCount }} день.</span></span><span v-else-if="selectedTask.SeriesAfterType===2"><span v-if="selectedTask.SeriesAfterCount===1">Ежедневно:  </span><span v-else>Каждый {{ selectedTask.SeriesAfterCount }} неделю.</span></span><span v-else-if="selectedTask.SeriesAfterType===3"><span v-if="selectedTask.SeriesAfterCount===1">Ежедневно:  </span><span v-else>Ежедневно:  Каждый {{ selectedTask.SeriesAfterCount }} месяц.</span></span><span v-else-if="selectedTask.SeriesAfterType===4"><span v-if="selectedTask.SeriesAfterCount===1">Ежедневно:  </span><span v-else>Каждый {{ selectedTask.SeriesAfterCount }} год.</span></span> </span>
              <span v-if="selectedTask.SeriesType===2">Еженедельно: Каждую {{ selectedTask.SeriesWeekCount }} неделю, по:
                <span v-if="selectedTask.SeriesWeekMon===1">Пн. </span>
                <span v-if="selectedTask.SeriesWeekTue===1">Вт. </span>
                <span v-if="selectedTask.SeriesWeekWed===1">Ср. </span>
                <span v-if="selectedTask.SeriesWeekThu===1">Чт. </span>
                <span v-if="selectedTask.SeriesWeekFri===1">Пт. </span>
                <span v-if="selectedTask.SeriesWeekSat===1">Сб. </span>
                <span v-if="selectedTask.SeriesWeekSun===1">Вс. </span>
              </span>
              <span v-if="selectedTask.SeriesType===3">
                <span v-if="selectedTask.SeriesMonthType===1">Ежемесячно: Каждый {{ selectedTask.SeriesMonthCount }} месяц {{ selectedTask.SeriesMonthDay }} числа</span>
                <span v-else>Ежемесячно: {{ firstcount[selectedTask.SeriesMonthWeekType] }}
                  <span>{{ day[selectedTask.SeriesMonthDayOfWeek] }} каждый {{ selectedTask.SeriesMonthCount }} месяц</span>
                </span>
              </span>
              <span v-if="selectedTask.SeriesType===4">
                <span v-if="selectedTask.SeriesYearType===1">Ежегодно: Каждый год {{ selectedTask.SeriesYearMonthDay }}  {{ months[selectedTask.SeriesYearMonth-1] }}</span>
                <span v-else>Ежегодно:
                  Каждый {{ months[selectedTask.SeriesYearMonth-1] }} {{ firstcount[selectedTask.SeriesYearWeekType] }}
                  {{ day[selectedTask.SeriesYearDayOfWeek] }}
                </span>
              </span>
              <button
                v-if="selectedTask.SeriesType > 0 && (selectedTask.type === 1 || selectedTask.type === 2)"
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
        <!-- Кнопка Проект -->
        <TaskPropsButtonProject
          v-if="(selectedTask.type === 1 || selectedTask.type === 2 || (selectedTask.uid_project !== '00000000-0000-0000-0000-000000000000')) && ((selectedTask.uid_customer === user?.current_user_uid) && (selectedTask.status !== 1))"
          :selected-project="selectedTask.uid_project"
          :can-edit="selectedTask.type === 1 || selectedTask.type === 2"
          @changeProject="onChangeProject"
        />
        <!-- Кнопка Цвет -->
        <TaskPropsButtonColor
          v-if="(selectedTask.type === 1 || selectedTask.type === 2) && ((selectedTask.uid_customer === user?.current_user_uid) && (selectedTask.status !== 1))"
          :selected-color="selectedTask.uid_marker"
          :can-edit="selectedTask.type === 1 || selectedTask.type === 2"
          @changeColor="onChangeColor"
        />
        <!-- Кнопка Метки -->
        <TaskPropsButtonTags
          v-if="(selectedTask.type === 1 || selectedTask.type === 2) && ((selectedTask.uid_customer === user?.current_user_uid) && (selectedTask.status !== 1))"
          :selected-tags="selectedTask.tags"
          @changeTags="onChangeTags"
        />
        <!-- Чек лист -->
        <div
          v-if="!selectedTask.checklist && selectedTask.type!== 4 && selectedTask.type !== 3 && ((selectedTask.uid_customer === user?.current_user_uid) && (selectedTask.status !== 1))"
          class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100"
          @click="createChecklist"
        >
          <svg
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.0166016 1.1666C0.0166016 0.807616 0.307616 0.516602 0.666602 0.516602H9.83327C10.1923 0.516602 10.4833 0.807616 10.4833 1.1666V4.49993C10.4833 4.85892 10.1923 5.14993 9.83327 5.14993H0.666602C0.307616 5.14993 0.0166016 4.85892 0.0166016 4.49993V1.1666ZM1.3166 1.8166V3.84994H9.18327V1.8166H1.3166ZM12.707 0.706982C12.9608 0.453141 13.3724 0.453141 13.6262 0.706982L14.8333 1.91403L16.0403 0.706982C16.2942 0.453141 16.7057 0.453141 16.9596 0.706982C17.2134 0.960823 17.2134 1.37238 16.9596 1.62622L15.7525 2.83327L16.9596 4.04032C17.2134 4.29416 17.2134 4.70571 16.9596 4.95955C16.7057 5.21339 16.2942 5.2134 16.0403 4.95955L14.8333 3.75251L13.6262 4.95955C13.3724 5.2134 12.9608 5.21339 12.707 4.95955C12.4531 4.70571 12.4531 4.29416 12.707 4.04032L13.914 2.83327L12.707 1.62622C12.4531 1.37238 12.4531 0.960823 12.707 0.706982ZM17.7613 9.01076C18.0315 9.24715 18.0588 9.6578 17.8224 9.92796L14.9058 13.2613C14.7873 13.3967 14.618 13.4769 14.4382 13.4829C14.2584 13.4889 14.0842 13.4201 13.957 13.2929L12.2903 11.6262C12.0365 11.3724 12.0365 10.9608 12.2903 10.707C12.5442 10.4531 12.9557 10.4531 13.2096 10.707L14.3849 11.8824L16.8441 9.07191C17.0805 8.80174 17.4911 8.77437 17.7613 9.01076ZM0.0166016 9.49993C0.0166016 9.14095 0.307616 8.84993 0.666602 8.84993H9.83327C10.1923 8.84993 10.4833 9.14095 10.4833 9.49993V12.8333C10.4833 13.1923 10.1923 13.4833 9.83327 13.4833H0.666602C0.307616 13.4833 0.0166016 13.1923 0.0166016 12.8333V9.49993ZM1.3166 10.1499V12.1833H9.18327V10.1499H1.3166Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded"> Чек-лист</span>
        </div>
        <!-- Фокус -->
        <TaskPropsButtonFocus
          v-if="!((selectedTask.uid_customer !== user?.current_user_uid) && (selectedTask.status === 1))"
          :focus="isInFocus"
          @toggle-focus="changeFocus(selectedTask.uid, isInFocus ? 0 : 1)"
        />
        <!-- Три точки -->
        <TaskPropsButtonDots
          :show-delete="selectedTask.type === 1 || selectedTask.type === 2"
          :date-create="selectedTask.date_create"
          :only-files="showOnlyFiles"
          @copyUrl="copyurl"
          @deleteTask="showConfirm = true"
          @toggleFiles="showOnlyFiles = !showOnlyFiles"
        />
      </div>
      <!-- Checklist -->
      <TaskPropsChecklist
        v-if="selectedTask.checklist || checklistshow || checklistSavedNow"
        class="mb-[20px] checklist-custom"
        :checklist="selectedTask.checklist"
        :can-edit="canEditChecklist"
        :can-check="canCheckChecklist"
        :add-new="checklistshow"
        @changeChecklist="onChangeChecklist"
        @endEdit="onAddChecklistComplete"
      />
      <!-- Comment -->
      <TaskPropsCommentEditor
        class="mt-3 h-32"
        :comment="selectedTask.comment ?? ''"
        :can-edit="canEditComment"
        @endChangeComment="endChangeComment"
        @changeComment="onChangeComment"
      />
      <!-- Show all -->
      <p
        v-if="taskMessages.length > 2 && !showAllMessages"
        class="text-gray-500 dark:text-gray-100 text-sm text-center cursor-pointer"
        style="border-bottom: 1px dashed; padding-bottom: 0; width: 125px; margin: 0 auto;"
        @click="scrollDown"
      >
        ПОКАЗАТЬ ВСЕ
      </p>
      <!-- Chat messages -->
      <MessageSkeleton
        v-if="status == 'loading'"
      />
      <TaskPropsChatMessages
        v-if="taskMessages?.length && status=='success'"
        id="content"
        class="mt-3 h-3/6"
        :task-messages="taskMessages"
        :current-user-uid="user?.current_user_uid"
        :show-all-messages="showAllMessages"
        :show-only-files="showOnlyFiles"
        @answerMessage="onAnswerMessage"
        @sendTaskMsg="sendTaskMsg"
        @onPasteEvent="onPasteEvent"
        @deleteFiles="deleteFiles"
        @deleteTaskMsg="deleteTaskMsg"
      />
    </div>
  </div>
  <div class="w-full">
    <img
      v-if="isloading"
      src="/ajaxloader.gif"
    >
    <div
      v-if="currentAnswerMessageUid"
      class="quote-request border-l-2 border-[#7E7E80] mt-2 h-9"
    >
      <div class="flex flex-row items-center">
        <div class="grow width100without20">
          <div
            class="mx-1"
          >
            <p class="text-[11px] leading-[16px] overflow-hidden text-black text-ellipsis whitespace-nowrap">
              {{ messageQuoteUser }}
            </p>
            <p class="text-[12px] leading-[16px] overflow-hidden text-[#9a9fa6] text-ellipsis whitespace-nowrap">
              {{ messageQuoteString }}
            </p>
          </div>
        </div>
        <div
          class="flex-none p-0.5 relative bottom-2"
          @click="onAnswerMessage('')"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.28481 4.30107C4.67082 3.90608 5.30395 3.8988 5.69893 4.28481L9.25 7.75517L12.8011 4.28481C13.1961 3.8988 13.8292 3.90608 14.2152 4.30107C14.6012 4.69605 14.5939 5.32918 14.1989 5.71519L10.6808 9.15341L14.1989 12.5916C14.5939 12.9776 14.6012 13.6108 14.2152 14.0058C13.8292 14.4007 13.1961 14.408 12.8011 14.022L9.25 10.5516L5.69893 14.022C5.30395 14.408 4.67082 14.4007 4.28481 14.0058C3.8988 13.6108 3.90608 12.9776 4.30107 12.5916L7.81925 9.15341L4.30107 5.71519C3.90608 5.32918 3.8988 4.69605 4.28481 4.30107Z"
              fill="#999999"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      id="drop-area"
      class="input-group bg-gray-100 rounded-[10px] mt-2"
    >
      <span class="input-group-addon input-group-attach dark:bg-gray-800 dark:text-gray-100">
        <div class="example-1">
          <label
            v-if="user.tarif !== 'free'"
            class="label"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.94475 17.443C3.17452 18.6611 4.78671 19.2627 6.3989 19.2627C8.0111 19.2627 9.62329 18.6537 10.8531 17.4356L18.5841 9.77812C20.3388 8.04015 20.3388 5.21038 18.5841 3.47241C17.7368 2.63313 16.6045 2.16522 15.4047 2.16522C14.2049 2.16522 13.0726 2.6257 12.2253 3.47241L5.12415 10.506C4.07435 11.5458 4.07435 13.2466 5.12415 14.2865C6.17395 15.3263 7.89112 15.3263 8.94092 14.2865L13.6125 9.65929C13.965 9.31021 13.965 8.74574 13.6125 8.39666C13.2601 8.04758 12.6902 8.04758 12.3378 8.39666L7.67366 13.0313C7.32123 13.3803 6.75134 13.3803 6.3989 13.0313C6.04647 12.6822 6.04647 12.1177 6.3989 11.7686L13.4926 4.74246C14.0025 4.23741 14.6773 3.96261 15.4047 3.96261C16.1246 3.96261 16.8069 4.23741 17.3168 4.74246C18.3666 5.78228 18.3666 7.48311 17.3168 8.52292L9.5783 16.1804C7.82364 17.9184 4.96668 17.9184 3.21201 16.1804C2.36467 15.3411 1.89976 14.2196 1.89976 13.0313C1.89976 11.8429 2.36467 10.7214 3.21951 9.88211L10.943 2.22463C11.2955 1.87555 11.2955 1.31108 10.943 0.962005C10.5906 0.612925 10.0207 0.612925 9.66829 0.962005L1.94475 8.61948C0.752474 9.79298 0.100098 11.3601 0.100098 13.0313C0.100098 14.695 0.752474 16.2621 1.94475 17.443Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
            <input
              id="file_attach"
              ref="file_attach"
              type="file"
              multiple="multiple"
              name="file_attach"
              @change="createTaskFile($event)"
            >
          </label>
          <svg
            v-if="user.tarif === 'free'"
            class="mx-3.5 cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="showFreeModalChat = true"
          >
            <path
              d="M1.94475 17.443C3.17452 18.6611 4.78671 19.2627 6.3989 19.2627C8.0111 19.2627 9.62329 18.6537 10.8531 17.4356L18.5841 9.77812C20.3388 8.04015 20.3388 5.21038 18.5841 3.47241C17.7368 2.63313 16.6045 2.16522 15.4047 2.16522C14.2049 2.16522 13.0726 2.6257 12.2253 3.47241L5.12415 10.506C4.07435 11.5458 4.07435 13.2466 5.12415 14.2865C6.17395 15.3263 7.89112 15.3263 8.94092 14.2865L13.6125 9.65929C13.965 9.31021 13.965 8.74574 13.6125 8.39666C13.2601 8.04758 12.6902 8.04758 12.3378 8.39666L7.67366 13.0313C7.32123 13.3803 6.75134 13.3803 6.3989 13.0313C6.04647 12.6822 6.04647 12.1177 6.3989 11.7686L13.4926 4.74246C14.0025 4.23741 14.6773 3.96261 15.4047 3.96261C16.1246 3.96261 16.8069 4.23741 17.3168 4.74246C18.3666 5.78228 18.3666 7.48311 17.3168 8.52292L9.5783 16.1804C7.82364 17.9184 4.96668 17.9184 3.21201 16.1804C2.36467 15.3411 1.89976 14.2196 1.89976 13.0313C1.89976 11.8429 2.36467 10.7214 3.21951 9.88211L10.943 2.22463C11.2955 1.87555 11.2955 1.31108 10.943 0.962005C10.5906 0.612925 10.0207 0.612925 9.66829 0.962005L1.94475 8.61948C0.752474 9.79298 0.100098 11.3601 0.100098 13.0313C0.100098 14.695 0.752474 16.2621 1.94475 17.443Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
        </div>
      </span>
      <textarea
        v-if="user.tarif !== 'free'"
        ref="taskMsgEdit"
        v-model="taskMsg"
        class="form-control mt-[6px] mb-[8px] text-group-design task-msg overflow-auto scroll-style dark:bg-gray-800 dark:text-gray-100 focus:ring-0"
        placeholder="Напишите сообщение..."
        rows="58"
        @input="onInputTaskMsg"
        @keydown.enter.exact.prevent="sendTaskMsg()"
        @keydown.enter.shift.exact.prevent="addNewLineTaskMsg"
      />
      <div
        v-if="user.tarif === 'free'"
        @click="showFreeModalChat = true"
      >
        <textarea
          ref="taskMsgEdit"
          v-model="taskMsg"
          class="form-control mt-[6px] mb-[8px] text-group-design task-msg overflow-auto scroll-style dark:bg-gray-800 dark:text-gray-100 focus:ring-0"
          placeholder="Напишите сообщение..."
          rows="58"
          disabled
        />
      </div>
      <span class="input-group-addon input-group-btn-send dark:bg-gray-800 dark:text-gray-100">
        <button
          type="button"
          name="btn-send"
          class="btn-send-custom"
          @click="sendTaskMsg()"
        >
          <svg
            width="32"
            class="mr-2"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="32"
              height="32"
              rx="8"
              fill="#E0E1E3"
            />
            <path
              d="M16 8L9 15L9.987 15.987L15.3 10.681V24.8H16.7V10.681L22.013 15.987L23 15L16 8Z"
              fill="#4C4C4D"
            />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import Popper from 'vue3-popper'
import close from '@/icons/close.js'
import { CREATE_MESSAGE_REQUEST, DELETE_MESSAGE_REQUEST } from '@/store/actions/taskmessages'
import { CREATE_FILES_REQUEST, DELETE_FILE_REQUEST } from '@/store/actions/taskfiles'
import * as TASK from '@/store/actions/tasks'
import * as INSPECTOR from '@/store/actions/inspector'
import { copyText } from 'vue3-clipboard'

import linkify from 'vue-linkify'
import { maska } from 'maska'

import { shouldAddTaskIntoList } from '@/websync/utils'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import TaskPropsButtonDots from '@/components/TaskProperties/TaskPropsButtonDots.vue'
import TaskPropsButtonFocus from '@/components/TaskProperties/TaskPropsButtonFocus.vue'
import TaskPropsChatMessages from '@/components/TaskProperties/TaskPropsChatMessages.vue'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import TaskPropsButtonAccess from '@/components/TaskProperties/TaskPropsButtonAccess.vue'
import TaskPropsButtonSetDate from '@/components/TaskProperties/TaskPropsButtonSetDate.vue'
import TaskPropsButtonTags from '@/components/TaskProperties/TaskPropsButtonTags.vue'
import TaskPropsButtonPerform from '@/components/TaskProperties/TaskPropsButtonPerform.vue'
import TaskPropsButtonProject from '@/components/TaskProperties/TaskPropsButtonProject.vue'
import TaskPropsButtonColor from '@/components/TaskProperties/TaskPropsButtonColor.vue'
import TaskPropsChecklist from '@/components/TaskProperties/TaskPropsChecklist.vue'
import MessageSkeleton from '@/components/TaskProperties/MessageSkeleton.vue'
import RepeatLimit from '@/components/properties/RepeatLimit'
import ChecklistLimit from '@/components/properties/ChecklistLimit'
import ChatLimit from '@/components/properties/ChatLimit'
import PerformerLimit from '@/components/TaskProperties/PerformerLimit'

export default {
  components: {
    TaskPropsButtonDots,
    TaskPropsButtonFocus,
    TaskPropsChatMessages,
    PerformerLimit,
    TaskPropsButtonAccess,
    ChecklistLimit,
    RepeatLimit,
    ChatLimit,
    MessageSkeleton,
    TaskPropsButtonSetDate,
    TaskPropsButtonTags,
    TaskPropsButtonPerform,
    TaskPropsButtonProject,
    TaskPropsButtonColor,
    Popper,
    ModalBoxDelete,
    TaskPropsCommentEditor,
    TaskPropsChecklist
  },
  directives: {
    linkify,
    maska
  },
  data () {
    return {
      shouldAddTaskIntoList,
      close,
      showAllMessages: false,
      showFreeModalCheck: false,
      showFreeModalRepeat: false,
      showFreeModalChat: false,
      showFreeModalPerform: false,
      timeStartActive: false,
      checklistshow: false,
      checklistSavedNow: false,
      noRepeat: false,
      everyDayRepeat: false,
      everyWeekRepeat: false,
      everyMonthRepeat: false,
      everyYearRepeat: false,
      isEditable: false,
      isEditableTaskName: false,
      showOnlyFiles: false,
      showConfirm: false,

      currentAnswerMessageUid: '',
      taskMsg: '',
      files: [], // replace this with const in function createTaskFiles

      months: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
      days: ['', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
      day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      firstcount: ['последний', 'первый', 'второй', 'третий', 'четвертый', 'последний'],
      myOptions: [
        { id: 'mon', text: 'Пн' },
        { id: 'tue', text: 'Вт' },
        { id: 'wed', text: 'Ср' },
        { id: 'thu', text: 'Чт' },
        { id: 'fri', text: 'Пт' },
        { id: 'sat', text: 'Сб' },
        { id: 'sun', text: 'Вс' }
      ],

      range: {
        start: this.selectedTask?.term_customer === '' ? new Date() : new Date(this.selectedTask?.customer_date_begin),
        end: this.selectedTask?.term_customer === '' ? new Date() : new Date(this.selectedTask?.customer_date_end)
      },
      timeStart: this.selectedTask?.term_customer === '' ? '' : new Date(this.selectedTask?.customer_date_begin).toLocaleTimeString(),
      timeEnd: this.selectedTask?.term_customer === '' ? '' : new Date(this.selectedTask?.customer_date_end).toLocaleTimeString(),
      SeriesType: this.selectedTask?.SeriesType,
      SeriesAfterCount: this.selectedTask?.SeriesAfterCount,
      SeriesAfterType: this.selectedTask?.SeriesAfterType,
      SeriesWeekCount: this.selectedTask?.SeriesWeekCount,
      SeriesMonthType: this.selectedTask?.SeriesMonthType === 1 ? this.selectedTask?.SeriesMonthType : this.selectedTask?.SeriesMonthWeekType,
      SeriesMonthCount: this.selectedTask?.SeriesMonthCount ?? 1,
      SeriesMonthDay: this.selectedTask?.SeriesMonthDay,
      SeriesMonthWeekType: this.selectedTask?.SeriesMonthWeekType,
      SeriesMonthDayOfWeek: this.selectedTask?.SeriesMonthDayOfWeek,
      SeriesYearType: this.selectedTask?.SeriesYearType === 1 ? this.selectedTask?.SeriesYearType : this.selectedTask?.SeriesYearWeekType,
      SeriesYearMonth: this.selectedTask?.SeriesYearMonth === 0 ? '1' : this.selectedTask?.SeriesYearMonth,
      SeriesYearMonthDay: this.selectedTask?.SeriesYearMonthDay,
      SeriesYearWeekType: this.selectedTask?.SeriesYearWeekType,
      SeriesYearDayOfWeek: this.selectedTask?.SeriesYearDayOfWeek,
      ActiveSelect: this.selectedTask?.SeriesMonthType,
      ActiveYartype: this.selectedTask?.SeriesYearType,
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
    taskMessages () { return this.$store.state.taskfilesandmessages.messages },
    uploadStarted () { return this.$store.state.taskfilesandmessages.uploadStarted },
    selectedTask () { return this.$store.state.tasks.selectedTask },
    isPropertiesMobileExpanded () { return this.$store.state.isPropertiesMobileExpanded },
    taskMessagesAndFiles () { return this.$store.state.taskfilesandmessages.messages },
    user () { return this.$store.state.user.user },
    status () { return this.$store.state.taskfilesandmessages.status },
    tasks () { return this.$store.state.tasks.newtasks },
    isDark () { return this.$store.state.darkMode },
    calendarDates () { return this.$store.state.calendar[1].dates },
    daysWithTasks () { return this.$store.state.tasks.daysWithTasks },
    navStack () { return this.$store.state.navbar.navStack },
    isInFocus () { return this.selectedTask?.focus === 1 },
    isAccessVisible () {
      if (this.selectedTask.emails) return true
      if (this.selectedTask.type === 1 || this.selectedTask.type === 2) return true
      return false
    },
    modalBoxDeleteText () {
      let text = 'Вы действительно хотите удалить задачу?'
      if (this.tasks[this.selectedTask.uid]?.children?.length > 0) {
        text = 'Вы действительно хотите удалить задачу с подзадачами в количестве: ' + this.tasks[this.selectedTask.uid]?.children?.length + '?'
      }
      return text
    },
    canEditChecklist () { return (this.selectedTask.type === 1 || this.selectedTask.type === 2) && this.user.tarif !== 'free' },
    canCheckChecklist () { return (this.canEditChecklist || this.selectedTask.type === 3) && this.user.tarif !== 'free' },
    canEditComment () { return (this.selectedTask.type === 1 || this.selectedTask.type === 2) }
  },
  watch: {
    selectedTask (newval, oldval) {
      this.showOnlyFiles = false
      this.showAllMessages = false
      this.currentAnswerMessageUid = ''
      this.$nextTick(function () {
        this.onInputTaskMsg()
      })
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Код, который будет запущен только после
      // отображения всех представлений
      this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
    })
  },
  methods: {
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    changeFocus (uid, value) {
      this.$store.dispatch(TASK.CHANGE_TASK_FOCUS, { uid: uid, value: value }).then(
        resp => {
          this.selectedTask.focus = value
        })
    },
    createTaskFile (event) {
      this.files = event.target.files
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        uid_task: this.selectedTask.uid,
        name: formData
      }

      for (const formItem of formData) {
        this.$store.commit(
          'createLoadingFile',
          {
            msg: formItem[1].name,
            uid_creator: this.user.current_user_uid,
            date_create: new Date().toISOString(),
            file_size: formItem[1].size
          }
        )
      }

      this.$store.dispatch(CREATE_FILES_REQUEST, data).then(
        resp => {
          if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
            if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
              this.selectedTask.status = 9
            }
          }
          this.selectedTask.has_files = true
          if (this.selectedTask.uid_customer === this.user.current_user_uid && (this.selectedTask.status === 5 || this.selectedTask.status === 7)) {
            // to refine
            this.selectedTask.status = 9
          }
        })
      this.infoComplete = true
      setTimeout(() => {
        const element = document.getElementById('content').lastElementChild
        element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    deleteTask () {
      this.showConfirm = false
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      const data = {
        uid: this.selectedTask.uid
      }
      this.$store.dispatch(TASK.REMOVE_TASK, data.uid)
        .then(() => {
          this.$store.dispatch(TASK.DAYS_WITH_TASKS)
            .then(() => {
              // TODO: need to be refactored
              for (let i = 0; i < this.calendarDates.length; i++) {
                const date = this.calendarDates[i].getDate() + '-' + (this.calendarDates[i].getMonth() + 1) + '-' + this.calendarDates[i].getFullYear()
                if (!this.daysWithTasks.includes(date)) {
                  this.$store.state.calendar[1].dates.splice(this.$store.state.calendar[1].dates.indexOf(this.$calendarDates.value[i]), 1)
                }
              }
            })
        })
    },
    deleteTaskMsg (uid) {
      this.$store.dispatch(DELETE_MESSAGE_REQUEST, { uid: uid }).then(
        resp => {
          this.selectedTask.has_msgs = true
          this.taskMessages.find(message => message.uid_msg) ? this.taskMessages.find(message => message.uid_msg === uid).deleted = 1 : this.taskMessages.find(message => message.uid === uid).deleted = 1
        })
    },
    deleteFiles (uid) {
      this.$store.dispatch(DELETE_FILE_REQUEST, { uid: uid })
    },
    changeName (event) {
      const data = {
        uid: this.selectedTask.uid,
        value: event.target.innerText
      }
      this.$store.dispatch(TASK.CHANGE_TASK_NAME, data)
    },
    handleInput () {
      const timestart = this.timeStart === '' ? 'T00:00:00' : 'T' + this.timeStart
      const timeend = this.timeEnd === '' ? '' : 'T' + this.timeEnd + ':00'
      const starttime = new Date(this.range.start).getFullYear() + '-' + (this.pad2(new Date(this.range.start).getMonth() + 1)) + '-' + this.pad2(new Date(this.range.start).getDate()) + timestart
      const startend = new Date(this.range.end).getFullYear() + '-' + (this.pad2(new Date(this.range.start).getMonth() + 1)) + '-' + this.pad2(new Date(this.range.end).getDate()) + timeend
      const data = {
        uid_task: this.selectedTask.uid,
        str_date_begin: starttime,
        str_date_end: startend,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data).then(
        resp => {
          this.selectedTask.term_customer = resp.term
          this.selectedTask.is_overdue = resp.is_overdue
          this.timeStart = timestart !== '' ? '' : timestart
          this.timeEnd = timeend !== '' ? '' : timeend
          this.timeStartActive = true
        })
    },
    resetRepeat () {
      const data = {
        uid: this.selectedTask.uid
      }
      this.$store.dispatch(TASK.RESET_REPEAT_CHANGE, data).then(
        resp => {
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
    copyurl (e) {
      copyText(`${window.location.origin}/task/${this.selectedTask.uid}`, undefined, (error, event) => {
        console.log(error, event)
      })
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
    setCursorPosition (oInput, oStart, oEnd) {
      if (oInput.setSelectionRange) {
        oInput.setSelectionRange(oStart, oEnd)
      } else if (oInput.createTextRange) {
        const range = oInput.createTextRange()
        range.collapse(true)
        range.moveEnd('character', oEnd)
        range.moveStart('character', oStart)
        range.select()
      }
    },
    changeComment (event) {
      if (!this.canEditComment) return
      const message = event.target.innerText.trim()
      this.setCursorPosition(event.target.id, 0, 100)
      const data = {
        uid: this.selectedTask.uid,
        value: message
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COMMENT, data)
    },
    removeEditTaskName (event) {
      this.isEditableTaskName = false
      const taskName = event.target.innerText
      this.selectedTask.name = taskName
    },
    scrollDown () {
      this.showAllMessages = true
      this.infoComplete = true
      setTimeout(() => {
        const elmnt = document.getElementById('content').lastElementChild
        elmnt.scrollIntoView()
      }, 200)
    },
    createChecklist () {
      if (this.user.tarif === 'free') {
        this.showFreeModalCheck = true
        return
      }
      this.checklistshow = true
    },
    SaveRepeat () {
      if (this.$refs.SeriesType.value === '0') {
        const data = {
          uid: this.selectedTask.uid
        }
        this.$store.dispatch(TASK.RESET_REPEAT_CHANGE, data).then(
          resp => {
            this.selectedTask.SeriesType = 0
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
        this.$store.dispatch(TASK.EVERY_DAY_CHANGE, data).then(
          resp => {
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
        this.$store.dispatch(TASK.EVERY_WEEK_CHANGE, data).then(
          resp => {
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

          this.$store.dispatch(TASK.EVERY_MONTH_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 3
              this.selectedTask.SeriesMonthCount = resp.data.SeriesMonthCount
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesMonthDayOfWeek
              this.selectedTask.SeriesMonthType = resp.data.SeriesMonthType
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthWeekType = resp.data.SeriesMonthWeekType
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
          this.$store.dispatch(TASK.EVERY_MONTH_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 3
              this.selectedTask.SeriesMonthCount = resp.data.SeriesMonthCount
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesMonthDayOfWeek
              this.selectedTask.SeriesMonthType = resp.data.SeriesMonthType
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthWeekType = resp.data.SeriesMonthWeekType
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
          this.$store.dispatch(TASK.EVERY_YEAR_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 4
              this.selectedTask.SeriesYearDayOfWeek = resp.data.SeriesYearDayOfWeek
              this.selectedTask.SeriesYearMonth = resp.data.SeriesYearMonth
              this.selectedTask.SeriesYearType = resp.data.SeriesYearType
              this.selectedTask.SeriesYearMonthDay = resp.data.SeriesYearMonthDay
              this.selectedTask.SeriesMonthWeekType = resp.data.SeriesYearWeekType
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesYearDayOfWeek
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
          this.$store.dispatch(TASK.EVERY_YEAR_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 4
              this.selectedTask.SeriesYearDayOfWeek = resp.data.SeriesYearDayOfWeek
              this.selectedTask.SeriesYearMonth = resp.data.SeriesYearMonth
              this.selectedTask.SeriesYearMonthDay = resp.data.SeriesYearMonthDay
              this.selectedTask.SeriesYearWeekType = resp.data.SeriesYearWeekType
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesYearDayOfWeek
            })
        }
      }
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
    getFixedCommentName () {
      return this.selectedTask.name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br/>')
    },
    print (value) {
      console.log(value)
    },
    sendTaskMsg: function (msg) {
      let msgtask = msg || this.taskMsg
      msgtask = msgtask.trim()
      msgtask = msgtask.replaceAll('&', '&amp;')
      msgtask = msgtask.replaceAll('<', '&lt;')
      msgtask = msgtask.replaceAll('>', '&gt;')
      const uid = this.uuidv4()
      const data = {
        uid_task: this.selectedTask.uid,
        uid: uid,
        uid_creator: this.user?.current_user_uid,
        uid_msg: uid,
        date_create: new Date().toISOString(),
        deleted: 0,
        uid_quote: this.currentAnswerMessageUid,
        text: msgtask,
        msg: msgtask
      }
      if (data.text) {
        this.$store.dispatch(CREATE_MESSAGE_REQUEST, data).then(
          resp => {
          // Answer last inspector message
            const lastInspectorMessage = this.taskMessagesAndFiles.slice().reverse().find(message => message.uid_creator === 'inspector')
            if (lastInspectorMessage && this.selectedTask.uid_performer === this.user?.current_user_uid) {
              this.$store.dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, { id: lastInspectorMessage.id, answer: 1 }).then(() => {
                lastInspectorMessage.performer_answer = 1
              })
            }
            this.selectedTask.has_msgs = true
            if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
              if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
                if (((this.selectedTask.uid_customer === this.user?.current_user_uid) && ((this.selectedTask.status === 1) || (this.selectedTask.status === 5)))) {
                  this.selectedTask.status = 9
                }
              }
              this.selectedTask.msg = decodeURIComponent(this.taskMsg)
              const wrapperElement = document.getElementById('content').lastElementChild
              wrapperElement.scrollIntoView({ behavior: 'smooth' })
            }
          })
      }
      this.currentAnswerMessageUid = ''
      this.taskMsg = ''
      this.$nextTick(function () {
        this.onInputTaskMsg()
      })
    },
    onInputTaskMsg: function () {
      // после этого рассчитает новый scrollHeight
      this.$refs.taskMsgEdit.style.height = '40px'
      //
      const defAnswerHeight = this.currentAnswerMessageUid ? 36 + 8 : 0
      const defSendHeight = 96
      const defEditHeight = 40
      const defEditHeightMax = 100
      const scrollHeight = this.$refs.taskMsgEdit.scrollHeight
      const scrollHeightFix = scrollHeight < defEditHeight ? defEditHeight : scrollHeight > defEditHeightMax ? defEditHeightMax : scrollHeight
      const sendHeight = defSendHeight + scrollHeightFix + defAnswerHeight - defEditHeight
      //
      this.$refs.taskMsgEdit.style.height = scrollHeight + 'px'
      document.documentElement.style.setProperty('--hex-parent-height', sendHeight + 'px')
    },
    addNewLineTaskMsg: function () {
      this.taskMsg += '\n'
      this.$nextTick(function () {
        this.onInputTaskMsg()
        this.$refs.taskMsgEdit.scrollTo(0, this.$refs.taskMsgEdit.scrollHeight)
      })
    },
    onPasteEvent: function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      let loadFile = false
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_task: this.selectedTask.uid,
            name: formData
          }
          loadFile = true
          this.isloading = true
          this.$store.dispatch(CREATE_FILES_REQUEST, data).then(
            resp => {
              this.isloading = false
              // ставим статус "на доработку" когда прикладываем файл
              if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
                if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
                  if (((this.selectedTask.uid_customer === this.user?.current_user_uid) && ((this.selectedTask.status === 1) || (this.selectedTask.status === 5)))) {
                    this.selectedTask.status = 9
                  }
                }
              }
              // загрузка завершена - подписываемся опять
              this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
            })
          setTimeout(() => {
            const elmnt = document.getElementById('content').lastElementChild
            elmnt.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
      if (!loadFile) {
        // не вставка файла - подписываемся опять
        this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
      }
    },
    onReAssignToUser: function (userEmail) {
      const data = {
        uid: this.selectedTask.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_REDELEGATE, data).then(
        resp => {
          this.$store.dispatch(TASK.ADD_SUBTASK, resp.data)
        }
      )
    },
    shouldShowFreePerformer () {
      if (this.user.tarif === 'free') {
        this.showFreeModalPerform = true
      }
    },
    onChangePerformer: function (userEmail) {
      const taskUid = this.selectedTask.uid
      const data = {
        uid: this.selectedTask.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, data).then(
        resp => {
          this.selectedTask.email_performer = resp.data.email_performer
          this.selectedTask.perform_time = resp.data.perform_time
          this.selectedTask.performerreaded = resp.data.performerreaded
          this.selectedTask.uid_performer = resp.data.uid_performer
          this.selectedTask.type = resp.data.type
        }
      )
      if (this.navStack.length && this.navStack.length > 0) {
        const navStackUid = this.navStack[0]?.uid
        if (navStackUid === '901841d9-0016-491d-ad66-8ee42d2b496b') {
          this.$store.commit(TASK.REMOVE_TASK, taskUid)
          this.$store.dispatch('asidePropertiesToggle', false)
        }
      }
    },
    onChangeDates: function (begin, end) {
      const taskUid = this.selectedTask.uid
      const data = {
        uid_task: this.selectedTask.uid,
        str_date_begin: begin,
        str_date_end: end,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data).then(resp => {
        this.selectedTask.is_overdue = resp.is_overdue
        this.selectedTask.term_user = resp.term
        this.selectedTask.date_begin = begin
        this.selectedTask.date_end = end

        if (!shouldAddTaskIntoList(this.selectedTask)) {
          this.$store.commit(TASK.REMOVE_TASK, taskUid)
          this.$store.dispatch('asidePropertiesToggle', false)
        }
      })
    },
    onChangeAccess: function (checkEmails) {
      const emails = checkEmails.join('..')
      const data = {
        uid: this.selectedTask.uid,
        value: emails
      }
      this.$store.dispatch(TASK.CHANGE_TASK_ACCESS, data).then(
        resp => {
          this.selectedTask.emails = emails
          if (!this.shouldAddTaskIntoList(this.selectedTask)) {
            // (!checkEmails.includes(this.user.current_user_email))
            this.$store.commit(TASK.REMOVE_TASK, this.selectedTask.uid)
            this.closeProperties()
          }
        }
      )
    },
    onChangeProject: function (projectUid) {
      const data = {
        uid: this.selectedTask.uid,
        value: projectUid
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PROJECT, data).then(
        resp => {
          this.selectedTask.uid_project = projectUid
        }
      )
    },
    onChangeTags: function (tags) {
      const data = {
        uid: this.selectedTask.uid,
        tags: tags
      }
      this.$store.dispatch(TASK.CHANGE_TASK_TAGS, data).then(
        resp => {
          this.selectedTask.tags = [...tags]
        }
      )
    },
    onChangeColor: function (colorUid) {
      const data = {
        uid: this.selectedTask.uid,
        value: colorUid
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COLOR, data).then(
        resp => {
          this.selectedTask.uid_marker = colorUid
        }
      )
    },
    onChangeComment: function (text) {
      const data = {
        uid: this.selectedTask.uid,
        value: text
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COMMENT, data)
    },
    endChangeComment: function (text) {
      // чтобы у нас в интерфейсе поменялось
      // потому что на changeComment он только
      // на сервер отправляет и всё
      this.selectedTask.comment = text
    },
    gotoParentNode (uid) {
      document.getElementById(uid).parentNode.click({ preventScroll: false })
    },
    onAnswerMessage (uid) {
      this.currentAnswerMessageUid = uid
      this.$nextTick(function () {
        this.onInputTaskMsg()
      })
    },
    onChangeChecklist (checklist) {
      const data = {
        uid_task: this.selectedTask.uid,
        checklist: checklist
      }
      this.checklistSavedNow = true
      this.$store.dispatch(TASK.CHANGE_TASK_CHECKLIST, data).then(
        resp => {
          this.selectedTask.checklist = checklist
        }
      ).finally(() => {
        this.checklistSavedNow = false
      })
    },
    onAddChecklistComplete () {
      this.checklistshow = false
    }
  }
}
</script>

<style>
.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eeeeee;
  --popper-theme-border-radius: 0.75rem;
  --popper-theme-padding: 10px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
.linkified {
  @apply text-blue-600;
}
.vc-container.calendar-properties {
  --white: #ffffff;
  --black: #000000;
  --gray-100: #f7fafc;
  --gray-200: #edf2f7;
  --gray-300: #e2e8f0;
  --gray-400: #cbd5e0;
  --gray-500: #a0aec0;
  --gray-600: #718096;
  --gray-700: #4a5568;
  --gray-800: #2d3748;
  --gray-900: #1a202c;
  --red-100: #fff5f5;
  --red-200: #fed7d7;
  --red-300: #feb2b2;
  --red-400: #fc8181;
  --red-500: #f56565;
  --red-600: #e53e3e;
  --red-700: #c53030;
  --red-800: #9b2c2c;
  --red-900: #742a2a;
  --orange-100: #fffaf0;
  --orange-200: #feebc8;
  --orange-300: #fbd38d;
  --orange-400: #f6ad55;
  --orange-500: #ed8936;
  --orange-600: #dd6b20;
  --orange-700: #c05621;
  --orange-800: #9c4221;
  --orange-900: #7b341e;
  --yellow-100: #fffff0;
  --yellow-200: #fefcbf;
  --yellow-300: #faf089;
  --yellow-400: #f6e05e;
  --yellow-500: #ecc94b;
  --yellow-600: #d69e2e;
  --yellow-700: #b7791f;
  --yellow-800: #975a16;
  --yellow-900: #744210;
  --green-100: #f0fff4;
  --green-200: #c6f6d5;
  --green-300: #9ae6b4;
  --green-400: #68d391;
  --green-500: #48bb78;
  --green-600: #38a169;
  --green-700: #2f855a;
  --green-800: #276749;
  --green-900: #22543d;
  --teal-100: #e6fffa;
  --teal-200: #b2f5ea;
  --teal-300: #81e6d9;
  --teal-400: #4fd1c5;
  --teal-500: #38b2ac;
  --teal-600: #319795;
  --teal-700: #2c7a7b;
  --teal-800: #285e61;
  --teal-900: #234e52;
  --blue-100: #ebf8ff;
  --blue-200: #e2e8f0;
  --blue-300: #90cdf4;
  --blue-400: #63b3ed;
  --blue-500: #4299e1;
  --blue-600: #a0aec0;
  --blue-700: #2b6cb0;
  --blue-800: #2c5282;
  --blue-900: #2a4365;
  --indigo-100: #ebf4ff;
  --indigo-200: #c3dafe;
  --indigo-300: #a3bffa;
  --indigo-400: #7f9cf5;
  --indigo-500: #667eea;
  --indigo-600: #5a67d8;
  --indigo-700: #4c51bf;
  --indigo-800: #434190;
  --indigo-900: #3c366b;
  --purple-100: #faf5ff;
  --purple-200: #e9d8fd;
  --purple-300: #d6bcfa;
  --purple-400: #b794f4;
  --purple-500: #9f7aea;
  --purple-600: #805ad5;
  --purple-700: #6b46c1;
  --purple-800: #553c9a;
  --purple-900: #44337a;
  --pink-100: #fff5f7;
  --pink-200: #fed7e2;
  --pink-300: #fbb6ce;
  --pink-400: #f687b3;
  --pink-500: #ed64a6;
  --pink-600: #d53f8c;
  --pink-700: #b83280;
  --pink-800: #97266d;
  --pink-900: #702459;
}
.vc-container.calendar-properties {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --leading-snug: 1.375;
  --rounded: 0.25rem;
  --rounded-lg: 0.5rem;
  --rounded-full: 0.5rem !important;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --slide-translate: 22px;
  --slide-duration: 0.15s;
  --slide-timing: ease;
  --day-content-transition-time: 0.13s ease-in;
  --weeknumber-offset: -34px;
  position: relative;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  width: -webkit-max-content;
  width: max-content;
  height: -webkit-max-content;
  height: max-content;
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  color: var(--gray-900);
  background-color: var(--white);
  border: 1px solid;
  border-color: var(--gray-400);
  border-radius: var(--rounded-lg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}
.calendar-properties .vc-container .vc-highlights .vc-day-box-center-center:nth-child(2) .vc-highlight {
  @apply bg-gray-300;
}
.calendar-properties .vc-container .vc-highlight {
  @apply bg-gray-300;
}
.calendar-properties .vc-day-content .vc-focusable
{
  @apply text-black !important;
}
.calendar-properties .vc-container .is-today .vc-day-content  {
}
.calendar-properties .vc-container .is-today:hover .vc-day-content {
  @apply bg-orange-400
}
.calendar-properties .vc-container .is-today .vc-day-content:hover {
  @apply bg-orange-400
}
.calendar-properties .vc-container .vc-day-content:hover:not(.is-disabled) {
  @apply bg-transparent text-black !important;
}
.calendar-properties .vc-container .vc-day-content.is-disabled {
  @apply pointer-events-none;
}
.calendar-properties .vc-container .vc-day-content.is-disabled:hover {
  @apply bg-transparent;
}
.calendar-properties .vc-day.is-not-in-month *:not(.is-disabled) {
  @apply opacity-100 text-gray-500 pointer-events-auto;
}
.calendar-properties .vc-day.is-not-in-month .is-disabled  {
  @apply opacity-100 text-gray-400;
}
.calendar-properties .vc-day.weekday-7 {
  @apply text-red-500;
}
.calendar-properties .vc-day.weekday-1 {
  @apply text-red-500;
}
.calendar-properties .vc-weekday:nth-last-of-type(-n+2) {
  @apply text-red-500;
}
.calendar-properties .vc-weeknumber-content
{
  font-style: normal!important;
}
.calendar-properties .is-today .vc-day-content.vc-focusable
{
  border: 2px solid #FF9123 !important;
  border-radius: 7px !important;
  color: black;

  font-weight: normal !important;
}
.calendar-properties .is-today .vc-day-content.vc-focusable:hover, .is-today .vc-day-content.vc-focusable:focus
{
  border: 2px solid #FF9123;
  border-radius: 7px;
  background-color: #FF9123;
  color:black !important;

}
.calendar-properties .vc-arrow
{
  color: black !important;
  border-radius: 7px !important;
}
.calendar-properties .vc-title {
  /* html code => Html Code */
  text-transform: capitalize !important;
  font-size: 15px !important;
}
.calendar-properties .vc-weekday
{
  text-transform: capitalize !important;
}
.calendar-properties .vc-day-content.vc-focusable
{
  color:black;
  font-weight: normal !important;
  border-radius: 7px !important;
}
.calendar-properties .vc-day-content.vc-focusable:hover
{
  font-weight: normal !important;
  border-radius: 7px !important;
}
.calendar-properties .vc-highlight
{
}
.calendar-properties .vc-highlights .vc-highlight, .vc-highlights .vc-highlight:hover
{
  color:black !important;
}
.calendar-properties .vc-highlights>.vc-day-box-center-center:nth-child(1) .vc-highlight
{
  color: black !important;
  border-color: transparent !important;
}
.calendar-properties .vc-highlights>.vc-day-box-center-center:nth-child(2) .vc-highlight
{
  color: black !important;
  opacity: 1 !important;
}
.calendar-properties .dots-back
{
  background-color: black !important;
  height: 3px !important;
  width: 3px !important;
  position: relative !important;
  top: 10px !important;
}
.calendar-properties .today
{
  background-color: white !important;
}
.calendar-properties .is-today>.vc-highlights>.vc-day-box-center-center:nth-child(1) .vc-highlight
{
  opacity: 1 !important;
}
.calendar-properties .is-today>.vc-highlights>.vc-day-box-center-center:nth-child(2) .vc-highlight
{
  opacity: 1 !important;
}
.calendar-properties .back-hover
{
  background-color:#E4E3E5 !important;
}
.calendar-properties .vc-weekday:nth-child(7), .vc-weekday:nth-child(8)
{
  color: #E23300 !important;
}
.calendar-properties .vc-weekday
{
  color: var(--black);
}
.calendar-properties .vc-container .vc-day-content:hover:not(.is-disabled)
{
}
.calendar-properties .is-not-in-month
{
  color: rgba(0, 0, 0, 0.5) !important;
}
.calendar-properties .weekday-position-6:not(.is-not-in-month) .vc-day-content.vc-focusable, .weekday-position-7:not(.is-not-in-month) .vc-day-content.vc-focusable
{
  color: #E23300 !important;
}
.calendar-properties .vc-select select {
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  display: block;
  -webkit-appearance: none;
  appearance: none;
  width: 52px;
  height: 30px;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  text-align: left;
  background-color: var(--white);
  border: 2px solid;
  border-color: var(--gray-200);
  color: var(--gray-900);
  padding: 0 20px 0 8px;
  border-radius: var(--rounded);
  line-height: var(--leading-tight);
  text-indent: 0px;
  cursor: pointer;
  -moz-padding-start: 3px;
}
.calendar-properties .vc-select select::-webkit-scrollbar {
  width: 2px;
}
.calendar-properties .vc-select select::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}
.calendar-properties .vc-select select::-webkit-scrollbar-thumb {
  background-color: #d4aa70;
  border-radius: 100px;
}
.calendar-properties .vc-time-month[data-v-63f66eaa] {
  color: black;
  margin-left: 8px;
}
.vc-time-date
{
  display: none;
}
.vc-time-picker.vc-invalid
{
  opacity: 0;
  height: 0;
  padding: 0;
}
.width100without20 {
  width: calc(100% - 20px);
}
.droptarget {
  float: left;
  width: 100px;
  height: 35px;
  margin: 15px;
  padding: 10px;
  border: 1px solid #aaaaaa;
}
#generalscroll {
  scrollbar-width: none;
}
</style>
