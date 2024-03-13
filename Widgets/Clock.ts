export const Clock = Widget.Button({
  className: 'clock',
  child: Widget.Label().poll(30000, (self) =>
    self.label = Utils.exec(`date +'%H:%M'`)
  ),
})
