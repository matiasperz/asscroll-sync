import gsap from 'gsap'

export const htmlParallax = (totalScroll: number, elm: HTMLElement) =>
  gsap.to(elm, {
    scrollTrigger: {
      end: '200%',
      scrub: 0.2,
      trigger: elm,
      markers: true
    },
    y: -totalScroll * Number(elm.dataset.speed),
    ease: 'none'
  })
