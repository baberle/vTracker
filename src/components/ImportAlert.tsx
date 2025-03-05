import { Button, Flex, AlertDialog } from "@radix-ui/themes";

function ImportAlert({
    button,
    onAction,
}: {
    readonly button: React.ReactNode;
    readonly onAction: () => void;
}) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>{button}</AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Import Database</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure? This will overwrite any existing records.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="red" onClick={onAction}>
                            Import Database
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}

export default ImportAlert;
