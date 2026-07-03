import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Code2, BrainCircuit, Activity, Users, CheckCircle2, Zap, LayoutDashboard, Brain, MessageSquare } from 'lucide-react';
import Footer from '../src/components/Footer';

// Floating Card Component for Hero Section
const FloatingCard = ({ title, value, icon: Icon, delay, yOffset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-4 border border-zinc-100 flex items-center gap-4"
    >
      <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{title}</h4>
        <p className="text-xl font-black text-zinc-900">{value}</p>
      </div>
    </motion.div>
  );
};

// Company Logo Placeholder
const CompanyLogo = ({ name }) => (
  <div className="text-xl font-black text-zinc-400 hover:text-zinc-900 transition-colors duration-300 grayscale hover:grayscale-0 cursor-pointer select-none">
    {name}
  </div>
);

// Highlight Text Paragraph
const HighlightParagraph = ({ text }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  return (
    <motion.p
      ref={ref}
      animate={{ 
        color: isInView ? '#FFFFFF' : '#4B5563',
        scale: isInView ? 1.02 : 1,
      }}
      transition={{ duration: 0.4 }}
      className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-8"
    >
      {text}
    </motion.p>
  );
};

// Feature Card
const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[#12192b] border border-zinc-800 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(0,230,118,0.15)] hover:border-emerald-500/50 transition-all cursor-default"
    >
      <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
        <Icon size={30} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-zinc-400 text-lg leading-relaxed">{description}</p>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="font-sans">
      {/* SECTION 1 - HERO (White Background) */}
      <section className="bg-white min-h-screen flex flex-col relative overflow-hidden">
        <header className="w-full border-b border-zinc-800/60 bg-[#0e1117]/95 backdrop-blur-md z-50">
          <nav className="container mx-auto px-6 h-16 flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-black text-white tracking-tight">
                Code<span className="text-emerald-400">Bytes</span><span className="text-emerald-400">.</span>
              </span>
            </div>

            {/* Tagline */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 shadow-inner group hover:border-emerald-500/40 transition-all cursor-default select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-mono font-medium text-zinc-300 tracking-wider uppercase group-hover:text-white transition-colors">
                Break it down to <span className="text-emerald-400 font-bold">0</span> and <span className="text-emerald-400 font-bold">1</span>s
              </span>
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-zinc-300 hover:text-emerald-400 font-semibold px-4 py-2 rounded-lg border border-zinc-700 transition-all">Login</Link>
                <Link to="/signup" className="bg-zinc-800 hover:bg-zinc-700 hover:text-emerald-400 text-white font-semibold px-5 py-2 rounded-lg border border-zinc-700 transition-all">Sign Up</Link>
              </div>
            ) : <div></div>}
          </nav>
        </header>

        <div className="container mx-auto px-6 flex-1 flex flex-col md:flex-row items-center justify-between z-10 relative mt-20 md:mt-32 pb-16">
          {/* Left Hero */}
          <div className="w-full md:w-1/2 md:pr-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-black text-zinc-900 leading-[1.1] tracking-tight mb-6"
            >
              Turn Every Bit of Logic Into <span className="text-[#00E676]">CodeBytes.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-600 font-medium mb-4 leading-relaxed"
            >
              CodeBytes is a platform where programmers master Data Structures & Algorithms, prepare for coding interviews, compete with others, and build the skills required to crack top product companies.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl font-bold text-zinc-800 mb-10"
            >
              We don't just teach coding. We transform bit-level thinking into byte-level mastery.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/problems')}
              className="bg-[#00E676] hover:bg-[#00C853] text-zinc-900 font-black text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-3 transition-all"
            >
              Start Your Journey <ArrowRight size={20} />
            </motion.button>
          </div>

          {/* Right Hero (Floating Cards) */}
          <div className="w-full md:w-1/2 relative h-[500px] mt-16 md:mt-0 flex items-center justify-center">
             <div className="absolute top-10 left-10">
               <FloatingCard title="Status" value="Accepted ✅" icon={CheckCircle2} delay={0.5} yOffset={0} />
             </div>
             <div className="absolute top-40 right-4">
               <FloatingCard title="Performance" value="Runtime 98%" icon={Zap} delay={0.7} yOffset={0} />
             </div>
             <div className="absolute bottom-32 left-0">
               <FloatingCard title="Topic" value="Dynamic Programming" icon={BrainCircuit} delay={0.9} yOffset={0} />
             </div>
             <div className="absolute bottom-10 right-20">
               <FloatingCard title="Guidance" value="AI Mentor Active" icon={Code2} delay={1.1} yOffset={0} />
             </div>
          </div>
        </div>

        {/* Companies Section */}
        <div className="w-full border-t border-zinc-200 bg-zinc-50/50 py-12 mt-16">
          <div className="container mx-auto px-6">
            <p className="text-center text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Our Coders Have Cracked</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-70">
              <CompanyLogo name="Google" />
              <CompanyLogo name="Microsoft" />
              <CompanyLogo name="Amazon" />
              <CompanyLogo name="Adobe" />
              <CompanyLogo name="Atlassian" />
              <CompanyLogo name="Stripe" />
              <CompanyLogo name="PayPal" />
              <CompanyLogo name="Goldman Sachs" />
              <CompanyLogo name="LinkedIn" />
              <CompanyLogo name="Uber" />
              <CompanyLogo name="Netflix" />
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 3 - FEATURES */}
      <section className="bg-[#0B1020] py-32 border-t border-zinc-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for the Next Generation</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Everything you need to master problem solving and ace your technical interviews in one premium platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={Brain}
              title="AI Mentor"
              description="Stuck on a bug? Our intelligent AI mentor analyzes your logic, time complexity, and offers hints without giving away the answer. Personalized learning recommendations tailored to you."
              delay={0.1}
            />
            <FeatureCard 
              icon={Activity}
              title="Progress Analytics"
              description="Track every improvement. Visualize your problem-solving speed, identify weak topics, and watch your global rating soar as you conquer harder challenges."
              delay={0.3}
            />
            <FeatureCard 
              icon={MessageSquare}
              title="Community Discussions"
              description="Learn from other coders. Dive into deep discussions on alternate approaches, share your own optimized solutions, and build your network with ambitious developers."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 - FINAL CTA */}
      <section className="bg-[#0B1020] py-32 border-t border-zinc-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0B1020] to-[#0B1020]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight"
          >
            Ready to Build Your <br />
            <span className="text-[#00E676]">Coding Future?</span>
          </motion.h2>
          
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => navigate('/problems')}
              className="bg-[#00E676] hover:bg-[#00C853] text-zinc-900 font-black text-xl px-10 py-5 rounded-xl shadow-[0_0_40px_rgba(0,230,118,0.3)] hover:shadow-[0_0_60px_rgba(0,230,118,0.5)] flex items-center gap-3 mx-auto transition-all hover:scale-105 active:scale-95"
            >
              Start Solving <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 - FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;
