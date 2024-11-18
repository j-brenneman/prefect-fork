import { components } from "@/api/prefect";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { MoreVerticalIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ConfirmDeleteDialog } from "../ui/confirm-delete-dialog";

import {
	deleteFlowMutation,
	deploymentsCountQueryParams,
	getLatestFlowRunsQueryParams,
	getNextFlowRunsQueryParams,
} from "./queries";

type Flow = components["schemas"]["Flow"];

export const FlowName = ({ row }: { row: { original: Flow } }) => {
	if (!row.original.id) return null;

	return (
		<div>
			<Link
				to="/flows/flow/$id"
				params={{ id: row.original.id }}
				className="text-primary hover:underline cursor-pointer"
			>
				{row.original.name}
			</Link>
			<div className="text-sm text-muted-foreground">
				Created{" "}
				{row.original?.created &&
					format(parseISO(row.original.created), "yyyy-MM-dd")}
			</div>
		</div>
	);
};

export const FlowLastRun = ({ row }: { row: { original: Flow } }) => {
	const { data } = useQuery(
		getLatestFlowRunsQueryParams(row.original.id || "", 16, {
			enabled: !!row.original.id,
		}),
	);

	if (!row.original.id) return null;
	return JSON.stringify(data?.[0]?.name);
};

export const FlowNextRun = ({ row }: { row: { original: Flow } }) => {
	const { data } = useQuery(
		getNextFlowRunsQueryParams(row.original.id || "", 16, {
			enabled: !!row.original.id,
		}),
	);

	if (!row.original.id) return null;
	return JSON.stringify(data?.[0]?.name);
};

export const FlowDeploymentCount = ({ row }: { row: { original: Flow } }) => {
	const { data } = useQuery(
		deploymentsCountQueryParams(row.original.id || "", {
			enabled: !!row.original.id,
		}),
	);
	if (!row.original.id) return null;

	return data;
};

const DeleteMenuItem = ({
	id,
	name,
	onClose,
}: {
	id: string;
	name: string;
	onClose?: () => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { toast } = useToast();

	const onOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen && onClose) {
				onClose();
			}
			setIsOpen(isOpen);
		},
		[setIsOpen, onClose],
	);

	const onSelect = useCallback(
		(event: Event) => {
			event.preventDefault();
			onOpenChange(true);
		},
		[onOpenChange],
	);

	const mutationOptions: MutationOptions = useMemo(
		() => ({
			onSuccess: () => {
				toast({ title: "Flow Deleted" });
				onOpenChange(false);
			},
			onError: (error) => {
				const title = error.message || "Unknown error while deleting flow.";
				toast({ title });
			},
		}),
		[toast, onOpenChange],
	);

	const { mutate: deleteFlow, isPending } = useMutation(
		deleteFlowMutation(id, mutationOptions),
	);

	return (
		<>
			<DropdownMenuItem onSelect={onSelect}>Delete</DropdownMenuItem>
			<ConfirmDeleteDialog
				open={isOpen}
				label="Flow"
				name={name}
				deletionIsPending={isPending}
				onOpenChange={onOpenChange}
				handleDelete={deleteFlow}
			/>
		</>
	);
};

export const FlowActionMenu = ({ row }: { row: { original: Flow } }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const id = row.original.id;
	if (!id) {
		return null;
	}
	return (
		<DropdownMenu
			open={isMenuOpen}
			onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
		>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreVerticalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() => void navigator.clipboard.writeText(id)}
				>
					Copy ID
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DeleteMenuItem
					id={id}
					name={row.original.name}
					onClose={() => setIsMenuOpen(false)}
				/>
				<DropdownMenuItem>Automate</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const FlowActivity = ({ row }: { row: { original: Flow } }) => {
	const { data } = useQuery(
		getLatestFlowRunsQueryParams(row.original.id || "", 16, {
			enabled: !!row.original.id,
		}),
	);
	if (!row.original.id) return null;

	return (
		<div className="flex h-[24px]">
			{Array(16)
				.fill(1)
				?.map((_, index) => (
					<div
						key={index}
						className={cn(
							"flex-1 mr-[1px] rounded-full bg-gray-400",
							data?.[index]?.state_type &&
								data?.[index]?.state_type === "COMPLETED" &&
								"bg-green-500",
							data?.[index]?.state_type &&
								data?.[index]?.state_type !== "COMPLETED" &&
								"bg-red-500",
						)}
					/>
				))}
		</div>
	);
};
