"use client"

import ExampleTheme from "./themes/ExampleTheme";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {$createParagraphNode, $getRoot, EditorState} from "lexical";
import {ListItemNode, ListNode} from "@lexical/list";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {LinkPlugin} from "@lexical/react/LexicalLinkPlugin";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {MarkdownShortcutPlugin} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {$convertFromMarkdownString, TRANSFORMERS} from "@lexical/markdown";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ReadOnlyPlugin from "./plugins/ReadOnlyPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import OnChangeMarkdown from "./plugins/OnChangeMarkdown";
import "./styles.css"
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {useEffect, useRef} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import RefPlugin from "./plugins/RefPlugin";
import {$generateHtmlFromNodes} from "@lexical/html";

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

export default function Editor(props) {
    const { json_setter, initial_value } = props
    const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    console.log("Props=", props)

    const initialEditorState = () => {
        return JSON.stringify(initial_value) || EMPTY_CONTENT
        // let str = (props.value || "").replace(/\n\n<br>\n/g, "\n");
        // let str = (props.value || "")
        // console.log("str=", str)

        // If we still have br tags, we're coming from Slate, apply
        // Slate list collapse and remove remaining br tags
        // https://github.com/facebook/lexical/issues/2208
        // if (str.match(/<br>/g)) {
        //     str = str
        //         .replace(/^(\n)(?=\s*[-+\d.])/gm, "")
        //         .replace(/<br>/g, "");
        // }
        //
        // str = str
        //     // Unescape HTML characters
        //     .replace(/&quot;/g, '"')
        //     .replace(/&amp;/g, "&")
        //     .replace(/&#39;/g, "'")
        //     .replace(/&lt;/g, "<")
        //     .replace(/&gt;/g, ">");
        //
        // if (!str) {
        //     // if string is empty and this is not an update
        //     // don't bother trying to $convertFromMarkdown
        //     // below we properly initialize with the correct state allowing for
        //     // AutoFocus to work (as there is state to focus on), which works better
        //     // than $convertFromMarkdownString('')
        //     const root = $getRoot();
        //     const paragraph = $createParagraphNode();
        //     root.append(paragraph);
        //     return;
        // }

        // $convertFromMarkdownString(str, TRANSFORMERS);
    }

    const editorConfig = {
        // The editor theme
        theme: ExampleTheme, // Handling of errors during update
        onError(error) {
            throw error;
        },
        editorState: initialEditorState(),
        // Any custom nodes go here
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, TableNode, TableCellNode, TableRowNode, AutoLinkNode, LinkNode]
    };

    const onChange = (editorState) => {
        json_setter(editorState.toJSON())
    }

    return (<LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
            <ToolbarPlugin/>
            <div className="editor-inner">
                <RichTextPlugin
                    ErrorBoundary={LexicalErrorBoundary}
                    contentEditable={<ContentEditable className="editor-input"/>}
                    placeholder={<Placeholder/>}
                />
                <OnChangePlugin onChange={onChange}/>
                <HistoryPlugin/>
                <CodeHighlightPlugin/>
                <ListPlugin/>
                <LinkPlugin/>
                <OnChangeMarkdown transformers={TRANSFORMERS} onChange={props.onChange}/>
                <ReadOnlyPlugin isDisabled={props.isDisabled}/>
                <AutoLinkPlugin/>
                <ListMaxIndentLevelPlugin maxDepth={7}/>
                <MarkdownShortcutPlugin transformers={TRANSFORMERS}/>
                {/*<RefPlugin setter={editorRef} />*/}
            </div>
        </div>
    </LexicalComposer>);
}
