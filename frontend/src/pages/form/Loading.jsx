import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function Loading() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Counter logic
  useEffect(() => {
    let interval;
    if (loading) {
      setCount(0); // reset when loading starts
      interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000); // increase every 1 second
    }
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div>
      {/* Button to show loading */}
      <button
        onClick={() => setLoading(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Show loading
      </button>

      {/* Dialog for loading */}
    <Dialog open={loading} onOpenChange={() => {}}>
  <DialogContent
    className="flex items-center justify-center p-0 border-none bg-transparent shadow-none"
    onInteractOutside={(e) => e.preventDefault()}
    onEscapeKeyDown={(e) => e.preventDefault()}
  >
    {/* Remove the default close button */}
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center w-[600px] h-[320px] space-y-6 p-6 relative">
        
        {/* Circle Loader with Counter */}
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-500 border-t-transparent"></div>
          <span className="absolute text-2xl font-bold text-blue-600">
            {count}
          </span>
        </div>

        <p className="text-lg font-semibold text-gray-700">
          Please wait...
        </p>
        <p className="text-sm text-gray-500">Processing your request</p>
      </div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
}

export default Loading;
