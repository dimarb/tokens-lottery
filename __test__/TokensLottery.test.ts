import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import { TokensLotteryClient } from '../contracts/clients/TokensLotteryClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: TokensLotteryClient;
let algodClient: algosdk.Algodv2;
let appId: number;

describe('Simulación del contrato inteligente TokensLottery', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    // Creador de la Aplicación
    const { testAccount } = fixture.context;
    const { algorand } = fixture;
    algodClient = algorand.client.algod;
    appClient = new TokensLotteryClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    const resutl = await appClient.create.createApplication({});
    appClient.appClient.fundAppAccount(algokit.microAlgos(250_000));
    appId = Number(resutl.appId);
  });

  test('Emision de Billetes de Loteria', async () => {
    const assetId = await appClient.emitTicket(
      { name: 'Loteria', unitName: 'Billete', quantity: 1000, cost: 100_000 },
      { sendParams: { fee: algokit.microAlgos(12_000) } }
    );
    expect(assetId).not.toBeUndefined();
  });
  test('Venta de Billetes de Loteria', async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    const suggestedParams = await algodClient.getTransactionParams().do();
    suggestedParams.fee = 100;

    const method = {
      name: 'seellTicket',
      args: [
        {
          name: 'quantity',
          type: 'uint64',
        },
      ],
      returns: {
        type: 'void',
      },
    };

    console.log('Receiber Account', testAccount.addr);

    const txn = algosdk.makeApplicationCallTxnFromObject({
      from: testAccount.addr,
      appIndex: appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [new algosdk.ABIMethod(method).getSelector(), new Uint8Array(2)],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(testAccount.sk);
    const txId = await algodClient.sendRawTransaction(signedTxn).do();
    console.log('Transaction created:', txId);
  });
});
