import * as TYPES from '@/websync/types.js'
import { updateTask } from '@/websync/task.js'
import { updateCard } from '@/websync/card.js'
import { updateEmployee } from '@/websync/employee.js'
import { updateProject } from '@/websync/project.js'
import { removeCardMessage } from '@/websync/card_message'
import { removeTaskMessage } from '@/websync/task_message'
import { updateColor } from '@/websync/colors_dop'
import { updateTag } from '@/websync/tag'
import { updateDepartment } from '@/websync/departments'
import { updateReglament } from '@/websync/reglaments.js'

export default function processUpdate (obj) {
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_REGLAMENT:
      updateReglament(obj)
      break
    case TYPES.TYPE_OBJECT_TAG:
      updateTag(obj)
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      updateProject(obj)
      break
    case TYPES.TYPE_OBJECT_TASK:
      updateTask(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT:
      break
    case TYPES.TYPE_OBJECT_TASK_FILE:
      break
    case TYPES.TYPE_OBJECT_TASK_MSG:
      removeTaskMessage(obj)
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
      updateColor(obj)
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
      updateEmployee(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT_FILE:
      break
    case TYPES.TYPE_OBJECT_CONTACT_FOTO:
      break
    case TYPES.TYPE_OBJECT_USER_GROUP:
      updateDepartment(obj)
      break
    case TYPES.TYPE_OBJECT_INVITE:
      break
    case TYPES.TYPE_OBJECT_NOTIFICATION:
      break
    case TYPES.TYPE_OBJECT_BOARD:
      break
    case TYPES.TYPE_OBJECT_CARD:
      updateCard(obj)
      break
    case TYPES.TYPE_OBJECT_CARD_FILE:
      break
    case TYPES.TYPE_OBJECT_CARD_MSG:
      removeCardMessage(obj)
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
