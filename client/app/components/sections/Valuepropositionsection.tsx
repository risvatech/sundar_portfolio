const ValuePropositionSection = () => {
    return (
        <section className="w-full bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2">

                    {/* Left Side - Text Content */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                            <p className="text-sm font-semibold uppercase tracking-wider text-[#0B1F32]">
                                What I Do
                            </p>
                        </div>

                        <h2 className="text-4xl font-bold leading-tight text-gray-900 md:text-3xl gap-30">
                            I help MSMEs and startups align strategy, customers, and supply chains—so growth plans are realistic, scalable, and profitable.
                        </h2>

                        <div className="pt-4">
                            <div className="h-1 w-12 rounded-full font-light bg-[#0B1F32]"></div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F32] to-[#1a3a52] shadow-2xl">
                            {/* Replace this div with your actual image */}
                            <img
                                src="/business-consulting.jpg"
                                alt="Strategy and Growth"
                                className="h-full w-full object-cover"
                            />
                            {/* Placeholder content - remove when you add your image */}
                            <div className="flex h-full w-full items-center justify-center">
                                <div className="text-center text-white/30">
                                    <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-sm">Your Image Here</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl bg-[#0B1F32]/10"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ValuePropositionSection;