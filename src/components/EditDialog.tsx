import { Button, Dialog, Flex, Select, Text, TextField, IconButton, Box } from "@radix-ui/themes";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Record } from "../utilities/mock";
import { RecordType, typeLabelMap } from "../utilities/mock";
import { useRecords } from "../utilities/RecordsContext";

const hours = {
    8: "Full Day",
    4: "Half Day",
};

function EditDialog({ record }: { record: Record }) {
    const { records, stats, updateRecord, deleteRecord } = useRecords();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const updatedRecord = Object.fromEntries(data) as unknown as Record;
        // Make sure date doesn't conflict with another entry
        if (
            updatedRecord.date &&
            !records.some(
                (entry) =>
                    entry.date !== record.date &&
                    entry.date === new Date(updatedRecord.date).toISOString().split("T")[0]
            )
        ) {
            updatedRecord.hours = Number(updatedRecord.hours) as 4 | 8;
            updateRecord(record.date, updatedRecord);
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <IconButton variant="ghost">
                    <DotsHorizontalIcon width="18" height="18" />
                </IconButton>
            </Dialog.Trigger>
            <Dialog.Content maxWidth={"450px"} aria-describedby={undefined}>
                <Dialog.Title>Edit Vacation Time</Dialog.Title>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Flex direction="column" gap="3" py="4">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Label
                            </Text>
                            <TextField.Root
                                name="label"
                                defaultValue={record.label}
                                placeholder="Reason for time off"
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Date
                            </Text>
                            <TextField.Root name="date" type="date" defaultValue={record.date} />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Hours
                            </Text>
                            <Select.Root name="hours" defaultValue={record.hours.toString()}>
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
                            <Select.Root name="type" defaultValue={record.type}>
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
                    <Flex gap="3" mt="4">
                        <Box flexGrow="1">
                            <Dialog.Close>
                                <Button
                                    variant="surface"
                                    color="red"
                                    onClick={() => deleteRecord(record.date)}
                                    aria-label="Delete"
                                >
                                    Delete
                                </Button>
                            </Dialog.Close>
                        </Box>
                        <Dialog.Close>
                            <Button variant="soft" color="gray" aria-label="Close">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button aria-label="Submit" type="submit">
                                Save
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default EditDialog;

// function EditDialog2({ record }: { record: Record }) {
//     // TODO: Rescrict vacation type and hours depending on existing vacation used
//     const { stats, deleteRecord } = useRecords();
//     return (
//         <Dialog.Root>
//             <Dialog.Trigger>
//                 <IconButton variant="ghost">
//                     <DotsHorizontalIcon width="18" height="18" />
//                 </IconButton>
//             </Dialog.Trigger>
//             <Dialog.Content maxWidth={"450px"}>
//                 <Dialog.Title>Edit Vacation Time</Dialog.Title>
//                 <form>
//                     <Flex direction="column" gap="3" py="4">
//                         <label>
//                             <Text as="div" size="2" mb="1" weight="bold">
//                                 Label
//                             </Text>
//                             <TextField.Root
//                                 defaultValue="Freja Johnsen"
//                                 placeholder="Reason for time off"
//                             />
//                         </label>
//                         <label>
//                             <Text as="div" size="2" mb="1" weight="bold">
//                                 Date
//                             </Text>
//                             <TextField.Root type="date" />
//                         </label>
//                         <label>
//                             <Text as="div" size="2" mb="1" weight="bold">
//                                 Hours
//                             </Text>
//                             <Select.Root defaultValue="4">
//                                 <Select.Trigger />
//                                 <Select.Content position="popper">
//                                     {Object.entries(hours).map(([type, label]) => (
//                                         <Select.Item key={type} value={type}>
//                                             {label}
//                                         </Select.Item>
//                                     ))}
//                                 </Select.Content>
//                             </Select.Root>
//                         </label>
//                         <label>
//                             <Text as="div" size="2" mb="1" weight="bold">
//                                 Type
//                             </Text>
//                             <Select.Root defaultValue="vacation">
//                                 <Select.Trigger />
//                                 <Select.Content position="popper">
//                                     <Select.Item
//                                         value={RecordType.Vacation}
//                                         disabled={stats.vacation.remaining < 0.5}
//                                     >
//                                         {typeLabelMap[RecordType.Vacation]}
//                                     </Select.Item>
//                                     <Select.Item
//                                         value={RecordType.Sick}
//                                         disabled={stats.sick.remaining < 0.5}
//                                     >
//                                         {typeLabelMap[RecordType.Sick]}
//                                     </Select.Item>
//                                     <Select.Item value={RecordType.Leave}>
//                                         {typeLabelMap[RecordType.Leave]}
//                                     </Select.Item>
//                                     <Select.Item value={RecordType.Unpaid}>
//                                         {typeLabelMap[RecordType.Unpaid]}
//                                     </Select.Item>
//                                     <Select.Item
//                                         value={RecordType.Holiday}
//                                         disabled={stats.floatingHolidays.remaining < 0.5}
//                                     >
//                                         {typeLabelMap[RecordType.Holiday]}
//                                     </Select.Item>
//                                 </Select.Content>
//                             </Select.Root>
//                         </label>
//                     </Flex>
//                     <Flex gap="3" mt="4" justify="end">
//                         <Dialog.Close>
//                             <Box flexGrow="1" asChild>
//                                 <Button
//                                     variant="surface"
//                                     color="red"
//                                     onClick={() => deleteRecord(record.date)}
//                                     aria-label="Delete"
//                                 >
//                                     Delete
//                                 </Button>
//                             </Box>
//                         </Dialog.Close>
//                         <Dialog.Close>
//                             <Button variant="soft" color="gray" aria-label="Close">
//                                 Cancel
//                             </Button>
//                         </Dialog.Close>
//                         <Dialog.Close>
//                             <Button aria-label="Submit">Save</Button>
//                         </Dialog.Close>
//                     </Flex>
//                 </form>
//             </Dialog.Content>
//         </Dialog.Root>
//     );
// }
