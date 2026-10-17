//What the user had in their account on a given day; current balance and spending power start here.
export interface StartingBalance {
    amount: number;
    asOf: string; //"YYYY-MM-DD"
    //Occurrence keys whose money was already in `amount` when it was saved. Older saved balances
    //don't have this; for them, anything marked done on or before `asOf` counts as included.
    included?: string[];
}
