import { Badge, Box, Code, Flex, Heading, Table } from "@radix-ui/themes";
import type { Record } from "../utilities/mock";
import { typeLabelMap } from "../utilities/mock";
import { useRecords } from "../utilities/RecordsContext";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";

function RecordRow({ record }: { record: Record }) {
    const [year, month, day] = record.date.split("-").map(Number);
    const recordDate = new Date(year, month - 1, day);

    console.log({
        recordDate: record.date,
        date: new Date(record.date),
    });

    return (
        <Table.Row>
            <Table.RowHeaderCell>
                <Badge color={recordDate > new Date() ? "gray" : "green"}>
                    {recordDate > new Date() ? "Planned" : "Used"}
                </Badge>
            </Table.RowHeaderCell>
            <Table.Cell>
                <Code variant="ghost">
                    {recordDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                    })}
                </Code>
            </Table.Cell>
            <Table.Cell>{record.label}</Table.Cell>
            <Table.Cell>{typeLabelMap[record.type]}</Table.Cell>
            <Table.Cell align="center">
                <EditDialog record={record} />
            </Table.Cell>
        </Table.Row>
    );
}

function RecordTable() {
    const { records } = useRecords();

    const tableRows = records
        .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((record) => <RecordRow key={record.date} record={record} />);

    return (
        <>
            <Box>
                <Flex justify="between" align="center">
                    <Heading as="h1" size="6">
                        History
                    </Heading>
                    <AddDialog />
                </Flex>
            </Box>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell align="center">Edit</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {tableRows}
                    {tableRows.length === 0 && (
                        <Table.Row>
                            <Table.Cell colSpan={5}>
                                <Flex align="center" justify="center" p="4">
                                    No vacation days recorded
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </>
    );
}

export default RecordTable;
