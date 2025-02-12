import { useMemo } from "react";
import { RecordType } from "../utilities/db";
import { useRecords } from "../utilities/RecordsContext";

function useStats() {
    const { settings, records } = useRecords();

    const stats = useMemo(() => {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const daysUsed = {
            [RecordType.Vacation]: 0,
            [RecordType.Sick]: 0,
            [RecordType.Leave]: 0,
            [RecordType.Unpaid]: 0,
            [RecordType.Holiday]: 0,
        };

        records.forEach((record) => {
            if (new Date(record.date) >= startOfYear) {
                daysUsed[record.type] += record.hours / 8;
            }
        });

        return {
            vacation: {
                total: settings.vacationDays,
                used: Math.max(daysUsed[RecordType.Vacation] - settings.carryoverDays, 0),
                remaining: Math.min(
                    settings.vacationDays + settings.carryoverDays - daysUsed[RecordType.Vacation],
                    settings.vacationDays
                ),
            },
            sick: {
                total: settings.sickLimit,
                used: daysUsed[RecordType.Sick],
                remaining: settings.sickLimit - daysUsed[RecordType.Sick],
            },
            carryover: {
                total: settings.carryoverDays,
                used: Math.min(daysUsed[RecordType.Vacation], settings.carryoverDays),
                remaining: Math.max(settings.carryoverDays - daysUsed[RecordType.Vacation], 0),
            },
            floatingHolidays: {
                total: settings.floatingHolidays,
                used: daysUsed[RecordType.Holiday],
                remaining: settings.floatingHolidays - daysUsed[RecordType.Holiday],
            },
        };
    }, [records, settings]);

    return stats;
}

export default useStats;
