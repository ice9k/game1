export default (components = {}) => [
  {
    path: '/',
    exact: true,
    component: components.PHome
  },
  {
    path: '/about',
    exact: true,
    component: components.PAbout
  },
  {
    path: '/main',
    exact: true,
    component: components.PMain
  },
  {
    path: '/game/:id',
    exact: true,
    component: components.PGame
  },
  {
    path: '/past-games',
    exact: true,
    component: components.PPastGames
  }
]
