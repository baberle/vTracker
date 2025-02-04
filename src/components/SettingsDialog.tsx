import { GearIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, IconButton, Text, TextField, Separator } from "@radix-ui/themes";

// Settings
// - # vacation days
// - vacation day start date
// - # floating holidays
// - # sick days
// - carrover limit
// - carryover deadline (disabled if carryover limit is 0)
// - warning period (default is 4 times the remaining days excluding carryover limit)
// - Import / Export data from JSON
// - non-fancy stats section

function SettingsDialog() {
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <IconButton variant="outline" size="2">
                    <GearIcon width="18" height="18" />
                </IconButton>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Settings</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Make changes to your profile.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Vacation Days
                        </Text>
                        <TextField.Root
                            type="number"
                            min={0}
                            max={365}
                            defaultValue={15}
                            placeholder="# of vacation days per year"
                        />
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Vacation Year Start
                        </Text>
                        <TextField.Root type="date" />
                    </label>
                    <Separator />
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Carryover Limit
                        </Text>
                        <TextField.Root
                            type="number"
                            min={0}
                            max={365}
                            defaultValue={5}
                            placeholder="# days allowed to carry over"
                        />
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Carryover Deadline
                        </Text>
                        <TextField.Root type="date" />
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
    );
}

export default SettingsDialog;
