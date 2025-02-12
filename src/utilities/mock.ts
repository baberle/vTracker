import { addRecord, RecordType, Record } from "./db";

const typeLabelMap: { [key in RecordType]: string } = {
    [RecordType.Vacation]: "Vacation",
    [RecordType.Sick]: "Sick",
    [RecordType.Leave]: "Leave",
    [RecordType.Unpaid]: "Unpaid",
    [RecordType.Holiday]: "Floating Holiday",
};

const mockRecords: Record[] = [
    { date: "2023-01-21", label: "Ski Trip", type: RecordType.Vacation, hours: 8 },
    { date: "2023-04-02", label: "Day Off", type: RecordType.Vacation, hours: 8 },
    { date: "2023-05-15", label: "Doctor Appointment", type: RecordType.Sick, hours: 4 },
    { date: "2025-06-10", label: "Family Event", type: RecordType.Leave, hours: 8 },
    { date: "2025-07-04", label: "Independence Day", type: RecordType.Unpaid, hours: 8 },
    { date: "2025-02-01", label: "Conference", type: RecordType.Leave, hours: 8 },
    { date: "2025-02-02", label: "Workshop", type: RecordType.Vacation, hours: 4 },
    { date: "2025-03-10", label: "Medical Checkup", type: RecordType.Sick, hours: 8 },
    { date: "2025-04-20", label: "Family Gathering", type: RecordType.Leave, hours: 8 },
    { date: "2025-05-05", label: "Holiday", type: RecordType.Unpaid, hours: 8 },
    { date: "2025-06-25", label: "Team Building", type: RecordType.Vacation, hours: 8 },
    { date: "2025-07-15", label: "Personal Day", type: RecordType.Sick, hours: 4 },
    { date: "2025-08-30", label: "Vacation Trip", type: RecordType.Vacation, hours: 8 },
    { date: "2025-09-10", label: "Training", type: RecordType.Leave, hours: 8 },
    { date: "2025-10-05", label: "Festival", type: RecordType.Unpaid, hours: 8 },
];

function addRecordsToDB() {
    mockRecords.forEach((record) => addRecord(record));
}

export function getRandomRecord(): Record {
    const start = new Date("2025-01-01").getTime();
    const end = new Date("2025-12-31").getTime();
    const randomDate = new Date(start + Math.random() * (end - start)).toISOString().split("T")[0];

    const weightedTypes = [
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Vacation,
        RecordType.Sick,
        RecordType.Holiday,
        RecordType.Holiday,
        // RecordType.Unpaid,
        // RecordType.Leave,
    ];
    const randomType = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];

    const randomHours = Math.random() > 0.5 ? 4 : 8;

    const randomLabel = typeLabelMap[randomType] + " Event";

    return {
        date: randomDate,
        label: randomLabel,
        type: randomType,
        hours: randomHours,
    };
}

// addRecordsToDB();

export { mockRecords, RecordType, typeLabelMap };
export type { Record };

// Schema ----------------------------------------------------

interface DataColumn {
    uuid: string;
    label: string;
    type: "string" | "number";
    defaultValue: string | number | boolean | Blob;
    rw: boolean;
}
// required, options, derrived?

type ColumnTypes = "string" | "number";

// Notice the table instance configuation is not added
interface TableSchema {
    metadata: TableMetadata;
    representations: {
        // These should be **default* representations that can be changed in instances
        table: object;
        card: object;
        inline: InlineRepresentation;
        embed: object;
    };
    columns: DataColumn[];
}

interface TableMetadata {
    name: string;
    description: string;
    created: Date;
    edited: Date;
}

/**
 * @example
 * For a citation, use a derrived citation field as the inline representation
 *
 * @example
 * For a book:
 * {icon: 📖, columns: ["title","author"], separator: "-"}
 * Outputs:
 * 📖 The Eye of the World - Robert Jordan
 *
 * To consider:
 * - Truncating of long values
 * - Using same icon as defined in TableMetadata, change icon to bool
 */
interface InlineRepresentation {
    icon: string;
    columns: string[];
    separator: string;
}

interface StringOptions {
    autocomplete: boolean;
    // minLength: number;
    // maxLength: number;
    // regex: RegExp;
    // isRequired: boolean;
    // markdown: boolean;
}

interface NumberOptions {
    suffix: string;
    decimalPlaces: number;
    // min: number;
    // max: number;
    // prefix: string;
}

interface Rating {
    range: number;
    // halfStars: boolean;
}

interface Progress {
    range: number;
}

// asTag makes it discoverable throughout the rest of the application as a tag
interface Select {
    options: string[];
    static: boolean;
    // asTag: boolean;
    // allTags: boolean;
}

// May want a way to have options be all tags or only specific tags
interface Tag {
    options: string[];
    static: boolean;
    // asTag: boolean;
    // allTags: boolean;
}

interface Checkbox {}

interface Mask {
    type: "phone" | "email" | "IP" | "MAC" | "ISBN" | "custom" | "none";
    regex: RegExp;
}

interface DateTime {
    date: boolean;
    time: boolean;
    format: string;
}

interface Link {
    type: "internal" | "external" | "any";
}

// Should copy on click
interface Color {
    format: "hex" | "rgba" | "etc";
    showCode: boolean;
}

interface Currency {
    currency: "$";
}

// Should image be separate?
interface File {}

/**
 * Other Ideas:
 * - Icon
 * - Timestamp
 * - Video
 * - Audio
 * - Location
 * - Address
 * - Object (from another collection)
 * - Time (like countdown)
 * - Passowrd
 * - Right side panel for aggregated values (total words, total entries)
 * - Row numbers
 * - Actions: file upload, copy as (JSON)
 * Derrived
 * - Buttons
 * - Numebr Formulas
 * - Sparklines
 * - Heatmap / Conditional coloring
 * - Map (GPX)
 * - API based data
 * - QR/Bar codes
 */

// Derrived only fields
// - chart
// - button (maybe not derrived only)

const exampleBookTableSchema = {
    columns: [
        {
            uuid: "1111",
            label: "Title",
            type: "string",
            defaultValue: "",
            rw: true,
            autocomplete: false,
        },
        {
            uuid: "1112",
            label: "Series",
            type: "string",
            defaultValue: "",
            rw: true,
            autocomplete: true,
        },
        {
            uuid: "1113",
            label: "Author",
            type: "string",
            defaultValue: "",
            rw: true,
            options: {
                autocomplete: true,
            },
        },
        {
            uuid: "1114",
            label: "Format",
            type: "select",
            defaultValue: "book",
            rw: true,
            options: {
                options: ["book", "ebook", "audiobook"],
                static: true, // user cannot add more items to select except in schema
            },
        },
        {
            uuid: "1115",
            label: "Genre",
            type: "tag",
            defaultValue: "book",
            rw: true,
            options: {
                options: ["fantasy", "fiction", "sci-fi"],
                static: false,
            },
        },
        {
            uuid: "1116",
            label: "Completed",
            type: "date",
            defaultValue: "Today",
            rw: true,
        },
    ],
};
