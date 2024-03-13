const audio = await Service.import('audio')

export const Audio = Widget.Button({
  on_scroll_up: () => {
    const currentVolume = audio.speaker.volume;
    audio.speaker.volume = Math.min(1.0, currentVolume + 0.1); // Increase volume by 10%
  },
  on_scroll_down: () => {
    const currentVolume = audio.speaker.volume;
    audio.speaker.volume = Math.max(0.0, currentVolume - 0.1); // Decrease volume by 10%
  },
  on_clicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,
  child: Widget.Icon().hook(audio.speaker, self => {
    const vol = audio.speaker.volume * 100;
    const icon = [
      [101, 'overamplified'],
      [67, 'high'],
      [34, 'medium'],
      [1, 'low'],
      [0, 'muted'],
    ].find(([threshold]) => threshold <= vol)?.[1];

    self.icon = `audio-volume-${icon}-symbolic`;
    self.tooltip_text = `Volume ${Math.floor(vol)}%`;
  }),
})
