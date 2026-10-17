//What the user had in their account on a given day; the weekly running balance starts here.
export interface StartingBalance {
    amount: number;
    asOf: string; //"YYYY-MM-DD"
}
