<template>
  <div class="bg-gray-900 text-white min-h-screen font-sans antialiased overflow-x-hidden">
    <!-- Header avec stats en temps réel -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#182c55]/95 backdrop-blur-sm shadow-lg border-b-2 border-yellow-400/30">
      <nav class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <a href="#home" class="text-yellow-200 hover:text-white transition-colors font-bold text-lg">
              ACCUEIL
            </a>
            <a href="#community" class="text-yellow-200 hover:text-white transition-colors">
              COMMUNAUTÉ
            </a>
            <!-- Lien Forum ajouté pour correspondre à la maquette implicite -->
            <a href="#forum" class="text-yellow-200 hover:text-white transition-colors">
              FORUM
            </a>
          </div>
          
          <!-- Stats en temps réel -->
          <div class="hidden md:flex items-center space-x-4 text-sm">
            <div 
              class="flex items-center space-x-1 bg-yellow-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-yellow-600/30"
              :class="{ 'scale-110 bg-yellow-600/40': clickedElements.has('coins') }"
              @click="handleResourceClick('coins', $event)"
            >
              <img src="/images/coin-icon.png" alt="Pièces" class="w-4 h-4 pixelated" />
              <span class="text-yellow-200 font-mono">{{ coins.toLocaleString() }}</span>
            </div>
            <div 
              class="flex items-center space-x-1 bg-green-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-green-600/30"
              :class="{ 'scale-110 bg-green-600/40': clickedElements.has('population') }"
              @click="handleResourceClick('population', $event)"
            >
              <img src="/images/people-icon.png" alt="Population" class="w-4 h-4 pixelated" />
              <span class="text-green-200 font-mono">{{ population }}</span>
            </div>
            <div 
              class="flex items-center space-x-1 bg-blue-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-600/30"
              :class="{ 'scale-110 bg-blue-600/40': clickedElements.has('happiness') }"
              @click="handleResourceClick('happiness', $event)"
            >
              <img src="/images/happiness-icon.png" alt="Bonheur" class="w-4 h-4 pixelated" />
              <span class="text-blue-200 font-mono">{{ happiness }}%</span>
            </div>
          </div>

          <!-- Icônes sociales (exemple) -->
          <div class="flex items-center space-x-3">
            <!-- Appliquer les classes Tailwind pour transitions et hover ici -->
            <Twitter class="w-5 h-5 text-yellow-200 cursor-pointer transition-all duration-300 ease-out hover:text-white hover:scale-120" />
            <Facebook class="w-5 h-5 text-yellow-200 cursor-pointer transition-all duration-300 ease-out hover:text-white hover:scale-120" />
            <MessageCircle class="w-5 h-5 text-yellow-200 cursor-pointer transition-all duration-300 ease-out hover:text-white hover:scale-120" />
          </div>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero Section avec animations améliorées -->
      <section id="home" class="relative h-screen min-h-[700px] overflow-hidden flex flex-col items-center justify-center pt-16">
        <!-- Background animé avec effet de parallax -->
        <div 
          class="parallax-bg animated-bg-pan absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-75"
          :style="{ transform: `translateY(${parallax.bg}px)`, backgroundImage: 'url(\'/images/sunnytown-world-map.jpg\')' }"
        />
        
        <!-- Nuages flottants et personnages animés -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Ajouter les classes de délai d'animation Tailwind si disponibles, sinon garder les classes CSS -->
          <div class="animate-bounce absolute top-20 left-10 text-white/20 text-6xl cloud-delay-1">☁️</div>
          <div class="animate-pulse absolute top-32 right-20 text-white/30 text-4xl cloud-delay-2">☁️</div>
          <div class="animate-bounce absolute top-40 left-1/3 text-white/20 text-5xl">☁️</div>
          
          <!-- Personnages animés du jeu -->
          <div class="absolute bottom-20 left-10">
            <img src="/images/frame 167.png" alt="Felix" class="w-16 h-16 pixelated character-walk" />
          </div>
          <div class="absolute bottom-32 right-20">
            <img src="/images/frame 185.png" alt="Fermier" class="w-16 h-16 pixelated character-idle" />
          </div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10"></div>

        <!-- Logo avec animation de pulsation douce -->
        <div 
          class="relative z-20 mt-10 px-4 text-center"
          :style="{ transform: `translateY(${parallax.logo}px)` }"
        >
          <div class="relative">
            <img 
              src="/images/SunnyTown-logo.png" 
              alt="SunnyTown Logo" 
              class="animated-logo w-[300px] h-auto sm:w-[500px] md:w-[650px] mx-auto drop-shadow-2xl" 
            />
            <div class="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <!-- Particules magiques autour du logo -->
            <!-- Les classes sparkle-N définissent top, left, animation-delay. Les autres (absolute, text-yellow-400, pointer-events-none, text-size) sont Tailwind -->
            <div class="absolute inset-0 pointer-events-none">
              <div class="sparkle sparkle-1 absolute text-yellow-400 pointer-events-none text-lg">✨</div>
              <div class="sparkle sparkle-2 absolute text-yellow-400 pointer-events-none text-base">⭐</div>
              <div class="sparkle sparkle-3 absolute text-yellow-400 pointer-events-none text-xl">💫</div>
              <div class="sparkle sparkle-4 absolute text-yellow-400 pointer-events-none text-sm">🌟</div>
              <div class="sparkle sparkle-5 absolute text-yellow-400 pointer-events-none text-lg">✨</div> <!-- Approximativement 1.1rem -->
              <div class="sparkle sparkle-6 absolute text-yellow-400 pointer-events-none text-base">⭐</div>
            </div>
          </div>
          
          <p class="text-yellow-100 text-xl md:text-2xl mt-6 font-semibold drop-shadow-lg animate-fade-in-up">
            🚜 Votre aventure idle commence ici ! 🌾
          </p>
          
          <!-- Barre de progression automatique -->
          <div class="mt-8 w-full max-w-md mx-auto">
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

      <!-- Content avec animations d'idle game -->
      <div class="bg-[#f5eac7] py-10 relative z-30 needs-fade-in" style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAB+DmQAAgAAAAAAAAAAAAAAgJMDGgAAAAAAAAAAAAAAgJMDGgAAAAAAAAAAAAAAgJMDGgAAAAAAAAAAAADgC2cCATsPsnNFAAAAAElFTkSuQmCC'); background-repeat: repeat;">
        
        <!-- Section Fonctionnalités avec éléments interactifs -->
        <section id="features" class="container mx-auto px-4 py-12 needs-fade-in">
          <div class="bg-[#fff9e6] p-8 rounded-xl shadow-2xl border-4 border-[#d3b87b]">
            <h2 class="text-4xl md:text-5xl font-bold text-center mb-8 text-[#5a3d2b]" style="font-family: 'Georgia', serif;">
              🌟 Bienvenue à SunnyTown ! 🌟
            </h2>
            
            <p class="text-lg text-[#422d1b] mb-8 leading-relaxed text-center max-w-4xl mx-auto">
              🎯 Le premier jeu idle de construction de ville qui continue même quand vous dormez ! 
              Transformez une simple ferme en métropole prospère grâce à la magie de la progression automatique.
            </p>

            <div class="grid md:grid-cols-3 gap-8">
              <!-- Exemple de carte de fonctionnalité - appliquer les classes Tailwind ici -->
              <div v-for="feature in props.features" :key="feature.title" 
                   class="bg-yellow-50 p-6 rounded-lg shadow-lg text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl group">
                <div class="text-5xl mb-4 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110">{{ feature.icon }}</div>
                <h3 class="text-2xl font-semibold text-[#7c553c] mb-2">{{ feature.title }}</h3>
                <p class="text-[#5a3d2b] text-sm">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section "Comment Jouer" -->
        <section id="how-to-play" class="container mx-auto px-4 py-16 needs-fade-in">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-[#5a3d2b]">Comment Commencer Votre Aventure?</h2>
          <div class="grid md:grid-cols-3 gap-8 text-center">
            <div class="bg-lime-50 p-6 rounded-lg shadow-md">
              <div class="text-6xl mb-4">1️⃣</div>
              <h3 class="text-xl font-semibold text-lime-700 mb-2">Inscrivez-vous</h3>
              <p class="text-lime-600">Créez votre compte en quelques clics et rejoignez la communauté SunnyTown.</p>
            </div>
            <div class="bg-sky-50 p-6 rounded-lg shadow-md">
              <div class="text-6xl mb-4">2️⃣</div>
              <h3 class="text-xl font-semibold text-sky-700 mb-2">Construisez Votre Ville</h3>
              <p class="text-sky-600">Placez vos premiers bâtiments et commencez à récolter des ressources.</p>
            </div>
            <div class="bg-amber-50 p-6 rounded-lg shadow-md">
              <div class="text-6xl mb-4">3️⃣</div>
              <h3 class="text-xl font-semibold text-amber-700 mb-2">Progressez & Explorez</h3>
              <p class="text-amber-600">Débloquez de nouvelles technologies, explorez des îles et devenez le maire ultime!</p>
            </div>
          </div>
        </section>

        <!-- Section Communauté -->
        <section id="community" class="bg-[#e0cda8] py-16 needs-fade-in">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-4xl font-bold text-[#5a3d2b] mb-6">Rejoignez notre Communauté Ensoleillée !</h2>
            <p class="text-lg text-[#422d1b] mb-8 max-w-2xl mx-auto">Partagez vos créations, échangez des astuces et participez à des événements exclusifs avec des milliers d'autres joueurs.</p>
            <div class="flex justify-center space-x-6">
              <!-- Exemple de bouton CTA - appliquer les classes Tailwind ici -->
              <a href="#" class="bg-yellow-500 text-[#5a3d2b] px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all duration-300 ease-out hover:bg-yellow-600 hover:scale-105 hover:shadow-lg">Discord</a>
              <a href="#" class="bg-green-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-md transition-all duration-300 ease-out hover:bg-green-600 hover:scale-105 hover:shadow-lg">Forum</a>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#182c55] text-yellow-200 py-8 border-t-2 border-yellow-400/20">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} SunnyTown. Tous droits réservés.</p>
        <div class="mt-4 space-x-4">
          <!-- Exemple de lien de footer - appliquer les classes Tailwind ici -->
          <a href="#" class="transition-colors duration-300 ease-out hover:text-white">Politique de confidentialité</a>
          <a href="#" class="transition-colors duration-300 ease-out hover:text-white">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>

    <!-- Bouton Retour en Haut -->
    <!-- Appliquer les classes Tailwind pour transitions et hover ici -->
    <button v-if="showBackToTop" @click="scrollToTop" 
            class="fixed bottom-5 right-5 bg-yellow-500 text-[#5a3d2b] p-3 rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-yellow-600 hover:scale-110 focus:outline-none">
      <ArrowUp class="w-6 h-6" />
    </button>

    <!-- Conteneur pour les particules de clic -->
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
import { ref, onMounted, onUnmounted, computed, defineProps } from 'vue';
import { Twitter, Facebook, MessageCircle, ArrowUp } from 'lucide-vue-next';

// Props (si des données sont passées depuis Laravel/Inertia)
const props = defineProps({
  meta: Object,
  stats: Object,
  features: Array,
  gameplay_features: Array,
  social_links: Object,
});

// Références pour les stats dynamiques (idle game)
const coins = ref(props.stats?.active_players.replace(/\D/g, '')/100 || 12345); // Exemple basé sur active_players
const population = ref(props.stats?.cities_created.replace(/\D/g, '')/1000 || 876); // Exemple basé sur cities_created
const happiness = ref(92);
const autoProgress = ref(0);

// Parallax effect
const parallax = ref({ bg: 0, logo: 0 });
const handleScroll = () => {
  const scrollY = window.scrollY;
  parallax.value.bg = scrollY * 0.3;
  parallax.value.logo = scrollY * 0.5;

  // Gérer l'affichage du bouton "Retour en Haut"
  if (window.scrollY > 300) {
    showBackToTop.value = true;
  } else {
    showBackToTop.value = false;
  }
};

// Bouton Retour en Haut
const showBackToTop = ref(false);
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Particules de clic
const particles = ref([]);
const clickedElements = ref(new Set());
let particleId = 0;

const handleResourceClick = (type, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const emojiMap = {
    coins: '💰',
    population: '🧑‍🌾',
    happiness: '😊'
  };

  for (let i = 0; i < 5; i++) { // Générer 5 particules
    particles.value.push({
      id: particleId++,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 20,
      y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 20,
      emoji: emojiMap[type],
      type: type
    });
  }

  clickedElements.value.add(type);
  // Nettoyage
  setTimeout(() => {
    particles.value = particles.value.filter(p => p.id !== particleId - 5); // Approximation
    clickedElements.value.delete(type);
  }, 1000);
};


// Intersection Observer pour les animations au défilement
const observer = ref(null);
const observedElements = ref([]);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  // Animations automatiques (idle game simulation)
  const intervals = [];
  intervals.push(setInterval(() => { coins.value += Math.floor(Math.random() * 3) + 1; }, 2000));
  intervals.push(setInterval(() => { population.value += Math.random() > 0.7 ? 1 : 0; }, 5000));
  intervals.push(setInterval(() => { happiness.value = Math.min(100, Math.max(0, happiness.value + (Math.random() > 0.5 ? 1 : -1))); }, 3000));
  intervals.push(setInterval(() => { autoProgress.value = (autoProgress.value + 1) % 101; }, 150));
  window.sunnyTownIntervals = intervals;

  // Configuration de l'Intersection Observer
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
  };
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-5');
      } else {
        // Optionnel: pour ré-animer si l'utilisateur remonte et redescend
        // entry.target.classList.remove('opacity-100', 'translate-y-0');
        // entry.target.classList.add('opacity-0', 'translate-y-5');
      }
    });
  }, options);

  document.querySelectorAll('.needs-fade-in').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-700', 'ease-out');
    observer.value.observe(el);
    observedElements.value.push(el);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (window.sunnyTownIntervals) {
    window.sunnyTownIntervals.forEach(interval => clearInterval(interval));
    window.sunnyTownIntervals = null;
  }
  if (observer.value) {
    observedElements.value.forEach(el => {
      if (el) observer.value.unobserve(el);
    });
  }
});

</script>

<style scoped>
/* Animations Keyframes (conservées) */
@keyframes logo-enter {
  0% { transform: translateY(-30px) scale(0.9); opacity: 0; }
  80% { transform: translateY(5px) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes logo-float {
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(-15px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes bg-pan {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes particle-fade-out {
  to {
    transform: translateY(-50px) scale(0.5);
    opacity: 0;
  }
}

@keyframes character-walk {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes character-idle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.02); }
}

@keyframes sparkle-effect {
  0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Classes CSS minimales (conservées) */
.animated-logo {
  animation: logo-enter 0.8s ease-out forwards, logo-float 12s ease-in-out infinite 1s;
}

.animated-bg-pan {
  /* background-image est maintenant appliqué via :style dans le template pour une meilleure co-localisation */
  animation: bg-pan 60s linear infinite;
}

.particle { /* Applique uniquement l'animation. Position, taille, couleur via Tailwind dans le template */
  animation: particle-fade-out 1s forwards;
}

.cloud-delay-1 { animation-delay: 1s; }
.cloud-delay-2 { animation-delay: 2s; }

.pixelated { /* Utilitaire général pour le style pixel art */
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.character-walk {
  animation: character-walk 1s infinite steps(1, end);
}

.character-idle {
  animation: character-idle 2s infinite ease-in-out;
}

.sparkle { /* Applique uniquement l'animation. Position, couleur, etc. via Tailwind et classes sparkle-N */
  animation: sparkle-effect 1.5s infinite;
}

/* Positionnement et délai spécifiques pour chaque étincelle. Taille de police via Tailwind dans le template. */
.sparkle-1 { top: 10%; left: 15%; animation-delay: 0s; }
.sparkle-2 { top: 20%; right: 10%; animation-delay: 0.2s; }
.sparkle-3 { bottom: 15%; left: 20%; animation-delay: 0.4s; }
.sparkle-4 { bottom: 25%; right: 25%; animation-delay: 0.6s; }
.sparkle-5 { top: 50%; left: 5%; animation-delay: 0.8s; }
.sparkle-6 { top: 5%; right: 30%; animation-delay: 1s; }

.animate-fade-in-up { /* Appliqué au paragraphe sous le logo */
  animation: fade-in-up 0.8s ease-out forwards;
  animation-delay: 0.5s; 
}

/* Les classes .section-fade-in et .section-fade-in.visible ne sont plus nécessaires.
   L'animation au défilement est gérée par IntersectionObserver et des classes Tailwind
   directement appliquées/supprimées dans le script.
   Les éléments concernés dans le template doivent avoir la classe 'needs-fade-in'.
   Les classes initiales (opacity-0, translate-y-5) et de transition (transition-all, duration-700, ease-out)
   sont ajoutées par le script onMounted.
*/
</style>
