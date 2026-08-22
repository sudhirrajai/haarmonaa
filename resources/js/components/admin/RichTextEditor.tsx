import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  Code,
  Undo,
  Redo,
  Quote,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = '180px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || '');

  useEffect(() => {
    if (editorRef.current && !showHtml) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlValue(value || '');
  }, [value, showHtml]);

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      onChange(newHtml);
      setHtmlValue(newHtml);
    }
  };

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (showHtml) return;
    document.execCommand(command, false, arg);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleCreateLink = () => {
    if (showHtml) return;
    const url = prompt('Enter link URL (e.g. https://... or /shop):');
    if (url) {
      exec('createLink', url);
    }
  };

  const handleFormatBlock = (tag: string) => {
    if (showHtml) return;
    exec('formatBlock', tag);
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlValue(val);
    onChange(val);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden focus-within:border-black transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 text-gray-700">
        <button
          type="button"
          onClick={() => exec('bold')}
          title="Bold (Ctrl+B)"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => exec('italic')}
          title="Italic (Ctrl+I)"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => exec('underline')}
          title="Underline (Ctrl+U)"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <span className="w-[1px] h-4 bg-gray-300 mx-1 self-center" />

        <button
          type="button"
          onClick={() => handleFormatBlock('<h2>')}
          title="Heading 2"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors text-xs font-bold flex items-center gap-0.5 cursor-pointer"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleFormatBlock('<h3>')}
          title="Heading 3"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors text-xs font-bold flex items-center gap-0.5 cursor-pointer"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleFormatBlock('<p>')}
          title="Paragraph"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors text-xs font-semibold cursor-pointer"
        >
          P
        </button>

        <span className="w-[1px] h-4 bg-gray-300 mx-1 self-center" />

        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleFormatBlock('<blockquote>')}
          title="Blockquote"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleCreateLink}
          title="Insert Link"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>

        <span className="w-[1px] h-4 bg-gray-300 mx-1 self-center" />

        <button
          type="button"
          onClick={() => exec('undo')}
          title="Undo"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => exec('redo')}
          title="Redo"
          className="p-1.5 hover:bg-white hover:text-black rounded-[6px] transition-colors cursor-pointer"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowHtml(!showHtml)}
            className={`px-2 py-1 rounded-[6px] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showHtml
                ? 'bg-[#111111] text-white'
                : 'bg-gray-200/70 hover:bg-gray-200 text-gray-700'
            }`}
            title="Toggle HTML Source Code View"
          >
            <Code className="w-3 h-3" />
            <span>{showHtml ? 'Visual' : 'HTML Source'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {showHtml ? (
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          placeholder="Paste or write raw HTML..."
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-gray-800 focus:outline-hidden resize-y bg-gray-50/50 leading-relaxed"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="p-4 text-xs sm:text-[13px] text-gray-800 leading-relaxed focus:outline-hidden prose prose-sm max-w-none"
        />
      )}
    </div>
  );
};
