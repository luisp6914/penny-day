export type DebtKind = "Car loan" | "Student loan" | "Personal loan" | "Mortgage" | "Credit card";

export interface Debt {
    id: string;
    name: string;
    kind: DebtKind;
    balance: number; //amount owed today
    apr: number; //annual percentage rate, e.g. 9 for 9%
    termMonths?: number; //loans only: the payment is worked out from this
    monthlyPayment: number;
    promoMonths?: number; //0% APR for this many payments before the full APR applies
    firstPaymentDate: string; //"YYYY-MM-DD"; later payments land on the same day each month
    transactionId?: string; //the monthly bill this debt added to the calendar
    createdAt: string;
}

export type NewDebt = Omit<Debt, "id" | "createdAt">;
