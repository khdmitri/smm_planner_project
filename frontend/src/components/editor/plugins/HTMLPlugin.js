import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";

export default function HTMLPlugin({ setter }) {
  const [editor] = useLexicalComposerContext()
  editor.update(() => {
    setter($generateHtmlFromNodes(editor, null))
  })
  return null
}