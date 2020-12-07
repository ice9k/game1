import React from 'react'
import { observer, useSession } from 'startupjs'
import { ScrollView } from 'react-native'
import { TestComponent, LoginScreen } from 'components'
import ProfessorView from './ProfessorView'
import PlayerView from './PlayerView'
import './index.styl'
import { Content } from '@startupjs/ui'

export default observer(function PHome () {
  const [sessionUser, $sessionUser] = useSession('currentUser')
  return pug`
    ScrollView.root
      if sessionUser.isProfessor
        ProfessorView
      else
        PlayerView
  `
})
