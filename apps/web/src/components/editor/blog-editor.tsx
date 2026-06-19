import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorBubble,
  EditorBubbleItem,
  type JSONContent,
  type EditorInstance,
  StarterKit,
  TiptapLink,
  TiptapImage,
  TiptapUnderline,
  Placeholder,
  TaskList,
  TaskItem,
  HorizontalRule,
  Youtube,
  TextStyle,
  Color,
  HighlightExtension,
  createSuggestionItems,
  handleCommandNavigation,
} from "novel"
import { useState, forwardRef, useImperativeHandle } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Image,
  Video as VideoIcon,
  Minus,
  Type,
} from "lucide-react"

const slashItems = createSuggestionItems([
  {
    title: "Texto",
    description: "Párrafo de texto normal",
    searchTerms: ["p", "paragraph"],
    icon: <Type className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run()
    },
  },
  {
    title: "Título 1",
    description: "Título grande",
    searchTerms: ["title", "h1", "heading"],
    icon: <Heading1 className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run()
    },
  },
  {
    title: "Título 2",
    description: "Subtítulo",
    searchTerms: ["subtitle", "h2"],
    icon: <Heading2 className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
    },
  },
  {
    title: "Título 3",
    description: "Encabezado pequeño",
    searchTerms: ["h3"],
    icon: <Heading3 className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run()
    },
  },
  {
    title: "Lista",
    description: "Lista con viñetas",
    searchTerms: ["unordered", "bullet"],
    icon: <List className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "Lista numerada",
    description: "Lista numerada",
    searchTerms: ["ordered", "number"],
    icon: <ListOrdered className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: "Lista de tareas",
    description: "Lista con checkboxes",
    searchTerms: ["todo", "task", "check"],
    icon: <CheckSquare className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: "Cita",
    description: "Bloque de cita",
    searchTerms: ["blockquote", "quote"],
    icon: <Quote className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: "Imagen",
    description: "Insertar imagen por URL",
    searchTerms: ["image", "photo", "img"],
    icon: <Image className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      const url = window.prompt("URL de la imagen:")
      if (url) editor.chain().focus().setImage({ src: url }).run()
    },
  },
  {
    title: "YouTube",
    description: "Insertar video de YouTube",
    searchTerms: ["youtube", "video", "embed"],
    icon: <VideoIcon className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      const url = window.prompt("URL del video de YouTube:")
      if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
    },
  },
  {
    title: "Separador",
    description: "Línea horizontal",
    searchTerms: ["hr", "divider", "separator"],
    icon: <Minus className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
])

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    bulletList: { HTMLAttributes: { class: "list-disc ml-4" } },
    orderedList: { HTMLAttributes: { class: "list-decimal ml-4" } },
    blockquote: { HTMLAttributes: { class: "border-l-2 border-foreground/20 pl-4 italic" } },
    codeBlock: false,
    horizontalRule: false,
  }),
  HorizontalRule,
  TiptapLink.configure({
    HTMLAttributes: { class: "text-foreground underline underline-offset-2" },
  }),
  TiptapImage.configure({
    HTMLAttributes: { class: "w-full max-w-2xl mx-auto my-4" },
    allowBase64: true,
  }),
  TiptapUnderline,
  TextStyle,
  Color,
  HighlightExtension.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Youtube.configure({
    HTMLAttributes: { class: "w-full aspect-video my-4" },
  }),
  Placeholder.configure({
    placeholder: "Escribe aquí... usa '/' para insertar bloques",
    includeChildren: true,
  }),
]

export interface BlogEditorRef {
  getJSON: () => JSONContent | undefined
  getHTML: () => string | undefined
  getText: () => string | undefined
}

interface BlogEditorProps {
  initialContent?: JSONContent
  onChange?: (content: JSONContent, text: string, html: string) => void
}

export const BlogEditor = forwardRef<BlogEditorRef, BlogEditorProps>(
  function BlogEditor({ initialContent, onChange }, ref) {
    const [editor, setEditor] = useState<EditorInstance | null>(null)

    useImperativeHandle(ref, () => ({
      getJSON: () => editor?.getJSON(),
      getHTML: () => editor?.getHTML(),
      getText: () => editor?.getText(),
    }))

    return (
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="min-h-64 border-b border-input pb-4"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: "prose prose-sm max-w-none focus:outline-none text-foreground [&_h1]:font-display [&_h1]:text-h2 [&_h2]:font-display [&_h2]:text-h3 [&_h3]:font-semibold [&_p]:leading-relaxed [&_img]:rounded-none",
            },
          }}
          onCreate={({ editor }) => setEditor(editor)}
          onUpdate={({ editor }) => {
            onChange?.(editor.getJSON(), editor.getText(), editor.getHTML())
          }}
        >
          {/* Slash commands */}
          <EditorCommand className="z-50 h-auto max-h-80 overflow-y-auto bg-background border border-border shadow-md">
            <EditorCommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
              Sin resultados
            </EditorCommandEmpty>
            <EditorCommandList>
              {slashItems.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center justify-center size-8 bg-muted rounded-md">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* Bubble menu (selection toolbar) */}
          <EditorBubble className="flex items-center gap-1 bg-background border border-border shadow-md px-1 py-0.5">
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleBold().run()}
            >
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer">
                <Bold className="size-3.5" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
            >
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer">
                <Italic className="size-3.5" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}
            >
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer">
                <Underline className="size-3.5" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
            >
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer">
                <Strikethrough className="size-3.5" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleCode().run()}
            >
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer">
                <Code className="size-3.5" />
              </button>
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    )
  }
)
