import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const LIST_ITEMS = [
	{ id: 1, name: "Item One" },
	{ id: 2, name: "Item Two" },
];

const ListItem = ({
	id,
	name,
	handleDelete,
}: {
	id: number;
	name: string;
	handleDelete: (id: number) => void;
}) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	return (
		<>
			<ConfirmDeleteDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				name={name}
				handleDelete={() => handleDelete(id)}
			/>
			<li role="listitem" onClick={() => setDialogOpen(true)}>
				{name}
			</li>
		</>
	);
};

const ListItems = () => {
	const [items, setItems] = useState(LIST_ITEMS);

	const handleDelete = (idToDelete: number) => {
		setItems((existing) => existing.filter(({ id }) => id !== idToDelete));
	};

	return (
		<ul role="list">
			{items.map((item) => (
				<ListItem key={item.id} handleDelete={handleDelete} {...item} />
			))}
		</ul>
	);
};

describe("ConfirmDeleteDialog", () => {
	it("renders the dialog with correct content", async () => {
		const user = userEvent.setup();
		render(<ListItems />);

		const listItemOneName = LIST_ITEMS[0].name;
		const listItemOne = screen.getByText(listItemOneName);
		await user.click(listItemOne);

		const titleText = screen.getByText(`Delete ${listItemOneName}`);
		expect(titleText).toBeVisible();

		const descriptiveText = screen.getByText(
			`Are you sure you want to delete ${listItemOneName}?`,
		);
		expect(descriptiveText).toBeVisible();
	});

	it("accepts a callback to delete an item", async () => {
		const user = userEvent.setup();
		render(<ListItems />);

		const list = screen.getByRole("list");
		expect(list.childNodes.length).toEqual(2);

		const listItemOneName = LIST_ITEMS[0].name;
		const listItemOne = screen.getByText(listItemOneName);
		await user.click(listItemOne);

		const deleteButton = screen.getByRole("button", { name: /delete/i });
		await user.click(deleteButton);

		expect(list.childNodes.length).toEqual(1);
	});

	it("can close the dialog without deleting an item", async () => {
		const user = userEvent.setup();
		render(<ListItems />);

		const list = screen.getByRole("list");
		expect(list.childNodes.length).toEqual(2);

		const listItemOneName = LIST_ITEMS[0].name;
		const listItemOne = screen.getByText(listItemOneName);
		await user.click(listItemOne);

		const closeButton = screen.getByRole("button", { name: /close/i });
		await user.click(closeButton);

		expect(list.childNodes.length).toEqual(2);
	});

	it("uses custom label when provided", () => {
		const WithCustomLabel = () => (
			<ConfirmDeleteDialog
				open
				onOpenChange={() => undefined}
				handleDelete={() => undefined}
				name="Item One"
				label="Custom Label"
			/>
		);
		render(<WithCustomLabel />);

		expect(screen.getByText("Delete Custom Label")).toBeVisible();
	});
});
