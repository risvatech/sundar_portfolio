import React from 'react';
import { Mail, Globe, Linkedin, ArrowRight, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-primary text-white overflow-hidden">
            {/* Top Section: CTA & Contact */}
            <div className="max-w-7xl mx-auto px-6 py-5 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Info */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[2px] w-12 bg-amber-600"></div>
                            <span className="text-xs uppercase tracking-widest text-gray-300 font-bold">Get in Touch</span>
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-amber-600"></div>
                            </div>
                        </div>

                        <h2 className="text-white text-3xl md:text-4xl font-serif leading-tight">
                            Let&apos;s Discuss Your Challenge
                        </h2>

                        <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                            If you&apos;re facing a strategic decision and need structured thinking and
                            rigorous analysis, I&apos;d welcome a conversation.
                        </p>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <Mail size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
                                    <a
                                        href="mailto:sundaramoorthy.s15@gmail.com"
                                        className="text-lg hover:text-amber-400 transition-colors"
                                    >
                                        sundaramoorthy.s15@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Website */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <Globe size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Website</p>
                                    <a
                                        href="https://sundara-moorthy.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium hover:text-amber-400 transition-colors"
                                    >
                                        sundara-moorthy.com
                                    </a>
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <Linkedin size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">LinkedIn</p>
                                    <a
                                        href="https://www.linkedin.com/in/s-sundara-moorthy/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-medium hover:text-amber-400 transition-colors"
                                    >
                                        Connect on LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => window.open("tel:+917020166785", "_self")}
                            className="mt-8 flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 group shadow-lg hover:shadow-xl"
                        >
                            Book a 20-Minute Discovery Call
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Right Column: Card */}
                    <div className="lg:pl-12">

                        <h2 className="text-white text-3xl md:text-4xl font-serif leading-tight pt-10">
                            Strategy & Growth Advisor
                        </h2>

                        <p className="text-gray-300 text-lg max-w-lg leading-relaxed pt-5 py-5">
                            Strategy & Growth Advisor based in Chennai, working with startups, MSMEs, and leadership teams across India and global markets. Expertise in strategy, design thinking, market research, and go-to-market advisory.
                        </p>
                        <div className="bg-primary backdrop-blur-md border border-gray-700 p-3 rounded-2xl max-w-md shadow-2xl">
                            <div className="mb-6">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-amber-500/30 bg-amber-500/10 text-amber-500">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5-1.338C8.47 21.513 10.179 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.477 0-2.863-.404-4.053-1.106l-.291-.173-2.968.792.792-2.968-.173-.291C4.404 14.863 4 13.477 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-2xl text-white font-bold mb-6">What to Expect</h3>

                            <ul className="space-y-6">
                                {[
                                    "Understand your challenge and context",
                                    "Discuss potential approaches",
                                    "Explore fit and next steps"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-200 font-medium text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <p className="mt-8 text-sm text-gray-400 italic">
                                No commitment. Confidential conversation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 bg-gray-900/50 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                            SM
                        </div>
                        <p className="text-sm text-gray-400">
                            © 2026 S Sundara Moorthy. Powered by{" "}
                            <a
                                href="https://www.risva.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-amber-400"
                            >
                                risva.app
                            </a>
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <a href="/privacy-policy" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Terms of Service</a>

                        <a
                            href="https://www.linkedin.com/in/s-sundara-moorthy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-amber-400 transition-colors"
                        >
                            <Linkedin size={20} />
                        </a>

                        <a
                            href="https://www.facebook.com/profile.php?id=100064303444109"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-amber-400 transition-colors"
                        >
                            <Facebook size={20} />
                        </a>

                        <a
                            href="https://x.com/sundara_sethu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-amber-400 transition-colors"
                        >
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
