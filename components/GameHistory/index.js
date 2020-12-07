import React, { useState } from 'react'
import { observer, useLocal, useDoc, useQuery } from 'startupjs'
import { ScrollView } from 'react-native'
import { TestComponent, LoginScreen } from 'components'
import './index.styl'
import { Content, Div, Button, Span, Collapse, Pagination, Row } from '@startupjs/ui'
import _ from 'lodash'

export default observer(function GameHistory ({gameId}) {
  const limit = 10
  const [game] = useDoc('games', gameId)
  const  { player1, player2 } = game
  const [user1] = useDoc('users', player1)
  const [user2] = useDoc('users', player2)
  const [open, setOpen] = useState(false)
  const [skip, setSkip] = useState(0)
  const [rounds] = useQuery('rounds', {
    gameId,
    winner: { $exists: true },
    $sort: { roundIndex: 1 },
    $skip: skip,
    $limit: limit,
  })

  const [roundsCount] = useQuery('rounds', {
    gameId,
    winner: { $exists: true },
    $count: true,
  })

  return pug`
    Collapse(
      title= 'Game history'
      open=open
      onChange=() => setOpen(!open)
    )
      each round in rounds
        Div(key=round.roundIndex)
          Span= 'Round ' + (round.roundIndex+1)
          Row
            Div
              Span= user1.name
              Span= 'Answer: ' + round[player1].answer
              Span= round[player1].roundPoints + ' points earned'
              Span= round[player1].totalPoints + ' total points'
            Div
              Span= user2.name
              Span= 'Answer: ' + round[player2].answer
              Span= round[player2].roundPoints + ' points earned'
              Span= round[player2].totalPoints + ' total points'
      Pagination(
        count=roundsCount
        limit=limit
        skip=skip
        onChangePage=val => setSkip(val * limit)
      )
  `
})