import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import { TokensLotteryClient } from '../contracts/clients/TokensLotteryClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: TokensLotteryClient;
let algodClient: algosdk.Algodv2;
let buyerAccount: algosdk.Account;
let assetId: number;
let contractAddress: string;
let transactionWithSigner: algosdk.TransactionWithSigner;
const tokenConfig = { name: 'Lottery', unitName: 'Bill', quantity: 1000, cost: 100_000, sell: 1 };

describe('Simulate Smart Contract TokensLottery', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
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

    const result = await appClient.create.createApplication({});
    await appClient.appClient.fundAppAccount(algokit.microAlgos(250_000));
    contractAddress = result.appAddress;
  });

  test('Emit Tokens', async () => {
    const result = await appClient.emitTicket(
      {
        name: tokenConfig.name,
        unitName: tokenConfig.unitName,
        quantity: tokenConfig.quantity,
        cost: tokenConfig.cost,
      },
      { sendParams: { fee: algokit.microAlgos(12_000) } }
    );
    assetId = Number(result.return);
    expect(assetId).not.toBeUndefined();
  });

  test('Token OptIn', async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    buyerAccount = testAccount;
    await algokit.assetOptIn({ assetId, account: buyerAccount }, algodClient);

    const suggestedParams = await algodClient.getTransactionParams().do();

    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: buyerAccount.addr,
      to: contractAddress,
      amount: tokenConfig.cost * tokenConfig.sell + 1,
      suggestedParams,
    });
    transactionWithSigner = {
      txn: paymentTxn,
      signer: algosdk.makeBasicAccountTransactionSigner(buyerAccount),
    };
    expect(transactionWithSigner).not.toBeUndefined();
  });

  test('Sell Lottery Ticket', async () => {
    await fixture.beforeEach();
    const suggestedParams = await algodClient.getTransactionParams().do();
    suggestedParams.fee = 1000;
    const result = await appClient.call({
      method: 'transferLottery',
      methodArgs: [transactionWithSigner, tokenConfig.sell],
      sendParams: { fee: algokit.microAlgos(12_000) },
    });
    expect(result).not.toBeUndefined();
  });
});
