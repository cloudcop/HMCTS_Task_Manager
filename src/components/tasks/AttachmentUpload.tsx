import { useState } from "react";
import { Upload, X, FileText, Image, Paperclip, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Attachment } from "../../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

export function AttachmentUpload({ attachments, onAttachmentsChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("task-attachments")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("task-attachments")
        .getPublicUrl(filePath);

      const newAttachment: Attachment = {
        name: file.name,
        url: data.publicUrl,
        type: file.type,
        size: file.size,
      };

      onAttachmentsChange([...attachments, newAttachment]);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    onAttachmentsChange(newAttachments);
  };

  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-500" />;
    return <Paperclip className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Attach File"}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </Button>
        <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">
                Add relevant docs or images
            </span>
            <span className="text-[10px] text-muted-foreground/80">
                Max file size: 50MB
            </span>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md border bg-muted/30 text-sm group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getIcon(file.type)}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate hover:underline text-blue-600 dark:text-blue-400"
                >
                  {file.name}
                </a>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}