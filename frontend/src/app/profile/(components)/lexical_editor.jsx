"use client"

import '../../../styles/component-editor.css';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {$createHeadingNode, HeadingNode} from "@lexical/rich-text";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW} from "lexical";
import {$setBlocksType} from "@lexical/selection";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    insertList,
    ListItemNode,
    ListNode
} from "@lexical/list";

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
    list: {
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol-custom',
        ul: 'editor-list-ul-custom',
        listitem: 'editor-listItem',
        listitemChecked: 'editor-listItemChecked',
        listitemUnchecked: 'editor-listItemUnchecked',
    },
}

function HeadingToolbarPlugin() {
    const [editor] = useLexicalComposerContext()
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    const onClick = (tag) => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(tag))
            }
        })
    }
    return <>{headingTags.map((tag) => {
        return <button key={tag} onClick={() => onClick(tag)}>{tag.toUpperCase()}</button>
    })}</>
}

function ListToolbarPlugin() {
    const [editor] = useLexicalComposerContext()
    const listTags = ['ol', 'ul']
    const onClick = (tag) => {
        if (tag === 'ol')
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        else
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    }

    editor.registerCommand(INSERT_UNORDERED_LIST_COMMAND, () => {
        insertList(editor, 'bullet');
        return true;
    }, COMMAND_PRIORITY_LOW);

    editor.registerCommand(INSERT_ORDERED_LIST_COMMAND, () => {
        insertList(editor, 'number');
        return true;
    }, COMMAND_PRIORITY_LOW);

    return <>{listTags.map((tag) => {
        return <button key={tag} onClick={() => onClick(tag)}>{tag.toUpperCase()}</button>
    })}</>
}

function ToolbarPlugin() {
    return (
        <div className="toolbar-wrapper">
            <HeadingToolbarPlugin/>&nbsp;|&nbsp;
            <ListToolbarPlugin/>
        </div>
    )
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
            HeadingNode, ListNode, ListItemNode
        ]
    };

    return (
        <div className="editorWrapper">
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin/>
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