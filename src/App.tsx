import { Box, Container, Flex, Heading, Theme } from "@radix-ui/themes";
import RecordChart from "./components/Chart";
import SettingsDialog from "./components/SettingsDialog";
import StatsBox from "./components/StatsBox";
import RecordTable from "./components/Table";
import UsageWarning from "./components/UsageWarning";
import { RecordsProvider } from "./utilities/RecordsContext";

function App() {
    return (
        <Theme appearance="dark">
            <Container size="2" asChild>
                <main>
                    <Flex direction="column" gap="4" py="4">
                        <RecordsProvider>
                            <Box pt="4">
                                <Flex justify="between" align="center">
                                    <Heading as="h1" size="8">
                                        Vacation Tracker
                                    </Heading>
                                    <SettingsDialog />
                                </Flex>
                            </Box>
                            <StatsBox />
                            <RecordChart />
                            <UsageWarning />
                            <RecordTable />
                        </RecordsProvider>
                    </Flex>
                </main>
            </Container>
        </Theme>
    );
}

export default App;
