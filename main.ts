const time = Variable('', {
    poll: [1000, function() {
        return Date().toString();
    }],
});

const idle = Variable(0)
idle.connect('changed', ({ value }) => {
    print(`idle changed: ${value}`);
})

const pactl = Variable({ count: 0, msg: '' }, {
    listen: ['pactl subscribe', (msg) => ({
        count: pactl.value.count + 1,
        msg: msg,
    })],
})
pactl.connect('changed', ({ value }) => {
    print(value.msg, value.count)
})
const penis = Widget.Label({
    label: pactl.bind().as(({ count, msg }) => {
        return `${msg} ${count}`
    }),
})
penis.connect('notify::label', ({ label }) => {
    print('label changed to ', label)
})


const Bar = (monitor: number = 0) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Widget.Label({
            hpack: 'center',
            label: 'Welcome to AGS!',
        }),
        center_widget: Widget.Label({
            hpack: 'center',
            label: penis,

        }),
        end_widget: Widget.Label({
            hpack: 'center',
            label: time.bind(),
        }),
    }),
});

App.config({
    windows: [Bar()],
});



