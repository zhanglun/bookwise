import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

const settingFileName = 'setting.json5';
@Injectable()
export class SettingsService {
  public initSetting() {
    const dest = this.getSettingPath();
    const filepath = path.join(dest, settingFileName);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, '');
    }
  }

  public getSettingPath() {
    console.log(os);
    const homedir = os.homedir();

    return path.join(homedir, '.config', 'bookwise');
  }
}
