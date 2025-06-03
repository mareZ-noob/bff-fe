import React, { Suspense } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = React.lazy(() => import('react-quill-new'));

export interface TextEditorProps {
	field: string;
	labelText: string;
	defaultValue?: string;
	error?: string;
	setValue: (value: string) => void;
}

export default function TextEditor({
	field,
	labelText,
	defaultValue,
	error,
	setValue,
}: TextEditorProps) {
	const handleChangeValue = (value: string) => {
		setValue(value);
	};

	return (
		<div className="mb-3">
			<label className="form-label" htmlFor={field}>
				{labelText}
			</label>
			<Suspense fallback={<div>Loading Editor...</div>}>
				<ReactQuill
					className="text-editor"
					defaultValue={defaultValue}
					onChange={handleChangeValue}
					theme="snow"
				/>
			</Suspense>
			<p className="error-field mt-1">{error}</p>
		</div>
	);
}
