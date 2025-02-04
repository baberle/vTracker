import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { typeLabelMap } from "../utilities/mock";

function daysUntilDate(date: Date): number {
    const today = new Date();
    const timeDifference = date.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
}

function isWithinXDays(date: Date, x: number): boolean {
    return daysUntilDate(date) <= x;
}

// Carryover Warning: {days used} >= {carryover days} by {carryover deadline}
// Vacation Warning: {remaining days} <= {carryover limit} by {vacation deadline}
// Floating Holidays Warning: {floating holidays used} == {floating holidays available} by {floating holidays deadline}

function UsageWarning() {
    const timeUntilDeadline = 5;
    const warningType = "vacation days";

    // TODO: Will two warning be shown at once?
    // TODO: Convert to hours to allow for half days
    const remainingDays = 5;
    const deadline = new Date("2023-12-31");
    const isWithinWarningPeriod = isWithinXDays(deadline, remainingDays * 4);

    if (!isWithinWarningPeriod) return null;

    return (
        <Callout.Root>
            <Callout.Icon>
                <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
                You have {daysUntilDate(deadline)} days to use your remaining {warningType}.
            </Callout.Text>
        </Callout.Root>
    );
}

export default UsageWarning;
