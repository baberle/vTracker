/**
 * Gets current date for use in date input field
 */
export function getLocalDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Gets month number with days as the decimal
 */
export function getMonthNumber(date: Date): number {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), month, 0).getDate();
    return month + (day - 1) / daysInMonth;
}

type UUID = string;

interface Table {
    id: UUID;
    created: Date;
    updated: Date;
    name: string;
    description: string;
    showRowNumbers: boolean;
    columns: Record<UUID, Column>;
    views: View[];
}

interface View {
    id: UUID;
    label: string;
    description: string;
    columns: ColumnSettings[];
    filters: RowFilter[];
    groupBy: UUID;
    sortBy: UUID;
    sortOrder: "asc" | "desc";
    tableSize: "compact" | "normal" | "expanded";
    mode: "table" | "card";
    formatting: FormattingRule[]; // formats entire row (e.g. for all overdue rows, make the bg color red)
    // summary: any[];
}

interface ColumnSettings {
    columnId: UUID;
    hidden: boolean;
    width: number;
    summary: "none" | "count" | "unique" | "sum";
}

type ComparatorType =
    | "equal"
    | "notEqual"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "regex";

interface RowFilter {
    combinor: "and" | "or"; // how to combine with preview condition in filter array
    columnId: UUID;
    comparator: ComparatorType;
    value: RegExp | string;
}

interface FormattingRule {
    columnId: UUID;
    value: RegExp | string;
    comparator: ComparatorType;
    color: string; // cell/row highlight color
    // Note: Future options for data bar, color scale, icon set, etc/
}

// TODO: I think validation probably doesn't make sense.
interface ValidationRule {
    id: UUID;
    columnId: UUID;
    match: RegExp | null;
    value: string;
    comparator: "equal" | "notEqual" | "greaterThan" | "lessThan";
}

type ColumnType =
    | "string"
    | "number"
    | "boolean"
    | "select"
    | "rating"
    | "mask"
    | "attachment"
    | "datetime"
    | "note"
    | "derived";

interface Column {
    id: UUID; // column identifier
    type: ColumnType; // column type
    label: string; // column name (user defined)
    readonly: boolean; // for metadata columns
}

interface StringColumn extends Column {
    defaultValue: string; // initial cell value
    autocomplete: boolean; // suggest previously entered values
    length: number; // string length limit
    allowEmpty: boolean; // allows empty string
    unique: boolean; // values must be unique
    formatting: FormattingRule[]; // custom conditional formatting (cell bg, RegEx conditions)
    render: "plaintext" | "markdown" | "latex" | "html"; // change how the contents are rendered
}

interface NumberColumn extends Column {
    defaultValue: number; // initial cell value
    autocomplete: boolean; // suggest previously entered values
    thousandsSeparator: boolean; // adds comma every 3 digits
    separatorSchema: string; // period or comma for decimal separator (maybe combine with above)
    min: number; // minimum number
    max: number; // maximum number
    precision: number; // number of decimal places
    formatting: string; // custom conditional formatting (cell bg, RegEx contidions)
    allowEmpty: boolean; // allows null value
    prefix: string; // adds string before number (e.g. $)
    suffix: string; // adds string after number (e.g. ms)
    isKey: boolean; // values must be unique
    validate: ValidationRule[]; // custom validation schema (RegEx)
    alignment: boolean; // cell alignment (numbers (right) vs codes(left))
}

interface BooleanColumn extends Column {
    defaultValue: boolean; // initial cell value
    asString: boolean; // displays string true|false instead of checkbox
    trueValue: string; // custom truthy representation (e.g. PASSED)
    falseValue: string; // custom falsy representation (e.g. FAILED)
    allowEmpty: boolean; // allows null value (does this make sense?)
}

interface Select extends Column {
    defaultValue: string; // initial cell value
    options: string[]; // array of options
    allowEmpty: boolean; // allows null value
    asChip: boolean; // displays as chip vs plaintext
    allowNew: boolean; // allow user to dynamically add new values
    allowMultiple: boolean; // behave as a multi-select field
}

interface Rating extends Column {
    defaultValue: number; // initial cell value
    range: number; // number of stars (could also be represented by min/max)
    icon: string; // image used for "star"
    stepSize: string; // whole start, half star, any
}

interface Mask extends Column {
    defaultValue: number; // initial cell value
    maskType: string; // mask format (phone number, email, ssn, IPv4, IPv6, MAC address, credit card, zip code, color code)
    allowEmpty: boolean; // allows null value
    formatting: string; // custom cell formatting (RegEx)
    validate: ValidationRule[]; // custom validation schema (RegEx)
    maskSchema: string; // custom mmasking schema (based on maska)
    isKey: boolean; // values must be unique
}

interface Attachment extends Column {
    fileType: string; // Restrict to single file type to group (e.g. PNG or images)
    preview: boolean; // Attemps to preview attachment (mostly just images) otherwise display file name
    multiple: boolean; // Allows multiple attachments
}

interface DateTime extends Column {
    defaultValue: string; // initial cell value
    variant: string; // sets input to date, time, or datetime
    allowEmpty: boolean; // allows null value
    militaryTime: boolean; // formats time as military time
    formatting: string; // custom cell formatting (RegEx)
    validate: ValidationRule[]; // custom validation schema (RegEx)
    isUnique: boolean; // values must be unique
    format: string; // date formatting representation
    precision: string; // Include seconds or milliseconds
}

interface Note extends Column {
    variant: string; // interpret text as "plaintext" | "markdown" | "latex" | "code"
}

// TODO: Perhaps this logic should be inherent in each type
interface Derived extends Column {
    displayType: string; // formats the cell as one of the other cell types
    variant: string; // pre-defined derivations (sum, range, etc)
    formatting: string; // custom cell formatting (RegEx)
    validate: ValidationRule[]; // custom validation schema (RegEx)
    config: string; // custom code to generate output (calculation, API request, etc)
}

// link, progress bar, foreign key, geolocation, color code, countries, row reference

// formatting rules, validation rules, freeze first column

// isKey should be for display representation, isUnique should be for unique values

// maybe select field should allow foreign key values
