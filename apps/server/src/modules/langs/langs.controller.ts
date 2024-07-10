import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LangsService } from './langs.service';
import { CreateLangDto } from './dto/create-lang.dto';
import { UpdateLangDto } from './dto/update-lang.dto';

@Controller('langs')
export class LangsController {
  constructor(private readonly langsService: LangsService) {}

  @Post()
  create(@Body() createLangDto: CreateLangDto) {
    return this.langsService.create(createLangDto);
  }

  @Get()
  findAll() {
    return this.langsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.langsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLangDto: UpdateLangDto) {
    return this.langsService.update(+id, updateLangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.langsService.remove(+id);
  }
}
