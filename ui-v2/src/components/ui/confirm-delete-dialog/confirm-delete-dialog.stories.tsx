import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const meta: Meta<typeof ConfirmDeleteDialog> = {
	title: "UI/ConfirmDeleteDialog",
	component: ConfirmDeleteDialog,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ConfirmDeleteDialog>;

const ConfirmDeleteDialogWrapper = (args: Story["args"]) => {
	const [open, setOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const handleDelete = () => {
		setIsPending(true);
		setTimeout(() => {
			setIsPending(false);
			setOpen(false);
		}, 2000);
	};

	return (
		<>
			<button onClick={() => setOpen(true)}>Open Dialog</button>
			<ConfirmDeleteDialog
				name="Flow One"
				open={open}
				onOpenChange={setOpen}
				deletionIsPending={isPending}
				handleDelete={handleDelete}
				{...args}
			/>
		</>
	);
};

export const Default: Story = {
	render: (args) => <ConfirmDeleteDialogWrapper {...args} />,
	args: {
		name: "Item",
		label: "Custom Label",
	},
};

export const WithoutLabel: Story = {
	render: (args) => <ConfirmDeleteDialogWrapper {...args} />,
	args: {
		name: "Item",
	},
};
