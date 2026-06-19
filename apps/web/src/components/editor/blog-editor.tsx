"use client"

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
  Command,
  createSuggestionItems,
  handleCommandNavigation,
  renderItems,
} from "novel"
import { forwardRef, useImperativeHandle, useRef } from "react"
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
    searchTerms: ["title", "h1"],
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
    searchTerms: ["todo", "task"],
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
    searchTerms: ["image", "photo"],
    icon: <Image className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      const url = window.prompt("URL de la imagen:")
      if (url) editor.chain().focus().setImage({ src: url }).run()
    },
  },
  {
    title: "Video de YouTube",
    description: "Insertar video de YouTube",
    searchTerms: ["youtube", "video"],
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
    searchTerms: ["hr", "divider"],
    icon: <Minus className="size-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
])

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    bulletList: { HTMLAttributes: { class: "list-disc ml-6 space-y-1" } },
    orderedList: { HTMLAttributes: { class: "list-decimal ml-6 space-y-1" } },
    blockquote: { HTMLAttributes: { class: "border-l-2 border-foreground/15 pl-6 italic text-muted-foreground" } },
    codeBlock: false,
    horizontalRule: false,
  }),
  HorizontalRule,
  TiptapLink.configure({
    HTMLAttributes: { class: "text-foreground underline underline-offset-2 hover:opacity-70" },
  }),
  TiptapImage.configure({
    HTMLAttributes: { class: "w-full max-w-3xl my-6" },
    allowBase64: true,
  }),
  TiptapUnderline,
  TextStyle,
  Color,
  HighlightExtension.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Youtube.configure({
    HTMLAttributes: { class: "w-full aspect-video my-6" },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") return "Encabezado"
      return "Escribe aquí o usa '/' para insertar bloques..."
    },
    includeChildren: true,
  }),
  Command.configure({
    suggestion: {
      items: () => slashItems,
      render: renderItems,
    },
  }),
]

export interface BlogEditorRef {
  getJSON: () => JSONContent | undefined
  getHTML: () => string | undefined
  getText: () => string | undefined
}

interface BlogEditorProps {
  initialContent?: JSONContent
  initialHtml?: string
  onChange?: (json: JSONContent, text: string, html: string) => void
  className?: string
}

export const BlogEditor = forwardRef<BlogEditorRef, BlogEditorProps>(
  function BlogEditor({ initialContent, initialHtml, onChange, className }, ref) {
    const editorInstanceRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      getJSON: () => editorInstanceRef.current?.getJSON(),
      getHTML: () => editorInstanceRef.current?.getHTML(),
      getText: () => editorInstanceRef.current?.getText(),
    }))

    return (
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className={className}
          immediatelyRender={false}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                "max-w-none focus:outline-none min-h-[50vh] " +
                "[&_h1]:font-display [&_h1]:text-[2rem] [&_h1]:leading-tight [&_h1]:mt-8 [&_h1]:mb-4 " +
                "[&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:leading-tight [&_h2]:mt-6 [&_h2]:mb-3 " +
                "[&_h3]:font-semibold [&_h3]:text-[1.2rem] [&_h3]:mt-4 [&_h3]:mb-2 " +
                "[&_p]:leading-relaxed [&_p]:mb-4 " +
                "[&_img]:rounded-none " +
                "[&_.is-empty]:before:text-muted-foreground/40 [&_.is-empty]:before:float-left [&_.is-empty]:before:content-[attr(data-placeholder)] [&_.is-empty]:before:pointer-events-none",
            },
          }}
          onCreate={({ editor }) => {
            editorInstanceRef.current = editor
            if (initialHtml) {
              editor.commands.setContent(initialHtml)
            }
          }}
          onUpdate={({ editor }) => {
            editorInstanceRef.current = editor
            onChange?.(editor.getJSON(), editor.getText(), editor.getHTML())
          }}
        >
          {/* Slash commands */}
          <EditorCommand className="z-50 h-auto max-h-80 overflow-y-auto bg-card border border-border shadow-lg">
            <EditorCommandEmpty className="px-4 py-3 text-muted-foreground">
              Sin resultados
            </EditorCommandEmpty>
            <EditorCommandList>
              {slashItems.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center justify-center size-9 bg-muted rounded-md shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* Bubble menu on selection */}
          <EditorBubble className="flex items-center gap-0.5 bg-card border border-border shadow-lg px-1.5 py-1 rounded-lg">
            <EditorBubbleItem onSelect={(e) => e.chain().focus().toggleBold().run()}>
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer" title="Negrita">
                <Bold className="size-4" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem onSelect={(e) => e.chain().focus().toggleItalic().run()}>
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer" title="Cursiva">
                <Italic className="size-4" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem onSelect={(e) => e.chain().focus().toggleUnderline().run()}>
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer" title="Subrayado">
                <Underline className="size-4" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem onSelect={(e) => e.chain().focus().toggleStrike().run()}>
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer" title="Tachado">
                <Strikethrough className="size-4" />
              </button>
            </EditorBubbleItem>
            <EditorBubbleItem onSelect={(e) => e.chain().focus().toggleCode().run()}>
              <button className="p-1.5 hover:bg-muted rounded-md cursor-pointer" title="Código">
                <Code className="size-4" />
              </button>
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    )
  }
)
