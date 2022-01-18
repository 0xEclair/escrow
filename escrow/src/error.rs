use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum EscrowError {

    #[error("fei fa zhi ling")]
    FeiFaZhiLing,

    #[error("not rent exempt")]
    NotRentExempt,

    #[error("yu qi shu e bu yi zhi")]
    ExpectedAmountMismatch
}

impl From<EscrowError> for ProgramError {
    fn from(e: EscrowError) -> Self {
        ProgramError::Custom(1000 + (e as u32))
    }
}