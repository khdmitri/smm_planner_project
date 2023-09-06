import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";

export default function RefPlugin({ editorRef }) {
  const [editor] = useLexicalComposerContext()
  editor.update(() => {
    console.log("html=", $generateHtmlFromNodes(editor, null))
  })
  return null
}