/* ═══════════════════════════════════════════════════════════
   REVIEWFLOW — Phrase Engine + App Logic  (production v3)
   No AI required. High-variation natural language generation.
   ═══════════════════════════════════════════════════════════ */

/* ── Utility ──────────────────────────────────────────────── */
const pick   = arr => arr[Math.floor(Math.random() * arr.length)];
const pickN  = (arr, n) => [...arr].sort(() => Math.random() - .5).slice(0, Math.min(n, arr.length));
const chance = p => Math.random() < p;

/* ═══════════════════════════════════════════════════════════
   PHRASE POOLS
   ═══════════════════════════════════════════════════════════ */
const PHRASES = {

/* ── INTROS ─────────────────────────────────────────────── */
  intro: [
    /* English */
    n => `Just visited ${n} and wanted to share my experience.`,
    n => `Went to ${n} recently and felt it deserved a proper review.`,
    n => `Had a visit to ${n} last week — here's what I thought.`,
    n => `I've been meaning to leave a review for ${n} for a while now.`,
    n => `Came across ${n} and decided to give it a try.`,
    n => `My experience at ${n} was genuinely worth writing about.`,
    n => `Chose ${n} based on the reviews and wasn't disappointed.`,
    n => `Visited ${n} on a recommendation from a friend.`,
    n => `Finally decided to try ${n} after seeing it mentioned a few times.`,
    n => `Was looking for a good place nearby and ended up at ${n}.`,
    n => `Took a chance on ${n} and I'm really glad I did.`,
    n => `Dropped by ${n} recently and had a memorable visit.`,
    n => `My visit to ${n} was memorable for the right reasons.`,
    n => `I was a little hesitant before visiting ${n}, but I'm glad I went.`,
    n => `${n} came up as a suggestion and it really did not disappoint.`,

    /* Hinglish */
    n => `Kaafi time se ek acha doctor dhoondh raha tha — ${n} mein aake bahut acha laga.`,
    n => `Bahut dino se takleef thi, ${n} gaya aur bahut relief mila.`,
    n => `Ek dost ne ${n} suggest kiya tha, aur bilkul sahi kiya.`,
    n => `Pehli baar ${n} gaya tha, lekin experience itna acha tha ki review likhna zaruri laga.`,
    n => `Suna tha ${n} ke baare mein, aaj khud ja ke dekha — disappointed nahi hua.`,
    n => `${n} ka naam kuch logo ne suggest kiya tha — finally visit kiya aur acha laga.`,
    n => `Pehle thoda hesitation tha, par ${n} jaake pata chala ye sach mein ek acha clinic hai.`,

    /* Hindi */
    n => `${n} mein apna anubhav sabke saath share karna chahta tha.`,
    n => `Kai logo ki salah par ${n} gaya — aur wakai achha laga.`,
    n => `Pehli baar ${n} gaya tha, lekin treatment aur staff dono ne bahut accha impression chhoda.`,
  ],

  /* ── SERVICE EXPERIENCE (per rating) ────────────────────── */
  experience: {
    5: [
      (s,n) => `The ${s} was absolutely top-notch — couldn't have asked for better.`,
      (s,n) => `I came in for ${s} and ${n} delivered well beyond my expectations.`,
      (s,n) => `The ${s} experience was flawless from start to finish.`,
      (s,n) => `Honestly one of the best ${s} sessions I've had anywhere.`,
      (s,n) => `The ${s} was handled with real expertise and genuine care.`,
      (s,n) => `Everything about the ${s} was first-class.`,
      (s,n) => `I've tried a few places for ${s} — ${n} is on another level.`,
      (s,n) => `The ${s} was done to perfection and the results showed it.`,
      (s,n) => `Such a smooth and impressive ${s} experience — felt genuinely looked after.`,
      (s,n) => `I left feeling really satisfied with the ${s} — it exceeded what I hoped for.`,
      (s,n) => `The ${s} was handled so professionally — you can tell the team knows their stuff.`,
      (s,n) => `Got exactly what I came for with the ${s}, and then some.`,
      (s,n) => `The quality of the ${s} at ${n} is genuinely impressive.`,
      (s,n) => `They made the whole ${s} process so easy and pleasant.`,
      (s,n) => `Came in for ${s} — left completely impressed by the quality of care.`,
      (s,n) => `The ${s} service here sets a high bar. Really satisfied.`,
      (s,n) => `${n} really nailed the ${s} — thorough, precise, and comfortable.`,
      /* "best of" GBP boosters — fire occasionally via the pool rotation */
      (s,n) => `If you're looking for the best homeopathic doctor in Lucknow for ${s}, this is genuinely it.`,
      (s,n) => `Came in for ${s} — honestly the best homeopathic experience I've had in Lucknow.`,
      (s,n) => `I've visited a few clinics in Lucknow but ${n} is clearly the best for ${s}.`,
      (s,n) => `For ${s} in Lucknow, I don't think you'll find better natural treatment than this.`,
      (s,n) => `The ${s} here reminded me why Dr Pachauri is called the best homeopathic doctor in Indira Nagar.`,
      /* Hindi/Hinglish boosters */
      (s,n) => `${s} ke liye Lucknow mein Dr Pachauri se behtar koi nahi — yeh ab mera personal experience hai.`,
      (s,n) => `${s} ka itna acha aur safe ilaj pehle kabhi nahi mila — Dr Pachauri clinic ne sach mein help ki.`,
    ],
    4: [
      (s,n) => `The ${s} was done really well and I'm happy with the outcome.`,
      (s,n) => `Visited for ${s} and the experience was very positive overall.`,
      (s,n) => `The ${s} was handled professionally and the results were great.`,
      (s,n) => `Good solid ${s} experience — the team clearly knows what they're doing.`,
      (s,n) => `The ${s} went smoothly and I felt well taken care of.`,
      (s,n) => `Really pleased with how the ${s} turned out.`,
      (s,n) => `The ${s} was high quality — no complaints from me.`,
      (s,n) => `${n} delivered a genuinely good ${s} experience.`,
      (s,n) => `I appreciated the care put into the ${s} — well done overall.`,
      (s,n) => `Came in for ${s} and left satisfied. Would come back.`,
      (s,n) => `The ${s} experience was comfortable and the results were great.`,
      (s,n) => `The ${s} was efficient, professional, and good value.`,
      (s,n) => `Felt confident in the ${s} being done right — and it was.`,
      (s,n) => `The team took their time with the ${s} and it made a real difference.`,
      (s,n) => `Very happy with the ${s} — handled with care and competence.`,
    ],
    3: [
      (s,n) => `The ${s} was decent — not perfect but pretty satisfactory overall.`,
      (s,n) => `Had my ${s} done here. It was fine — does what it's supposed to.`,
      (s,n) => `The ${s} was okay — met expectations without really standing out.`,
      (s,n) => `Not bad for ${s} — there's room to improve but it worked out.`,
      (s,n) => `The ${s} was done alright. A few things could be smoother.`,
      (s,n) => `Average ${s} experience — okay for the price but nothing special.`,
      (s,n) => `The ${s} was passable — got the job done but wasn't exceptional.`,
      (s,n) => `Fair experience with the ${s} — some good moments, some not so much.`,
      (s,n) => `The ${s} was reasonable. Wouldn't go out of my way but it's fine.`,
      (s,n) => `Came for ${s} and it was okay — could be a bit more polished.`,
    ],
    2: [
      (s,n) => `The ${s} didn't quite meet my expectations, honestly.`,
      (s,n) => `Had the ${s} done here — it was a bit disappointing.`,
      (s,n) => `The ${s} experience was underwhelming compared to what I hoped for.`,
      (s,n) => `A few things during the ${s} didn't sit right with me.`,
      (s,n) => `Not the best experience with the ${s} — could do better.`,
      (s,n) => `The ${s} left something to be desired, unfortunately.`,
      (s,n) => `The ${s} was below what I'd expect for the price.`,
      (s,n) => `Things didn't go as hoped with my ${s} visit.`,
    ],
    1: [
      (s,n) => `My ${s} visit at ${n} wasn't a good experience overall.`,
      (s,n) => `The ${s} left me quite disappointed — I hope things improve.`,
      (s,n) => `I had issues with how the ${s} was handled from start to finish.`,
      (s,n) => `Unfortunately my ${s} visit was quite a struggle.`,
      (s,n) => `The ${s} did not meet even basic expectations for me.`,
      (s,n) => `Quite a frustrating experience with the ${s}, to be honest.`,
      (s,n) => `The ${s} here really needs a lot of work before I'd consider returning.`,
    ],
  },

  /* ── HIGHLIGHT PHRASES ───────────────────────────────────── */
  highlights: {
    positive: [
      h => `The ${h} really made a difference.`,
      h => `I especially appreciated the ${h}.`,
      h => `Really stood out to me: the ${h}.`,
      h => `What I liked most was the ${h}.`,
      h => `The ${h} was a genuine highlight.`,
      h => `You could really tell from the ${h}.`,
      h => `The ${h} made the whole visit much better.`,
      h => `Particularly impressed by the ${h}.`,
      h => `Worth mentioning the ${h} — very good.`,
      h => `The ${h} was exactly what I was hoping for.`,
    ],
    neutral: [
      h => `The ${h} was okay.`,
      h => `I noticed the ${h}, which was fair enough.`,
      h => `The ${h} was adequate.`,
      h => `Nothing wrong with the ${h}.`,
      h => `The ${h} could be better but was acceptable.`,
    ],
    negative: [
      h => `The ${h} wasn't really up to the mark.`,
      h => `I did notice issues with the ${h}.`,
      h => `The ${h} left a lot to be desired.`,
      h => `I expected more from the ${h}.`,
      h => `The ${h} needs attention.`,
    ],
  },

  /* ── CONNECTORS ──────────────────────────────────────────── */
  connectors: [
    "On top of that,", "To add to that,", "What's more,",
    "And beyond that,", "Additionally,", "I should also mention —",
    "Worth adding:", "Also worth noting,", "Another thing I noticed:",
  ],

  /* ── SECOND SENTENCES (30% chance) ──────────────────────── */
  secondSentence: {
    positive: [
      n => `The whole team at ${n} made me feel genuinely welcome.`,
      n => `Everyone I interacted with at ${n} was professional and helpful.`,
      n => `${n} clearly takes pride in the service they offer.`,
      n => `The attention to detail at ${n} is something you notice right away.`,
      n => `It's clear ${n} cares about more than just getting the job done.`,
      n => `The overall atmosphere at ${n} added to the positive experience.`,
      () => `Everything felt smooth and well-organised from start to finish.`,
      () => `The level of care shown throughout the visit was really appreciated.`,
      () => `From booking to leaving, everything was handled well.`,
      () => `Felt comfortable and in good hands the whole time.`,
      () => `No unnecessary waiting, no confusion — just good service.`,
      () => `It's the kind of experience that makes you want to come back.`,
      /* "best of" boosters */
      () => `Easily the best homeopathic clinic in Lucknow I've visited.`,
      () => `I've tried a few doctors in Lucknow — none approach it like this.`,
      n => `${n} has earned a real reputation as the best homeopathic clinic in Indira Nagar.`,
      () => `Genuinely the best homeopathic doctor in Lucknow for anyone wanting lasting relief.`,
      () => `This is what natural, trusted healthcare in Lucknow actually looks like.`,
      () => `Indira Nagar mein itna acha homeopathic doctor milna mushkil hai — bahut impressed tha.`,
      () => `Sabse acha homeopathic clinic Lucknow mein — bilkul sahi jagah hai yeh.`,
      /* Hindi boosters */
      () => `Lucknow mein homeopathy ka naam aata hai to Dr Pachauri ka naam sabse pehle aata hai.`,
      n => `${n} ne sach mein meri zindagi badal di — itna acha treatment pehle kabhi nahi mila.`,
      () => `Indira Nagar ke logo ke liye yeh clinic ek vardaan hai.`,
    ],
    neutral: [
      n => `${n} has the basics right, but a few things could be refined.`,
      () => `The experience was functional — just not particularly memorable.`,
      () => `Things were handled competently, though not exceptionally.`,
      () => `Would've appreciated a bit more attention to detail, but it was fine.`,
      () => `Not a bad visit, just not one that really stood out.`,
    ],
    negative: [
      n => `I do hope ${n} takes feedback seriously and makes improvements.`,
      () => `The potential is there, but the execution needs work.`,
      () => `I'd genuinely like to see this place improve — it has potential.`,
      () => `The basics need to be sorted before I'd feel confident recommending it.`,
      () => `Happy to revise this review if things do improve over time.`,
    ],
  },

  /* ── CLOSINGS ────────────────────────────────────────────── */
  closing: {
    positive: [
      /* English */
      n => `Would definitely recommend ${n} to anyone looking for this kind of service.`,
      n => `Highly recommend ${n} — a genuinely great experience.`,
      n => `If you're in the area and need this service, ${n} is a solid choice.`,
      n => `Will definitely be returning to ${n} when I need this again.`,
      n => `Really glad I chose ${n}. Will be back for sure.`,
      () => `Highly recommended. Worth every bit.`,
      () => `Wouldn't hesitate to come back or recommend to a friend.`,
      () => `One of the better experiences I've had in a while. Good job.`,
      () => `Very happy with the visit. Recommended without hesitation.`,
      () => `Top marks from me — would happily recommend this place.`,
      () => `Solid experience all around. Would come back without a second thought.`,
      () => `Definitely give them a try — you won't regret it.`,
      () => `Happy to recommend this to friends and family.`,
      () => `Will be returning and will be bringing friends along too.`,
      () => `Solid, reliable, and worth every rupee.`,

      /* Hinglish */
      n => `Main definitely ${n} ko apne doston aur family ko recommend karunga.`,
      n => `${n} ek baar zaroor visit karein — bahut acha experience raha.`,
      () => `Bilkul recommend karunga — paisa aur time dono worth it tha.`,
      () => `Agli baar bhi yahi aaunga, aur saath mein kisi ko bhi le aaunga.`,
      () => `Sach mein bahut acha experience raha — highly recommended.`,

      /* Hindi */
      n => `Main ${n} ko zaroor recommend karunga apne parichit logo ko.`,
      () => `Yahan ka anubhav bahut achha raha — dobara aana pakka hai.`,
      () => `Bahut santushti mili — aage bhi yahaan hi aaunga.`,
    ],
   geo: [
    /* English */
    (n, area) => `If you're anywhere in ${area} or nearby, this is honestly the best homeopathic clinic in Lucknow to visit.`,
    (n, area) => `Best homeopathic doctor I've found in Lucknow — and I've asked around in ${area}.`,
    (n, area) => `People in ${area} are lucky to have a clinic like this so close.`,
    (n, area) => `Would recommend to anyone around ${area} looking for genuine homeopathic care in Lucknow.`,
    (n, area) => `Genuinely one of the best homeopathic clinics in Lucknow — worth the trip even from ${area}.`,
    (n, area) => `Asked around in ${area} for a good homeopathic doctor and this name kept coming up — now I know why.`,
    () => `Honestly the best homeopathic experience I've had in Lucknow.`,
    () => `If you're looking for a trusted homeopathic doctor in Lucknow, look no further.`,
    () => `Hard to find homeopathic care this good anywhere in Lucknow — really impressed.`,
    () => `Best homeopathic clinic in Lucknow — hands down.`,
    () => `Trusted natural healing in Lucknow — this clinic sets the standard.`,
    /* Hinglish */
    (n, area) => `${area} walon ke liye to yeh best homeopathic clinic in Lucknow hai — ekdum sahi jagah.`,
    (n, area) => `Maine ${area} aur aas paas kai doctors try kiye — Dr Pachauri jaisa koi nahi.`,
    () => `Poore Lucknow mein best homeopathic doctor — yahan ek baar zaroor aana chahiye.`,
    () => `Lucknow ka sabse acha homeopathic clinic — yeh kehna bilkul galat nahi hoga.`,
    /* Hindi */
    (n, area) => `${area} mein rehne walon ko bahut khushi hogi ki itna acha homeopathic doctor paas mein hai.`,
    () => `Lucknow mein homeopathic ilaj ke liye sabse bharosemand jagah — Dr Pachauri clinic.`,
    () => `Kai logo ne Indira Nagar mein Dr Pachauri ka naam suggest kiya tha — aaj samajh aaya kyun.`,
    () => `Bina kisi side effect ke itna acha treatment — sirf Dr Pachauri clinic mein milta hai Lucknow mein.`,
  ],

    neutral: [
      n => `${n} is okay for a quick visit — just manage expectations a bit.`,
      () => `Might give it another try with adjusted expectations.`,
      () => `Worth trying, but be aware it's fairly standard.`,
      () => `Fine for a one-off visit — nothing more, nothing less.`,
    ],
  },

  negativeClosing: [
    n => `I hope ${n} reads this and makes some genuine changes.`,
    n => `${n} has potential, but a lot of work to do before I'd recommend it.`,
    () => `Not something I'd recommend in its current state, unfortunately.`,
    () => `I'd wait until things improve before visiting again.`,
    () => `This one needs work. Feedback shared honestly, hoping for improvement.`,
    () => `Would not rush back, but happy to revisit this review if things change.`,
    () => `Giving an honest account here — hope the team takes it constructively.`,
    () => `Hard to recommend right now. Maybe check again in a few months.`,
    () => `A disappointing visit that I hope isn't typical for them.`,
  ],

  emojis: {
    5: ["⭐", "👌", "🙌", "💯", "✅", "🌟", "🏆"],
    4: ["👍", "✅", "😊", "🌟", "👏"],
    3: ["🙂", "👌"],
    2: ["😕"],
    1: ["😞"],
  },
};

/* ═══════════════════════════════════════════════════════════
   SERVICE → SEO KEYWORD MAP
   Each service has 2–4 natural keyword phrases that rotate.
   One fires ~35% of the time inside the experience sentence.
   Keep them conversational — never paste raw keyword strings.
   ═══════════════════════════════════════════════════════════ */
const SERVICE_KEYWORDS = {

  /* — Chronic Diseases — */
  "Arthritis Treatment": [
    "homeopathic arthritis treatment in Lucknow",
    "joint pain treatment in Indira Nagar Lucknow",
    "arthritis relief without side effects in Lucknow",
    "best homeopathy for arthritis in Lucknow",
  ],
  "Diabetes Management": [
    "homeopathic diabetes management in Lucknow",
    "sugar control treatment in Indira Nagar",
    "diabetes care without allopathy in Lucknow",
    "natural diabetes treatment in Lucknow",
  ],
  "Thyroid Treatment": [
    "homeopathic thyroid treatment in Lucknow",
    "thyroid specialist in Indira Nagar Lucknow",
    "natural thyroid cure in Lucknow",
    "hypothyroid homeopathy in Lucknow",
  ],
  "Hypertension / High BP": [
    "high BP treatment in Lucknow homeopathy",
    "blood pressure control in Indira Nagar",
    "natural hypertension treatment in Lucknow",
  ],
  "Asthma & Respiratory Care": [
    "homeopathic asthma treatment in Lucknow",
    "breathing problem treatment in Indira Nagar",
    "natural asthma relief in Lucknow",
  ],

  /* — Skin — */
  "Eczema Treatment": [
    "eczema treatment in Lucknow homeopathy",
    "skin allergy treatment in Indira Nagar",
    "homeopathic eczema cure in Lucknow",
  ],
  "Psoriasis Treatment": [
    "psoriasis treatment in Lucknow",
    "homeopathic psoriasis doctor in Indira Nagar",
    "best psoriasis treatment in Lucknow without steroids",
  ],
  "Acne & Pimples": [
    "acne treatment in Lucknow homeopathy",
    "pimple treatment in Indira Nagar",
    "homeopathic acne cure in Lucknow",
  ],
  "Urticaria / Skin Allergy": [
    "urticaria treatment in Lucknow",
    "skin allergy homeopathy in Indira Nagar",
    "hives treatment without side effects in Lucknow",
  ],
  "Vitiligo / Leucoderma": [
    "vitiligo treatment in Lucknow homeopathy",
    "leucoderma specialist in Indira Nagar Lucknow",
    "white patches treatment in Lucknow",
  ],

  /* — Digestive — */
  "Acidity & GERD": [
    "acidity treatment in Lucknow homeopathy",
    "GERD homeopathic treatment in Indira Nagar",
    "natural acidity relief in Lucknow",
  ],
  "IBS / Irritable Bowel": [
    "IBS treatment in Lucknow",
    "irritable bowel homeopathy in Indira Nagar",
    "stomach problem treatment in Lucknow",
  ],
  "Piles / Fistula / Fissure": [
    "piles treatment without surgery in Lucknow",
    "homeopathic fissure treatment in Indira Nagar",
    "fistula homeopathy in Lucknow",
    "bawaseer ka ilaj Lucknow mein",
  ],

  /* — Hair & Scalp — */
  "Hair Fall Treatment": [
    "hair fall treatment in Lucknow homeopathy",
    "baal jhadne ka homeopathic ilaj Lucknow",
    "hair loss doctor in Indira Nagar Lucknow",
  ],
  "Alopecia Areata": [
    "alopecia areata treatment in Lucknow",
    "patchy hair loss homeopathy in Indira Nagar",
    "homeopathic alopecia doctor in Lucknow",
  ],
  "Dandruff & Scalp Issues": [
    "dandruff treatment in Lucknow homeopathy",
    "scalp problem treatment in Indira Nagar",
    "natural dandruff cure in Lucknow",
  ],

  /* — Women's Health — */
  "PCOD / PCOS": [
    "PCOD treatment in Lucknow homeopathy",
    "PCOS specialist in Indira Nagar Lucknow",
    "natural PCOS cure in Lucknow without hormones",
    "homeopathic PCOD doctor in Lucknow",
  ],
  "Menstrual Disorders": [
    "irregular periods treatment in Lucknow",
    "menstrual disorder homeopathy in Indira Nagar",
    "periods problem treatment in Lucknow",
  ],
  "Leucorrhoea Treatment": [
    "leucorrhoea treatment in Lucknow homeopathy",
    "white discharge treatment in Indira Nagar",
    "natural leucorrhoea cure in Lucknow",
  ],
  "Menopause Care": [
    "menopause homeopathic treatment in Lucknow",
    "menopause care in Indira Nagar",
    "natural menopause relief in Lucknow",
  ],

  /* — Child Health — */
  "Pediatric Homeopathy": [
    "homeopathic doctor for kids in Lucknow",
    "child specialist homeopathy in Indira Nagar",
    "bachon ka homeopathic ilaj Lucknow mein",
  ],
  "Recurrent Cold & Fever in Kids": [
    "recurrent fever treatment in kids Lucknow",
    "child cold and cough homeopathy in Indira Nagar",
    "bachon ki baar baar bimari ka ilaj Lucknow",
  ],
  "Bedwetting / Enuresis": [
    "bedwetting treatment in Lucknow homeopathy",
    "enuresis homeopathy in Indira Nagar",
    "bachon mein bistar geela karne ka ilaj Lucknow",
  ],
  "Tonsillitis in Children": [
    "tonsillitis treatment without surgery in Lucknow",
    "gale ki tonsils ka homeopathic ilaj Lucknow",
    "child tonsil treatment in Indira Nagar",
  ],

  /* — Mind & Nerves — */
  "Anxiety & Stress": [
    "anxiety treatment in Lucknow homeopathy",
    "stress relief homeopathy in Indira Nagar",
    "natural anxiety cure in Lucknow",
    "tension aur stress ka homeopathic ilaj Lucknow",
  ],
  "Migraine & Headaches": [
    "migraine treatment in Lucknow homeopathy",
    "headache specialist in Indira Nagar Lucknow",
    "homeopathic migraine cure in Lucknow",
    "migraine ka permanent ilaj Lucknow mein",
  ],
  "Insomnia / Sleep Disorders": [
    "insomnia treatment in Lucknow homeopathy",
    "sleep disorder homeopathy in Indira Nagar",
    "neend na aane ka ilaj Lucknow mein",
  ],
  "Depression Support": [
    "depression treatment in Lucknow homeopathy",
    "natural depression relief in Indira Nagar",
    "homeopathic doctor for depression in Lucknow",
  ],

  /* — General — */
  "General Consultation": [
    "homeopathic doctor in Indira Nagar Lucknow",
    "best homeopathy clinic in Lucknow",
    "homeopathic consultation in Indira Nagar",
    "Dr Pachauri homeopathic clinic Lucknow",
  ],
  "Immunity Booster": [
    "immunity booster homeopathy in Lucknow",
    "natural immunity treatment in Indira Nagar",
    "rog pratirodhak shakti badhane ka ilaj Lucknow",
  ],
  "Kidney Stone (Conservative)": [
    "kidney stone treatment without surgery in Lucknow",
    "pathri ka homeopathic ilaj Lucknow mein",
    "kidney stone homeopathy in Indira Nagar",
  ],
  "Allergy Treatment": [
    "allergy treatment in Lucknow homeopathy",
    "homeopathic allergy doctor in Indira Nagar",
    "natural allergy cure in Lucknow",
  ],
};

/* Returns a keyword phrase for a service, or falls back to the bare service name */
function _servicePhrase(service) {
  const pool = SERVICE_KEYWORDS[service];
  if (pool && chance(0.35)) return pick(pool);
  return service;
}

const HIGHLIGHT_REPHRASE = {
  "no side effects":                    ["felt no side effects at all", "medicines had zero side effects", "treatment with no side effects"],
  "natural treatment":                  ["completely natural approach", "no chemicals or harsh medicines", "relied on natural remedies"],
  "experienced homeopath":              ["the doctor's experience really showed", "clearly a very experienced doctor", "you can tell the doctor has seen a lot of cases"],
  "chronic disease specialist":         ["they really understand chronic conditions", "specialise in long-term health issues", "handled my chronic condition with real depth"],
  "root cause healing":                 ["they focus on the root cause, not just symptoms", "treatment addressed the actual cause", "didn't just suppress symptoms — went deeper"],
  "affordable consultation":            ["very reasonable consultation fee", "affordable compared to other clinics", "great value for money"],
  "personalised medicine":              ["medicine felt tailored specifically to me", "very personalised approach", "didn't give generic medicine — it was specific to my case"],
  "best homoeopathy in Indira Nagar":   ["best homeopathic clinic in the area", "easily the best in Indira Nagar", "top homeopathic doctor in Indira Nagar"],
  "gentle and safe treatment":          ["treatment felt completely safe", "very gentle on the body", "no harsh effects — felt safe throughout"],
  "trusted clinic in Lucknow":          ["one of the most trusted clinics in Lucknow", "people clearly trust this clinic", "reputation in Lucknow is well deserved"],
  "best homeopathic doctor Lucknow":    ["best homeopathic doctor I've visited in Lucknow", "genuinely one of the best in Lucknow", "hard to find a better homeopath in Lucknow"],
  /* saluja highlights below — keep existing ones working */
  "painless procedures":                ["completely painless from start to finish", "didn't feel a thing", "genuinely painless experience"],
  "gentle approach":                    ["very gentle throughout", "the approach was calm and gentle", "handled everything gently"],
  "best dentists":                      ["one of the best dentists I've visited", "clearly a top dentist", "best dental care I've received"],
  "modern equipment":                   ["modern equipment throughout", "latest dental technology", "up-to-date tools and equipment"],
  "quick appointments":                 ["got an appointment quickly", "no long wait for a slot", "quick to get in"],
  "friendly staff":                     ["staff were genuinely friendly", "everyone was warm and welcoming", "really friendly team"],
  "clean and hygienic clinic":          ["clinic was spotlessly clean", "very hygienic environment", "cleanliness was excellent"],
  "thorough consultation":              ["doctor took time for a thorough consultation", "consultation was detailed and unhurried", "very thorough checkup"],
  "transparent pricing":                ["pricing was completely transparent", "no hidden charges", "upfront about costs — no surprises"],
  "comfortable environment":            ["very comfortable atmosphere", "felt at ease the whole time", "relaxed and comfortable clinic"],
  "best clinic in kanpur":              ["best clinic I've visited in Kanpur", "easily the best in Kanpur", "top clinic in Kanpur"],
};

function _rephraseHighlight(h) {
  const pool = HIGHLIGHT_REPHRASE[h.toLowerCase()] || HIGHLIGHT_REPHRASE[h];
  return pool ? pick(pool) : h;
}
/* ═══════════════════════════════════════════════════════════
   REVIEW GENERATOR
   3 modes picked randomly:
     short  (30%) — 2 sentences only, no highlights
     medium (45%) — intro + experience + 1 highlight + closing
     long   (25%) — intro + experience + 2 highlights + second sentence + closing
   ═══════════════════════════════════════════════════════════ */
function generateReview(client, service, rating) {
  const name      = pick(client.alternateNames);
  const isPos     = rating >= 4;
  const isNeutral = rating === 3;
  const isNeg     = rating <= 2;
  const parts     = [];

  const mode = chance(.30) ? "short" : chance(.60) ? "medium" : "long";

  /* 1. Intro — skipped in short mode 50% of the time */
  if (mode !== "short" || chance(.50)) {
    parts.push(pick(PHRASES.intro)(name));
  }

  /* 2. Service experience — uses keyword phrase ~35% of the time */
  const expPool      = PHRASES.experience[rating] || PHRASES.experience[3];
  const serviceLabel = _servicePhrase(service);
  parts.push(pick(expPool)(serviceLabel, name));

  /* short mode stops here — just 1 or 2 sentences */
  if (mode === "short") {
    if (chance(.55)) {
      // add a single closing line
      if (isPos) parts.push(pick(PHRASES.closing.positive)(name));
      else if (isNeutral) parts.push(pick(PHRASES.closing.neutral)(name));
    }
    return parts.join(" ").replace(/\s{2,}/g, " ").trim();
  }

  /* 3. Highlights */
  const hlCount  = mode === "long" ? (1 + (chance(.5) ? 1 : 0)) : 1;
  const chosen   = pickN(client.highlights, hlCount);
  const hlPool   = isPos ? PHRASES.highlights.positive
                 : isNeutral ? PHRASES.highlights.neutral
                 : PHRASES.highlights.negative;

  const rephrased = chosen.map(_rephraseHighlight);

  if (rephrased.length === 1) {
    parts.push(pick(hlPool)(rephrased[0]));
  } else if (rephrased.length > 1) {
    if (chance(.5)) {
      const joined = rephrased.slice(0, -1).join(", ") + " and " + rephrased.at(-1);
      parts.push(pick([
        isPos ? `The ${joined} were both excellent.` : `The ${joined} were areas that stood out.`,
        isPos ? `Standouts: the ${joined}.`          : `I noticed issues with the ${joined}.`,
      ]));
    } 
    else {
      parts.push(pick(hlPool)(rephrased[0]));
      const connector = chance(.45) ? pick(PHRASES.connectors) + " " : "";
      parts.push(connector + pick(hlPool)(rephrased[1]));
    }
  }
  /* 4. Second sentence — long mode only, 20% chance */
 
   if (mode === "long" && chance(.20)) {
    const pool = isPos
      ? PHRASES.secondSentence.positive.filter(fn => {
          const txt = fn(name);
          return !txt.toLowerCase().includes("dental") || state?.client?.category === "Dentist";
        })
      : isNeutral ? PHRASES.secondSentence.neutral
      : PHRASES.secondSentence.negative;
    if (pool.length) parts.push(pick(pool)(name));
  }

  /* 5. Closing (78% chance) */
  if (chance(.78)) {
    if (isNeg) {
      parts.push(pick(PHRASES.negativeClosing)(name));
    } else if (isPos) {
      const geoThreshold = rating === 5 ? 0.40 : 0.20;
      if (chance(geoThreshold) && client.geoAreas) {
        const area = pick(client.geoAreas);
        const geoPool = PHRASES.closing.geo.filter(fn => {
          const txt = fn(name, area);
          return !txt.toLowerCase().includes("dental") || client.category === "Dentist";
        });
        parts.push(pick(geoPool.length ? geoPool : PHRASES.closing.positive)(name, area));
      } else {
        parts.push(pick(PHRASES.closing.positive)(name));
      }
    }   // ← closes: else if (isPos)
  }     // ← closes: if (chance(.78))

  /* 6. Occasional emoji */
  if (chance(isPos ? .18 : .07)) {
    const pool = PHRASES.emojis[rating] || PHRASES.emojis[3];
    parts[parts.length - 1] += " " + pick(pool);
  }

  return parts.join(" ").replace(/\s{2,}/g, " ").trim();
}

/* ═══════════════════════════════════════════════════════════
   APP CONTROLLER
   ═══════════════════════════════════════════════════════════ */
const RF = (() => {
  const state = {
    client:  null,
    step:    1,
    service: null,
    rating:  null,
    review:  "",
  };

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    const id     = new URLSearchParams(window.location.search).get("client") || "saluja";
    state.client = RF_getClient(id);
    _applyBranding();
    _buildServiceChips();
    _updateProgress(1);
    document.title = `Rate ${state.client.name}`;
  }

  /* ── Branding ─────────────────────────────────────────── */
function _applyBranding() {
  const c = state.client;
  const r = document.documentElement;
  r.style.setProperty("--p",      c.primaryColor);
  r.style.setProperty("--p-dark", c.primaryDark);
  r.style.setProperty("--p-soft", c.primarySoft);
  r.style.setProperty("--p-glow", c.primaryGlow || c.primarySoft);

  document.getElementById("rfBusinessName").textContent = `Thank you for visiting ${c.name}`;
  document.getElementById("rfTagline").textContent      = c.tagline || "We'd love your feedback";
  document.getElementById("rfLogoEmoji").textContent    = c.logoText || "⭐";

  if (c.logo) {
    document.getElementById("rfLogoWrap").innerHTML =
`<img src="${c.logo}" alt="${c.name}" style="width:100%;height:100%;object-fit:contain;border-radius:14px;" />`
  }

  // Dynamically set emoji aspect labels from client highlights

}

/* ── Service chips ────────────────────────────────────── */
  function _buildServiceChips() {
    const wrap = document.getElementById("rfServiceChips");
    wrap.innerHTML = "";

 const groupStarts = state.client.groupStarts || {};


    /* scrollable chip sheet */
    const sheet = document.createElement("div");
    sheet.className = "rf-chip-sheet";

    let animIdx = 0;
    state.client.services.forEach((svc) => {
      if (groupStarts[svc]) {
        const lbl = document.createElement("div");
        lbl.className = "rf-chip-group-label";
        lbl.textContent = groupStarts[svc];
        sheet.appendChild(lbl);
      }
      const btn = document.createElement("button");
      btn.className = "rf-chip";
      btn.textContent = svc;
      btn.type = "button";
      btn.style.animationDelay = (animIdx * 0.04) + "s";
      btn.onclick = () => _selectService(svc, btn);
      sheet.appendChild(btn);
      animIdx++;
    });
    wrap.appendChild(sheet);

    /* custom service input */
    const customWrap = document.createElement("div");
    customWrap.className = "rf-custom-service-wrap";
    customWrap.innerHTML = `
      <p class="rf-custom-label">Something else? Type it below</p>
      <div class="rf-custom-row">
        <input class="rf-custom-input" id="rfCustomService" type="text"
          placeholder="e.g. Migraine, Hair Fall…" maxlength="60" />
        <button class="rf-custom-btn" id="rfCustomBtn" type="button">Go →</button>
      </div>
    `;
    wrap.appendChild(customWrap);

    /* Go button — defined here inside the module so toStep() is in scope */
    document.getElementById("rfCustomBtn").onclick = () => {
      const val = document.getElementById("rfCustomService").value.trim();
      if (!val) return;
      _selectService(val, null);
    };

    const customInput = document.getElementById("rfCustomService");

    // Build suggestions dropdown
  const suggestBox = document.createElement("div");
    suggestBox.id = "rfSuggestBox";
    suggestBox.style.cssText = `
      display:none; position:fixed;
      background:#fff; border:1.5px solid var(--p); border-radius:10px;
      box-shadow:0 4px 24px rgba(0,0,0,0.15); z-index:99999;
      max-height:200px; overflow-y:auto;
    `;
    document.body.appendChild(suggestBox);

    function _positionSuggestBox() {
      const rect = customInput.getBoundingClientRect();
      suggestBox.style.top    = (rect.top - 4) + "px";
      suggestBox.style.transform = "translateY(-100%)";
      suggestBox.style.left   = rect.left + "px";
      suggestBox.style.width  = rect.width + "px";
    }

    customInput.addEventListener("input", () => {
      _positionSuggestBox();
      const val = customInput.value.trim().toLowerCase();
      suggestBox.innerHTML = "";
      if (!val) { suggestBox.style.display = "none"; return; }

      const matches = state.client.services.filter(s =>
        s.toLowerCase().includes(val)
      );

      if (!matches.length) { suggestBox.style.display = "none"; return; }

      matches.forEach(svc => {
        const item = document.createElement("div");
        item.textContent = svc;
        item.style.cssText = `
          padding:10px 14px; cursor:pointer; font-size:0.9rem;
          border-bottom:1px solid rgba(0,0,0,0.06); color:#1e1b4b;
        `;
        item.addEventListener("mousedown", () => {
          customInput.value = svc;
          suggestBox.style.display = "none";
          _selectService(svc, null);
        });
        item.addEventListener("mouseover", () => item.style.background = "var(--p-soft)");
        item.addEventListener("mouseout",  () => item.style.background = "");
        suggestBox.appendChild(item);
      });

      suggestBox.style.display = "block";
    });

    customInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = customInput.value.trim();
        if (!val) return;
        suggestBox.style.display = "none";
        _selectService(val, null);
      }
      if (e.key === "Escape") suggestBox.style.display = "none";
    });

    document.addEventListener("click", (e) => {
      if (!customRow.contains(e.target)) suggestBox.style.display = "none";
    });
  }


  function _selectService(svc, el) {
    document.querySelectorAll(".rf-chip").forEach(c => c.classList.remove("rf-selected"));
    if (el) el.classList.add("rf-selected");

    const customInput = document.getElementById("rfCustomService");
    if (!el && customInput) {
      customInput.classList.add("rf-custom-selected");
    } else if (customInput) {
      customInput.classList.remove("rf-custom-selected");
      customInput.value = "";
    }

    state.service = svc;
    setTimeout(() => toStep(2), 180);
  }

  /* ── Rating ───────────────────────────────────────────── */
  function setRating(val) {
    state.rating = val;

    // Sync emoji faces
    document.querySelectorAll(".rf-emoji-btn").forEach(btn =>
      btn.classList.toggle("rf-active", +btn.dataset.val === val)
    );

    // Sync stars
    document.querySelectorAll(".rf-star").forEach(s =>
      s.classList.toggle("rf-lit", +s.dataset.val <= val)
    );

    const isLow = val <= 2;
    document.getElementById("rfLowRatingMsg").style.display = isLow ? "block" : "none";
    document.getElementById("rfStep2Footer").style.display  = isLow ? "none"  : "flex";

    if (!isLow) {
      document.getElementById("rfStep2Btn").disabled = false;
    }
  }

  /* ── Step Navigation ──────────────────────────────────── */
  function toStep(n) {
    if (!_validateStep(state.step)) return;

    const dir = n > state.step ? "forward" : "back";
    if (n === 3) _buildReviewCarousel();

    _hideStep(state.step, dir);
    state.step = n;
    _showStep(n);
    _updateProgress(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function _hideStep(n, dir) {
    const el = document.getElementById(`rfStep${n}`);
    el.classList.add("rf-step-hidden");
    el.classList.remove("rf-step-back");
    if (dir === "back") el.classList.add("rf-step-back");
  }

  function _showStep(n) {
    const el = document.getElementById(`rfStep${n}`);
    el.classList.remove("rf-step-hidden", "rf-step-back");
  }

  /* ── Validation ───────────────────────────────────────── */
  function _validateStep(n) {
    if (n === 1 && !state.service) {
      _shake("rfStep1Btn");
      showToast("Please select a service first", "error");
      return false;
    }
    if (n === 2 && !state.rating) {
      _shake("rfEmojiRow");
      showToast("Please choose your experience rating", "error");
      return false;
    }
    return true;
  }

  function _shake(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "rfShake .38s ease";
    setTimeout(() => { el.style.animation = ""; }, 400);
  }

  /* ── Progress ─────────────────────────────────────────── */
  function _updateProgress(n) {
    document.getElementById("rfProgressFill").style.width  = (n / 3 * 100) + "%";
    document.getElementById("rfProgressLabel").textContent = `Step ${n} of 3`;
  }

  /* ── Build carousel on step 3 ─────────────────────────── */
  function _buildReviewCarousel() {
    const carousel = document.getElementById("rfCarousel");
    const dotsWrap = document.getElementById("rfCarouselDots");
    if (!carousel) return;

    carousel.innerHTML = "";
    if (dotsWrap) dotsWrap.innerHTML = "";

    const stars  = "★".repeat(state.rating) + "☆".repeat(5 - state.rating);
    const labels = { 5:"Excellent ✨", 4:"Good 👍", 3:"Okay 🙂", 2:"Poor 😕", 1:"Very Poor 😞" };

    const badge = document.getElementById("rfRatingBadge");
    if (badge) {
      badge.innerHTML =
        `<span style="color:#f59e0b;letter-spacing:3px;font-size:1rem">${stars}</span>
         <span style="font-size:.82rem;font-weight:700;color:var(--p)">${labels[state.rating]} — ${state.service}</span>`;
    }

    // Generate 3 review variants
    const reviews = [];
    for (let i = 0; i < 3; i++) {
      reviews.push(generateReview(state.client, state.service, state.rating));
    }
    state.review = reviews[0];

    reviews.forEach((text, i) => {
      // Card
      const card = document.createElement("div");
      card.className = "rf-review-card";
      card.innerHTML = `
        <div class="rf-card-copied-overlay">
          <span class="rf-copied-icon">✅</span>
          <span class="rf-copied-text">Copied! Opening Google…</span>
        </div>
        <div class="rf-card-header">
          <span class="rf-card-num">Option ${i + 1}</span>
          <span class="rf-card-tap">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <rect x="7" y="7" width="10" height="11" rx="2" stroke="currentColor" stroke-width="1.9"/>
              <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
            Tap to post
          </span>
        </div>
        <p class="rf-card-text">${text}</p>
        <div class="rf-card-footer">
          <span class="rf-card-stars">${stars}</span>
        </div>`;

      card.onclick = () => _copyCard(card, text);
      carousel.appendChild(card);

      // Dot
      if (dotsWrap) {
        const dot = document.createElement("div");
        dot.className = "rf-dot" + (i === 0 ? " rf-dot-active" : "");
        dot.onclick = () => {
          carousel.scrollTo({ left: card.offsetLeft - 4, behavior: "smooth" });
        };
        dotsWrap.appendChild(dot);
      }
    });

    // Update dots on scroll
    carousel.addEventListener("scroll", () => {
      const dots = dotsWrap ? dotsWrap.querySelectorAll(".rf-dot") : [];
      const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
      dots.forEach((d, i) => d.classList.toggle("rf-dot-active", i === index));
    });
  }

  async function _copyCard(card, text) {
    card.classList.add("rf-card-copying");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        document.getElementById("rfManualFallback").style.display = "block";
        card.classList.remove("rf-card-copying");
        return;
      }
    }
    showToast("Copied! Opening Google Reviews…", "success");
    setTimeout(() => {
      window.open(state.client.reviewLink, "_blank");
      card.classList.remove("rf-card-copying");
    }, 1200);
  }

  /* ── Private feedback ─────────────────────────────────── */
  function sharePrivate() {
    showToast("Private feedback form coming soon 🙏", "info");
  }

  return { init, toStep, setRating, sharePrivate };
})();

/* ── Toast ────────────────────────────────────────────────── */
let _toastTimer = null;
function showToast(msg, type = "info") {
  const el = document.getElementById("rfToast");
  el.textContent = msg;
  el.className   = `rf-toast rf-toast-${type} rf-toast-show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("rf-toast-show"), 3200);
}

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", RF.init);
