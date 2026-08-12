import React, { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, high-quality markdown parser for chat responses
  const renderFormattedText = (text: string) => {
    // Replace inline code, bold, italic, links
    const parts: React.ReactNode[] = [];
    let keyIdx = 0;

    // Pattern for inline code, bold, italic, links
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[([^\]]+)\]\(([^)]+)\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const raw = match[0];
      if (raw.startsWith('`') && raw.endsWith('`')) {
        // Inline code
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 text-xs font-mono bg-zinc-800 text-zinc-200 rounded border border-zinc-700/60"
          >
            {raw.slice(1, -1)}
          </code>
        );
      } else if ((raw.startsWith('**') && raw.endsWith('**')) || (raw.startsWith('__') && raw.endsWith('__'))) {
        // Bold
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-zinc-100">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if ((raw.startsWith('*') && raw.endsWith('*')) || (raw.startsWith('_') && raw.endsWith('_'))) {
        // Italic
        parts.push(
          <em key={keyIdx++} className="italic text-zinc-200">
            {raw.slice(1, -1)}
          </em>
        );
      } else if (raw.startsWith('[') && match[2] && match[3]) {
        // Link
        parts.push(
          <a
            key={keyIdx++}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
          >
            {match[2]}
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Split into blocks: code blocks vs text blocks
  const blocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent: string[] = [];
  let listItems: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (blockIdx: number) => {
    if (!listItems) return;
    if (listItems.type === 'ul') {
      blocks.push(
        <ul key={`list-${blockIdx}`} className="my-2.5 space-y-1.5 pl-5 list-disc text-zinc-300 marker:text-zinc-500">
          {listItems.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      blocks.push(
        <ol key={`list-${blockIdx}`} className="my-2.5 space-y-1.5 pl-5 list-decimal text-zinc-300 marker:text-zinc-500">
          {listItems.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderFormattedText(item)}
            </li>
          ))}
        </ol>
      );
    }
    listItems = null;
  };

  lines.forEach((line, idx) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        const codeText = codeBlockContent.join('\n');
        blocks.push(
          <CodeBlockView key={`code-${idx}`} language={codeBlockLang} code={codeText} />
        );
        inCodeBlock = false;
        codeBlockLang = '';
        codeBlockContent = [];
      } else {
        // Open code block
        flushList(idx);
        inCodeBlock = true;
        codeBlockLang = line.trim().replace('```', '').trim() || 'text';
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Bullet list
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (!listItems || listItems.type !== 'ul') {
        flushList(idx);
        listItems = { type: 'ul', items: [] };
      }
      listItems.items.push(ulMatch[2]);
      return;
    }

    // Numbered list
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!listItems || listItems.type !== 'ol') {
        flushList(idx);
        listItems = { type: 'ol', items: [] };
      }
      listItems.items.push(olMatch[2]);
      return;
    }

    // Regular line - flush previous list if any
    flushList(idx);

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${idx}`} className="text-base font-semibold text-zinc-100 mt-4 mb-2">
          {renderFormattedText(line.replace('### ', ''))}
        </h3>
      );
      return;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={`h2-${idx}`} className="text-lg font-semibold text-zinc-100 mt-5 mb-2 border-b border-zinc-800 pb-1">
          {renderFormattedText(line.replace('## ', ''))}
        </h2>
      );
      return;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={`h1-${idx}`} className="text-xl font-bold text-zinc-100 mt-5 mb-3">
          {renderFormattedText(line.replace('# ', ''))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-2 border-brand-500/70 pl-3 py-1 my-2 text-zinc-400 italic text-sm"
        >
          {renderFormattedText(line.replace('> ', ''))}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      blocks.push(<div key={`empty-${idx}`} className="h-2" />);
      return;
    }

    // Standard paragraph
    blocks.push(
      <p key={`p-${idx}`} className="my-1.5 leading-relaxed text-zinc-200">
        {renderFormattedText(line)}
      </p>
    );
  });

  flushList(lines.length);

  // If ended while still in code block
  if (inCodeBlock && codeBlockContent.length > 0) {
    blocks.push(
      <CodeBlockView
        key="unclosed-code"
        language={codeBlockLang}
        code={codeBlockContent.join('\n')}
      />
    );
  }

  return <div className="space-y-0.5 text-sm md:text-[15px]">{blocks}</div>;
};

interface CodeBlockViewProps {
  language: string;
  code: string;
}

const CodeBlockView: React.FC<CodeBlockViewProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800/80 text-zinc-400">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] hover:text-zinc-200 transition-colors px-2 py-0.5 rounded hover:bg-zinc-800"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-zinc-200 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
};
