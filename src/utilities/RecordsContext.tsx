import React, { createContext, useContext, useEffect, useState } from "react";
import {
    addRecord,
    deleteRecord,
    getRecords,
    updateRecord,
    Settings,
    updateSettings,
    getSettings,
} from "./db";
import { Record } from "./mock";

interface RecordsContextProps {
    settings: Settings;
    records: Record[];
    addRecord: (record: Record) => Promise<void>;
    updateRecord: (date: string, updatedRecord: Partial<Record>) => Promise<void>;
    deleteRecord: (date: string) => Promise<void>;
    updateSettings: (settings: Partial<Settings>) => Promise<void>;
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

    useEffect(() => {
        refreshRecords();
        refreshSettings();
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

    const contextValue = React.useMemo(
        () => ({
            settings,
            records,
            addRecord: handleAddRecord,
            updateRecord: handleUpdateRecord,
            deleteRecord: handleDeleteRecord,
            updateSettings: handleUpdateSettings,
        }),
        [settings, records]
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
