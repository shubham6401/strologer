const User = require('../models/User');
const ExecutiveProfile = require('../models/ExecutiveProfile');

// Configurable Astrology Services catalog
const ASTROLOGY_SERVICES = [
  {
    id: 'kundli-analysis',
    title: 'Kundli & Janam Patrika Analysis',
    shortDescription: 'In-depth analysis of your birth chart, planetary alignments, doshas, and Mahadasha periods.',
    fullDescription: 'Comprehensive examination of the 12 houses, ascendant lord, planetary conjunctions, and dasha cycles in your Vedic birth chart. Uncover root causes behind life challenges and obtain accurate astrological remedies.',
    icon: 'Compass',
    recommendedDuration: 30,
    benefits: [
      'Comprehensive Janam Kundli decoding',
      'Mahadasha and Antardasha timeline analysis',
      'Identification of Kaal Sarp, Manglik or Pitra Dosha',
      'Customized Vedic remedies and mantra recommendations',
    ],
  },
  {
    id: 'career-business',
    title: 'Career, Job & Business Guidance',
    shortDescription: 'Strategic planetary direction for career switches, promotions, business ventures, and financial growth.',
    fullDescription: 'Evaluation of the 10th house (Karma Bhava), 2nd house (Dhana Bhava), and 11th house (Labha Bhava) to determine the most auspicious career paths, timing for job transitions, and business partnerships.',
    icon: 'Briefcase',
    recommendedDuration: 30,
    benefits: [
      'Optimal timing for job change or promotion',
      'Evaluation of partnership suitability and risk',
      'Govt job vs private sector planetary suitability',
      'Financial abundance and stability guidance',
    ],
  },
  {
    id: 'marriage-relationship',
    title: 'Marriage & Relationship Consultation',
    shortDescription: 'Insightful relationship analysis, marriage timing, compatibility solutions, and harmony remedies.',
    fullDescription: 'Detailed assessment of the 7th house, Venus, Jupiter, and Navamsha (D9) chart to understand marital delays, partner characteristics, domestic harmony, and relationship dynamics.',
    icon: 'Heart',
    recommendedDuration: 45,
    benefits: [
      'Accurate timing of marriage/engagement',
      'Partner traits and marital stability reading',
      'Resolution of ongoing marital discord',
      'Navamsha (D9) chart deep inspection',
    ],
  },
  {
    id: 'kundli-matching',
    title: 'Kundli Milan (Matchmaking)',
    shortDescription: 'Traditional 36 Guna Milan with thorough Manglik Dosha and Bhakoot/Nadi Dosha scrutiny.',
    fullDescription: 'Beyond superficial Ashtakoot point matching: rigorous examination of mutual planetary harmony, emotional affinity, health longevity, progeny prospects, and mental compatibility.',
    icon: 'Users',
    recommendedDuration: 30,
    benefits: [
      '36 Gunas Ashtakoot calculation',
      'In-depth Nadi, Bhakoot, and Gana Dosha checks',
      'Mutual Mangal (Mars) placement analysis',
      'Practical Vedic remedies for dosha pacification',
    ],
  },
  {
    id: 'horoscope-transit',
    title: 'Yearly Horoscope & Gochar (Transit) Analysis',
    shortDescription: 'Detailed annual astrological forecast based on major planetary transits of Saturn, Jupiter, Rahu & Ketu.',
    fullDescription: 'Understand how major planetary movements (such as Shani Sade Sati, Guru Gochar, and Rahu-Ketu axis shifts) influence your personal and professional sphere over the coming 12 months.',
    icon: 'Calendar',
    recommendedDuration: 30,
    benefits: [
      '12-month month-by-month life forecast',
      'Sade Sati, Dhaiya, and Guru Gochar impacts',
      'Auspicious periods for major investments/travel',
      'Preventative remedial measures for challenging transits',
    ],
  },
  {
    id: 'vastu-consultation',
    title: 'Vastu Shastra Consultation',
    shortDescription: 'Harmonize living and workspace energies in alignment with the five cosmic elements (Pancha Bhoota).',
    fullDescription: 'Scientific Vedic Vastu advice for residences, commercial spaces, and industrial setups without destructive demolition, optimizing the flow of Prana and directional harmony.',
    icon: 'Home',
    recommendedDuration: 45,
    benefits: [
      'Directional energy audit of residential/commercial plots',
      'Non-demolition elemental balancing techniques',
      'Proper placement of main door, kitchen, master bedroom',
      'Enhancement of prosperity and peaceful vibrations',
    ],
  },
  {
    id: 'numerology-guidance',
    title: 'Vedic Numerology & Name Correction',
    shortDescription: 'Harness the cosmic vibrations of numbers for name harmony, auspicious dates, and personal destiny.',
    fullDescription: 'Detailed analysis of your Radical (Mulank), Destiny (Bhagyank), and Name numbers to eliminate conflicting vibrational frequencies and align your identity with success.',
    icon: 'Binary',
    recommendedDuration: 20,
    benefits: [
      'Birth number and life path vibration analysis',
      'Scientific name spelling optimization',
      'Identification of lucky numbers, days, and colors',
      'Auspicious company / brand naming guidance',
    ],
  },
  {
    id: 'gemstone-remedies',
    title: 'Gemstone & Vedic Remedies Guidance',
    shortDescription: 'Authentic astrological recommendations for natural gemstones, rudraksha, and yantras.',
    fullDescription: 'Precise recommendation of beneficial gemstones according to Yogakaraka and favorable planets, ensuring you never wear an antagonistic stone that could cause harm.',
    icon: 'Sparkles',
    recommendedDuration: 20,
    benefits: [
      'Identification of Yogakaraka gemstone',
      'Correct metal, finger, and day for energization',
      'Avoidance of hazardous conflicting gemstones',
      'Rudraksha and sacred yantra recommendations',
    ],
  },
  {
    id: 'personal-consultation',
    title: 'Comprehensive Personal Consultation',
    shortDescription: 'One-on-one confidential consultation covering your urgent life questions, mental peace, and spiritual growth.',
    fullDescription: 'An open-ended private consultation where you can ask multiple specific questions regarding personal challenges, health, court cases, family harmony, or spiritual path.',
    icon: 'MessageCircle',
    recommendedDuration: 60,
    benefits: [
      'Direct, uninterrupted dialogue with senior Acharya',
      'Multiple question freedom across all life aspects',
      'Deep psychological and spiritual clarity',
      'Written summary of personalized remedies',
    ],
  },
];

// Get list of all public approved astrologers
exports.getPublicAstrologers = async (req, res, next) => {
  try {
    const { specialization, maxPrice, search } = req.query;

    const profiles = await ExecutiveProfile.find({ approvalStatus: 'APPROVED' })
      .populate('userId', 'name email phone profileImage isActive')
      .sort({ rating: -1, totalConsultations: -1 });

    // Filter only active users
    let filtered = profiles.filter((p) => p.userId && p.userId.isActive);

    if (specialization) {
      filtered = filtered.filter((p) =>
        p.specialization.some((s) => s.toLowerCase().includes(specialization.toLowerCase()))
      );
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      filtered = filtered.filter((p) => p.pricePerMinute <= max);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = p.userId?.name?.toLowerCase() || '';
        const title = p.title?.toLowerCase() || '';
        const bio = p.biography?.toLowerCase() || '';
        const specs = p.specialization.join(' ').toLowerCase();
        return name.includes(s) || title.includes(s) || bio.includes(s) || specs.includes(s);
      });
    }

    const astrologers = filtered.map((p) => ({
      id: p.userId._id,
      profileId: p._id,
      name: p.userId.name,
      title: p.title,
      profileImage: p.userId.profileImage,
      biography: p.biography,
      experience: p.experience,
      specialization: p.specialization,
      qualifications: p.qualifications,
      languages: p.languages,
      pricePerMinute: p.pricePerMinute,
      rating: p.rating,
      reviewCount: p.reviewCount,
      totalConsultations: p.totalConsultations,
      availability: p.availability,
      upiId: p.upiId,
      hasQrCode: Boolean(p.qrCode?.url),
      qrCodeUrl: p.qrCode?.url || '',
      paymentInstructions: p.paymentInstructions || '',
    }));

    res.status(200).json({
      success: true,
      count: astrologers.length,
      astrologers,
    });
  } catch (error) {
    next(error);
  }
};

// Get single astrologer details for public profile / booking page
exports.getPublicAstrologerById = async (req, res, next) => {
  try {
    const executiveUser = await User.findById(req.params.id).select('name email phone profileImage role');

    if (!executiveUser || executiveUser.role !== 'EXECUTIVE') {
      return res.status(404).json({ success: false, message: 'Astrologer not found.' });
    }

    const profile = await ExecutiveProfile.findOne({ userId: executiveUser._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Astrologer profile not found.' });
    }

    res.status(200).json({
      success: true,
      astrologer: {
        id: executiveUser._id,
        name: executiveUser.name,
        title: profile.title,
        profileImage: executiveUser.profileImage,
        biography: profile.biography,
        experience: profile.experience,
        specialization: profile.specialization,
        qualifications: profile.qualifications,
        languages: profile.languages,
        pricePerMinute: profile.pricePerMinute,
        rating: profile.rating,
        reviewCount: profile.reviewCount,
        totalConsultations: profile.totalConsultations,
        availability: profile.availability,
        upiId: profile.upiId,
        upiName: profile.upiName,
        qrCodeUrl: profile.qrCode?.url || '',
        paymentInstructions: profile.paymentInstructions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Astrology Services list
exports.getServices = async (req, res) => {
  res.status(200).json({
    success: true,
    services: ASTROLOGY_SERVICES,
  });
};

// Submit public contact inquiry
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, and message.' });
    }

    // In a live system, this could save to an Inquiries collection or send an email.
    console.log(`[Contact Inquiry Received] from ${name} (${email}): ${subject} - ${message}`);

    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out. Our support team will get in touch with you shortly.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
};

