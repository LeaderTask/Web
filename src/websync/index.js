import { computed } from 'vue'
import store from '@/store/index.js'
import * as TYPES from '@/websync/types.js'

import processCreate from '@/websync/create.js'
import processRemove from '@/websync/remove.js'
import processUpdate from '@/websync/update.js'

const storeNavigator = computed(() => store.state.navigator.navigator)

function parseObject (obj) {
  switch (obj.operation) {
    case TYPES.TYPE_OPERATION_CREATE:
      processCreate(obj)
      break
    case TYPES.TYPE_OPERATION_REMOVE:
      processRemove(obj)
      break
    case TYPES.TYPE_OPERATION_UPDATE:
      processUpdate(obj)
      break
  }
}

export default function initWebSync () {
  const clientProperty = 'client'
  const websync = window?.fm?.websync
  if (!websync) {
    setTimeout(() => initWebSync(), 2500)
    console.log('initWebSync - websync is not loaded, try reconnect...')
    return
  }
  const client = new websync[clientProperty](
    process.env.VUE_APP_SYNC_LEADERTASK_API +
      'websync.ashx?uid_session=' +
      storeNavigator.value.push_channel
  )
  client.connect({
    onSuccess: function (e) {
      console.log('websync connected success!')
    },
    onFailure: function (e) {
      console.log('websync could not connect: ' + e.getException().message)
    },
    onStreamFailure: function (e) {
      console.log(
        'websync network problems: ' +
          e.getException().message +
          (e.getRetry() ? ' Will' : ' Will not') +
          ' reconnect.'
      )
    }
  })

  client.subscribe({
    channel: '/' + storeNavigator.value.push_channel,
    onSuccess: function (e) {
      console.log('websync subscribe success')
    },
    onFailure: function (e) {
      console.log('websync subscribe fail' + e.getException().message)
      e.setRetry(true)
    },
    onReceive: function (e) {
      try {
        const str = e.getDataJson()
        // делаем копирование объекта, потому что
        // никак не получить доступ к полю obj.obj.type
        // возвращает не то что там записано
        const obj = { ...JSON.parse(str) }

        parseObject(obj)
      } catch (e) {
        console.log('websync onReceive catch error', e)
      }
    }
  })
}
