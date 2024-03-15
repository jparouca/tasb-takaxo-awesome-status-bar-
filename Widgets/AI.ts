import ChatGPT from "AI/AIService";
import { Settings } from "js/settings";

export const openAIButton = Widget.Button({
  className: 'openai-button',
  onClicked: () => App.toggleWindow('aipopup'),
  child: Widget.Icon({ icon: 'openai-symbolic.svg', css: 'color: white;' }),
})


const Message = (msg, subs) => Widget.Box({
  className: `aimessage ${msg.role}`,
  vertical: true,
  children: [
    Widget.Label({
      label: subs[`${msg.role}`] || msg.role,
      justification: 'left',
      className: 'ai-role',
      hexpand: true,
      wrap: true,
      xalign: 0,
      selectable: true,
    }),
    Widget.Label({
      label: msg.content,
      justification: 'left',
      className: 'ai-content',
      hexpand: true,
      wrap: true,
      xalign: 0,
      selectable: true,
      binds: [['label', msg, 'content']],
      connections: [[msg, label => label.toggleClassName('thinking', msg.thinking)]]
    })
  ]
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
        className: 'ai-message-list',
        hscroll: 'never',
        vscroll: 'automatic',
        vexpand: true,
        child: Widget.Box({
          vertical: true,
          setup: box => ChatGPT.messages.map(msg => box._onAdded(box, msg)),
          properties: [
            ['onAdded', (box, msg) => {
              if (!msg) return;
              box.add(Message(msg, Settings.getSetting('labelReplacement', new Map())))
            }]
          ],
          connections: [[ChatGPT, (box, idx) => box._onAdded(box, ChatGPT.messages[idx]), 'newMsg'],
          [ChatGPT, box => {
            if (ChatGPT.messages.length == 0) {
              box.children = []
            }
          }, 'clear']]
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
