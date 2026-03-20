const express = require('express');
const router = express.Router();

const messages = {
  english: {
    'Stop Playtime': (name, fav, emotion) => `It's okay ${name}, your toys will wait for you! You played so well today. Let's take a little break now, just like your favourite ${fav} does! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `Hey ${name}, let's make our teeth sparkle! It only takes 2 minutes. Even ${fav} loves a big clean smile! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, we are going on a little adventure! Let's put on our shoes. We will come back home soon, just like ${fav}! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, yummy food is ready! Let's wash our hands first. Eating helps you grow strong, just like ${fav}! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, you did so amazing today! Now it's time to rest. Close your eyes and dream about ${fav}. Goodnight sweetheart! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, you are safe. Everything is okay. Take a slow deep breath with me. In... and out... You are loved!`
  },
  hindi: {
    'Stop Playtime': (name, fav, emotion) => `${name}, कोई बात नहीं! तुम्हारे खिलौने तुम्हारा इंतज़ार करेंगे। आज तुमने बहुत अच्छा खेला। अब थोड़ा आराम करते हैं, जैसे ${fav} करता है! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, चलो दाँत चमकाते हैं! सिर्फ 2 मिनट लगेंगे। ${fav} भी हमेशा साफ मुस्कान पसंद करता है! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, हम एक छोटे से सफर पर जा रहे हैं! जूते पहनो। हम जल्दी वापस आएंगे, जैसे ${fav} आता है! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, खाना तैयार है! पहले हाथ धोते हैं। खाना खाने से तुम ${fav} जैसे ताकतवर बनोगे! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, आज तुमने बहुत अच्छा किया! अब सोने का समय है। आँखें बंद करो और ${fav} के सपने देखो। शुभ रात्रि! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, तुम सुरक्षित हो। सब ठीक है। मेरे साथ धीरे-धीरे सांस लो। अंदर... और बाहर... तुमसे प्यार है!`
  },
  telugu: {
    'Stop Playtime': (name, fav, emotion) => `${name}, పర్వాలేదు! నీ బొమ్మలు నీ కోసం వేచి ఉంటాయి। ఈరోజు చాలా బాగా ఆడావు। ఇప్పుడు కొంచెం విశ్రాంతి తీసుకుందాం, ${fav} లాగా! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, పళ్ళు తోముదాం! కేవలం 2 నిమిషాలు మాత్రమే। ${fav} కూడా అందమైన చిరునవ్వు ఇష్టపడతాడు! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, మనం ఒక చిన్న యాత్రకు వెళ్తున్నాం! చెప్పులు వేసుకో। మనం త్వరగా ఇంటికి వస్తాం, ${fav} లాగా! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, భోజనం సిద్ధంగా ఉంది! ముందు చేతులు కడుక్కుందాం। తినడం వల్ల నువ్వు ${fav} లాగా బలంగా అవుతావు! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, ఈరోజు చాలా బాగా చేశావు! ఇప్పుడు నిద్రపోయే సమయం। కళ్ళు మూసుకో మరియు ${fav} గురించి కలలు కను! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, నువ్వు సురక్షితంగా ఉన్నావు। అన్నీ సరిగ్గా ఉన్నాయి। నాతో మెల్లగా శ్వాస తీసుకో। లోపలికి... బయటికి... నిన్ను ప్రేమిస్తున్నాను!`
  },
  tamil: {
    'Stop Playtime': (name, fav, emotion) => `${name}, பரவாயில்லை! உன் பொம்மைகள் உன்னை காத்திருக்கும். இன்று நீ மிகவும் நன்றாக விளையாடினாய். இப்போது சிறிது ஓய்வு எடுப்போம், ${fav} போல! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, பற்களை துலக்குவோம்! வெறும் 2 நிமிடங்கள் மட்டுமே. ${fav} க்கும் சுத்தமான புன்னகை பிடிக்கும்! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, நாம் ஒரு சிறிய பயணத்திற்கு செல்கிறோம்! காலணிகளை அணிவோம். நாம் விரைவில் வீடு திரும்புவோம், ${fav} போல! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, சாப்பாடு தயார்! முதலில் கைகளை கழுவுவோம். சாப்பிடுவதால் நீ ${fav} போல வலிமையாவாய்! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, இன்று நீ மிகவும் அருமையாக இருந்தாய்! இப்போது தூக்க நேரம். கண்களை மூடி ${fav} பற்றி கனவு காண்பாய். இனிய இரவு! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, நீ பாதுகாப்பாக இருக்கிறாய். எல்லாம் சரியாக இருக்கிறது. என்னுடன் மெதுவாக மூச்சு விடு. உள்ளே... வெளியே... உன்னை நேசிக்கிறேன்!`
  },
  kannada: {
    'Stop Playtime': (name, fav, emotion) => `${name}, ಪರವಾಗಿಲ್ಲ! ನಿನ್ನ ಆಟಿಕೆಗಳು ನಿನಗಾಗಿ ಕಾಯುತ್ತಿರುತ್ತವೆ. ಇಂದು ನೀನು ತುಂಬಾ ಚೆನ್ನಾಗಿ ಆಡಿದೆ. ಈಗ ಸ್ವಲ್ಪ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳೋಣ, ${fav} ರಂತೆ! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, ಹಲ್ಲುಗಳನ್ನು ಉಜ್ಜೋಣ! ಕೇವಲ 2 ನಿಮಿಷಗಳು ಮಾತ್ರ. ${fav} ಗೂ ಸ್ವಚ್ಛ ನಗು ಇಷ್ಟ! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, ನಾವು ಒಂದು ಸಣ್ಣ ಪ್ರಯಾಣಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ! ಚಪ್ಪಲಿ ಹಾಕಿಕೊಳ್ಳಿ. ನಾವು ಬೇಗ ಮನೆಗೆ ಬರುತ್ತೇವೆ, ${fav} ರಂತೆ! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, ಊಟ ತಯಾರಾಗಿದೆ! ಮೊದಲು ಕೈ ತೊಳೆಯೋಣ. ತಿನ್ನುವುದರಿಂದ ನೀನು ${fav} ರಂತೆ ಬಲಶಾಲಿಯಾಗುತ್ತೀಯ! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, ಇಂದು ನೀನು ತುಂಬಾ ಚೆನ್ನಾಗಿ ಮಾಡಿದೆ! ಈಗ ಮಲಗುವ ಸಮಯ. ಕಣ್ಣು ಮುಚ್ಚಿ ${fav} ಬಗ್ಗೆ ಕನಸು ಕಾಣು. ಶುಭ ರಾತ್ರಿ! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, ನೀನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀಯ. ಎಲ್ಲವೂ ಸರಿಯಾಗಿದೆ. ನನ್ನೊಂದಿಗೆ ನಿಧಾನವಾಗಿ ಉಸಿರಾಡು. ಒಳಗೆ... ಹೊರಗೆ... ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ!`
  },
  malayalam: {
    'Stop Playtime': (name, fav, emotion) => `${name}, സാരമില്ല! നിന്റെ കളിപ്പാട്ടങ്ങൾ നിന്നെ കാത്തിരിക്കും. ഇന്ന് നീ വളരെ നന്നായി കളിച്ചു. ഇപ്പോൾ അൽപം വിശ്രമിക്കാം, ${fav} പോലെ! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, പല്ലുകൾ തേക്കാം! വെറും 2 മിനിറ്റ് മാത്രം. ${fav} നും വൃത്തിയുള്ള പുഞ്ചിരി ഇഷ്ടമാണ്! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, നമ്മൾ ഒരു ചെറിയ യാത്രക്ക് പോകുന്നു! ചെരുപ്പ് ഇടുക. നമ്മൾ വേഗം വീട്ടിൽ തിരിച്ചെത്തും, ${fav} പോലെ! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, ഭക്ഷണം തയ്യാർ! ആദ്യം കൈ കഴുകാം. കഴിക്കുന്നതിലൂടെ നീ ${fav} പോലെ ശക്തനാകും! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, ഇന്ന് നീ വളരെ നന്നായി ചെയ്തു! ഇപ്പോൾ ഉറങ്ങേണ്ട സമയം. കണ്ണുകൾ അടയ്ക്കുക, ${fav} നെ കുറിച്ച് സ്വപ്നം കാണൂ. ശുഭ രാത്രി! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, നീ സുരക്ഷിതനാണ്. എല്ലാം ശരിയാണ്. എന്നോടൊപ്പം പതുക്കെ ശ്വസിക്കൂ. അകത്തേക്ക്... പുറത്തേക്ക്... നിന്നെ സ്നേഹിക്കുന്നു!`
  },
  marathi: {
    'Stop Playtime': (name, fav, emotion) => `${name}, काळजी नको! तुझी खेळणी तुझी वाट पाहतील. आज तू खूप छान खेळलास. आता थोडी विश्रांती घेऊया, ${fav} सारखे! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, दात घासूया! फक्त 2 मिनिटे लागतात. ${fav} लाही स्वच्छ हास्य आवडते! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, आपण एका छोट्या सहलीला जात आहोत! बूट घालूया. आपण लवकरच घरी परत येऊ, ${fav} सारखे! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, जेवण तयार आहे! आधी हात धुऊया. जेवल्याने तू ${fav} सारखा बलवान होशील! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, आज तू खूप छान केलेस! आता झोपण्याची वेळ आहे. डोळे मिट आणि ${fav} बद्दल स्वप्न बघ. शुभ रात्री! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, तू सुरक्षित आहेस. सर्व ठीक आहे. माझ्यासोबत हळूहळू श्वास घे. आत... आणि बाहेर... तुझ्यावर प्रेम आहे!`
  },
  gujarati: {
    'Stop Playtime': (name, fav, emotion) => `${name}, કોઈ વાંધો નહીં! તારા રમકડાં તારી રાહ જોશે. આજે તેં ખૂબ સારું રમ્યો. હવે થોડો આરામ કરીએ, ${fav} ની જેમ! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, દાંત સાફ કરીએ! માત્ર 2 મિનિટ જ. ${fav} ને પણ સ્વચ્છ સ્મિત ગમે છે! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, આપણે એક નાની સફર પર જઈ રહ્યા છીએ! જૂતાં પહેરીએ. આપણે જલ્દી ઘરે આવીશું, ${fav} ની જેમ! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, ખાવાનું તૈયાર છે! પહેલા હાથ ધોઈએ. ખાવાથી તું ${fav} ની જેમ મજબૂત બનીશ! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, આજે તેં ખૂબ સારું કર્યું! હવે સૂવાનો સમય છે. આંખો બંધ કર અને ${fav} ના સપના જો. શુભ રાત્રિ! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, તું સુરક્ષિત છે. બધું ઠીક છે. મારી સાથે ધીમે ધીમે શ્વાસ લે. અંદર... અને બહાર... તને પ્રેમ છે!`
  },
  bengali: {
    'Stop Playtime': (name, fav, emotion) => `${name}, চিন্তা নেই! তোমার খেলনাগুলো তোমার জন্য অপেক্ষা করবে। আজ তুমি খুব ভালো খেলেছ। এখন একটু বিশ্রাম নেই, ${fav} এর মতো! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, দাঁত মাজি! মাত্র ২ মিনিট লাগবে। ${fav} ও পরিষ্কার হাসি পছন্দ করে! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, আমরা একটা ছোট্ট ভ্রমণে যাচ্ছি! জুতো পরো। আমরা শীঘ্রই বাড়ি ফিরব, ${fav} এর মতো! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, খাবার তৈরি! আগে হাত ধুই। খেলে তুমি ${fav} এর মতো শক্তিশালী হবে! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, আজ তুমি অসাধারণ ছিলে! এখন ঘুমানোর সময়। চোখ বন্ধ করো আর ${fav} এর স্বপ্ন দেখো। শুভ রাত্রি! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, তুমি নিরাপদ। সব ঠিক আছে। আমার সাথে ধীরে ধীরে শ্বাস নাও। ভেতরে... বাইরে... তোমাকে ভালোবাসি!`
  },
  punjabi: {
    'Stop Playtime': (name, fav, emotion) => `${name}, ਕੋਈ ਗੱਲ ਨਹੀਂ! ਤੇਰੇ ਖਿਡੌਣੇ ਤੇਰਾ ਇੰਤਜ਼ਾਰ ਕਰਨਗੇ। ਅੱਜ ਤੂੰ ਬਹੁਤ ਵਧੀਆ ਖੇਡਿਆ। ਹੁਣ ਥੋੜਾ ਆਰਾਮ ਕਰੀਏ, ${fav} ਵਾਂਗੂ! ${emotion}`,
    'Brush Teeth': (name, fav, emotion) => `${name}, ਦੰਦ ਸਾਫ਼ ਕਰੀਏ! ਸਿਰਫ਼ 2 ਮਿੰਟ ਲੱਗਣਗੇ। ${fav} ਨੂੰ ਵੀ ਸਾਫ਼ ਮੁਸਕਾਨ ਪਸੰਦ ਹੈ! ${emotion}`,
    'Leave House': (name, fav, emotion) => `${name}, ਅਸੀਂ ਇੱਕ ਛੋਟੀ ਸੈਰ ਤੇ ਜਾ ਰਹੇ ਹਾਂ! ਜੁੱਤੇ ਪਾਓ। ਅਸੀਂ ਜਲਦੀ ਘਰ ਵਾਪਸ ਆਵਾਂਗੇ, ${fav} ਵਾਂਗੂ! ${emotion}`,
    'Eat Food': (name, fav, emotion) => `${name}, ਖਾਣਾ ਤਿਆਰ ਹੈ! ਪਹਿਲਾਂ ਹੱਥ ਧੋਈਏ। ਖਾਣ ਨਾਲ ਤੂੰ ${fav} ਵਾਂਗੂ ਤਾਕਤਵਰ ਬਣੇਗਾ! ${emotion}`,
    'Bedtime': (name, fav, emotion) => `${name}, ਅੱਜ ਤੂੰ ਬਹੁਤ ਵਧੀਆ ਕੀਤਾ! ਹੁਣ ਸੌਣ ਦਾ ਸਮਾਂ ਹੈ। ਅੱਖਾਂ ਬੰਦ ਕਰ ਅਤੇ ${fav} ਬਾਰੇ ਸੁਪਨੇ ਦੇਖ. ਸ਼ੁਭ ਰਾਤ! ${emotion}`,
    'calm down, everything is okay': (name) => `${name}, ਤੂੰ ਸੁਰੱਖਿਅਤ ਹੈ। ਸਭ ਠੀਕ ਹੈ। ਮੇਰੇ ਨਾਲ ਹੌਲੀ ਹੌਲੀ ਸਾਹ ਲੈ। ਅੰਦਰ... ਅਤੇ ਬਾਹਰ... ਤੈਨੂੰ ਪਿਆਰ ਹੈ!`
  }
}

const storyTemplates = {
  english: (name, fav) => `Once upon a time, there was a brave child named ${name}. ${name} had a very special friend, a ${fav}. One day, ${name} and ${fav} went on a grand adventure to the Land of Calm. They learned that even when things change, like bedtime or leaving the house, they are always safe and loved. The end.`,
  hindi: (name, fav) => `एक समय की बात है, ${name} नाम का एक बहादुर बच्चा था। ${name} का एक बहुत ही खास दोस्त था, एक ${fav}। एक दिन, ${name} और ${fav} शांति की भूमि की एक बड़ी साहসিক यात्रा पर गए। उन्होंने सीखा कि जब चीज़ें बदलती हैं, जैसे सोने का समय या घर से बाहर जाना, तब भी वे हमेशा सुरक्षित और प्यार भरे होते हैं। समाप्त।`,
  telugu: (name, fav) => `అనగనగా ఒకానొక కాలంలో, ${name} అనే ధైర్యవంతుడైన బిడ్డ ఉండేవాడు. ${name} కి ఒక ప్రత్యేక స్నేహితుడు ఉన్నాడు, అది ఒక ${fav}. ఒకరోజు, ${name} మరియు ${fav} ప్రశాంతత రాజ్యానికి ఒక గొప్ప साహసయాత్రకు వెళ్లారు. పడుకునే సమయం లేదా ఇంటి నుండి బయలుదేరడం వంటి మార్పులు జరిగినప్పుడు కూడా, వారు ఎల్లప్పుడూ సురక్షితంగా మరియు ప్రేమించబడతారని వారు తెలుంగున్నారు. సమాప్తం.`,
  tamil: (name, fav) => `முன்னொரு காலத்தில், ${name} என்ற ஒரு தைரியமான குழந்தை இருந்தது. ${name}-க்கு ஒரு மிகச் சிறந்த நண்பன் இருந்தான், அது ஒரு ${fav}. ஒரு நாள், ${name} மற்றும் ${fav} அமைதி நிலத்திற்கு ஒரு பெரிய சாகசப் பயணத்தை மேற்கொண்டனர். தூங்கும் நேரம் அல்லது வீட்டை விட்டு வெளியேறுவது போன்ற மாற்றங்கள் ஏற்படும் போதும், அவர்கள் எப்போதும் பாதுகாப்பாகவும் அன்பாகவும் இருப்பார்கள் என்பதை அவர்கள் கற்றுக்கொண்டனர். முற்றிற்று.`,
  kannada: (name, fav) => `ಒಂದಾನೊಂದು ಕಾಲದಲ್ಲಿ, ${name} ಎಂಬ ಧೈರ್ಯಶಾಲಿ ಮಗು ಇತ್ತು. ${name} ನಿಗೆ ಒಬ್ಬ ವಿಶೇಷ ಸ್ನೇಹಿತನಿದ್ದನು, ಅದು ಒಂದು ${fav}. ಒಂದು ದಿನ, ${name} ಮತ್ತು ${fav} ಶಾಂತಿಯ ನಾಡಿಗೆ ಒಂದು ದೊಡ್ಡ ಸಾಹಸಯಾತ್ರೆಕ್ಕೆ ಹೋದರು. ಮಲಗುವ ಸಮಯ ಅಥವಾ ಮನೆಯಿಂದ ಹೊರಡುವುದು ಮುಂತಾದ ಬದಲಾವಣೆಗಳು ಉಂಟಾದಾಗಲೂ, ಅವರು ಯಾವಾಗಲೂ ಸುರಕ್ಷಿತವಾಗಿ ಮತ್ತು ಪ್ರೀತಿಯಿಂದ ಇರುತ್ತಾರೆ ಎಂದು ಅವರು ಕಲಿತರು. ಮುಕ್ತಾಯ.`,
  malayalam: (name, fav) => `ഒരിക്കൽ, ${name} എന്ന് പേരുള്ള ധീരനായ ഒരു കുട്ടിയുണ്ടായിരുന്നു. ${name}-ന് വളരെ സവിശേഷനായ ഒരു സുഹൃത്തുണ്ടായിരുന്നു, ഒരു ${fav}. ഒരു ദിവസം, ${name}-ഉം ${fav}-ഉം ശാന്തിയുടെ നാട്ടിലേക്ക് ഒരു വലിയ സാഹസിക യാത്ര പോയി. ഉറങ്ങുന്ന സമയമോ വീട് വിട്ടുപോകുന്നതോ പോലുള്ള മാറ്റങ്ങൾ സംഭവിക്കുമ്പോഴും തങ്ങൾ എപ്പോഴും സുരക്ഷിതരും സ്നേഹിക്കപ്പെടുന്നവരുമാണെന്ന് അവർ മനസ്സിലാക്കി. സമാപ്തം.`,
  marathi: (name, fav) => `एका काळी, ${name} नावाचा एक शूर मुलगा होता. ${name} चा एक खूप खास मित्र होता, एक ${fav}. एके दिवशी, ${name} आणि ${fav} शांततेच्या भूमीच्या एका मोठ्या साहसी मोहिमेवर गेले. त्यांनी शिकले की जेव्हा गोष्टी बदलतात, जसे की झोपण्याची वेळ किंवा घरातून बाहेर जाणे, तेव्हाही ते नेहमी सुरक्षित आणि प्रेमळ असतात. समाप्त।`,
  gujarati: (name, fav) => `એક સમયે, ${name} નામનો એક બહાદુર બાળક હતો. ${name} ને એક ખૂબ જ ખાસ મિત્ર હતો, એક ${fav}. એક દિવસ, ${name} અને ${fav} શાંતિની ભૂમિની એક મોટી સાહસિક યાત્રા પર ગયા. તેઓએ શીખ્યું કે જ્યારે વસ્તુઓ બદલાય છે, જેમ કે સૂવાનો સમય અથવા ઘરની બહાર જવું, ત્યારે પણ તેઓ હંમેશા સુરક્ષિત અને પ્રેમભર્યા હોય છે. સમાપ્ત.`,
  bengali: (name, fav) => `একদা এক সময়ে, ${name} নামে এক সাহসী শিশু ছিল। ${name}-এর এক খুব বিশেষ বন্ধু ছিল, একটি ${fav}। একদিন, ${name} এবং ${fav} শান্তির দেশে এক বড় অভিযানে গেল। তারা শিখল যে যখন জিনিসগুলো বদলে যায়, যেমন ঘুমানোর সময় বা বাড়ি থেকে বের হওয়া, তখনও তারা সবসময় নিরাপদ এবং ভালোবাসায় ঘেরা থাকে। সমাপ্ত।`,
  punjabi: (name, fav) => `ਇੱਕ ਸਮੇਂ ਦੀ ਗੱਲ ਹੈ, ${name} ਨਾਂ ਦਾ ਇੱਕ ਬਹਾਦਰ ਬੱਚਾ ਸੀ। ${name} ਦਾ ਇੱਕ ਬਹੁਤ ਹੀ ਖਾਸ ਦੋਸਤ ਸੀ, ਇੱਕ ${fav}। ਇੱਕ ਦਿਨ, ${name} ਅਤੇ ${fav} ਸ਼ਾਂਤੀ ਦੀ ਧਰਤੀ ਦੀ ਇੱਕ ਵੱਡੀ ਸਾਹਸੀ ਯਾਤਰਾ ਤੇ ਗਏ। ਉਨ੍ਹਾਂ ਨੇ ਸਿੱਖਿਆ ਕਿ ਜਦੋਂ ਚੀਜ਼ਾਂ ਬਦਲਦੀਆਂ ਹਨ, ਜਿਵੇਂ ਕਿ ਸੌਣ ਦਾ ਸਮਾਂ ਜਾਂ ਘਰ ਤੋਂ ਬਾਹਰ ਜਾਣਾ, ਉਦੋਂ ਵੀ ਉਹ ਹਮੇਸ਼ਾ ਸੁਰੱਖਿਅਤ ਅਤੇ ਪਿਆਰ ਭਰੇ ਹੁੰਦੇ ਹਨ। ਸਮਾਪਤ।`
}

const emotionMessages = {
  english: { Happy: 'You are doing great!', Sad: 'It is okay to feel sad. I am here with you.', Angry: 'Take a deep breath. Everything will be okay.', Scared: 'You are safe. I am right here with you.', Tired: 'You can rest soon. Just one more thing.', Neutral: '' },
  hindi: { Happy: 'तुम बहुत अच्छा कर रहे हो!', Sad: 'उदास होना ठीक है। मैं तुम्हारे साथ हूँ।', Angry: 'गहरी साँस लो। सब ठीक हो जाएगा।', Scared: 'तुम सुरक्षित हो। मैं यहाँ हूँ।', Tired: 'तुम जल्दी आराम कर सकते हो।', Neutral: '' },
  telugu: { Happy: 'నువ్వు చాలా బాగా చేస్తున్నావు!', Sad: 'దుఃఖంగా అనిపించడం సరే. నేను నీతో ఉన్నాను।', Angry: 'నెమ్మదిగా శ్వాస తీసుకో. అన్నీ సరిగ్గా అవుతాయి।', Scared: 'నువ్వు సురక్షితంగా ఉన్నావు।', Tired: 'నువ్వు త్వరలో విశ్రాంతి తీసుకోవచ్చు।', Neutral: '' },
  tamil: { Happy: 'நீ மிகவும் நன்றாக செய்கிறாய்!', Sad: 'சோகமாக உணர்வது சரிதான். நான் உன்னுடன் இருக்கிறேன்.', Angry: 'ஆழமாக சுவாசி. எல்லாம் சரியாகும்.', Scared: 'நீ பாதுகாப்பாக இருக்கிறாய்.', Tired: 'நீ விரைவில் ஓய்வெடுக்கலாம்.', Neutral: '' },
  kannada: { Happy: 'ನೀನು ತುಂಬಾ ಚೆನ್ನಾಗಿ ಮಾಡುತ್ತಿದ್ದೀಯ!', Sad: 'ದುಃಖ ಅನಿಸುವುದು ಸರಿಯಾಗಿದೆ. ನಾನು ನಿನ್ನ ಜೊತೆ ಇದ್ದೇನೆ.', Angry: 'ನಿಧಾನವಾಗಿ ಉಸಿರಾಡು. ಎಲ್ಲಾ ಸರಿಯಾಗುತ್ತದೆ.', Scared: 'ನೀನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀಯ.', Tired: 'ನೀನು ಶೀಘ್ರದಲ್ಲೇ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಬಹುದು.', Neutral: '' },
  malayalam: { Happy: 'നീ വളരെ നന്നായി ചെയ്യുന്നു!', Sad: 'സങ്കടം തോന്നുന്നത് ശരിയാണ്. ഞാൻ നിന്നോടൊപ്പമുണ്ട്.', Angry: 'പതുക്കെ ശ്വസിക്കൂ. എല്ലാം ശരിയാകും.', Scared: 'നീ സുരക്ഷിതനാണ്.', Tired: 'നിനക്ക് ഉടൻ വിശ്രമിക്കാം.', Neutral: '' },
  marathi: { Happy: 'तू खूप छान करतोयस!', Sad: 'दुःखी वाटणे ठीक आहे. मी तुझ्यासोबत आहे.', Angry: 'खोल श्वास घे. सर्व ठीक होईल.', Scared: 'तू सुरक्षित आहेस.', Tired: 'तू लवकरच आराम करू शकतोस.', Neutral: '' },
  gujarati: { Happy: 'તું ખૂબ સારું કરી રહ્યો છે!', Sad: 'દુઃખ લાગવું ઠીક છે. હું તારી સાથે છું.', Angry: 'ઊંડો શ્વાસ લે. બધું ઠીક થઈ જશે.', Scared: 'તું સુરક્ષિત છે.', Tired: 'તું ટૂંક સમયમાં આરામ કરી શકે છે.', Neutral: '' },
  bengali: { Happy: 'তুমি খুব ভালো করছ!', Sad: 'দুঃখ পাওয়া ঠিক আছে। আমি তোমার সাথে আছি।', Angry: 'গভীরভাবে শ্বাস নাও। সব ঠিক হয়ে যাবে।', Scared: 'তুমি নিরাপদ।', Tired: 'তুমি শীঘ্রই বিশ্রাম নিতে পারবে।', Neutral: '' },
  punjabi: { Happy: 'ਤੂੰ ਬਹੁਤ ਵਧੀਆ ਕਰ ਰਿਹਾ ਹੈਂ!', Sad: 'ਉਦਾਸ ਹੋਣਾ ਠੀਕ ਹੈ। ਮੈਂ ਤੇਰੇ ਨਾਲ ਹਾਂ।', Angry: 'ਡੂੰਘਾ ਸਾਹ ਲੈ। ਸਭ ਠੀਕ ਹੋ ਜਾਵੇਗਾ।', Scared: 'ਤੂੰ ਸੁਰੱਖਿਅਤ ਹੈਂ।', Tired: 'ਤੂੰ ਜਲਦੀ ਆਰਾਮ ਕਰ ਸਕਦਾ ਹੈਂ।', Neutral: '' }
}

const axios = require('axios');

router.post('/', async (req, res) => {
  const { childName, favoriteThing, transition, language = 'english', emotionContext = '', isStory = false, isSocialStory = false, age, situation } = req.body

  if (isStory && isSocialStory) {
    try {
      const prompt = `Write a short, therapeutic 4-step "Social Story" in ${language} for a ${age} year old child named ${childName} who is preparing for the situation: "${situation || "a new experience"}". 
      
      Requirements:
      1. Each step MUST be exactly 1-2 sentences.
      2. Use a very calming, reassuring, and supportive tone.
      3. Use the child's perspective (e.g., "I can do it").
      4. Format as a clean numbered list (1..4).
      5. Do NOT add any intro or extro text. Just the 4 steps.`

      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      }, {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      });

      const script = response.data.content[0].text;
      return res.json({ script });
    } catch (err) {
      console.error('AI Generation Error:', err.response?.data || err.message);
      return res.status(500).json({ error: 'AI story generation failed' });
    }
  }

  // AI BUDDY CHAT
  if (req.body.isBuddy) {
    const { userMessage, history = [] } = req.body;
    try {
      const systemPrompt = `You are "Anchor Buddy", a world-class therapeutic AI companion for a ${age} year old child named ${childName} who has Autism. 
      Your purpose is to provide emotional regulation support, social skills training, and predictable, calming companionship.
      
      THERAPEUTIC GUIDELINES:
      - Use "Social Thinking" concepts: explain things in terms of "Expected" and "Unexpected" behaviors if appropriate.
      - Praise frequently: Use phrases like "I love how you are sharing your feelings!" or "You are doing amazing."
      - Direct & Simple: Avoid metaphors, sarcasm, or ambiguous language.
      - Favorite Thing: Their special interest is ${favoriteThing}. Use this to build rapport and motivation (e.g., "Just like ${favoriteThing}, you are so strong!").
      - Sensory Awareness: If the child seems overwhelmed, suggest a "Sensory Break" or "Deep Pressure" (like a hug).
      - Language: ONLY respond in ${language}.
      
      CONVERSATION STYLE:
      - Short, manageable sentences (max 3).
      - Always end with a gentle question or encouragement.
      - Model "First/Then" language for routines if they ask what to do.`;

      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [...history, { role: "user", content: userMessage }]
      }, {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      });

      const reply = response.data.content[0].text;
      return res.json({ reply });
    } catch (err) {
      console.error('AI Buddy Error:', err.response?.data || err.message);
      return res.status(500).json({ error: 'Buddy is taking a sensory break. Try again soon!' });
    }
  }

  if (isStory) {
    const storyFn = storyTemplates[language] || storyTemplates['english']
    const script = storyFn(childName, favoriteThing)
    return res.json({ script })
  }

  const langMessages = messages[language] || messages['english']
  const langEmotions = emotionMessages[language] || emotionMessages['english']
  
  const emotionLabel = emotionContext.includes('Happy') ? 'Happy'
    : emotionContext.includes('Sad') ? 'Sad'
    : emotionContext.includes('Angry') ? 'Angry'
    : emotionContext.includes('Scared') ? 'Scared'
    : emotionContext.includes('Tired') ? 'Tired'
    : 'Neutral'

  const emotionSuffix = langEmotions[emotionLabel] || ''
  const msgFn = langMessages[transition] || langMessages['calm down, everything is okay']
  const script = msgFn(childName, favoriteThing, emotionSuffix)

  res.json({ script })
})

module.exports = router