<template>
  <!-- Confirm modal -->
  <modal-box-confirm
    v-model="showConfirm"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @confirm="removeTask(lastSelectedTaskUid)"
  >
    <p
      v-if="storeTasks[lastSelectedTaskUid]"
      class="text-center"
    >
      Do you really wanna delete <strong>"{{ storeTasks[lastSelectedTaskUid].info.name }}"</strong> task?
      <span
        v-if="storeTasks[lastSelectedTaskUid].info.has_children"
      >
        Children will also be affected!
      </span>
    </p>
  </modal-box-confirm>

  <!-- Add task input -->
  <div
    v-if="taskListSource && !DONT_SHOW_TASK_INPUT_UIDS[taskListSource.uid]"
    class="fixed-create"
    :class="newConfig.listHasChildren ? 'pl-8' : 'pl-0'"
  >
    <div
      class="flex items-center bg-gray-600 dark:bg-gray-700 bg-opacity-70 rounded-xl"
    >
      <div
        class="flex items-center pl-3"
        :class="{ 'bg-gray-500 p-3 rounded-l-xl cursor-pointer': Object.keys(copiedTasks).length }"
        @click="pasteCopiedTasks('00000000-0000-0000-0000-000000000000')"
      >
        <svg
          :class="{ 'mr-2': Object.keys(copiedTasks).length }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00011 2.3457V8.4034M8.00011 8.4034V14.4611M8.00011 8.4034H14.4617M8.00011 8.4034H1.53857"
            stroke="#FFF"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div
          v-if="Object.keys(copiedTasks).length"
          class="flex items-center justify-center bg-rose-600 rounded-full w-6 h-6"
        >
          <p class="text-white text-sm font-bold">
            {{ Object.keys(copiedTasks).length }}
          </p>
        </div>
      </div>
      <control
        ref="root"
        v-model="createTaskText"
        class="w-full text-white"
        :placeholder="'Enter task name'"
        borderless
        transparent
        @keyup.enter="createTask"
      />
    </div>
  </div>

  <EmptyTasksListPics
    v-if="!Object.keys(storeTasks).length && status != 'loading'"
  />

  <!-- Skeleton -->
  <div
    v-if="status == 'loading'"
    class="animate-pulse flex pr-4 mt-0.5"
    :class="newConfig.listHasChildren ? 'pl-8' : 'pl-0'"
  >
    <div class="flex-col w-full">
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-10 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-40 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-20 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-10 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
      <div class="animate-pulse h-10 dark:bg-slate-900 bg-white my-1 border border-gray-300 dark:border-gray-700 rounded-xl" />
    </div>
  </div>

  <!--
  <pre class="text-[10px] leading-none font-bold text-pink-500">newConfig: {{ newConfig }}</pre>
  -->
  <!-- vue3-treeview -->
  <tree
    v-if="status == 'success'"
    :nodes="storeTasks"
    :config="newConfig"
    class="mt-0.5"
    @nodeOpened="nodeExpanding"
    @nodeFocus="nodeSelected"
    @nodeDragenter="nodeDragEnter"
    @nodeDragleave="nodeDragLeave"
    @nodeOver="nodeOver"
    @nodeDragend="nodeDragEnd"
  >
    <template #before-input="props">
      <div
        :id="props.node.info.uid"
        class="group task-node flex-col items-center w-full bg-white p-2 rounded-xl dark:bg-gray-900 dark:border-gray-700 border border-gray-300 my-0.5 relative"
        :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
        :class="{ 'bg-gray-200 dark:bg-gray-800': (props.node.info.status == 1 || props.node.info.status == 7) && props.node.info.uid_marker == '00000000-0000-0000-0000-000000000000', 'ring-2 ring-orange-400 border border-orange-400': props.node.id === lastSelectedTaskUid || selectedTasks[props.node.id]}"
        @click.shift="clickAndShift(props.node)"
        @click.exact="selectedTasks = {}"
      >
        <!--
        <p class="text-[10px] leading-none">parent: {{ props.node.parent }}</p>
        <pre class="text-[10px] leading-none font-bold text-yellow-500">children: {{ props.node.children  }}</pre>
        <p class="text-[10px] leading-none">id: <strong>{{ props.node.id  }}</strong></p>
        <p class="text-[10px] leading-none mb-5">order_new: <strong>{{ props.node.info.order_new }}</strong></p>
        -->
        <Transition>
          <div
            class="absolute hidden group-hover:flex right-2 top-2 bg-gray-200 dark:bg-gray-800 rounded-lg items-cetner justify-center py-0.5 px-3"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="subtask.path"
              class="text-gray-600 dark:text-white mr-3 cursor-pointer"
              :box="subtask.viewBox"
              :width="subtask.width"
              :style="{ color: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].fore_color : '' }"
              :height="subtask.height"
              @click="addSubtask(props.node.info);"
            />

            <!-- Task action popper -->
            <Popper
              arrow
              :class="isDark ? 'dark' : 'light'"
              @open:popper="toggleTaskHoverPopper(true)"
              @close:popper="toggleTaskHoverPopper(false)"
            >
              <template #content="{ close }">
                <div class="flex flex-col w-40">
                  <!-- Set task for tomorrow -->
                  <div
                    v-if="props.node.info.uid_customer == user.current_user_uid"
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="moveTaskTomorrow(props.node.info)"
                  >
                    <Icon
                      :path="fortomorrow.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="fortomorrow.viewBox"
                      :width="fortomorrow.width"
                      :height="fortomorrow.height"
                    />
                    <p>{{ localization.Tomorrow }}</p>
                  </div>

                  <!-- Copy task name -->
                  <div
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="copyTaskName(props.node.info); close();"
                  >
                    <Icon
                      :path="copy.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="copy.viewBox"
                      :width="copy.width"
                      :height="copy.height"
                    />
                    <p>{{ props.node.info.taskNameCopied ? 'Copied!' : localization.copy_taskname }}</p>
                  </div>

                  <!-- Copy task -->
                  <div
                    class="flex items-center py-0.5 px-1.5 rounded-xl"
                    :class="{ 'cursor-pointer': !copiedTasks[props.node.info.uid], 'hover:bg-gray-100 hover:dark:bg-stone-800': !copiedTasks[props.node.info.uid], 'text-gray-200': copiedTasks[props.node.info.uid] }"
                    @click="copyTask(props.node.info)"
                  >
                    <Icon
                      :path="copy.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :class="{ 'text-gray-200': copiedTasks[props.node.info.uid] }"
                      :box="copy.viewBox"
                      :width="copy.width"
                      :height="copy.height"
                    />
                    <p>{{ copiedTasks[props.node.info.uid] ? 'Copied' : 'Copy' }}</p>
                  </div>

                  <!-- Paste task -->
                  <div
                    v-if="Object.keys(copiedTasks).length"
                    class="flex cursor-pointer items-center py-0.5 px-1.5 rounded-xl hover:dark:bg-stone-800"
                    @click="pasteCopiedTasks(props.node.id)"
                  >
                    <Icon
                      :path="copy.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="copy.viewBox"
                      :width="copy.width"
                      :height="copy.height"
                    />
                    <p>Paste</p>
                  </div>

                  <!-- Cut task -->
                  <div
                    v-if="props.node.info.uid_customer == user.current_user_uid"
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="cutTask(props.node.info); close();"
                  >
                    <Icon
                      :path="cut.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="cut.viewBox"
                      :width="cut.width"
                      :height="cut.height"
                    />
                    <p>Cut</p>
                  </div>

                  <!-- Delete task -->
                  <div
                    v-if="props.node.info.uid_customer == user.current_user_uid"
                    class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                    @click="showConfirm = true;"
                  >
                    <Icon
                      :path="bin.path"
                      class="text-gray-600 dark:text-white mr-3 cursor-pointer"
                      :box="bin.viewBox"
                      :width="bin.width"
                      :height="bin.height"
                    />
                    <p>{{ localization.remove }}</p>
                  </div>
                </div>
              </template>
              <Icon
                :path="taskoptions.path"
                class="text-gray-600 dark:text-white cursor-pointer h-full"
                :box="taskoptions.viewBox"
                :width="taskoptions.width"
                :style="{ color: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].fore_color : '' }"
                :height="taskoptions.height"
              />
            </Popper>
          </div>
        </Transition>

        <!-- Name, Status -->
        <div
          class="flex"
        >
          <div
            class="flex items-center"
          >
            <!-- Status popper -->
            <Popper
              arrow
              :class="isDark ? 'dark' : 'light'"
              placement="left"
              :disabled="props.node.info.type == 4"
            >
              <template #content="{ close }">
                <div class="flex flex-col">
                  <div
                    v-for="taskStatus in 10"
                    :key="taskStatus"
                    @click="close"
                  >
                    <div
                      v-if="showStatusOrNot(props.node.info.type, taskStatus - 1) && props.node.info.status != taskStatus - 1"
                      class="flex cursor-pointer items-center hover:bg-gray-100 hover:dark:bg-stone-800 py-0.5 px-1.5 rounded-xl"
                      @click="changeTaskStatus(props.node.info.uid, taskStatus - 1)"
                    >
                      <div
                        class="border-2 border-gray-300 rounded-md mr-1 flex items-center justify-center"
                        style="min-width:20px; min-height: 20px;"
                      >
                        <Icon
                          v-if="statuses[taskStatus-1]"
                          :path="statuses[taskStatus-1].path"
                          :class="statusColor[taskStatus-1] ? statusColor[taskStatus-1] : 'text-gray-500 dark:text-gray-100'"
                          :box="statuses[taskStatus-1].viewBox"
                          :width="statuses[taskStatus-1].width"
                          :height="statuses[taskStatus-1].height"
                        />
                      </div>
                      {{ localization[statusesLabels[taskStatus-1]] }}
                    </div>
                  </div>
                </div>
              </template>
              <div
                class="relative border-2 border-gray-300 rounded-md mr-1 flex items-center justify-center mt-0.5"
                :class="{ 'cursor-pointer': [1, 2, 3].includes(props.node.info.type), 'cursor-not-allowed': props.node.info.type == 4 }"
                style="min-width:20px; min-height: 20px;"
              >
                <Icon
                  v-if="statuses[props.node.info.status]"
                  :path="statuses[props.node.info.status].path"
                  :class="statusColor[props.node.info.status] ? statusColor[props.node.info.status] : 'text-gray-500 dark:text-gray-100'"
                  :style="{ color: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].fore_color : '' }"
                  :box="statuses[props.node.info.status].viewBox"
                  :width="statuses[props.node.info.status].width"
                  :height="statuses[props.node.info.status].height"
                />
                <Icon
                  v-if="props.node.info.SeriesType != 0"
                  :path="repeat.path"
                  class="text-blue-500 bg-white absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full"
                  :box="repeat.viewBox"
                  :width="repeat.width"
                  :height="repeat.height"
                />
              </div>
            </Popper>

            <!-- Editable name -->
            <contenteditable
              v-model="props.node.info.name"
              tag="div"
              class="taskName p-0.5 ring-0 outline-none"
              :contenteditable="props.node.info.type == 1 || props.node.info.type == 0 || props.node.info.uid_customer == user.current_user_uid"
              placeholder="Enter task name"
              :no-n-l="true"
              :no-h-t-m-l="true"
              :class="{ 'text-gray-500': props.node.info.status == 1 || props.node.info.status == 7, 'line-through': props.node.info.status == 1 || props.node.info.status == 7, 'font-extrabold': props.node.info.readed == 0 }"
              :style="{ color: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].fore_color : '' }"
              @returned="updateTask(props.node.info)"
              @blur="updateTask(props.node.info)"
            />
          </div>
        </div>

        <!-- Tags, Overdue, Customer, Performer -->
        <div
          v-if="props.node.info.uid_customer == '00000000-0000-0000-0000-000000000000' || props.node.info.email_performer || props.node.info.is_overdue || props.node.info.tags || props.node.info.uid_project == '00000000-0000-0000-0000-000000000000'"
          class="flex items-center mt-1.5"
        >
          <div
            v-if="props.node.info.uid_customer != '00000000-0000-0000-0000-000000000000' && employees[props.node.info.uid_customer] && props.node.info.uid_customer != user.current_user_uid"
            class="p-1 px-2 text-xs text-white bg-red-500 rounded-lg mr-1 flex items-center"
            :class="{ 'bg-gray-400 dark:bg-gray-700': user.current_user_email != props.node.info.email_performer, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
          >
            {{ employees[props.node.info.uid_customer].name }}
          </div>
          <div
            v-if="props.node.info.email_performer && employeesByEmail[props.node.info.email_performer] && user.current_user_email != props.node.info.email_performer && employees[props.node.info.uid_customer].email != props.node.info.email_performer"
            class="p-1 px-2 text-xs text-white rounded-lg mr-1 flex items-center"
            :class="{ 'bg-gray-400 dark:bg-gray-700': user.current_user_email != props.node.info.email_performer, 'bg-green-500': user.current_user_uid == props.node.info.uid_customer, 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
          >
            <Icon
              v-if="!props.node.info.performerreaded"
              :path="performerNotRead.path"
              class="cursor-pointer text-white mr-1"
              :box="performerNotRead.viewBox"
              :width="performerNotRead.width"
              :height="performerNotRead.height"
            />
            <Icon
              v-if="props.node.info.performerreaded"
              :path="performerRead.path"
              class="cursor-pointer text-white mr-1"
              :box="performerRead.viewBox"
              :width="performerRead.width"
              :height="performerRead.height"
            />
            {{ employeesByEmail[props.node.info.email_performer].name }}
          </div>
          <div
            v-if="props.node.info.is_overdue"
            class="p-1 px-2 text-xs text-red-600 bg-red-300 rounded-lg mr-1 opacity-70"
          >
            Просрочено
          </div>
          <div
            v-for="(tag, index) in props.node.info.tags"
            :key="index"
          >
            <div
              v-if="tags[tag]"
              class="p-1 px-2 text-xs text-white rounded-lg mr-1 flex items-center"
              :style="{ backgroundColor: tags[tag] ? tags[tag].back_color : '' }"
            >
              <Icon
                :path="tagIcon.path"
                class="cursor-pointer text-white mr-1"
                :box="tagIcon.viewBox"
                :width="13"
                :height="12"
              />
              {{ tags[tag].name }}
            </div>
          </div>
          <div
            v-if="props.node.info.uid_project != '00000000-0000-0000-0000-000000000000' && projects[props.node.info.uid_project] && props.node.info.uid_project !== taskListSource.param"
            class="p-1 px-2 text-xs text-white bg-yellow-400 rounded-lg mr-1 flex items-center"
            :class="{ 'bg-opacity-50': props.node.info.status == 1 || props.node.info.status == 7 }"
          >
            <Icon
              :path="project.path"
              class="cursor-pointer text-white mr-1"
              :box="project.viewBox"
              :width="13"
              :height="12"
            />
            {{ projects[props.node.info.uid_project].name }}
          </div>
        </div>

        <!-- Icons, Access, Messages, Files, Data, Checklist, Focus -->
        <div
          v-if="props.node.info.term_customer || props.node.info.checklist || props.node.info.has_files || props.node.info.has_msgs || props.node.info.comment || props.node.info.focus"
          class="flex"
        >
          <div
            v-if="props.node.info.term_customer"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="clock.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="clock.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <span class="mr-1 mt-1.5 text-sm text-gray-600 dark:text-white self-center">{{ props.node.info.term_customer }}</span>
          <div
            v-if="props.node.info.checklist"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="checklist.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="checklist.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <span
            v-if="props.node.info.checklist"
            class="mr-1 mt-1.5 text-sm text-gray-600 dark:text-white self-center"
          >
            {{ countChecklist(props.node.info.checklist).done }} / {{ countChecklist(props.node.info.checklist).undone }}
          </span>
          <div
            v-if="props.node.info.emails"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5 flex items-center justify-center"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="inaccess.path"
              class="text-gray-600 dark:text-white"
              :box="inaccess.viewBox"
              :width="14"
              :height="14"
            />
          </div>
          <div
            v-if="props.node.info.has_files"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="file.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="file.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div
            v-if="props.node.info.has_msgs"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{ backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="msgs.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="msgs.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div
            v-if="props.node.info.comment.replace(/\r?\n|\r/g, '')"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="taskcomment.path"
              class="cursor-pointer text-gray-600 dark:text-white"
              :box="taskcomment.viewBox"
              :width="13"
              :height="12"
            />
          </div>
          <div
            v-if="props.node.info.focus"
            class="bg-gray-200 dark:bg-gray-700 rounded px-1.5 mr-1 mt-1.5"
            :style="{backgroundColor: colors[props.node.info.uid_marker] ? colors[props.node.info.uid_marker].back_color : '' }"
          >
            <Icon
              :path="taskfocus.path"
              class="cursor-pointer text-red-600 dark:text-white my-auto"
              :box="taskfocus.viewBox"
              :width="13"
              :height="12"
            />
          </div>
        </div>
      </div>
    </template>
  </tree>
</template>

<script>
import { computed, ref } from 'vue'
import treeview from 'vue3-treeview'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import Control from '@/components/Control.vue'
import EmptyTasksListPics from '@/components/EmptyTasksListPics.vue'
import Popper from 'vue3-popper'
import ModalBoxConfirm from '@/components/modals/ModalBoxConfirm.vue'
import contenteditable from 'vue-contenteditable'

import * as TASK from '@/store/actions/tasks'

/* Icons */
import file from '@/icons/file.js'
import inaccess from '@/icons/inaccess.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import readyStatus from '@/icons/ready-status.js'
import inwork from '@/icons/inwork.js'
import canceled from '@/icons/canceled.js'
import pause from '@/icons/pause.js'
import note from '@/icons/note.js'
import project from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import improve from '@/icons/improve.js'
import clock from '@/icons/clock.js'
import subtask from '@/icons/subtask.js'
import taskoptions from '@/icons/taskoptions.js'
import repeat from '@/icons/repeat.js'
import fortomorrow from '@/icons/for-tomorrow.js'
import copy from '@/icons/copy.js'
import cut from '@/icons/cut.js'
import bin from '@/icons/bin.js'
/* /Icons */

export default {
  components: {
    tree: treeview,
    Icon,
    Control,
    Popper,
    ModalBoxConfirm,
    EmptyTasksListPics,
    contenteditable
  },
  setup (props) {
    const store = useStore()
    const loadedTasks = computed(() => store.state.tasks.loadedTasks)
    const employees = computed(() => store.state.employees.employees)
    const employeesByEmail = computed(() => store.state.employees.employeesByEmail)
    const taskListSource = computed(() => store.state.taskListSource)
    const projects = computed(() => store.state.projects.projects)
    const createTaskText = ref('')
    const status = computed(() => store.state.tasks.status)
    const localization = computed(() => store.state.localization.localization)
    const user = computed(() => store.state.user.user)
    const newConfig = computed(() => store.state.tasks.newConfig)
    const storeTasks = computed(() => store.state.tasks.newtasks)
    const isDark = computed(() => store.state.darkMode)
    const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
    const copiedTasks = computed(() => store.state.tasks.copiedTasks)
    const lastSelectedTaskUid = ref('')
    const selectedTasks = ref({})
    const showConfirm = ref(false)
    const isTaskHoverPopperActive = ref(false)

    const clickAndShift = (arg) => {
      selectedTasks.value[arg.id] = arg.info
    }

    const SHOW_TASK_INPUT_UIDS = {
      '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
      '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
      '6fc44cc6-9d45-4052-917e-2taab1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
      '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
      '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
      '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
      'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
      'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
      '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST
    }

    const toggleTaskHoverPopper = (val) => {
      isTaskHoverPopperActive.value = val
    }

    const nodeExpanding = (arg) => {
      if (loadedTasks.value[arg.id]) return
      arg.state.isLoading = true
      store.dispatch(TASK.SUBTASKS_REQUEST, arg.id)
        .then(() => {
          store.commit(TASK.ADD_LOADED_TASK, arg.id)
          store.commit(TASK.UPDATE_NEW_TASK_LIST, store.state.tasks.subtasks.tasks)

          // remove fake-uid from children array if subtasks are loaded
          for (let i = 0; i < arg.children.length; i++) {
            if (arg.children[i] === 'fake-uid') {
              arg.children.splice(i, 1)
            }
          }

          for (const task of store.state.tasks.subtasks.tasks) {
            arg.children.push(task.uid)
          }
        })
      arg.state.isLoading = false
    }

    const countChecklist = (checklist) => {
      const data = { done: 0, undone: 0 }
      for (const line in checklist.split('\r\n\r\n')) {
        data.undone++
        if (line[0] === '1') {
          data.done++
        }
      }
      return data
    }

    const showStatusOrNot = (type, status) => {
      if (type === 1 && [0, 1, 3, 4, 6, 7].includes(status)) {
        return true
      } else if (type === 2 && [0, 1, 3, 4, 6, 7, 9].includes(status)) {
        return true
      } else if (type === 3 && [0, 4, 5, 6, 8].includes(status)) {
        return true
      } else {
        return false
      }
    }

    function uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }

    const pad2 = (n) => {
      return (n < 10 ? '0' : '') + n
    }

    const getTodaysDate = (val, isYearFirst = true) => {
      if (val == null) {
        val = new Date()
      }
      if (typeof val === 'string') { // parse date from ISO 8601 string
        val = new Date(val)
      }
      const month = pad2(val.getMonth() + 1)
      const day = pad2(val.getDate())
      const year = pad2(val.getFullYear())
      if (isYearFirst) {
        return year + '-' + month + '-' + day
      } else {
        return day + '-' + month + '-' + year
      }
    }

    const handleTaskSource = (taskData, uidParent) => {
      let data
      if (taskData) {
        taskData.uid = uuidv4()
        taskData.status = 0
        taskData.uid_parent = uidParent
        taskData.uid_customer = user.value.current_user_uid
        taskData.email_performer = ''
        taskData.tags = []
        taskData.uid_marker = ''
        taskData.has_files = false
        taskData.has_msgs = false
        taskData.type = 1
        data = taskData
      } else {
        data = {
          uid: uuidv4(),
          uid_parent: '00000000-0000-0000-0000-000000000000',
          uid_customer: user.value.current_user_uid,
          uid_project: '00000000-0000-0000-0000-000000000000',
          status: 0,
          email_performer: '',
          type: 1,
          name: createTaskText.value,
          comment: ''
        }
      }

      switch (SHOW_TASK_INPUT_UIDS[taskListSource.value.uid]) {
        case TASK.TASKS_REQUEST:
          data.date_begin = getTodaysDate(taskListSource.value.param) + 'T00:00:00'
          data.date_end = getTodaysDate(taskListSource.value.param) + 'T23:59:59'
          break
        case TASK.IN_FOCUS_TASKS_REQUEST:
          data.focus = 1
          break
        case TASK.DELEGATED_TASKS_REQUEST:
          data.email_performer = taskListSource.value.param
          break
        case TASK.PROJECT_TASKS_REQUEST:
          data.uid_project = taskListSource.value.param
          break
        case TASK.EMPLOYEE_TASKS_REQUEST:
          data.email_performer = employees.value[taskListSource.value.param].email
          break
        case TASK.COLOR_TASKS_REQUEST:
          data.uid_marker = taskListSource.value.param
          break
        case TASK.TAG_TASKS_REQUEST:
          data.tags = [taskListSource.value.param]
          break
      }
      return data
    }

    const pasteCopiedTasks = (uidParent) => {
      if (!copiedTasks.value) {
        return
      }

      for (const uid in copiedTasks.value) {
        const data = handleTaskSource(copiedTasks.value[uid], uidParent)
        store.dispatch(TASK.CREATE_TASK, data)
      }

      store.commit(TASK.RESET_COPY_TASK)
    }

    const createTask = () => {
      const data = handleTaskSource()
      store.dispatch(TASK.CREATE_TASK, data)
        .then(() => {
          // gotoNode(data.uid)
          lastSelectedTaskUid.value = data.uid
        })
      createTaskText.value = ''
    }

    const updateTask = (task) => {
      task.name = task.name.replace(/\r?\n|\r/g, '')
      if (task.name.length > 0) {
        if (task._justCreated) {
          store.dispatch(TASK.CREATE_TASK, task)
        } else {
          store.dispatch(TASK.CHANGE_TASK_NAME, { uid: task.uid, value: task.name })
        }
        task._isEditing = false
      } else if (task.name.length === 0) {
        if (task._justCreated) {
          if (isPropertiesMobileExpanded.value) {
            store.dispatch('asidePropertiesToggle', false)
          }
          store.commit(TASK.REMOVE_TASK, task.uid)
        } else {
          showConfirm.value = true
          // removeTask(task.uid)
        }
      }
    }

    const moveTaskTomorrow = (task) => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      store.dispatch(
        TASK.CHANGE_TASK_DATE,
        {
          uid_task: task.uid,
          str_date_begin: getTodaysDate(tomorrow) + 'T00:00:00',
          str_date_end: getTodaysDate(tomorrow) + 'T23:59:59',
          reset: 0
        }
      )
        .then(() => {
          store.commit(TASK.REMOVE_TASK, task.uid)
        })
    }

    const copyTaskName = (task) => {
      navigator.clipboard.writeText(task.name)
    }

    const removeTask = (uid) => {
      if (isPropertiesMobileExpanded.value) {
        store.dispatch('asidePropertiesToggle', false)
      }
      store.dispatch(TASK.REMOVE_TASK, uid)
    }

    const changeTaskStatus = (uid, status) => {
      store.dispatch(TASK.CHANGE_TASK_STATUS, { uid: uid, value: status })
    }

    const gotoNode = (uid) => {
      document.getElementById(uid).parentElement.focus({ preventScroll: false })
      const taskName = document.getElementById(uid).querySelector('.taskName')
      const range = document.createRange()
      const sel = document.getSelection()
      taskName.focus({ preventScroll: false })
      range.setStart(taskName, 1)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      lastSelectedTaskUid.value = uid
    }

    const addSubtask = (parent) => {
      lastSelectedTaskUid.value = ''
      const newSubtask = {
        uid: uuidv4(),
        uid_customer: user.value.current_user_uid,
        email_performer: parent.email_performer,
        name: '',
        status: 0,
        uid_parent: parent.uid,
        uid_project: parent.uid_project !== '00000000-0000-0000-0000-000000000000' ? parent.uid_project : '00000000-0000-0000-0000-000000000000',
        type: 1,
        SeriesType: 0,
        _isEditing: true,
        _justCreated: true
      }
      store.dispatch(TASK.ADD_SUBTASK, newSubtask)
        .then(() => {
          // TODO: somehow refactor it later
          // awful, but I can't find event when subtask node has been pushed into the DOM
          setTimeout(() => { gotoNode(newSubtask.uid) }, 10)
        })
    }

    const copyTask = (task) => {
      store.commit(TASK.COPY_TASK, task)
    }

    const cutTask = (task) => {
      store.commit(TASK.COPY_TASK, task)
      removeTask(task.uid)
    }

    const nodeSelected = (arg) => {
      store.commit('basic', { key: 'propertiesState', value: 'task' })

      lastSelectedTaskUid.value = arg.id
      store.dispatch(TASK.SELECT_TASK, arg.info)

      if (!isPropertiesMobileExpanded.value && arg.info.name) {
        store.dispatch('asidePropertiesToggle', true)
      }
    }

    const nodeDragEnter = (node) => {
      // console.log('drag enter')
      // console.log(node)
    }

    const nodeOver = (node) => {
      // console.log('drag over')
      // console.log(node)
    }

    const nodeDragLeave = (node) => {
      // console.log('drag leave')
      // console.log(node)
    }

    const nodeDragEnd = (node) => {
      console.log('drag end')
      console.log(node)
      console.log('new parent ', storeTasks.value[node.target.node])
      if (storeTasks.value[node.dragged.node.id]) {
        // change order in children
        if (storeTasks.value[node.dragged.node.id].parent) {
          const parent = storeTasks.value[storeTasks.value[node.dragged.node.id].parent]
          if (parent.children.length > 1) {
            for (let i = 0; i < parent.children.length; i++) {
              if (parent.children[i] === node.dragged.node.id) {
                if (i === 0) {
                  storeTasks.value[parent.children[i]].info.order_new = storeTasks.value[parent.children[i + 1]].info.order_new - 0.1
                } else if (i > 0 && i !== parent.children.length - 1) {
                  storeTasks.value[parent.children[i]].info.order_new = (storeTasks.value[parent.children[i - 1]].info.order_new + storeTasks.value[parent.children[i + 1]].info.order_new) / 2
                } else {
                  storeTasks.value[parent.children[i]].info.order_new = storeTasks.value[parent.children[i - 1]].info.order_new + 0.1
                }
              }
            }
          }
        } else {
          // change order in root
          if (newConfig.value.roots.length >= 1) {
            for (let i = 0; i < newConfig.value.roots.length; i++) {
              if (newConfig.value.roots[i] === node.dragged.node.id) {
                if (i === 0) {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = storeTasks.value[newConfig.value.roots[i + 1]].info.order_new - 0.1
                } else if (i > 0 && i !== newConfig.value.roots.length - 1) {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = (storeTasks.value[newConfig.value.roots[i - 1]].info.order_new + storeTasks.value[newConfig.value.roots[i + 1]].info.order_new) / 2
                } else {
                  storeTasks.value[newConfig.value.roots[i]].info.order_new = storeTasks.value[newConfig.value.roots[i - 1]].info.order_new + 0.1
                }
              }
            }
          }
        }
      }
      store.dispatch(
        TASK.CHANGE_TASK_PARENT_AND_ORDER,
        {
          uid: node.dragged.node.id,
          parent: node.dragged.node.parent ?? '00000000-0000-0000-0000-000000000000',
          order: node.dragged.node.info.order_new ?? 0
        }
      )
    }

    return {
      storeTasks,
      newConfig,
      showConfirm,
      selectedTasks,
      clickAndShift,
      nodeDragEnter,
      nodeDragLeave,
      nodeOver,
      nodeDragEnd,
      isDark,
      status,
      tags: computed(() => store.state.tasks.tags),
      employees,
      employeesByEmail,
      isTaskHoverPopperActive,
      projects,
      toggleTaskHoverPopper,
      nodeExpanding,
      nodeSelected,
      showStatusOrNot,
      lastSelectedTaskUid,
      countChecklist,
      createTask,
      pasteCopiedTasks,
      copiedTasks,
      copyTask,
      cutTask,
      updateTask,
      removeTask,
      copyTaskName,
      moveTaskTomorrow,
      changeTaskStatus,
      addSubtask,
      createTaskText,
      taskListSource,
      SHOW_TASK_INPUT_UIDS,
      file,
      inaccess,
      msgs,
      user,
      taskcomment,
      checklist,
      colors: computed(() => store.state.colors.colors),
      localization,
      statusColor: {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600',
        9: 'text-blue-500'
      }
    }
  },
  data () {
    const DONT_SHOW_TASK_INPUT_UIDS = {
      '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
      '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
      'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
      '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
      'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
      '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST
    }
    const statusesLabels = [
      'status_not_begin',
      'status_ready',
      'task_by_link',
      'status_note',
      'status_in_work',
      'status_task_ready',
      'status_paused',
      'status_cancelled',
      'status_reject',
      'status_refine'
    ]
    const statuses = [
      undefined,
      readyStatus,
      readyStatus,
      note,
      inwork,
      readyStatus,
      pause,
      canceled,
      canceled,
      improve
    ]
    return {
      DONT_SHOW_TASK_INPUT_UIDS,
      statuses,
      statusesLabels,
      project,
      tagIcon,
      performerNotRead,
      performerRead,
      taskfocus,
      clock,
      subtask,
      taskoptions,
      repeat,
      fortomorrow,
      copy,
      cut,
      bin
    }
  },
  methods: {
  }
}
</script>

<style>
.tree-level {
  flex: 1
}

.icon-wrapper {
  padding: 0;
  min-width: 0;
  flex-shrink: 0;
  display: flex;
  align-items: start;
  justify-content: center;
  width: 35px;
}

.input-wrapper {
  margin-left: .75em
}

.icon-wrapper svg {
  height: 15px;
  width: 15px;
}

.node-wrapper {
  min-height: 32px;
  display: flex;
  align-items: center;
  flex: 1;
  word-wrap: break-word;
  font-size: 14px;
  outline: none
}

.node-wrapper:focus-within .task-node {
  @apply ring-2 ring-orange-400 border border-orange-400
}

.node-wrapper.disabled .checkbox-wrapper.checked {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper.indeterminate {
  background: rgba(0, 0, 0, .26)
}

.node-wrapper.disabled .checkbox-wrapper {
  border-color: #00000042
}

.checkbox-wrapper. checked:after {
  transform: translate(.25em, .3365384615em) rotate(-45deg);
  width: .7em;
  height: .3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none
}

.checkbox-wrapper.indeterminate:after {
  transform: translate(.25em, .3365384615em) rotate(0);
  width: .7em;
  height: . 3em;
  border: .125em solid #fff;
  border-top-style: none;
  border-right-style: none;
  border-left-style: none
}

.checkbox-wrapper:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0
}

.node-over {
  border-top: solid 2px #5C6BC0
}

.node-in {
  background-color: #bdbdbd
}

.node-under {
  border-bottom: solid 2px #5C6BC0
}

.progress {
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #aab6fe;
  border-radius: 2px;
  background-clip: padding-box;
  margin: 0.5rem 0 1rem 0;
  overflow: hidden;
}
.progress .indeterminate {
  background-color: #3f51b5;
}
.progress .indeterminate:before {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
    infinite;
  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate:after {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  -webkit-animation-delay: 1.15s;
  animation-delay: 1.15s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}

.level-enter-active,
.level-leave-active {
  transition: opacity 0.2s ease;
}

.level-enter-from,
.level-leave-to {
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: 0
}

.tree-node {
  @apply ring-0 border-0
}

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

.fixed-create {
  position: sticky;
  top: 55px;
  z-index: 1;
  margin-bottom: 1px;
  padding-right: 10px;
}

[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: gray
}
</style>
