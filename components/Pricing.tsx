
import React from 'react';
import { PlanType } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PlanType) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      type: PlanType.FREE,
      name: 'Starter Terminal',
      price: '0',
      tagline: 'Perfect for individual explorers.',
      features: [
        '1 Neural Vision Analysis / day',
        'Standard Market Signals',
        '1 Exchange Connection',
        'Standard Risk Management',
        'Public Signal Marketplace Access'
      ],
      color: 'gray',
      cta: 'Initialize Free'
    },
    {
      type: PlanType.PRO,
      name: 'Advanced AI',
      price: '49',
      tagline: 'For high-frequency traders.',
      features: [
        'Unlimited AI Vision Analysis',
        'Priority Signal Streams',
        '5 Exchange Connections',
        'Advanced SL/TP Risk Logic',
        'Private Neural Hub Access',
        'Telegram & Discord Sync'
      ],
      color: 'emerald',
      popular: true,
      cta: 'Upgrade to Advanced'
    },
    {
      type: PlanType.ELITE,
      name: 'Institutional',
      price: '199',
      tagline: 'Enterprise-grade intelligence.',
      features: [
        'Custom Neural Model Hosting',
        'API Access for Execution',
        'Unlimited Connections',
        'Dedicated Performance Audit',
        'Whitelabel Signal Portals',
        '24/7 Quantum Priority'
      ],
      color: 'blue',
      cta: 'Contact Institutional'
    }
  ];

  return (
    <section id="pricing" className="py-40 bg-[#030712] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24 space-y-4">
           <h2 className="text-5xl font-black tracking-tight">Select your <span className="text-emerald-400">Intelligence Tier</span></h2>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Unlock professional-grade AI signals and market vision</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`glass rounded-[3rem] border transition-all duration-500 hover:translate-y-[-8px] flex flex-col ${
                plan.popular ? 'border-emerald-500/30 ring-1 ring-emerald-500/20' : 'border-white/5'
              }`}
            >
              <div className="p-12 space-y-8 flex-1">
                {plan.popular && (
                  <span className="bg-emerald-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Recommended</span>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">${plan.price}</span>
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-800">
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${plan.popular ? 'bg-emerald-400 text-black' : 'bg-white/10 text-gray-400'}`}>
                        <i className="fas fa-check"></i>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-12 pt-0">
                <button 
                  onClick={() => onSelectPlan(plan.type)}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                    plan.popular 
                    ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-emerald-500/20' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
