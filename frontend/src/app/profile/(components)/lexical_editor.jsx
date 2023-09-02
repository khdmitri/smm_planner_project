"use client"

import '../../../styles/component-editor.css';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {$createHeadingNode, HeadingNode} from "@lexical/rich-text";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createTextNode, $getRoot} from "lexical";

const theme = {
    paragraph: 'editor-paragraph',
    text: {
        bold: 'my-editor-textBold',
        code: 'editor-textCode',
        italic: 'editor-textItalic',
        strikethrough: 'editor-textStrikethrough',
        subscript: 'editor-textSubscript',
        superscript: 'editor-textSuperscript',
        underline: 'editor-textUnderline',
        underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    },
}

function MyHeadingPlugin() {
    const [editor] = useLexicalComposerContext()
    const onClick = (event) => {
        editor.update(() => {
            const root = $getRoot()
            root.append($createHeadingNode('h1').append($createTextNode("Hello world")))
        })
    }
    return <button onClick={onClick}>Heading</button>
}

function onError(error) {
    console.error(error);
}

// function MyOnChangePlugin(props) {
//     const [editor] = useLexicalComposerContext()
//     const {onChange} = props
//     useEffect(() => {
//         return editor.registerUpdateListener(({editorState}) => {
//             onChange(editorState)
//         })
//     }, [onChange, editor])
// }

const LexicalEditor = () => {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [
            HeadingNode
        ]
    };

    return (
        <div className="editorWrapper">
            <LexicalComposer initialConfig={initialConfig}>
                <MyHeadingPlugin/>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="contentEditable"/>}
                    placeholder={<div className="editor-placeholder">Enter some text...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                {/*<MyOnChangePlugin onChange={(editorState) => {console.log(editorState)}} />*/}
                <HistoryPlugin/>
            </LexicalComposer>
        </div>
    );
};

export default LexicalEditor;