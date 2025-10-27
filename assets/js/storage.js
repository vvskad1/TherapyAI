/**
 * Storage utility module for Therapy AI Demo
 * Handles localStorage operations and provides seed data
 */

// Storage keys
const STORAGE_KEYS = {
    USERS: 'therapy_ai_users',
    THERAPISTS: 'therapy_ai_therapists',
    CHILDREN: 'therapy_ai_children',
    CURRENT_USER: 'therapy_ai_current_user',
    CHAT_PREFIX: 'therapy_ai_chats:'
};

// Utility functions
export function genId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function nowISO() {
    return new Date().toISOString();
}

export function calcAgeYears(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// User management
export function getUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

export function setUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Therapist management
export function getTherapists() {
    const therapists = localStorage.getItem(STORAGE_KEYS.THERAPISTS);
    return therapists ? JSON.parse(therapists) : [];
}

export function setTherapists(therapists) {
    localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(therapists));
}

export function addTherapist(therapist) {
    const therapists = getTherapists();
    therapist.id = genId();
    therapist.createdAt = nowISO();
    therapists.push(therapist);
    setTherapists(therapists);
    return therapist;
}

export function updateTherapist(id, updates) {
    const therapists = getTherapists();
    const index = therapists.findIndex(t => t.id === id);
    if (index !== -1) {
        therapists[index] = { ...therapists[index], ...updates };
        setTherapists(therapists);
        return therapists[index];
    }
    return null;
}

export function deleteTherapist(id) {
    const therapists = getTherapists();
    const filtered = therapists.filter(t => t.id !== id);
    setTherapists(filtered);
}

// Children management
export function getChildren() {
    const children = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    return children ? JSON.parse(children) : [];
}

export function setChildren(children) {
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
}

export function addChild(child) {
    const children = getChildren();
    child.id = genId();
    child.ageYears = calcAgeYears(child.dob);
    child.updatedAt = nowISO();
    children.push(child);
    setChildren(children);
    return child;
}

export function updateChild(id, updates) {
    const children = getChildren();
    const index = children.findIndex(c => c.id === id);
    if (index !== -1) {
        if (updates.dob) {
            updates.ageYears = calcAgeYears(updates.dob);
        }
        updates.updatedAt = nowISO();
        children[index] = { ...children[index], ...updates };
        setChildren(children);
        return children[index];
    }
    return null;
}

export function deleteChild(id) {
    const children = getChildren();
    const filtered = children.filter(c => c.id !== id);
    setChildren(filtered);
    
    // Also delete chat history
    localStorage.removeItem(STORAGE_KEYS.CHAT_PREFIX + id);
}

export function getChildById(id) {
    const children = getChildren();
    return children.find(c => c.id === id) || null;
}

export function getChildrenByTherapist(therapistId) {
    const children = getChildren();
    return children.filter(c => c.therapistId === therapistId);
}

// Chat management
export function getChats(childId) {
    const chats = localStorage.getItem(STORAGE_KEYS.CHAT_PREFIX + childId);
    return chats ? JSON.parse(chats) : [];
}

export function saveChats(childId, chats) {
    localStorage.setItem(STORAGE_KEYS.CHAT_PREFIX + childId, JSON.stringify(chats));
}

export function addChatMessage(childId, from, text) {
    const chats = getChats(childId);
    const message = {
        id: genId(),
        from: from, // 'therapist' or 'ai'
        text: text,
        ts: nowISO()
    };
    chats.push(message);
    saveChats(childId, chats);
    return message;
}

// Seed data function
export function seedIfEmpty() {
    const users = getUsers();
    if (users.length === 0) {
        console.log('Seeding initial data...');
        
        // Create seed users
        const adminUser = {
            id: genId(),
            role: 'admin',
            name: 'Dr. Amanda Richardson',
            email: 'admin@demo.com',
            password: 'admin123',
            createdAt: nowISO()
        };
        
        const therapistUser1 = {
            id: genId(),
            role: 'therapist',
            name: 'Sarah Lewis',
            email: 'therapist@demo.com',
            password: 'therapist123',
            createdAt: nowISO()
        };

        const therapistUser2 = {
            id: genId(),
            role: 'therapist',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@demo.com',
            password: 'therapist456',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
        };

        const therapistUser3 = {
            id: genId(),
            role: 'therapist',
            name: 'Jessica Martinez',
            email: 'jessica.martinez@demo.com',
            password: 'therapist789',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
        };
        
        setUsers([adminUser, therapistUser1, therapistUser2, therapistUser3]);
        
        // Create corresponding therapist records
        const therapistRecord1 = {
            id: therapistUser1.id,
            name: therapistUser1.name,
            email: therapistUser1.email,
            createdAt: therapistUser1.createdAt
        };

        const therapistRecord2 = {
            id: therapistUser2.id,
            name: therapistUser2.name,
            email: therapistUser2.email,
            createdAt: therapistUser2.createdAt
        };

        const therapistRecord3 = {
            id: therapistUser3.id,
            name: therapistUser3.name,
            email: therapistUser3.email,
            createdAt: therapistUser3.createdAt
        };
        
        setTherapists([therapistRecord1, therapistRecord2, therapistRecord3]);
        
        // Create comprehensive sample children for Sarah Lewis
        const child1 = {
            id: genId(),
            therapistId: therapistUser1.id,
            name: 'Emma Johnson',
            dob: '2018-03-15',
            ageYears: calcAgeYears('2018-03-15'),
            category: 'Communication',
            concern: 'Speech delay and articulation difficulties with /r/ and /s/ sounds',
            guardian: 'Jennifer Johnson (mother), Phone: (555) 123-4567',
            notes: 'Emma is a bright and curious child who enjoys books, puzzles, and art activities. She has difficulty with /r/ and /s/ sounds but shows good motivation during therapy. Responds well to visual cues and games. Family is very supportive and practices at home.',
            milestones: [
                "Produce /r/ sound in isolation with 80% accuracy",
                "Use /r/ in initial position words (red, run, rabbit) with visual cues",
                "Maintain eye contact during structured speaking tasks",
                "Follow 2-step directions consistently in therapy setting"
            ],
            strategies: [
                "Use mirror work for visual feedback during /r/ production",
                "Incorporate favorite books for /r/ sound practice",
                "Practice with high-frequency /r/ words in play contexts",
                "Use hand cues to prompt tongue positioning for /r/ sound"
            ],
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const child2 = {
            id: genId(),
            therapistId: therapistUser1.id,
            name: 'Aiden Chen',
            dob: '2019-07-22',
            ageYears: calcAgeYears('2019-07-22'),
            category: 'Social',
            concern: 'Language development delays, limited expressive vocabulary, difficulty with social communication',
            guardian: 'David Chen (father) and Lisa Chen (mother), Phone: (555) 987-6543',
            notes: 'Aiden is making steady progress with expressive language. He enjoys sensory play and responds well to routine-based activities. Shows emerging joint attention skills. Parents report increased communication attempts at home.',
            milestones: [
                "Expand expressive vocabulary to 50+ functional words",
                "Use 2-word combinations spontaneously (more cookie, want toy)",
                "Maintain joint attention for 5+ minutes during preferred activities",
                "Initiate communication for requesting and commenting"
            ],
            strategies: [
                "Use routine-based language intervention during snack time",
                "Model 2-word phrases and wait for imitation",
                "Incorporate sensory play to increase engagement",
                "Practice turn-taking with cause-effect toys"
            ],
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        };

        const child3 = {
            id: genId(),
            therapistId: therapistUser1.id,
            name: 'Sophia Rodriguez',
            dob: '2020-11-08',
            ageYears: calcAgeYears('2020-11-08'),
            category: 'Fine Motor',
            concern: 'Childhood apraxia of speech, oral motor difficulties',
            guardian: 'Maria Rodriguez (mother), Carlos Rodriguez (father), Phone: (555) 456-7890',
            notes: 'Sophia presents with suspected childhood apraxia of speech. She has difficulty with motor planning for speech sounds. Very engaged and motivated child who loves music and movement activities. Family is bilingual (Spanish/English).',
            milestones: [
                "Produce CV syllables (ma, ba, pa) with consistent voicing",
                "Imitate simple oral motor movements (lip rounding, tongue protrusion)",
                "Use gestures and signs to communicate basic needs",
                "Vocalize during preferred activities and social interactions"
            ],
            strategies: [
                "Use PROMPT techniques for oral motor facilitation",
                "Incorporate music and rhythm for speech timing",
                "Practice oral motor exercises before speech attempts",
                "Use multimodal communication (speech + gesture + sign)"
            ],
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Create children for Dr. Michael Chen
        const child4 = {
            id: genId(),
            therapistId: therapistUser2.id,
            name: 'Lucas Thompson',
            dob: '2017-09-12',
            ageYears: calcAgeYears('2017-09-12'),
            category: 'Communication',
            concern: 'Stuttering and fluency disorders, secondary behaviors developing',
            guardian: 'Rebecca Thompson (mother), James Thompson (father), Phone: (555) 234-5678',
            notes: 'Lucas began showing disfluencies around age 4. He exhibits repetitions and prolongations, with some awareness developing. Very articulate when fluent. Enjoys sports and building activities.',
            milestones: [
                "Reduce secondary behaviors (eye blinking, head movements)",
                "Use easy onset techniques in structured conversations",
                "Increase awareness of speech rate and breathing",
                "Maintain fluency in 5-minute conversations"
            ],
            strategies: [
                "Practice slow, easy speech with family activities",
                "Use breathing exercises before speaking tasks",
                "Implement pausing strategies in conversation",
                "Build confidence through successful speaking experiences"
            ],
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        };

        const child5 = {
            id: genId(),
            therapistId: therapistUser2.id,
            name: 'Olivia Park',
            dob: '2019-01-30',
            ageYears: calcAgeYears('2019-01-30'),
            category: 'Communication',
            concern: 'Phonological processes, multiple sound errors affecting intelligibility',
            guardian: 'Susan Park (mother), Phone: (555) 345-6789',
            notes: 'Olivia presents with several phonological processes including fronting, stopping, and cluster reduction. She is highly motivated and enjoys interactive games. Single mother very involved in therapy goals.',
            milestones: [
                "Eliminate fronting pattern (say /k/ and /g/ correctly)",
                "Reduce stopping of fricatives (/f/, /s/, /sh/ sounds)",
                "Improve overall speech intelligibility to 80% with unfamiliar listeners",
                "Use target sounds in connected speech"
            ],
            strategies: [
                "Use minimal pairs therapy for sound contrasts",
                "Practice target sounds in games and play",
                "Provide auditory bombardment of target sounds",
                "Use tactile cues for sound placement"
            ],
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Create children for Jessica Martinez
        const child6 = {
            id: genId(),
            therapistId: therapistUser3.id,
            name: 'Ethan Williams',
            dob: '2018-06-18',
            ageYears: calcAgeYears('2018-06-18'),
            category: 'Gross Motor',
            concern: 'Language comprehension delays, difficulty following multi-step directions',
            guardian: 'Michelle Williams (mother), Robert Williams (father), Phone: (555) 567-8901',
            notes: 'Ethan has strong social skills but struggles with language comprehension. He benefits from visual supports and structured routines. Family reports similar challenges at home with following directions.',
            milestones: [
                "Follow 3-step directions with visual supports",
                "Understand spatial concepts (in, on, under, beside)",
                "Respond to wh-questions (who, what, where) appropriately",
                "Demonstrate understanding of time concepts (first, then, last)"
            ],
            strategies: [
                "Use visual schedules and picture supports",
                "Break down directions into smaller steps",
                "Practice comprehension through interactive books",
                "Use repetition and rephrasing for clarity"
            ],
            updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        };

        const child7 = {
            id: genId(),
            therapistId: therapistUser3.id,
            name: 'Mia Davis',
            dob: '2020-04-25',
            ageYears: calcAgeYears('2020-04-25'),
            category: 'Social',
            concern: 'Late talker, limited vocabulary, minimal phrase production',
            guardian: 'Amanda Davis (mother), Phone: (555) 678-9012',
            notes: 'Mia is a late talker with a vocabulary of approximately 25 words. She uses gestures effectively and has good non-verbal communication skills. Mother is very engaged and implements home strategies consistently.',
            milestones: [
                "Expand vocabulary to 100+ words across categories",
                "Use 2-3 word phrases for requesting and commenting",
                "Imitate new words during structured play",
                "Use words spontaneously in daily routines"
            ],
            strategies: [
                "Model target vocabulary during play routines",
                "Use environmental arrangement to encourage communication",
                "Practice new words through repetitive play activities",
                "Implement mand training for requesting"
            ],
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        setChildren([child1, child2, child3, child4, child5, child6, child7]);
        
        // Create extensive chat histories for Emma Johnson
        const emmaChats = [
            {
                id: genId(),
                from: 'therapist',
                text: 'How can I help Emma with her /r/ sound production? She seems to be struggling with tongue placement.',
                ts: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'For /r/ sound production, try these evidence-based strategies: 1) Use the "scoop" cue - tell Emma to make her tongue into a scoop, 2) Practice with high-frequency /r/ words like "red", "run", "car", 3) Use tactile feedback by having her feel throat vibration, 4) Try the "growling dog" analogy for the retroflex /r/. Start with isolated sounds before moving to syllables.',
                ts: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'Emma loves books and puzzles. How can I incorporate these interests into /r/ practice?',
                ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Perfect! Since Emma enjoys books and puzzles, try: 1) "I Spy" games with /r/ words in picture books, 2) Create puzzle pieces with /r/ words written on them, 3) Read stories emphasizing /r/ sounds with dramatic voice, 4) Art activities naming /r/ colors (red, orange, purple), 5) Treasure hunts for /r/ objects. This maintains engagement while targeting speech goals.',
                ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 120000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'What home practice activities should I suggest to Emma\'s mom?',
                ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'For home practice, suggest these family-friendly activities: 1) "R words at dinner" - find /r/ foods (rice, carrots, berries), 2) Car ride games - spot /r/ words on signs, 3) Bedtime stories with /r/ emphasis, 4) Kitchen helper - stir, pour, prepare while saying /r/ words, 5) Mirror practice 5 minutes daily. Keep it fun and pressure-free!',
                ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 180000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'Emma is making progress with /r/ in isolation but struggling in words. How do I bridge this gap?',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'This is a common challenge! Try these bridging techniques: 1) Use carrier phrases "I see a ___" with /r/ words, 2) Practice /r/ + vowel combinations (ra, re, ri, ro, ru), 3) Use backward chaining - start with word endings she can do, 4) Slow motion speech - elongate the /r/ in words, 5) Visual cues - hand gestures for tongue position. Be patient, this transition takes time!',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 300000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'Should I work on /s/ sounds with Emma too, or focus just on /r/?',
                ts: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Great question! I recommend focusing primarily on /r/ since it\'s typically more challenging and she\'s showing progress. However, you can do some /s/ work: 1) Use minimal pairs (wace/race), 2) Do /s/ warm-ups before /r/ practice, 3) If Emma masters /r/ quickly, then increase /s/ focus. The key is not overwhelming her with too many targets simultaneously.',
                ts: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 240000).toISOString()
            }
        ];

        // Create chat history for Aiden Chen
        const aidenChats = [
            {
                id: genId(),
                from: 'therapist',
                text: 'Aiden is struggling with turn-taking during play activities. Any evidence-based strategies?',
                ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'For turn-taking with Aiden, try these research-backed strategies: 1) Visual turn-taking cards or timers, 2) Start with highly motivating activities (cause-effect toys), 3) Use songs with natural pauses for turns, 4) Model "my turn, your turn" language consistently, 5) Begin with very short turns (2-3 seconds) and gradually increase. The key is starting with his interests!',
                ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 90000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'How can I work on joint attention skills during our sessions?',
                ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Joint attention is crucial for Aiden\'s development! Try: 1) Follow his gaze and comment on what he\'s looking at, 2) Use animated expressions and voices with toys, 3) Create "wow" moments with cause-effect toys, 4) Point to and label objects together, 5) Use books with flaps and interactive elements, 6) Play games that require shared focus (bubbles, peek-a-boo). Start where his attention naturally goes!',
                ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 150000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'Aiden\'s parents want to know how to encourage more communication attempts at home.',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Excellent parent involvement! Suggest these naturalistic strategies: 1) Environmental arrangement - put favorite items in sight but out of reach, 2) Pause and wait during routines (dressing, eating), 3) Offer choices throughout the day, 4) Imitate his sounds and gestures, 5) Narrate daily activities, 6) Use expectant waiting with raised eyebrows. The goal is creating natural communication opportunities!',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 200000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'What are some good activities for expanding Aiden\'s vocabulary during snack time?',
                ts: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Snack time is perfect for language learning! Try: 1) Offer choices "apple or crackers?", 2) Practice action words (pour, dip, bite, chew), 3) Describe properties (hot, cold, crunchy, sweet), 4) Count items, 5) Use core words (more, all done, want), 6) Create routines with consistent language, 7) Make it social - talk about who, what, where. Keep it natural and fun!',
                ts: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 180000).toISOString()
            }
        ];

        // Create chat history for Sophia Rodriguez
        const sophiaChats = [
            {
                id: genId(),
                from: 'therapist',
                text: 'Sophia may have childhood apraxia of speech. What are the key assessment indicators I should document?',
                ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Key CAS indicators to document: 1) Inconsistent errors on repeated productions, 2) Difficulty with voluntary vs automatic speech, 3) Groping behaviors or silent posturing, 4) Prosodic disturbances (stress, rhythm), 5) Limited phonetic inventory, 6) Slow DDK rates, 7) Better performance with shorter utterances. Use ASHA\'s CAS technical report for comprehensive assessment guidelines.',
                ts: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 120000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'What treatment approaches work best for suspected CAS in preschoolers?',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'For preschool CAS, consider: 1) PROMPT - provides tactile-kinesthetic cues, 2) Integral Stimulation - "watch me, listen to me, do what I do", 3) ReST (Rapid Syllable Transitions), 4) Dynamic Temporal and Tactile Cueing, 5) Multimodal communication (speech + gesture + AAC), 6) High practice frequency with shorter, frequent sessions. Focus on functional, meaningful words first!',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 240000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'How do I incorporate Sophia\'s love of music into therapy sessions?',
                ts: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Music is fantastic for CAS! Try: 1) Rhythmic speech - practice syllables to steady beats, 2) Melodic intonation therapy principles, 3) Songs with repetitive lyrics, 4) Clapping while speaking, 5) Use familiar tunes with target words, 6) Instruments for timing and rhythm, 7) Movement + speech combinations. Music provides external timing cues that can facilitate motor planning!',
                ts: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 160000).toISOString()
            }
        ];

        // Create chat history for Lucas Thompson (Dr. Chen's client)
        const lucasChats = [
            {
                id: genId(),
                from: 'therapist',
                text: 'Lucas is developing secondary behaviors with his stuttering. How do I address these sensitively?',
                ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'Secondary behaviors indicate increased awareness and tension. Address by: 1) Acknowledge without drawing excess attention, 2) Focus on easy, relaxed speech, 3) Teach coping strategies (slow speech, breathing), 4) Build confidence through successful experiences, 5) Educate parents about not correcting or rushing, 6) Consider counseling component. The goal is reducing struggle and tension, not just fluency.',
                ts: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 180000).toISOString()
            },
            {
                id: genId(),
                from: 'therapist',
                text: 'What fluency techniques work best for school-age children like Lucas?',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: genId(),
                from: 'ai',
                text: 'For school-age stuttering, try: 1) Easy onset - gentle start to speech, 2) Light articulatory contacts, 3) Continuous airflow techniques, 4) Slower rate with natural pauses, 5) Self-monitoring strategies, 6) Voluntary stuttering to reduce fear, 7) Cognitive strategies for confidence building. Focus on techniques he can use independently in real situations.',
                ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 220000).toISOString()
            }
        ];

        // Save all chat histories
        saveChats(child1.id, emmaChats);      // Emma Johnson
        saveChats(child2.id, aidenChats);     // Aiden Chen
        saveChats(child3.id, sophiaChats);    // Sophia Rodriguez
        saveChats(child4.id, lucasChats);     // Lucas Thompson
        
        console.log('Seed data created successfully');
    }
}

// Initialize immediately when module loads
seedIfEmpty();