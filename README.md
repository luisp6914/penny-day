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

* React
* TypeScript
* Vite
* CSS
* LocalStorage

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

### Transaction

```ts
export type TransactionType = "income" | "expense" | "bill" | "savings";

export type TransactionStatus =
  | "expected"
  | "received"
  | "received-early"
  | "received-late"
  | "upcoming"
  | "paid"
  | "overdue";

export type RecurringType =
  | "none"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "twice-monthly";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  expectedDate: string;
  actualDate?: string;
  status: TransactionStatus;
  recurringType: RecurringType;
  notes?: string;
  createdAt: string;
}
```

### Category

```ts
export interface Category {
  id: string;
  name: string;
  color: string;
  monthlyLimit?: number;
}
```

### Budget Summary

```ts
export interface BudgetSummary {
  totalIncome: number;
  totalSpent: number;
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