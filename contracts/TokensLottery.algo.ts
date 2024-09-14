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

  // Firma el
  seellTicket(quantity: uint64): void {
    sendPayment({
      amount: 100, // Pago en microAlgos
      receiver: this.app.address,
    });

    // oppIn
    // sendAssetTransfer({
    //  assetReceiver: this.txn.sender,
    //  assetAmount: 0,
    //  xferAsset: this.assetId.value,
    // });
  }
}
