import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Origem_Editor({
    value = "",
    onChange,
    placeholder = "Digite o conteúdo...",
    disabled = false,
    height = 300,
    className = "",
}) {
    return (
        <div
            className={className}
            style={{
                "--ksi-editor-height": `${height}px`
            }}
        >
            <CKEditor
                editor={ClassicEditor}
                disabled={disabled}
                data={value}
                config={{
                    placeholder,
                    toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "|",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "blockQuote",
                        "insertTable",
                        "|",
                        "undo",
                        "redo"
                    ]
                }}
                onChange={(event, editor) => {
                    onChange?.(editor.getData());
                }}
            />

            <style>
                {`
              
                    .ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-blurred {
                        border-color: #dee2e6 !important;
                        box-shadow: none !important;
                        outline: none !important;
                        min-height: ${height}px;
                    }
                    .ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-focused {
                        border-color: #dee2e6 !important;
                        box-shadow: none !important;
                        outline: none !important;
                        min-height: ${height}px;
                    }
                `}
            </style>
        </div>
    );
}