import * as TYPES from '@/websync/types.js'
import { removeTask } from '@/websync/task.js'
import { removeCard } from '@/websync/card.js'
import { removeEmployee } from '@/websync/employee.js'
import { removeProject } from '@/websync/project.js'
import { deleteReglament } from '@/websync/reglaments.js'
import { deleteReglamentQuestion } from '@/websync/reglament_question'
import { deleteReglamentAnswer } from '@/websync/reglament_answer'
import { removeCardFileMessage } from '@/websync/card_message'
import { removeTaskFileMessage } from '@/websync/task_message'
import { removeColor } from '@/websync/colors_dop.js'
import { removeParentTag, removeTag } from '@/websync/tag'
import { removeDepartment } from '@/websync/departments'

export default function processRemove (obj) {
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_REGLAMENT:
      deleteReglament(obj)
      break
    case TYPES.TYPE_OBJECT_REGLAMENT_QUESTION:
      deleteReglamentQuestion(obj)
      break
    case TYPES.TYPE_OBJECT_REGLAMENT_ANSWER:
      deleteReglamentAnswer(obj)
      break
    case TYPES.TYPE_OBJECT_TAG:
      removeTag(obj)
      removeParentTag(obj)
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      removeProject(obj)
      break
    case TYPES.TYPE_OBJECT_TASK_FILE:
      removeTaskFileMessage(obj.uid)
      break
    case TYPES.TYPE_OBJECT_TASK:
      removeTask(obj.uid)
      break
    case TYPES.TYPE_OBJECT_CONTACT:
      break
    case TYPES.TYPE_OBJECT_CONTACT_GROUP:
      break
    case TYPES.TYPE_OBJECT_CONTACT_COMMUNICATION:
      break
    case TYPES.TYPE_OBJECT_GROUP:
      break
    case TYPES.TYPE_OBJECT_FILTER:
      break
    case TYPES.TYPE_OBJECT_MARKER:
      removeColor(obj)
      break
    case TYPES.TYPE_OBJECT_PERIOD:
      break
    case TYPES.TYPE_OBJECT_PROJECT_MEMBER:
      break
    case TYPES.TYPE_OBJECT_LABEL:
      break
    case TYPES.TYPE_OBJECT_FILE:
      break
    case TYPES.TYPE_OBJECT_EMP:
      removeEmployee(obj.uid)
      break
    case TYPES.TYPE_OBJECT_CONTACT_FILE:
      break
    case TYPES.TYPE_OBJECT_CONTACT_FOTO:
      break
    case TYPES.TYPE_OBJECT_USER_GROUP:
      removeDepartment(obj.uid)
      break
    case TYPES.TYPE_OBJECT_INVITE:
      break
    case TYPES.TYPE_OBJECT_NOTIFICATION:
      break
    case TYPES.TYPE_OBJECT_BOARD:
      break
    case TYPES.TYPE_OBJECT_CARD:
      removeCard(obj.uid)
      break
    case TYPES.TYPE_OBJECT_CARD_FILE:
      removeCardFileMessage(obj.uid)
      break
    case TYPES.TYPE_OBJECT_CARD_MSG:
      break
    case TYPES.TYPE_OBJECT_CLIENT:
      break
    case TYPES.TYPE_OBJECT_CLIENT_FILE:
      break
    case TYPES.TYPE_OBJECT_CLIENT_MSG:
      break
    case TYPES.TYPE_OBJECT_CLIENT_EXT_FIELD:
      break
    case TYPES.TYPE_OBJECT_LOCALIZE:
      break
    case TYPES.TYPE_OBJECT_OPTIONS:
      break
  }
}
