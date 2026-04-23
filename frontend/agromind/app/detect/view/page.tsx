"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Leaf, Loader2 } from "lucide-react";

const DetectPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 📸 Handle Image Upload
  const handleImageChange = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  // 🚀 Detect Disease
  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);
      console.log("dafd" ,formData)

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-700">
        <Leaf /> Disease Detection
      </h1>

      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle>Upload Plant Image</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
            <Upload className="mb-2 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload or drag image
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageChange(e.target.files[0]);
                }
              }}
            />
          </label>

          {/* Preview */}
          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="preview"
                className="w-64 h-64 object-cover rounded-xl shadow"
              />
            </div>
          )}

          {/* Detect Button */}
          <Button
            onClick={handleDetect}
            disabled={!image || loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 size-4" />
                Detecting...
              </>
            ) : (
              "Detect Disease"
            )}
          </Button>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border rounded-xl p-4">
              <h2 className="font-semibold text-lg text-green-700 mb-2">
                Result
              </h2>

              <p>
                🌿 Disease:{" "}
                <span className="font-medium">
                  {result.disease || "Healthy"}
                </span>
              </p>

              <p>
                📊 Confidence:{" "}
                <span className="font-medium">
                  {result.confidence || "N/A"}%
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectPage;