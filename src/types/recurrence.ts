export type RecurrenceFrequency = "Weekly" | "Biweekly" | "Monthly";
export type MonthlyAnchor = "DayOfMonth" | "FirstDay" | "LastDay";

interface WeeklyRecurrence{
    frequency: "Weekly" | "Biweekly"; //Biweekly = every 2 weeks
    dayOfWeek: number; //0-6(Sun-Sat)
}

export interface MonthlyAnchorConfig{
    anchor: MonthlyAnchor;
    dayOfMonth?: number; //only present when "DayOfMonth"; clamped to the month's last day
}

interface MonthlyRecurrence{
    frequency: "Monthly";
    anchors: MonthlyAnchorConfig[]; //two anchors = twice a month (e.g. 1st & 15th)
}

export type RecurrenceRule = (WeeklyRecurrence | MonthlyRecurrence) & {
    endDate?: string; //"YYYY-MM-DD", inclusive
};
