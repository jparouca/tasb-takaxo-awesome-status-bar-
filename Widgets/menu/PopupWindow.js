const Padding = windowName => Widget.EventBox({
  className: 'padding',
  hexpand: true,
  vexpand: true,
  connections: [['button-press-event', () => App.toggleWindow(windowName)]],
});

const PopupRevealer = (windowName, transition, child) => Widget.Box({
  css: 'padding: 1px;',
  children: [Widget.Revealer({
    transition,
    child,
    transitionDuration: 350,
    connections: [[App, (revealer, name, visible) => {
      if (name === windowName)
        revealer.reveal_child = visible;
    }]],
  })],
});

const layouts = {
  'center': (windowName, child, expand) => Widget.CenterBox({
    className: 'shader',
    css: expand ? 'min-width: 5000px; min-height: 3000px;' : '',
    children: [
      Padding(windowName),
      Widget.CenterBox({
        vertical: true,
        children: [
          Padding(windowName),
          child,
          Padding(windowName),
        ],
      }),
      Padding(windowName),
    ],
  }),
  'left': (windowName, child) => Widget.CenterBox({
    children: [
      Widget.Box({
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_right', child),
          Padding(windowName),
        ],
      }),
      Padding(windowName),
    ],
  }),
  'right': (windowName, child) => Widget.CenterBox({
    children: [
      Padding(windowName),
      Widget.Box({
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_left', child),
          Padding(windowName),
        ],
      }),
    ],
  }),

  'bottom': (windowName, child) => Widget.CenterBox({
    children: [
      Padding(windowName),
      Widget.Box({
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_up', child),
        ],
      }),
      Padding(windowName),
    ],
  }),
  'top': (windowName, child) => Widget.CenterBox({
    children: [
      Padding(windowName),
      Widget.Box({
        vertical: true,
        children: [
          PopupRevealer(windowName, 'slide_down', child),
          Padding(windowName),
        ],
      }),
      Padding(windowName),
    ],
  }),
  'right bottom': (windowName, child) => Widget.Box({
    children: [
      Padding(windowName),
      Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_up', child),
        ],
      }),
    ],
  }),
  'right top': (windowName, child) => Widget.Box({
    children: [
      Padding(windowName),
      Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
          PopupRevealer(windowName, 'slide_down', child),
          Padding(windowName),
        ],
      }),
    ],
  }),
  'top right': (windowName, child) => Widget.Box({
    children: [
      Padding(windowName),
      Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
          PopupRevealer(windowName, 'slide_down', child),
          Padding(windowName),
        ],
      }),
    ],
  }),
  'bottom right': (windowName, child) => Widget.Box({
    children: [
      Padding(windowName),
      Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_up', child),
        ],
      }),
    ],
  }),
  'bottom left': (windowName, child) => Widget.Box({
    children: [
      Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_up', child),
        ],
      }),
      Padding(windowName),
    ],
  }),
  'left bottom': (windowName, child) => Widget.Box({
    children: [
      Widget.Box({
        hexpand: false,
        vertical: true,
        children: [
          Padding(windowName),
          PopupRevealer(windowName, 'slide_up', child),
        ],
      }),
      Padding(windowName),
    ],
  }),
};

const PopupWindow = ({ layout = 'center', expand = true, name, content, ...rest }) => Widget.Window({
  name,
  child: layouts[layout](name, content, expand),
  popup: true,
  focusable: true,
  ...rest,
});
export default PopupWindow;

