import type { Dispatch, SetStateAction } from "react";
import type { EditorState } from "lexical";
import { useMemo } from "react";
import { $convertToMarkdownString } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import debounce from "lodash.debounce";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {$getRoot, LexicalEditor} from "lexical";

export type OnChangeMarkdownType =
  | Dispatch<SetStateAction<string>>
  | ((value: string, value_json: Object, value_html: string, value_text: string) => void);

export default function OnChangeMarkdown({
  onChange,
  transformers,
  __UNSAFE_debounceTime
}: {
  transformers: any;
  onChange: OnChangeMarkdownType;
  __UNSAFE_debounceTime?: number;
}) {
  const [editor] = useLexicalComposerContext()
  const OnChangeMarkdown = useMemo(() => {
    return debounce(
      (state: EditorState) => transformState(state, editor, onChange, transformers),
      __UNSAFE_debounceTime ?? 200
    );
  }, [onChange, __UNSAFE_debounceTime]);

  return (
    <OnChangePlugin
      onChange={OnChangeMarkdown}
      ignoreInitialChange
      ignoreSelectionChange
    />
  );
}

function transformState(
  editorState: EditorState,
  editor: LexicalEditor,
  onChange: OnChangeMarkdownType,
  transformers: any
) {
  editorState.read(() => {
    const markdown = $convertToMarkdownString(transformers);
    const html_text = $generateHtmlFromNodes(editor, null)
    const plain_text = $getRoot().getTextContent()
    const withBrs = markdown
      // https://github.com/markedjs/marked/issues/190#issuecomment-865303317
      .replace(/\n(?=\n)/g, "\n")
      // When escape(markdown) with block quotes we end up with the following:
      // '&gt; block quote text'
      // and need to convert it back to the original, so the markdown is respected
      .replace(/^(&gt\;)(?=\s)(?!.*&lt\;)/gm, ">");

    console.log("HTML_TEXT=", html_text)
    onChange(withBrs, editorState.toJSON(), html_text, plain_text);
  });
}
