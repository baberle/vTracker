import { Card, Box, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import {
    Area,
    AreaChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
    ReferenceDot,
} from "recharts";
import { mockRecords } from "../utilities/mock";
// import type { Record } from "../utilities/mock";

const amount = 17 * 8;

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

function getMonthNumber(date: Date): number {
    return date.getMonth() + 1;
}

function Chart() {
    const recordHistoryByMonth = useMemo(() => {
        const months = Array.from({ length: 12 }, () => 0);
        mockRecords.forEach((record) => {
            const date = new Date(record.date);
            const month = date.getMonth();
            months[month] += record.hours;
        });

        let remainingAmount = amount;
        const remainingHoursByMonth = months.map((hours, index) => {
            remainingAmount -= hours;
            return { month: index + 1, remaining: remainingAmount };
        });

        return remainingHoursByMonth;
    }, []);

    const trendlineSlope = useMemo(() => {
        const totalMonths = recordHistoryByMonth.length;
        const totalHours =
            recordHistoryByMonth[0].remaining - recordHistoryByMonth[totalMonths - 1].remaining;
        return totalHours / totalMonths;
    }, [recordHistoryByMonth]);

    console.log("Trendline Slope:", trendlineSlope);
    const totalVacationHours = useMemo(() => {
        return mockRecords.reduce((acc, record) => acc + record.hours, 0);
    }, []);

    const totalVacationHoursPercent = (totalVacationHours / amount) * 100;

    console.log("Total Vacation Hours Used in Percent:", totalVacationHoursPercent);
    // TODO: I don't think the trendline will work since the data can extend into the future

    return (
        <Card>
            <Box position="absolute" right="4">
                <Text color="gray" size="2">
                    {totalVacationHoursPercent.toFixed(0)}%
                </Text>
            </Box>
            <ResponsiveContainer width={"100%"} height={150}>
                <AreaChart data={recordHistoryByMonth}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-track)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--accent-track)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis type="number" domain={[0, amount]} hide />
                    <XAxis dataKey="month" type="number" domain={[1, 12]} hide />
                    {/* <ReferenceLine
                        segment={[
                            { x: "Month 1", y: 17 * 8 },
                            { x: "Month 12", y: amount - trendlineSlope * 12 },
                        ]}
                        stroke="gray"
                        strokeDasharray="3 3"
                        ifOverflow="extendDomain"
                    /> */}
                    {/* <ReferenceDot
                        x={`Month ${getMonthNumber(new Date())}`}
                        y={getMonthNumber(new Date())}
                        // stroke="grey"
                        // strokeDasharray="3 3"
                    /> */}
                    <ReferenceLine
                        x={getMonthNumber(new Date()) + 0.5}
                        stroke="grey"
                        strokeDasharray="3 3"
                    />
                    <ReferenceLine
                        x={3 + 31 / 32}
                        stroke="red"
                        strokeDasharray="3 3"
                        opacity={0.8}
                    />
                    {/* <ReferenceLine
                        // Carryover allowed
                        y={5 * 8}
                        stroke="red"
                        strokeDasharray="3 3"
                        opacity={0.8}
                    /> */}
                    <Area
                        type="monotone"
                        dataKey="remaining"
                        stroke="var(--accent-track)"
                        strokeWidth={2}
                        fill="url(#colorUv)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default Chart;
