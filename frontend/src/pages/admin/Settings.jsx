import { useState, useEffect } from 'react';
import { getSettings, updateSettings, AuthenticationError } from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSettings();
        setSettings(data.data?.settings);
      } catch (err) {
        // Don't display authentication errors - they're handled globally
        if (err instanceof AuthenticationError || err.isAuthError) {
          return;
        }
        setError(err.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleFieldChange = (field, value) => {
    setSettings((prev) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };


  const handleToggleBookings = async () => {
    if (!settings) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(false);

      const newValue = !settings.bookingsEnabled;
      const data = await updateSettings({ bookingsEnabled: newValue });
      setSettings(data.data?.settings);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to update settings.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTrustSection = async () => {
    if (!settings) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(false);

      const payload = {
        trustHeading: settings.trustHeading,
        trustSubheading: settings.trustSubheading,
        yearsOld: settings.yearsOld,
        explorersCount: settings.explorersCount,
        partners: settings.partners || [],
        vibes: settings.vibes || [],
        homeFaqs: settings.homeFaqs || [],
        aboutVideoUrl: settings.aboutVideoUrl,
        floatingBookNowBg: settings.floatingBookNowBg,
        tourSuggestions: settings.tourSuggestions || [],
      };

      const data = await updateSettings(payload);
      setSettings(data.data?.settings);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to update trust section.');
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Settings
        </h1>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
        Settings
      </h1>

      {error && (
        <div className="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100  border border-green-400  text-green-700  px-4 py-3 rounded-lg mb-4">
          Settings updated successfully!
        </div>
      )}

      <div className="bg-white  rounded-xl shadow border border-gray-200  p-6">
        <div className="space-y-6">
          {/* Bookings Availability Section */}
          <div className="border-b border-gray-200  pb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800  mb-2">
                  Bookings Availability
                </h2>
                <p className="text-gray-600  text-sm">
                  {settings?.bookingsEnabled
                    ? 'Bookings are currently enabled. Users can make new bookings.'
                    : 'Bookings are currently disabled. Users cannot make new bookings.'}
                </p>
              </div>
              <div className="ml-6">
                <button
                  onClick={handleToggleBookings}
                  disabled={updating}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings?.bookingsEnabled
                    ? 'bg-green-600'
                    : 'bg-gray-200 '
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  role="switch"
                  aria-checked={settings?.bookingsEnabled}
                  aria-label="Toggle bookings availability"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings?.bookingsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>
            {updating && (
              <p className="text-sm text-gray-500  mt-2">
                Updating...
              </p>
            )}
          </div>

          {/* Homepage Trust & Partners Section */}
          <div className="pt-6 border-t border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-800  mb-2">
              Homepage – Trust &amp; Partners
            </h2>
            <p className="text-gray-600  text-sm mb-4">
              Control the numbers and partner logos shown in the “Why Travelers Trust Us” section on the public
              website.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings?.trustHeading || ''}
                    onChange={(e) => handleFieldChange('trustHeading', e.target.value)}
                    placeholder="Why Travelers Trust Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">
                    Subheading
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={settings?.trustSubheading || ''}
                    onChange={(e) => handleFieldChange('trustSubheading', e.target.value)}
                    placeholder="Small group stories, big memories — here’s what backs our walks."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-1">
                      Years old
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={settings?.yearsOld ?? ''}
                      onChange={(e) =>
                        handleFieldChange('yearsOld', e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-1">
                      Explorers
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={settings?.explorersCount ?? ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'explorersCount',
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-1">
                      Storyteller years
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={settings?.storytellerExperienceYears ?? ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'storytellerExperienceYears',
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Trusted Partners</h3>
                      <p className="text-gray-500 text-sm">Add partner logos to display in the scrolling marquee on the home page.</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newPartners = [...(settings?.partners || [])];
                        newPartners.push({ name: '', logoUrl: '' });
                        handleFieldChange('partners', newPartners);
                      }}
                    >
                      + Add Partner
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {(settings?.partners || []).map((partner, idx) => (
                      <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative group">
                        <button
                          type="button"
                          onClick={() => {
                            const newPartners = [...settings.partners];
                            newPartners.splice(idx, 1);
                            handleFieldChange('partners', newPartners);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Remove Partner"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>

                        <div className="p-4 sm:p-5 flex flex-col gap-4">
                          {/* Live Preview Header */}
                          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-100 min-h-[80px]">
                            {partner.logoUrl ? (
                              <img src={partner.logoUrl} alt="logo preview" className="max-w-full max-h-12 object-contain" />
                            ) : (
                              <span className="text-gray-400 text-sm font-semibold italic">{partner.name || 'Preview Logo'}</span>
                            )}
                          </div>

                          {/* Edit Fields */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Partner Name</label>
                              <input
                                type="text"
                                className="w-full rounded bg-gray-50 border border-gray-200 px-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
                                value={partner.name || ''}
                                onChange={(e) => {
                                  const newPartners = [...settings.partners];
                                  newPartners[idx].name = e.target.value;
                                  handleFieldChange('partners', newPartners);
                                }}
                                placeholder="e.g. Airbnb"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Logo URL</label>
                              <input
                                type="text"
                                className="w-full rounded bg-gray-50 border border-gray-200 px-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
                                value={partner.logoUrl || ''}
                                onChange={(e) => {
                                  const newPartners = [...settings.partners];
                                  newPartners[idx].logoUrl = e.target.value;
                                  handleFieldChange('partners', newPartners);
                                }}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!settings?.partners || settings.partners.length === 0) && (
                      <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <p className="text-gray-500 text-sm">No partners added yet.</p>
                        <button onClick={() => {
                          const newPartners = [...(settings?.partners || [])];
                          newPartners.push({ name: '', logoUrl: '' });
                          handleFieldChange('partners', newPartners);
                        }} className="mt-2 text-sm text-blue-600 font-medium hover:underline">Add your first partner</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vibe Management Section (Small Windows style) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Experience Vibes</h3>
                  <p className="text-gray-500 text-sm">Manage the grid of 'Vibes' displayed on the home page.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const newVibes = [...(settings?.vibes || [])];
                    newVibes.push({ title: 'NEW VIBE', description: '', iconUrl: '', filterKey: '' });
                    handleFieldChange('vibes', newVibes);
                  }}
                >
                  + Add Vibe
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(settings?.vibes || []).map((vibe, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const newVibes = [...settings.vibes];
                        newVibes.splice(idx, 1);
                        handleFieldChange('vibes', newVibes);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remove Vibe"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>

                    <div className="p-5 flex flex-col gap-4">
                      {/* Live Preview Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden shrink-0">
                          {vibe.iconUrl ? (
                            vibe.iconUrl.startsWith('<svg') ? (
                              <div dangerouslySetInnerHTML={{ __html: vibe.iconUrl.replace('w-6 h-6 sm:w-8 sm:h-8 mb-3', 'w-5 h-5') }} />
                            ) : (
                              <img src={vibe.iconUrl} alt="icon" className="w-6 h-6 object-contain" />
                            )
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-wider">{vibe.title || 'Untitled'}</p>
                          <p className="text-[10px] text-gray-500 truncate">{vibe.filterKey ? `?category=${vibe.filterKey}` : 'No filter key'}</p>
                        </div>
                      </div>

                      {/* Edit Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                          <input
                            type="text"
                            className="w-full rounded bg-gray-50 border border-gray-200 px-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
                            value={vibe.title || ''}
                            onChange={(e) => {
                              const newVibes = [...settings.vibes];
                              newVibes[idx].title = e.target.value;
                              handleFieldChange('vibes', newVibes);
                            }}
                            placeholder="e.g. VILLAGE EXCURSIONS"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                          <input
                            type="text"
                            className="w-full rounded bg-gray-50 border border-gray-200 px-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
                            value={vibe.description || ''}
                            onChange={(e) => {
                              const newVibes = [...settings.vibes];
                              newVibes[idx].description = e.target.value;
                              handleFieldChange('vibes', newVibes);
                            }}
                            placeholder="e.g. Slow travel in local neighbourhoods"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Filter Key (For Search)</label>
                          <input
                            type="text"
                            className="w-full rounded bg-gray-50 border border-gray-200 px-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
                            value={vibe.filterKey || ''}
                            onChange={(e) => {
                              const newVibes = [...settings.vibes];
                              newVibes[idx].filterKey = e.target.value;
                              handleFieldChange('vibes', newVibes);
                            }}
                            placeholder="e.g. village"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Icon SVG / Image URL</label>
                          <textarea
                            className="w-full rounded bg-gray-50 border border-gray-200 px-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 font-mono"
                            rows={3}
                            value={vibe.iconUrl || ''}
                            onChange={(e) => {
                              const newVibes = [...settings.vibes];
                              newVibes[idx].iconUrl = e.target.value;
                              handleFieldChange('vibes', newVibes);
                            }}
                            placeholder="<svg>...</svg> or https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Search Suggestions Management */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Tour Search Suggestions</h3>
                  <p className="text-gray-500 text-sm">Add quick-access search terms like "Half Day Tours" or "Full Day Tours" to the public page.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(settings?.tourSuggestions || []).map((suggestion, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                    <span>{suggestion}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSuggestions = [...settings.tourSuggestions];
                        newSuggestions.splice(idx, 1);
                        handleFieldChange('tourSuggestions', newSuggestions);
                      }}
                      className="hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {(!settings?.tourSuggestions || settings.tourSuggestions.length === 0) && (
                  <p className="text-gray-400 text-sm italic">No suggestions added.</p>
                )}
              </div>

              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  id="newSuggestion"
                  placeholder="e.g. Walking Tours"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target;
                      if (input.value.trim()) {
                        const newSuggestions = [...(settings?.tourSuggestions || [])];
                        newSuggestions.push(input.value.trim());
                        handleFieldChange('tourSuggestions', newSuggestions);
                        input.value = '';
                      }
                      e.preventDefault();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newSuggestion');
                    if (input.value.trim()) {
                      const newSuggestions = [...(settings?.tourSuggestions || [])];
                      newSuggestions.push(input.value.trim());
                      handleFieldChange('tourSuggestions', newSuggestions);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Home FAQs Management Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Home Page FAQs</h3>
                  <p className="text-gray-500 text-sm">Manage the Common Questions section on the home page.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const newFaqs = [...(settings?.homeFaqs || [])];
                    newFaqs.push({ q: 'New Question?', a: '' });
                    handleFieldChange('homeFaqs', newFaqs);
                  }}
                >
                  + Add FAQ
                </Button>
              </div>

              <div className="space-y-4">
                {(settings?.homeFaqs || []).map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = [...settings.homeFaqs];
                        newFaqs.splice(idx, 1);
                        handleFieldChange('homeFaqs', newFaqs);
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remove FAQ"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>

                    <div className="space-y-3 pr-10">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Question</label>
                        <input
                          type="text"
                          className="w-full rounded bg-gray-50 border border-gray-300 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                          value={faq.q || ''}
                          onChange={(e) => {
                            const newFaqs = [...settings.homeFaqs];
                            newFaqs[idx].q = e.target.value;
                            handleFieldChange('homeFaqs', newFaqs);
                          }}
                          placeholder="What is an AI Travel Planner?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Answer</label>
                        <textarea
                          className="w-full rounded bg-gray-50 border border-gray-300 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          value={faq.a || ''}
                          onChange={(e) => {
                            const newFaqs = [...settings.homeFaqs];
                            newFaqs[idx].a = e.target.value;
                            handleFieldChange('homeFaqs', newFaqs);
                          }}
                          placeholder="It helps you create personalized trips..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!settings?.homeFaqs || settings.homeFaqs.length === 0) && (
                  <div className="text-sm text-gray-500 italic py-2">No FAQs added yet.</div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveTrustSection} disabled={updating}>
                {updating ? 'Saving...' : 'Save Trust Section'}
              </Button>
            </div>
          </div>

          {/* About Page Settings Section */}
          <div className="pt-6 border-t border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-800  mb-2">
              About Page Settings
            </h2>
            <p className="text-gray-600  text-sm mb-4">
              Manage content for the public About Us page.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  About Video URL
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings?.aboutVideoUrl || ''}
                  onChange={(e) => handleFieldChange('aboutVideoUrl', e.target.value)}
                  placeholder="https://link-to-video.mp4"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a direct link to an MP4 video file, or an embeddable URL.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveTrustSection} disabled={updating}>
                  {updating ? 'Saving...' : 'Save About Settings'}
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Book Now Settings Section */}
          <div className="pt-6 border-t border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-800  mb-2">
              Floating 'Book Now' Widget
            </h2>
            <p className="text-gray-600  text-sm mb-4">
              Manage the repeating popup form that appears to capture instant bookings/enquiries.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">
                  Background Image URL
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-sm text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings?.floatingBookNowBg || ''}
                  onChange={(e) => handleFieldChange('floatingBookNowBg', e.target.value)}
                  placeholder="/assets/images/cta-goa-sunset.jpg or https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a direct URL or local asset path for the image used as the popup form's background.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveTrustSection} disabled={updating}>
                  {updating ? 'Saving...' : 'Save Widget Settings'}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
