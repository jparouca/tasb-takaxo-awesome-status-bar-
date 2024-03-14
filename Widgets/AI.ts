
export const openAIButton = Widget.Button({
  className: 'openai-button',
  onClicked: () => App.toggleWindow('aipopup'),
  child: Widget.Icon({ icon: 'openai-symbolic.svg', css: 'color: white;' }),
})


export const PopupWin = () => Widget.Window({
  name: 'aipopup',
  monitor: 0,
  popup: true,
  keymode: 'on-demand',
  child: Widget.Box({
    className: 'aipopup',
    vertical: true,
    children: [
      Widget.Scrollable({
        vexpand: true,
        child: Widget.Box({
          vertical: true,
        })
      }),
      Widget.Box({
        spacing: 5,
        children: [
          Widget.Entry({
            text: 'search'
          })
        ]
      })

    ]
  })
})
