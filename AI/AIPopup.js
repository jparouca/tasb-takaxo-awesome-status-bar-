const { Settings } = ags.Service;
const { PopupWindow } = internal.Widgets;
const { Button, Icon, Box, Label, Entry, Scrollable } = ags.Widget;
import ChatGPT from './AIService.js';
import icons from 'js/icons.js';

const Message = (msg, subs) => Box({
  className: `aimessage ${msg.role}`,
  vertical: true,
  children: [
    Label({
      label: subs[`${msg.role}`] || msg.role,
      justification: 'left',
      className: 'ai-role',
      hexpand: true,
      wrap: true,
      xalign: 0,
      selectable: true,
    }),
    Label({
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

export default () => PopupWindow({
  name: 'aipopup',
  anchor: Settings.getPosition('bar', 'end'),
  layout: Settings.getPosition('bar', 'end'),
  content: Box({
    className: 'aipopup',
    vertical: true,
    children: [
      Scrollable({
        className: 'ai-message-list',
        hscroll: 'never',
        vscroll: 'automatic',
        vexpand: true,
        child: Box({
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
      Box({
        spacing: 5,
        children: [
          Entry({
            onAccept: (e) => {
              ChatGPT.instance.send(e.text);
              e.text = '';
            },
            hexpand: true,
          }),
          Button({
            onClicked: ChatGPT.clear,
            child: Box({
              children: [
                Label('Clear '),
                Icon(icons.trash.empty),
              ]
            }),
          }),
        ]
      }),
    ],
  }),
})
