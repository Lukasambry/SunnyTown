<template>
  <div class="bg-[#0c1739] text-[#422d1b] relative overflow-hidden" style="font-family: 'Verdana', sans-serif;">
    <!-- Particules flottantes -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="fixed pointer-events-none z-50 animate-ping"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        transform: 'translate(-50%, -50%)'
      }"
    >
      <span v-if="particle.type === 'coins'" class="text-yellow-400 font-bold">+25 💰</span>
      <span v-if="particle.type === 'population'" class="text-green-400 font-bold">+2 👥</span>
      <span v-if="particle.type === 'happiness'" class="text-pink-400 font-bold">+5 😊</span>
    </div>

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
            <a href="#Forum" class="text-yellow-200 hover:text-white transition-colors">
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
              class="flex items-center space-x-1 bg-pink-600/20 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:bg-pink-600/30"
              :class="{ 'scale-110 bg-pink-600/40': clickedElements.has('happiness') }"
              @click="handleResourceClick('happiness', $event)"
            >
              <img src="/images/heart-icon.png" alt="Bonheur" class="w-4 h-4 pixelated" />
              <span class="text-pink-200 font-mono">{{ happiness }}%</span>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <Twitter class="w-5 h-5 text-yellow-200 hover:text-white cursor-pointer transition-colors" />
            <Facebook class="w-5 h-5 text-yellow-200 hover:text-white cursor-pointer transition-colors" />
            <MessageCircle class="w-5 h-5 text-yellow-200 hover:text-white cursor-pointer transition-colors" />
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
          :style="{ transform: `translateY(${parallax.bg}px)` }"
        />
        
        <!-- Nuages flottants et personnages animés -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="animate-bounce absolute top-20 left-10 text-white/20 text-6xl">☁️</div>
          <div class="animate-pulse absolute top-32 right-20 text-white/30 text-4xl cloud-delay-1">☁️</div>
          <div class="animate-bounce absolute top-40 left-1/3 text-white/20 text-5xl cloud-delay-2">☁️</div>
          
          <!-- Personnages animés du jeu -->
          <div class="absolute bottom-20 left-10 animate-bounce">
            <img src="/images/frame 167.png" alt="Felix" class="w-16 h-16 pixelated character-walk" />
          </div>
          <div class="absolute bottom-32 right-20 animate-pulse">
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
            <div class="absolute inset-0 pointer-events-none">
              <div class="sparkle sparkle-1">✨</div>
              <div class="sparkle sparkle-2">⭐</div>
              <div class="sparkle sparkle-3">💫</div>
              <div class="sparkle sparkle-4">🌟</div>
              <div class="sparkle sparkle-5">✨</div>
              <div class="sparkle sparkle-6">⭐</div>
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

          <!-- Bouton principal animé -->
          <div class="mt-8">
            <button class="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-xl rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-yellow-400/50 border-4 border-yellow-300">
              <span class="relative z-10">🎮 Commencer à jouer MAINTENANT</span>
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute -inset-2 bg-yellow-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <p class="text-yellow-200 mt-2 text-sm animate-pulse">
              ⚡ Gratuit • Progression automatique • Sans téléchargement
            </p>
          </div>
        </div>
      </section>

      <!-- Content avec animations d'idle game -->
      <div class="bg-[#f5eac7] py-10 relative z-30" style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAB+DmQAAgAAAAAAAAAAAAAAgJMDGgAAAAAAAAAAAAAAgJMDGgAAAAAAAAAAAAAAgJMDGgAAAAAAAAAAAADgC2cCATsPsnNFAAAAAElFTkSuQmCC'); background-repeat: repeat;">
        
        <!-- Section Fonctionnalités avec éléments interactifs -->
        <section id="features" class="container mx-auto px-4 py-12">
          <div class="bg-[#fff9e6] p-8 rounded-xl shadow-2xl border-4 border-[#d3b87b]">
            <h2 class="text-4xl md:text-5xl font-bold text-center mb-8 text-[#5a3d2b]" style="font-family: 'Georgia', serif;">
              🌟 Bienvenue à SunnyTown ! 🌟
            </h2>
            
            <p class="text-lg text-[#422d1b] mb-8 leading-relaxed text-center max-w-4xl mx-auto">
              🎯 Le premier jeu idle de construction de ville qui continue même quand vous dormez ! 
              Transformez une simple ferme en métropole prospère grâce à la magie de la progression automatique.
            </p>

            <!-- Stats en temps réel visibles -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div 
                class="text-center p-6 bg-yellow-100 rounded-xl border-2 border-yellow-400 hover:scale-105 transition-transform cursor-pointer"
                @click="handleResourceClick('coins', $event)"
              >
                <div class="text-4xl mb-2">💰</div>
                <div class="text-2xl font-bold text-yellow-800">{{ coins.toLocaleString() }}</div>
                <div class="text-yellow-600">Pièces générées</div>
                <div class="text-xs text-yellow-500 mt-1">Cliquez pour bonus!</div>
              </div>
              
              <div 
                class="text-center p-6 bg-green-100 rounded-xl border-2 border-green-400 hover:scale-105 transition-transform cursor-pointer"
                @click="handleResourceClick('population', $event)"
              >
                <div class="text-4xl mb-2">👥</div>
                <div class="text-2xl font-bold text-green-800">{{ population }}</div>
                <div class="text-green-600">Habitants</div>
                <div class="text-xs text-green-500 mt-1">Cliquez pour attirer!</div>
              </div>
              
              <div 
                class="text-center p-6 bg-pink-100 rounded-xl border-2 border-pink-400 hover:scale-105 transition-transform cursor-pointer"
                @click="handleResourceClick('happiness', $event)"
              >
                <div class="text-4xl mb-2">😊</div>
                <div class="text-2xl font-bold text-pink-800">{{ happiness }}%</div>
                <div class="text-pink-600">Bonheur</div>
                <div class="text-xs text-pink-500 mt-1">Cliquez pour joie!</div>
              </div>
            </div>

            <!-- Fonctionnalités avec assets du jeu -->
            <div class="grid md:grid-cols-3 gap-8 text-center">
              <div class="group p-6 hover:bg-[#fdf5e0] rounded-xl transition-all duration-500 hover:scale-105">
                <div class="mb-4 flex justify-center">
                  <img src="/images/sunflower-crop.png" alt="Agriculture" class="w-16 h-16 pixelated group-hover:animate-bounce" />
                </div>
                <h4 class="text-2xl font-semibold mb-2 text-[#5a3d2b]">Agriculture Automatique</h4>
                <p class="text-[#422d1b]">Vos récoltes poussent même pendant votre sommeil !</p>
                <div class="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full animate-pulse" style="width: 70%"></div>
                </div>
              </div>
              
              <div class="group p-6 hover:bg-[#fdf5e0] rounded-xl transition-all duration-500 hover:scale-105">
                <div class="mb-4 flex justify-center">
                  <img src="/images/game-tools.png" alt="Outils" class="w-16 h-16 pixelated group-hover:animate-pulse" />
                </div>
                <h4 class="text-2xl font-semibold mb-2 text-[#5a3d2b]">Outils Magiques</h4>
                <p class="text-[#422d1b]">Découvrez des outils qui génèrent des bonus permanents !</p>
                <div class="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full animate-pulse" style="width: 45%"></div>
                </div>
              </div>
              
              <div class="group p-6 hover:bg-[#fdf5e0] rounded-xl transition-all duration-500 hover:scale-105">
                <div class="mb-4 flex justify-center">
                  <img src="/images/frame 185.png" alt="Personnages" class="w-16 h-16 pixelated group-hover:animate-bounce" />
                </div>
                <h4 class="text-2xl font-semibold mb-2 text-[#5a3d2b]">Personnages Vivants</h4>
                <p class="text-[#422d1b]">Plus de 30 PNJ qui travaillent pour vous 24/7 !</p>
                <div class="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full animate-pulse" style="width: 85%"></div>
                </div>
              </div>
            </div>

            <!-- Interface de gameplay preview -->
            <div class="mt-16 bg-[#8B4513] p-6 rounded-xl border-4 border-[#654321] shadow-2xl">
              <h3 class="text-2xl font-bold text-center mb-6 text-yellow-100">🎮 Aperçu du Gameplay</h3>
              <div class="grid md:grid-cols-2 gap-8 items-center">
                <div class="text-center">
                  <img src="/images/inventory-interface.png" alt="Interface Inventaire" class="w-full max-w-md mx-auto pixelated hover:scale-105 transition-transform shadow-lg rounded-lg" />
                  <p class="text-yellow-200 mt-4 text-sm">Interface d'inventaire en temps réel</p>
                </div>
                <div class="text-center">
                  <img src="/images/harvest-interface.png" alt="Interface Récolte" class="w-full max-w-md mx-auto pixelated hover:scale-105 transition-transform shadow-lg rounded-lg" />
                  <p class="text-yellow-200 mt-4 text-sm">Système de récolte automatique</p>
                </div>
              </div>
            </div>

            <!-- Call to action principal -->
            <div class="text-center mt-12">
              <button class="pixel-border gold py-3 px-8 transform hover:scale-105 transition-transform text-lg font-bold">
                🚀 Découvrir le Jeu
              </button>
              <div class="flex items-center justify-center mt-4 space-x-4 text-sm text-green-600">
                <span class="flex items-center"><Clock class="w-4 h-4 mr-1" /> Progresse automatiquement</span>
                <span class="flex items-center"><TrendingUp class="w-4 h-4 mr-1" /> Revenus passifs</span>
                <span class="flex items-center"><Star class="w-4 h-4 mr-1" /> Gratuit à vie</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Section Communauté avec interactions et assets -->
        <section id="community" class="container mx-auto px-4 py-12">
          <div class="bg-[#fff9e6] p-8 rounded-xl shadow-2xl border-4 border-[#d3b87b] relative overflow-hidden">
            <!-- Éléments décoratifs avec assets -->
            <div class="absolute top-4 left-4 opacity-30">
              <img src="/images/sunflower-item.png" alt="Tournesol" class="w-8 h-8 pixelated animate-pulse" />
            </div>
            <div class="absolute top-6 right-6 opacity-30">
              <img src="/images/tools-icon.png" alt="Outils" class="w-8 h-8 pixelated animate-bounce" />
            </div>
            <div class="absolute bottom-4 left-8 opacity-30">
              <img src="/images/crop-seeds.png" alt="Graines" class="w-6 h-6 pixelated animate-pulse" />
            </div>
            
            <h2 class="text-4xl font-bold text-center mb-8 text-[#5a3d2b]" style="font-family: 'Georgia', serif;">
              🤝 Rejoignez la Communauté !
            </h2>
            
            <div class="grid md:grid-cols-2 gap-8">
              <div class="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl hover:scale-105 transition-transform relative">
                <div class="absolute top-2 right-2">
                  <img src="/images/character-happy.png" alt="Personnage heureux" class="w-8 h-8 pixelated animate-bounce" />
                </div>
                <div class="text-6xl mb-4 animate-bounce">🎮</div>
                <h3 class="text-2xl font-bold text-blue-800 mb-4">Joueurs Actifs</h3>
                <div class="text-4xl font-bold text-blue-600 mb-2">{{ currentPlayers.toLocaleString() }}</div>
                <p class="text-blue-700">Joueurs connectés maintenant</p>
                <div class="mt-4 flex justify-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-ping ping-delay-1"></div>
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-ping ping-delay-2"></div>
                </div>
              </div>
              
              <div class="text-center p-6 bg-gradient-to-br from-green-100 to-yellow-100 rounded-xl hover:scale-105 transition-transform relative">
                <div class="absolute top-2 right-2">
                  <img src="/images/chat-icon.png" alt="Chat" class="w-8 h-8 pixelated animate-pulse" />
                </div>
                <div class="text-6xl mb-4 animate-pulse">💬</div>
                <h3 class="text-2xl font-bold text-green-800 mb-4">Discord</h3>
                <div class="text-4xl font-bold text-green-600 mb-2">3,521</div>
                <p class="text-green-700">Membres dans la communauté</p>
                <button class="pixel-border py-2 px-6 transform hover:scale-105 transition-transform mt-4">
                  Rejoindre Discord
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#182c55] py-8 relative z-30">
      <div class="container mx-auto px-4 text-center text-yellow-200">
        <p class="text-lg">&copy; {{ new Date().getFullYear() }} SunnyTown. Tous droits réservés.</p>
        <p class="text-sm mt-2 opacity-75">🌟 Un jeu idle qui grandit avec vous ! 🌟</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { Crop, Users, MessageCircle, Twitter, Facebook, Sparkles, Coins, TrendingUp, Clock, Star } from 'lucide-vue-next';

// États réactifs
const parallax = reactive({
  bg: 0,
  logo: 0,
});

const coins = ref(1247);
const population = ref(156);
const happiness = ref(87);
const autoProgress = ref(0);
const clickedElements = ref(new Set());
const particles = ref([]);

// Nombre de joueurs actuels (simulation)
const currentPlayers = computed(() => {
  return 12847 + Math.floor(Date.now() / 10000) % 100;
});

// Gestion du parallax
const handleScroll = () => {
  const scrollY = window.scrollY;
  parallax.bg = scrollY * 0.2;
  parallax.logo = scrollY * 0.4;
};

// Gestion des clics pour collecte de ressources
const handleResourceClick = (type, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const id = Date.now();
  
  // Ajout de particules
  const newParticle = {
    id,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    type
  };
  
  particles.value.push(newParticle);
  clickedElements.value.add(type);

  // Bonus de ressources
  if (type === 'coins') coins.value += 25;
  if (type === 'population') population.value += 2;
  if (type === 'happiness') happiness.value = Math.min(100, happiness.value + 5);

  // Nettoyage
  setTimeout(() => {
    particles.value = particles.value.filter(p => p.id !== id);
    clickedElements.value.delete(type);
  }, 1000);
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Animations automatiques (idle game simulation)
  const intervals = [];
  
  // Incrementation automatique des ressources
  intervals.push(setInterval(() => {
    coins.value += Math.floor(Math.random() * 3) + 1;
  }, 2000));

  intervals.push(setInterval(() => {
    population.value += Math.random() > 0.7 ? 1 : 0;
  }, 5000));

  intervals.push(setInterval(() => {
    happiness.value = Math.min(100, happiness.value + (Math.random() > 0.5 ? 1 : -1));
  }, 3000));

  // Barre de progression automatique
  intervals.push(setInterval(() => {
    autoProgress.value = (autoProgress.value + 1) % 101;
  }, 150));

  // Stockage des intervalles pour nettoyage
  window.sunnyTownIntervals = intervals;
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  
  // Nettoyage des intervalles
  if (window.sunnyTownIntervals) {
    window.sunnyTownIntervals.forEach(interval => clearInterval(interval));
    window.sunnyTownIntervals = null;
  }
});
</script>

<style scoped>
/* Animation d'entrée et de flottement pour le logo */
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

@keyframes logo-glow {
  0% { filter: drop-shadow(0px 5px 10px rgba(0,0,0,0.5)) brightness(1); }
  50% { filter: drop-shadow(0px 8px 20px rgba(255,215,0,0.6)) brightness(1.1); }
  100% { filter: drop-shadow(0px 5px 10px rgba(0,0,0,0.5)) brightness(1); }
}

@keyframes sparkle-float {
  0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translate(-20px, -30px) scale(1) rotate(180deg); opacity: 1; }
  100% { transform: translate(-40px, -60px) scale(0) rotate(360deg); opacity: 0; }
}

@keyframes sparkle-float-reverse {
  0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translate(20px, -30px) scale(1) rotate(-180deg); opacity: 1; }
  100% { transform: translate(40px, -60px) scale(0) rotate(-360deg); opacity: 0; }
}

@keyframes character-walk {
  0% { transform: translateX(0px); }
  25% { transform: translateX(10px); }
  50% { transform: translateX(20px); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0px); }
}

@keyframes character-idle {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}


@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes panZoomBackground {
  0% {
    transform: scale(1.15) translate(0%, 0%);
  }
  25% {
    transform: scale(1.20) translate(-2%, -1%);
  }
  50% {
    transform: scale(1.15) translate(2%, 1%);
  }
  75% {
    transform: scale(1.20) translate(-1%, 2%);
  }
  100% {
    transform: scale(1.15) translate(0%, 0%);
  }
}

.animated-logo {
  animation: 
    logo-enter 1.2s ease-out forwards,
    logo-float 4s ease-in-out 1.5s infinite,
    logo-glow 3s ease-in-out 2s infinite;
  will-change: transform, filter;
  transition: transform 0.3s ease;
}

.animated-logo:hover {
  transform: scale(1.05) rotate(2deg);
  animation-play-state: paused;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  pointer-events: none;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.sparkle-1 {
  top: 10%;
  left: 15%;
  animation-name: sparkle-float;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 20%;
  right: 10%;
  animation-name: sparkle-float-reverse;
  animation-delay: 0.8s;
}

.sparkle-3 {
  top: 60%;
  left: 10%;
  animation-name: sparkle-float;
  animation-delay: 1.6s;
}

.sparkle-4 {
  top: 70%;
  right: 15%;
  animation-name: sparkle-float-reverse;
  animation-delay: 2.4s;
}

.sparkle-5 {
  top: 40%;
  left: 5%;
  animation-name: sparkle-float;
  animation-delay: 3.2s;
  font-size: 1rem;
}

.sparkle-6 {
  top: 30%;
  right: 5%;
  animation-name: sparkle-float-reverse;
  animation-delay: 1.2s;
  font-size: 1rem;
}

.character-walk {
  animation: character-walk 4s ease-in-out infinite;
}

.character-idle {
  animation: character-idle 3s ease-in-out infinite;
}

/* Style pixel art pour tous les assets du jeu */
.pixelated {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.pixelated:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
  animation-delay: 0.5s;
}

.parallax-bg {
  background-image: url('/images/sunnytown-world-map.jpg');
  will-change: transform;
}

.animated-bg-pan {
  animation: panZoomBackground 75s linear infinite alternate;
}

.cloud-delay-1 {
  animation-delay: 1s;
}

.cloud-delay-2 {
  animation-delay: 2s;
}

.ping-delay-1 {
  animation-delay: 0.5s;
}

.ping-delay-2 {
  animation-delay: 1s;
}

/* CSS pour .pixel-border (repris de votre code original) */
.pixel-border {
    --border-size: 4px;
    --btn-color-primary: forestgreen;
    --btn-color-secondary: darkgreen;
    --btn-color-tertiary: transparent;
    --btn-color-border: black;

    position: relative;
    border-radius: 0 !important; 
    color: white;
    font-family: '04b03', monospace;
    background-color: var(--btn-color-primary);
    border: var(--border-size) solid var(--btn-color-tertiary);
    box-shadow: 
        var(--border-size) 0 var(--btn-color-secondary), 
        0 var(--border-size) var(--btn-color-secondary), 
        0 calc(var(--border-size) * -1) var(--btn-color-secondary), 
        calc(var(--border-size) * -1) 0 var(--btn-color-secondary), 
        var(--border-size) var(--border-size) var(--btn-color-border), 
        calc(var(--border-size) * -1) var(--border-size) var(--btn-color-border), 
        var(--border-size) calc(var(--border-size) * -1) var(--btn-color-border), 
        calc(var(--border-size) * -1) calc(var(--border-size) * -1) var(--btn-color-border), 
        calc(var(--border-size) * 2) 0 var(--btn-color-border), 
        0 calc(var(--border-size) * 2) var(--btn-color-border), 
        0 calc(var(--border-size) * -2) var(--btn-color-border), 
        calc(var(--border-size) * -2) 0 var(--btn-color-border);
    line-height: 1;
}

.pixel-border.gold {
    --btn-color-primary: #FEAE34;
    --btn-color-secondary: #FBDF6B;
    color: #422d1b; 
}

.drop-shadow-lg {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}
</style>