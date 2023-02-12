import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

import { ConfigService } from '@/common';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  constructor(private readonly configSerivce: ConfigService) {
    this.bot = new Telegraf(this.configSerivce.get('telegram.token'));
  }

  public async sendMessage(message: string): Promise<void> {
    await this.bot.telegram.sendMessage(this.configSerivce.get('telegram.channelId'), message, { parse_mode: 'Markdown' });
  }
}
