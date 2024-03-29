import { TransactionType } from '@msafe/sui3-utils';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { WalletAccount, SuiSignTransactionBlockInput } from '@mysten/wallet-standard';

import { MSafeAppHelper } from '@/apps/interface';

import { AddLiquidityIntention } from './intentions/add-liquidity';
import { ClaimFeeAndMiningIntention } from './intentions/claim-fee-and-mining';
import { DecreaseLiquidityIntention } from './intentions/decrease-liquidity';
import { FarmingAddLiquidityIntention } from './intentions/farming-add';
import { FarmingBatchHarvestIntention } from './intentions/farming-batch-harvest';
import { FarmingClaimFeeAndRewardIntention } from './intentions/farming-claim-fee-and-rewards';
import { FarmingDecreaseLiquidityIntention } from './intentions/farming-decrease';
import { FarmingHarvestIntention } from './intentions/farming-harvest';
import { FarmingIncreaseLiquidityIntention } from './intentions/farming-increase';
import { FarmingRemoveLiquidityIntention } from './intentions/farming-remove';
import { FarmingStakeIntention } from './intentions/farming-stake';
import { FarmingUnstakeIntention } from './intentions/farming-unstake';
import { IncreaseLiquidityIntention } from './intentions/increase-liquidity';
import { RemoveLiquidityIntention } from './intentions/remove-liquidity';
import { XcetusCancelIntention } from './intentions/xcetus-cancel';
import { XcetusClaimingStakeRewardsIntention } from './intentions/xcetus-claim';
import { XcetusConvertIntention } from './intentions/xcetus-convert';
import { XcetusRedeemIntention } from './intentions/xcetus-redeem';
import { XcetusRedeemLockIntention } from './intentions/xcetus-redeem-lock';
import { SuiNetworks, CetusIntentionData, TransactionSubType } from './types';

export type CetusIntention =
  | AddLiquidityIntention
  | IncreaseLiquidityIntention
  | FarmingAddLiquidityIntention
  | FarmingIncreaseLiquidityIntention
  | DecreaseLiquidityIntention
  | RemoveLiquidityIntention
  | ClaimFeeAndMiningIntention
  | FarmingDecreaseLiquidityIntention
  | FarmingRemoveLiquidityIntention
  | FarmingClaimFeeAndRewardIntention
  | FarmingHarvestIntention
  | FarmingBatchHarvestIntention
  | FarmingStakeIntention
  | FarmingUnstakeIntention
  | XcetusConvertIntention
  | XcetusRedeemLockIntention
  | XcetusClaimingStakeRewardsIntention
  | XcetusCancelIntention
  | XcetusRedeemIntention;

export class CetusHelper implements MSafeAppHelper<CetusIntentionData> {
  application = 'cetus';

  async deserialize(
    input: SuiSignTransactionBlockInput & { network: SuiNetworks; suiClient: SuiClient; account: WalletAccount } & {
      action?: string;
      txbParams?: any;
    },
  ): Promise<{ txType: TransactionType; txSubType: string; intentionData: CetusIntentionData }> {
    console.log('Helper deserialize input: ', input);
    const { txbParams, action } = input;

    return {
      txType: TransactionType.Other,
      txSubType: action,
      intentionData: {
        txbParams: { ...txbParams },
        action,
      },
    };
  }

  async build(input: {
    intentionData: CetusIntentionData;
    txType: TransactionType;
    txSubType: string;
    suiClient: SuiClient;
    account: WalletAccount;
  }): Promise<TransactionBlock> {
    const { suiClient, account } = input;
    console.log('helper build input: ', input);
    console.log('helper build input.intentionData: ', input.intentionData);
    console.log('helper build input.intentionData JSON: ', JSON.stringify(input.intentionData));
    let intention: CetusIntention;
    switch (input.txSubType) {
      case TransactionSubType.OpenAndAddLiquidity:
        intention = AddLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.IncreaseLiquidity:
        intention = IncreaseLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.DecreaseLiquidity:
        intention = DecreaseLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.RemoveLiquidity:
        intention = RemoveLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.ClaimFeeAndMining:
        intention = ClaimFeeAndMiningIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingOpenAndAddLiquidity:
        intention = FarmingAddLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingIncreaseLiquidity:
        intention = FarmingIncreaseLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingDecreaseLiquidity:
        intention = FarmingDecreaseLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingRemoveLiquidity:
        intention = FarmingRemoveLiquidityIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingClaimFeeAndReward:
        intention = FarmingClaimFeeAndRewardIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingHarvest:
        intention = FarmingHarvestIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingBatchHarvest:
        intention = FarmingBatchHarvestIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingStake:
        intention = FarmingStakeIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.FarmingUnstake:
        intention = FarmingUnstakeIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.xCETUSConvert:
        intention = XcetusConvertIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.xCETUSRedeemLock:
        intention = XcetusRedeemLockIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.xCETUSClaimStakingRwewards:
        intention = XcetusClaimingStakeRewardsIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.xCETUSCancelRedeem:
        intention = XcetusCancelIntention.fromData(input.intentionData);
        break;
      case TransactionSubType.xCETUSRedeem:
        intention = XcetusRedeemIntention.fromData(input.intentionData);
        break;
      default:
        throw new Error('not implemented');
    }
    return intention.build({ suiClient, account });
  }
}
