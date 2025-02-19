import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { useRecords } from "../utilities/RecordsContext";

function Stat({
    value,
    total,
    label,
}: {
    readonly value: number;
    readonly total: number;
    readonly label: string;
}) {
    return (
        <Box style={{ opacity: value <= 0 ? 0.5 : 1 }}>
            <Flex gap="1" align="baseline">
                <Text weight="bold" size="8" style={{ color: "var(--accent-a10)" }}>
                    {value}
                </Text>
                <Text>/</Text>
                <Text>{total}</Text>
            </Flex>
            <Text color="gray" size="2">
                {label}
            </Text>
        </Box>
    );
}

function StatsBox() {
    const { stats } = useRecords();

    return (
        <Card>
            <Grid columns="4" rows="1" gap="2" p="2">
                <Stat
                    value={stats.vacation.remaining}
                    total={stats.vacation.total}
                    label="Vacation Days"
                />
                <Stat value={stats.sick.remaining} total={stats.sick.total} label="Sick Days" />
                <Stat
                    value={stats.carryover.remaining}
                    total={stats.carryover.total}
                    label="Carryover Days"
                />
                <Stat
                    value={stats.floatingHolidays.remaining}
                    total={stats.floatingHolidays.total}
                    label="Floating Holidays"
                />
            </Grid>
        </Card>
    );
}

export default StatsBox;
