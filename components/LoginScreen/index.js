import React, { useState, useEffect } from 'react'
import {
  observer,
  useValue,
  useSession,
  $root,
  emit,
  useLocal,
} from 'startupjs'
import axios from 'axios'
import './index.styl'
import { Div, Span, Button, Br, Row, Card, TextInput, Checkbox } from '@startupjs/ui'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default observer(function LoginScreen ({ style }) {
  const [userName, $userName] = useState()
  const [checked, setChecked] = useState(false)
  const [currentUser, $currentUser] = useSession('currentUser')

  const onLogin = async() => {
    const $query = $root.query('users', { name: userName })
    await $query.subscribe()
    const userArr = $query.get()
    if (userArr.length) {
      await $currentUser.set(userArr[0])
    } else {
      const id = $root.id()
      await $root.add('users', { name: userName, isProfessor: checked, id: id})
      const $user = $root.scope(`users.${id}`)
      await $user.subscribe()
      const user = await $user.get()
      await $currentUser.set(user)
      $user.unsubscribe()
    }
    $query.unsubscribe()
    emit('url', '/main')
  }

  return pug`
    Div.root(style=style)
      TextInput(
        label='Name'
        placeholder='Enter your name'
        value=userName
        onChangeText=val => $userName(val)
      )
      Checkbox(
        label='Login as professor'
        value=checked
        onChange=setChecked
      )
      Button(onPress=onLogin) Login
  `
})

