export interface YogaAsana {
  id: string;
  sanskrit: string;
  titleEn: string;
  titleHi: string;
  category: 'Standing' | 'Seated' | 'Backbend' | 'Inversion' | 'Relaxation' | 'Pranayama';
  categoryHi: string;
  difficultyEn: string;
  difficultyHi: string;
  duration: string;
  breathEn: string;
  breathHi: string;
  stepGraphics: string[];
  stepsEn: string[];
  stepsHi: string[];
  benefitsEn: string[];
  benefitsHi: string[];
  cautionEn: string;
  cautionHi: string;
  videoId: string;
}

export const YOGA_ASANAS: YogaAsana[] = [
  {
    "id": "surya-namaskar",
    "sanskrit": "सूर्य नमस्कार",
    "titleEn": "Surya Namaskar (Sun Salutation)",
    "titleHi": "सूर्य नमस्कार (12 आसन क्रम)",
    "category": "Standing",
    "categoryHi": "खड़े होकर / प्रवाह",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "5–10 min",
    "breathEn": "Synchronize each of the 12 transitions with slow nasal inhales and exhales.",
    "breathHi": "सभी 12 स्थितियों को धीमी नासिका श्वास के साथ जोड़ें।",
    "stepGraphics": [
      "stand-namaste",
      "arms-overhead",
      "forward-fold",
      "lunge-pose",
      "plank-lower",
      "surya-namaskar"
    ],
    "stepsEn": [
      "Stand tall at the front of the mat in Pranamasana (palms together at heart).",
      "Inhale: sweep arms overhead and gently arch back (Hasta Uttanasana).",
      "Exhale: hinge from the hips and fold forward toward your feet (Padahastasana).",
      "Inhale: step right leg back, drop knee, and lift chest (Ashwa Sanchalanasana).",
      "Lower knees-chest-chin (Ashtanga Namaskara), inhale into Cobra, exhale to Downward Dog.",
      "Step forward into forward fold, rise with arms overhead, and return to Pranamasana."
    ],
    "stepsHi": [
      "मैट के आगे सीधे खड़े होकर हृदय के सामने प्रणामासन में हाथ जोड़ें।",
      "श्वास भरते हुए दोनों भुजाएं ऊपर उठाएं और हल्का पीछे झुकें (हस्त उत्तानासन)।",
      "श्वास छोड़ते हुए कमर से आगे झुकें और हथेलियां पंजों के पास रखें (पादहस्तासन)।",
      "श्वास भरते हुए दायां पैर पीछे ले जाएं और छाती ऊपर उठाएं (अश्व संचालनासन)।",
      "अष्टांग नमस्कार से भुजंगासन व अधोमुख श्वानासन में आएं।",
      "आगे आकर श्वास भरते हुए ऊपर उठें और प्रणामासन में लौटें।"
    ],
    "benefitsEn": [
      "Warms up and stretches all major muscle groups and spinal joints.",
      "Boosts cardiovascular circulation, metabolism, and morning vitality.",
      "Calms the nervous system and prepares body and mind for meditation."
    ],
    "benefitsHi": [
      "पूरे शरीर की मांसपेशियों और रीढ़ की हड्डी को लचीला व ऊर्जावान बनाता है।",
      "रक्त संचार, पाचन और प्रातःकालीन स्फूर्ति को बढ़ाता है।",
      "मन को शांत कर ध्यान के लिए तैयार करता है।"
    ],
    "cautionEn": "Move gently if you have high blood pressure, back pain, or knee injury.",
    "cautionHi": "उच्च रक्तचाप, कमर दर्द या घुटने की चोट होने पर धीरे व सावधानी से करें।",
    "videoId": "1xRX1MuoImw"
  },
  {
    "id": "tadasana",
    "sanskrit": "ताड़ासन",
    "titleEn": "Tadasana (Mountain Pose)",
    "titleHi": "ताड़ासन (पर्वत मुद्रा)",
    "category": "Standing",
    "categoryHi": "खड़े होकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–60 sec",
    "breathEn": "Inhale deeply while lifting heels and arms; breathe steadily at the top.",
    "breathHi": "एड़ियां और भुजाएं ऊपर उठाते समय गहरा श्वास लें।",
    "stepGraphics": [
      "stand-namaste",
      "arms-overhead",
      "tadasana",
      "stand-namaste"
    ],
    "stepsEn": [
      "Stand with feet together or hip-width apart, weight balanced evenly.",
      "Interlace fingers, turn palms upward, and stretch both arms overhead.",
      "Inhale and gently rise onto your toes, lengthening the entire spine.",
      "Hold 20–40 seconds with steady gaze, then exhale slowly down."
    ],
    "stepsHi": [
      "दोनों पैरों को मिलाकर या हल्का अंतर रखकर सीधे खड़े हों।",
      "अंगुलियां फंसाकर हथेलियां ऊपर मोड़ें और भुजाएं सिर के ऊपर तानें।",
      "श्वास भरते हुए पंजों के बल ऊपर उठें और रीढ़ को ऊपर खींचें।",
      "20–40 सेकंड रुकें, फिर धीरे-धीरे एड़ियां और हाथ नीचे लाएं।"
    ],
    "benefitsEn": [
      "Improves posture, spinal alignment, and body balance.",
      "Strengthens thighs, ankles, knees, and core stability.",
      "Awakens mental alertness and relieves mild stiffness."
    ],
    "benefitsHi": [
      "शरीर की मुद्रा, रीढ़ के संरेखण और संतुलन को सुधारता है।",
      "जांघों, टखनों और घुटनों को मजबूत बनाता है।",
      "आलस्य दूर कर एकाग्रता बढ़ाता है।"
    ],
    "cautionEn": "Keep heels down on the mat if you feel dizzy.",
    "cautionHi": "चक्कर आने की स्थिति में एड़ियां ज़मीन पर ही रखें।",
    "videoId": "5NxDs-ovJU8"
  },
  {
    "id": "vrikshasana",
    "sanskrit": "वृक्षासन",
    "titleEn": "Vrikshasana (Tree Pose)",
    "titleHi": "वृक्षासन (संतुलन आसन)",
    "category": "Standing",
    "categoryHi": "खड़े होकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–60 sec / side",
    "breathEn": "Maintain smooth, rhythmic breathing while holding your gaze.",
    "breathHi": "एक बिंदु पर दृष्टि टिकाकर सहज श्वास बनाए रखें।",
    "stepGraphics": [
      "stand-namaste",
      "vrikshasana",
      "arms-overhead",
      "vrikshasana"
    ],
    "stepsEn": [
      "Stand upright and shift weight steadily onto your left leg.",
      "Bend right knee and place right sole against inner left thigh or calf (avoid the knee).",
      "Bring palms together at heart center or raise arms overhead in Namaste.",
      "Hold 30 seconds with calm breath, then repeat on the other leg."
    ],
    "stepsHi": [
      "सीधे खड़े होकर शरीर का भार बाएं पैर पर लाएं।",
      "दायां तलवा बाईं जांघ के अंदर या पिंडली पर रखें (घुटने पर न रखें)।",
      "हथेलियां हृदय के पास या सिर के ऊपर नमस्कार मुद्रा में जोड़ें।",
      "30 सेकंड रुकें, फिर दूसरे पैर से दोहराएं।"
    ],
    "benefitsEn": [
      "Builds neuromuscular balance, leg strength, and ankle stability.",
      "Opens the hips and lengthens the spine.",
      "Sharpens concentration and steadies a restless mind."
    ],
    "benefitsHi": [
      "शारीरिक संतुलन और पैरों की शक्ति बढ़ाता है।",
      "कूल्हों को खोलता है और रीढ़ को सीधा रखता है।",
      "एकाग्रता और आत्मविश्वास बढ़ाता है।"
    ],
    "cautionEn": "Stand near a wall for support if balancing feels unsteady.",
    "cautionHi": "संतुलन में कठिनाई हो तो दीवार का हल्का सहारा लें।",
    "videoId": "0g3lN6XpWrQ"
  },
  {
    "id": "trikonasana",
    "sanskrit": "त्रिकोणासन",
    "titleEn": "Trikonasana (Triangle Pose)",
    "titleHi": "त्रिकोणासन",
    "category": "Standing",
    "categoryHi": "खड़े होकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–45 sec / side",
    "breathEn": "Exhale as you bend sideways; inhale to lengthen the chest.",
    "breathHi": "बगल में झुकते समय श्वास छोड़ें और छाती खोलें।",
    "stepGraphics": [
      "stand-namaste",
      "virabhadrasana",
      "trikonasana",
      "trikonasana"
    ],
    "stepsEn": [
      "Step feet wide apart (3.5–4 feet) and turn right foot out 90 degrees.",
      "Inhale and extend both arms out to shoulder height.",
      "Exhale and reach right hand to shin or ankle while lifting left arm straight up.",
      "Keep chest open and hold 20–30 seconds per side."
    ],
    "stepsHi": [
      "पैरों के बीच लगभग 3.5 फीट की दूरी रखें और दायां पंजा 90° मोड़ें।",
      "श्वास भरकर दोनों भुजाएं कंधों की सीध में फैलाएं।",
      "श्वास छोड़ते हुए दाईं ओर झुकें और बायां हाथ सीधा ऊपर उठाएं।",
      "दोनों तरफ 20–30 सेकंड अभ्यास करें।"
    ],
    "benefitsEn": [
      "Stretches hamstrings, hips, shoulders, and side waist.",
      "Stimulates abdominal organs and aids healthy digestion.",
      "Relieves stiffness in the neck and back."
    ],
    "benefitsHi": [
      "हैमस्ट्रिंग, कूल्हों और कमर में गहरा लचीलापन लाता है।",
      "पाचन तंत्र को सक्रिय रखने में सहायक है।",
      "कमर और गर्दन की जकड़न दूर करता है।"
    ],
    "cautionEn": "Look straight ahead or down if looking up strains your neck.",
    "cautionHi": "गर्दन में दर्द हो तो ऊपर देखने के बजाय नीचे देखें।",
    "videoId": "h60lC7mCaFA"
  },
  {
    "id": "virabhadrasana",
    "sanskrit": "वीरभद्रासन",
    "titleEn": "Virabhadrasana (Warrior Pose)",
    "titleHi": "वीरभद्रासन (योद्धा मुद्रा)",
    "category": "Standing",
    "categoryHi": "खड़े होकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–45 sec / side",
    "breathEn": "Inhale to raise arms and open chest; exhale to sink into the front knee.",
    "breathHi": "श्वास भरकर भुजाएं उठाएं; श्वास छोड़ते हुए आगे का घुटना मोड़ें।",
    "stepGraphics": [
      "stand-namaste",
      "lunge-pose",
      "virabhadrasana",
      "arms-overhead"
    ],
    "stepsEn": [
      "Step feet wide apart (about 4 feet) and turn right foot out 90 degrees.",
      "Bend your right knee over the ankle so the thigh is parallel to the floor.",
      "Extend both arms strongly at shoulder level (Warrior II) or overhead (Warrior I).",
      "Gaze over your front fingertips, hold 30 seconds, then switch sides."
    ],
    "stepsHi": [
      "दोनों पैरों में 4 फीट की दूरी रखकर दायां पंजा 90° बाहर मोड़ें।",
      "दायां घुटना मोड़कर जांघ को ज़मीन के समानांतर लाएं।",
      "दोनों भुजाएं कंधों की सीध में फैलाएं या सिर के ऊपर उठाएं।",
      "30 सेकंड स्थिर रहें, फिर दूसरी तरफ से दोहराएं।"
    ],
    "benefitsEn": [
      "Builds stamina, leg power, and strong hip/shoulder stability.",
      "Opens chest and lungs for deeper breathing.",
      "Cultivates courage, focus, and upright posture."
    ],
    "benefitsHi": [
      "पैरों, जांघों और कंधों की शक्ति व सहनशक्ति बढ़ाता है।",
      "छाती और फेफड़ों को खोलकर श्वास क्षमता सुधारता है।",
      "एकाग्रता, ऊर्जा और आत्मबल बढ़ाता है।"
    ],
    "cautionEn": "Keep front knee aligned over ankle, not past the toes.",
    "cautionHi": "आगे का घुटना टखने की सीध में रखें, पंजों से आगे न जाने दें।",
    "videoId": "m-CHztlyh0U"
  },
  {
    "id": "adho-mukha-svanasana",
    "sanskrit": "अधोमुख श्वानासन",
    "titleEn": "Adho Mukha Svanasana (Downward Dog)",
    "titleHi": "अधोमुख श्वानासन",
    "category": "Standing",
    "categoryHi": "खड़े होकर / प्रवाह",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–60 sec",
    "breathEn": "Exhale as you lift hips into an inverted V; breathe deeply.",
    "breathHi": "कमर ऊपर उठाते समय श्वास छोड़ें और सहज श्वास लें।",
    "stepGraphics": [
      "plank-lower",
      "adho-mukha-svanasana",
      "forward-fold",
      "balasana"
    ],
    "stepsEn": [
      "Start on hands and knees in a tabletop position, palms shoulder-width apart.",
      "Tuck toes, exhale, and lift hips high toward the ceiling forming an inverted V.",
      "Press palms firmly into the mat and gently lengthen heels toward the floor.",
      "Hold for 5 deep breaths, then bend knees to rest in Child's Pose."
    ],
    "stepsHi": [
      "हाथों और घुटनों के बल टेबल पोज़ में आएं।",
      "पंजों को मोड़कर श्वास छोड़ते हुए कूल्हों को ऊपर उठाकर V आकार बनाएं।",
      "हथेलियां मैट पर दबाएं और एड़ियों को धीरे-धीरे ज़मीन की ओर लाएं।",
      "5 गहरे श्वास लें, फिर घुटने मोड़कर बालासन में विश्राम करें।"
    ],
    "benefitsEn": [
      "Rejuvenates the whole body, lengthening spine, calves, and hamstrings.",
      "Strengthens arms, shoulders, and wrists.",
      "Relieves fatigue and boosts blood flow to the brain."
    ],
    "benefitsHi": [
      "पूरी रीढ़, कंधों और पैरों की मांसपेशियों को तरोताजा करता है।",
      "भुजाओं, कंधों और कलाइयों को मजबूत बनाता है।",
      "थकान दूर कर मस्तिष्क में रक्त संचार बढ़ाता है।"
    ],
    "cautionEn": "Bend knees slightly if hamstrings are tight; avoid with severe wrist pain.",
    "cautionHi": "जांघों में खिंचाव हो तो घुटने हल्के मोड़ लें; कलाई दर्द में सावधानी रखें।",
    "videoId": "RMBQR0BKbuE"
  },
  {
    "id": "padmasana",
    "sanskrit": "पद्मासन",
    "titleEn": "Padmasana (Lotus Pose)",
    "titleHi": "पद्मासन (कमल मुद्रा)",
    "category": "Seated",
    "categoryHi": "बैठकर",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "5–15 min",
    "breathEn": "Breathe slowly and effortlessly from the diaphragm.",
    "breathHi": "पेट से धीमा, गहरा और सहज श्वास बनाए रखें।",
    "stepGraphics": [
      "sit-dandasana",
      "sit-cross",
      "padmasana",
      "mudra-breath"
    ],
    "stepsEn": [
      "Sit with legs stretched forward and spine upright (Dandasana).",
      "Gently place right foot onto the left upper thigh.",
      "Place left foot onto the right upper thigh.",
      "Rest hands on knees in Chin Mudra and close your eyes in meditation."
    ],
    "stepsHi": [
      "मैट पर पैर फैलाकर रीढ़ सीधी रखते हुए बैठें।",
      "दायां पैर बाईं जांघ के ऊपरी हिस्से पर रखें।",
      "बायां पैर दाईं जांघ के ऊपरी हिस्से पर रखें।",
      "हाथ चिन मुद्रा में घुटनों पर रखें और आंखें बंद कर ध्यान करें।"
    ],
    "benefitsEn": [
      "Ideal classical posture for deep meditation and pranayama.",
      "Keeps the spine naturally erect and calms brain activity.",
      "Opens hips and improves pelvic circulation."
    ],
    "benefitsHi": [
      "ध्यान और प्राणायाम के लिए सर्वश्रेष्ठ पारंपरिक आसन।",
      "रीढ़ को सीधा रखकर मानसिक शांति प्रदान करता है।",
      "कूल्हों और जोड़ों में लचीलापन बढ़ाता है।"
    ],
    "cautionEn": "Do not force knees; use Sukhasana if knees feel tight.",
    "cautionHi": "घुटनों पर जोर न डालें; कठिनाई में सुखासन चुनें।",
    "videoId": "lvhInadPnC0"
  },
  {
    "id": "sukhasana",
    "sanskrit": "सुखासन",
    "titleEn": "Sukhasana (Easy Pose)",
    "titleHi": "सुखासन (सरल ध्यान मुद्रा)",
    "category": "Seated",
    "categoryHi": "बैठकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "5–20 min",
    "breathEn": "Slow, even inhales and exhales to anchor awareness.",
    "breathHi": "समान और शांत श्वास लेकर मन को स्थिर करें।",
    "stepGraphics": [
      "sit-dandasana",
      "sit-cross",
      "sukhasana",
      "mudra-breath"
    ],
    "stepsEn": [
      "Sit comfortably with legs extended, then cross them at the shins.",
      "Keep spine tall without tension and relax shoulders down.",
      "Rest hands on thighs or in Dhyana Mudra and breathe peacefully.",
      "Maintain gentle awareness for 5–20 minutes."
    ],
    "stepsHi": [
      "मैट पर आराम से पालथी मारकर बैठें।",
      "कंधों को ढीला छोड़ें और रीढ़ की हड्डी सीधी रखें।",
      "हाथ घुटनों पर या गोद में ध्यान मुद्रा में रखें।",
      "5–20 मिनट शांत सजगता में बैठें।"
    ],
    "benefitsEn": [
      "Accessible meditation posture for all ages.",
      "Reduces stress, fatigue, and mental restlessness.",
      "Promotes grounded, upright posture."
    ],
    "benefitsHi": [
      "सभी आयु वर्ग के लिए सबसे सरल ध्यान आसन।",
      "तनाव, थकान और चिंता कम करता है।",
      "सही बैठने की मुद्रा को मजबूत करता है।"
    ],
    "cautionEn": "Sit on a cushion if your lower back rounds.",
    "cautionHi": "कमर झुकती हो तो नितंबों के नीचे पतली गद्दी रखें।",
    "videoId": "GEaRcmyCL2Y"
  },
  {
    "id": "vajrasana",
    "sanskrit": "वज्रासन",
    "titleEn": "Vajrasana (Diamond Pose)",
    "titleHi": "वज्रासन (पाचन व ध्यान मुद्रा)",
    "category": "Seated",
    "categoryHi": "बैठकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "5–10 min",
    "breathEn": "Breathe slowly and deeply into the abdomen.",
    "breathHi": "पेट में गहरा और शांत श्वास लें।",
    "stepGraphics": [
      "sit-dandasana",
      "kneel-sit",
      "vajrasana",
      "mudra-breath"
    ],
    "stepsEn": [
      "Kneel on the yoga mat with knees together and big toes touching behind.",
      "Slowly lower your hips to rest between your heels.",
      "Place palms face down on your thighs and keep spine tall.",
      "Sit calmly for 5–10 minutes (can be practiced even right after meals)."
    ],
    "stepsHi": [
      "मैट पर घुटनों के बल बैठें, दोनों घुटने मिलाएं और अंगूठे पीछे मिलाएं।",
      "धीरे-धीरे नितंबों को दोनों एड़ियों के बीच टिकाएं।",
      "हथेलियां जांघों पर रखें और रीढ़ व सिर सीधा रखें।",
      "5–10 मिनट शांत बैठें (भोजन के बाद भी किया जा सकता है)।"
    ],
    "benefitsEn": [
      "Best yoga posture to aid digestion even right after meals.",
      "Strengthens pelvic muscles, thighs, and ankles.",
      "Calms the mind and relieves mild acidity or bloating."
    ],
    "benefitsHi": [
      "पाचन के लिए सर्वश्रेष्ठ आसन (भोजन के तुरंत बाद भी लाभकारी)।",
      "जांघों, टखनों और कमर की मांसपेशियों को मजबूत करता है।",
      "गैस, अपच कम कर मन को स्थिर करता है।"
    ],
    "cautionEn": "Place a folded towel under ankles or avoid if you have severe knee pain.",
    "cautionHi": "घुटनों में तेज दर्द हो तो न करें या टखनों के नीचे तौलिया रखें।",
    "videoId": "qotNvwJigPE"
  },
  {
    "id": "paschimottanasana",
    "sanskrit": "पश्चिमोत्तानासन",
    "titleEn": "Paschimottanasana (Seated Forward Bend)",
    "titleHi": "पश्चिमोत्तानासन",
    "category": "Seated",
    "categoryHi": "बैठकर",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–60 sec",
    "breathEn": "Inhale to lengthen spine; exhale to fold forward from the hips.",
    "breathHi": "श्वास भरकर रीढ़ खींचें और छोड़ते हुए आगे झुकें।",
    "stepGraphics": [
      "sit-dandasana",
      "arms-overhead",
      "paschimottanasana",
      "sit-dandasana"
    ],
    "stepsEn": [
      "Sit with legs extended straight ahead and toes flexed upward.",
      "Inhale and lift both arms overhead to lengthen your spine.",
      "Exhale and hinge forward from the hips to hold shins, ankles, or toes.",
      "Relax neck and hold for 30–45 seconds before rising."
    ],
    "stepsHi": [
      "दोनों पैर सामने सीधा फैलाकर बैठें।",
      "श्वास भरकर दोनों हाथ ऊपर उठाएं और रीढ़ सीधी करें।",
      "श्वास छोड़ते हुए कमर से आगे झुकें और पैर पकड़ें।",
      "गर्दन शांत रखकर 30–45 सेकंड रुकें।"
    ],
    "benefitsEn": [
      "Stretches hamstrings, calves, and entire spine.",
      "Calms the nervous system and eases stress and insomnia.",
      "Supports healthy digestion and abdominal tone."
    ],
    "benefitsHi": [
      "हैमस्ट्रिंग और पूरी रीढ़ को लचीला बनाता है।",
      "तनाव, क्रोध और अनिद्रा में राहत देता है।",
      "पाचन क्रिया और पेट के अंगों को सक्रिय करता है।"
    ],
    "cautionEn": "Bend knees slightly if hamstrings feel tight.",
    "cautionHi": "जांघों में जकड़न हो तो घुटने हल्के मोड़ लें।",
    "videoId": "T8sgVyF4Ux4"
  },
  {
    "id": "gomukhasana",
    "sanskrit": "गोमुखासन",
    "titleEn": "Gomukhasana (Cow Face Pose)",
    "titleHi": "गोमुखासन",
    "category": "Seated",
    "categoryHi": "बैठकर",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "30–45 sec / side",
    "breathEn": "Breathe deeply into the upper chest and shoulders.",
    "breathHi": "ऊपरी छाती और कंधों में गहरा श्वास लें।",
    "stepGraphics": [
      "sit-dandasana",
      "sit-cross",
      "gomukhasana",
      "gomukhasana"
    ],
    "stepsEn": [
      "Sit with legs extended, then cross right knee directly over left knee.",
      "Raise right arm overhead, bend elbow, and reach down between shoulder blades.",
      "Reach left arm behind your back from below to clasp fingers (or hold a strap).",
      "Keep spine tall for 30 seconds, then repeat on the opposite side."
    ],
    "stepsHi": [
      "दाएं घुटने को बाएं घुटने के ऊपर रखकर बैठें।",
      "दायां हाथ सिर के ऊपर से पीछे ले जाएं और बायां हाथ नीचे से पीठ के पीछे लाएं।",
      "दोनों हाथों की अंगुलियां आपस में फंसाएं (या रूमाल/पट्टी पकड़ें)।",
      "30 सेकंड रीढ़ सीधी रखकर बैठें, फिर दूसरी तरफ दोहराएं।"
    ],
    "benefitsEn": [
      "Deeply opens tight shoulders, chest, and hips.",
      "Relieves upper-back and neck tension from desk work.",
      "Improves posture and lung expansion."
    ],
    "benefitsHi": [
      "कंधों, छाती और कूल्हों की जकड़न को गहराई से खोलता है।",
      "कंप्यूटर/डेस्क कार्य से होने वाला पीठ व गर्दन दर्द कम करता है।",
      "शरीर की मुद्रा और श्वसन क्षमता सुधारता है।"
    ],
    "cautionEn": "Use a strap between hands if fingers do not meet comfortably.",
    "cautionHi": "हाथ न मिलें तो जोर न लगाएं, बीच में तौलिया या बेल्ट पकड़ें।",
    "videoId": "eSlfTsEYRag"
  },
  {
    "id": "ardha-matsyendrasana",
    "sanskrit": "अर्ध मत्स्येन्द्रासन",
    "titleEn": "Ardha Matsyendrasana (Half Spinal Twist)",
    "titleHi": "अर्ध मत्स्येन्द्रासन",
    "category": "Seated",
    "categoryHi": "बैठकर",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "30–45 sec / side",
    "breathEn": "Inhale to lengthen spine upward; exhale to deepen the twist gently.",
    "breathHi": "श्वास भरकर रीढ़ सीधी करें; श्वास छोड़ते हुए धीरे से कमर मोड़ें।",
    "stepGraphics": [
      "sit-dandasana",
      "sit-cross",
      "ardha-matsyendrasana",
      "ardha-matsyendrasana"
    ],
    "stepsEn": [
      "Sit with legs stretched, bend left leg under you, and step right foot outside left knee.",
      "Inhale and lengthen your spine upward.",
      "Exhale and twist torso to the right, hooking left elbow outside right knee.",
      "Hold 20–30 seconds with steady breath, then twist to the left."
    ],
    "stepsHi": [
      "बायां पैर मोड़कर दायां पैर बाएं घुटने के बाहर रखें।",
      "श्वास भरकर रीढ़ की हड्डी सीधी ऊपर खींचें।",
      "श्वास छोड़ते हुए दाईं ओर मुड़ें और बाईं कोहनी दाएं घुटने के बाहर टिकाएं।",
      "20–30 सेकंड रुकें, फिर दूसरी दिशा में करें।"
    ],
    "benefitsEn": [
      "Restores spinal mobility and massages abdominal organs.",
      "Aids digestion, detoxification, and blood sugar balance.",
      "Relieves lower-back stiffness and shoulder tightness."
    ],
    "benefitsHi": [
      "रीढ़ की हड्डी को लचीला बनाता है और पेट के अंगों की मालिश करता है।",
      "पाचन, मधुमेह संतुलन और विषहरण में सहायक है।",
      "कमर की जकड़न दूर करता है।"
    ],
    "cautionEn": "Avoid deep twists during pregnancy or acute spinal disc issues.",
    "cautionHi": "गर्भावस्था या गंभीर कमर की समस्या में गहरा मोड़ न दें।",
    "videoId": "yYy6w8_hLTE"
  },
  {
    "id": "bhujangasana",
    "sanskrit": "भुजंगासन",
    "titleEn": "Bhujangasana (Cobra Pose)",
    "titleHi": "भुजंगासन (सर्प मुद्रा)",
    "category": "Backbend",
    "categoryHi": "पीछे झुकने वाले",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "20–30 sec",
    "breathEn": "Inhale as you lift the chest; exhale gently as you lower down.",
    "breathHi": "छाती ऊपर उठाते समय श्वास भरें और नीचे आते समय छोड़ें।",
    "stepGraphics": [
      "lie-prone",
      "bhujangasana",
      "bhujangasana",
      "lie-prone"
    ],
    "stepsEn": [
      "Lie on your stomach with legs extended and palms under shoulders.",
      "Inhale and gently lift head and chest using back strength.",
      "Keep shoulders away from ears and elbows slightly tucked; hold 15–30 seconds.",
      "Exhale slowly to lower forehead back to the mat."
    ],
    "stepsHi": [
      "पेट के बल लेटकर हथेलियां कंधों के नीचे रखें।",
      "श्वास भरते हुए पीठ के बल से सिर और छाती ऊपर उठाएं।",
      "कंधे कानों से दूर रखें और 15–30 सेकंड रुकें।",
      "श्वास छोड़ते हुए धीरे-धीरे नीचे आएं।"
    ],
    "benefitsEn": [
      "Strengthens the spine, lower back, and shoulders.",
      "Opens chest and lungs, improving breathing capacity.",
      "Relieves stiffness from prolonged sitting."
    ],
    "benefitsHi": [
      "रीढ़ की हड्डी, कमर और कंधों को मजबूत करता है।",
      "फेफड़ों को खोलकर श्वास क्षमता बढ़ाता है।",
      "लंबे समय तक बैठने की जकड़न दूर करता है।"
    ],
    "cautionEn": "Avoid deep backbends during pregnancy or acute disc injury.",
    "cautionHi": "गर्भावस्था या गंभीर स्लिप डिस्क में न करें।",
    "videoId": "QxQWFSJ7MwI"
  },
  {
    "id": "dhanurasana",
    "sanskrit": "धनुरासन",
    "titleEn": "Dhanurasana (Bow Pose)",
    "titleHi": "धनुरासन",
    "category": "Backbend",
    "categoryHi": "पीछे झुकने वाले",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "15–30 sec",
    "breathEn": "Inhale deeply as you press ankles back and lift chest.",
    "breathHi": "पैरों को पीछे खींचते हुए गहरा श्वास लें।",
    "stepGraphics": [
      "lie-prone",
      "dhanurasana",
      "dhanurasana",
      "balasana"
    ],
    "stepsEn": [
      "Lie on your stomach, bend knees, and hold outer ankles.",
      "Inhale and press ankles back, lifting chest and thighs off the mat.",
      "Balance steadily on your abdomen like a drawn bow for 15–25 seconds.",
      "Exhale gently down and relax in Child's Pose."
    ],
    "stepsHi": [
      "पेट के बल लेटकर घुटने मोड़ें और टखने पकड़ें।",
      "श्वास भरते हुए पैर पीछे खींचें जिससे छाती और जांघें ऊपर उठें।",
      "धनुष के आकार में 15–25 सेकंड संतुलित रहें।",
      "श्वास छोड़ते हुए नीचे आएं और बालासन में विश्राम करें।"
    ],
    "benefitsEn": [
      "Deeply stretches the entire front body and hip flexors.",
      "Strengthens back muscles and aids digestion.",
      "Boosts energy and spinal flexibility."
    ],
    "benefitsHi": [
      "छाती, कंधों और जांघों में संपूर्ण खिंचाव लाता है।",
      "पीठ को शक्ति देता है और पाचन सुधारता है।",
      "रीढ़ में लचीलापन और स्फूर्ति बढ़ाता है।"
    ],
    "cautionEn": "Avoid with abdominal surgery, hernia, or severe back pain.",
    "cautionHi": "पेट की सर्जरी, हर्निया या तेज कमर दर्द में न करें।",
    "videoId": "nO5VwMMF-ec"
  },
  {
    "id": "setu-bandhasana",
    "sanskrit": "सेतु बंधासन",
    "titleEn": "Setu Bandhasana (Bridge Pose)",
    "titleHi": "सेतु बंधासन (पुल मुद्रा)",
    "category": "Backbend",
    "categoryHi": "पीछे झुकने वाले",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "30–45 sec",
    "breathEn": "Inhale as you lift hips upward; breathe calmly while holding.",
    "breathHi": "कमर ऊपर उठाते समय श्वास लें और ऊपर सहज श्वास रखें।",
    "stepGraphics": [
      "lie-supine",
      "setu-bandhasana",
      "setu-bandhasana",
      "lie-supine"
    ],
    "stepsEn": [
      "Lie on your back with knees bent and feet hip-width apart near your hips.",
      "Press feet and arms into the mat, inhale, and lift your hips toward the ceiling.",
      "Keep thighs parallel and chest gently lifting toward your chin for 30 seconds.",
      "Exhale and slowly roll your spine back down to the mat."
    ],
    "stepsHi": [
      "पीठ के बल लेटकर घुटने मोड़ें और पंजे कमर के पास रखें।",
      "पैरों और हथेलियों को दबाते हुए श्वास भरें और कमर ऊपर उठाएं।",
      "30 सेकंड तक पुल के आकार में स्थिर रहें।",
      "श्वास छोड़ते हुए धीरे-धीरे पीठ नीचे लाएं।"
    ],
    "benefitsEn": [
      "Strengthens lower back, glutes, and hamstrings.",
      "Opens chest and calms mild stress or fatigue.",
      "Supports thyroid circulation and spinal health."
    ],
    "benefitsHi": [
      "कमर, नितंब और पैरों की मांसपेशियों को मजबूत बनाता है।",
      "छाती खोलकर तनाव व थकान दूर करता है।",
      "थायरॉइड और रीढ़ के स्वास्थ्य में लाभकारी है।"
    ],
    "cautionEn": "Keep neck neutral and do not turn head side-to-side while lifted.",
    "cautionHi": "कमर ऊपर उठाते समय गर्दन को बिल्कुल न घुमाएं।",
    "videoId": "Exyjk7hNs4c"
  },
  {
    "id": "ustrasana",
    "sanskrit": "उष्ट्रासन",
    "titleEn": "Ustrasana (Camel Pose)",
    "titleHi": "उष्ट्रासन (ऊँट मुद्रा)",
    "category": "Backbend",
    "categoryHi": "पीछे झुकने वाले",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "20–30 sec",
    "breathEn": "Inhale to lift the heart upward; exhale as hands reach heels.",
    "breathHi": "श्वास भरकर छाती ऊपर खोलें और छोड़ते हुए एड़ियां पकड़ें।",
    "stepGraphics": [
      "kneel-sit",
      "ustrasana",
      "ustrasana",
      "balasana"
    ],
    "stepsEn": [
      "Kneel upright on your mat with knees hip-width apart.",
      "Place hands on lower back, lift chest, and gently arch backward.",
      "Reach hands back onto your heels and press hips slightly forward.",
      "Hold 15–25 seconds, rise slowly, and counter-stretch in Child's Pose."
    ],
    "stepsHi": [
      "घुटनों के बल सीधे खड़े हों (जांघें सीधी रखें)।",
      "हाथ कमर पर रखकर छाती ऊपर उठाएं और धीरे से पीछे झुकें।",
      "दोनों हाथों से एड़ियां पकड़ें और 15–25 सेकंड रुकें।",
      "धीरे-धीरे वापस आकर बालासन में विश्राम करें।"
    ],
    "benefitsEn": [
      "Deeply opens chest, lungs, abdomen, and hip flexors.",
      "Improves posture and counteracts rounded shoulders.",
      "Boosts energy and relieves mild backache."
    ],
    "benefitsHi": [
      "छाती, फेफड़ों और पेट में गहरा खिंचाव लाता है।",
      "झुके हुए कंधों व खराब मुद्रा को सुधारता है।",
      "ऊर्जा बढ़ाता है और कमर दर्द में राहत देता है।"
    ],
    "cautionEn": "Keep hands on lower back if reaching heels strains your spine.",
    "cautionHi": "एड़ियां पकड़ने में कठिनाई हो तो हाथ कमर पर ही रखें।",
    "videoId": "uywmLXQov_I"
  },
  {
    "id": "chakrasana",
    "sanskrit": "चक्रासन",
    "titleEn": "Chakrasana (Wheel Pose)",
    "titleHi": "चक्रासन",
    "category": "Backbend",
    "categoryHi": "पीछे झुकने वाले",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "15–30 sec",
    "breathEn": "Inhale strongly as you press palms and feet to lift into the wheel.",
    "breathHi": "हथेलियों व पंजों को दबाते हुए गहरा श्वास लेकर शरीर ऊपर उठाएं।",
    "stepGraphics": [
      "lie-supine",
      "setu-bandhasana",
      "chakrasana",
      "lie-supine"
    ],
    "stepsEn": [
      "Lie on your back, bend knees, and place palms beside ears with fingers toward shoulders.",
      "Inhale and lift hips into Bridge, then press firmly into hands and feet.",
      "Straighten arms and lift head and chest into a full arch (wheel).",
      "Hold 10–20 seconds, tuck chin, and lower gently back to the mat."
    ],
    "stepsHi": [
      "पीठ के बल लेटकर घुटने मोड़ें और हथेलियां कानों के पास कंधों की ओर रखकर टिकाएं।",
      "श्वास भरकर पहले कमर उठाएं, फिर हाथों और पैरों पर जोर देकर पूरा शरीर ऊपर उठाएं।",
      "10–20 सेकंड चक्र की मुद्रा में स्थिर रहें।",
      "ठोड़ी अंदर मोड़कर धीरे-धीरे पीठ ज़मीन पर लाएं।"
    ],
    "benefitsEn": [
      "Full-body backbend that strengthens arms, legs, and spine.",
      "Expands lung capacity and energizes the entire nervous system.",
      "Enhances core strength and spinal elasticity."
    ],
    "benefitsHi": [
      "हाथों, पैरों और पूरी रीढ़ को असाधारण शक्ति व लचीलापन देता है।",
      "फेफड़ों की क्षमता बढ़ाकर पूरे शरीर को ऊर्जावान बनाता है।",
      "मेरुदंड को युवा और स्वस्थ रखता है।"
    ],
    "cautionEn": "Warm up with Bridge & Cobra first; avoid with wrist, shoulder, or severe back injury.",
    "cautionHi": "पहले सेतु बंधासन से वार्म-अप करें; कलाई या गंभीर कमर चोट में न करें।",
    "videoId": "cxjOB0Qls3c"
  },
  {
    "id": "halasana",
    "sanskrit": "हलासन",
    "titleEn": "Halasana (Plow Pose)",
    "titleHi": "हलासन",
    "category": "Inversion",
    "categoryHi": "उल्टे आसन",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "30–60 sec",
    "breathEn": "Breathe calmly through the nose without turning your head.",
    "breathHi": "गर्दन को बिना घुमाए नाक से शांत श्वास लें।",
    "stepGraphics": [
      "lie-supine",
      "legs-90",
      "halasana",
      "shavasana"
    ],
    "stepsEn": [
      "Lie on your back with arms alongside your body, palms down.",
      "Inhale and lift both legs to 90 degrees, supporting lower back with hands.",
      "Exhale and guide toes overhead toward the floor behind you.",
      "Hold 20–45 seconds, then roll down slowly to Shavasana."
    ],
    "stepsHi": [
      "पीठ के बल लेट जाएं और हाथ शरीर के बगल में रखें।",
      "पैर 90 डिग्री उठाएं और कमर को हाथों से सहारा दें।",
      "श्वास छोड़ते हुए पैरों को सिर के पीछे ज़मीन की ओर ले जाएं।",
      "20–45 सेकंड रुककर धीरे-धीरे वापस आएं।"
    ],
    "benefitsEn": [
      "Deeply stretches upper back, shoulders, and spine.",
      "Stimulates thyroid balance and revitalizes circulation.",
      "Calms the mind and relieves shoulder tension."
    ],
    "benefitsHi": [
      "पीठ के ऊपरी भाग और कंधों में गहरा खिंचाव लाता है।",
      "थायरॉइड संतुलन और रक्त संचार में सहायक है।",
      "थकान कम कर मन को शांत करता है।"
    ],
    "cautionEn": "Avoid with neck injury or high blood pressure.",
    "cautionHi": "गर्दन की चोट या उच्च रक्तचाप में इसे न करें।",
    "videoId": "mbXQj9_REPY"
  },
  {
    "id": "sarvangasana",
    "sanskrit": "सर्वांगासन",
    "titleEn": "Sarvangasana (Shoulder Stand)",
    "titleHi": "सर्वांगासन (सभी अंगों का आसन)",
    "category": "Inversion",
    "categoryHi": "उल्टे आसन",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "30–60 sec",
    "breathEn": "Breathe smoothly into the chest; never turn your neck.",
    "breathHi": "छाती में सहज श्वास लें; गर्दन को बिल्कुल न हिलाएं।",
    "stepGraphics": [
      "lie-supine",
      "legs-90",
      "sarvangasana",
      "shavasana"
    ],
    "stepsEn": [
      "Lie flat on your back with arms beside your body.",
      "Lift legs up to 90 degrees, then lift hips and support mid-back with both hands.",
      "Extend legs straight upward in line with torso, resting weight on shoulders.",
      "Hold 30–60 seconds, lower legs carefully, and rest in Shavasana."
    ],
    "stepsHi": [
      "पीठ के बल सीधे लेट जाएं।",
      "पैर 90 डिग्री उठाएं, फिर कमर ऊपर उठाकर हाथों से पीठ को सहारा दें।",
      "पैरों व शरीर को एक सीधी रेखा में ऊपर तानें (भार कंधों पर रहे)।",
      "30–60 सेकंड रुककर धीरे से नीचे आएं और शवासन करें।"
    ],
    "benefitsEn": [
      "Known as the Queen of Asanas — nourishes thyroid and endocrine balance.",
      "Improves venous return from legs and refreshes the brain.",
      "Relieves stress, mild insomnia, and sluggish circulation."
    ],
    "benefitsHi": [
      "सभी अंगों को स्वस्थ रखने वाला आसन — थायरॉइड व हार्मोन संतुलन में उत्तम।",
      "पैरों की थकान और सूजन दूर कर मस्तिष्क को ताज़गी देता है।",
      "तनाव व अनिद्रा कम करता है।"
    ],
    "cautionEn": "Avoid with neck pain, high blood pressure, or glaucoma.",
    "cautionHi": "गर्दन दर्द, उच्च रक्तचाप या ग्लूकोमा में यह आसन न करें।",
    "videoId": "v1pcMaUOtOk"
  },
  {
    "id": "sirsasana",
    "sanskrit": "शीर्षासन",
    "titleEn": "Sirsasana (Headstand)",
    "titleHi": "शीर्षासन (आसनों का राजा)",
    "category": "Inversion",
    "categoryHi": "उल्टे आसन",
    "difficultyEn": "Intermediate",
    "difficultyHi": "मध्यम",
    "duration": "15–45 sec",
    "breathEn": "Steady, controlled nasal breathing throughout.",
    "breathHi": "पूरी स्थिति में शांत और नियंत्रित श्वास बनाए रखें।",
    "stepGraphics": [
      "balasana",
      "kneel-sit",
      "sirsasana",
      "balasana"
    ],
    "stepsEn": [
      "Kneel and interlace fingers on the mat, forming a supportive cup with forearms.",
      "Place the crown of your head in the cupped hands, tuck toes, and lift hips.",
      "Walk feet closer, tuck knees to chest, and slowly extend legs straight up.",
      "Hold 15–45 seconds near a wall if learning, then descend to Child's Pose."
    ],
    "stepsHi": [
      "कोहनियां मैट पर रखकर अंगुलियां आपस में फंसाएं और सिर का ऊपरी भाग हाथों में टिकाएं।",
      "पंजों पर खड़े होकर कमर उठाएं और पैर धीरे-धीरे सिर के पास लाएं।",
      "घुटने मोड़कर संतुलन बनाएं और धीरे-धीरे दोनों पैर सीधे ऊपर उठाएं।",
      "15–45 सेकंड रुकें (शुरुआत में दीवार का सहारा लें), फिर बालासन में आएं।"
    ],
    "benefitsEn": [
      "King of Asanas — boosts oxygenated blood flow to the brain and focus.",
      "Strengthens core, shoulders, arms, and postural balance.",
      "Rejuvenates memory, clarity, and vitality."
    ],
    "benefitsHi": [
      "आसनों का राजा — मस्तिष्क में रक्त संचार, स्मरण शक्ति और एकाग्रता बढ़ाता है।",
      "कंधों, भुजाओं और कोर मांसपेशियों को मजबूत करता है।",
      "पूरे शरीर में नई स्फूर्ति व तेज लाता है।"
    ],
    "cautionEn": "Practice against a wall with guidance; avoid with neck injury, high BP, or heart issues.",
    "cautionHi": "शुरुआत में दीवार के सहारे व मार्गदर्शन में करें; गर्दन चोट या उच्च रक्तचाप में न करें।",
    "videoId": "L661-1n2LbA"
  },
  {
    "id": "balasana",
    "sanskrit": "बालासन",
    "titleEn": "Balasana (Child's Pose)",
    "titleHi": "बालासन (शिशु विश्राम मुद्रा)",
    "category": "Relaxation",
    "categoryHi": "विश्राम",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "1–3 min",
    "breathEn": "Breathe slowly into your back ribs; soften shoulders on each exhale.",
    "breathHi": "पीठ की ओर गहरा श्वास लें और कंधे ढीले छोड़ें।",
    "stepGraphics": [
      "kneel-sit",
      "balasana",
      "balasana",
      "mudra-breath"
    ],
    "stepsEn": [
      "Kneel on the mat with big toes touching and knees slightly apart.",
      "Exhale and fold your torso forward over your thighs.",
      "Rest forehead gently on the mat with arms extended forward or beside legs.",
      "Breathe deeply for 1–3 minutes to release back and mind tension."
    ],
    "stepsHi": [
      "मैट पर वज्रासन में बैठें और घुटनों में हल्का अंतर रखें।",
      "श्वास छोड़ते हुए आगे झुकें और माथा ज़मीन पर टिकाएं।",
      "हाथ सामने फैलाएं या पैरों के बगल में आराम से रखें।",
      "1–3 मिनट गहरा व शांत श्वास लेकर विश्राम करें।"
    ],
    "benefitsEn": [
      "Gently stretches lower back, hips, thighs, and ankles.",
      "Instantly calms anxiety, fatigue, and mental overwhelm.",
      "Ideal resting pose between intense yoga postures."
    ],
    "benefitsHi": [
      "कमर, कूल्हों और जांघों को कोमलता से आराम देता है।",
      "तनाव, थकान और घबराहट को तुरंत शांत करता है।",
      "अन्य आसनों के बीच विश्राम के लिए उत्तम मुद्रा।"
    ],
    "cautionEn": "Place a cushion under your forehead or hips if knees feel tight.",
    "cautionHi": "घुटनों में कष्ट हो तो नितंबों या माथे के नीचे तकिया रखें।",
    "videoId": "QHTDpAMxj90"
  },
  {
    "id": "shavasana",
    "sanskrit": "शवासन",
    "titleEn": "Shavasana (Deep Relaxation)",
    "titleHi": "शवासन (विश्राम मुद्रा)",
    "category": "Relaxation",
    "categoryHi": "विश्राम",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "5–10 min",
    "breathEn": "Let breath flow naturally; release tension on every exhale.",
    "breathHi": "प्रत्येक श्वास छोड़ने के साथ शरीर को पूर्णतः ढीला छोड़ें।",
    "stepGraphics": [
      "lie-supine",
      "shavasana",
      "shavasana",
      "sit-cross"
    ],
    "stepsEn": [
      "Lie comfortably on your back with feet apart and palms facing upward.",
      "Close your eyes and consciously relax every muscle from toes to crown.",
      "Rest in quiet awareness for 5–10 minutes.",
      "Wiggle fingers and roll gently to your right side before sitting up."
    ],
    "stepsHi": [
      "पीठ के बल लेट जाएं, पैर अलग और हथेलियां ऊपर की ओर खुली रखें।",
      "आंखें बंद कर पैरों से सिर तक पूरे शरीर को ढीला छोड़ दें।",
      "5–10 मिनट शांत सजगता में विश्राम करें।",
      "दाईं करवट लेकर धीरे से उठकर बैठें।"
    ],
    "benefitsEn": [
      "Lowers stress hormones and integrates yoga practice.",
      "Supports healthy blood pressure and deep sleep.",
      "Restores mental clarity and inner stillness."
    ],
    "benefitsHi": [
      "तनाव कम कर गहरी मानसिक शांति देता है।",
      "रक्तचाप और नींद की गुणवत्ता सुधारता है।",
      "मन की स्पष्टता और स्थिरता लौटाता है।"
    ],
    "cautionEn": "Place a pillow under knees if lower back feels sensitive.",
    "cautionHi": "कमर में हल्का दर्द हो तो घुटनों के नीचे तकिया रखें।",
    "videoId": "Mc-38vuwE1Y"
  },
  {
    "id": "anulom-vilom",
    "sanskrit": "अनुलोम-विलोम प्राणायाम",
    "titleEn": "Anulom Vilom (Alternate Nostril)",
    "titleHi": "अनुलोम-विलोम प्राणायाम",
    "category": "Pranayama",
    "categoryHi": "प्राणायाम",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "5–10 min",
    "breathEn": "Slow 4s inhale through one nostril, gentle 4–6s exhale through the other.",
    "breathHi": "एक नासिका से 4 सेकंड धीमा पूरक और दूसरी से 4–6 सेकंड रेचक।",
    "stepGraphics": [
      "sukhasana",
      "anulom-vilom",
      "mudra-breath",
      "anulom-vilom"
    ],
    "stepsEn": [
      "Sit tall in Sukhasana or Padmasana with left hand in Chin Mudra.",
      "Close right nostril with thumb and inhale slowly through the left.",
      "Close left nostril with ring finger and exhale smoothly through the right.",
      "Inhale right, close, and exhale left to complete one round."
    ],
    "stepsHi": [
      "सुखासन में रीढ़ सीधी रखकर बैठें।",
      "दाएं अंगूठे से दाईं नासिका बंद कर बाईं से धीमा श्वास लें।",
      "अनामिका से बाईं नासिका बंद कर दाईं से श्वास छोड़ें।",
      "अब दाईं से श्वास लें और बाईं से छोड़ें।"
    ],
    "benefitsEn": [
      "Balances left and right brain hemispheres and calms anxiety.",
      "Improves lung capacity and oxygen flow.",
      "Prepares the mind for deep meditation."
    ],
    "benefitsHi": [
      "इड़ा-पिंगला नाड़ियों को संतुलित कर चिंता व तनाव दूर करता है।",
      "फेफड़ों की कार्यक्षमता और ऑक्सीजन स्तर बढ़ाता है।",
      "गहरे ध्यान के लिए एकाग्रता बढ़ाता है।"
    ],
    "cautionEn": "Never force breath retention; keep breathing smooth.",
    "cautionHi": "श्वास को जबरदस्ती न रोकें; गति सहज रखें।",
    "videoId": "H7g1BMalpdw"
  },
  {
    "id": "kapalbhati",
    "sanskrit": "कपालभाति प्राणायाम",
    "titleEn": "Kapalbhati (Skull-Shining Breath)",
    "titleHi": "कपालभाति प्राणायाम",
    "category": "Pranayama",
    "categoryHi": "प्राणायाम",
    "difficultyEn": "Beginner",
    "difficultyHi": "शुरुआती",
    "duration": "3–5 min",
    "breathEn": "Active, gentle nasal exhales with passive inhales (1 stroke/sec).",
    "breathHi": "पेट अंदर खींचते हुए नाक से सहज झटके से श्वास छोड़ें; श्वास अपने आप अंदर आएगा।",
    "stepGraphics": [
      "sukhasana",
      "kapalbhati",
      "mudra-breath",
      "kapalbhati"
    ],
    "stepsEn": [
      "Sit upright in Sukhasana or Vajrasana with hands on knees in Chin Mudra.",
      "Take a deep breath in, then exhale briskly through the nose by pulling navel inward.",
      "Let inhalation happen passively and effortlessly between strokes.",
      "Practice 20–30 strokes per round (2–3 rounds), resting calmly between rounds."
    ],
    "stepsHi": [
      "सुखासन या वज्रासन में रीढ़ सीधी रखकर बैठें।",
      "गहरा श्वास भरकर पेट को अंदर खींचते हुए नाक से श्वास बाहर छोड़ें।",
      "अगले श्वास को स्वाभाविक रूप से अंदर आने दें।",
      "एक चक्र में 20–30 बार करें और बीच में कुछ सेकंड शांत विश्राम लें।"
    ],
    "benefitsEn": [
      "Energizes metabolism, digestion, and respiratory clarity.",
      "Clears mental sluggishness and refreshes the mind.",
      "Tones abdominal muscles naturally."
    ],
    "benefitsHi": [
      "पाचन तंत्र, चयापचय (Metabolism) और श्वसन मार्ग को शुद्ध करता है।",
      "आलस्य दूर कर मस्तिष्क में ताज़गी व तेज लाता है।",
      "पेट की मांसपेशियों को टोन करता है।"
    ],
    "cautionEn": "Avoid during pregnancy, high blood pressure, hernia, or recent abdominal surgery.",
    "cautionHi": "गर्भावस्था, उच्च रक्तचाप, हर्निया या पेट की सर्जरी में न करें।",
    "videoId": "3Ic032L1aH8"
  }
];
