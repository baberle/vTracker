enum RecordType {
    Vacation = "vacation",
    Sick = "sick",
    Leave = "leave",
    Unpaid = "unpaid",
}

interface Record {
    date: string;
    label: string;
    type: RecordType;
    hours: 4 | 8;
}

const typeLabelMap: { [key in RecordType]: string } = {
    [RecordType.Vacation]: "Vacation",
    [RecordType.Sick]: "Sick",
    [RecordType.Leave]: "Leave",
    [RecordType.Unpaid]: "Unpaid",
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

export { mockRecords, RecordType, typeLabelMap };
export type { Record };
