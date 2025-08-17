import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

type Props = {
  onEnter?: (planet: string, description: string) => void
}

const ScrollSections: React.FC<Props> = ({ onEnter }) => {
  const sections = [
    {
      planet: 'sun',
      description: 'The star at the center of our solar system.',
      title: 'Cosmic Journey',
      subtitle: 'Scroll down or use Free-Roam to explore.'
    },
    {
      planet: 'mercury',
      description: 'The smallest and innermost planet.',
      title: 'Mercury',
      subtitle: 'The swift messenger of the gods'
    },
    {
      planet: 'venus',
      description: "Earth's 'sister planet' due to their similar size.",
      title: 'Venus',
      subtitle: 'The morning and evening star'
    },
    {
      planet: 'earth',
      description: 'Our home, the only place known to harbor life.',
      title: 'Earth',
      subtitle: 'The pale blue dot'
    },
    {
      planet: 'mars',
      description: "The 'Red Planet,' known for its iron oxide surface.",
      title: 'Mars',
      subtitle: 'The red frontier'
    },
    {
      planet: 'jupiter',
      description: 'The largest planet, a gas giant with a Great Red Spot.',
      title: 'Jupiter',
      subtitle: 'The king of planets'
    },
    {
      planet: 'saturn',
      description: 'Known for its extensive and beautiful ring system.',
      title: 'Saturn',
      subtitle: 'The jewel of the solar system'
    }
  ];

  useEffect(() => {
    const els = document.querySelectorAll('.content-section') as NodeListOf<HTMLElement>
    els.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          el.style.opacity = '1'
          const planet = el.dataset.planet
          const desc = el.dataset.description || ''
          if (planet) onEnter?.(planet, desc)
        },
        onEnterBack: () => {
          el.style.opacity = '1'
          const planet = el.dataset.planet
          const desc = el.dataset.description || ''
          if (planet) onEnter?.(planet, desc)
        }
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [onEnter])

  return (
    <main className="pointer-events-none">
      {sections.map((section, index) => (
        <section
          key={section.planet}
          className="content-section relative z-10 h-screen flex flex-col justify-center items-center text-center px-8 pointer-events-none"
          data-planet={section.planet}
          data-description={section.description}
          style={{ opacity: index === 0 ? 1 : 0 }}
        >
          {index === 0 ? (
            <>
              <h1 className="intro-title text-5xl md:text-8xl font-black uppercase tracking-tighter text-glow mb-6">
                {section.title}
              </h1>
              <p className="intro-subtitle text-lg md:text-2xl text-gray-400 mt-4 max-w-2xl">
                {section.subtitle}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-glow">
                {section.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
                {section.subtitle}
              </p>
            </>
          )}
        </section>
      ))}
    </main>
  );
};

export default ScrollSections;