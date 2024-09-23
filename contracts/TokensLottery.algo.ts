import { Contract } from '@algorandfoundation/tealscript';

export class TokensLottery extends Contract {
  assetId = GlobalStateKey<AssetID>();

  cost = GlobalStateKey<uint64>();

  emitTicket(name: string, unitName: string, quantity: uint64, cost: uint64): AssetID {
    this.assetId.value = sendAssetCreation({
      configAssetName: name,
      configAssetUnitName: unitName,
      configAssetDecimals: 0,
      configAssetTotal: quantity,
    });
    this.cost.value = cost;
    return this.assetId.value;
  }

  transferLottery(payment: PayTxn, quantity: uint64): void {
    verifyPayTxn(payment, {
      sender: payment.sender,
      amount: { greaterThan: this.cost.value * quantity },
    });

    sendAssetTransfer({
      assetReceiver: payment.sender,
      xferAsset: this.assetId.value,
      assetAmount: quantity,
    });
  }
}
