import {Controller, Get, Post} from '@nestjs/common';
import {SettingsService} from "./settings.service";

export interface UserSettings {
  configDest: string;
  libraryDest: string;
}

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings(): UserSettings {
    const setting: UserSettings = {
      configDest: this.settingsService.getSettingPath(),
      libraryDest: this.settingsService.getLibraryPath(),
    };

    this.settingsService.initSetting();

    return setting;
  }

  @Post()
  updateSettings() {}
}
