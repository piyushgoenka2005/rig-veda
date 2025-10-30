import { Hymn, Deity, Theme, Meter, Rishi, Place } from '../types/vedic';

// Sample Rig Veda data - in a real implementation, this would be loaded from a comprehensive dataset
export const sampleHymns: Hymn[] = [
  {
    id: "1.1.1",
    mandala: 1,
    sukta: 1,
    rishi: "Madhucchandas",
    devata: "Agni",
    meter: "Gayatri",
    verses: [
      {
        id: "1.1.1.1",
        number: 1,
        sanskrit: "अग्निमीळे पुरोहितं यज्ञस्य देवं रत्वीजम | होतारं रत्नधातमम ||",
        transliteration: "agnimīḷe purohitaṃ yajñasya devaṃ ṛtvījam | hotāraṃ ratnadhātamam ||",
        translations: {
          wilson: "I laud Agni, the chosen Priest, God, minister of sacrifice, the hotar, lavishest of wealth.",
          griffith: "I Laud Agni, the chosen Priest, God, minister of sacrifice, the hotar, lavishest of wealth.",
          jamison: "I praise Agni, the domestic priest, the divine ministrant of the sacrifice, the hotar, the one most rich in treasure."
        },
        meter: "Gayatri",
        syllables: [8, 8, 8],
        audioUrl: "/audio/1.1.1.1.mp3"
      }
    ],
    themes: ["fire", "sacrifice", "priesthood"],
    deities: ["Agni"],
    epithets: ["purohita", "ṛtvīj", "hotṛ", "ratnadhātama"],
    places: [],
    ritualContext: "Daily Agnihotra"
  },
  // Minimal placeholder hymns to populate mandalas 2-10
  {
    id: "2.1.1",
    mandala: 2,
    sukta: 1,
    rishi: "Gritsamada",
    devata: "Indra",
    meter: "Gayatri",
    verses: [
      {
        id: "2.1.1.1",
        number: 1,
        sanskrit: "इन्द्रं वर्धन्तो अप्तुरः",
        transliteration: "indraṃ vardhanto apturaḥ",
        translations: { griffith: "Praising Indra, the active strengthen him" },
        meter: "Gayatri",
        syllables: [8,8,8]
      }
    ],
    themes: ["battle"],
    deities: ["Indra"],
    epithets: ["vṛtrahan"],
    places: []
  },
  {
    id: "3.1.1",
    mandala: 3,
    sukta: 1,
    rishi: "Vishvamitra",
    devata: "Agni",
    meter: "Gayatri",
    verses: [
      { id: "3.1.1.1", number: 1, sanskrit: "अग्निं नरो दीध्यत", transliteration: "agniṃ naro dīdhiyata", translations: { griffith: "Men kindle Agni" }, meter: "Gayatri", syllables: [8,8,8] }
    ],
    themes: ["fire"],
    deities: ["Agni"],
    epithets: ["jātavedas"],
    places: []
  },
  {
    id: "4.1.1",
    mandala: 4,
    sukta: 1,
    rishi: "Vāmadeva",
    devata: "Indra",
    meter: "Tristubh",
    verses: [
      { id: "4.1.1.1", number: 1, sanskrit: "इन्द्रं वर्धन्तो", transliteration: "indraṃ vardhanto", translations: { griffith: "Extolling Indra" }, meter: "Tristubh", syllables: [11,11,11,11] }
    ],
    themes: ["battle"],
    deities: ["Indra"],
    epithets: ["śatakratu"],
    places: []
  },
  {
    id: "5.1.1",
    mandala: 5,
    sukta: 1,
    rishi: "Atri",
    devata: "Soma",
    meter: "Gayatri",
    verses: [
      { id: "5.1.1.1", number: 1, sanskrit: "सोमं मन्ये", transliteration: "somaṃ manye", translations: { griffith: "I deem Soma" }, meter: "Gayatri", syllables: [8,8,8] }
    ],
    themes: ["elixir"],
    deities: ["Soma"],
    epithets: ["pavamāna"],
    places: []
  },
  {
    id: "6.1.1",
    mandala: 6,
    sukta: 1,
    rishi: "Bharadvāja",
    devata: "Agni",
    meter: "Gayatri",
    verses: [
      { id: "6.1.1.1", number: 1, sanskrit: "अग्ने यं यातुधान", transliteration: "agne yaṃ yātudhāna", translations: { griffith: "Agni, whom the sorcerer" }, meter: "Gayatri", syllables: [8,8,8] }
    ],
    themes: ["fire"],
    deities: ["Agni"],
    epithets: ["vaiśvānara"],
    places: []
  },
  {
    id: "7.1.1",
    mandala: 7,
    sukta: 1,
    rishi: "Vasiṣṭha",
    devata: "Indra",
    meter: "Tristubh",
    verses: [
      { id: "7.1.1.1", number: 1, sanskrit: "इन्द्रं गीर्भिर्नव्यम", transliteration: "indraṃ gīrbhir navyam", translations: { griffith: "With songs anew to Indra" }, meter: "Tristubh", syllables: [11,11,11,11] }
    ],
    themes: ["battle"],
    deities: ["Indra"],
    epithets: ["maghavan"],
    places: []
  },
  {
    id: "8.1.1",
    mandala: 8,
    sukta: 1,
    rishi: "Kaṇva",
    devata: "Ashvins",
    meter: "Gayatri",
    verses: [
      { id: "8.1.1.1", number: 1, sanskrit: "अश्विना वर्त्रहणा", transliteration: "aśvinā vṛtrahanā", translations: { griffith: "Ashvins, slayers of obstruction" }, meter: "Gayatri", syllables: [8,8,8] }
    ],
    themes: ["healing"],
    deities: ["Ashvins"],
    epithets: ["nāsatyau"],
    places: []
  },
  {
    id: "9.1.1",
    mandala: 9,
    sukta: 1,
    rishi: "Various",
    devata: "Soma",
    meter: "Gayatri",
    verses: [
      { id: "9.1.1.1", number: 1, sanskrit: "सोमः पुनान", transliteration: "somaḥ punāna", translations: { griffith: "Soma purifying" }, meter: "Gayatri", syllables: [8,8,8] }
    ],
    themes: ["elixir"],
    deities: ["Soma"],
    epithets: ["amṛta"],
    places: []
  },
  {
    id: "10.1.1",
    mandala: 10,
    sukta: 1,
    rishi: "Various",
    devata: "Varuna",
    meter: "Tristubh",
    verses: [
      { id: "10.1.1.1", number: 1, sanskrit: "वरुणं वो ऋतस्पतिम", transliteration: "varuṇaṃ vo ṛtaspatiṃ", translations: { griffith: "To Varuna, lord of order" }, meter: "Tristubh", syllables: [11,11,11,11] }
    ],
    themes: ["cosmic order"],
    deities: ["Varuna"],
    epithets: ["ṛta"],
    places: []
  },
  {
    id: "1.2.1",
    mandala: 1,
    sukta: 2,
    rishi: "Madhucchandas",
    devata: "Vayu",
    meter: "Gayatri",
    verses: [
      {
        id: "1.2.1.1",
        number: 1,
        sanskrit: "वायवा याहि दर्शत एहि पवमान उक्थ्यः | इह श्रुधी हवं मम ||",
        transliteration: "vāyavā yāhi darśata ehī pavamāna ukthyaḥ | iha śrudhī havaṃ mama ||",
        translations: {
          wilson: "Come, Vāyu, conspicuous, come, purifying, worthy of praise; here listen to my invocation.",
          griffith: "Come, Vāyu, conspicuous, come, purifying, worthy of praise; here listen to my invocation."
        },
        meter: "Gayatri",
        syllables: [8, 8, 8]
      }
    ],
    themes: ["wind", "purification", "invocation"],
    deities: ["Vayu"],
    epithets: ["darśata", "pavamāna", "ukthya"],
    places: []
  }
];

export const sampleDeities: Deity[] = [
  {
    id: "indra",
    name: "Indra",
    epithets: ["vajrabāhu", "maghavan", "śakra", "vṛtrahan", "purandara", "śatakratu"],
    hymns: ["1.1.2", "1.2.2", "1.3.2", "1.4.1", "1.5.1"],
    frequency: 250,
    relationships: [
      {
        target: "maruts",
        type: "partnership",
        strength: 0.9,
        verses: ["1.1.2.1", "1.2.2.1"]
      },
      {
        target: "soma",
        type: "partnership",
        strength: 0.8,
        verses: ["1.1.2.1"]
      },
      {
        target: "vishnu",
        type: "alliance",
        strength: 0.7,
        verses: ["1.1.2.1"]
      },
      {
        target: "vayu",
        type: "alliance",
        strength: 0.6,
        verses: ["1.1.2.1"]
      },
      {
        target: "agni",
        type: "ritual",
        strength: 0.5,
        verses: ["1.1.1.1"]
      }
    ],
    description: "The king of gods, wielder of the thunderbolt, slayer of Vritra, most prominent deity in the Rig Veda."
  },
  {
    id: "agni",
    name: "Agni",
    epithets: ["purohita", "ṛtvīj", "hotṛ", "ratnadhātama", "vaiśvānara", "jātavedas"],
    hymns: ["1.1.1", "1.2.1", "1.3.1", "1.4.2", "1.5.2"],
    frequency: 200,
    relationships: [
      {
        target: "soma",
        type: "ritual",
        strength: 0.8,
        verses: ["1.1.1.1", "1.2.1.1"]
      },
      {
        target: "saraswati",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.1.1"]
      },
      {
        target: "surya",
        type: "complementary",
        strength: 0.5,
        verses: ["1.1.1.1"]
      },
      {
        target: "indra",
        type: "ritual",
        strength: 0.5,
        verses: ["1.1.1.1"]
      },
      {
        target: "varuna",
        type: "ritual",
        strength: 0.4,
        verses: ["1.1.1.1"]
      }
    ],
    description: "The divine fire, priest of gods, universal mediator between humans and all deities."
  },
  {
    id: "soma",
    name: "Soma",
    epithets: ["pavamāna", "maghavan", "amṛta", "pavāka", "indra"],
    hymns: ["1.1.3", "1.2.3", "1.3.3", "1.4.3"],
    frequency: 120,
    relationships: [
      {
        target: "indra",
        type: "partnership",
        strength: 0.8,
        verses: ["1.1.2.1"]
      },
      {
        target: "agni",
        type: "ritual",
        strength: 0.8,
        verses: ["1.1.1.1"]
      },
      {
        target: "varuna",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.3.1"]
      },
      {
        target: "mitra",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.3.1"]
      }
    ],
    description: "The sacred plant and divine elixir, source of immortality, central to Vedic rituals."
  },
  {
    id: "varuna",
    name: "Varuna",
    epithets: ["asura", "ṛta", "dharmapati", "samudra", "apāmpati"],
    hymns: ["1.1.4", "1.2.4", "1.3.4", "1.4.4"],
    frequency: 46,
    relationships: [
      {
        target: "mitra",
        type: "partnership",
        strength: 0.9,
        verses: ["1.1.4.1"]
      },
      {
        target: "soma",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.3.1"]
      },
      {
        target: "agni",
        type: "ritual",
        strength: 0.4,
        verses: ["1.1.1.1"]
      }
    ],
    description: "The cosmic order keeper, lord of waters, guardian of moral law and cosmic order (Rita)."
  },
  {
    id: "maruts",
    name: "Maruts",
    epithets: ["rudras", "vāyus", "parjanyas", "mṛgavyādhas", "indra-sakhā"],
    hymns: ["1.1.8", "1.2.6", "1.3.8", "1.4.8"],
    frequency: 33,
    relationships: [
      {
        target: "indra",
        type: "partnership",
        strength: 0.9,
        verses: ["1.1.2.1"]
      },
      {
        target: "rudra",
        type: "familial",
        strength: 0.7,
        verses: ["1.1.8.1"]
      }
    ],
    description: "The storm gods, companions of Indra, bringers of rain and thunder, warriors of the sky."
  },
  {
    id: "surya",
    name: "Surya",
    epithets: ["savitṛ", "pūṣan", "āditya", "bhānu", "vivasvān"],
    hymns: ["1.1.6", "1.2.5", "1.3.6", "1.4.6"],
    frequency: 30,
    relationships: [
      {
        target: "ushas",
        type: "familial",
        strength: 0.8,
        verses: ["1.1.6.1"]
      },
      {
        target: "agni",
        type: "complementary",
        strength: 0.5,
        verses: ["1.1.1.1"]
      },
      {
        target: "mitra",
        type: "complementary",
        strength: 0.4,
        verses: ["1.1.5.1"]
      }
    ],
    description: "The sun god, source of light and life, charioteer of the heavens, father of dawn."
  },
  {
    id: "mitra",
    name: "Mitra",
    epithets: ["sūrya", "ṛta", "satyadhṛti", "vratapā", "sakhā"],
    hymns: ["1.1.5", "1.2.5", "1.3.5"],
    frequency: 28,
    relationships: [
      {
        target: "varuna",
        type: "partnership",
        strength: 0.9,
        verses: ["1.1.4.1"]
      },
      {
        target: "soma",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.3.1"]
      },
      {
        target: "surya",
        type: "complementary",
        strength: 0.4,
        verses: ["1.1.5.1"]
      }
    ],
    description: "The solar deity, friend and companion of Varuna, associated with contracts, friendship, and cosmic order."
  },
  {
    id: "ushas",
    name: "Ushas",
    epithets: ["sūryasya", "divas", "prabhā", "jyotis", "sūryā"],
    hymns: ["1.1.7", "1.2.7", "1.3.7"],
    frequency: 20,
    relationships: [
      {
        target: "surya",
        type: "familial",
        strength: 0.8,
        verses: ["1.1.6.1"]
      },
      {
        target: "ashvins",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.7.1"]
      }
    ],
    description: "The dawn goddess, daughter of Surya, bringer of light and new beginnings."
  },
  {
    id: "ashvins",
    name: "Ashvins",
    epithets: ["nāsatyau", "dasrā", "divyau", "aśvinau", "bheṣajau"],
    hymns: ["1.1.9", "1.2.8", "1.3.9"],
    frequency: 50,
    relationships: [
      {
        target: "ushas",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.7.1"]
      }
    ],
    description: "The twin horsemen, divine healers, bringers of medicine and protection."
  },
  {
    id: "vishnu",
    name: "Vishnu",
    epithets: ["trivikrama", "upendra", "vāmana", "śipiviṣṭa"],
    hymns: ["1.1.10", "1.2.9"],
    frequency: 6,
    relationships: [
      {
        target: "indra",
        type: "alliance",
        strength: 0.7,
        verses: ["1.1.2.1"]
      }
    ],
    description: "The preserver, ally of Indra in the Vritra-slaying myth, later becomes a major deity."
  },
  {
    id: "rudra",
    name: "Rudra",
    epithets: ["śiva", "paśupati", "mṛgavyādha", "kapardin"],
    hymns: ["1.1.11", "1.2.10"],
    frequency: 4,
    relationships: [
      {
        target: "maruts",
        type: "familial",
        strength: 0.7,
        verses: ["1.1.8.1"]
      }
    ],
    description: "The storm god, father of the Maruts, later becomes Shiva, the auspicious one."
  },
  {
    id: "saraswati",
    name: "Saraswati",
    epithets: ["vāc", "bhāratī", "ilā", "mahī"],
    hymns: ["1.1.12", "1.2.11"],
    frequency: 3,
    relationships: [
      {
        target: "agni",
        type: "ritual",
        strength: 0.6,
        verses: ["1.1.1.1"]
      }
    ],
    description: "The river goddess, goddess of speech and wisdom, sacred to Vedic rituals."
  },
  {
    id: "vayu",
    name: "Vayu",
    epithets: ["vāta", "pavana", "anila", "mātariśvan"],
    hymns: ["1.1.13", "1.2.12"],
    frequency: 11,
    relationships: [
      {
        target: "indra",
        type: "alliance",
        strength: 0.6,
        verses: ["1.1.2.1"]
      }
    ],
    description: "The wind god, assistant to Indra in storms, bringer of breath and life."
  }
];

export const sampleThemes: Theme[] = [
  {
    id: "fire",
    name: "Fire & Sacrifice",
    keywords: ["agni", "yajña", "hotṛ", "purohita", "havis"],
    hymns: ["1.1.1", "1.2.1"],
    intensity: 0.9,
    color: "#FF6B35",
    description: "The central theme of fire in Vedic rituals and its divine manifestation as Agni."
  },
  {
    id: "dawn",
    name: "Dawn & Light",
    keywords: ["uṣas", "sūrya", "prabhā", "jyotis"],
    hymns: ["1.1.2"],
    intensity: 0.7,
    color: "#FFD700",
    description: "Themes of dawn, light, and the daily renewal of cosmic order."
  },
  {
    id: "battle",
    name: "Battle & Victory",
    keywords: ["indra", "vṛtra", "vajra", "yudh", "jaya"],
    hymns: ["1.1.2"],
    intensity: 0.8,
    color: "#DC143C",
    description: "Cosmic battles, especially Indra's victory over Vritra and the release of waters."
  },
  {
    id: "wealth",
    name: "Wealth & Cows",
    keywords: ["go", "dhenu", "ratna", "dravina", "vāja"],
    hymns: ["1.1.1"],
    intensity: 0.6,
    color: "#8B4513",
    description: "Material prosperity, cattle wealth, and divine gifts."
  }
];

export const sampleMeters: Meter[] = [
  {
    id: "gayatri",
    name: "Gayatri",
    pattern: "8-8-8",
    syllables: 24,
    description: "The most sacred meter, consisting of three lines of eight syllables each.",
    examples: ["1.1.1.1", "1.2.1.1"]
  },
  {
    id: "anushtubh",
    name: "Anushtubh",
    pattern: "8-8-8-8",
    syllables: 32,
    description: "A four-line meter with eight syllables per line, commonly used in the Rig Veda.",
    examples: []
  },
  {
    id: "tristubh",
    name: "Tristubh",
    pattern: "11-11-11-11",
    syllables: 44,
    description: "A four-line meter with eleven syllables per line, used for longer compositions.",
    examples: []
  }
];

export const sampleRishis: Rishi[] = [
  {
    id: "madhucchandas",
    name: "Madhucchandas",
    family: "Vishvamitra",
    hymns: ["1.1.1", "1.2.1"],
    period: "Early Vedic",
    description: "The first rishi of the Rig Veda, composer of the opening hymns."
  },
  {
    id: "vishvamitra",
    name: "Vishvamitra",
    family: "Vishvamitra",
    hymns: ["1.1.2"],
    period: "Early Vedic",
    description: "A powerful rishi known for his spiritual transformation and divine vision."
  }
];

export const samplePlaces: Place[] = [
  {
    id: "sarasvati",
    name: "Sarasvati",
    type: "river",
    hymns: ["1.1.1"],
    coordinates: [29.5, 76.0],
    uncertainty: true,
    description: "The sacred river mentioned frequently in the Rig Veda, possibly the Ghaggar-Hakra river system."
  },
  {
    id: "sapta-sindhu",
    name: "Sapta Sindhu",
    type: "region",
    hymns: ["1.1.1", "1.2.1"],
    coordinates: [30.0, 75.0],
    uncertainty: false,
    description: "The land of seven rivers, the heartland of Vedic civilization."
  }
];
