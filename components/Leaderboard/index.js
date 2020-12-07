import React from 'react'
import { observer, useSession, useLocal, useQuery } from 'startupjs'
import { ScrollView } from 'react-native'
import { TestComponent, LoginScreen } from 'components'
import './index.styl'
import { Content, Span, Button, Row, Div } from '@startupjs/ui'
import _ from 'lodash'

export default observer(function Leaderboards () {
  const [top10] = useQuery('users', {
    $sort: {
      totalPoint: -1
    },
    $limit: 10
  })
  return pug`
    Div
      each player in top10
        Row
          Span= player.name
          Span= ' - ' + (player.totalPoint || 0) + ' points'
  `
})
