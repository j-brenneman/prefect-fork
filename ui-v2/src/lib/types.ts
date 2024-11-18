export type JSONValue =
	| string
	| number
	| boolean
	| Record<string, never>
	| unknown[]
	| null;

export type ReactComponentPropsWithClassName<T extends React.ElementType> =
	React.ComponentPropsWithoutRef<T> & {
		className?: string;
	};
