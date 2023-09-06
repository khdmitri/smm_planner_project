export const convertPureMarkdown = (text) => {
    text = text.replace(/\n\n<br>\n/g, "\n");

    if (text.match(/<br>/g)) {
        text = text
            .replace(/^(\n)(?=\s*[-+\d.])/gm, "")
            .replace(/<br>/g, "");
    }

    text = text
        // Unescape HTML characters
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    return text
}