import ContactForm from '../../components/forms/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-black text-white font-urbanist selection:bg-[#F5B400]/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#F5B400]/5 blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#47E4FF]/5 blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 pt-16 pb-12 sm:pt-32 sm:pb-20">

        {/* Mobile-Only Header - Very Compact */}
        <div className="lg:hidden text-center mb-8">
          <p className="text-[#F5B400] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Get In Touch</p>
          <h1 className="font-satisfy text-3xl font-bold text-white mb-2 leading-tight">
            Connect with <span className="text-[#F5B400]">Our Team</span>
          </h1>
          <p className="text-white/50 text-xs px-6 max-w-sm mx-auto">Have questions? We're here to help you plan your perfect Panjim experience.</p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 lg:items-start">

          {/* Contact Info Section */}
          <div className="lg:w-5/12 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* Desktop-Only Header */}
            <div className="hidden lg:block">
              <p className="text-[#F5B400] text-sm font-bold tracking-[0.3em] uppercase mb-4">
                Get In Touch
              </p>
              <h1 className="font-satisfy text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                Connect with <br />
                <span className="text-[#F5B400]">Our Team</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Have questions about our heritage tours? We're here to help you plan your perfect Panjim experience.
              </p>
            </div>

            {/* Compact Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-4">
              <a 
                href="mailto:walkwithhistorygoa@gmail.com"
                className="group flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-3xl hover:border-[#F5B400]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#F5B400]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#F5B400]/20 transition-all">
                  <svg className="w-6 h-6 text-[#F5B400]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Email Us</h3>
                  <span className="text-white text-sm sm:text-base font-semibold hover:text-[#47E4FF] transition-colors">walkwithhistorygoa@gmail.com</span>
                </div>
              </a>

              <div className="group flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-3xl hover:border-[#F5B400]/40 transition-all duration-300 relative">
                <div className="w-12 h-12 bg-[#F5B400]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#F5B400]/20 transition-all">
                  <svg className="w-6 h-6 text-[#F5B400]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Call Us</h3>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+917972549675" className="text-white text-sm sm:text-base font-semibold hover:text-[#47E4FF] transition-colors">+91 79725 49675</a>
                    <a href="tel:+918390324960" className="text-white text-sm sm:text-base font-semibold hover:text-[#47E4FF] transition-colors">+91 83903 24960</a>
                  </div>
                </div>
                {/* Invisible link overlay for the first number if user clicks elsewhere in the box */}
                <a href="tel:+917972549675" className="absolute inset-0 z-0 sm:hidden lg:hidden" aria-hidden="true" title="Call Main Line"></a>
              </div>


            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-7/12 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden relative group">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5B400]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-8 hidden lg:block">
                  <h2 className="font-satisfy text-3xl font-bold text-white mb-2">Send us a Message</h2>
                  <p className="text-white/50 text-sm">Fill out the form and our team will get back to you shortly.</p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;



