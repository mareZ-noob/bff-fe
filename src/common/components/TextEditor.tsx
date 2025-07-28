import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export interface TextEditorProps {
	field: string;
	labelText: string;
	value?: string;
	error?: string;
	setValue: (_value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
	field,
	labelText,
	value,
	error,
	setValue,
}) => {
	const handleChangeValue = (value: string) => {
		if (value === "<p><br></p>") {
			setValue("");
		} else {
			setValue(value);
		}
	};

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			[{ size: ["small", false, "large", "huge"] }],
			[{ font: [] }],
			[{ align: [] }],
			["bold", "italic", "underline", "strike"],
			["blockquote", "code-block"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
			["clean"],
		],
		keyboard: {
			bindings: {
				customEnterBinding: {
					key: 13,
					handler: (range, context) => {
						return true;
					}
				}
			}
		}
	};

	return (
		<div className="mb-3">
			<label className="form-label" htmlFor={field}>
				{labelText}
			</label>
			<ReactQuill
				theme="snow"
				className="text-editor"
				value={value}
				onChange={handleChangeValue}
				modules={modules}
			/>
			<p className="error-field mt-1">{error}</p>
		</div>
	);
};

export default TextEditor;
