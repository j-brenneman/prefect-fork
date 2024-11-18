import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useCallback } from "react";

type ConfirmDeleteDialogProps = {
	open: boolean;
	name: string;
	label?: string;
	deletionIsPending?: boolean;
	onOpenChange: (open: boolean) => void;
	handleDelete: (args?: void) => void;
};

export const ConfirmDeleteDialog = ({
	open,
	label,
	name,
	deletionIsPending,
	onOpenChange,
	handleDelete,
}: ConfirmDeleteDialogProps) => {
	const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);

	const onContinue = useCallback(() => {
		handleDelete();
		onClose();
	}, [handleDelete, onClose]);

	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{`Delete ${label ?? name}`}</AlertDialogTitle>
					<AlertDialogDescription>
						{`Are you sure you want to delete ${label ?? name}?`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onContinue}
						disabled={deletionIsPending}
						className="bg-red-500 hover:bg-red-400 focus:ring-red-600"
					>
						{deletionIsPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Delete"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
