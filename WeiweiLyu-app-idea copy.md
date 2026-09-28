# SaveTogether

## One-Sentence Summary

SaveTogether is a web app where students keep a private savings ledger and, separately, join group plans with friends to record shared progress—without mixing the two pots of money.

## The Problem

Students may want a private goal (a trip, a laptop) and also save toward something with friends. They need two clearly separate ledgers: one only they can see, and one where members can see what the group actually recorded. Motivation should come from a planned savings rhythm (daily, weekly, or monthly) without pretending that a plan has already been saved.

## User Types

- Registered users: Anyone can create an account, manage a private ledger, and create or join a group plan.
- Plan creators: Registered users who can edit or delete the group plans they create.

## Core Features

- **Private ledger:** Create, view, edit, and delete private goals (name, target amount in USD). Only the owner can see the goal name, target, confirmed records, remaining amount, and progress.
- **Private records:** Add, view, edit, and delete confirmed savings records (amount, date, optional note). Actual saved total, remaining, and progress come only from these records.
- **Group plans:** Create a shared plan (title, description, invite code) or join with a code. Leave a plan. The creator can edit or delete it.
- **Group records:** Members add confirmed records *inside that plan only*. Members can see those records and the combined confirmed total for the plan. They cannot see anyone’s private goals or private records.
- **Separate pots:** Private records and group records never copy into each other automatically. The same contribution must never be counted twice.
- **Planned path (private calculator):** Each user can set a planned amount on a daily, weekly, or monthly cadence with a start date **on their own private goals**. The app shows **projected savings for one year from that start date** (daily × 365, weekly × 52, monthly × 12) only to that user. Other members must not see anyone’s planned amount, frequency, start date, or personal annual projection. Shared screens must not show a combined annual projection.
- **Projected vs confirmed:** A schedule never increases the actual total by itself. Only a user-confirmed record counts as money saved. Store schedules only on owner-only private goal rows—never on a plan row that every member can read.

The first version only tracks money users have already set aside elsewhere. It does not hold or transfer money, connect to banks, automatically deduct payments, upload files, or use AI. A group plan is not linked to a private goal. Updates appear after saving or refreshing; live collaboration is not required.

Visual identity: original student-planner / two-ledger wording (Private ledger, Group plan, Planned path, Confirmed saved). Do not copy Alipay 小荷包 (or similar payment-wallet) interface, branding, or assets.

## What Users See

### Screen 1: Sign Up / Log In

Users create an account with a display name, email, and password, or log in to their existing account.

### Screen 2: Private ledger

A private dashboard lists the user’s goals with target amounts, **confirmed saved** vs **planned-path projection**, remaining toward the target, and a progress bar based only on confirmed records. Users add a goal (including optional schedule) and open a goal to manage records.

### Screen 3: Group plans

Users see plans they created or joined, create a plan, or enter an invite code. Each card shows the title and the group’s confirmed total (not anyone’s private ledger).

### Screen 4: Plan details

Members see the description, member display names, the list of confirmed group records, and the **combined confirmed saved**. They add, edit, or delete their own group records. They do not see anyone’s planned amount, frequency, start date, personal annual projection, or a combined annual projection. Private goal names and private records never appear here.

## Example Scenario

1. Weiwei creates an account and a private goal called “Japan Trip” with a target of $500. She sets a planned path of $10 per week starting today. The screen shows a one-year projection of $520 and confirmed saved of $0.
2. She confirms $50 she already set aside in her private ledger. Confirmed saved becomes $50 (10% of the $500 target). The weekly plan does not add extra dollars by itself.
3. She creates a group plan called “Spring picnic fund” and shares the invite code with Emma. She does not put a weekly schedule on the plan (schedules stay on her private ledger only).
4. Emma joins. Both see member names. Neither sees the other’s planned path or annual projection. There is no combined projection on the plan.
5. Weiwei confirms $20 toward the picnic fund (optional note: “Packed lunch this week”). Emma sees that $20 and the group confirmed total. Emma cannot see “Japan Trip,” $500, the private $50, or Weiwei’s $10/week plan.
6. Weiwei edits the private $50 record to $40. Only the private ledger changes. The picnic fund total stays $20.
