import { PopupWin, openAIButton } from "Widgets/AI"
import { Audio } from "Widgets/Audio"
import { Clock } from "Widgets/Clock"

const hyprland = await Service.import("hyprland")
const mpris = await Service.import("mpris")
const notifications = await Service.import("notifications")
const systemtray = await Service.import("systemtray")


function Left() {
  return Widget.Box({
    spacing: 8,
    children: [
      Workspaces(),
    ],
  })
}

function Workspaces() {
  const activeId = hyprland.active.workspace.bind("id")
  const workspaces = hyprland.bind("workspaces")
    .as(ws => ws
      .sort((a, b) => a.id - b.id)
      .filter(({ id }) => id !== -99) // exclude scratchpad/ special workspaces
      .map(({ id }) => Widget.Button({
        on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
        child: Widget.Label(`${id}`),
        class_name: activeId.as(i => `${i === id ? "focused" : ""}`),
      })))

  return Widget.Box({
    class_name: "workspaces",
    children: workspaces,
  })
}


function Center() {
  return Widget.Box({
    spacing: 8,
    children: [
      Media(),
      Notification(),
      Widget.Entry({

        on_change: ({ text }) => print(text),
      })
    ],
  })
}


function Media() {
  const label = Utils.watch("", mpris, "player-changed", () => {
    if (mpris.players[0]) {
      const { track_artists, track_title } = mpris.players[0]
      return `${track_artists.join(", ")} - ${track_title}`
    } else {
      return ""
    }
  })

  return Widget.Button({
    class_name: "media",
    on_primary_click: () => mpris.getPlayer("")?.playPause(),
    on_scroll_up: () => mpris.getPlayer("")?.next(),
    on_scroll_down: () => mpris.getPlayer("")?.previous(),
    child: Widget.Label({ label }),
  })
}

// we don't need dunst or any other notification daemon because the Notifications module is a notification daemon itself xD
function Notification() {
  const popups = notifications.bind("popups")
  return Widget.Box({
    class_name: "notification",
    visible: popups.as(p => p.length > 0),
    children: [
      Widget.Icon({
        icon: "preferences-system-notifications-symbolic",
      }),
      Widget.Label({
        label: popups.as(p => p[0]?.summary || ""),
      }),
    ],
  })
}

function Right() {
  return Widget.Box({
    hpack: "end",
    spacing: 8,
    children: [
      Audio,
      SysTray(),
      openAIButton,
      // openAIButton,
      Clock,
    ],
  })
}

// function Volume() {
//   const icons = {
//     101: "overamplified",
//     67: "high",
//     34: "medium",
//     1: "low",
//     0: "muted",
//   }
//
//   function getIcon() {
//     const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
//       threshold => threshold <= audio.speaker.volume * 100)
//
//     return `audio-volume-${icons[icon]}-symbolic`
//   }
//
//   const icon = Widget.Icon({
//     icon: Utils.watch(getIcon(), audio.speaker, getIcon),
//   })
//
//   const slider = Widget.Slider({
//     hexpand: true,
//     draw_value: false,
//     on_change: ({ value }) => audio.speaker.volume = value,
//     setup: self => self.hook(audio.speaker, () => {
//       self.value = audio.speaker.volume || 0
//     }),
//   })
//
//   return Widget.Box({
//     class_name: "volume",
//     css: "min-width: 180px",
//     children: [icon, slider],
//   })
// }
//
function SysTray() {
  const items = systemtray.bind("items")
    .as(items => items.map(item => Widget.Button({
      child: Widget.Icon({ icon: item.bind("icon") }),
      on_primary_click: (_, event) => item.activate(event),
      on_secondary_click: (_, event) => item.openMenu(event),
      tooltip_markup: item.bind("tooltip_markup"),
    })))

  return Widget.Box({
    class_name: "systray",
    children: items,
  })
}


const Bar = (monitor: number = 0) => Widget.Window({
  keymode: 'on-demand',
  monitor,
  name: `bar${monitor}`,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    start_widget: Left(),
    center_widget: Center(),
    end_widget: Right(),
  }),
});

App.config({
  windows: [Bar(), PopupWin()],
  style: './style.css'
});



