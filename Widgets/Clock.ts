import Menu from './menu/Menu.js'
export const Clock = Widget.Button({
  onClicked: (self) => self.attribute.menu.toggle(),
  attribute: { menu: Menu('calendar') },
  className: 'clock',
  child: Widget.Label().poll(30000, (self) =>
    self.label = Utils.exec(`date +'%H:%M'`)
  ),
})
