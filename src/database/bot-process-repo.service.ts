import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BotProcess,
  BotProcessDocument,
} from 'src/database/schemas/bot-process.schema';
import { Token } from 'src/database/schemas/token.schema';
import { getCurrentUTCTime } from 'src/utils';

@Injectable()
export class BotProcessRepoService {
  private readonly logger = new Logger(BotProcessRepoService.name);

  constructor(
    @InjectModel(BotProcess.name)
    private readonly model: Model<BotProcessDocument>,
  ) {}

  async findAllExistingProcesses(): Promise<BotProcessDocument[]> {
    return this.model
      .find({
        timestampCreation: { $exists: true },
        timestampTerminated: { $in: [null, undefined] },
      })
      .exec();
  }

  async findProcessByToken(token: Token): Promise<BotProcessDocument> {
    return this.model.findOne({ token }).exec();
  }

  async findShouldTerminateProcesses(): Promise<BotProcessDocument[]> {
    return this.model
      .find({
        shouldTerminate: true,
        timestampTerminated: { $in: [null, undefined] },
      })
      .exec();
  }

  async createProcess(process: BotProcess): Promise<BotProcessDocument> {
    const createdProcess = new this.model(process);
    return createdProcess.save();
  }

  async updateShouldTerminate(processId: string, shouldTerminate: boolean) {
    await this.model.findByIdAndUpdate(processId, {
      shouldTerminate,
    });
  }

  async updateTerminateTimestamp(processId: string) {
    await this.model.findByIdAndUpdate(processId, {
      timestampTerminated: getCurrentUTCTime(),
    });
  }

  async updateProcess(
    process: BotProcessDocument,
  ): Promise<BotProcessDocument> {
    return await this.model.findByIdAndUpdate(process._id, process, {
      new: true,
    });
  }
}
