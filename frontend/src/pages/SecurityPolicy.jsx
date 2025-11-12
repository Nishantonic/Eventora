// import React from "react";
// import { motion } from "framer-motion";
// import { Link as RouterLink } from "react-router-dom";
// import { ShieldCheck, Mail } from "lucide-react";

// const Section = ({ id, title, children }) => (
//   <section id={id} className="mb-8 scroll-mt-24">
//     <h3 className="text-2xl font-bold text-yellow-400 mb-3">{title}</h3>
//     <div className="text-gray-300 leading-relaxed space-y-3">
//       {children}
//     </div>
//   </section>
// );

// const SecurityPolicy = () => {
//   const toc = [
//     { id: "data-collection", label: "Data Collection" },
//     { id: "use-of-data", label: "Use of Data" },
//     { id: "storage-encryption", label: "Storage & Encryption" },
//     { id: "data-sharing", label: "Data Sharing" },
//     { id: "cookies", label: "Cookies" },
//     { id: "access-deletion", label: "Access & Deletion" },
//     { id: "incident-response", label: "Incident Response" },
//     { id: "third-parties", label: "Third-party Services" },
//     { id: "changes", label: "Changes to Policy" },
//     { id: "contact", label: "Contact" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/80 to-black text-white py-12 px-4">
//       <motion.div
//         className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8"
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45, ease: "easeOut" }}
//       >
//         <main className="lg:col-span-3">
//           <div className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl border border-purple-600/30">
//             <div className="flex items-start gap-4 mb-6">
//               <ShieldCheck className="w-12 h-12 text-green-400 mt-1" />
//               <div>
//                 <h1 className="text-4xl font-extrabold text-yellow-400 leading-tight">
//                   Security & Data Protection Policy
//                 </h1>
//                 <p className="text-gray-400 mt-2">
//                   We take the security, privacy and integrity of your data seriously.
                  
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 border-t border-gray-800 pt-6 space-y-6">
//               <Section id="data-collection" title="Data Collection">
//                 <p>
//                   We collect information you provide directly (e.g., account creation, bookings)
//                   and information collected automatically (e.g., usage data, device info).
//                 </p>
//                 <ul className="list-disc pl-5 text-gray-300">
//                   <li><strong>Account data:</strong> name, email, hashed password.</li>
//                   <li><strong>Booking data:</strong> event id, quantity, timestamp, payment reference.</li>
//                   <li><strong>Usage & device:</strong> IP address, browser, device type, timestamps.</li>
//                 </ul>
//               </Section>

//               <Section id="use-of-data" title="Use of Data">
//                 <p>
//                   We use data to provide and improve the service: process bookings, communicate updates,
//                   personalize experience, detect fraud, and comply with legal obligations.
//                 </p>
//               </Section>

//               <Section id="storage-encryption" title="Storage & Encryption">
//                 <p>
//                   Sensitive data (such as passwords and payment tokens) are protected:
//                 </p>
//                 <ul className="list-disc pl-5 text-gray-300">
//                   <li>Passwords are stored hashed using modern algorithms (e.g., bcrypt/argon2).</li>
//                   <li>Payment information is tokenized — we do not store raw card data on our servers.</li>
//                   <li>Data in transit is encrypted using TLS (HTTPS). Data at rest is protected via encryption where applicable.</li>
//                 </ul>
//                 <p className="text-sm text-gray-400 mt-2">
//                   Note: exact cryptography and infrastructure details may vary by deployment and are managed by our ops team.
//                 </p>
//               </Section>

//               <Section id="data-sharing" title="Data Sharing & Third Parties">
//                 <p>
//                   We do not sell personal data. We may share data with:
//                 </p>
//                 <ul className="list-disc pl-5 text-gray-300">
//                   <li>Payment processors (to complete transactions).</li>
//                   <li>Analytics and monitoring providers (to improve service reliability).</li>
//                   <li>Legal authorities when required by law or to protect rights and safety.</li>
//                 </ul>
//               </Section>

//               <Section id="cookies" title="Cookies & Tracking">
//                 <p>
//                   We use cookies and similar technologies to enable basic site functionality, remember preferences,
//                   and collect analytics. You can control cookie preferences via your browser settings.
//                 </p>
//               </Section>

//               <Section id="access-deletion" title="Access, Correction & Deletion">
//                 <p>
//                   You can request access to the data we hold about you, request corrections, or request deletion.
//                   To exercise these rights, contact us (see Contact section) and we'll respond within a reasonable timeframe.
//                 </p>
//               </Section>

//               <Section id="incident-response" title="Incident Response & Breach Notification">
//                 <p>
//                   We maintain an incident response plan. If a security incident affecting your personal data occurs,
//                   we will investigate, contain, and notify affected users and authorities as required by law.
//                 </p>
//               </Section>

//               <Section id="third-parties" title="Third-party Services">
//                 <p>
//                   Some features rely on third-party services (maps, analytics, payment gateways). Those services have their own
//                   terms and privacy policies—we recommend reviewing them before using those features.
//                 </p>
//               </Section>

//               <Section id="changes" title="Changes to This Policy">
//                 <p>
//                   We may update this policy from time to time. Material changes will be notified via email or a prominent notice
//                   on the site. The “last updated” date below indicates the most recent revision.
//                 </p>
//                 <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
//               </Section>

//               <Section id="contact" title="Contact & Reporting">
//                 <p>
//                   For questions, data access requests, or to report a vulnerability, please contact our security team:
//                 </p>
//                 <p className="mt-3">
//                   <a
//                     href="mailto:support@eventora.example"
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white"
//                   >
//                     <Mail className="w-4 h-4" /> support@eventora.example
//                   </a>
//                 </p>
//               </Section>

//             </div>
//           </div>
//         </main>

//         <aside className="hidden lg:block">
//           <div className="sticky top-28">
//             <div className="bg-gray-900/80 p-4 rounded-xl shadow-lg border border-purple-700/30">
//               <h4 className="text-lg font-semibold text-purple-300 mb-3">On this page</h4>
//               <nav className="space-y-2 text-gray-300 text-sm">
//                 {toc.map((t) => (
//                   <a
//                     key={t.id}
//                     href={`#${t.id}`}
//                     className="block py-2 px-3 rounded-md hover:bg-purple-800/40 transition"
//                   >
//                     {t.label}
//                   </a>
//                 ))}
//               </nav>

//               <div className="mt-6">
//                 <RouterLink  className="block text-center px-3 py-2 bg-purple-600 rounded-md hover:bg-purple-500 transition">
//                   Contact Support
//                 </RouterLink>
//               </div>

//               <div className="mt-4 text-xs text-gray-500">
//                 <p>Version: 1.0</p>
//                 <p className="mt-1">Jurisdiction: Subject to local laws where the service is operated.</p>
//               </div>
//             </div>
//           </div>
//         </aside>
//       </motion.div>
//     </div>
//   );
// };

// export default SecurityPolicy;
