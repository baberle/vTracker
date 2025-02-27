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
    warningPeriod: number;
}

const settingKeys = [
    "vacationDays",
    "carryoverLimit",
    "sickLimit",
    "carryoverDeadline",
    "carryoverDays",
    "floatingHolidays",
    "warningPeriod",
];

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
    for (const key of settingKeys) {
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

export async function exportToJson(): Promise<object> {
    const db = await vacationRecords;
    const txSettings = db.transaction("settings", "readonly");

    // Export Settings
    const settings: Partial<Settings> = {};
    for (const key of settingKeys) {
        const setting = await txSettings.store.get(key);
        if (setting) {
            settings[key as keyof Settings] = setting.value;
        }
    }
    await txSettings.done;

    // Export Records
    const txRecords = db.transaction("records", "readonly");
    const records = await txRecords.store.getAll();
    await txRecords.done;

    return {
        version: db.version,
        records,
        settings,
    };
}

export async function importFromJson(data: {
    version: number;
    records: Record[];
    settings: Partial<Settings>;
}): Promise<void> {
    const db = await vacationRecords;

    // Check DB version
    if (data.version !== db.version) {
        throw new Error(`Database version mismatch: expected ${db.version}, got ${data.version}`);
    }

    // Import Settings
    const txSettings = db.transaction("settings", "readwrite");
    for (const [key, value] of Object.entries(data.settings)) {
        await txSettings.store.put({ id: key, value });
    }
    await txSettings.done;

    // Import Records
    const txRecords = db.transaction("records", "readwrite");
    for (const record of data.records) {
        await txRecords.store.put(record);
    }
    await txRecords.done;
}
