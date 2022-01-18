use solana_program::program_error::ProgramError;
use std::convert::TryInto;

use crate::error::EscrowError;

pub enum Instruction {
    InitEscrow {
        amount: u64
    },
    Exchange {
        amount: u64
    }
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Instruction, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(EscrowError::FeiFaZhiLing)?;

        Ok(match tag {
            0 => Self::InitEscrow {
                amount: Self::unpack_amount(rest)?
            },
            1 => Self::Exchange {
                amount: Self::unpack_amount(rest)?
            },
            _ => return Err(EscrowError::FeiFaZhiLing.into())
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount =
            input.get(..8)
                .and_then(|slice| slice.try_into().ok())
                .map(u64::from_le_bytes)
                .ok_or(EscrowError::FeiFaZhiLing)?;
        Ok(amount)
    }
}