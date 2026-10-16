import type { Debt } from "../types/debt";
import { addMonths } from "./date";

const MAX_MONTHS = 1200; //100 years: anything longer is treated as never paid off

const roundCents = (n: number) => Math.round(n * 100) / 100;

//Fixed monthly payment that pays off a loan in termMonths. With a 0% promo, the first
//promoMonths payments are interest-free and the rest amortize what's left at the full APR:
//payment = P·A / (1 + promo·A), where A is the standard annuity factor for the remaining months.
export function amortizedPayment(principal: number, apr: number, termMonths: number, promoMonths = 0): number {
    if (principal <= 0 || termMonths <= 0) return 0;
    const promo = Math.min(Math.max(promoMonths, 0), termMonths);
    const remainingMonths = termMonths - promo;
    const rate = apr / 100 / 12;
    if (remainingMonths === 0) return roundCents(principal / termMonths);
    const annuity = rate === 0 ? 1 / remainingMonths : rate / (1 - Math.pow(1 + rate, -remainingMonths));
    return roundCents((principal * annuity) / (1 + promo * annuity));
}

export interface PayoffResult {
    paysOff: boolean; //false when, once full-rate interest kicks in, the payment doesn't cover it
    months: number;
    totalInterest: number;
    totalPaid: number;
    interestAtFullRate: number; //monthly interest on the balance when the full APR starts
    balanceAfterPromo: number; //what's still owed when a 0% promo ends (0 without a promo)
}

const NEVER = { paysOff: false, months: Infinity, totalInterest: Infinity, totalPaid: Infinity } as const;

//Month-by-month simulation: interest accrues on the balance (none during the promo), then the payment comes off.
export function simulatePayoff(balance: number, apr: number, monthlyPayment: number, promoMonths = 0): PayoffResult {
    const rate = apr / 100 / 12;
    let remaining = balance;
    let months = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    let balanceAfterPromo = 0;
    let interestAtFullRate = roundCents(balance * rate);

    if (balance <= 0) return { paysOff: true, months: 0, totalInterest: 0, totalPaid: 0, interestAtFullRate: 0, balanceAfterPromo: 0 };
    if (monthlyPayment <= 0) return { ...NEVER, interestAtFullRate, balanceAfterPromo: balance };

    while (remaining > 0.005 && months < MAX_MONTHS) {
        const inPromo = months < promoMonths;
        if (months === promoMonths && promoMonths > 0) {
            balanceAfterPromo = remaining;
            interestAtFullRate = roundCents(remaining * rate);
        }
        const interest = inPromo ? 0 : roundCents(remaining * rate);
        if (!inPromo && monthlyPayment <= interest) {
            return { ...NEVER, interestAtFullRate: interest, balanceAfterPromo };
        }
        remaining += interest;
        const payment = Math.min(monthlyPayment, remaining);
        remaining = roundCents(remaining - payment);
        totalInterest += interest;
        totalPaid += payment;
        months++;
    }

    if (remaining > 0.005) return { ...NEVER, interestAtFullRate, balanceAfterPromo };
    return {
        paysOff: true,
        months,
        totalInterest: roundCents(totalInterest),
        totalPaid: roundCents(totalPaid),
        interestAtFullRate,
        balanceAfterPromo: roundCents(balanceAfterPromo),
    };
}

export function simulateDebt(debt: Debt, extraPerMonth = 0): PayoffResult {
    return simulatePayoff(debt.balance, debt.apr, debt.monthlyPayment + extraPerMonth, debt.promoMonths ?? 0);
}

//Date of payment number `months` (the 1st payment is on firstPaymentDate).
export function payoffDate(firstPaymentDate: string, months: number): string {
    return addMonths(firstPaymentDate, Math.max(months - 1, 0));
}

//Monthly payment that clears a balance before a 0% promo ends.
export function payoffWithinPromo(balance: number, promoMonths: number): number {
    return promoMonths > 0 ? Math.ceil((balance / promoMonths) * 100) / 100 : 0;
}

export function formatDuration(months: number): string {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts = [];
    if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (rest || !years) parts.push(`${rest} mo`);
    return parts.join(" ");
}
