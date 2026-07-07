import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { convexQuery } from "@convex-dev/react-query";
import { useDevultur } from "@devultur/convex/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import { Loader2, Pencil, Save, Undo2, Upload, X } from "lucide-react";
import { motion, useAnimationControls } from "motion/react";

import { api } from "@convex/_generated/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

import { ImageUpload } from "#/components/image-upload";
import { LandingPreview } from "#/components/landing/landing-preview";
import { mediaKeyFromUrl } from "#/lib/media";

export const Route = createFileRoute("/admin/_layout/content")({
  component: ContentPage,
});

type FieldDef = { key: string; label: string; long: boolean; aspect?: string };
type Section = { label: string; keys: FieldDef[] };

const sections: Section[] = [
  {
    label: "Hero",
    keys: [
      { key: "hero.title", label: "Título", long: false },
      { key: "hero.subtitle", label: "Subtítulo", long: true },
      { key: "hero.cta", label: "Botón CTA", long: false },
      { key: "hero.image", label: "Imagen de fondo", long: false, aspect: "16/9" },
    ],
  },
  {
    label: "Servicios",
    keys: [
      { key: "services.label", label: "Etiqueta", long: false },
      { key: "services.heading", label: "Título de sección", long: false },
      { key: "services.1.title", label: "Servicio 1 — Título", long: false },
      { key: "services.1.description", label: "Servicio 1 — Descripción", long: true },
      { key: "services.1.image", label: "Servicio 1 — Imagen", long: false, aspect: "4/3" },
      { key: "services.2.title", label: "Servicio 2 — Título", long: false },
      { key: "services.2.description", label: "Servicio 2 — Descripción", long: true },
      { key: "services.2.image", label: "Servicio 2 — Imagen", long: false, aspect: "4/3" },
      { key: "services.3.title", label: "Servicio 3 — Título", long: false },
      { key: "services.3.description", label: "Servicio 3 — Descripción", long: true },
      { key: "services.3.image", label: "Servicio 3 — Imagen", long: false, aspect: "4/3" },
    ],
  },
  {
    label: "Sobre Mí",
    keys: [
      { key: "about.label", label: "Etiqueta", long: false },
      { key: "about.title", label: "Nombre", long: false },
      { key: "about.bio", label: "Bio (párrafo 1)", long: true },
      { key: "about.bio2", label: "Bio (párrafo 2)", long: true },
      { key: "about.image", label: "Imagen", long: false, aspect: "3/4" },
    ],
  },
  {
    label: "Cursos",
    keys: [
      { key: "courses.label", label: "Etiqueta", long: false },
      { key: "courses.heading", label: "Título de sección", long: false },
    ],
  },
  {
    label: "Testimonios",
    keys: [
      { key: "testimonials.label", label: "Etiqueta", long: false },
      { key: "testimonials.heading", label: "Título de sección", long: false },
      { key: "testimonials.1.name", label: "Testimonio 1 — Nombre", long: false },
      { key: "testimonials.1.text", label: "Testimonio 1 — Texto", long: true },
      { key: "testimonials.2.name", label: "Testimonio 2 — Nombre", long: false },
      { key: "testimonials.2.text", label: "Testimonio 2 — Texto", long: true },
      { key: "testimonials.3.name", label: "Testimonio 3 — Nombre", long: false },
      { key: "testimonials.3.text", label: "Testimonio 3 — Texto", long: true },
    ],
  },
  {
    label: "Contacto",
    keys: [
      { key: "contact.label", label: "Etiqueta", long: false },
      { key: "contact.heading", label: "Título", long: false },
      { key: "contact.description", label: "Descripción", long: true },
    ],
  },
];

const isImageKey = (key: string) => key.endsWith(".image");

function ContentField({
  fieldKey,
  label,
  long,
  isEditing,
  hasDraft,
  displayValue,
  editValue,
  pulseKey,
  onEdit,
  onEditValueChange,
  onSave,
  onCancel,
  saving,
}: {
  fieldKey: string;
  label: string;
  long: boolean;
  isEditing: boolean;
  hasDraft: boolean;
  displayValue: string;
  editValue: string;
  pulseKey: number;
  onEdit: () => void;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (pulseKey > 0) {
      controls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3, ease: "easeOut" },
      });
    }
  }, [pulseKey, controls]);

  return (
    <motion.div
      data-field={fieldKey}
      animate={controls}
      className={`p-3 rounded-sm ${isEditing ? "bg-muted" : "hover:bg-muted/50 cursor-pointer"} ${hasDraft && !isEditing ? "bg-muted/30 ring-1 ring-foreground/5" : ""}`}
    >
      {isEditing ? (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
          {long ? (
            <textarea
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onEditValueChange(e.target.value)}
              className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditValueChange(e.target.value)}
              autoFocus
              className="text-sm"
            />
          )}
          <div className="flex gap-2 mt-2">
            <Button size="xs" onClick={onSave} disabled={saving || !editValue || editValue === displayValue}>
              {saving ? (
                <Loader2 data-icon="inline-start" className="size-3 animate-spin" />
              ) : (
                <Save data-icon="inline-start" className="size-3" />
              )}
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="ghost" size="xs" onClick={onCancel}>
              <X data-icon="inline-start" className="size-3" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2 group" onClick={onEdit}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs text-muted-foreground">{label}</p>
              {hasDraft && <span className="size-1.5 rounded-full bg-foreground/40" />}
            </div>
            <p className="text-sm break-words line-clamp-2">
              {displayValue || <span className="text-muted-foreground/40 italic">vacío</span>}
            </p>
          </div>
          <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
        </div>
      )}
    </motion.div>
  );
}

function ImageContentField({
  label,
  aspect,
  hasDraft,
  displayUrl,
  token,
  onUploadUrl,
  onChangeUrl,
}: {
  label: string;
  aspect: string;
  hasDraft: boolean;
  displayUrl: string;
  token: string | null;
  onUploadUrl: (file: File) => Promise<{ url: string; key: string }>;
  onChangeUrl: (url: string | null) => void;
}) {
  return (
    <div className={`p-3 rounded-sm ${hasDraft ? "bg-muted/30 ring-1 ring-foreground/5" : ""}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {hasDraft && <span className="size-1.5 rounded-full bg-foreground/40" />}
      </div>
      <ImageUpload
        value={displayUrl || null}
        onChange={onChangeUrl}
        onUploadUrl={onUploadUrl}
        token={token}
        aspectRatio={aspect}
      />
    </div>
  );
}

function ContentPage() {
  const { data: allContent } = useQuery(convexQuery(api.siteContent.listAll, {}));
  const { data: hasDrafts } = useQuery(convexQuery(api.siteContent.hasDrafts, {}));
  const saveDraft = useMutation(api.siteContent.saveDraft);
  const publishAll = useMutation(api.siteContent.publishAll);
  const discardDrafts = useMutation(api.siteContent.discardDrafts);
  const translateAction = useAction(api.ai.translateText);
  const { token: viewerToken, uploadUrl, deleteMedia } = useDevultur();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pulseCounter, setPulseCounter] = useState(0);
  const editorPanelRef = useRef<HTMLDivElement>(null);

  const contentMap = useMemo(() => new Map((allContent ?? []).map((c) => [c.key, c])), [allContent]);

  const startEdit = useCallback(
    (key: string, scrollIntoView = false) => {
      const content = contentMap.get(key);
      const displayValue = content?.draftValue?.es ?? content?.value.es ?? "";
      setEditingKey(key);
      setEditValue(displayValue);
      setPulseCounter((c) => c + 1);

      if (!scrollIntoView) return;
      setTimeout(() => {
        const panel = editorPanelRef.current;
        const el = panel?.querySelector(`[data-field="${key}"]`) as HTMLElement | null;
        if (panel && el) {
          const panelRect = panel.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const targetScroll =
            panel.scrollTop + (elRect.top - panelRect.top) - panelRect.height / 2 + elRect.height / 2;
          panel.scrollTo({ top: targetScroll, behavior: "smooth" });
          const input = el.querySelector<HTMLElement>("input, textarea");
          input?.focus();
        }
      }, 50);
    },
    [contentMap],
  );

  const handleFieldClick = useCallback((key: string) => startEdit(key, true), [startEdit]);

  const handleSave = async () => {
    if (!editingKey || !editValue) return;

    const current = contentMap.get(editingKey);
    const originalValue = current?.draftValue?.es ?? current?.value.es ?? "";
    if (editValue === originalValue) {
      setEditingKey(null);
      return;
    }

    setSaving(true);

    let en = editValue;
    if (!isImageKey(editingKey)) {
      try {
        const result = await translateAction({ text: editValue });
        en = result.translated;
      } catch {
        en = editValue;
      }
    }

    await saveDraft({
      key: editingKey,
      value: { es: editValue, en },
      type: isImageKey(editingKey) ? "image" : "text",
    });
    setSaving(false);
    setEditingKey(null);
  };

  // Deletes the devultur object behind a URL, if it is one we own.
  const deleteMediaUrl = useCallback(
    (url: string | undefined) => {
      if (!url) return;
      const key = mediaKeyFromUrl(url);
      if (key) deleteMedia(key);
    },
    [deleteMedia],
  );

  // Saves a new image URL (or clears it) as a draft, without touching the
  // published object — that only changes on publish/discard so edits stay
  // reversible. A prior *unpublished* draft upload is orphaned now, so drop it.
  const saveImageDraft = useCallback(
    (key: string, url: string | null) => {
      const current = contentMap.get(key);
      const publishedUrl = current?.value.es ?? "";
      const prevDraftUrl = current?.draftValue?.es;
      if (prevDraftUrl && prevDraftUrl !== publishedUrl && prevDraftUrl !== url) {
        deleteMediaUrl(prevDraftUrl);
      }
      const value = url ?? "";
      saveDraft({ key, value: { es: value, en: value }, type: "image" });
    },
    [contentMap, deleteMediaUrl, saveDraft],
  );

  const handlePublish = async () => {
    setPublishing(true);
    // Old published images that a draft replaces or removes become orphaned once
    // the draft is promoted — delete them only after the publish succeeds.
    const orphanedUrls = (allContent ?? [])
      .filter((c) => c.type === "image" && c.draftValue !== undefined && c.draftValue.es !== c.value.es)
      .map((c) => c.value.es);
    await publishAll();
    orphanedUrls.forEach(deleteMediaUrl);
    setPublishing(false);
  };

  const handleDiscard = async () => {
    // Draft image uploads being thrown away are orphaned — delete them after the
    // drafts are cleared (published objects are untouched).
    const orphanedUrls = (allContent ?? [])
      .filter((c) => c.type === "image" && c.draftValue !== undefined && c.draftValue.es !== c.value.es)
      .map((c) => c.draftValue?.es);
    await discardDrafts();
    orphanedUrls.forEach(deleteMediaUrl);
  };

  const draftCount = allContent?.filter((c) => c.draftValue !== undefined).length ?? 0;

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)]">
      {/* Left: Editor */}
      <div className="w-[420px] shrink-0 border-r border-border flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h1 className="font-display text-lg mb-1">Contenido del Sitio</h1>
          <p className="text-sm text-muted-foreground">Escribe en español. Se traduce al guardar.</p>
        </div>

        {hasDrafts && (
          <div className="px-5 py-3 border-b border-border bg-muted flex items-center justify-between">
            <span className="text-sm">
              <Badge variant="outline" className="mr-2">
                {draftCount}
              </Badge>
              {draftCount === 1 ? "cambio pendiente" : "cambios pendientes"}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleDiscard}>
                <Undo2 data-icon="inline-start" className="size-3.5" />
                Descartar
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={publishing}>
                {publishing ? (
                  <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                ) : (
                  <Upload data-icon="inline-start" className="size-3.5" />
                )}
                Publicar
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scroll-smooth px-5 py-4" ref={editorPanelRef}>
          {sections.map((section) => (
            <div key={section.label} className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                {section.label}
              </h2>
              <div className="space-y-1.5">
                {section.keys.map(({ key, label, long, aspect }) => {
                  const content = contentMap.get(key);
                  const isEditing = editingKey === key;
                  const hasDraft = content?.draftValue !== undefined;
                  const displayValue = hasDraft ? content?.draftValue?.es : content?.value.es;

                  if (isImageKey(key)) {
                    return (
                      <ImageContentField
                        key={key}
                        label={label}
                        aspect={aspect ?? "16/9"}
                        hasDraft={hasDraft}
                        displayUrl={displayValue ?? ""}
                        token={viewerToken}
                        onUploadUrl={uploadUrl}
                        onChangeUrl={(url) => saveImageDraft(key, url)}
                      />
                    );
                  }

                  return (
                    <ContentField
                      key={key}
                      fieldKey={key}
                      label={label}
                      long={long}
                      isEditing={isEditing}
                      hasDraft={hasDraft}
                      displayValue={displayValue ?? ""}
                      editValue={editValue}
                      pulseKey={isEditing ? pulseCounter : 0}
                      onEdit={() => startEdit(key)}
                      onEditValueChange={setEditValue}
                      onSave={handleSave}
                      onCancel={() => setEditingKey(null)}
                      saving={saving}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Live preview */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" data-scroll-container>
        <LandingPreview onFieldClick={handleFieldClick} />
      </div>
    </div>
  );
}
