import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#040814] py-24 md:py-32 border-t border-zinc-800/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-24 mb-24">
          
          {/* Column 1 */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-5 md:space-y-6">
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Problems</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">AI Mentor</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Community</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Contests</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Leaderboard</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">About</h4>
            <ul className="space-y-5 md:space-y-6">
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">CodeBytes</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Mission</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Vision</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Careers</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Contact Us</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-5 md:space-y-6">
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Blog</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Interview Prep</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">System Design</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Developer API</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-5 md:space-y-6">
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Privacy Policy</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Terms of Service</li>
              <li className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">Cookie Policy</li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-800/50">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
             <div className="text-2xl font-black text-white tracking-tight">CodeBytes</div>
             <p className="text-zinc-600 text-sm">Embrace the unknown!</p>
          </div>
          
          <div className="text-zinc-600 text-sm">
            © CodeBytes 2026. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
