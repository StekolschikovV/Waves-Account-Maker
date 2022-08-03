import * as libCrypto from "@waves/ts-lib-crypto"
import 'dotenv/config'
import {broadcast, massTransfer} from "@waves/waves-transactions";

import {IAccount, IConfiguration, IRecipient, ITransferToken} from "./interface";
import {CsvDataService} from "./CsvDataService";


const configuration: IConfiguration = {
  contractAddress: process.env.CONTRACT_ADDRESS || null,
  contractSeed: process.env.CONTRACT_SEED || null,
  csvPath: process.env.CSV_PATH || "recipients.csv",
  isConfigured(): boolean {
    let result = true
    Object.keys(this).forEach((key) => {
      // @ts-ignore
      if (key && this[key] === null) {
        throw new Error(`${key} is not configured`)
      }
    })
    return result
  }
}

const saveObjAsCsv = (data: object[], filename: string = "recipients.csv"): void => {
  const csvData = CsvDataService.objToCsvFormat(data)
  CsvDataService.saveCsvFile(filename, csvData)
}

const generateAccounts = (count: number): IAccount[] => {
  let accounts: IAccount[] = []
  for (let i = 0; i < count; i++) {
    const seed = libCrypto.randomSeed()
    const address = libCrypto.address(seed)
    accounts.push({
      seed, address
    })
  }
  return accounts
}

const transferToRecipients = async (
  assetId: string | null,
  recipients: IRecipient[],
  attachment: string = ''
) => {
  const tx = massTransfer({
    transfers: recipients,
    attachment,
    assetId,
  }, configuration.contractSeed || '')
  return await broadcast(tx, 'https://nodes.wavesplatform.com')
    .then(() => {
      console.log('The money transfer was successful!')
      return true
    })
    .catch(err => {
      throw new Error(err)
    })

}

const wavesAccountMaker = async (numberOfRecipientsToBeGenerated: number, transferTokens: ITransferToken[]) => {

  if (!configuration.isConfigured())
    throw new Error('Configuration is not configured!')

  if (numberOfRecipientsToBeGenerated < 1)
    throw new Error('Recipient list is empty!')

  if (transferTokens.length === 0)
    throw new Error('Transfer token list is empty!')

  let recipients = generateAccounts(numberOfRecipientsToBeGenerated)
  saveObjAsCsv(recipients)

  for (const tt of transferTokens) {
    const transfers: IRecipient[] = recipients.map((r) => {
      return {
        amount: tt.amount,
        recipient: r.address
      }
    })
    await transferToRecipients(tt.assetId, transfers)
  }

}

export {wavesAccountMaker, transferToRecipients, saveObjAsCsv, configuration, CsvDataService}
