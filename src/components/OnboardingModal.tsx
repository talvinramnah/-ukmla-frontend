'use client';

import React, { useState } from "react";

const MED_SCHOOLS = [
    "University of Aberdeen School of Medicine and Dentistry",
    "Anglia Ruskin University School of Medicine",
    "Aston University Medical School",
    "Queen Mary University of London",
    "University of Birmingham College of Medical and Dental Sciences",
    "Brighton and Sussex Medical School",
    "University of Bristol Medical School",
    "University of Buckingham Medical School",
    "University of Cambridge School of Clinical Medicine",
    "Cardiff University School of Medicine",
    "University of Dundee School of Medicine",
    "Edge Hill University Medical School",
    "The University of Edinburgh Medical School",
    "University of Exeter Medical School",
    "University of Glasgow School of Medicine",
    "Hull York Medical School",
    "Imperial College London Faculty of Medicine",
    "Keele University School of Medicine",
    "Kent and Medway Medical School",
    "King's College London GKT School of Medical Education",
    "Lancaster University Medical School",
    "University of Leeds School of Medicine",
    "University of Leicester Medical School",
    "University of Liverpool School of Medicine",
    "London School of Hygiene & Tropical Medicine",
    "University of Manchester Medical School",
    "Newcastle University School of Medical Education",
    "University of East Anglia, Norwich Medical School",
    "University of Nottingham School of Medicine",
    "University of Nottingham - Lincoln Medical School",
    "University of Oxford Medical Sciences Division",
    "Plymouth University Peninsula Schools of Medicine and Dentistry",
    "Queen's University Belfast School of Medicine",
    "University of Sheffield Medical School",
    "University of Southampton School of Medicine",
    "University of St Andrews School of Medicine",
    "St George's, University of London",
    "University of Sunderland School of Medicine",
    "Swansea University Medical School",
    "University of Central Lancashire School of Medicine",
    "University of Warwick Medical School",
    "Brunel University London, Brunel Medical School",
    "Ulster University, School of Medicine",
    "University of Chester Medical School",
    "Three Counties Medical School",
    "University College London",
    "North Wales Medical School, Bangor University",
    "Pears Cumbria School of Medicine",
];

const YEARS = [
    "1st year",
    "2nd year",
    "3rd year",
    "4th year",
    "5th year",
];

const SPECIALTIES = [
    "Acute internal medicine",
    "Allergy",
    "Anaesthetics",
    "Audio vestibular medicine", 
    "Aviation and space medicine",
    "Cardio-thoracic surgery",
    "Cardiology",
    "Chemical pathology",
    "Child and adolescent psychiatry",
    "Clinical genetics",
    "Clinical neurophysiology",
    "Clinical oncology",
    "Clinical pharmacology and therapeutics",
    "Clinical radiology",
    "Community sexual and reproductive health",
    "Dermatology",
    "Diagnostic neuropathology",
    "Emergency medicine",
    "Endocrinology and diabetes mellitus",
    "Forensic histopathology",
    "Forensic psychiatry",
    "Gastro-enterology",
    "General (internal) medicine",
    "General practice",
    "General psychiatry",
    "General surgery",
    "Genito-urinary medicine",
    "Geriatric medicine",
    "Haematology",
    "Histopathology",
    "Immunology",
    "Infectious diseases",
    "Intensive care medicine",
    "Medical microbiology",
    "Medical oncology",
    "Medical ophthalmology",
    "Medical psychotherapy",
    "Medical virology",
    "Neurology",
    "Neurosurgery",
    "Nuclear medicine",
    "Obstetrics and gynaecology",
    "Occupational medicine",
    "Old age psychiatry",
    "Ophthalmology",
    "Oral and maxillo-facial surgery",
    "Otolaryngology",
    "Paediatric and perinatal pathology ",
    "Paediatric cardiology",
    "Paediatric surgery",
    "Paediatrics",
    "Palliative medicine",
    "Pharmaceutical medicine",
    "Plastic surgery",
    "Psychiatry of learning disability",
    "Public health medicine",
    "Rehabilitation medicine",
    "Renal medicine",
    "Respiratory medicine",
    "Rheumatology",
    "Sport and exercise medicine",
    "Trauma and orthopaedic surgery ",
    "Tropical medicine",
    "Urology",
    "Vascular surgery"
];

type OnboardingModalProps = {
  accessToken: string;
  onComplete: () => void;
};

export default function OnboardingModal({ accessToken, onComplete }: OnboardingModalProps) {
    const [name, setName] = useState("");
    const [medSchool, setMedSchool] = useState("");
    const [year, setYear] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [message, setMessage] = useState("");

    const API_URL = "https://ukmla-case-tutor-api.onrender.com";

    const handleSubmit = async () => {
        if (!name || !medSchool || !year || !specialty) {
            setMessage("⚠️ Please complete all fields.");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/onboarding`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name,
                    med_school: medSchool,
                    year_group: year,
                    desired_specialty: specialty,
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to submit.");
            setMessage(`✅ Welcome, ${data.anon_username}!`);
            setTimeout(() => {
                onComplete?.();
            }, 1200);
        } catch (err: any) {
            setMessage(`❌ ${err.message}`);
        }
    };

    const styles = {
        overlay: {
            position: "fixed" as const,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(24, 1, 97, 0.95)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Press Start 2P', monospace",
        },
        modal: {
            background: "var(--color-card)",
            borderRadius: "16px",
            padding: "32px 40px",
            boxShadow: "0 0 24px var(--color-accent)",
            color: "var(--color-text)",
            fontFamily: "'Press Start 2P', monospace",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center" as const,
        },
        title: {
            color: "var(--color-title)",
            fontSize: "16px",
            fontFamily: "'Press Start 2P', monospace",
            marginBottom: "16px",
        },
        input: {
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "none",
            marginBottom: "16px",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "12px",
            background: "var(--color-bg)",
            color: "var(--color-text)",
        },
        button: {
            background: "var(--color-accent)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "12px",
            cursor: "pointer",
            marginTop: "8px",
        },
        error: {
            color: "var(--color-feedback)",
            fontSize: "10px",
            marginTop: "8px",
            fontFamily: "'Press Start 2P', monospace",
        },
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.title}>🧑‍⚕️ ABOUT YOU</div>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select
                    style={styles.input}
                    value={medSchool}
                    onChange={(e) => setMedSchool(e.target.value)}
                >
                    <option value="">Select Medical School</option>
                    {MED_SCHOOLS.map((school, idx) => (
                        <option key={idx} value={school}>
                            {school}
                        </option>
                    ))}
                </select>
                <select
                    style={styles.input}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">Select Year Group</option>
                    {YEARS.map((y, idx) => (
                        <option key={idx} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
                <select
                    style={styles.input}
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                >
                    <option value="">Select desired specialty</option>
                    {SPECIALTIES.map((spec, idx) => (
                        <option key={idx} value={spec}>
                            {spec}
                        </option>
                    ))}
                </select>
                <button style={styles.button} onClick={handleSubmit}>
                    Submit
                </button>
                {message && <p style={styles.error}>{message}</p>}
            </div>
        </div>
    );
} 