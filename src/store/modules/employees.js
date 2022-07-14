import * as DEPARTMENTS from '@/store/actions/departments'
import {
  NAVIGATOR_CHANGE_EMPLOYEE_DEPARTMENT,
  NAVIGATOR_PUSH_EMPLOYEE
} from '@/store/actions/navigator'
import axios from 'axios'
import { notify } from 'notiwind'
import * as EMPLOYEE from '../actions/employees'

const state = {
  employees: {},
  employeesByEmail: {},
  // Добавление нового стейта для реализации сорировки и добавления из навигатора
  employeesByDelegation: {},
  selectedEmployee: null
}

const getters = {
  // сортировка пользователей из навигатора и employees
  sortedEmployeesByDelegation (state) {
    return Object.values(state.employeesByDelegation).sort((a, b) => {
      return state.employeesByDelegation[a.uid] ? -1 : 0
    })
  }
}

const actions = {
  [EMPLOYEE.CREATE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/emp'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          const employee = resp.data
          employee.parentID = 'd28e3872-9a23-4158-aea0-246e2874da73' // resp.data.emps.uid
          commit(EMPLOYEE.PUSH_EMPLOYEE, employee)
          commit(EMPLOYEE.PUSH_EMPLOYEE_BY_EMAIL, employee)
          commit(NAVIGATOR_PUSH_EMPLOYEE, [employee])
          resolve(resp)
        })
        .catch((err) => {
          if (err.response?.data?.error !== "in user's org present employees" && err.response?.data?.error !== 'the employee is the director of the organization' && err.response?.data?.error !== 'the employee is already present in this organization') {
            notify(
              {
                group: 'api',
                title: 'REST API Error, please make screenshot',
                action: EMPLOYEE.CREATE_EMPLOYEE_REQUEST,
                text: err.response?.data ?? err
              },
              15000
            )
          }
          reject(err)
        })
    })
  },
  [EMPLOYEE.CHANGE_EMPLOYEE_DEP]: async ({ commit, dispatch }, data) => {
    if (data.depOld?.emails) {
      data.depOld.emails = data.depOld.emails.filter(
        (email) => email !== data.emailEmp
      )
      await dispatch(DEPARTMENTS.UPDATE_DEPARTMENT_REQUEST, data.depOld)
    }
    if (data.depNew?.emails) {
      data.depNew.emails.push(data.emailEmp)
      await dispatch(DEPARTMENTS.UPDATE_DEPARTMENT_REQUEST, data.depNew)
    }
    // обновляем навигатор
    commit(NAVIGATOR_CHANGE_EMPLOYEE_DEPARTMENT, data)
    // обновляем сотрудника
    commit('ChangeEmployeeDep', data)
    return 'ok'
  },
  [EMPLOYEE.CHANGE_EMPLOYEE_NAME]: ({ commit, dispatch, rootState }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/emp/title/?email=' +
        data.email +
        '&title=' +
        data.name
      axios({ url: url, method: 'PATCH' })
        .then((resp) => {
          commit('ChangeEmployeeName', data)
          const currentUserEmail =
            rootState.user.user?.current_user_email?.toLowerCase()
          if (data.email.toLowerCase() === currentUserEmail) {
            commit('ChangeCurrentUserName', data.name)
          }
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: EMPLOYEE.CHANGE_EMPLOYEE_NAME,
              text: err.response?.data || err
            },
            15000
          )
          reject(err)
        })
    })
  },
  [EMPLOYEE.REMOVE_EMPLOYEE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/emp?uid_delete=' +
        data.uid +
        '&uid_delegate=00000000-0000-0000-0000-000000000000'
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: EMPLOYEE.REMOVE_EMPLOYEE_REQUEST,
              text: err.response.data
            },
            15000
          )
          reject(err)
        })
    })
  }
}

const mutations = {
  [EMPLOYEE.PUSH_EMPLOYEE]: (state, employee) => {
    state.employees[employee.uid] = employee
  },
  [EMPLOYEE.PUSH_EMPLOYEE_BY_EMAIL]: (state, employee) => {
    state.employeesByEmail[employee.email.toLowerCase()] = employee
  },
  // добавление данных в employees из navigator
  [EMPLOYEE.PUSH_DELIGATE_IN_EMPLOYEE]: (state, deligateIamNavigator) => {
    state.employeesByDelegation[deligateIamNavigator.uid] = deligateIamNavigator
  },
  [EMPLOYEE.SELECT_EMPLOYEE]: (state, employee) => {
    state.selectedEmployee = employee
  },
  ChangeEmployeeName: (state, data) => {
    const employee = state.employeesByEmail[data.email.toLowerCase()]
    employee.name = data.name
  },
  ChangeEmployeeDep: (state, data) => {
    const employee = state.employees[data.uidEmp]
    employee.dep = data.uidDepartmentNew
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
