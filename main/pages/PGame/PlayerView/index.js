import React from 'react'
import { observer, useSession, useLocal, useDoc, useQueryDoc} from 'startupjs'
import { ScrollView } from 'react-native'
import { TestComponent, LoginScreen, GameHistory } from 'components'
import './index.styl'
import { Content, Span, Button } from '@startupjs/ui'
import _ from 'lodash'

export default observer(function PHome () {
  const options = ['rock', 'paper', 'scissors']
  const [sessionUser, $sessionUser] = useSession('currentUser')
  const [gameId] = useLocal('$render.params.id')
  const [game, $game] = useDoc('games', gameId)
  const { player1, player2, rounds } = game
  const [user1, $user1] = useDoc('users', player1)
  const [user2, $user2] = useDoc('users', player2)
  const roundId = rounds[rounds.length-1]
  const previousRoundId = rounds[rounds.length-2]
  const [currentRound, $currentRound] = useDoc('rounds', roundId)
  const [previousRound] = useDoc('rounds', previousRoundId)
  const [lastRoundWithoutTie] = useQueryDoc('rounds', {
    _id: { $in: game.rounds},
    winner: {
      $exists: true,
      $ne: 'tie'
    },
    $sort: { roundIndex: -1 }
  })

  const enemyId = player1 === sessionUser.id? player2 : player1
  const myAnswer = _.get(currentRound, `${sessionUser.id}.answer`, null)
  const currentRoundWinner = currentRound.winner

  const onOptionsPress = async option => {
    const enemyPlayerAnswer = _.get(currentRound, `${enemyId}.answer`, null)
    if (enemyPlayerAnswer) {
      if (enemyPlayerAnswer === option) {
        $currentRound.setEach({
          [sessionUser.id] : {
            answer: option,
            roundPoints: 0,
            totalPoints: _.get(previousRound, `${sessionUser.id}.totalPoints`, 0)
          },
          [enemyId] : {
            answer: enemyPlayerAnswer,
            roundPoints: 0,
            totalPoints: _.get(previousRound, `${enemyId}.totalPoints`, 0)
          },
          winner: 'tie'
        })
      } else {
        if (
          (option === 'scissors' && enemyPlayerAnswer === 'paper') ||
          (option === 'paper' && enemyPlayerAnswer === 'rock') ||
          (option === 'rock' && enemyPlayerAnswer === 'scissors')
        ) {
          const pointsCount = !lastRoundWithoutTie || lastRoundWithoutTie.winner !== sessionUser.id
            ? 1
            : lastRoundWithoutTie[sessionUser.id].roundPoints * 2
          $currentRound.setEach({
            [sessionUser.id] : {
              answer: option,
              roundPoints: pointsCount,
              totalPoints: _.get(previousRound, `${sessionUser.id}.totalPoints`, 0) + pointsCount
            },
            [enemyId] : {
              answer: enemyPlayerAnswer,
              roundPoints: 0,
              totalPoints: _.get(previousRound, `${enemyId}.totalPoints`, 0)
            },
            winner: sessionUser.id
          })
        } else {
          const pointsCount = !lastRoundWithoutTie || lastRoundWithoutTie.winner !== enemyId
            ? 1
            : lastRoundWithoutTie[enemyId].roundPoints * 2
          $currentRound.setEach({
            [sessionUser.id] : {
              answer: option,
              roundPoints: 0,
              totalPoints: _.get(previousRound, `${sessionUser.id}.totalPoints`, 0)
            },
            [enemyId] : {
              answer: enemyPlayerAnswer,
              roundPoints: pointsCount,
              totalPoints: _.get(previousRound, `${enemyId}.totalPoints`, 0) + pointsCount
            },
            winner: sessionUser.id
          })
        }
      }
    } else {
      $currentRound.setEach({
        [sessionUser.id]: { answer: option }
      })
    }
  }

  const getWinnerString = entity => {
    if (entity.winner === 'tie') return 'Tie'
    if (entity.winner === user1.id) {
      return `${user1.name} wins!`
    } else {
      return `${user2.name} wins!`
    }
  }

  const onSurrenderPress = async () => {
    const player1points = currentRound[player1].totalPoints
    const player2points = currentRound[player2].totalPoints
    const gameWinner = player1points === player2points
      ? 'tie'
      : player1points > player2points
        ? player1
        : player2
    await $game.setEach({
      finished: true,
      winner: gameWinner,
      totalPoints: {
        [player1]: player1points,
        [player2]:player2points,
      }
    })
    await $user1.set('totalPoint', _.get(user1, 'totalPoints', 0)+ player1points)
    await $user2.set('totalPoint', _.get(user2, 'totalPoints', 0)+ player2points)
  }

  return pug`
    ScrollView.root
      GameHistory(gameId=gameId)
      if !myAnswer
        each option in options
          Button(onPress=() => onOptionsPress(option))= option
      else if currentRoundWinner
        Span= getWinnerString(currentRound)
        Button(onPress=onSurrenderPress) Surrender
      else
        Span Waiting for enemy answer
  `
})
