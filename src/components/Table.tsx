import {
    Table,
    IconButton,
    Badge,
    Dialog,
    Flex,
    Text,
    TextField,
    Button,
    Code,
} from "@radix-ui/themes";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { typeLabelMap, mockRecords } from "../utilities/mock";
import type { Record } from "../utilities/mock";

function RecordRow({ record }: { record: Record }) {
    return (
        <Table.Row>
            <Table.RowHeaderCell>
                <Badge color={new Date(record.date) > new Date() ? "gray" : "green"}>
                    {new Date(record.date) > new Date() ? "Planned" : "Used"}
                </Badge>
            </Table.RowHeaderCell>
            <Table.Cell>
                <Code variant="ghost">
                    {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                    })}
                </Code>
            </Table.Cell>
            <Table.Cell>{record.label}</Table.Cell>
            <Table.Cell>{typeLabelMap[record.type]}</Table.Cell>
            <Table.Cell align="center">
                <Dialog.Root>
                    <Dialog.Trigger>
                        <IconButton variant="ghost">
                            <DotsHorizontalIcon width="18" height="18" />
                        </IconButton>
                    </Dialog.Trigger>
                    <Dialog.Content maxWidth={"450px"}>
                        <Dialog.Title>Edit Vacation Time</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Make changes to the vacation day
                        </Dialog.Description>
                        <Flex direction="column" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Name
                                </Text>
                                <TextField.Root
                                    defaultValue="Freja Johnsen"
                                    placeholder="Enter your full name"
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Email
                                </Text>
                                <TextField.Root
                                    defaultValue="freja@example.com"
                                    placeholder="Enter your email"
                                />
                            </label>
                        </Flex>
                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button>Save</Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            </Table.Cell>
        </Table.Row>
    );
}

function RecordTable() {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Passed</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center">Edit</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {mockRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record, index) => (
                        <RecordRow key={index} record={record} />
                    ))}
                {/* <Table.Row>
                    <Table.RowHeaderCell>
                        <Badge color="green">Used</Badge>
                    </Table.RowHeaderCell>
                    <Table.Cell>Wed, Jan. 21st</Table.Cell>
                    <Table.Cell>Ski Trip</Table.Cell>
                    <Table.Cell>Vacation</Table.Cell>
                    <Table.Cell align="center">
                        <IconButton variant="ghost">
                            <DotsHorizontalIcon width="18" height="18" />
                        </IconButton>
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.RowHeaderCell>
                        <Badge color="gray">Planned</Badge>
                    </Table.RowHeaderCell>
                    <Table.Cell>Fri, Apr. 2nd</Table.Cell>
                    <Table.Cell>Day Off</Table.Cell>
                    <Table.Cell>Vacation</Table.Cell>
                    <Table.Cell align="center">
                        <IconButton variant="ghost">
                            <DotsHorizontalIcon width="18" height="18" />
                        </IconButton>
                    </Table.Cell>
                </Table.Row> */}
            </Table.Body>
        </Table.Root>
    );
}

export default RecordTable;
