import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { useRecords } from "../utilities/RecordsContext";
import useStats from "../utilities/useStats";

function daysUntilDate(date: Date): number {
    const today = new Date();
    const timeDifference = date.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
}

function isWithinXDays(date: Date, x: number): boolean {
    return daysUntilDate(date) <= x;
}

function WarningCallout({
    days,
    label,
    active,
}: {
    readonly days: number;
    readonly label: string;
    readonly active: boolean;
}) {
    if (!active) return null;
    return (
        <Callout.Root>
            <Callout.Icon>
                <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
                You have {days} days to use your remaining {label}.
            </Callout.Text>
        </Callout.Root>
    );
}

function UsageWarning() {
    const { settings } = useRecords();
    const stats = useStats();

    const yearEndDate = new Date("2025-12-31");

    return (
        <>
            <WarningCallout
                days={daysUntilDate(new Date(settings.carryoverDeadline))}
                label="floating holidays"
                active={isWithinXDays(
                    new Date(settings.carryoverDeadline),
                    stats.carryover.remaining * 4
                )}
            />
            <WarningCallout
                days={daysUntilDate(yearEndDate)}
                label="floating holidays"
                active={isWithinXDays(yearEndDate, stats.floatingHolidays.remaining * 4)}
            />
            <WarningCallout
                days={daysUntilDate(yearEndDate)}
                label="vacation days"
                active={isWithinXDays(
                    yearEndDate,
                    Math.min(stats.vacation.remaining - settings.carryoverLimit, 0) * 4
                )}
            />
        </>
    );
}

export default UsageWarning;
