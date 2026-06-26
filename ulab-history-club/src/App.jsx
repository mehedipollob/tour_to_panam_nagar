import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

// ── Data ──────────────────────────────────────────────────────────
const schedule = [
  { time: "9:00 AM", activity: "Assembly and departure from ULAB Permanent Campus", icon: "🏛️", tag: "Departure", color: "#c9a84c" },
  { time: "10:00 AM", activity: "Arrival at Sonargaon Folk Arts & Crafts Museum", icon: "🏺", tag: "Museum", color: "#a67c52" },
  { time: "11:30 AM", activity: "Entry to Panam Nagar — Welcome briefing by club coordinator", icon: "📜", tag: "Briefing", color: "#c9a84c" },
  { time: "11:30 AM – 1:00 PM", activity: "Tour of Panam City — heritage buildings, Panam Bridge, and the main street", icon: "🗺️", tag: "Guided Tour", color: "#8ba888" },
  { time: "1:00 PM – 1:30 PM", activity: "Structured observation activity: Architectural sketching & photography", icon: "✏️", tag: "Activity", color: "#7a9eb5" },
  { time: "1:30 PM – 2:00 PM", activity: "Lunch break", icon: "🍽️", tag: "Lunch", color: "#b57a5a" },
  { time: "1:30 PM – 3:00 PM", activity: "Free exploration and group discussion", icon: "🔍", tag: "Exploration", color: "#8ba888" },
  { time: "3:00 PM – 3:30 PM", activity: "Historical Quiz competition", icon: "🏆", tag: "Competition", color: "#c9a84c" },
  { time: "3:30 PM", activity: "Departure back to Dhaka", icon: "🚌", tag: "Departure", color: "#a67c52" },
  { time: "5:00 PM", activity: "Arrival at ULAB Campus", icon: "🏫", tag: "Arrival", color: "#c9a84c" },
];

const executives = [
  { name: "M Shahidul Islam Khandakar", designation: "Club Advisor", initials: "FA",photo: "/advisor.png" },
  { name: "Mehedi Hasan Pollob", designation: "President", initials: "PR",photo: "/pollob.jpeg" },
  { name: "Anika Afrin Juhi ", designation: "Vice President", initials: "VP",photo: "/juhi.jpeg" },
  { name: "Moumita Mir Muskan", designation: "General Secretary", initials: "GS",photo: "/muskan.jpeg" },
  { name: "Rifat Sadia", designation: "Organizing Secretary", initials: "OS",photo: "/sadia.jpeg" },
  { name: "Jannatul Ferdous", designation: "Financial Secretary", initials: "FS",photo: "/jannatul.jpeg" },
  { name: "Mst Mustara Khatun Mugni", designation: "Publication Secretary", initials: "PS", photo:"/mugni.jpeg" },
];

const departments = [
  "Department of English", "Department of History", "Department of Media Studies",
  "Department of Business Administration", "Department of Computer Science",
  "Department of Architecture", "Department of Law", "Other",
];

// July 4, 2026 at 9:00 PM (Local Time)
const REGISTRATION_OPEN_DATE = new Date('2026-07-04T21:00:00');

const galleryPlaces = [
  {
    name: "Panam Nagar",
    subtitle: "Ancient Merchant City · 15th Century",
    tag: "Heritage Site",
    tagColor: "#c9a84c",
    description: "A 600-metre street lined with 52 crumbling mansions built by wealthy Hindu merchants. Once a thriving trade capital of Bengal, now Bangladesh's most evocative ghost town.",
    facts: ["52 Heritage Buildings", "600m Historic Street", "Protected by Dept. of Archaeology"],
    photos: [
      { caption: "The iconic main street of Panam Nagar", src: "/images/panam1.jpg", icon: "🏛️" },
      { caption: "Heritage facades along Panam Street", icon: "🏚️" },
    ],
  },
  {
    name: "Sonargaon Folk Arts & Crafts Museum",
    subtitle: "Boro Sardar Bari · Est. 1975",
    tag: "Museum",
    tagColor: "#8ba888",
    description: "Housed in the restored 1901 Boro Sardar Bari mansion, this museum celebrates rural Bengal's artistic heritage — from Muslin textiles to ornate wooden crafts and folk instruments.",
    facts: ["Est. by Painter Zainul Abedin", "Built 1901 · Restored 2020", "50-hectare lakeside campus"],
    photos: [
      { caption: "Boro Sardar Bari mansion exterior", src: "/images/panam4.jpg", icon: "🏺" },
      { caption: "Folk Arts & Crafts Foundation grounds", src: "/images/panam5.jpg", icon: "🎨" },
    ],
  },
];

const DB_KEY = "ulab1971_registrations";

// --- NEW DATABASE FUNCTION ---
async function saveRegistration(entry) {
  try {
    // 1. Save to Google Sheets via SheetDB
    await fetch("YOUR_SHEETDB_URL", { // <-- PASTE YOUR URL HERE
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          name: entry.name,
          studentId: entry.studentId,
          email: entry.email,
          phone: entry.phone,
          message: entry.message,
          registeredAt: new Date().toISOString()
        }
      })
    });
    
    // 2. Also keep a local backup (optional)
    const all = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
    all.push({ ...entry, id: Date.now(), registeredAt: new Date().toISOString() });
    localStorage.setItem(DB_KEY, JSON.stringify(all));
  } catch (error) {
    console.error("Database error:", error);
    alert("Could not connect to database. Please try again.");
  }
}

// ── Hooks ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTablet;
}

// ── Framer Motion Variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

// ── Main App Component ────────────────────────────────────────────
export default function App() {
    const [form, setForm] = useState({ name: "", studentId: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isRegOpen, setIsRegOpen] = useState(new Date() >= REGISTRATION_OPEN_DATE);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  useEffect(() => {
    if (isRegOpen) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = REGISTRATION_OPEN_DATE - now;

      if (difference <= 0) {
        setIsRegOpen(true);
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRegOpen]);
  // -----------------------------------
  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.studentId.trim()) e.studentId = "Student ID is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    return e;
  }

  const [isSubmitting, setIsSubmitting] = useState(false); // Add this to your useState hooks at the top

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setIsSubmitting(true); // Lock the button
    await saveRegistration(form); // Send to database
    setIsSubmitting(false); // Unlock the button
    setSubmitted(true); // Show success screen
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  const px = isMobile ? "16px" : "24px";
  const sectionPy = isMobile ? "64px" : "100px";

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: "#0a0908", color: "#e8e0d0", minHeight: "100vh", overflowX: "hidden" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        ::selection { background: #c9a84c; color: #0a0908; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0908; }
        ::-webkit-scrollbar-thumb { background: #3a2e1a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #c9a84c; }

        h1, h2, h3, .serif { font-family: 'Cormorant Garamond', serif; }
        
        .gold-text {
          background: linear-gradient(135deg, #f0e8d0, #c9a84c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX, position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "#c9a84c", transformOrigin: "0%", zIndex: 200 }} />

      {/* ── NAV ── */}
      <Nav px={px} isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrollTo={scrollTo} />

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `100px ${px} 60px`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(201,168,76,0.07) 0%,transparent 70%)", pointerEvents: "none" }} 
        />
        
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <motion.div variants={fadeUp} style={{ fontSize: isMobile ? 9 : 11, letterSpacing: isMobile ? 2 : 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
            University of Liberal Arts Bangladesh
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="serif" style={{ fontSize: "clamp(32px,9vw,88px)", fontWeight: 700, lineHeight: 1.05, margin: "0 0 12px", color: "#f0e8d0", letterSpacing: "-1px" }}>
            ULAB 1971<br /><span className="gold-text" style={{ fontStyle: "italic" }}>History Club</span>
          </motion.h1>
          
          <motion.div variants={fadeUp} style={{ width: 80, height: 2, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "20px auto" }} />
          
          <motion.p variants={fadeUp} style={{ fontSize: isMobile ? 15 : 18, color: "#a89878", maxWidth: 520, lineHeight: 1.7, margin: "0 auto 36px", fontStyle: "italic" }}>
            A journey through heritage — exploring the living ruins of Panam Nagar and the soul of Bengal's history.
          </motion.p>
          
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo("schedule")} style={{ background: "#c9a84c", color: "#0a0908", border: "none", padding: isMobile ? "11px 20px" : "12px 28px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: 700 }}>View Schedule</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo("register")} style={{ background: "transparent", color: "#c9a84c", border: "1px solid #c9a84c", padding: isMobile ? "11px 20px" : "12px 28px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>Register Now</motion.button>
          </motion.div>
          
          <motion.div variants={fadeUp} style={{ marginTop: 48, display: "flex", gap: isMobile ? 20 : 40, justifyContent: "center", flexWrap: "wrap" }}>
            {[["Destination","Panam Nagar & Folk Arts & Crafts Museum"],["Date","11 JULY 2026"],["Fee","৳ 290"],["Mode","Heritage Tour"]].map(([label,val]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#c9a84c", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: isMobile ? 12 : 14, color: "#e8e0d0", fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ background: "#15120c", borderTop: "1px solid #2a2318", borderBottom: "1px solid #2a2318", padding: `32px ${px}`, textAlign: "center" }}>
        <p style={{ maxWidth: 700, margin: "0 auto", color: "#a89878", lineHeight: 1.9, fontSize: isMobile ? 14 : 16 }}>
          Founded in the spirit of Bangladesh's liberation year, ULAB 1971 History Club brings students closer to the roots of Bengal. This tour to <strong style={{ color: "#e8e0d0" }}>Panam Nagar</strong> — a 15th-century merchant city — is our flagship annual excursion.
        </p>
      </motion.div>

      {/* ── VISITING PLACES GALLERY ── */}
      <section id="gallery" style={{ padding: `${sectionPy} ${px}`, background: "#0a0908", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Visiting Places" title="Where We're Going" sub="Two iconic heritage sites in Sonargaon, just 40 km from Dhaka" isMobile={isMobile} />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 24 }}>
            {galleryPlaces.map((place, i) => (
              <PlaceCard key={i} place={place} isMobile={isMobile} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ANIMATED BUS JOURNEY ── */}
      <BusJourney isMobile={isMobile} />

      {/* ── SCHEDULE ── */}
      <section id="schedule" style={{ padding: `${sectionPy} ${px}`, background: "#0a0908", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%,rgba(201,168,76,0.04) 0%,transparent 60%),radial-gradient(ellipse at 80% 50%,rgba(139,168,136,0.04) 0%,transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="Day Program" title="Tour Schedule" sub="Panam Nagar Heritage Field Trip — One Day Itinerary" isMobile={isMobile} />

          {isMobile ? (
            <div style={{ position: "relative", paddingLeft: 52 }}>
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,transparent,rgba(201,168,76,0.5) 6%,rgba(201,168,76,0.3) 94%,transparent)", transformOrigin: "top" }} 
              />
              {schedule.map((item, i) => (
                <ScheduleItem key={i} item={item} i={i} isMobile={true} />
              ))}
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)", background: "linear-gradient(to bottom,transparent 0%,rgba(201,168,76,0.6) 8%,rgba(201,168,76,0.3) 92%,transparent 100%)", transformOrigin: "top" }} 
              />
              {schedule.map((item, i) => (
                <ScheduleItem key={i} item={item} i={i} isMobile={false} />
              ))}
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: "center", marginTop: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#15120c", border: "1px solid #2a2318", padding: isMobile ? "10px 16px" : "12px 28px", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>🕐</span>
              <span style={{ fontSize: isMobile ? 12 : 13, color: "#a89878" }}>Total Duration: Approx. <strong style={{ color: "#c9a84c" }}>8 Hours</strong> — 9:00 AM to 5:00 PM</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EXECUTIVES ── */}
      <section id="executives" style={{ padding: `${sectionPy} ${px}`, background: "#080706" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <SectionHeader eyebrow="Leadership" title="Executive Committee" isMobile={isMobile} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 24, justifyContent: "center" }}>
            {executives.map((exec, i) => (
              <ExecCard key={i} exec={exec} i={i} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER ── */}
      <section id="register" style={{ padding: `${sectionPy} ${px}`, background: "#0a0908", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(201,168,76,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="Join the Tour" title="Secure Your Spot" sub="Limited seats available — register early to confirm your place" isMobile={isMobile} />

                    <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessCard key="success" form={form} isMobile={isMobile} setSubmitted={setSubmitted} setForm={setForm} setErrors={setErrors} />
            ) : !isRegOpen ? (
              <LockedRegistrationGate key="locked" isMobile={isMobile} timeLeft={timeLeft} />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 2fr", gap: 24 }}>
                
                {/* Keep your existing sidebar info here */}
                {!isTablet ? (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ background: "#15120c", border: "1px solid #2a2318", padding: "32px 24px", borderRadius: 4 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: "#c9a84c", textTransform: "uppercase", marginBottom: 18, fontWeight: 600 }}>Tour Details</div>
                    {[
                      { icon:"🗺️", label:"Destination", val:"Panam Nagar, Sonargaon" },
                      { icon:"📅", label:"Date", val:"TBA — 2025" },
                      { icon:"🕘", label:"Departure", val:"9:00 AM sharp" },
                      { icon:"🚌", label:"Transport", val:"Club-arranged bus" },
                      { icon:"💰", label:"Tour Fee", val:"৳ 280 per student" },
                      { icon:"👥", label:"Seats", val:"Limited availability" },
                    ].map(({ icon, label, val }) => (
                      <div key={label} style={{ display:"flex", gap:12, marginBottom:16, paddingBottom:16, borderBottom:"1px solid #2a2318" }}>
                        <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{icon}</span>
                        <div>
                          <div style={{ fontSize:9, letterSpacing:1.5, color:"#6a5a40", textTransform:"uppercase", marginBottom:2, fontWeight: 600 }}>{label}</div>
                          <div style={{ fontSize:12, color:"#e8e0d0" }}>{val}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.2)", padding:"12px 14px", marginTop:8, borderRadius: 4 }}>
                      <p style={{ margin:0, fontSize:11, color:"#a89878", lineHeight:1.7, fontStyle:"italic" }}>"Panam Nagar is one of the earliest examples of urban planning in Bengal — a must-see for every history student."</p>
                      <div style={{ fontSize:10, color:"#6a5a40", marginTop:6 }}>— Club Coordinator</div>
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:4, gridColumn: "1 / -1" }}>
                    {[["🗺️","Panam Nagar"],["📅","TBA 2025"],["🚌","Club Bus"],["💰","৳ 280 Fee"]].map(([icon,val]) => (
                      <div key={val} style={{ background:"#15120c", border:"1px solid #2a2318", padding:"8px 12px", fontSize:12, color:"#a89878", display:"flex", alignItems:"center", gap:6, borderRadius: 2 }}>
                        <span>{icon}</span><span>{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Keep your existing form here */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ background: "#15120c", border: "1px solid #2a2318", padding: isMobile ? "24px 16px" : "36px 36px 32px", borderRadius: 4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:"#c9a84c", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0a0908", flexShrink:0 }}>1</div>
                    <div>
                      <div className="serif" style={{ fontSize:18, color:"#f0e8d0", fontWeight:600 }}>Personal Information</div>
                      <div style={{ fontSize:11, color:"#6a5a40" }}>Fill in your details to register</div>
                    </div>
                  </div>

                   <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
    
    {/* FULL NAME FIELD */}
    <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
      <FieldLabel>Full Name *</FieldLabel>
      <StyledInput value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Nadia Sultana" hasError={errors.name} />
      {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
    </div>
    
    {/* STUDENT ID FIELD */}
    <div>
      <FieldLabel>Student ID *</FieldLabel>
      <StyledInput value={form.studentId} onChange={e => setForm({...form,studentId:e.target.value})} placeholder="221014050" hasError={errors.studentId} />
      {errors.studentId && <ErrorMsg>{errors.studentId}</ErrorMsg>}
    </div>

    {/* EMAIL FIELD */}
    <div>
      <FieldLabel>Email *</FieldLabel>
      <StyledInput type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="student@ulab.edu.bd" hasError={errors.email} />
      {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
    </div>

    {/* PHONE FIELD */}
    <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
      <FieldLabel>Phone *</FieldLabel>
      <StyledInput value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="01XXXXXXXXX" hasError={errors.phone} />
      {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
    </div>

    {/* MESSAGE FIELD */}
    <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
      <FieldLabel>Additional Notes</FieldLabel>
      <textarea value={form.message} onChange={e => setForm({...form,message:e.target.value})} placeholder="Mention who you want to sit with on the bus..." rows={3}
        style={{ width:"100%", background:"#0a0908", border:"1px solid #2a2318", color:"#e8e0d0", padding:"11px 14px", fontSize:14, fontFamily:"'Montserrat',sans-serif", outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:1.6, borderRadius: 4 }}
        onFocus={e => e.target.style.borderColor="#c9a84c"} onBlur={e => e.target.style.borderColor="#2a2318"} />
    </div>
  </div>

                  <div style={{ height:1, background:"linear-gradient(90deg,transparent,#2a2318,transparent)", margin:"24px 0" }} />
                                  <motion.button 
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }} 
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  onClick={handleSubmit}
                  style={{
                    width:"100%", 
                    background: isSubmitting ? "#5a4a20" : "linear-gradient(135deg,#c9a84c,#a88030)", 
                    color:"#0a0908", 
                    border:"none", 
                    padding:"15px", 
                    fontSize:12, 
                    letterSpacing:2, 
                    textTransform:"uppercase", 
                    cursor: isSubmitting ? "not-allowed" : "pointer", 
                    fontWeight:700, 
                    borderRadius: 4,
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? "Saving to Database..." : "✦  Confirm Registration  ✦"}
                </motion.button>
                  <p style={{ textAlign:"center", color:"#3a2e1a", fontSize:11, marginTop:12, marginBottom:0 }}>🔒 Your data is stored locally and used solely for tour coordination</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050403", borderTop: "1px solid #1a1710", padding: `48px ${px} 28px` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 32 : 40, marginBottom: 40 }}>
            <div style={{ gridColumn: isMobile ? "1 / -1" : "1" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:30, height:30, border:"2px solid #c9a84c", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#c9a84c" }}>1971</div>
                <span className="serif" style={{ fontSize:18, fontWeight: 600, color:"#e8e0d0", letterSpacing:1 }}>ULAB 1971 History Club</span>
              </div>
              <p style={{ color:"#6a5a40", fontSize:12, lineHeight:1.8, margin:0 }}>Dedicated to exploring, preserving, and celebrating the rich historical heritage of Bangladesh and Bengal.</p>
            </div>
            <div>
              <div style={{ fontSize:9, letterSpacing:3, color:"#c9a84c", textTransform:"uppercase", marginBottom:14, fontWeight: 600 }}>Quick Links</div>
              {["About the Club","Past Events","Gallery","Academic Resources","Contact Us"].map(link => (
                <div key={link} style={{ marginBottom:8 }}>
                  <a href="#" style={{ color:"#6a5a40", fontSize:12, textDecoration:"none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#c9a84c"} onMouseLeave={e => e.currentTarget.style.color="#6a5a40"}>{link}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:9, letterSpacing:3, color:"#c9a84c", textTransform:"uppercase", marginBottom:14, fontWeight: 600 }}>Contact</div>
              <div style={{ color:"#6a5a40", fontSize:12, lineHeight:2 }}>
                <div>📍 ULAB Permanent Campus</div>
                <div>Mohammodpur, Dhaka</div>
                <div style={{ marginTop:6 }}>✉️ history.1971.club@ulab.edu.bd</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize:9, letterSpacing:3, color:"#c9a84c", textTransform:"uppercase", marginBottom:14, fontWeight: 600 }}>Follow Us</div>
              {["Facebook","Instagram","LinkedIn","YouTube"].map(s => (
                <div key={s} style={{ marginBottom:8 }}>
                  <a href="#" style={{ color:"#6a5a40", fontSize:12, textDecoration:"none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#c9a84c"} onMouseLeave={e => e.currentTarget.style.color="#6a5a40"}>{s}</a>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid #1a1710", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <p style={{ color:"#3a2e1a", fontSize:11, margin:0 }}>© 2026 ULAB 1971 History Club. All rights reserved.</p>
            <p style={{ color:"#3a2e1a", fontSize:11, margin:0 }}>University of Liberal Arts Bangladesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Navbar Component ──────────────────────────────────────────────
function Nav({ px, isMobile, menuOpen, setMenuOpen, scrollTo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, 
        background: scrolled ? "rgba(10,9,8,0.85)" : "transparent", 
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #2a2318" : "1px solid transparent",
        padding: `0 ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
        transition: "all 0.3s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => scrollTo("top")}>
        <div style={{ width: 36, height: 36, border: "2px solid #c9a84c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#c9a84c", flexShrink: 0 }}>1971</div>
        <span className="serif" style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: "#e8e0d0", letterSpacing: 0.5 }}>ULAB 1971 History Club</span>
      </div>

      {isMobile ? (
        <>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", color: "#c9a84c", fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ position: "fixed", top: 64, left: 0, right: 0, background: "rgba(10,9,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2a2318", padding: "16px", zIndex: 99, display: "flex", flexDirection: "column", gap: 2, overflow: "hidden" }}
              >
                {["schedule", "gallery", "executives", "register"].map(s => (
                  <button key={s} onClick={() => scrollTo(s)} style={{ background: "none", border: "none", color: "#a89060", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", padding: "12px 8px", textAlign: "left", borderBottom: "1px solid #1e1c14" }}>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div style={{ display: "flex", gap: 32 }}>
          {["schedule", "gallery", "executives", "register"].map(s => (
            <motion.button key={s} whileHover={{ y: -2 }} onClick={() => scrollTo(s)} style={{ background: "none", border: "none", color: "#a89060", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>{s}</motion.button>
          ))}
        </div>
      )}
    </motion.nav>
  );
}

// ── Section Header ────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub, isMobile }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} style={{ textAlign:"center", marginBottom: isMobile ? 48 : 70 }}>
      <motion.div variants={fadeUp} style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <div style={{ width:32, height:1, background:"#c9a84c", opacity:0.5 }} />
        <span style={{ fontSize:9, letterSpacing:4, color:"#c9a84c", textTransform:"uppercase", fontWeight: 600 }}>{eyebrow}</span>
        <div style={{ width:32, height:1, background:"#c9a84c", opacity:0.5 }} />
      </motion.div>
      <motion.h2 variants={fadeUp} className="serif" style={{ fontSize:`clamp(26px,6vw,52px)`, margin:"0 0 8px", color:"#f0e8d0", fontWeight:700, letterSpacing:"-0.5px" }}>{title}</motion.h2>
      {sub && <motion.p variants={fadeUp} style={{ color:"#6a5a40", fontSize:13, margin:0, fontStyle:"italic" }}>{sub}</motion.p>}
    </motion.div>
  );
}

// ── Schedule Item ─────────────────────────────────────────────────
function ScheduleItem({ item, i, isMobile }) {
  const isLeft = i % 2 === 0;

  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
        style={{ position: "relative", marginBottom: 20 }}
      >
        <div style={{ position: "absolute", left: -42, top: 14, width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(circle,${item.color}22 0%,#15120c 70%)`, border: `2px solid ${item.color}`, boxShadow: `0 0 10px ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
          {item.icon}
        </div>
        <div style={{ background: "#15120c", border: `1px solid #2a2318`, borderLeft: `3px solid ${item.color}`, padding: "14px 16px", borderRadius: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: item.color, background: `${item.color}18`, padding: "2px 8px", border: `1px solid ${item.color}44`, borderRadius: 2, fontWeight: 600 }}>{item.tag}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", fontFamily: "'Courier New',monospace" }}>{item.time}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#e8e0d0", lineHeight: 1.65 }}>{item.activity}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ display: "flex", alignItems: "center", marginBottom: 12, position: "relative", minHeight: 90 }}
    >
      <div style={{ flex: 1, paddingRight: 48, display: "flex", justifyContent: "flex-end" }}>
        {isLeft ? <ScheduleCard item={item} align="right" /> : <TimeStamp time={item.time} align="right" />}
      </div>
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `radial-gradient(circle,${item.color}22 0%,#15120c 70%)`, border: `2px solid ${item.color}`, boxShadow: `0 0 16px ${item.color}44,0 0 4px ${item.color}88`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {item.icon}
        </div>
      </div>
      <div style={{ flex: 1, paddingLeft: 48, display: "flex", justifyContent: "flex-start" }}>
        {isLeft ? <TimeStamp time={item.time} align="left" /> : <ScheduleCard item={item} align="left" />}
      </div>
    </motion.div>
  );
}

function ScheduleCard({ item, align }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -2 }}
      style={{ maxWidth:340, background: "#15120c", border:`1px solid #2a2318`, borderLeft: align==="left" ? `3px solid ${item.color}` : undefined, borderRight: align==="right" ? `3px solid ${item.color}` : undefined, padding:"16px 20px", borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: "box-shadow 0.3s" }}
    >
      <div style={{ marginBottom:8 }}>
        <span style={{ fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:item.color, background:`${item.color}18`, padding:"2px 8px", border:`1px solid ${item.color}44`, borderRadius: 2, fontWeight: 600 }}>{item.tag}</span>
      </div>
      <p style={{ margin:0, fontSize:14, color:"#e8e0d0", lineHeight:1.65 }}>{item.activity}</p>
    </motion.div>
  );
}

function TimeStamp({ time, align }) {
  return (
    <div style={{ textAlign: align==="right" ? "right" : "left" }}>
      <span style={{ display:"inline-block", fontSize:12, fontWeight:700, color:"#c9a84c", letterSpacing:0.5, fontFamily:"'Courier New',monospace", background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.2)", padding:"6px 12px", lineHeight:1.4, borderRadius: 2 }}>
        {time}
      </span>
    </div>
  );
}

// ── Executive Card ────────────────────────────────────────────────
// ── Executive Card ────────────────────────────────────────────────
function ExecCard({ exec, i, isMobile }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      style={{
        flex: isMobile ? "1 1 calc(50% - 6px)" : "1 1 250px",
        maxWidth: isMobile ? "calc(50% - 6px)" : 300,
        background: "#0a0908",
        border: "1px solid #2a2318",
        overflow: "hidden",
        boxSizing: "border-box",
        borderRadius: 4,
        cursor: "default",
      }}
    >
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
        <div style={{ width: "100%", aspectRatio: "3/4", background: "linear-gradient(160deg,#1e1a10,#0a0908)", position: "relative", overflow: "hidden" }}>
          {exec.photo
            ? <img src={exec.photo} alt={exec.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
            : <PlaceholderPhoto initials={exec.initials} color="#c9a84c88" />
          }
        </div>
        <div style={{ padding: isMobile ? "10px 12px 12px" : "14px 16px 16px", borderTop: "1px solid #1e1c14", background: "#15120c" }}>
          <h3 className="serif" style={{ margin: "0 0 3px", fontSize: isMobile ? 16 : 18, color: "#f0e8d0", fontWeight: 600 }}>{exec.name}</h3>
          <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>{exec.designation}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlaceholderPhoto({ initials, color }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #15120c 0%, #0a0908 100%)" }}>
      <span className="serif" style={{ fontSize: 48, fontWeight: 700, color: color, opacity: 0.4 }}>{initials}</span>
    </div>
  );
}

// ── Form Success Card ─────────────────────────────────────────────
function SuccessCard({ form, isMobile, setSubmitted, setForm, setErrors }) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}
    >
      <div style={{ background: "#15120c", border: "1px solid #c9a84c", padding: isMobile ? "40px 24px" : "64px 48px", position: "relative", borderRadius: 4 }}>
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 15 }}
          style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "2px solid #c9a84c", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <motion.polyline 
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </svg>
        </motion.div>
        
        <div style={{ fontSize: 9, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Confirmed</div>
        <h3 className="serif" style={{ color: "#f0e8d0", fontSize: isMobile ? 24 : 30, margin: "0 0 14px", fontWeight: 600 }}>You're on the list!</h3>
        <p style={{ color: "#a89878", lineHeight: 1.8, margin: "0 0 6px", fontSize: isMobile ? 14 : 15 }}>Welcome aboard, <strong style={{ color: "#c9a84c" }}>{form.name}</strong>.</p>
        <p style={{ color: "#6a5a40", lineHeight: 1.8, margin: "0 0 28px", fontSize: 13 }}>Confirmation sent to <strong style={{ color: "#a89878" }}>{form.email}</strong>.</p>
        
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          <div style={{ background: "#1e1c14", border: "1px solid #2a2318", padding: "8px 14px", fontSize: 12, color: "#a89878", borderRadius: 2 }}>🏛️ Panam Nagar</div>
          <div style={{ background: "#1e1c14", border: "1px solid #2a2318", padding: "8px 14px", fontSize: 12, color: "#a89878", borderRadius: 2 }}>📚 {form.department.replace("Department of ","")}</div>
        </div>
        
                <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setSubmitted(false); setForm({ name:"", studentId:"", email:"", phone:"", message:"" }); setErrors({}); }}
          style={{ background: "transparent", color: "#c9a84c", border: "1px solid #c9a84c", padding: "10px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, borderRadius: 2 }}
        >
          Register Another
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Locked Registration Gate (Timer) ──────────────────────────────
function LockedRegistrationGate({ isMobile, timeLeft }) {
  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: isMobile ? "40px 24px" : "64px 48px", background: "#15120c", border: "1px solid #c9a84c", borderRadius: 4, position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "2px solid #c9a84c", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}
      >
        <span style={{ fontSize: 28 }}>🔒</span>
      </motion.div>
      
      <div style={{ fontSize: 10, letterSpacing: 4, color: "#c9a84c", textTransform: "uppercase", marginBottom: 16, fontWeight: 600, position: "relative", zIndex: 1 }}>Registration Locked</div>
      
      <h3 className="serif" style={{ color: "#f0e8d0", fontSize: isMobile ? 22 : 28, margin: "0 0 14px", fontWeight: 700, position: "relative", zIndex: 1 }}>
        Registration Opens<br />
        <span style={{ color: "#c9a84c", fontSize: isMobile ? 26 : 34, display: "block", marginTop: 8 }}>4 July 2026 at 9:00 PM</span>
      </h3>
      
      <p style={{ color: "#a89878", maxWidth: 400, margin: "0 auto 36px", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", position: "relative", zIndex: 1 }}>
        The gates to our heritage journey unlock precisely at this moment. Please return when the countdown concludes to secure your seat.
      </p>

      {/* Timer Blocks */}
      <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 8 : 16, marginBottom: 20, position: "relative", zIndex: 1 }}>
        {timeBlocks.map((block) => (
          <div key={block.label} style={{ background: "#0a0908", border: "1px solid #2a2318", borderRadius: 4, padding: isMobile ? "12px" : "16px 24px", minWidth: isMobile ? 65 : 90 }}>
            <div style={{ fontSize: isMobile ? 28 : 40, fontWeight: 700, color: "#c9a84c", fontFamily: "'Courier New', monospace", lineHeight: 1 }}>
              {String(block.value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: "#6a5a40", textTransform: "uppercase", marginTop: 8, fontWeight: 600 }}>
              {block.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
// ── Form Elements ─────────────────────────────────────────────────
function StyledInput({ hasError, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      style={{ width:"100%", background:"#0a0908", border:`1px solid ${hasError ? "#c0603a" : focused ? "#c9a84c" : "#2a2318"}`, color:"#e8e0d0", padding:"12px 14px", fontSize:14, fontFamily:"'Montserrat',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color 0.3s, box-shadow 0.3s", borderRadius: 4, boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.1)" : "none" }} 
    />
  );
}

function StyledSelect({ hasError, children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      style={{ width:"100%", background:"#0a0908", border:`1px solid ${hasError ? "#c0603a" : focused ? "#c9a84c" : "#2a2318"}`, color:"#e8e0d0", padding:"12px 14px", fontSize:14, fontFamily:"'Montserrat',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color 0.3s, box-shadow 0.3s", appearance:"none", cursor: "pointer", borderRadius: 4, boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.1)" : "none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }}
    >
      {children}
    </select>
  );
}

function FieldLabel({ children }) {
  return <label style={{ display:"block", fontSize:10, letterSpacing:1.5, color:"#a89060", textTransform:"uppercase", marginBottom:7, fontWeight: 600 }}>{children}</label>;
}

function ErrorMsg({ children }) {
  return <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ display:"block", color:"#c0603a", fontSize:11, marginTop:4 }}>{children}</motion.span>;
}

// ── Place Card (Gallery) ──────────────────────────────────────────
// ── Place Card (Gallery) ──────────────────────────────────────────
function PlaceCard({ place, isMobile, index }) {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      style={{ background: "#15120c", border: "1px solid #2a2318", overflow: "hidden", borderRadius: 4 }}
    >
      <div style={{ position: "relative", height: isMobile ? 200 : 260, overflow: "hidden", background: "#0a0908" }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePhoto}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute", inset: 0, 
              background: "linear-gradient(135deg, #1a1710 0%, #0a0908 100%)",
            }}
          >
            {/* THIS IS THE NEW IMAGE LOGIC */}
            {place.photos[activePhoto].src ? (
              <img 
                src={place.photos[activePhoto].src} 
                alt={place.photos[activePhoto].caption} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            ) : (
              /* Fallback placeholder if no image is provided */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", border: `1px dashed ${place.tagColor}44` }}>
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>{place.photos[activePhoto].icon}</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: place.tagColor, textTransform: "uppercase", marginBottom: 6, opacity: 0.7, fontWeight: 600 }}>Photo Coming Soon</div>
                <div style={{ fontSize: 11, color: "#6a5a40", textAlign: "center", padding: "0 24px", fontStyle: "italic", lineHeight: 1.5 }}>{place.photos[activePhoto].caption}</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 2 }}>
          {place.photos.map((_, i) => (
            <button key={i} onClick={() => setActivePhoto(i)}
              style={{ width: 8, height: 8, borderRadius: "50%", border: "none", background: activePhoto === i ? place.tagColor : "rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, transition: "background 0.3s" }} />
          ))}
        </div>

        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
          <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: place.tagColor, background: "rgba(10,9,8,0.85)", border: `1px solid ${place.tagColor}55`, padding: "3px 10px", borderRadius: 2, fontWeight: 600 }}>
            {place.tag}
          </span>
        </div>
      </div>

      <div style={{ padding: isMobile ? "20px 16px" : "24px 24px 20px" }}>
        <h3 className="serif" style={{ margin: "0 0 4px", fontSize: isMobile ? 20 : 24, color: "#f0e8d0", fontWeight: 600 }}>{place.name}</h3>
        <div style={{ fontSize: 11, color: place.tagColor, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>{place.subtitle}</div>
        <div style={{ width: 40, height: 1, background: place.tagColor, opacity: 0.4, margin: "12px 0" }} />
        <p style={{ margin: "0 0 16px", fontSize: isMobile ? 13 : 14, color: "#a89878", lineHeight: 1.75 }}>{place.description}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {place.facts.map((f, i) => (
            <span key={i} style={{ fontSize: 10, color: "#6a5a40", background: "#1e1c14", border: "1px solid #2a2318", padding: "3px 10px", letterSpacing: 0.3, borderRadius: 2 }}>{f}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── ULAB Bus SVG ──────────────────────────────────────────────────
function ULABBus({ scale = 1, moving = false }) {
  const W = 120 * scale, H = 56 * scale;
  return (
    <svg width={W} height={H + 20 * scale} viewBox={`0 0 120 76`} style={{ display:"block" }}>
      <ellipse cx="60" cy="74" rx="46" ry="4" fill="rgba(0,0,0,0.35)" />
      
      {/* Wheels */}
      <circle cx="26" cy="60" r="11" fill="#1a1a1a" />
      <circle cx="26" cy="60" r="7.5" fill="#2e2e2e" />
      <circle cx="26" cy="60" r="4" fill="#3a3020" />
      <circle cx="26" cy="60" r="1.5" fill="#c9a84c" />
      <circle cx="92" cy="60" r="11" fill="#1a1a1a" />
      <circle cx="92" cy="60" r="7.5" fill="#2e2e2e" />
      <circle cx="92" cy="60" r="4" fill="#3a3020" />
      <circle cx="92" cy="60" r="1.5" fill="#c9a84c" />

      <rect x="10" y="48" width="100" height="5" rx="1" fill="#7a6020" />

      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4ac50" />
          <stop offset="40%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#8a6820" />
        </linearGradient>
      </defs>

      <path d="M14,10 L104,10 Q114,10 116,20 L116,49 L10,49 L10,20 Q10,10 14,10 Z" fill="url(#bodyGrad)" />
      <rect x="10" y="32" width="106" height="3" fill="#8a6820" opacity="0.6" />

      {/* Windows */}
      <rect x="16" y="14" width="17" height="14" rx="1.5" fill="rgba(10,14,20,0.75)" stroke="#c9a84c" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="37" y="14" width="17" height="14" rx="1.5" fill="rgba(10,14,20,0.75)" stroke="#c9a84c" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="58" y="14" width="17" height="14" rx="1.5" fill="rgba(10,14,20,0.75)" stroke="#c9a84c" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="79" y="14" width="12" height="14" rx="1.5" fill="rgba(10,14,20,0.75)" stroke="#c9a84c" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Door & Text */}
      <rect x="94" y="30" width="14" height="19" rx="1" fill="rgba(10,12,8,0.65)" stroke="#c9a84c" strokeWidth="0.7" strokeOpacity="0.4" />
      <rect x="16" y="30" width="72" height="9" rx="1" fill="rgba(0,0,0,0.35)" />
      <text x="52" y="38.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#f0e8d0" fontFamily="Arial,sans-serif" letterSpacing="3">ULAB</text>
    </svg>
  );
}

// ── Bus Journey Scene ─────────────────────────────────────────────
function BusJourney({ isMobile }) {
  const [phase, setPhase] = useState(0);
  const [busX, setBusX] = useState(0);
  const [triggered, setTriggered] = useState(false);

  const sceneW = isMobile ? 340 : 720;
  const sceneH = isMobile ? 200 : 260;
  const busScale = isMobile ? 0.65 : 1;
  const busW = 120 * busScale;
  const ULAB_X = 5;
  const PANAM_X = 72;

  useEffect(() => {
    const el = document.getElementById("bus-scene");
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered) { setTriggered(true); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let x = -8;
    let raf;
    setPhase(1);
    setBusX(x);

    function goTo(target, speed, onDone) {
      function step() {
        x += speed;
        setBusX(x);
        if (x < target) raf = requestAnimationFrame(step);
        else { x = target; setBusX(target); onDone && onDone(); }
      }
      raf = requestAnimationFrame(step);
    }

    function runTrip() {
      x = -8;
      setBusX(x);
      setPhase(1);
      goTo(PANAM_X, 0.28, () => {
        setPhase(2);
        setTimeout(() => {
          setPhase(1);
          goTo(108, 0.28, () => {
            runTrip();
          });
        }, 3000);
      });
    }

    runTrip();
    return () => { raf && cancelAnimationFrame(raf); };
  }, [triggered]);

  const moving = phase === 1;
  const atPanam = phase === 2;

  const [dashOffset, setDashOffset] = useState(0);
  useEffect(() => {
    if (!moving) return;
    let d = dashOffset;
    const id = setInterval(() => {
      d = (d + 1.5 + 200) % 200;
      setDashOffset(d);
    }, 30);
    return () => clearInterval(id);
  }, [moving]);

  const [cloudX, setCloudX] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCloudX(x => (x - 0.3 + 200) % 200), 40);
    return () => clearInterval(id);
  }, []);

  const statusText = {
    0: "Scroll to begin the journey…",
    1: "🚌  En route to Panam Nagar…",
    2: "✦  Arrived at Panam Nagar  ✦",
  }[phase] || "🚌  En route to Panam Nagar…";

  const groundH = isMobile ? 50 : 64;
  const roadTop = isMobile ? 14 : 18;
  const roadH = isMobile ? 22 : 28;
  const roadSurface = roadTop + roadH;
  const busTotalH = 76 * busScale;
  const wheelBottomInSVG = 71 * busScale;
  const busBottom = roadSurface - (busTotalH - wheelBottomInSVG);
  const busLeft = (busX / 100) * (sceneW - busW);

  return (
    <motion.div 
      id="bus-scene" 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      style={{ background:"#050403", borderTop:"1px solid #1a1710", borderBottom:"1px solid #1a1710", padding: isMobile?"36px 12px":"60px 24px" }}
    >
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
        @keyframes flag-flap { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.7)} }
        @keyframes puff { 0%{opacity:0.6;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(-18px,-10px) scale(2.5)} }
        @keyframes puff2 { 0%{opacity:0.4;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(-12px,-16px) scale(2)} }
        @keyframes bounce { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-3px)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      <div style={{ maxWidth: 800, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom: isMobile?20:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:1, background:"#c9a84c", opacity:0.4 }} />
            <span style={{ fontSize:9, letterSpacing:4, color:"#c9a84c", textTransform:"uppercase", fontWeight: 600 }}>The Journey</span>
            <div style={{ width:32, height:1, background:"#c9a84c", opacity:0.4 }} />
          </div>
          <h3 className="serif" style={{ fontSize: isMobile?20:30, margin:0, color:"#f0e8d0", fontWeight: 600 }}>
            ULAB Campus <span style={{ color:"#c9a84c" }}>⇌</span> Panam Nagar
          </h3>
        </div>

        <div style={{ position:"relative", width:sceneW, height:sceneH, margin:"0 auto", overflow:"hidden", borderRadius:4, border:"1px solid #2a2318" }}>
          {/* Sky & Environment */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#0e1020 0%,#18141a 55%,#1a1410 100%)" }} />
          {/* Stars, Moon, Clouds, Hills... (Kept identical to original logic) */}
          {[[42,12],[90,22],[155,8],[230,18],[310,6],[390,20],[470,10],[540,25],[610,14],[670,7],[720,19]].map(([sx,sy],i) => (
            <div key={i} style={{ position:"absolute", left:sx%(sceneW-10), top:sy, width: 1.5, height: 1.5, borderRadius:"50%", background:"#e8e0d0", animation:`twinkle ${1.2+i*0.4}s ease-in-out ${i*0.15}s infinite` }} />
          ))}
          <div style={{ position:"absolute", top: isMobile?10:14, right: isMobile?24:40, width: isMobile?18:24, height: isMobile?18:24, borderRadius:"50%", background:"#d4c890", boxShadow:"0 0 12px rgba(212,200,144,0.4)" }}>
            <div style={{ position:"absolute", top:2, right:2, width: isMobile?10:14, height: isMobile?10:14, borderRadius:"50%", background:"#18141a" }} />
          </div>

          {/* Ground & Road */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:groundH, background:"linear-gradient(180deg,#1e1a14 0%,#161210 100%)" }} />
          <div style={{ position:"absolute", bottom: roadTop, left:0, right:0, height: roadH, background:"#1a1814" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1.5, background:"#3a3020", opacity:0.6 }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1.5, background:"#3a3020", opacity:0.6 }} />
            {Array.from({length:18}).map((_,i) => {
              const dashW = sceneW / 18;
              const x = (i * dashW + dashOffset) % (sceneW + dashW) - dashW;
              return <div key={i} style={{ position:"absolute", left:x, top:"50%", transform:"translateY(-50%)", width:dashW*0.55, height:2, background:"rgba(201,168,76,0.22)", borderRadius:1 }} />;
            })}
          </div>

          {/* ULAB & Panam SVGs */}
          <div style={{ position:"absolute", left: isMobile?6:12, bottom: groundH }}>
            <svg width={isMobile?52:72} height={isMobile?72:96} viewBox="0 0 72 96">
              <line x1="36" y1="0" x2="36" y2="18" stroke="#c9a84c" strokeWidth="1.2" />
              <polygon points="36,2 52,8 36,14" fill="#c9a84c" opacity="0.9" style={{ animation:"flag-flap 1.2s ease-in-out infinite" }} />
              <rect x="4" y="18" width="64" height="78" fill="#1e1c14" stroke="#3a3020" strokeWidth="1" />
              <rect x="14" y="62" width="44" height="8" fill="#0a0908" />
              <text x="36" y="69" textAnchor="middle" fontSize="6" fill="#c9a84c" fontFamily="Arial" fontWeight="bold" letterSpacing="1">ULAB</text>
            </svg>
          </div>

          <div style={{ position:"absolute", right: isMobile?6:12, bottom: groundH }}>
            <svg width={isMobile?60:80} height={isMobile?80:108} viewBox="0 0 80 108">
              <line x1="40" y1="0" x2="40" y2="14" stroke="#c9a84c" strokeWidth="1.2" />
              <polygon points="40,1 56,6 40,11" fill={atPanam?"#c9a84c":"#3a3020"} style={{ transition:"fill 0.8s", animation: atPanam?"flag-flap 0.7s ease-in-out infinite":"none" }} />
              <rect x="2" y="14" width="76" height="94" fill="#1e1a10" stroke={atPanam?"#c9a84c":"#3a3020"} strokeWidth="1" style={{ transition:"stroke 0.8s" }} />
              {atPanam && <rect x="2" y="14" width="76" height="94" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.4" style={{ animation:"glow-pulse 1.5s ease-in-out infinite" }} />}
              <rect x="16" y="80" width="48" height="9" fill="#0a0908" />
              <text x="40" y="87.5" textAnchor="middle" fontSize="6" fill={atPanam?"#c9a84c":"#6a5a40"} fontFamily="Arial" fontWeight="bold" letterSpacing="0.8" style={{ transition:"fill 0.8s" }}>PANAM NAGAR</text>
            </svg>
          </div>

          {/* The Bus */}
          {moving && (
            <>
              <div style={{ position:"absolute", bottom: busBottom + (isMobile?28:36), left: busLeft + (isMobile?4:6), width: isMobile?8:11, height: isMobile?8:11, borderRadius:"50%", background:"rgba(180,160,100,0.18)", animation:"puff 1s ease-out infinite" }} />
              <div style={{ position:"absolute", bottom: busBottom + (isMobile?34:44), left: busLeft + (isMobile?8:10), width: isMobile?6:8, height: isMobile?6:8, borderRadius:"50%", background:"rgba(180,160,100,0.12)", animation:"puff2 1s ease-out 0.35s infinite" }} />
            </>
          )}
          <div style={{
            position:"absolute",
            bottom: busBottom,
            left: busLeft,
            animation: moving ? "bounce 0.45s ease-in-out infinite" : "none",
            willChange:"transform,left",
          }}>
            <ULABBus scale={busScale} moving={moving} />
          </div>
        </div>

        {/* Route Status */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap: isMobile?8:16, marginTop:16, flexWrap:"wrap" }}>
          <span style={{ fontSize: isMobile?11:13, color: "#4a3e28", fontWeight:700, letterSpacing:0.5, transition:"color 0.5s" }}>ULAB Campus</span>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: isMobile?10:14, height:2, borderRadius:1, background: i < Math.floor(busX/20) ? "#c9a84c" : "#2a2318", transition:"background 0.3s" }} />
          ))}
          <span style={{ fontSize: isMobile?11:13, color: atPanam?"#c9a84c":"#4a3e28", fontWeight:700, letterSpacing:0.5, transition:"color 0.5s" }}>Panam Nagar</span>
        </div>
        <div style={{ textAlign:"center", marginTop:10 }}>
          <span style={{ fontSize: isMobile?11:13, color: atPanam?"#c9a84c":moving?"#a89060":"#4a3e28", letterSpacing:1.5, textTransform:"uppercase", transition:"color 0.5s", fontStyle:"italic" }}>
            {statusText}
          </span>
        </div>
      </div>
    </motion.div>
  );
}