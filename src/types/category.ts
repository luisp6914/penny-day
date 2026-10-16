import type { TransactionType } from "./transaction";

export type Category = {
    id: number;
    name: string;
    color: string;
    types: readonly TransactionType[]; //transaction types this category can be picked for
}
