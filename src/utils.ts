import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import * as fs from "fs"
// @ts-ignore
import * as BufferLayout from "buffer-layout"

export const LogError = (msg: string) => {
  console.log(`\x1b[31m${msg}\x1b[0m`)
}

export const WritePublicKey = (publicKey: PublicKey, name: string) => {
  fs.writeFileSync(
    `./keys/${name}_pub.json`,
    JSON.stringify(publicKey.toString())
  )
}

export const GetPublicKey = (name: string) => new PublicKey(
  JSON.parse(fs.readFileSync(`./keys/${name}_pub.json`) as unknown as string)
)

export const GetPrivateKey = (name: string) => Uint8Array.from(
  JSON.parse(fs.readFileSync(`./keys/${name}.json`) as unknown as string)
)

export const GetKeypair = (name: string) => new Keypair({
  publicKey: GetPublicKey(name).toBytes(),
  secretKey: GetPrivateKey(name)
})

export const GetProgramId = () => {
  try {
    return GetPublicKey("program")
  }
  catch (e) {
    LogError("Given program id is missing or incorrect")
    process.exit(100)
  }
}

export const GetTerms = () : {
  aliceExpectedAmount: number,
  bobExpectedAmount: number
} => {
  return JSON.parse(fs.readFileSync(`./terms.json`) as unknown as string)
}

export const GetTokenBalance = async (pubkey: PublicKey, connection: Connection) => {
  return parseInt(
    (await connection.getTokenAccountBalance(pubkey)).value.amount
  )
}

const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property)
}

const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property)
}

export const ESCROW_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("initializerPubkey"),
  publicKey("initializerTempTokenAccountPubkey"),
  publicKey("initializerReceivingTokenAccountPubkey"),
  uint64("expectedAmount"),
]);

export interface EscrowLayout {
  isInitialized: number;
  initializerPubkey: Uint8Array;
  initializerReceivingTokenAccountPubkey: Uint8Array;
  initializerTempTokenAccountPubkey: Uint8Array;
  expectedAmount: Uint8Array;
}