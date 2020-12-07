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
import { Div, Span, Button, Br, Row, Card, Input, Checkbox, TextInput, Pagination } from '@startupjs/ui'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default observer(function MainPlayer ({ style }) {
  const limit=10
  const [skip, setSkip] = useState(0)
  const [sessionUser, $sessionUser] = useSession('currentUser')
  const [games, $games] = useQuery('games', {
    $or: [
      {player1: { $exists: false}},
      {player2: { $exists: false}},
      {$and: [
        {$or: [
          {player1: sessionUser.id},
          {player2: sessionUser.id},
        ]},
        {finished: { $ne: true}}
      ]}
    ],
    $skip: skip,
    $limit: limit
  })

  const [gamesCount] = useQuery('games', {
    $or: [
      {player1: { $exists: false}},
      {player2: { $exists: false}},
      {$and: [
        {$or: [
          {player1: sessionUser.id},
          {player2: sessionUser.id},
        ]},
        {finished: { $ne: true}}
      ]}
    ],
    $count: true
  })

  const onJoinGame = async id => {
    const $game = $root.scope(`games.${id}`)
    const { player1, player2 } = $game.get()
    if (!player1) {
      await $game.set('player1', sessionUser.id)
    } else if (!player2) {
      await $game.set('player2', sessionUser.id)
    }
    emit('url', `/game/${id}`)
  }
  
  const onChangeText = val => $gameName(val)
  return pug`
    Div
      Span Available games
      each game in games
        Div(key=game.id)
          Span= game.name
          Button(onPress=() => onJoinGame(game.id) ) Join
      Pagination(
        count=gamesCount
        limit=limit
        skip=skip
        onChangePage=val => setSkip(val * limit)
      )
  `
})