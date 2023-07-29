import {Controller, Get, Post} from '@nestjs/common';
import {SettingsService} from "./settings.service";

export interface UserSettings {
  path: string;
}

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings(): UserSettings {
    const setting: UserSettings = {
      path: this.settingsService.getSettingPath(),
    };

    this.settingsService.initSetting();

    return setting;
  }

  @Post()
  updateSettings() {}
}
