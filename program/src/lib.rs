use anchor_lang::prelude::*;
// use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod defilend {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        let lending_pool = &mut ctx.accounts.lending_pool;
        lending_pool.total_supplied = 0;
        lending_pool.total_borrowed = 0;
        lending_pool.interest_rate_model = "simple".to_string();
        Ok(())
    }

    pub fn supply(ctx: Context<Supply>, amount: u64) -> Result<()> {
        let lending_pool = &mut ctx.accounts.lending_pool;
        let user_deposit = &mut ctx.accounts.user_deposit;

        // Update pool totals
        lending_pool.total_supplied = lending_pool
            .total_supplied
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        // Update user deposit
        user_deposit.amount = user_deposit
            .amount
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        user_deposit.token_type = "SOL".to_string();

        Ok(())
    }

    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
        let lending_pool = &mut ctx.accounts.lending_pool;
        let user_deposit = &mut ctx.accounts.user_deposit;

        // Check if user has sufficient collateral
        require!(
            user_deposit.amount >= amount,
            ErrorCode::InsufficientCollateral
        );

        // Update pool totals
        lending_pool.total_borrowed = lending_pool
            .total_borrowed
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }

    pub fn repay(ctx: Context<Repay>, amount: u64) -> Result<()> {
        let lending_pool = &mut ctx.accounts.lending_pool;

        // Update pool totals
        lending_pool.total_borrowed = lending_pool
            .total_borrowed
            .checked_sub(amount)
            .ok_or(ErrorCode::Underflow)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let user_deposit = &mut ctx.accounts.user_deposit;

        // Check if withdrawal would leave insufficient collateral
        require!(
            user_deposit.amount >= amount,
            ErrorCode::InsufficientCollateral
        );

        // Update user deposit
        user_deposit.amount = user_deposit
            .amount
            .checked_sub(amount)
            .ok_or(ErrorCode::Underflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + LendingPool::INIT_SPACE,
        seeds = [b"lending_pool"],
        bump
    )]
    pub lending_pool: Account<'info, LendingPool>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Supply<'info> {
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    #[account(
        init,
        payer = user,
        space = 8 + UserDeposit::INIT_SPACE,
        seeds = [b"user_deposit", user.key().as_ref()],
        bump
    )]
    pub user_deposit: Account<'info, UserDeposit>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Borrow<'info> {
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    #[account(
        mut,
        seeds = [b"user_deposit", user.key().as_ref()],
        bump
    )]
    pub user_deposit: Account<'info, UserDeposit>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Repay<'info> {
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub lending_pool: Account<'info, LendingPool>,
    #[account(
        mut,
        seeds = [b"user_deposit", user.key().as_ref()],
        bump
    )]
    pub user_deposit: Account<'info, UserDeposit>,
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct LendingPool {
    pub total_supplied: u64,
    pub total_borrowed: u64,
    #[max_len(50)]
    pub interest_rate_model: String,
}

#[account]
#[derive(InitSpace)]
pub struct UserDeposit {
    pub amount: u64,
    #[max_len(20)]
    pub token_type: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Overflow occurred")]
    Overflow,
    #[msg("Underflow occurred")]
    Underflow,
    #[msg("Insufficient collateral")]
    InsufficientCollateral,
}
