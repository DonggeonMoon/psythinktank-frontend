import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import type Editor from "@toast-ui/editor";

export interface ToastEditorHandle {
    getHTML: () => string;
}

interface ToastEditorProps {
    initialValue?: string;
    height?: string;
}

type EditMode = "wysiwyg" | "html";

const ToastEditor = forwardRef<ToastEditorHandle, ToastEditorProps>(
    ({initialValue = "", height = "500px"}, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const editorRef = useRef<Editor | null>(null);
        // Toast UI는 지원하지 않는 태그/속성을 버리므로, WYSIWYG에서 손대지 않았다면 HTML 모드에 원본을 그대로 보여준다
        const editedInWysiwygRef = useRef(false);
        const [mode, setMode] = useState<EditMode>("wysiwyg");
        const [htmlSource, setHtmlSource] = useState("");

        useEffect(() => {
            if (!containerRef.current) return;
            let cancelled = false;

            // @toast-ui/editor는 최상단에서 navigator를 참조해서 SSR 번들에서 못 씀 -> 브라우저에서만 동적 로드
            Promise.all([
                import("@toast-ui/editor"),
                import("@toast-ui/editor/dist/i18n/ko-kr"),
            ]).then(([{default: ToastUiEditor}]) => {
                if (cancelled || !containerRef.current) return;
                editorRef.current = new ToastUiEditor({
                    el: containerRef.current,
                    height,
                    initialEditType: "wysiwyg",
                    previewStyle: "vertical",
                    initialValue: initialValue || " ",
                    hideModeSwitch: true,
                    language: "ko-KR",
                    events: {
                        change: () => {
                            editedInWysiwygRef.current = true;
                        },
                    },
                });
            });

            return () => {
                cancelled = true;
                editorRef.current?.destroy();
                editorRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const switchMode = (next: EditMode) => {
            const editor = editorRef.current;
            if (next === mode || !editor) return;

            if (next === "html") {
                setHtmlSource(editedInWysiwygRef.current || !initialValue ? editor.getHTML() : initialValue);
            } else {
                editor.setHTML(htmlSource, false);
                editedInWysiwygRef.current = true;
            }
            setMode(next);
        };

        useImperativeHandle(ref, () => ({
            getHTML: () => (mode === "html" ? htmlSource : editorRef.current?.getHTML() ?? ""),
        }), [mode, htmlSource]);

        const tabClass = (active: boolean) =>
            `px-3 py-1 text-xs font-medium rounded-t-md border border-b-0 transition-colors ${
                active
                    ? "border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`;

        return (
            <div>
                <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => switchMode("wysiwyg")} className={tabClass(mode === "wysiwyg")}>
                        에디터
                    </button>
                    <button type="button" onClick={() => switchMode("html")} className={tabClass(mode === "html")}>
                        HTML
                    </button>
                </div>
                <div ref={containerRef} className={mode === "html" ? "hidden" : undefined}/>
                {mode === "html" && (
                    <textarea
                        value={htmlSource}
                        onChange={(e) => setHtmlSource(e.target.value)}
                        spellCheck={false}
                        style={{height}}
                        className="block w-full resize-y rounded-md border border-slate-300 bg-white p-4 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
                    />
                )}
            </div>
        );
    }
);

ToastEditor.displayName = "ToastEditor";

export default ToastEditor;
