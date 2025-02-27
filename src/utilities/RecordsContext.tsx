import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
    addRecord,
    deleteRecord,
    getRecords,
    updateRecord,
    Settings,
    updateSettings,
    getSettings,
    RecordType,
} from "./db";
import { Record } from "./mock";

interface StatsSection {
    total: number;
    used: number;
    remaining: number;
}

interface Stats {
    vacation: StatsSection;
    sick: StatsSection;
    carryover: StatsSection;
    floatingHolidays: StatsSection;
}

interface RecordsContextProps {
    settings: Settings;
    records: Record[];
    stats: Stats;
    addRecord: (record: Record) => Promise<void>;
    updateRecord: (date: string, updatedRecord: Partial<Record>) => Promise<void>;
    deleteRecord: (date: string) => Promise<void>;
    updateSettings: (settings: Partial<Settings>) => Promise<void>;
    refresh: () => Promise<void>;
}

const RecordsContext = createContext<RecordsContextProps | undefined>(undefined);

interface RecordsProviderProps {
    children: React.ReactNode;
}

const defaultSettings = {
    vacationDays: 15,
    carryoverLimit: 5,
    carryoverDays: 5,
    carryoverDeadline: new Date(2025, 2, 31).toISOString().split("T")[0],
    sickLimit: 6,
    floatingHolidays: 2,
    warningPeriod: 4,
};

export const RecordsProvider: React.FC<RecordsProviderProps> = ({ children }) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    const refreshRecords = async () => {
        const allRecords = await getRecords();
        setRecords(allRecords);
    };

    const refreshSettings = async () => {
        const allSettings = await getSettings();
        setSettings({ ...defaultSettings, ...allSettings });
    };
    const refresh = async () => {
        await refreshRecords();
        await refreshSettings();
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleAddRecord = async (record: Record) => {
        await addRecord(record);
        await refreshRecords();
    };

    const handleUpdateRecord = async (date: string, updatedRecord: Partial<Record>) => {
        await updateRecord(date, updatedRecord);
        await refreshRecords();
    };

    const handleDeleteRecord = async (date: string) => {
        await deleteRecord(date);
        await refreshRecords();
    };

    const handleUpdateSettings = async (settings: Partial<Settings>) => {
        await updateSettings(settings);
        await refreshSettings();
    };

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

    const contextValue = useMemo(
        () => ({
            settings,
            records,
            stats,
            addRecord: handleAddRecord,
            updateRecord: handleUpdateRecord,
            deleteRecord: handleDeleteRecord,
            updateSettings: handleUpdateSettings,
            refresh,
        }),
        [settings, records, stats]
    );

    return <RecordsContext.Provider value={contextValue}>{children}</RecordsContext.Provider>;
};

export const useRecords = (): RecordsContextProps => {
    const context = useContext(RecordsContext);
    if (!context) {
        throw new Error("useRecords must be used within a RecordsProvider");
    }
    return context;
};
