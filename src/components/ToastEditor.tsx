import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import type Editor from "@toast-ui/editor";

export interface ToastEditorHandle {
    getHTML: () => string;
}

interface ToastEditorProps {
    initialValue?: string;
    height?: string;
}

const ToastEditor = forwardRef<ToastEditorHandle, ToastEditorProps>(
    ({initialValue = "", height = "500px"}, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const editorRef = useRef<Editor | null>(null);

        useEffect(() => {
            if (!containerRef.current) return;
            let cancelled = false;

            // @toast-ui/editor는 최상단에서 navigator를 참조해서 SSR 번들에서 못 씀 -> 브라우저에서만 동적 로드
            import("@toast-ui/editor").then(({default: ToastUiEditor}) => {
                if (cancelled || !containerRef.current) return;
                editorRef.current = new ToastUiEditor({
                    el: containerRef.current,
                    height,
                    initialEditType: "wysiwyg",
                    previewStyle: "vertical",
                    initialValue: initialValue || " ",
                    hideModeSwitch: true,
                });
            });

            return () => {
                cancelled = true;
                editorRef.current?.destroy();
                editorRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useImperativeHandle(ref, () => ({
            getHTML: () => editorRef.current?.getHTML() ?? "",
        }));

        return <div ref={containerRef}/>;
    }
);

ToastEditor.displayName = "ToastEditor";

export default ToastEditor;
