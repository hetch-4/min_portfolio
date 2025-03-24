// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize EmailJS
(function() {
    try {
        emailjs.init("FZ_VoS-MNQLza6RDa"); // You need to replace this with your actual public key from EmailJS
        console.log("EmailJS initialized successfully");
    } catch (error) {
        console.error("Failed to initialize EmailJS:", error);
        showNotification("Email service initialization failed", "error");
    }
})();

// Utility function to show notifications
function showNotification(message, type = "success") {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Form validation function
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    const name = formData.get('user_name');
    if (!/^[A-Za-z ]{2,50}$/.test(name)) {
        errors.push("Name should be between 2 and 50 characters and contain only letters");
    }
    
    // Email validation
    const email = formData.get('user_email');
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errors.push("Please enter a valid email address");
    }
    
    // Message validation
    const message = formData.get('message');
    if (message.length < 10 || message.length > 500) {
        errors.push("Message should be between 10 and 500 characters");
    }
    
    return errors;
}

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        errors.forEach(error => showNotification(error, "error"));
        return;
    }
    
    // Show sending state
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.classList.add('sending');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Prepare template parameters with sanitized data
    const templateParams = {
        from_name: formData.get('user_name').trim(),
        from_email: formData.get('user_email').trim(),
        message: formData.get('message').trim(),
        to_email: 'Humphreydola@gmail.com',
        timestamp: new Date().toISOString()
    };

    try {
        // Show loading notification
        showNotification("Sending your message...", "loading");
        
        // Send email using EmailJS
        const response = await emailjs.send(
            'service_nz6m5mn',
            'template_zeargzf',
            templateParams
        );

        console.log("Email sent successfully:", response);
        showNotification("Message sent successfully! We'll get back to you soon.", "success");
        this.reset();
        
    } catch (error) {
        console.error("Failed to send email:", error);
        showNotification("Failed to send message. Please try again later.", "error");
        
    } finally {
        // Reset button state
        submitButton.classList.remove('sending');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Real-time form validation
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        if (this.validity.valid) {
            formGroup.classList.remove('error');
        } else {
            formGroup.classList.add('error');
        }
    });
});

// Add scroll reveal animations
const revealElements = document.querySelectorAll('.project-card, .about-content, .contact-content');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Modal functionality
const modal = document.getElementById('projectModal');
const modalIframe = document.getElementById('modalIframe');
const closeModal = document.querySelector('.close-modal');

function openModal(element) {
    const iframe = element.querySelector('iframe');
    modalIframe.src = iframe.src;
    modal.classList.add('active');
    document.body.classList.add('modal-active');
}

function closeModalHandler() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-active');
    modalIframe.src = '';
}

closeModal.addEventListener('click', closeModalHandler);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalHandler();
    }
});
