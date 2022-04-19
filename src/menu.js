import {
  mdiAccountCircle,
  mdiDesktopMac,
  // mdiGithub,
  mdiLock,
  mdiAlertCircle,
  // mdiMonitorShimmer,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive
} from '@mdi/js'

export default [
  'General',
  [
    {
      to: '/',
      icon: mdiDesktopMac,
      label: 'Dashboard'
    }
  ],
  'Examples',
  [
    {
      to: '/tables',
      label: 'Tables',
      icon: mdiTable,
      updateMark: true
    },
    {
      to: '/forms',
      label: 'Forms',
      icon: mdiSquareEditOutline
    },
    {
      to: '/ui',
      label: 'UI',
      icon: mdiTelevisionGuide
    },
    {
      to: '/responsive',
      label: 'Responsive',
      icon: mdiResponsive
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: mdiAccountCircle
    },
    {
      to: '/login',
      label: 'Login',
      icon: mdiLock
    },
    {
      to: '/error',
      label: 'Error',
      icon: mdiAlertCircle
    },
    {
      label: 'Submenus',
      subLabel: 'Submenus Example',
      icon: mdiViewList,
      menu: [
        {
          to: '/login',
          label: 'Sub-item One'
        },
        {
          to: '/login',
          label: 'Sub-item Two'
        },
        {
          label: 'Submenus',
          subLabel: 'Submenus Example',
          icon: mdiViewList,
          menu: [
            {
              to: '/login',
              label: 'Sub-item One'
            },
            {
              to: '/login',
              label: 'Sub-item Two'
            },
            {
              label: 'Submenus',
              subLabel: 'Submenus Example',
              icon: mdiViewList,
              menu: [
                {
                  to: '/login',
                  label: 'Sub-item One'
                },
                {
                  to: '/login',
                  label: 'Sub-item Two'
                },
                {
                  label: 'Submenus',
                  subLabel: 'Submenus Example',
                  icon: mdiViewList,
                  menu: [
                    {
                      to: '/login',
                      label: 'Sub-item One'
                    },
                    {
                      to: '/login',
                      label: 'Sub-item Two'
                    },
                    {
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
]
