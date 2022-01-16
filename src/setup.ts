import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, LAMPORTS_PER_SOL, PublicKey, Signer } from "@solana/web3.js"
import { GetKeypair, GetPublicKey, GetTokenBalance, WritePublicKey } from "./utils.js"

const CreateMint =
  (connection: Connection, { publicKey, secretKey }: Signer): Promise<Token> => {
    return Token.createMint(
      connection,
      {publicKey, secretKey},
      publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    )
}

const SetupMint =
  async (
    name: string,
    connection: Connection,
    alicePublicKey: PublicKey,
    bobPublicKey: PublicKey,
    clientKeypair: Signer
  ): Promise<[Token, PublicKey, PublicKey]> => {
    console.log(`creating mint ${name}...`)
    const mint = await CreateMint(connection, clientKeypair)
    WritePublicKey(mint.publicKey, `mint_${name.toLowerCase()}`)

    console.log(`creating alice token account for ${name}...`)
    const aliceTokenAccount = await mint.createAccount(alicePublicKey)
    WritePublicKey(aliceTokenAccount, `alice_${name.toLowerCase()}`)

    console.log(`creating bob token account for ${name}...`)
    const bobTokenAccount = await mint.createAccount(bobPublicKey)
    WritePublicKey(bobTokenAccount, `bob_${name.toLowerCase()}`)

    return [mint, aliceTokenAccount, bobTokenAccount]
}

export const Setup = async () => {
  console.log("start setup")
  const alicePublicKey = GetPublicKey("alice")
  console.log(`alice public key ${alicePublicKey.toString()}`)
  const bobPublicKey = GetPublicKey("bob")
  const clientKeypair = GetKeypair("id")

  const connection = new Connection("https://api.devnet.solana.com", "confirmed")
  // await connection.requestAirdrop(alicePublicKey, LAMPORTS_PER_SOL * 2)
  // console.log("alice requested")
  // await connection.requestAirdrop(bobPublicKey, LAMPORTS_PER_SOL * 2)
  // console.log("bob requested")
  await connection.requestAirdrop(clientKeypair.publicKey, LAMPORTS_PER_SOL * 2)
  console.log("client requested")
  const [mintX ,aliceTokenAccountForX, bobTokenAccountForX] = await SetupMint("X", connection, alicePublicKey, bobPublicKey, clientKeypair)
  console.log("sending 50X to alice's X token account...")
  await mintX.mintTo(aliceTokenAccountForX, clientKeypair.publicKey, [], 50)

  const [mintY, aliceTokenAccountForY, bobTokenAccountForY] = await SetupMint("Y", connection, alicePublicKey, bobPublicKey, clientKeypair)
  await mintY.mintTo(bobTokenAccountForY, clientKeypair.publicKey, [], 50)

  console.log("✨setup complete✨")
  console.table([
    {
      "Alice Token Account X": await GetTokenBalance(aliceTokenAccountForX,connection),
      "Alice Token Account Y": await GetTokenBalance(aliceTokenAccountForY, connection),
      "Bob Token Account X": await GetTokenBalance(bobTokenAccountForX, connection),
      "Bob Token Account Y": await GetTokenBalance(bobTokenAccountForY, connection)
    }
  ])
  console.log("end setup")
}

Setup()