import { openDB } from "idb";

export enum RecordType {
    Vacation = "vacation",
    Sick = "sick",
    Leave = "leave",
    Unpaid = "unpaid",
    Holiday = "holiday",
}

export interface Record {
    date: string;
    label: string;
    type: RecordType;
    hours: 4 | 8;
}

export interface Settings {
    vacationDays: number;
    carryoverLimit: number;
    sickLimit: number;
    carryoverDeadline: string;
    carryoverDays: number;
    floatingHolidays: number;
}

const vacationRecords = openDB("vacation-records", 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains("records")) {
            db.createObjectStore("records", { keyPath: "date" });
        }
        if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings", { keyPath: "id" });
            // Initialize with default settings
        }
    },
});

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
    const db = await vacationRecords;
    const tx = db.transaction("settings", "readwrite");
    for (const [key, value] of Object.entries(settings)) {
        await tx.store.put({ id: key, value });
    }
    await tx.done;
}

export async function getSettings(): Promise<Settings> {
    const db = await vacationRecords;
    const tx = db.transaction("settings", "readonly");
    const settings: Partial<Settings> = {};
    const keys = [
        "vacationDays",
        "carryoverLimit",
        "sickLimit",
        "carryoverDeadline",
        "carryoverDays",
        "floatingHolidays",
    ];
    for (const key of keys) {
        const setting = await tx.store.get(key);
        if (setting) {
            settings[key as keyof Settings] = setting.value;
        }
    }
    await tx.done;
    return settings as Settings;
}

export async function addRecord(record: Record): Promise<void> {
    const db = await vacationRecords;
    const tx = db.transaction("records", "readwrite");
    await tx.store.add(record);
    await tx.done;
}

// TODO Only need records for this year
export async function getRecords(): Promise<Record[]> {
    const db = await vacationRecords;
    const tx = db.transaction("records", "readonly");
    const records = await tx.store.getAll();
    await tx.done;
    return records;
}

export async function updateRecord(date: string, updatedRecord: Partial<Record>): Promise<void> {
    const db = await vacationRecords;
    const tx = db.transaction("records", "readwrite");
    const record = await tx.store.get(date);
    if (record) {
        const newRecord = { ...record, ...updatedRecord };
        if (newRecord.date !== date) {
            await tx.store.delete(date);
        }
        await tx.store.put(newRecord);
    }
    await tx.done;
}

export async function deleteRecord(date: string): Promise<void> {
    const db = await vacationRecords;
    const tx = db.transaction("records", "readwrite");
    await tx.store.delete(date);
    await tx.done;
}
