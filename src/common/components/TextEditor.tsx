import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import React from "react";

export interface TextEditorProps {
	field: string;
	labelText: string;
	defaultValue?: string;
	error?: string;
	setValue: (_value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
	field,
	labelText,
	defaultValue,
	error,
	setValue,
}) => {
	const handleChangeValue = (value: string) => {
		setValue(value);
	};

	return (
		<div className="mb-3">
			<label className="form-label" htmlFor={field}>
				{labelText}
			</label>
			<ReactQuill
				theme="snow"
				className="text-editor"
				defaultValue={defaultValue}
				onChange={handleChangeValue}
			/>
			<p className="error-field mt-1">{error}</p>
		</div>
	);
};

export default TextEditor;
