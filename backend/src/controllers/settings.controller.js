import asyncHandler from 'express-async-handler';
import Settings from '../models/Settings.js';

/**
 * GET /api/v1/settings
 * Get current settings
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();

  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});

/**
 * GET /api/v1/settings/public
 * Public-facing settings subset for homepage (no auth required)
 */
export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();

  // Only expose fields needed for the public site
  const publicSettings = {
    trustHeading: settings.trustHeading,
    trustSubheading: settings.trustSubheading,
    yearsOld: settings.yearsOld,
    explorersCount: settings.explorersCount,
    storytellerExperienceYears: settings.storytellerExperienceYears,
    partners: settings.partners,
    vibes: settings.vibes,
    aboutVideoUrl: settings.aboutVideoUrl,
    floatingBookNowBg: settings.floatingBookNowBg,
    corporateHeaderImages: settings.corporateHeaderImages,
    corporateFaqs: settings.corporateFaqs,
    homeFaqs: settings.homeFaqs,
    tourSuggestions: settings.tourSuggestions,
  };

  res.status(200).json({
    status: 'success',
    data: { settings: publicSettings },
  });
});

/**
 * PATCH /api/v1/settings
 * Update settings (bookingsEnabled + homepage trust section)
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const {
    bookingsEnabled,
    trustHeading,
    trustSubheading,
    yearsOld,
    explorersCount,
    storytellerExperienceYears,
    partners,
    vibes,
    aboutVideoUrl,
    floatingBookNowBg,
    corporateHeaderImages,
    corporateFaqs,
    homeFaqs,
    tourSuggestions,
  } = req.body;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      bookingsEnabled: bookingsEnabled !== undefined ? bookingsEnabled : true,
      trustHeading,
      trustSubheading,
      yearsOld,
      explorersCount,
      storytellerExperienceYears,
      partners,
      vibes,
      aboutVideoUrl,
      floatingBookNowBg,
      corporateHeaderImages,
      corporateFaqs,
      homeFaqs,
      tourSuggestions,
    });
  } else {
    if (bookingsEnabled !== undefined) {
      settings.bookingsEnabled = bookingsEnabled;
    }
    if (trustHeading !== undefined) {
      settings.trustHeading = trustHeading;
    }
    if (trustSubheading !== undefined) {
      settings.trustSubheading = trustSubheading;
    }
    if (yearsOld !== undefined) {
      settings.yearsOld = yearsOld;
    }
    if (explorersCount !== undefined) {
      settings.explorersCount = explorersCount;
    }
    if (storytellerExperienceYears !== undefined) {
      settings.storytellerExperienceYears = storytellerExperienceYears;
    }
    if (partners !== undefined) {
      settings.partners = partners;
    }
    if (vibes !== undefined) {
      settings.vibes = vibes;
    }
    if (aboutVideoUrl !== undefined) {
      settings.aboutVideoUrl = aboutVideoUrl;
    }
    if (floatingBookNowBg !== undefined) {
      settings.floatingBookNowBg = floatingBookNowBg;
    }
    if (corporateHeaderImages !== undefined) {
      settings.corporateHeaderImages = corporateHeaderImages;
    }
    if (corporateFaqs !== undefined) {
      settings.corporateFaqs = corporateFaqs;
    }
    if (homeFaqs !== undefined) {
      settings.homeFaqs = homeFaqs;
    }
    if (tourSuggestions !== undefined) {
      settings.tourSuggestions = tourSuggestions;
    }
    await settings.save();
  }

  res.status(200).json({
    status: 'success',
    data: { settings },
  });
});
