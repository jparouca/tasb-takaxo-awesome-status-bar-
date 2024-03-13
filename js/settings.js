import App from 'resource:///com/github/Aylur/ags/app.js';
import Service from 'resource:///com/github/Aylur/ags/service/service.js';
import { exec, execAsync, readFile, writeFile } from 'resource:///com/github/Aylur/ags/utils.js';

class SettingsService extends Service {
    static { Service.register(this); }

    _settingsPath = App.configDir + '/settings.json';

    constructor() {
        super();

        ags.Utils.subprocess([
            'inotifywait',
            '--recursive',
            '--exclude', 'extensions',
            '--exclude', 'style.css',
            '--event', 'modify',
            '-m', ags.App.configDir,
          ], () => {
              this.reset()
          });
    }

    reset() {
        this._settings = null;
        this.emit('changed');
    }

    get settings() {
        if (this._settings)
            return this._settings;

        try {
            this._settings = JSON.parse(readFile(this._settingsPath));
        } catch (e) {
            console.error(e)
            this._settings = {};
        }
        return this._settings;
    }

    getSetting(prop, defaultValue) {
        const pathArray = prop.match(/([^[.\]])+/g)
        const result = pathArray.reduce(
          (prevObj, key) => prevObj && prevObj[key],
          this.settings
        )
        return result === undefined ? defaultValue : result
    }

    getPosition(mon_side, bar_side) {
        const sides = ['top', 'right', 'bottom', 'left']
        let bar_pos = Math.max(0, sides.indexOf(this.getSetting('config.bar.type', 'top')));
        switch (mon_side) {
          case 'bar_op':
            bar_pos = (bar_side + 2) % 4
            break;
          case 'bar_clock':
            bar_pos = (bar_side + 1) % 4
            break;
          case 'bar_anticlock':
            bar_pos = (bar_side - 1) % 4
            break;
          case 'bar':
          default:
            break;
        }
        let pos = sides[bar_pos]
        switch (bar_side) {
          case 'full':
            pos += ' ' + sides[(bar_pos+1)%4]
            pos += ' ' + sides[(bar_pos-1)%4]
            break;
          case 'end':
            pos += ' ' + sides[(bar_pos+((1-bar_pos) >= 0 ? 1 : -1))%4]
            break;
          case 'start':
            pos += ' ' + sides[(bar_pos+((1-bar_pos) > 0 ? -1 : 1))%4]
            break;
          default:
            break;
        }
        return pos;
    }

    getVertical(){
        const bar_pos = this.getSetting('config.bar.type', 'top');
        return (bar_pos === 'top' || bar_pos === 'bottom') ? false : true;
    }
}

export class Settings {
    static instance = new SettingsService();

    static reset() { Settings.instance.reset(); }
    static getSetting(prop, defaultValue) { return Settings.instance.getSetting(prop, defaultValue); }
    static getPosition(mon_side, bar_side) { return Settings.instance.getPosition(mon_side, bar_side); }
    static getVertical() { return Settings.instance.getVertical(); }
}

Service['Settings'] = Settings;
