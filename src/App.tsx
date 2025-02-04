import { Theme, ThemePanel } from "@radix-ui/themes";
import {
    Container,
    Callout,
    Flex,
    Card,
    Heading,
    Box,
    Grid,
    Text,
    IconButton,
} from "@radix-ui/themes";
import { InfoCircledIcon, GearIcon } from "@radix-ui/react-icons";
import RecordTable from "./components/Table";
import RecordChart from "./components/Chart";
import UsageWarning from "./components/UsageWarning";
import SettingsDialog from "./components/SettingsDialog";

// TODO: On new year, provide dialog to confirm carryover days
// TODO: Add ability to sync with Google Sheets

function Stat({ value, total, label }: { value: number; total: number; label: string }) {
    // TODO: Color gray if value is 0
    return (
        <Box>
            <Flex gap="1" align="baseline">
                <Text weight="bold" size="8" style={{ color: "var(--accent-a10)" }}>
                    {value}
                </Text>
                <Text>/</Text>
                <Text>{total}</Text>
            </Flex>
            {/* <br /> */}
            <Text color="gray" size="2">
                {label}
            </Text>
        </Box>
    );
}

function App() {
    return (
        <Theme appearance="dark">
            <Container size="2" asChild>
                <main>
                    <Flex direction="column" gap="4" py="4">
                        <Box pt="4">
                            <Flex justify="between" align="center">
                                <Heading as="h1" size="8">
                                    Vacation Tracker
                                </Heading>

                                <SettingsDialog />
                            </Flex>
                        </Box>
                        {/* <Grid columns="2" gap="4"> */}
                        <Card>
                            {/* <Heading as="h1" size="3">
                                    Stats
                                </Heading> */}
                            <Grid columns="4" rows="1" gap="2" p="2">
                                <Stat value={15} total={15} label="Vacation Days" />
                                <Stat value={6} total={6} label="Sick Days" />
                                <Stat value={4} total={5} label="Carryover Days" />
                                <Stat value={2} total={2} label="Floating Holidays" />
                            </Grid>
                        </Card>
                        <RecordChart />
                        {/* </Grid> */}
                        <UsageWarning />
                        <UsageWarning />
                        <RecordTable />
                    </Flex>
                </main>
            </Container>
            <ThemePanel />
        </Theme>
    );
}

export default App;
