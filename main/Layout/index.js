import React from 'react'
import { observer, emit, useValue, useLocal, useSession} from 'startupjs'
import './index.styl'
import { Row, Div, Layout, SmartSidebar, Menu, Button, H1 } from '@startupjs/ui'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import LoginScreen from 'components/LoginScreen'
import APP from '../../app.json'

const { displayName } = APP

const APP_NAME = displayName.charAt(0).toUpperCase() + displayName.slice(1)

const MenuItem = observer(({ url, children }) => {
  const [currentUrl] = useLocal('$render.url')
  return pug`
    Menu.Item(
      active=currentUrl === url
      onPress=() => emit('url', url)
    )= children
  `
})

export default observer(function ({ children }) {
  const [opened, $opened] = useValue(false)
  const [currentUser, $currentUser] = useSession('currentUser')
  if (!currentUser) emit('url', '/')
  function renderSidebar () {
    return pug`
      Menu.sidebar
        MenuItem(url='/') App
        MenuItem(url='/about') About
    `
  }

  return pug`
    Layout
      Div.body= children
  `
})
