// Gallery photos (local Figma exports until product images are uploaded to Shopify).
// Desktop shows a fixed editorial grid; mobile shows these as a carousel.
export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export const STUDIO_FRONT: GalleryImage = {
  src: "/images/gallery-01-studio-front.jpg",
  alt: "The butter carton standing upright against a bone-coloured studio wall",
  caption: "Studio front",
};

export const IN_HAND: GalleryImage = {
  src: "/images/gallery-03-in-hand.jpg",
  alt: "A hand holding the carton against linen",
  caption: "In hand",
};

export const ON_THE_LEDGE: GalleryImage = {
  src: "/images/gallery-05-on-the-ledge.jpg",
  alt: "The carton on a travertine ledge in window light",
  caption: "On the ledge",
};

export const CHARCOAL_BLOCK: GalleryImage = {
  src: "/images/gallery-06-charcoal-block.jpg",
  alt: "The carton on a charcoal stone block, lit from the side",
  caption: "Charcoal block",
};

export const ROBE_AT_WINDOW: GalleryImage = {
  src: "/images/gallery-robe-at-window.jpg",
  alt: "A woman in a robe at a window, the carton on the sill",
  caption: "At the window",
};

// Figma 14:3885: five slides, in this order.
export const MOBILE_GALLERY = [
  STUDIO_FRONT,
  IN_HAND,
  ON_THE_LEDGE,
  CHARCOAL_BLOCK,
  ROBE_AT_WINDOW,
];
