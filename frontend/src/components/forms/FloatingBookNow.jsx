import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicSettings, createEnquiry } from '../../services/api';
import Button from '../common/Button';

const FloatingBookNow = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [bgImage, setBgImage] = useState('/assets/images/cta-goa-sunset.jpg');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Fetch settings & handle timers
    useEffect(() => {
        // 1. Fetch custom background from settings
        const fetchSettings = async () => {
            try {
                const res = await getPublicSettings();
                if (res.data?.settings?.floatingBookNowBg) {
                    setBgImage(res.data.settings.floatingBookNowBg);
                }
            } catch (err) {
                console.error('Failed to fetch floating form background', err);
            }
        };
        fetchSettings();

        // 2. Setup the 45-second popup to appear only once
        const INITIAL_DELAY = 45000;

        const initialTimer = setTimeout(() => {
            setIsOpen(true);
        }, INITIAL_DELAY);

        return () => {
            if (initialTimer) clearTimeout(initialTimer);
        };
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Send an enquiry to management
            // We explicitly format the message so management knows this came from the popup
            await createEnquiry({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                category: 'Query',
                message: `[AUTOMATED RESERVATION REQUEST FROM FLOATING WIDGET]\n\nThe user requested contact for a quick booking. Please reach out to them immediately to assist with their tour selection.`,
            });

            setSuccess(true);

            // Wait a brief moment to show success, then redirect
            setTimeout(() => {
                setIsOpen(false);
                setFormData({ name: '', email: '', phone: '' });
                setSuccess(false);
                navigate('/tours'); // Redirect to tours page as requested
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // If closed, don't render anything (or could render a tiny floating tab to manually reopen)
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-[95vw] sm:w-full max-w-[90vw] md:max-w-4xl max-h-[90vh] bg-[#111] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,180,0,0.2)] border border-white/10 flex flex-col md:flex-row animate-scale-up">

                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-white/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side: Dynamic Image */}
                <div className="w-full md:w-1/2 h-36 min-h-[144px] sm:h-48 md:h-auto shrink-0 relative">
                    <img
                        src={bgImage}
                        alt="Book Your Goa Tour"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = 'linear-gradient(135deg, #F5B400 0%, #ffc107 100%)';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111] to-transparent opacity-90 md:opacity-100" />
                    <div className="absolute bottom-3 left-4 md:bottom-12 md:left-10 z-10 w-[85%]">
                        <span className="text-[#F5B400] text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-1 sm:mb-2 block drop-shadow-lg">Quick Book</span>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-satisfy text-white leading-tight drop-shadow-xl">Your adventure awaits.</h2>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col justify-start md:justify-center overflow-y-auto overscroll-contain">
                    <div className="mb-6 md:mb-8 pt-2 md:pt-0">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Let's get you walking.</h3>
                        <p className="text-gray-400 text-sm">Drop your details below. Our team will contact you instantly to finalize your perfect tour slot.</p>
                    </div>

                    {success ? (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-6 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Request Received!</h4>
                            <p className="text-green-400 text-sm">Taking you to our tour catalog...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#F5B400] focus:bg-white/10 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#F5B400] focus:bg-white/10 transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#F5B400] focus:bg-white/10 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 text-lg"
                                >
                                    {loading ? 'Sending Request...' : 'Find My Tour'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default FloatingBookNow;
