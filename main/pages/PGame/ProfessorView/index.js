import React from 'react'
import { observer, useLocal, useDoc, $root } from 'startupjs'
import { ScrollView } from 'react-native'
import { TestComponent, LoginScreen, GameHistory } from 'components'
import './index.styl'
import { Content, Div, Button, Span } from '@startupjs/ui'
import _ from 'lodash'

export default observer(function PHome () {
  const [gameId] = useLocal('$render.params.id')
  const [game, $game] = useDoc('games', gameId)
  const { player1, player2, rounds } = game
  const [user1, $user1] = useDoc('users', player1)
  const [user2, $user2] = useDoc('users', player2)
  const roundId = rounds[rounds.length-1]
  const [currentRound, $currentRound] = useDoc('rounds', roundId)

  const player1roundData = currentRound[player1] || {}
  const player2roundData= currentRound[player2] || {}

  const getWinnerString = entity => {
    if (entity.winner === 'tie') return 'Tie'
    if (entity.winner === user1.id) {
      return `${user1.name} wins!`
    } else {
      return `${user2.name} wins!`
    }
  }

  const onNextRoundPress = async() => {
    const roundId = $root.id()
    await $root.add('rounds', {
      gameId,
      id: roundId,
      roundIndex: game.rounds.length,
      [player1]: { totalPoints: currentRound[player1].totalPoints},
      [player2]: { totalPoints: currentRound[player2].totalPoints}
    })
    await $game.push('rounds', roundId)
  }

  const onFinishGame = async () => {
    const player1points = player1roundData.totalPoints
    const player2points = player2roundData.totalPoints
    const gameWinner = player1points === player2points
      ? 'tie'
      : player1points > player2points
        ? player1
        : player2
    $game.setEach({
      finished: true,
      winner: gameWinner,
      totalPoints: {
        [player1]: player1points,
        [player2]:player2points,
      }
    })
    $user1.set('totalPoint', _.get(user1, 'totalPoints', 0)+ player1points)
    $user2.set('totalPoint', _.get(user2, 'totalPoints', 0)+ player2points)
  }
  return pug`
    ScrollView.root
      GameHistory(gameId=gameId)
      if game.finished
        Span Game finished
        Span= getWinnerString(game)
      else 
        Span= 'Round' + rounds.length
        Button(disabled=!currentRound.winner onPress=onNextRoundPress) Next round
        Button(disabled=!currentRound.winner onPress=onFinishGame) Finish game
        Span Player1 answer:
        Span= player1roundData.answer || "Waiting for answer"
        Span= (player1roundData.roundPoints || 0) + ' points'
        Span= (player1roundData.totalPoints || 0) + ' total points'
        Span Player2 answer:
        Span= player2roundData.answer || "Waiting for answer"
        Span= (player2roundData.roundPoints || 0) + ' points'
        Span= (player2roundData.totalPoints || 0) + ' total points'
        if currentRound.winner
          Span= getWinnerString(currentRound)
  `
})
