"use client";
import React, { useRef, useState } from "react";
import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void,
    onProgess?: (progress: number) => void,
    fileType? : "image" | "video"
}

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;




export default function FileUpload({onSuccess ,onProgess,fileType}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    const ikUploadRefTest = useRef(null);

    const onError = (err: {message: string}) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };
    
    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        onSuccess(response);
    };
    
    const handleProgress = (evt:ProgressEvent) => {
      if(evt.lengthComputable && onProgess){
        const percentComplete = ((evt.loaded/evt.total) * 100);
        onProgess(Math.round(percentComplete));
      }
    };
    
    const handleStartUpload = () => {
      setUploading(true);
      setError(null);
    };

    const validateFile = (file: File) => {
      if(fileType === "video"){
        if(!file.type.startsWith("video/")){
          setError("Please upload a video file");
          return false;
        }
        if(file.size > 100 * 2024 * 2024){
          setError("Video must be less than 100 MB");
          return false;
        }
      }
      else {
        const validTypes = ["image/jpeg","image/png","image/webp"];
        if(!validTypes.includes(file.type)){
          setError("Please upload a valid file (JPEG, PNG, webP)");
          return false;
        }
        if(file.size > 5 * 2024 * 2024){
          setError("Video must be less than 5 MB");
          return false;
        }
      }
      return false;
    }


  return (
    <div className="App">
      
        <IKUpload
          fileName={fileType=== "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={validateFile}
      
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          transformation={{
            pre: "l-text,i-Imagekit,fs-50,l-end",
            post: [
              {
                type: "transformation",
                value: "w-100",
              },
            ],
          }}
          style={{display: 'none'}} // hide the default input and use the custom upload button
          ref={ikUploadRefTest}
        />
        <p>Custom Upload Button</p>
        {ikUploadRefTest && <button onClick={() => ikUploadRefTest.current.click()}>Upload</button>}
        <p>Abort upload request</p>
        {ikUploadRefTest && <button onClick={() => ikUploadRefTest.current.abort()}>Abort request</button>}
      
      {/* ...other SDK components added previously */}
    </div>
  );
}