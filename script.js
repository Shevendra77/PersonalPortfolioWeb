document.addEventListener("DOMContentLoaded", () => {

  // ================= DARK MODE =================
  const toggleBtn = document.getElementById("theme-toggle");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        toggleBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
      } else {
        toggleBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
      }
    });
  }

  // ================= NAVBAR TOGGLE =================
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // icon change
      if (navLinks.classList.contains("active")) {
        menuBtn.textContent = "✖";
      } else {
        menuBtn.textContent = "☰";
      }
    });

    // auto close on link click
    document.querySelectorAll("#nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.textContent = "☰";
      });
    });
  }

  // ================= TYPING EFFECT =================
  const texts = [
    "Java Backend Developer",
    "Spring Boot Specialist",
    "Building Scalable REST APIs",
    "Microservices Enthusiast",
    "Problem Solver",
    "Ready for Placement"
  ];

  let count = 0;
  let index = 0;
  let currentText = "";
  let letter = "";

  function type() {
    if (count === texts.length) count = 0;

    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    const typingEl = document.getElementById("typing-text");
    if (typingEl) typingEl.textContent = letter;

    if (letter.length === currentText.length) {
      setTimeout(erase, 1500);
    } else {
      setTimeout(type, 70);
    }
  }

  function erase() {
    letter = currentText.slice(0, --index);

    const typingEl = document.getElementById("typing-text");
    if (typingEl) typingEl.textContent = letter;

    if (letter.length === 0) {
      count++;
      setTimeout(type, 500);
    } else {
      setTimeout(erase, 40);
    }
  }

  type(); // start typing

});


const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;
            const target = +counter.dataset.target;

            let count = 0;

            const update = () => {

                const increment = Math.ceil(target / 80);

                if (count < target) {
                    count += increment;

                    if (count > target) count = target;

                    counter.innerText = count;

                    requestAnimationFrame(update);

                } else {

                    counter.innerText = target + "+";

                }

            };

            update();

            observer.unobserve(counter);

        }

    });

});

counters.forEach(counter => observer.observe(counter));

// ================= GITHUB STATS (LIVE) =================
async function loadGitHubStats() {
  const username = "Shevendra77"; // apna GitHub username yahan daalo

  const reposEl = document.getElementById("stat-repos");
  const starsEl = document.getElementById("stat-stars");
  const followersEl = document.getElementById("stat-followers");
  const contribEl = document.getElementById("stat-contributions");

  // helper: animate number counting up
  function animateNumber(el, target) {
    if (!el) return;
    let current = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + "+";
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + "+";
      }
    }, stepTime);
  }

  try {
    // 1. Basic profile data (repos count, followers)
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userRes.json();

    animateNumber(reposEl, userData.public_repos || 0);
    animateNumber(followersEl, userData.followers || 100);

    // 2. Total stars across all repos (loop through repos, sum stargazers_count)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const reposData = await reposRes.json();

    let totalStars = 0;
    if (Array.isArray(reposData)) {
      totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 7);
    }
    animateNumber(starsEl, totalStars);

  } catch (err) {
    console.error("GitHub stats error:", err);
    if (reposEl) reposEl.textContent = "N/A";
    if (starsEl) starsEl.textContent = "N/A";
    if (followersEl) followersEl.textContent = "N/A";
  }

  // 3. Contributions (GitHub REST API doesn't expose this directly,
  // using a public contributions API as a workaround)
  try {
    const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    const contribData = await contribRes.json();
    const total = contribData.total?.lastYear ?? contribData.total?.[new Date().getFullYear()] ?? 0;
    animateNumber(contribEl, total);
  } catch (err) {
    console.error("Contributions fetch error:", err);
    if (contribEl) contribEl.textContent = "N/A";
  }
}

document.addEventListener("DOMContentLoaded", loadGitHubStats);


// ================= CONTACT FORM (EMAILJS) =================
document.addEventListener("DOMContentLoaded", () => {

  // Initialize EmailJS
  emailjs.init("meOHQ52EOaPgXP3uO");

  // Contact Form
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector(".contact-btn");
      const originalText = submitBtn ? submitBtn.textContent : "";

      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }

      emailjs.sendForm(
        "service_0opjoc2",
        "template_0u8kj8o",
        this
      )
      .then(() => {
        alert("✅ Message sent successfully!");
        contactForm.reset();
      })
      .catch((error) => {
        console.error(error);
        alert("❌ Failed to send message. Please try again.");
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    });
  }

});

// ================= BACK TO TOP BUTTON =================
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});