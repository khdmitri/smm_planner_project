import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";

export default function HTMLPlugin({ setter }) {
  console.log("HTMLPlugin called")
  const [editor] = useLexicalComposerContext()
  editor.update(() => {
    const html_text = $generateHtmlFromNodes(editor, null)
    console.log("HTML_TEXT=", html_text)
    setter(html_text)
  })
  return null
}