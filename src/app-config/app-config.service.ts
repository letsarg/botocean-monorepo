import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Network, Platform } from 'src/enum';

@Injectable()
export class AppConfigService {
  readonly port: number;
  readonly platform: Platform;
  readonly db_connection: string;

  constructor(configService: ConfigService) {
    this.port = configService.get<number>('app.port');
    this.db_connection = configService.get<string>('app.db_connection');

    // switch (this.platform) {
    //   case Platform.PUMP:
    //     this.pump = new PumpConfig(configService);
    //     break;
    //   case Platform.APE:
    //     this.ape = new ApeConfig(configService);
    //     break;
    //   default:
    //     throw new Error(`platform is undefined`);
    // }
  }
}

export class PumpConfig {
  private_key_solana: string;
  rpc_chainstack: string;
  rpc_ws_chainstack: string;
  rpc_quicknode: string;
  rpc_ws_quicknode: string;
  ipfs_key_filebase: string;
  ipfs_key_quicknode: string;
  total_sol_per_launch: number;
  amount_min_pump: number;
  amount_max_pump: number;
  step_pump: number;
  amount_deployer: number;
  deployer_buy: number;
  exit_price: number;
  slippage: number;
  slippage_deployer: number;
  percentage_per_total_balance_buy: number;
  threshold_big_buy: number;
  fee_mode: string;
  fee_percentage: number;
  unit_budget: number;
  compute_unit_price_launch: number;
  fee_buy_increase_percentage: number;
  time_to_delete: number;
  fee_mode_launch: string;

  constructor(configService: ConfigService) {
    this.private_key_solana = configService.get<string>(
      'pump.private_key_solana',
    );
    this.rpc_chainstack = configService.get<string>('pump.rpc_chainstack');
    this.rpc_ws_chainstack = configService.get<string>(
      'pump.rpc_ws_chainstack',
    );
    this.rpc_quicknode = configService.get<string>('pump.rpc_quicknode');
    this.rpc_ws_quicknode = configService.get<string>('pump.rpc_ws_quicknode');
    this.ipfs_key_filebase = configService.get<string>(
      'pump.ipfs_key_filebase',
    );
    this.ipfs_key_quicknode = configService.get<string>(
      'pump.ipfs_key_quicknode',
    );
    this.total_sol_per_launch = configService.get<number>(
      'pump.total_sol_per_launch',
    );
    this.amount_min_pump = configService.get<number>('pump.amount_min_pump');
    this.amount_max_pump = configService.get<number>('pump.amount_max_pump');
    this.step_pump = configService.get<number>('pump.step_pump');
    this.amount_deployer = configService.get<number>('pump.amount_deployer');
    this.deployer_buy = configService.get<number>('pump.deployer_buy');
    this.exit_price = configService.get<number>('pump.exit_price');
    this.slippage = configService.get<number>('pump.slippage');
    this.slippage_deployer = configService.get<number>(
      'pump.slippage_deployer',
    );
    this.percentage_per_total_balance_buy = configService.get<number>(
      'pump.percentage_per_total_balance_buy',
    );
    this.threshold_big_buy = configService.get<number>(
      'pump.threshold_big_buy',
    );
    this.fee_mode = configService.get<string>('pump.fee_mode');
    this.fee_percentage = configService.get<number>('pump.fee_percentage');
    this.unit_budget = configService.get<number>('pump.unit_budget');
    this.compute_unit_price_launch = configService.get<number>(
      'pump.compute_unit_price_launch',
    );
    this.fee_buy_increase_percentage = configService.get<number>(
      'pump.fee_buy_increase_percentage',
    );
    this.time_to_delete = configService.get<number>('pump.time_to_delete');
    this.fee_mode_launch = configService.get<string>('pump.fee_mode_launch');
  }
}

export class ApeConfig {
  private_key: string;
  network: string;
  rpc: string;
  token: ApeTokenMetadata
  slippage: number;
  funds: number[];
  profit: number;

  constructor(configService: ConfigService) {
    this.private_key = configService.get<string>('ape.private_key');
    this.network = configService.get<string>('ape.network');
    this.rpc = configService.get<string>('ape.rpc');
    this.token = configService.get<ApeTokenMetadata>('ape.token');
    this.slippage = configService.get<number>('ape.slippage');
    this.funds = configService.get<number[]>('ape.funds');
    this.profit = configService.get<number>('ape.profit');
  }

  getNetwork(): Network {
    switch (this.network) {
      case 'base':
        return Network.BASE;
      case 'eth':
        return Network.ETH;
      default:
        throw new Error(`Unknown network for ape: ${this.network}`)
    }
  }
}

export class ApeTokenMetadata {
  image_file: string;
  name: string;
  symbol: string;
  description?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
}
