import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { useRecords } from "../utilities/RecordsContext";

function daysUntilDate(date: Date): number {
    const today = new Date();
    const timeDifference = date.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
}

function isWithinXDays(date: Date, x: number): boolean {
    return daysUntilDate(date) <= x;
}

export function WarningCallout({
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
    const { settings, stats } = useRecords();

    const currentYear = new Date().getFullYear();
    const yearEndDate = new Date(currentYear, 11, 31);

    return (
        <>
            <WarningCallout
                days={daysUntilDate(new Date(settings.carryoverDeadline))}
                label="carryover days"
                active={isWithinXDays(
                    new Date(settings.carryoverDeadline),
                    stats.carryover.remaining * settings.warningPeriod
                )}
            />
            <WarningCallout
                days={daysUntilDate(yearEndDate)}
                label="floating holidays"
                active={isWithinXDays(
                    yearEndDate,
                    stats.floatingHolidays.remaining * settings.warningPeriod
                )}
            />
            <WarningCallout
                days={daysUntilDate(yearEndDate)}
                label="vacation days"
                active={isWithinXDays(
                    yearEndDate,
                    Math.min(stats.vacation.remaining - settings.carryoverLimit, 0) *
                        settings.warningPeriod
                )}
            />
        </>
    );
}

export default UsageWarning;
