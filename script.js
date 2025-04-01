document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const slider = document.getElementById('feelings-slider');
    const currentEmoji = document.getElementById('current-emoji');
    const confirmBtn = document.getElementById('confirm-btn');
    const feelingsCard = document.getElementById('feelings-card');
    const responseCard = document.getElementById('response-card');
    const responseTitle = document.getElementById('response-title');
    const responseGif = document.getElementById('response-gif');
    const motivationText = document.getElementById('motivation-text');
    const feelingDescription = document.getElementById('feeling-description');
    const sliderSegments = document.querySelectorAll('.slider-segment');

    // Emojis for each level (1-10)
    const emojis = [
        '😭', // Level 1
        '😢', // Level 2
        '😔', // Level 3
        '😕', // Level 4
        '😐', // Level 5
        '🙂', // Level 6
        '😊', // Level 7
        '😄', // Level 8
        '😁', // Level 9
        '🤩'  // Level 10
    ];

    // Feeling descriptions for each level (1-10)
    const feelingDescriptions = [
        "Totally down today...", // Level 1
        "It was a rough day", // Level 2
        "Not feeling my too good", // Level 3
        "A bit under the weather", // Level 4
        "Not too bad", // Level 5
        "Feeling okay", // Level 6
        "Everything was alright", // Level 7
        "Awesome!", // Level 8
        "It was a really lovely day!", // Level 9
        "On top of the world!!!" // Level 10
    ];

    // Colors for highlighting the current segment - white-pink to pink gradient
    const colors = [
        '#fff9fc', // Level 1 - Almost white with hint of pink
        '#ffecf2', // Level 2 - Very light pink
        '#ffdfe9', // Level 3 - Light pink
        '#ffd1e0', // Level 4 - Lighter medium pink
        '#ffc4d8', // Level 5 - Light medium pink
        '#ffb6cf', // Level 6 - Medium pink
        '#ffa8c7', // Level 7 - Medium-dark pink
        '#ff9abe', // Level 8 - Darker pink
        '#ff8cb6', // Level 9 - Deep pink
        '#ff7eae'  // Level 10 - Intense pink
    ];

    // GIFs for each range
    const gifs = {
        low: [
            'images/empathy.gif'
        ],
        medium: [
            'https://media.giphy.com/media/XD9o33QG9BoMis7iM4/giphy.gif',
            'https://media.giphy.com/media/l41m4ODfe8PwHlsUU/giphy.gif',
            'https://media.giphy.com/media/l41lUjUgLLwWrz20w/giphy.gif'
        ],
        high: [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjI3aWY2b25ybHI1Y3M4YXc1MWxobWJnaGhpaG8zcnRmbjY1cDJpbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif',
            'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
            'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif'
        ]
    };

    // Flag to track if slider has been interacted with
    let sliderInteracted = false;

    // Update emoji, segments, and description based on slider value
    function updateDisplay() {
        const level = parseInt(slider.value);
        const adjustedLevel = level - 1; // Adjust for 0-based arrays
        
        // Always show emoji and update description
        currentEmoji.textContent = emojis[adjustedLevel];
        feelingDescription.textContent = feelingDescriptions[adjustedLevel];
        
        // Update all segments based on level
        sliderSegments.forEach((segment, index) => {
            if (index < adjustedLevel) {
                // Fill all segments up to current level
                segment.style.backgroundColor = colors[index];
                segment.style.opacity = '0.85';
            } else if (index === adjustedLevel) {
                // Current level gets highlighted
                segment.style.backgroundColor = colors[index];
                segment.style.opacity = '1';
                segment.classList.add('active');
            } else {
                // Reset segments after current level
                segment.style.backgroundColor = 'transparent';
                segment.style.opacity = '1';
                segment.classList.remove('active');
            }
        });
        
        // Enable confirm button only if user has interacted with slider
        confirmBtn.disabled = !sliderInteracted;
    }

    // Initialize state
    slider.addEventListener('input', updateDisplay);
    
    // Make segments clickable with improved click detection
    sliderSegments.forEach((segment, index) => {
        segment.addEventListener('click', (event) => {
            // Prevent event bubbling
            event.stopPropagation();
            
            // Set slider value to segment index + 1
            slider.value = index + 1;
            sliderInteracted = true;
            
            // Update display and enable confirm button
            updateDisplay();
            confirmBtn.disabled = false;
            
            // Also trigger the initialSliderUpdate if it's the first interaction
            if (slider.hasAttribute('data-first-interaction')) {
                slider.removeAttribute('data-first-interaction');
                slider.removeEventListener('input', initialSliderUpdate);
            }
        });
    });

    // Create a direct click handler for the first segment
    const firstSegment = sliderSegments[0];
    if (firstSegment) {
        firstSegment.addEventListener('click', function(event) {
            console.log('First segment clicked'); // Debug message
            // Stop event propagation
            event.stopPropagation();
            // Force select first segment
            slider.value = 1;
            sliderInteracted = true;
            updateDisplay();
            confirmBtn.disabled = false;
            
            // Also handle first interaction
            if (slider.hasAttribute('data-first-interaction')) {
                slider.removeAttribute('data-first-interaction');
                slider.removeEventListener('input', initialSliderUpdate);
            }
        });
    }

    // Add click handler to track for more precise click detection
    document.querySelector('.slider-track').addEventListener('click', (event) => {
        // Get track dimensions
        const track = event.currentTarget;
        const trackRect = track.getBoundingClientRect();
        const trackWidth = trackRect.width;
        
        // Calculate which segment was clicked based on X position
        const clickX = event.clientX - trackRect.left;
        const segmentWidth = trackWidth / 10; // 10 segments
        
        // First calculate the raw segment index
        let segmentIndex = Math.floor(clickX / segmentWidth);
        
        // Special adjustments for better edge detection
        if (segmentIndex === 1) {
            // For second segment (index 1), shrink its leftmost 20% to give to first segment
            const segmentPosition = clickX - segmentIndex * segmentWidth;
            if (segmentPosition < segmentWidth * 0.2) {
                segmentIndex = 0; // Give this area to first segment
            }
        } 
        else if (segmentIndex === 8) {
            // For second-to-last segment (index 8), shrink its rightmost 20% to give to last segment
            const segmentPosition = clickX - segmentIndex * segmentWidth;
            if (segmentPosition > segmentWidth * 0.8) {
                segmentIndex = 9; // Give this area to last segment
            }
        }
        // Extra safeguards for the absolute edges
        else if (clickX <= segmentWidth * 0.1) {
            segmentIndex = 0; // First 10% of track always selects first segment
        } 
        else if (clickX >= trackWidth * 0.9) {
            segmentIndex = 9; // Last 10% of track always selects last segment
        }
        
        // Special case for clicks near the left edge
        if (clickX <= segmentWidth * 0.3) { // Increase detection area for first segment
            console.log('Left edge of track clicked');
            segmentIndex = 0;
        }
        
        // Ensure index is within bounds (0-9)
        segmentIndex = Math.max(0, Math.min(9, segmentIndex));
        
        // Update slider value (1-10)
        slider.value = segmentIndex + 1;
        sliderInteracted = true;
        
        // Update display and enable confirm button
        updateDisplay();
        confirmBtn.disabled = false;
        
        // Also trigger the initialSliderUpdate if it's the first interaction
        if (slider.hasAttribute('data-first-interaction')) {
            slider.removeAttribute('data-first-interaction');
            slider.removeEventListener('input', initialSliderUpdate);
        }
    });

    // Initialize with neutral state
    slider.value = 1;
    confirmBtn.disabled = true; // Disabled until user interacts
    feelingDescription.textContent = "How are you feeling today?";
    currentEmoji.textContent = "🤔";

    // No segments highlighted initially
    sliderSegments.forEach(segment => {
        segment.style.backgroundColor = 'transparent';
        segment.classList.remove('active');
    });

    // Mark the slider as needing first interaction
    slider.setAttribute('data-first-interaction', 'true');

    // Handle first interaction - modified to use attribute
    const initialSliderUpdate = () => {
        sliderInteracted = true;
        updateDisplay();
        // Enable the confirm button after interaction
        confirmBtn.disabled = false;
        // Remove the initial listener and the attribute
        slider.removeEventListener('input', initialSliderUpdate);
        slider.removeAttribute('data-first-interaction');
    };

    slider.addEventListener('input', initialSliderUpdate);

    // Confirm button handler
    confirmBtn.addEventListener('click', function() {
        const level = parseInt(slider.value);
        
        // Different response based on mood level
        if (level <= 4) {
            // Low mood response (levels 1-4)
            responseTitle.textContent = "I'm here, gorgeous!";
            responseTitle.style.color = '#ffa6ca';
            
            // Use empathy.gif for low moods with loop and container class
            responseGif.innerHTML = `<img src="images/empathy.gif" alt="Empathy GIF" loop autoplay>`;
            responseGif.classList.add('empathy-gif-container'); // Add special class for empathy GIF
            
            // Use the specific message for empathy card
            motivationText.textContent = "I wish I could give you a big hug right now. Take it easy today. I know you've tried your best. Tomorrow would definitely be a better day! 💕";
        } else if (level <= 6) {
            // Medium-low mood response (levels 5-6)
            responseTitle.textContent = "It's okay!";
            responseTitle.style.color = '#ff8cb6';
            
            // Use its-okay.gif for medium-low moods
            responseGif.innerHTML = `<img src="images/its-okay.gif" alt="It's Okay GIF">`;
            responseGif.classList.remove('empathy-gif-container');
            
            // Use the specific message for 5-6 level
            motivationText.textContent = "You're stronger than you know. Today is just one day, and tomorrow is a fresh start. Keep shining, gorgeous! 🌈";
        } else {
            // Happy mood response (levels 7-10)
            responseTitle.textContent = "That's great to hear!";
            responseTitle.style.color = '#ff69b4';
            
            // Use nice-job.gif for high moods (7-10)
            responseGif.innerHTML = `<img src="images/nice-job.gif" alt="Nice Job GIF">`;
            responseGif.classList.remove('empathy-gif-container');
            
            // Use a fixed cute congratulatory message instead of a random one
            motivationText.textContent = "Seeing you happy really makes my day! You definitely deserve all this joy and so much more. Keep that beautiful smile shining! 💖";
        }
        
        // Show the response card and hide the feelings card
        feelingsCard.style.display = 'none';
        responseCard.style.display = 'block';
    });
});
