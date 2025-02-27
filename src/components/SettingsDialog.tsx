import { DownloadIcon, GearIcon, UploadIcon } from "@radix-ui/react-icons";
import {
    Button,
    Dialog,
    Flex,
    IconButton,
    Text,
    TextField,
    Separator,
    Select,
} from "@radix-ui/themes";
import type { Settings } from "../utilities/db";
import { useRecords } from "../utilities/RecordsContext";
import { exportToJson, importFromJson } from "../utilities/db";

function SettingsDialog() {
    const { settings, updateSettings, refresh } = useRecords();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const formEntries = Object.fromEntries(data);
        const newSettings: Settings = {
            carryoverDays: parseInt(formEntries.carryoverDays as string),
            carryoverLimit: parseInt(formEntries.carryoverLimit as string),
            floatingHolidays: parseInt(formEntries.floatingHolidays as string),
            sickLimit: parseInt(formEntries.sickLimit as string),
            vacationDays: parseInt(formEntries.vacationDays as string),
            carryoverDeadline: formEntries.carryoverDeadline as string,
            warningPeriod: parseInt(formEntries.warningPeriod as string),
        };
        updateSettings(newSettings);
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <IconButton variant="outline" size="2">
                    <GearIcon width="18" height="18" />
                </IconButton>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px" asChild>
                <form onSubmit={onSubmit}>
                    <Dialog.Title>Settings</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Configure your vacation tracker
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Vacation Days
                            </Text>
                            <TextField.Root
                                name="vacationDays"
                                type="number"
                                min={0}
                                max={365}
                                defaultValue={settings.vacationDays}
                                placeholder="# of vacation days per year"
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Floating Holidays
                            </Text>
                            <TextField.Root
                                name="floatingHolidays"
                                type="number"
                                min={0}
                                max={365}
                                defaultValue={settings.floatingHolidays}
                                placeholder="# of floating holidays per year"
                            />
                        </label>
                        {/* <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Vacation Year Start
                            </Text>
                            <TextField.Root
                                name="yearStart"
                                type="date"
                                defaultValue={`${new Date().getFullYear()}-01-01`}
                                disabled
                            />
                        </label> */}
                        <Separator />
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Carryover Days
                            </Text>
                            <TextField.Root
                                name="carryoverDays"
                                type="number"
                                min={0}
                                max={365}
                                defaultValue={settings.carryoverDays}
                                placeholder="carryover days this year"
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Carryover Limit
                            </Text>
                            <TextField.Root
                                name="carryoverLimit"
                                type="number"
                                min={0}
                                max={365}
                                defaultValue={settings.carryoverLimit}
                                placeholder="# days allowed to carry over"
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Carryover Deadline
                            </Text>
                            <TextField.Root
                                name="carryoverDeadline"
                                type="date"
                                defaultValue={
                                    new Date(settings.carryoverDeadline).toISOString().split("T")[0]
                                }
                            />
                        </label>
                        <Separator />
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Sick Days
                            </Text>
                            <TextField.Root
                                name="sickLimit"
                                type="number"
                                min={0}
                                max={365}
                                defaultValue={settings.sickLimit}
                                placeholder="# sick days allowed"
                            />
                        </label>
                        <Separator />
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Warning Period
                            </Text>
                            <Text as="div" size="1" mb="1" color="gray">
                                When the number of days left is X times the number of remaining
                                vacation days
                            </Text>
                            <Select.Root
                                name="warningPeriod"
                                defaultValue={settings.warningPeriod.toString()}
                            >
                                <Select.Trigger style={{ width: "100%" }} />
                                <Select.Content position="popper">
                                    <Select.Item value="2">2x</Select.Item>
                                    <Select.Item value="4">4x</Select.Item>
                                    <Select.Item value="6">6x</Select.Item>
                                    <Select.Item value="8">8x</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </label>
                        <Flex gap="3" justify="center" mt="3" mb="1">
                            <Button
                                variant="surface"
                                onClick={() => {
                                    const input = document.createElement("input");
                                    input.type = "file";
                                    input.accept = "application/json";
                                    input.onchange = async (event) => {
                                        const file = (event.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                            const text = await file.text();
                                            const importedSettings = JSON.parse(text);
                                            await importFromJson(importedSettings);
                                            refresh();
                                        }
                                    };
                                    input.click();
                                }}
                            >
                                <UploadIcon />
                                Import
                            </Button>
                            <Button
                                variant="surface"
                                onClick={async () => {
                                    const json = await exportToJson();
                                    const blob = new Blob([JSON.stringify(json, null, 2)], {
                                        type: "application/json",
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "vTrackerDB.json";
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                            >
                                <DownloadIcon />
                                Export
                            </Button>
                        </Flex>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button type="submit">Save</Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default SettingsDialog;
