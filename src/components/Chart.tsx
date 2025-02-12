import { Box, Card, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useRecords } from "../utilities/RecordsContext";
import { RecordType } from "../utilities/db";
import { getMonthNumber } from "../utilities/utils";

function Chart() {
    const { records, settings } = useRecords();

    const totalVacationHours =
        settings.vacationDays * 8 + settings.carryoverDays * 8 + settings.floatingHolidays * 8;

    const recordHistoryByMonth = useMemo(() => {
        const months = Array.from({ length: 12 }, () => 0);
        records.forEach((record) => {
            if (
                record.type === RecordType.Leave ||
                record.type === RecordType.Unpaid ||
                record.type === RecordType.Sick
            )
                return;
            const date = new Date(record.date);
            const month = date.getMonth();
            months[month] += record.hours;
        });

        let remainingAmount = totalVacationHours;
        const remainingHoursByMonth = months.map((hours, index) => {
            remainingAmount -= hours;
            return { month: index + 1, remaining: remainingAmount };
        });

        return remainingHoursByMonth;
    }, [records, settings]);

    const usedVacationHours = useMemo(() => {
        return records.reduce((acc, record) => {
            if (
                record.type === RecordType.Leave ||
                record.type === RecordType.Unpaid ||
                record.type === RecordType.Sick
            )
                return acc;
            return acc + record.hours;
        }, 0);
    }, [records]);

    return (
        <Card>
            <Box position="absolute" right="4">
                <Text color={totalVacationHours - usedVacationHours < 0 ? "red" : "gray"} size="2">
                    {((usedVacationHours / totalVacationHours) * 100).toFixed(0)}%
                </Text>
            </Box>
            <ResponsiveContainer width={"100%"} height={150}>
                <AreaChart data={recordHistoryByMonth}>
                    <defs>
                        <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-track)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--accent-track)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis type="number" domain={[0, totalVacationHours]} hide />
                    <XAxis dataKey="month" type="number" domain={[1, 12]} hide />
                    <ReferenceLine
                        x={getMonthNumber(new Date())}
                        stroke="grey"
                        strokeDasharray="3 3"
                    />
                    <ReferenceLine
                        x={getMonthNumber(new Date(settings.carryoverDeadline))}
                        stroke="var(--red-a9)"
                        strokeDasharray="3 3"
                    />
                    {/* Carryover limit
                        {settings.carryoverLimit >= 0 && (
                        <ReferenceLine
                            y={settings.carryoverLimit * 8}
                            stroke="red"
                            opacity={0.25}
                        />
                    )} */}
                    <Area
                        type="monotone"
                        dataKey="remaining"
                        stroke="var(--accent-track)"
                        strokeWidth={2}
                        fill="url(#colorRemaining)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default Chart;
