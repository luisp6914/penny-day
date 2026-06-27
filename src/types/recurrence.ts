export type RecurrenceFrequency = "Weekly" | "Monthly";
export type MonthlyAnchor = "DayOfMonth" | "FirstDay" | "LastDay";

interface WeeklyRecurrence{
    frequency: "Weekly";
    dayOfWeek: number; //0-6(Sun-Sat)
}

interface MonthlyAnchorConfig{
    anchor: MonthlyAnchor;
    dayOfMonth?: number; //only present when "DayOfMonth";
}

interface MonthlyRecurrence{
    frequency: "Monthly";
    isBiweekly: boolean;
    monthlyAnchor: MonthlyAnchorConfig[];
}

export type RecurrenceRule = WeeklyRecurrence | MonthlyRecurrence;

