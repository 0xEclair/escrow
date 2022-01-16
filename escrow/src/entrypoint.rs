use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};
use crate::processor::Processor;

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    Processor::process(program_id, accounts, instruction_data)
}

entrypoint!(process_instruction);

// 试用程序，了解爱丽丝的交易