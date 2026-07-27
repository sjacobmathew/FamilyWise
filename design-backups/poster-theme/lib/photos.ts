export type Photo = {
  id: string;
  alt: string;
  credit: string;
  creditUrl: string;
};

function unsplashUrl(id: string, width: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const PHOTOS = {
  couple: {
    id: "photo-1632809672893-022d04eb3a96",
    alt: "A couple laughing together in black and white",
    credit: "Deniz Demirci",
    creditUrl: "https://unsplash.com/@ddography",
  },
  parentChild: {
    id: "photo-1652791471426-0b038e1746e9",
    alt: "A mother and daughter sitting together on a couch",
    credit: "Ladislav Stercell",
    creditUrl: "https://unsplash.com/@lacostercell",
  },
  fatherBaby: {
    id: "photo-1492269815085-88eb3ffe14e5",
    alt: "A father holding his baby's hand",
    credit: "Ben White",
    creditUrl: "https://unsplash.com/@benwhitephotography",
  },
  sisters: {
    id: "photo-1505377059067-e285a7bac49b",
    alt: "Two sisters laughing together",
    credit: "Caroline Hernandez",
    creditUrl: "https://unsplash.com/@carolinehdz",
  },
  friends: {
    id: "photo-1596998722006-9bf9336bb13a",
    alt: "Two friends standing together in a grass field",
    credit: "Foto Phanatic",
    creditUrl: "https://unsplash.com/@j_b_foto",
  },
  coupleWindow: {
    id: "photo-1736517425687-617ef7150e99",
    alt: "A couple standing together next to a window",
    credit: "Chidy Young",
    creditUrl: "https://unsplash.com/@ychidy",
  },
  boysRunning: {
    id: "photo-1451481454041-104482d8e284",
    alt: "Three boys running together on a field",
    credit: "Jordan Whitt",
    creditUrl: "https://unsplash.com/@jwwhitt",
  },
} satisfies Record<string, Photo>;

export function photoSrc(photo: Photo, width: number) {
  return unsplashUrl(photo.id, width);
}

export const CATEGORY_PHOTOS: Record<string, Photo> = {
  Parenting: PHOTOS.parentChild,
  Relationships: PHOTOS.couple,
  Personality: PHOTOS.sisters,
};
