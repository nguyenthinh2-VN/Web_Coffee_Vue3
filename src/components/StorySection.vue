<template>
  <div class="story-section">
    <div class="story-container">
      <!-- Title Section -->
      <div class="story-header" ref="headerRef">
        <h1 class="story-title">CHUYỆN "NHÀ"</h1>
        <p class="story-description">
          The Coffee House tin rằng, nụ cười là hương vị ngọt ngào nhất
          trong mỗi tách cà phê. Từ những ly cà phê đậm đà, những tách trà
          thanh mát, đến từng lời chào thân quen, chúng tôi mong mỗi vị
          khách khi ghé Nhà đều mang theo một niềm vui nhỏ – để rồi nụ
          cười ấy lại được lan toả khắp nơi.
        </p>
        <button class="learn-more-btn">TÌM HIỂU</button>
      </div>

      <!-- Images Grid -->
      <div class="images-grid">
        <!-- Top Left - Coffee cups -->
        <div class="image-card card-1" ref="card1Ref">
          <img 
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop" 
            alt="Coffee cups"
          />
          <div class="card-label">
            <p>The Coffee House</p>
            <p class="small">is always possible.</p>
          </div>
        </div>

        <!-- Center - People enjoying coffee -->
        <div class="image-card card-2" ref="card2Ref">
          <img 
            src="https://file.hstatic.net/1000075078/file/banner-home-aboutus.png" 
            alt="People at coffee shop"
          />
          <span class="hashtag">#chuyệnnhà</span>
        </div>

        <!-- Bottom Left - Matcha -->
        <div class="image-card card-3" ref="card3Ref">
          <img 
            src="https://file.hstatic.net/1000075078/file/aboutus-banner3.png" 
            alt="Matcha drink"
          />
        </div>

        <!-- Bottom Center - Coffee beans bag -->
        <div class="image-card card-4" ref="card4Ref">
          <img 
            src="https://file.hstatic.net/1000075078/file/sticker-aboutus-rectangle_15.png" 
            alt="Coffee beans"
          />
          <div class="badge-label">DZUIZE</div>
        </div>

        <!-- Right - Coffee beans in hands -->
        <div class="image-card card-5" ref="card5Ref">
          <img 
            src="https://file.hstatic.net/1000075078/file/aboutus-banner1.png" 
            alt="Coffee beans"
          />
          <div class="card-label-right">
            <p>Just grab a bag</p>
            <p class="small">and jump right in.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'StorySection',
  setup() {
    const headerRef = ref(null);
    const card1Ref = ref(null);
    const card2Ref = ref(null);
    const card3Ref = ref(null);
    const card4Ref = ref(null);
    const card5Ref = ref(null);

    onMounted(() => {
      // Header animation
      gsap.from(headerRef.value, {
        scrollTrigger: {
          trigger: headerRef.value,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });

      // Card animations with stagger
      const cards = [card1Ref.value, card2Ref.value, card3Ref.value, card4Ref.value, card5Ref.value];
      
      cards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 100,
          rotation: index % 2 === 0 ? -5 : 5,
          duration: 1,
          delay: index * 0.1,
          ease: 'power3.out'
        });

        // Hover animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            rotation: index % 2 === 0 ? -2 : 2,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    });

    return {
      headerRef,
      card1Ref,
      card2Ref,
      card3Ref,
      card4Ref,
      card5Ref
    };
  }
};
</script>

<style scoped>
.story-section {
  background: #fff;
  padding: 80px 24px;
  overflow: hidden;
}

.story-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.story-header {
  text-align: center;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.story-title {
  font-size: 3rem;
  font-weight: 900;
  color: #000;
  margin: 0 0 30px 0;
  letter-spacing: 2px;
  font-style: italic;
}

.story-description {
  font-size: 2rem;
  line-height: 1.3;
  color: #333;
  margin: 0 0 30px 0;
  font-weight: 550;
}

.learn-more-btn {
  background: #000;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learn-more-btn:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 20px;
  position: relative;
}

.image-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.image-card:hover img {
  transform: scale(1);}

/* Card positions */
.card-1 {
  grid-column: 1 / 5;
  grid-row: 1 / 2;
  transform: rotate(-2deg);

}

.card-2 {
  grid-column: 4 / 10;
  grid-row: 1 / 3;
  z-index: 2;
  transform: rotate(1deg);
}

.card-3 {
  grid-column: 1 / 5;
  grid-row: 2 / 4;
  transform: rotate(-3deg);
}

.card-4 {
  grid-column: 4 / 8;
  grid-row: 3 / 4;
  transform: rotate(2deg);
}

.card-5 {
  grid-column: 9 / 13;
  grid-row: 2 / 4;
  transform: rotate(-1deg);
}

/* Labels */
.card-label {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-label p {
  margin: 0;
  font-weight: 700;
  color: #000;
  font-size: 0.9rem;
}

.card-label .small {
  font-weight: 400;
  font-size: 0.8rem;
  color: #666;
}

.card-label-right {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: right;
}

.card-label-right p {
  margin: 0;
  font-weight: 700;
  color: #000;
  font-size: 0.9rem;
}

.card-label-right .small {
  font-weight: 400;
  font-size: 0.8rem;
  color: #666;
}

.hashtag {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  color: #000;
  font-size: 0.85rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.badge-label {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  background: #FFD700;
  color: #000;
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

/* Responsive */
@media (max-width: 1024px) {
  .images-grid {
    grid-template-rows: repeat(3, 180px);
    gap: 15px;
  }

  .story-title {
    font-size: 2.2rem;
  }

  .story-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .story-section {
    padding: 60px 16px;
  }

  .story-title {
    font-size: 1.8rem;
  }

  .story-description {
    font-size: 0.95rem;
  }

  .images-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(5, 150px);
    gap: 10px;
  }

  .card-1 {
    grid-column: 1 / 4;
    grid-row: 1 / 2;
  }

  .card-2 {
    grid-column: 3 / 7;
    grid-row: 1 / 3;
  }

  .card-3 {
    grid-column: 1 / 4;
    grid-row: 2 / 4;
  }

  .card-4 {
    grid-column: 3 / 6;
    grid-row: 4 / 5;
  }

  .card-5 {
    grid-column: 4 / 7;
    grid-row: 3 / 5;
  }

  .card-label,
  .card-label-right {
    padding: 8px 12px;
  }

  .card-label p,
  .card-label-right p {
    font-size: 0.75rem;
  }

  .hashtag {
    font-size: 0.7rem;
    padding: 6px 12px;
  }

  .badge-label {
    font-size: 0.85rem;
    padding: 6px 16px;
  }
}
</style>
