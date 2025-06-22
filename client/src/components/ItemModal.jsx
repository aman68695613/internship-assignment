
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export default function ItemModal({ item, onClose, onEnquire }) {
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const allImages = [
    item?.coverImage,
    ...(Array.isArray(item?.additionalImages) ? item.additionalImages : []),
  ].filter(Boolean);

  const handleClick = () => {
    if (onEnquire) onEnquire(item.id);
  };

  useEffect(() => {
    if (!api || !isAutoPlaying || allImages.length <= 1) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [api, isAutoPlaying, allImages.length]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  if (!item) return null;

  const goToPrevious = () => api && api.scrollPrev();
  const goToNext = () => api && api.scrollNext();
  const toggleAutoPlay = () => setIsAutoPlaying(!isAutoPlaying);
  const goToSlide = (index) => api && api.scrollTo(index);

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {item?.itemName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Type: {item?.itemType}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-base text-gray-700">{item?.itemDescription}</p>

          <div className="rounded-md overflow-hidden border border-gray-200 shadow-sm relative">
            <Carousel
              className="w-full max-w-2xl mx-auto min-h-[300px] relative"
              setApi={setApi}
            >
              <CarouselContent>
                {allImages.map((img, idx) => (
                  <CarouselItem key={idx} className="flex justify-center">
                    <img
                      src={`http://localhost:5000/uploads/${img}`}
                      alt={`Item ${idx + 1}`}
                      className="max-h-96 w-full object-contain rounded select-none"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x300?text=Image+Not+Found")
                      }
                      draggable={false}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 bg-white/90 text-white hover:bg-purple-100 hover:text-purple-900 border border-gray-300 rounded shadow-sm" />
              <CarouselNext className="right-2 bg-white/90 text-white hover:bg-purple-100 hover:text-purple-900 border border-gray-300 rounded shadow-sm" />
            </Carousel>

            {allImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white text-purple-600 hover:bg-purple-100 border border-purple-300 rounded-full shadow z-10"
                onClick={toggleAutoPlay}
              >
                {isAutoPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}

            {allImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-1 h-1 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-purple-600 scale-125"
                        : "bg-gray-300 hover:bg-purple-300"
                    }`}
                    onClick={() => goToSlide(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex justify-center items-center gap-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="flex items-center gap-1 bg-white text-white hover:bg-purple-100 hover:text-purple-900 border border-gray-300 rounded-md shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-black">
                  {currentIndex + 1} / {allImages.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleAutoPlay}
                  className="p-2 text-purple-600 hover:bg-purple-100 border border-purple-300 rounded-full"
                >
                  {isAutoPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="flex items-center gap-1 bg-white text-white hover:bg-purple-100 hover:text-purple-900 border border-gray-300 rounded-md shadow-sm"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-end pt-4 gap-2">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="bg-transparent text-white hover:text-white hover:bg-red-500 border border-gray-300 rounded shadow-sm"
              >
                <X className="mr-1 h-4 w-4 text-white " />
                Close
              </Button>
            </DialogClose>

            <Button
              onClick={handleClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg px-6 py-2 rounded-md transition-all"
            >
              📩 Enquire
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
