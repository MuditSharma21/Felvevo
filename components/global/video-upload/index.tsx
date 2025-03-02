"use client";
import { videoUpload } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Loader from "../loader/loader";
import { Download } from "lucide-react";

export const VideoUpload = ({ folderId, workspaceId }: { workspaceId: string; folderId?: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileEnter, setFileEnter] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      await videoUpload(formData, workspaceId, folderId);
  
      toast('File uploaded successfully.');
    } catch (error) {
        console.error("Upload failed", error);
        toast('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container px-4 max-w-5xl mx-auto">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setFileEnter(true);
          }}
          onDragLeave={(_e) => {
            setFileEnter(false);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setFileEnter(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            if (e.dataTransfer.items) {
              [...e.dataTransfer.items].forEach((item) => {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) {
                    setFile(file);
                    handleFileUpload(file);
                  }
                }
              });
            }
          }}
          className={`${fileEnter ? "border-4" : "border-2"} mx-auto  flex flex-col w-full max-w-xs h-72 border-dotted items-center justify-center`}
        >
          <label htmlFor="file" className="h-full flex flex-col justify-center text-center">
            <Download size={50}/>
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                handleFileUpload(selectedFile);
              }
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <object className="rounded-md w-full max-w-xs h-72" data={URL.createObjectURL(file)} />
          <div className="flex gap-4">
            <Button onClick={() => setFile(null)} className="px-4 mt-10 py-2 outline-none rounded-lg">
              Reset
            </Button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-4 text-center">
          <p className="pb-2">Uploading, please wait....</p>
          <Loader state={isUploading} color="white"/>
        </div>
      )}
    </div>
  );
};
