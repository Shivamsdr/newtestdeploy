// Smooth scrolling utility for better navigation experience
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Handle anchor links with smooth scrolling
export const handleAnchorClick = (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    e.preventDefault();
    const elementId = href.substring(1);
    smoothScrollTo(elementId, 80); // Offset for fixed navbar
  }
};

// Add smooth scrolling to all anchor links on page load
export const initializeSmoothScrolling = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });
  });
};

// Enhanced navigation with loading states
export const navigateWithLoading = async (navigate, path, setLoading) => {
  setLoading(true);
  // Simulate navigation delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300));
  navigate(path);
  setLoading(false);
  smoothScrollToTop();
};
