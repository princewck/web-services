import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/tools')
export class ToolsUserController {
  constructor(private readonly toolsService: ToolsService) { }

  @Get()
  findAll(@Query('page') page, @Query('pageSize') pageSize, @Query('cid') cid) {
    console.log('cid', cid);
    return this.toolsService.findAll(page, pageSize, cid ? { categoryId: +cid, enabled: true } : { enabled: true });
  }

  @Get(':tid')
  findOne(@Param('tid') id: string) {
    return this.toolsService.findByKey(id);
  }
}
