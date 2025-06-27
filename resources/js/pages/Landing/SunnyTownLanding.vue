<template>
  <div class="bg-gray-900 text-white min-h-screen font-sans antialiased overflow-x-hidden" @mousemove="handleMouseMove">
    <!-- Header avec stats en temps réel -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#182c55]/95 backdrop-blur-sm shadow-lg border-b-2 border-yellow-400/30">
      <nav class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <a href="#home" class="text-yellow-200 hover:text-white transition-colors font-bold text-lg">
              ACCUEIL
            </a>
            <a href="#features" class="text-yellow-200 hover:text-white transition-colors">
              JEU
            </a>
            <a href="#community" class="text-yellow-200 hover:text-white transition-colors">
              COMMUNAUTÉ
            </a>
            <a href="#forum" class="text-yellow-200 hover:text-white transition-colors">
              FORUM
            </a>
          </div>
          
          <div class="hidden md:flex items-center space-x-4 text-sm">
            <div 
              class="flex items-center space-x-1 bg-yellow-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-yellow-600/30 hover:scale-105"
              @click="handleResourceClick('coins', $event)"
            >
              <img src="/images/coin-icon.png" alt="Pièces" class="w-4 h-4 pixelated" />
              <span class="text-yellow-200 font-mono">{{ coins.toLocaleString() }}</span>
            </div>
            <div 
              class="flex items-center space-x-1 bg-green-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-green-600/30 hover:scale-105"
              @click="handleResourceClick('population', $event)"
            >
              <img src="/images/people-icon.png" alt="Population" class="w-4 h-4 pixelated" />
              <span class="text-green-200 font-mono">{{ population.toLocaleString() }}</span>
            </div>
            <div 
              class="flex items-center space-x-1 bg-blue-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-600/30 hover:scale-105"
              @click="handleResourceClick('happiness', $event)"
            >
              <img src="/images/happiness-icon.png" alt="Bonheur" class="w-4 h-4 pixelated" />
              <span class="text-blue-200 font-mono">{{ happiness }}%</span>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <a :href="props.social_links?.twitter || '#'" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter class="w-5 h-5 text-yellow-200 cursor-pointer transition-all duration-300 ease-out hover:text-white hover:scale-120" />
            </a>
            <a :href="props.social_links?.facebook || '#'" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook class="w-5 h-5 text-yellow-200 cursor-pointer transition-all duration-300 ease-out hover:text-white hover:scale-120" />
            </a>
            <a :href="props.social_links?.discord || '#'" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <MessageCircle class="w-5 h-5 text-yellow-200 cursor-pointer transition-all duration-300 ease-out hover:text-white hover:scale-120" />
            </a>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero Section -->
      <section id="home" class="relative h-screen min-h-[700px] overflow-hidden flex flex-col items-center justify-center pt-16">
        <div 
          class="parallax-bg animated-bg-pan absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-75"
          :style="{ transform: `translateY(${parallax.bg}px)`, backgroundImage: 'url(\'/images/pixel_art_large 1.png\')' }"
        />
        
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="cloud absolute text-white/20 text-6xl" :style="cloud1Style">☁️</div>
          <div class="cloud absolute text-white/30 text-4xl" :style="cloud2Style">☁️</div>
          <div class="cloud absolute text-white/20 text-5xl" :style="cloud3Style">☁️</div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10"></div>

        <div 
          class="relative z-20 mt-10 px-4 text-center"
          :style="{ transform: `translateY(${parallax.logo}px)` }"
        >
          <div class="relative">
            <img 
              src="/images/logo sunnytown.svg" 
              alt="SunnyTown Logo" 
              class="animated-logo w-[300px] h-auto sm:w-[500px] md:w-[650px] mx-auto drop-shadow-2xl" 
            />
            <div class="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-pulse-slow"></div>
            
            <div class="absolute inset-0 pointer-events-none">
              <div class="sparkle sparkle-1 absolute text-yellow-400 pointer-events-none text-lg">✨</div>
              <div class="sparkle sparkle-2 absolute text-yellow-400 pointer-events-none text-base">⭐</div>
              <div class="sparkle sparkle-3 absolute text-yellow-400 pointer-events-none text-xl">💫</div>
              <div class="sparkle sparkle-4 absolute text-yellow-400 pointer-events-none text-sm">🌟</div>
              <div class="sparkle sparkle-5 absolute text-yellow-400 pointer-events-none text-lg">✨</div>
              <div class="sparkle sparkle-6 absolute text-yellow-400 pointer-events-none text-base">⭐</div>
            </div>
          </div>
          
          <p class="text-yellow-100 text-xl md:text-2xl mt-6 font-semibold drop-shadow-lg animate-fade-in-up">
            🚜 Votre aventure idle commence ici ! 🌾
          </p>

          <a href="#play" class="mt-10 inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-[#5a3d2b] font-bold text-xl px-10 py-4 rounded-lg shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-300 animate-fade-in-up animation-delay-700">
            Jouer Maintenant !
          </a>
          
          <div class="mt-12 w-full max-w-md mx-auto animate-fade-in-up animation-delay-1000">
            <div class="flex items-center justify-between text-yellow-200 text-sm mb-2">
              <span>🌱 Progression automatique</span>
              <span>{{ autoProgress }}%</span>
            </div>
            <div class="w-full bg-black/30 rounded-full h-3 border-2 border-yellow-400/50">
              <div 
                class="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all duration-150 ease-linear"
                :style="{ width: `${autoProgress}%` }"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Game Feature Sections -->
      <div id="features" class="bg-black py-10">
        <GameFeatureSection
          v-for="(feature, index) in gameFeaturesData"
          :key="index"
          :title="feature.title"
          :text="feature.text"
          :image-url="feature.imageUrl"
          :image-alt="feature.imageAlt"
          :align="feature.align"
          :scrollY="scrollY"
          class="needs-fade-in"
        />
      </div>

      <!-- Community Section -->
      <section id="community" class="bg-[#1a202c] py-16 needs-fade-in">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold text-amber-300 mb-6 uppercase" style="font-family: 'Georgia', 'Times New Roman', serif;">Rejoignez Notre Communauté !</h2>
          <p class="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Partagez vos astuces, montrez vos villes et discutez avec d'autres maires de SunnyTown !
          </p>
          <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a :href="props.social_links?.discord || '#'" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto bg-indigo-500 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-md transition-all duration-300 ease-out hover:bg-indigo-600 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
              <MessageCircle class="w-6 h-6" />
              <span>Rejoindre Discord</span>
            </a>
            <a :href="props.social_links?.forum || '#'" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto bg-green-500 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-md transition-all duration-300 ease-out hover:bg-green-600 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
              <Users class="w-6 h-6" />
              <span>Visiter le Forum</span>
            </a>
          </div>
        </div>
      </section>

    </main>

    <footer class="bg-[#182c55] text-yellow-200 py-8 border-t-2 border-yellow-400/20">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} SunnyTown. Tous droits réservés.</p>
        <div class="mt-4 space-x-4">
          <a href="#" class="transition-colors duration-300 ease-out hover:text-white">Politique de confidentialité</a>
          <a href="#" class="transition-colors duration-300 ease-out hover:text-white">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>

    <button v-if="showBackToTop" @click="scrollToTop" 
            class="fixed bottom-5 right-5 bg-yellow-500 text-[#5a3d2b] p-3 rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-yellow-600 hover:scale-110 focus:outline-none z-40">
      <ArrowUp class="w-6 h-6" />
    </button>

    <div id="particle-container" class="fixed inset-0 pointer-events-none z-[100]">
      <div v-for="particle in particles" :key="particle.id"
           :style="{ top: particle.y + 'px', left: particle.x + 'px' }"
           class="particle absolute select-none pointer-events-none" 
           :class="particle.type === 'coins' ? 'text-yellow-400 text-2xl' : 
                    particle.type === 'population' ? 'text-green-400 text-2xl' : 
                    'text-blue-400 text-2xl'">
        {{ particle.emoji }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import { Twitter, Facebook, MessageCircle, ArrowUp, Users } from 'lucide-vue-next';
import GameFeatureSection from '../../components/GameFeatureSection.vue'; // Assurez-vous que le chemin est correct

const props = defineProps({
  meta: Object,
  stats: Object,
  features: Array, // Cette prop n'est pas utilisée actuellement, envisagez de l'utiliser ou de la supprimer
  gameplay_features: Array, // Idem
  social_links: {
    type: Object,
    default: () => ({
      twitter: '#',
      facebook: '#',
      discord: '#',
      forum: '#'
    })
  },
});

const scrollY = ref(0);
const coins = ref(props.stats?.active_players ? parseFloat(props.stats.active_players.replace(/\D/g, '')) / 100 : 12345);
const population = ref(props.stats?.cities_created ? parseFloat(props.stats.cities_created.replace(/\D/g, '')) / 1000 : 876);
const happiness = ref(props.stats?.happiness || 92);
const autoProgress = ref(0);
const parallax = ref({ bg: 0, logo: 0 });
const showBackToTop = ref(false);
const particles = ref([]);
let particleId = 0;

// Mouse move parallax for clouds
const mousePos = reactive({ x: 0, y: 0 });
const cloudParallaxStrength = 0.01;

const cloud1Style = computed(() => ({
  top: '15%', left: '10%',
  transform: `translate(${mousePos.x * cloudParallaxStrength}px, ${mousePos.y * cloudParallaxStrength}px) scale(1.0)`,
  transition: 'transform 0.2s ease-out',
  animation: 'cloud-float 20s ease-in-out infinite alternate'
}));
const cloud2Style = computed(() => ({
  top: '25%', right: '15%',
  transform: `translate(${mousePos.x * cloudParallaxStrength * 0.8}px, ${mousePos.y * cloudParallaxStrength * 0.8}px) scale(0.8)`,
  transition: 'transform 0.2s ease-out',
  animation: 'cloud-float 25s ease-in-out infinite alternate 1s'
}));
const cloud3Style = computed(() => ({
  top: '30%', left: '35%',
  transform: `translate(${mousePos.x * cloudParallaxStrength * 1.2}px, ${mousePos.y * cloudParallaxStrength * 1.2}px) scale(0.9)`,
  transition: 'transform 0.2s ease-out',
  animation: 'cloud-float 30s ease-in-out infinite alternate 0.5s'
}));


const gameFeaturesData = ref([
  {
    title: "UNE VILLE QUI PROSPÈRE ⛏️🌳🌾",
    text: `Prenez un peu d'habileté de bûcheron, un zeste d'agriculture tranquille et un chouïa de simulation de magnat, puis mélangez le tout... et qu'est-ce que vous obtenez ? SunnyTown, pardi !\n\nNi une ni deux, munissez-vous de vos outils de prédilection et lancez-vous dans l'abattage de bois, l'extraction de minerais et la récolte de cultures pour les transformer en biens précieux !`,
    imageUrl: "/images/frame 313.png",
    imageAlt: "Une ville prospère dans SunnyTown",
    align: "left",
  },
  {
    title: "UN JEU QUI A DU POTENTIEL ✨",
    text: `🎯 Votre objectif est simple : collecter des ressources pour préparer des produits que vous vendrez dans votre ville.\n\n🏞️ Graphismes captivants : Abattre des arbres, miner des roches et récolter des champs n'a jamais été aussi agréable à regarder et à écouter !\n\n🏘️ Bâtissez votre empire : mettez tout en œuvre pour devenir le magnat suprême de SunnyTown !`,
    imageUrl: "/images/Frame 613.png", // Note: this image is used twice, consider variety
    imageAlt: "Potentiel de jeu et graphismes captivants",
    align: "right",
  },
  {
    title: "ÇA VA ÊTRE PRODUCTIF 🌱🏭💰",
    text: `Mettez à rude épreuve votre sens de la gestion pour devenir le n° 1 des magnats de SunnyTown ! Collectez les ressources, maîtrisez le côté commercial en recrutant des habitants et en vendant vos produits finis, histoire de vous faire un petit pactole.`,
    imageUrl: "/images/fond.jpg", // Changed to fond2.jpg for variety, ensure this image exists
    imageAlt: "Gameplay productif et gestion de ville",
    align: "left",
  },
]);

const handleScroll = () => {
  scrollY.value = window.scrollY;
  parallax.value.bg = scrollY.value * 0.25; // Adjusted parallax speed
  parallax.value.logo = scrollY.value * 0.4; // Adjusted parallax speed
  showBackToTop.value = scrollY.value > 300;
};

const handleMouseMove = (event) => {
  mousePos.x = (event.clientX - window.innerWidth / 2);
  mousePos.y = (event.clientY - window.innerHeight / 2);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleResourceClick = (type, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const emojiMap = { coins: '💰', population: '🧑‍🌾', happiness: '😊' };
  for (let i = 0; i < 5; i++) { // Create 5 particles
    particles.value.push({
      id: particleId++,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width,
      y: rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height,
      emoji: emojiMap[type],
      type: type
    });
  }
  // Remove particles after animation
  setTimeout(() => {
    // This logic might remove particles too early if clicks are rapid.
    // A better way is to filter by age or a specific flag on the particle.
    // For now, keeping it simple:
    particles.value = particles.value.filter(p => Date.now() - p.id < 1000); // Assuming id is timestamp or similar
  }, 1000);
};

const observer = ref(null);
const observedElements = ref([]);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Mouse move listener for cloud parallax is on the main div

  const intervals = [];
  intervals.push(setInterval(() => { coins.value += Math.floor(Math.random() * 3) + 1; }, 2000));
  intervals.push(setInterval(() => { population.value += Math.random() > 0.7 ? 1 : 0; }, 5000));
  intervals.push(setInterval(() => { happiness.value = Math.min(100, Math.max(0, happiness.value + (Math.random() > 0.5 ? 1 : -1))); }, 3000));
  intervals.push(setInterval(() => { autoProgress.value = (autoProgress.value + 1) % 101; }, 150));
  window.sunnyTownIntervals = intervals; // Store intervals to clear them on unmount

  // Intersection observer for fade-in animations
  const options = { root: null, rootMargin: '0px', threshold: 0.15 }; // Adjusted threshold
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        entry.target.classList.remove('opacity-0', 'translate-y-8', 'scale-95');
        observer.value.unobserve(entry.target); // Unobserve after animation
      }
    });
  }, options);

  document.querySelectorAll('.needs-fade-in').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8', 'scale-95', 'transform', 'transition-all', 'duration-1000', 'ease-out');
    observer.value.observe(el);
    observedElements.value.push(el); // Keep track for unobserving (though unobserving individually now)
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (window.sunnyTownIntervals) {
    window.sunnyTownIntervals.forEach(interval => clearInterval(interval));
  }
  if (observer.value) {
    // No need to loop through observedElements if unobserving individually
    // observedElements.value.forEach(el => {
    //   if (el) observer.value.unobserve(el);
    // });
    observer.value.disconnect(); // Disconnect observer fully
  }
});
</script>

<style scoped>
/* Keyframes existants */
@keyframes logo-enter { 0% { transform: translateY(-30px) scale(0.9); opacity: 0; } 80% { transform: translateY(5px) scale(1.02); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
@keyframes logo-float { 0% { transform: translateY(0px) rotate(0deg); } 25% { transform: translateY(-10px) rotate(0.5deg); } 50% { transform: translateY(-15px) rotate(0deg); } 75% { transform: translateY(-10px) rotate(-0.5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
@keyframes bg-pan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes particle-fade-out { 
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(0.3); opacity: 0; } 
}
@keyframes character-walk { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes character-idle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.95; transform: scale(1.02); } }
@keyframes sparkle-effect { 0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); } 50% { opacity: 1; transform: scale(1.2) rotate(180deg); } }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
@keyframes cloud-float { 0% { transform: translateX(0px) translateY(0px); } 50% { transform: translateX(15px) translateY(-5px); } 100% { transform: translateX(0px) translateY(0px); } }


/* Classes CSS existantes et nouvelles */
.animated-logo { animation: logo-enter 0.8s ease-out forwards, logo-float 10s ease-in-out infinite 1s; } /* Adjusted logo-float duration */
.animated-bg-pan { animation: bg-pan 70s linear infinite; } /* Slightly slower pan */
.particle { animation: particle-fade-out 1s cubic-bezier(0.17, 0.84, 0.44, 1) forwards; } /* Smoother particle animation */

.pixelated { image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }
.character-walk { animation: character-walk 1s infinite steps(1, end); }
.character-idle { animation: character-idle 2.5s infinite ease-in-out; } /* Slightly slower idle */
.sparkle { animation: sparkle-effect 1.5s infinite; }
.sparkle-1 { top: 10%; left: 15%; animation-delay: 0s; }
.sparkle-2 { top: 20%; right: 10%; animation-delay: 0.2s; }
.sparkle-3 { bottom: 15%; left: 20%; animation-delay: 0.4s; }
.sparkle-4 { bottom: 25%; right: 25%; animation-delay: 0.6s; }
.sparkle-5 { top: 50%; left: 5%; animation-delay: 0.8s; }
.sparkle-6 { top: 5%; right: 30%; animation-delay: 1s; }
.animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; /* Start hidden for animation */ }
.animation-delay-700 { animation-delay: 0.7s; }
.animation-delay-1000 { animation-delay: 1s; }
.animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
</style>
