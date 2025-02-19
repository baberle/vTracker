import { Button, Dialog, Flex, Select, Text, TextField } from "@radix-ui/themes";
import type { Record } from "../utilities/mock";
import { RecordType, typeLabelMap } from "../utilities/mock";
import { useRecords } from "../utilities/RecordsContext";
import { getLocalDate } from "../utilities/utils";

const hours = {
    8: "Full Day",
    4: "Half Day",
};

function AddDialog() {
    const { records, stats, addRecord } = useRecords();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const record = Object.fromEntries(data) as unknown as Record;
        // Make sure date doesn't conflict with another entry
        if (
            record.date &&
            !records.some(
                (entry) => entry.date === new Date(record.date).toISOString().split("T")[0]
            )
        ) {
            record.hours = Number(record.hours) as 4 | 8;
            addRecord(record);
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>Add Entry</Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth={"450px"} aria-describedby={undefined}>
                <Dialog.Title>Add Vacation Time</Dialog.Title>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Flex direction="column" gap="3" py="4">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Label
                            </Text>
                            <TextField.Root name="label" placeholder="Reason for time off" />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Date
                            </Text>
                            <TextField.Root name="date" type="date" defaultValue={getLocalDate()} />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Hours
                            </Text>
                            <Select.Root name="hours" defaultValue="8">
                                <Select.Trigger style={{ width: "33%" }} />
                                <Select.Content position="popper">
                                    {Object.entries(hours).map(([type, label]) => (
                                        <Select.Item key={type} value={type}>
                                            {label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Type
                            </Text>
                            <Select.Root
                                name="type"
                                defaultValue={
                                    stats.vacation.remaining >= 0.5
                                        ? RecordType.Vacation
                                        : stats.floatingHolidays.remaining >= 0.5
                                        ? RecordType.Holiday
                                        : stats.sick.remaining >= 0.5
                                        ? RecordType.Sick
                                        : RecordType.Leave
                                }
                            >
                                <Select.Trigger style={{ width: "33%" }} />
                                <Select.Content position="popper">
                                    <Select.Item
                                        value={RecordType.Vacation}
                                        disabled={stats.vacation.remaining < 0.5}
                                    >
                                        {typeLabelMap[RecordType.Vacation]}
                                    </Select.Item>
                                    <Select.Item
                                        value={RecordType.Holiday}
                                        disabled={stats.floatingHolidays.remaining < 0.5}
                                    >
                                        {typeLabelMap[RecordType.Holiday]}
                                    </Select.Item>
                                    <Select.Item
                                        value={RecordType.Sick}
                                        disabled={stats.sick.remaining < 0.5}
                                    >
                                        {typeLabelMap[RecordType.Sick]}
                                    </Select.Item>
                                    <Select.Item value={RecordType.Leave}>
                                        {typeLabelMap[RecordType.Leave]}
                                    </Select.Item>
                                    <Select.Item value={RecordType.Unpaid}>
                                        {typeLabelMap[RecordType.Unpaid]}
                                    </Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </label>
                    </Flex>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" aria-label="Close">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button aria-label="Submit" type="submit">
                                Add Entry
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default AddDialog;
