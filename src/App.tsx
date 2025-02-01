import { Theme, ThemePanel } from "@radix-ui/themes";
import { Container } from "@radix-ui/themes";

function App() {
    return (
        <Theme appearance="dark">
            <Container>
                <p>Test</p>
            </Container>
            <ThemePanel />
        </Theme>
    );
}

export default App;
