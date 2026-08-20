import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label = 'Description',
  placeholder = 'Write detailed product description, highlights, care instructions...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize content once or when reset
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const format = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInsertImage = (url: string) => {
    if (!url) return;
    if (editorRef.current) {
      editorRef.current.focus();
      const imgHtml = `<img src="${url}" alt="Product Image" class="w-full max-h-96 object-cover rounded-2xl border border-gray-200 my-4" />`;
      document.execCommand('insertHTML', false, imgHtml);
      handleInput();
    }
    setImageModalOpen(false);
    setImageUrl('');
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch('/admin/products/upload-media', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: formData,
      });

      const resData = await response.json();

      if (response.ok && resData.url) {
        handleInsertImage(resData.url);
      } else {
        setUploadError(resData.message || 'Image upload failed.');
      }
    } catch (err) {
      setUploadError('Network error uploading image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold text-gray-700">{label}</label>}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/80 border-b border-gray-200/80">
          <button
            type="button"
            onClick={() => format('bold')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => format('italic')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => format('underline')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => format('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer font-bold text-xs"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => format('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer font-bold text-xs"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => format('insertUnorderedList')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => format('insertOrderedList')}
            className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            className="px-2 py-1 bg-black hover:bg-[#d0473e] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Add Image</span>
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => format('removeFormat')}
              className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
              title="Clear Formatting"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ContentEditable Editor Body */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          placeholder={placeholder}
          className="min-h-[220px] max-h-[450px] overflow-y-auto p-4 bg-white text-xs sm:text-sm text-gray-900 leading-relaxed focus:outline-hidden font-normal prose prose-sm max-w-none [&_img]:rounded-2xl [&_img]:my-3 [&_img]:border [&_img]:border-gray-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold"
        />
      </div>

      {/* Insert Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setImageModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Insert Image in Description</h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Upload from System */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Option 1: Upload File From System
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-gray-900 hover:bg-[#d0473e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Select Image File</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[11px] text-gray-400 font-bold uppercase">OR</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* Option 2: Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Option 2: Image Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => handleInsertImage(imageUrl)}
                    disabled={!imageUrl}
                    className="px-4 py-2 bg-black hover:bg-[#d0473e] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Insert
                  </button>
                </div>
              </div>

              {uploadError && <p className="text-rose-500 text-xs font-semibold">{uploadError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
