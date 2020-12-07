import React, { useState, useEffect } from 'react'
import {
  observer,
  useValue,
  useSession,
  $root,
  emit
} from 'startupjs'
import axios from 'axios'
import './index.styl'
import { MainProfessor, MainPlayer, Leaderboard } from 'components'
import { Div, Span, Button, Br, Row, Card, Input, Checkbox } from '@startupjs/ui'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default observer(function PMain ({ style }) {
  const [sessionUser, $sessionUser] = useSession('currentUser')

  return pug`
    Div
      Button(onPress=() => emit('url', '/past-games')) Past games
      Span LeaderBoard
      Leaderboard
      if sessionUser.isProfessor
        MainProfessor
      else
        MainPlayer
  `
})

