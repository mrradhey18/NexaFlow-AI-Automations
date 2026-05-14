/* ═══════════════════════════════════════════════════════════
   REVIEWFLOW — Client Config  (production v3)

   ADD A NEW CLIENT:
   1. Copy any existing block below
   2. Give it a unique key (e.g. "myclinic")
   3. Update all fields — especially reviewLink
   4. Share the QR/URL:  /review?client=myclinic

   LOGO: set logo to an image path (e.g. "assets/logos/x.png")
         or leave as null to use the emoji fallback.

   COLORS: use https://coolors.co to pick a nice pair.
           primaryGlow should be the primary color at ~25% opacity.
   ═══════════════════════════════════════════════════════════ */

const RF_CLIENTS = {
  /* ── HOMOEOPATHY ─────────────────────────────────────────── */
  pachauri: {
    id:             "pachauri",
    name:           "Dr Pachauri Homoeopathic Clinic",
    tagline:        "Natural healing, lasting relief",
    alternateNames: [
      "Pachauri Homoeopathy",
      "Dr Pachauri Clinic",
      "Pachauri Homeopathic Clinic",
      "the Dr Pachauri team",
    ],
    logoText:    "🌿",
    logo:        "/logo.png/",
    primaryColor: "#16a34a",
    primaryDark:  "#15803d",
    primarySoft:  "rgba(22,163,74,0.10)",
    primaryGlow:  "rgba(22,163,74,0.25)",
    reviewLink:   "https://g.page/r/CW4IgFH6i0TBEBM/review",
    location:     "Indira Nagar, Lucknow",
    category:     "Homoeopathic Doctor",
    geoAreas: [
      "Indira Nagar",
      "Vikas Nagar",
      "Sector 9 Indira Nagar",
      "Sector 11 Indira Nagar",
      "Munshi Pulia",
      "Faizabad Road",
      "Jankipuram",
      "Kursi Road",
    ],
    services: [
      /* — Chronic Diseases — */
      "Arthritis Treatment",
      "Diabetes Management",
      "Thyroid Treatment",
      "Hypertension / High BP",
      "Asthma & Respiratory Care",
      /* — Skin — */
      "Eczema Treatment",
      "Psoriasis Treatment",
      "Acne & Pimples",
      "Urticaria / Skin Allergy",
      "Vitiligo / Leucoderma",
      /* — Digestive — */
      "Acidity & GERD",
      "IBS / Irritable Bowel",
      "Piles / Fistula / Fissure",
      /* — Hair & Scalp — */
      "Hair Fall Treatment",
      "Alopecia Areata",
      "Dandruff & Scalp Issues",
      /* — Women's Health — */
      "PCOD / PCOS",
      "Menstrual Disorders",
      "Leucorrhoea Treatment",
      "Menopause Care",
      /* — Child Health — */
      "Pediatric Homeopathy",
      "Recurrent Cold & Fever in Kids",
      "Bedwetting / Enuresis",
      "Tonsillitis in Children",
      /* — Mind & Nerves — */
      "Anxiety & Stress",
      "Migraine & Headaches",
      "Insomnia / Sleep Disorders",
      "Depression Support",
      /* — General — */
      "General Consultation",
      "Immunity Booster",
      "Kidney Stone (Conservative)",
      "Allergy Treatment",
    ],
    highlights: [
      "no side effects", "natural treatment", "experienced homeopath",
      "chronic disease specialist", "root cause healing", "affordable consultation",
      "personalised medicine", "best homoeopathy in Indira Nagar",
      "gentle and safe treatment", "trusted clinic in Lucknow",
      "best homeopathic doctor in Lucknow",
    ],
    groupStarts: {
      "Arthritis Treatment":    "Chronic Diseases",
      "Eczema Treatment":       "Skin",
      "Acidity & GERD":         "Digestive",
      "Hair Fall Treatment":    "Hair & Scalp",
      "PCOD / PCOS":            "Women's Health",
      "Pediatric Homeopathy":   "Child Health",
      "Anxiety & Stress":       "Mind & Nerves",
      "General Consultation":   "General",
    },
  },
};


/* ── Helper ──────────────────────────────────────────────── */
function RF_getClient(id) {
  return RF_CLIENTS[id] || RF_CLIENTS.pachauri;
}