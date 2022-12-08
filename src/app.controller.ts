/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import db from './db';
import { PaintingDto } from './painting.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('list')
  async listPaintings(@Query('year') year = 1990) {
    const [rows] = await db.execute(
      'SELECT id, title FROM paintings WHERE year > ?',
      [year]
    );
    return {
      paintings: rows,
    };
  }

  @Get('paintings/new')
  @Render('form')
  newPaintingForm(){
    return {};
  }

  @Post('paintings/new')
  @Redirect()
  async newPainting(@Body() painting: PaintingDto) {
    painting.on_display = painting.on_display == 1;
    const [result]: any = await db.execute(
      'insert into paintings (title, year, on_display) values (?, ?, ?)',
      [painting.title, painting.year, painting.on_display]
    );
    return {
      url: '/paintings/' + result.insertId
    }
  }

  @Get('paintings/:id')
  @Render('show')
  async showPainting(@Param('id') id: number){
    const [rows] = await db.execute(
      'select title, year, on_display, id from paintings ' + 
      'where id = ?', [id]);
      return {painting : rows[0]};
  }

  @Post('paintings/:id/delete')
  @Redirect()
  async deletePainting(@Param('id') id: number){
    await db.execute(
      'delete from paintings where id = ?',
      [id]
    );
    return {
      url: '/',
    }
  }

  @Post('paintings/:id/update')
  @Render('update')
  async updatePainting(@Body() painting: PaintingDto){
    return {
      painting: painting,
    }
  }

  @Post('paintings/:id/update/send')
  @Redirect()
  handleUpdate(@Body() painting: PaintingDto){
    db.execute('update painting set (title, year, on_display) values (?, ?, ?)',
    [painting.title, painting.year, painting.on_display]);
    
    return {
      url: '/',
    }
  }
}
