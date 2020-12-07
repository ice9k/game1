import React, { useState } from 'react'
import { observer, useLocal, useDoc, useQuery, useSession } from 'startupjs'
import { ScrollView } from 'react-native'
import { TestComponent, LoginScreen, GameHistory } from 'components'
import './index.styl'
import { Content, Div, Button, Span, Collapse, Pagination, Row } from '@startupjs/ui'
import _ from 'lodash'

export default observer(function PPastGames () {
  const limit = 10
  const [skip, setSkip] = useState(0)
  const [sessionUser, $sessionUser] = useSession('currentUser')
  const query = sessionUser.isProfessor
    ? {professorId: sessionUser.id}
    : {$or: [
        {player1: sessionUser.id},
        {player2: sessionUser.id},
      ]}
  const [games, $games] = useQuery('games', {
    $aggregate: [
      {
        $match: {
          ...query,
          finished: true
        }
      },
      {
        $lookup: {
          from: 'users',
          let: {
            user1id: '$player1',
            user2id: '$player2',
            profId: '$professorId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $eq: ['$_id', '$$user1id']
                    },
                    {
                      $eq: ['$_id', '$$user2id']
                    },
                    {
                      $eq: ['$_id', '$$profId']
                    }
                  ]
                }
              }
            }
          ],
          as: 'players'
        }
      },
      {
        $skip: skip,
      },
      {
        $limit: limit
      },
    ]
  })
  const [gamesCount] = useQuery('games', {
    ...query,
    finished: true,
    $count: true
  })
  return pug`
    Div
      Span Past games
      each game in games
        -const player1 = game.players.find(player => player._id === game.player1)
        -const player2 = game.players.find(player => player._id === game.player2)
        -const professor = game.players.find(player => player._id === game.professorId)
        Div
          Span= game.name
          Span= 'Professor: ' + professor.name
          Span= 'Player1: ' + player1.name
          Span= 'Player1 total points: '+game.totalPoints[game.player1]
          Span= 'Player2: ' + player2.name
          Span= 'Player2 total points: '+game.totalPoints[game.player2]
          GameHistory(gameId=game._id)
      Pagination(
        count=gamesCount
        limit=limit
        skip=skip
        onChangePage=val => setSkip(val * limit)
      )
  `
})