export function convertMarkdownToHTML(md: string) {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n$/gim, '<br />')
      .replace(/\n/g, '<br />')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/---/g, '<hr />');
  }
  