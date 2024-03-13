import GdkPixbuf from 'gi://GdkPixbuf';
import PopupAI from "./AIPopup.js";
import ChatGPT from './AIService.js';
const { Box, Label, Button, Icon, Overlay, ProgressBar } = ags.Widget;
const { Settings } = ags.Service;
const { App } = ags;
const { HoverRevealer, PanelButton, BatteryIcon } = internal.Widgets;

const BWAIIndicator = () => PanelButton({
  className: 'panel-button ai',
  onClicked: () => App.toggleWindow('aipopup'),
  child: Icon(Settings.getSetting('avatar')),
});


BarWidgets.AI = {
    fn: BWAIIndicator,
    deps: ["Popups/AIPopup"]
}

Popups.AIPopup = {
    fn: PopupAI,
}
