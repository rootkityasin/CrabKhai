'use client';

import { motion } from 'framer-motion';

const team = [
    { name: "Rafsan The Crab", role: "Head Chef", image: "/mascot-avatar.png", color: "bg-red-50" },
    { name: "Sarah Khan", role: "Manager", image: "/mascot-avatar.png", color: "bg-blue-50" },
    { name: "John Doe", role: "Delivery Lead", image: "/mascot-avatar.png", color: "bg-green-50" },
    { name: "Mina Akter", role: "Sous Chef", image: "/mascot-avatar.png", color: "bg-yellow-50" },
];

export default function TeamSection() {
    return (
        <section className="py-24 px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-center text-ocean-blue mb-16 font-heading">
                The <span className="text-crab-red">Team</span>
            </h2>

            <div className="flex overflow-x-auto pb-12 gap-6 snap-x snap-mandatory max-w-6xl mx-auto no-scrollbar">
                {team.map((member, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={`min-w-[280px] p-6 rounded-[2.5rem] ${member.color} snap-center border-2 border-white/50 shadow-xl hover:-translate-y-2 transition-transform duration-300`}
                    >
                        <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden border-4 border-white mb-6 shadow-md">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover p-2" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">{member.name}</h3>
                        <p className="text-center text-crab-red font-bold uppercase text-xs tracking-widest">{member.role}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
