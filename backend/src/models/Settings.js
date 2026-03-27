import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    bookingsEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
    // Homepage "Trust & Partners" content
    trustHeading: {
      type: String,
      default: 'Why Travelers Trust Us',
      trim: true,
    },
    trustSubheading: {
      type: String,
      default: 'Small group stories, big memories — here’s what backs our walks.',
      trim: true,
    },
    yearsOld: {
      type: Number,
      default: 8,
      min: 0,
    },
    explorersCount: {
      type: Number,
      default: 1200,
      min: 0,
    },
    storytellerExperienceYears: {
      type: Number,
      default: 10,
      min: 0,
    },
    partners: {
      type: [{
        name: { type: String, required: true },
        logoUrl: { type: String, required: true }
      }],
      default: [
        { name: 'Airbnb', logoUrl: '/assets/partners/airbnb.svg' },
        { name: 'GetYourGuide', logoUrl: '/assets/partners/getyourguide.svg' },
        { name: 'Tripadvisor', logoUrl: '/assets/partners/tripadvisor.svg' }
      ]
    },
    vibes: {
      type: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        iconUrl: { type: String, required: true },
        filterKey: { type: String, required: true }
      }],
      default: [
        {
          title: 'VILLAGE EXCURSIONS',
          description: 'Slow travel in local neighbourhoods.',
          iconUrl: '<svg className="w-6 h-6 sm:w-8 sm:h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6M10 11h4" strokeLinecap="round" strokeLinejoin="round"/></svg>',
          filterKey: 'village'
        },
        {
          title: 'HERITAGE WALKS',
          description: 'Step back in time to ancient eras.',
          iconUrl: '<svg className="w-6 h-6 sm:w-8 sm:h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>',
          filterKey: 'heritage'
        },
        {
          title: 'NATURE TRAILS',
          description: 'Breathe deep in lush forests.',
          iconUrl: '<svg className="w-6 h-6 sm:w-8 sm:h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 20h14M12 20v-8M9 12C9 7 12 4 12 4s3 3 3 8-6 0-6 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>',
          filterKey: 'nature'
        },
        {
          title: 'FOOD JOURNEYS',
          description: 'Taste the authentic flavours of the region.',
          iconUrl: '<svg className="w-6 h-6 sm:w-8 sm:h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM12 12V6m0 6l4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>',
          filterKey: 'food'
        }
      ]
    },
    homeFaqs: {
      type: [{
        q: { type: String, required: true },
        a: { type: String, required: true }
      }],
      default: [
        { q: "What is an AI Travel Planner?", a: "An AI Travel Planner uses advanced algorithms to curate personalized itineraries based on your specific interests, budget, and time constraints, ensuring you get the most out of your trip." },
        { q: "Can I edit the itinerary after it's created?", a: "Yes! You can easily adjust destinations, activities, and timings. The AI will automatically reoptimize your trip plan to fit your new preferences." },
        { q: "How does it work?", a: "Simply tell us your destination, dates, and what kind of experiences you enjoy. We instantly generate a complete day-by-day plan tailored just for you." },
        { q: "Does it include hotel or flight bookings?", a: "Currently, we provide recommendations and direct links to book accommodations and flights, though we do not handle the transactions directly." },
        { q: "Can I use it for group trips?", a: "Absolutely! You can plan trips for any group size and share the itinerary link with your travel companions." }
      ]
    },
    // About Page Content
    aboutVideoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    // Floating Book Now Pop-up
    floatingBookNowBg: {
      type: String,
      default: '/assets/images/cta-goa-sunset.jpg',
      trim: true,
    },
    // Corporate Page Settings
    corporateHeaderImages: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80'
      ],
    },
    corporateFaqs: {
      type: [{
        q: { type: String, required: true },
        a: { type: String, required: true }
      }],
      default: [
        { q: "How long does a typical corporate offsite in Goa last?", a: "Most teams go for 2–3 days — enough time to mix in activities, downtime, and a little reflection." },
        { q: "Can you customize experiences for specific team goals?", a: "Absolutely. Every offsite is shaped around what your team needs: collaboration, leadership, creativity, or something totally different." },
        { q: "What’s the ideal group size?", a: "They handle groups from 10 up to 200, no problem." }
      ],
    },
    // Tour Page Suggestions
    tourSuggestions: {
      type: [String],
      default: ['Half Day Tours', 'Full Day Tours'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({ bookingsEnabled: true });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
