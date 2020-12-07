import React, { useState, useEffect } from 'react'
import {
  observer,
  useValue,
  useSession,
  $root,
  useQuery,
  emit
} from 'startupjs'
import axios from 'axios'
import './index.styl'
import { MainProfessor, MainPlayer } from 'components'
import { Div, Span, Button, Br, Row, Card, Input, Checkbox, TextInput } from '@startupjs/ui'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default observer(function MainProfessor ({ style }) {
  const [sessionUser, $sessionUser] = useSession('currentUser')
  const [games, $games] = useQuery('games', {
    professorId: sessionUser.id,
    finished: { $ne: true }
  })
  const [gameName, $gameName] = useState()
  const [error, $error] = useValue()

  const onGameCreate = async() => {
    const gameId = $root.id()
    const roundId = $root.id()
    await $root.add('rounds', { id: roundId, roundIndex: 0, gameId })
    await $root.add('games', { name: gameName, professorId: sessionUser.id, id: gameId, rounds: [roundId] })
    emit('url', `/game/${id}`)
  }
  
  const onChangeText = val => $gameName(val)
  return pug`
    TextInput(
      error=error 
      abel='Game name'
      placeholder='Enter game name'
      value=gameName
      onChangeText=onChangeText
    )
    Button(onPress=onGameCreate disabled=!gameName) Create game
    each game in games
      Div(key=game.id)
        Button.btn(onPress=() => emit('url', '/game/'+game.id))= 'Join ' + game.name
  `
})

