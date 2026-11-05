"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  label?: string;
}

interface MediaCarouselProps {
  mainImage: string;
  alt?: string;
  screenshots?: string[];
  videos?: string[];
}

function parseVideoEmbed(url: string): { isEmbed: boolean; embedUrl: string } {
  if (!url) return { isEmbed: false, embedUrl: "" };

  const ytWatchMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytWatchMatch && ytWatchMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}`,
    };
  }

  const ytEmbedMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed|shorts)\/([a-zA-Z0-9_-]+)/
  );
  if (ytEmbedMatch && ytEmbedMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytEmbedMatch[1]}`,
    };
  }

  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { isEmbed: false, embedUrl: url };
}

export default function MediaCarousel({
  mainImage,
  alt = "Project Preview",
  screenshots = [],
  videos = [],
}: MediaCarouselProps) {
  const mediaList: MediaItem[] = [];

  if (mainImage) {
    mediaList.push({ type: "image", url: mainImage, label: "Hero Thumbnail" });
  }

  screenshots.forEach((s, idx) => {
    if (s && s !== mainImage) {
      mediaList.push({
        type: "image",
        url: s,
        label: `Screenshot ${idx + 1}`,
      });
    }
  });

  videos.forEach((v, idx) => {
    if (v) {
      mediaList.push({
        type: "video",
        url: v,
        label: `Demo Video ${idx + 1}`,
      });
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  if (mediaList.length === 0) {
    return null;
  }

  const currentItem = mediaList[currentIndex] || mediaList[0];
  const transitionDuration = reduceMotion ? 0 : 0.3;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const renderMedia = (item: MediaItem, isModal: boolean = false) => {
    if (item.type === "video") {
      const { isEmbed, embedUrl } = parseVideoEmbed(item.url);
      if (isEmbed) {
        return (
          <iframe
            src={embedUrl}
            title={item.label || "Project Demo Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        );
      }
      return (
        <video
          src={item.url}
          controls
          playsInline
          className="h-full w-full bg-black object-contain"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <div className="relative h-full w-full">
        <Image
          src={item.url}
          alt={alt}
          fill
          sizes={isModal ? "100vw" : "(max-width: 1024px) 100vw, 1200px"}
          priority={currentIndex === 0}
          className={`object-contain transition-transform duration-300 ${
            isModal ? "" : "group-hover:scale-[1.01]"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="group relative aspect-video w-full overflow-hidden border border-line bg-paper-deep">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
            className="flex h-full w-full items-center justify-center"
          >
            {renderMedia(currentItem)}
          </motion.div>
        </AnimatePresence>

        {mediaList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Media"
              className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-paper-deep/90 text-ink transition-colors hover:border-accent hover:text-accent-ink"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Media"
              className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-paper-deep/90 text-ink transition-colors hover:border-accent hover:text-accent-ink"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 border border-line-strong bg-paper-deep/90 px-3 py-1 font-mono text-meta uppercase text-ink">
              {currentItem.type === "video" ? (
                <VideoIcon className="size-3 text-accent-ink" />
              ) : (
                <ImageIcon className="size-3 text-accent-ink" />
              )}
              <span>
                {currentIndex + 1} / {mediaList.length}
              </span>
            </div>
          </>
        )}

        {currentItem.type === "image" && (
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Expand Image"
            title="Expand fullscreen"
            className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center border border-line-strong bg-paper-deep/90 text-ink transition-colors hover:border-accent hover:text-accent-ink"
          >
            <Maximize2 className="size-4" />
          </button>
        )}
      </div>

      {mediaList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {mediaList.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-video w-24 shrink-0 overflow-hidden border-2 transition-all sm:w-28 ${
                  isSelected
                    ? "border-accent"
                    : "border-line opacity-60 hover:opacity-100"
                }`}
              >
                {item.type === "video" ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-paper-raised text-[10px] text-accent-ink">
                    <Play className="size-4 fill-accent-ink text-accent-ink" />
                    <span>Video</span>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.label || "Thumbnail"}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && currentItem.type === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 text-white sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 z-50 flex size-11 items-center justify-center border border-white/40 text-white transition-colors hover:text-accent-ink"
              aria-label="Close Lightbox"
            >
              <X className="size-6" />
            </button>

            <div
              className="relative aspect-video max-h-[88vh] w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              {renderMedia(currentItem, true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
