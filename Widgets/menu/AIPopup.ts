import ChatGPT from './AIService.js';
import icons from '../../js/icons.js';
import PopupWindow from './PopupWindow.js';
import { Settings } from 'js/settings.js';

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

export default () => PopupWindow({
  name: 'aipopup',
  anchor: Settings.getPosition('bar', 'end'),
  layout: Settings.getPosition('bar', 'end'),
  content: Widget.Box({
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
            onAccept: (e) => {
              ChatGPT.instance.send(e.text);
              e.text = '';
            },
            hexpand: true,
          }),
          Widget.Button({
            onClicked: ChatGPT.clear,
            child: Widget.Box({
              children: [
                Widget.Label('Clear '),
                Widget.Icon(icons.trash.empty),
              ]
            }),
          }),
        ]
      }),
    ],
  }),
})

