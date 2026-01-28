"use client";

import { useRef, useState } from 'react';
import { UploadCloud, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import api from '@/lib/api';

export default function UploadZone() {
    const [isDragActive, setIsDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleUpload = async (fileToUpload: File) => {
        setUploadStatus('uploading');
        setMessage('Processing Document...');

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('docName', fileToUpload.name);
        formData.append('workspaceId', '65b2a0c45f4d1a2b3c4d5e6f'); // TODO: Get Real Workspace ID
        formData.append('daysValid', '180');

        try {
            const { data } = await api.post('/intelligence/ingest', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUploadStatus('success');
            // If there is a change summary, we could show it, but for now just success
            setMessage(data.changeSummary ? 'Uploaded version ' + data.details.version + ' (Changes detected!)' : 'Upload Successful');
            setTimeout(() => setUploadStatus('idle'), 3000);
        } catch (error: any) {
            setUploadStatus('error');
            setMessage(error.response?.data?.message || 'Upload Failed');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            handleUpload(e.target.files[0]);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all gap-4 group",
                isDragActive
                    ? "border-amber-400 bg-amber-400/5"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
            )}
        >
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
            />

            <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isDragActive ? "bg-amber-400 text-black" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
            )}>
                {file ? <File /> : <UploadCloud />}
            </div>

            <div className="text-center">
                {uploadStatus === 'uploading' ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-amber-400" />
                        <p className="text-sm text-zinc-300">{message}</p>
                    </div>
                ) : uploadStatus === 'success' ? (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="text-green-400" />
                        <p className="text-sm text-green-400">{message}</p>
                    </div>
                ) : uploadStatus === 'error' ? (
                    <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="text-red-400" />
                        <p className="text-sm text-red-400">{message}</p>
                    </div>
                ) : file ? (
                    <p className="font-semibold text-zinc-200">{file.name}</p>
                ) : (
                    <>
                        <p className="font-medium text-zinc-300">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            PDF up to 10MB
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
