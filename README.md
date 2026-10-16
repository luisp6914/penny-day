# PennyDay

PennyDay is a calendar-based budgeting application designed to help users plan, track, and understand their finances by date. The app allows users to organize income, bills, expenses, savings, and spending categories through a simple calendar-style interface.

## Overview

PennyDay helps users visualize their money throughout the month. Instead of only showing totals in a list, PennyDay places financial activity directly on a calendar so users can easily see when money is coming in, when bills are due, and how much they have available to spend or save.

Users can track paydays, manage recurring income, organize expenses by category, mark early or late payments, and view budget analytics such as total income, total spent, total saved, and remaining balance.

## Features

* Calendar-based budgeting interface
* Add income, expenses, bills, and savings entries
* Assign transactions to spending categories
* Track expected and actual payment dates
* Mark payments as received, early, late, paid, upcoming, or overdue
* Support for recurring paydays
* Budget preview dashboard
* Monthly income, spending, savings, and remaining balance calculations
* Category-based spending breakdown
* Local storage support for saving user data
* Responsive layout for desktop and mobile use

## Tech Stack

* React + TypeScript
* Vite
* Tailwind CSS v4
* Radix UI (dialogs, selects, radio groups)
* React Router (HashRouter)
* LocalStorage

## Project Structure

```txt
src/
  pages/              CalendarPage, BudgetPage, LoansPage (one per route)
  components/
    layout/           Navbar
    calendar/         MonthGrid, DayCell, DayPanel (expanded day), WeeklyGlance
    budget/           BudgetSummaryCards, CategoryBreakdown, MonthSwitcher
    transactions/     TransactionForm, OccurrenceItem, DeleteOccurrenceDialog, StatusBadge
    loans/            DebtForm, DebtCard
    modals/           BaseModal, TransactionFormModal, DebtFormModal
    ui/               shared inputs, segmented control, class strings
  context/            TransactionsProvider, DebtsProvider (state + localStorage)
  hooks/              useTransactions, useDebts, useOccurrences
  utils/              date, recurrence, status, budget, weekly, loans, money, storage
  types/              Transaction, RecurrenceRule, Category, Debt, BudgetSummary
  constants/          categories (per transaction type), transaction type colors
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

### Installation

Clone the repository:

```zsh
git clone https://github.com/luisp6914/pennyday.git
```

Navigate into the project folder:

```zsh
cd pennyday
```

Install dependencies:

```zsh
npm install
```

Start the development server:

```zsh
npm run dev
```

Open the local development URL in your browser.

## Core Functionality

### Calendar Budgeting

The main app interface displays a monthly calendar. Users can select a date and add financial events such as paychecks, bills, expenses, or savings.

### Transactions

Each transaction includes:

* Title
* Amount
* Type
* Category
* Expected date
* Actual date
* Status
* Recurring type
* Notes

Supported transaction types include:

* Income
* Expense
* Bill
* Savings

### Categories

Users can organize transactions into categories such as:

* Income
* Rent
* Groceries
* Gas
* Eating Out
* Bills
* Subscriptions
* Pets
* School
* Self-Care
* Savings
* Other

Categories help users understand where their money is going each month.

### Payday Tracking

PennyDay allows users to track expected paydays and actual payment dates. This is useful when income arrives earlier or later than expected.

Example:

```txt
Expected Date: Friday
Actual Date: Thursday
Status: Received Early
```

### Budget Preview

The budget preview provides a quick summary of the selected month:

* Total income
* Total spent
* Total saved
* Remaining balance

The remaining balance is calculated using:

```txt
Remaining Balance = Total Income - Total Spent - Total Saved
```

## TypeScript Models

All dates are local `"YYYY-MM-DD"` strings, so they sort and compare as text and survive LocalStorage.

### Transaction

```ts
export type TransactionType = "Income" | "Expense" | "Bill" | "Savings";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: number;
  date: string;                         // expected date, or first date of a recurring series
  recurrence?: RecurrenceRule;          // omitted for one-time transactions
  completions: Record<string, string>;  // expected date -> actual date it was paid/received
  notes?: string;
  createdAt: string;
}
```

Status is **derived**, not stored: comparing an occurrence's actual date with its expected date gives
`Received early` / `Received late` / `Paid` / `Overdue` / `Upcoming` and so on (see `utils/status.ts`).

### Recurrence

```ts
type RecurrenceRule =
  | { frequency: "Weekly" | "Biweekly"; dayOfWeek: number; endDate?: string }
  | { frequency: "Monthly"; anchors: MonthlyAnchorConfig[]; endDate?: string }; // 2 anchors = twice a month
```

### Category

```ts
export type Category = {
  id: number;
  name: string;
  color: string;
}
```

### Budget Summary

```ts
export type BudgetSummary = {
  totalIncome: number;
  totalSpent: number;   // expenses + bills
  totalSaved: number;
  remainingBalance: number;
}
```

## MVP Goals

The first version of PennyDay is complete when users can:

* View a monthly calendar
* Move between months
* Select a calendar day
* Add income
* Add expenses
* Add bills
* Add savings
* Assign transactions to categories
* Set recurring paydays
* Mark paychecks as early or late
* View total income
* View total spent
* View total saved
* View remaining balance
* Save data after refreshing the page

## Future Improvements

Potential future features include:

* User authentication
* Cloud database storage
* Budget recommendations
* Charts and visual reports
* Push notifications
* Bill reminders
* Savings goal tracker
* Debt payoff tracker
* Export to PDF or CSV
* Dark mode
* Shared household budgets

## License

This project is for educational and portfolio development purposes.