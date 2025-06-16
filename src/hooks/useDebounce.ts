import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
};
