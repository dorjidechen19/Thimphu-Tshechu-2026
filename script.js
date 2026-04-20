/* ================================================================
   THIMPHU TSHECHU CULTURAL EXPERIENCE 2026
   Main JavaScript — script.js

   TABLE OF CONTENTS:
   1. Itinerary Accordion  — open/close day panels
   2. Scroll Reveal        — fade-in elements as you scroll
   3. Smooth Scroll        — anchor link scrolling
   4. Hero Parallax        — rings move slightly with the mouse
================================================================ */


/* ================================================================
   1. ITINERARY ACCORDION
   
   Called by onclick="toggleDay(this)" in the HTML.
   
   How it works:
   - If the clicked day is already open  → just close it
   - If the clicked day is closed        → close all, then open this one
   
   The open/close animation is handled purely by CSS using
   max-height and opacity transitions on the .day-body element.
================================================================ */
function toggleDay(clickedHeader) {

  // Get the .day-body panel that sits right after this header
  var panel = clickedHeader.nextElementSibling;

  // Check if THIS day is already open
  var isAlreadyOpen = panel.classList.contains('open');

  // Step 1: Close every day panel
  var allPanels  = document.querySelectorAll('.day-body');
  var allHeaders = document.querySelectorAll('.day-header');

  allPanels.forEach(function(p) {
    p.classList.remove('open');
  });

  allHeaders.forEach(function(h) {
    h.classList.remove('active');
  });

  // Step 2: If the clicked day was NOT already open, open it now
  if (!isAlreadyOpen) {
    panel.classList.add('open');
    clickedHeader.classList.add('active');
  }
}


/* ================================================================
   2. SCROLL REVEAL ANIMATION
   
   Any element with the class "reveal" starts invisible (opacity: 0,
   translateY: 40px — set in CSS). When the element enters the
   viewport, we add the "visible" class which transitions it into view.
   
   IntersectionObserver is used instead of a scroll event listener
   because it is much more efficient (no continuous firing).
================================================================ */
function initScrollReveal() {

  // Options: trigger when 12% of the element is visible,
  // with a small bottom margin so it fires slightly before the edge
  var observerOptions = {
    threshold:   0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  var observer = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Add the visible class to trigger the CSS transition
        entry.target.classList.add('visible');
        // Stop watching this element — it only needs to reveal once
        observer.unobserve(entry.target);
      }
    });

  }, observerOptions);

  // Attach the observer to every element that has the "reveal" class
  var revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(function(el) {
    observer.observe(el);
  });
}


/* ================================================================
   3. SMOOTH SCROLL FOR ANCHOR LINKS
   
   All links like <a href="#pricing"> scroll smoothly to the target
   section instead of jumping instantly.
   
   Native CSS scroll-behavior: smooth handles most cases, but this
   JavaScript fallback gives us more control (e.g. offset adjustment).
================================================================ */
function initSmoothScroll() {

  // Select all anchor links that point to an ID on the same page
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {

      var targetId = this.getAttribute('href');
      var targetSection = document.querySelector(targetId);

      if (targetSection) {
        event.preventDefault(); // Stop the default jump behavior
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block:    'start'
        });
      }

    });
  });
}


/* ================================================================
   4. HERO PARALLAX — Rings follow the mouse gently
   
   As the user moves their mouse across the hero, the three
   decorative rings shift slightly in the opposite direction,
   creating a subtle 3D depth effect.
   
   Each ring moves at a different speed (factor) based on its index,
   so the inner ring moves the most and the outer ring the least.
================================================================ */
function initHeroParallax() {

  document.addEventListener('mousemove', function(event) {

    // Convert mouse position to a -1 to +1 range
    var xRatio = (event.clientX / window.innerWidth)  - 0.5;
    var yRatio = (event.clientY / window.innerHeight) - 0.5;

    // Maximum pixel offset — the rings move up to 20px from center
    var maxOffset = 20;

    var xOffset = xRatio * maxOffset;
    var yOffset = yRatio * maxOffset;

    // Move each ring by a different factor so they appear layered
    var rings = document.querySelectorAll('.hero-ring');

    rings.forEach(function(ring, index) {
      // index 0 → factor 0.5, index 1 → factor 1.0, index 2 → factor 1.5
      var speedFactor = (index + 1) * 0.5;

      ring.style.transform =
        'translate(' +
        'calc(-50% + ' + (xOffset * speedFactor) + 'px), ' +
        'calc(-50% + ' + (yOffset * speedFactor) + 'px)' +
        ')';
    });

  });
}


/* ================================================================
   INITIALISE EVERYTHING
   
   Wait for the DOM to be fully loaded before running any code.
   This is safer than putting script tags in the middle of HTML.
================================================================ */
document.addEventListener('DOMContentLoaded', function() {
  initScrollReveal();
  initSmoothScroll();
  initHeroParallax();
});