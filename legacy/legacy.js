document.addEventListener('DOMContentLoaded', () => {
    
    // CSS for the modal overlay and popup
const styles = `
@keyframes pop-up-mob {
   0% {
       opacity: 0;
       transform: translate(-50%, -40%) scale(0.8);
   }
   100% {
       opacity: 1;
       transform: translate(-50%, -50%) scale(1);
   }
}

@keyframes pop-out-mob {
   0% {
       opacity: 1;
       transform: translate(-50%, -50%) scale(1);
   }
   100% {
       opacity: 0;
       transform: translate(-50%, -60%) scale(0.8);
   }
}

@keyframes fade-in {
   from { opacity: 0; }
   to { opacity: 1; }
}

@keyframes fade-out {
   from { opacity: 1; }
   to { opacity: 0; }
}

.modal-overlay {
   display: none;
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.5);
   z-index: 999;
   opacity: 0;
}

.modal-overlay.visible {
   animation: fade-in 0.3s ease-out forwards;
}

.modal-overlay.hiding {
   animation: fade-out 0.3s ease-out forwards;
}

.modal-content {
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background-color: white;
   padding: 20px;
   border-radius: 8px;
   max-width: 90%;
   width: 300px;
   z-index: 1000;
   opacity: 0;
    max-height: 70%;
   overflow-y: auto;
}

.modal-content.showing {
   animation: pop-up-mob 0.3s ease-out forwards;
}

.modal-content.hiding {
   animation: pop-out-mob 0.3s ease-out forwards;
}

.close-button {
   position: absolute;
   top: 10px;
   right: 10px;
   border: none;
   background: none;
   font-size: 24px;
   cursor: pointer;
   padding: 5px;
   width: 30px;
   height: 30px;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 50%;
}

.close-button:hover {
   background-color: rgba(0, 0, 0, 0.1);
}

.modal-inner-content {
   margin-top: 10px;
   padding-right: 20px;
}

@media (min-width: 768px) {
   .modal-overlay {
       display: none !important;
   }
}`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create modal elements
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
const modalContent = document.createElement('div');
modalContent.className = 'modal-content';
const closeButton = document.createElement('button');
closeButton.className = 'close-button';
closeButton.innerHTML = '×';
const modalInnerContent = document.createElement('div');
modalInnerContent.className = 'modal-inner-content';

modalContent.appendChild(closeButton);
modalContent.appendChild(modalInnerContent);
modalOverlay.appendChild(modalContent);
document.body.appendChild(modalOverlay);

const infoBox = document.getElementById('info-box');
const citations = document.querySelectorAll('.citation');

// Helper function to check if device is mobile
function isMobileDevice() {
   return window.innerWidth < 768;
}

citations.forEach(citation => {
   // Handle both click and hover events
   citation.addEventListener('click', (event) => {
       const infoText = event.target.getAttribute('data-info');
       
       if (isMobileDevice()) {
           // Mobile behavior - show modal
           modalInnerContent.innerHTML = infoText;
           modalOverlay.style.display = 'block';
           // Add animation classes after a brief delay to ensure display: block has taken effect
           requestAnimationFrame(() => {
               modalOverlay.classList.add('visible');
               modalContent.classList.add('showing');
           });
           document.body.style.overflow = 'hidden';
       }
   });

   // Desktop hover behavior
   citation.addEventListener('mouseenter', (event) => {
       if (!isMobileDevice()) {
           const infoText = event.target.getAttribute('data-info');
           infoBox.innerHTML = infoText;
           infoBox.style.display = 'block';
           infoBox.style.animation = 'pop-up 0.3s ease-out forwards';
           positionInfoBox(event);
       }
   });

   citation.addEventListener('mousemove', (event) => {
       if (!isMobileDevice()) {
           positionInfoBox(event);
       }
   });

   citation.addEventListener('mouseleave', () => {
       if (!isMobileDevice()) {
           infoBox.style.animation = 'pop-out 0.3s ease-out forwards';
       }
   });
});

// Close modal function
function closeModal() {
   modalOverlay.classList.add('hiding');
   modalContent.classList.add('hiding');
   modalContent.classList.remove('showing');
   
   // Wait for animation to complete before hiding
   setTimeout(() => {
       modalOverlay.style.display = 'none';
       modalOverlay.classList.remove('visible', 'hiding');
       modalContent.classList.remove('hiding');
       document.body.style.overflow = '';
   }, 300); // Match animation duration
}

// Close modal when clicking close button
closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (event) => {
   if (event.target === modalOverlay) {
       closeModal();
   }
});

function positionInfoBox(event) {
   const windowWidth = window.innerWidth;
   const windowHeight = window.innerHeight;
   const mouseX = event.clientX;
   const mouseY = event.clientY;
   const infoBoxWidth = infoBox.offsetWidth;
   const infoBoxHeight = infoBox.offsetHeight;

   let xOffset = 0;
   let yOffset = 0;

   // Determine the section based on mouseX and mouseY
   // Top-left
   if (mouseX < windowWidth / 3 && mouseY < windowHeight / 3) {
       xOffset = 10;
       yOffset = 10;
   }
   // Top-center
   else if (mouseX >= windowWidth / 3 && mouseX <= 2 * windowWidth / 3 && mouseY < windowHeight / 3) {
       xOffset = -infoBoxWidth / 2;
       yOffset = 10;
   }
   // Top-right
   else if (mouseX > 2 * windowWidth / 3 && mouseY < windowHeight / 3) {
       xOffset = -infoBoxWidth - 10;
       yOffset = 10;
   }
   // Center-left
   else if (mouseX < windowWidth / 3 && mouseY >= windowHeight / 3 && mouseY <= 2 * windowHeight / 3) {
       xOffset = 10;
       yOffset = -infoBoxHeight / 2;
   }
   // Center
   else if (mouseX >= windowWidth / 3 && mouseX <= 2 * windowWidth / 3 && mouseY >= windowHeight / 3 && mouseY <= 2 * windowHeight / 3) {
        xOffset = -infoBoxWidth / 2;
       yOffset = 10;
   }
   // Center-right
   else if (mouseX > 2 * windowWidth / 3 && mouseY >= windowHeight / 3 && mouseY <= 2 * windowHeight / 3) {
       xOffset = -infoBoxWidth - 10;
       yOffset = -infoBoxHeight / 2;
   }
   // Bottom-left
   else if (mouseX < windowWidth / 3 && mouseY > 2 * windowHeight / 3) {
       xOffset = 10;
       yOffset = -infoBoxHeight - 10;
   }
   // Bottom-center
   else if (mouseX >= windowWidth / 3 && mouseX <= 2 * windowWidth / 3 && mouseY > 2 * windowHeight / 3) {
       xOffset = -infoBoxWidth / 2;
       yOffset = -infoBoxHeight - 10;
   }
   // Bottom-right
   else if (mouseX > 2 * windowWidth / 3 && mouseY > 2 * windowHeight / 3) {
       xOffset = -infoBoxWidth - 10;
       yOffset = -infoBoxHeight - 10;
   }

   const left = Math.min(Math.max(mouseX + xOffset, 0), windowWidth - infoBoxWidth);
   const top = Math.min(Math.max(mouseY + yOffset, 0), windowHeight - infoBoxHeight);

   infoBox.style.left = `${left}px`;
   infoBox.style.top = `${top}px`;
}
   
   const menuLinks = document.querySelector('.menu-links');

   // Ensure the menu links are visible initially on small screens
   if (window.innerWidth <= 768) {
       menuLinks.style.display = 'flex'; // Show the menu links
       menuLinks.classList.add('show');  // Add the show class to ensure it’s visible
   }

   // Attach the scroll event listener to automatically collapse the menu on scroll
//    window.addEventListener('scroll', collapseOnScroll);
   // Attach the resize event listener
   window.addEventListener('resize', handleResize);
});


// Function to toggle the menu links on hamburger icon click 
function toggleMenu() {
   const menuLinks = document.querySelector('.menu-links');

   if (menuLinks.classList.contains('show')) {
       // If the menu is currently shown, hide it
       menuLinks.classList.remove('show');
       menuLinks.classList.add('hide');

       // Wait for the animation to finish before setting display to none
       setTimeout(() => {
           menuLinks.style.display = 'none';
           menuLinks.classList.remove('hide'); // Reset for next toggle
       }, 500); // Match this duration to the CSS animation duration
   } else {
       // If the menu is hidden, show it
       menuLinks.style.display = 'flex';
       menuLinks.classList.add('show');
   }
}

// Function to collapse the menu links automatically on scroll for smaller screens
// function collapseOnScroll() {
//    const menuLinks = document.querySelector('.menu-links');

//    if (window.innerWidth <= 768) {
//        // Hide the menu links whenever the user scrolls down
//        if (menuLinks.classList.contains('show')) {
//            menuLinks.classList.remove('show');
//            menuLinks.classList.add('hide');

//            // Wait for the animation to finish before setting display to none
//            setTimeout(() => {
//                menuLinks.style.display = 'none';
//                menuLinks.classList.remove('hide'); // Reset for next toggle
//            }, 500); // Match this duration to the CSS animation duration
//        }
//    }
// }

// Function to handle window resize and reset menu links state
function handleResize() {
   const menuLinks = document.querySelector('.menu-links');
   if (window.innerWidth > 768) {
       // Ensure the menu links are visible on large screens
       menuLinks.style.display = 'flex';
       menuLinks.classList.remove('show');
   } else {
       // Hide menu links if the screen is small
       menuLinks.style.display = 'flex'; // Ensure it's visible initially
   }
}



var targetjsonFile;
function showDiv(divId) {
   // Hide the menu container
   const jsonFiles = {
       'div1': 'rational',
       'div2': 'scientific',
       'div3':'inspirational',
       'div4':'reactions',
       'div5':'verses',
       // Add other mappings for 'div3' and 'div4' if needed
   };
   document.querySelector('.menu-container').style.display = 'none';
   targetjsonFile = jsonFiles[divId];
       // Fetch the JSON data
       // console.log("target: "+targetjsonFile);
       if (targetjsonFile === 'rational' || targetjsonFile === 'scientific' || targetjsonFile === 'inspirational' || targetjsonFile === 'reactions' || targetjsonFile === 'verses') {
        // Show loading spinner before fetching data
        showLoadingSpinner();
    
        fetch('https://reflectserver.github.io/Content/' + targetjsonFile + '.json')
            .then(response => response.json())
            .then(data => {
                // Call function to render the table
                if (targetjsonFile === 'rational' || targetjsonFile === 'scientific' || targetjsonFile === 'inspirational' || targetjsonFile === 'reactions') {
                    renderTable(data);
                }
                if (targetjsonFile === 'verses') {
                    renderVerse(data);
                }
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
        // Clear the content of #content-container
        setTimeout(() => {
            // Get all the content-div elements
            const contentContainers = document.querySelectorAll('.content-div');

            // Loop through each .content-div and clear its content
            contentContainers.forEach(contentContainer => {
                contentContainer.innerHTML = ''; // Clear existing content
            
                // Display the error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = `
                    <div class="error-icon">🚨</div>
                    <h2>Oops! Something went wrong. 😔</h2>
                    <p>Server did not respond. Please try again later.</p>
                    <p class="error-details">The following errors were caught:</p>
                    <pre class="error-text">${error}</pre>
                `;
                errorMessage.style.color = '#D8000C';
                errorMessage.style.backgroundColor = '#FFF6F6';
                errorMessage.style.textAlign = 'center';
                errorMessage.style.margin = '20px auto';
                errorMessage.style.padding = '20px';
                errorMessage.style.border = '1px solid #D8000C';
                errorMessage.style.borderRadius = '10px';
                errorMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                errorMessage.style.fontFamily = 'Arial, sans-serif';
                errorMessage.style.width = '90%';
                errorMessage.style.maxWidth = '600px';
                errorMessage.style.animation = 'fadeIn 0.5s ease-in-out';
            
                contentContainer.appendChild(errorMessage);
            });
            
            // CSS styles for modern aesthetics
            const style = document.createElement('style');
            style.innerHTML = `
                .error-message .error-icon {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    animation: shake 0.5s ease-in-out;
                }
            
                .error-message h2 {
                    margin: 0;
                    font-size: 1.8rem;
                    color: #D8000C;
                }
            
                .error-message p {
                    margin: 10px 0;
                    font-size: 1rem;
                    color: #4F4F4F;
                }
            
                .error-message .error-details {
                    font-weight: bold;
                    margin-top: 15px;
                }
            
                .error-message .error-text {
                    background-color: #F9F2F4;
                    color: #900;
                    padding: 10px;
                    border: 1px solid #D8000C;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 0.9rem;
                    white-space: pre-wrap;
                    text-align: left;
                    margin: 10px auto;
                    overflow: auto;
                }
            
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            
                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-5px);
                    }
                    50% {
                        transform: translateX(5px);
                    }
                    75% {
                        transform: translateX(-5px);
                    }
                }
            `;
            document.head.appendChild(style);
            
        }, 1000); // Delay of 5 seconds
    
            });
    }
    
    // Add keyframes for spinner animation in JavaScript
    const style = document.createElement('style');
    style.textContent = `
       @keyframes spin {
    0% { 
        transform: rotate(0deg);
        opacity: 0.8;
    }
    25% { 
        transform: rotate(90deg);
        opacity: 1;
    }
    50% { 
        transform: rotate(180deg);
        opacity: 0.8;
    }
    75% { 
        transform: rotate(270deg);
        opacity: 1;
    }
    100% { 
        transform: rotate(360deg);
        opacity: 0.8;
    }
}

    `;
    document.head.appendChild(style);


   // Function to render the table
// Function to render the verses
function renderVerse(data) {
   const verseContainer = document.querySelector('.verse-container');

   // Clear existing content
   verseContainer.innerHTML = '';

   // Loop through the JSON data and create an h2 element for each verse
   data.forEach((item) => {
       // Create a new h2 element
       // const verseElement = document.createElement('h2');
       
       // Create an h4 element for the verse content
       const verseContent = document.createElement('h4');
       verseContent.classList.add('pop-up-animate'); // Add the verse-style class
       verseContent.innerHTML = `"
           ${item.verse}"<br>[Quran: <a href='https://quran.com/${item.chapterNo}?startingVerse=${item.verseNo}' target="_blank">${item.chapterNo}:${item.verseNo}</a>]
       `;

       // Append the h4 element to the h2 element
       // verseElement.appendChild(verseContent);

       // Append the h2 element to the verse container
       verseContainer.appendChild(verseContent);
       verseContainer.appendChild(document.createElement('br'));
       verseContainer.appendChild(document.createElement('br'));
   });
   hideLoadingSpinner();
}

   
   
function showLoadingSpinner() {
    const tableContainers = document.querySelectorAll(`.content-div`); // Select all divs with class 'content-div'

for (let div of tableContainers) {
    // Create a new spinner for each div
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = `
        position: absolute; /* Spinner is relative to each div */
        top: 60%; /* Center vertically */
        left: 50%; /* Center horizontally */
        transform: translate(-50%, -50%); /* Adjust for perfect centering */
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    // Ensure the parent div has relative positioning
    div.style.position = 'relative';

    // Append the spinner to the current div
    div.appendChild(spinner);
}

}

function hideLoadingSpinner() {
    const spinners = document.querySelectorAll('.loading-spinner'); // Select all spinners
    spinners.forEach(spinner => spinner.remove()); // Remove each spinner
}

function renderTable(data) {
    const tableBody = document.querySelector(`.${targetjsonFile} tbody`);

    // Clear any existing content
    tableBody.innerHTML = '';

    // Simulate a delay to test the loading spinner

        // Loop through the JSON data and create rows
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>
                    <a href="${item.channelLink}" target="_blank">
                        <img src="${item.channelImage}" style="height: 20px; width: 20px;">
                        ${item.channelName}
                    </a>
                </td>
                <td>
                    <a href="${item.link}" target="_blank">${item.title}</a>
                    <br>
                    <a href="${item.link}" target="_blank">
                        <img src="${item.thumbnail}" 
                            alt="Dummy row (Ignore this)" 
                            style="height: 100px; width: 200px;" 
                            loading="lazy">
                    </a>
                </td>
                <td class="responsive-description">${item.description}</td>
                <td><a href="${item.link}" target="_blank">Visit</a></td>
            `;

            // Append the row to the table body
            tableBody.appendChild(row);
        });

        // Hide the spinner after rendering the table
        hideLoadingSpinner();
}
   
   
   // Hide all content divs
   const divs = document.getElementsByClassName('content-div');
   for (let div of divs) {
       div.style.display = 'none';
   }
   
   // Show the selected div
   const selectedDiv = document.getElementById(divId);
   selectedDiv.style.display = 'block';

   // Find the table in the selected div
   const table = selectedDiv.querySelector('table');

   // Remove the animation class if it's already there
   if (table) {
       table.classList.remove('pop-up-animate');
       // selectedDiv.classList.remove('pop-up-animate');
       //mouseover
       //mouseout
       // Force reflow to restart the animation
       void table.offsetWidth;
       // void selectedDiv.offsetWidth;

       // Add the animation class to trigger the effect
       table.classList.add('pop-up-animate');
       // selectedDiv.classList.add('pop-up-animate');
   }

   // Buttons mapping
   const buttons = [
       { id: 'men-d1', targetDiv: 'div1' },
       { id: 'men-d2', targetDiv: 'div2' },
       { id: 'men-d3', targetDiv: 'div3' },
       { id: 'men-d4', targetDiv: 'div4' },
       { id: 'men-d5', targetDiv: 'div5' },
       { id: 'men-d6', targetDiv: 'div6'},
       { id: 'men-d7', targetDiv: 'div7'},
   ];

   // Loop through buttons and apply styles
   buttons.forEach(button => {
       const btnElement = document.getElementById(button.id);
       const isSelected = button.targetDiv === divId;

       // Reset button styles
       btnElement.style.backgroundColor = 'white';
       btnElement.style.color = 'black';
       btnElement.style.position = 'relative';
       btnElement.style.overflow = 'hidden';
       btnElement.style.outline = 'none';

       
       // Remove any existing swipe effect
       const existingHighlight = btnElement.querySelector('.swipe-highlight');
       if (existingHighlight) {
           btnElement.removeChild(existingHighlight);
       }

       if (isSelected) {
           // Change the text color for the selected button
           btnElement.style.color = 'black';

           // Create a swipe effect for the selected button
           const swipeHighlight = document.createElement('div');
           swipeHighlight.classList.add('swipe-highlight');
           swipeHighlight.style.position = 'absolute';
           swipeHighlight.style.top = '0';
           swipeHighlight.style.left = '-100%';
           swipeHighlight.style.width = '100%';
           swipeHighlight.style.height = '100%';
           //onhover effect to swipehighlight
           btnElement.classList.remove('pop-up-animate1');
           // void btnElement.offsetWidth;
           btnElement.classList.add('pop-up-animate1');
           swipeHighlight.style.backgroundColor = 'rgba(46, 170, 5, 0.5)';
           swipeHighlight.style.transition = 'left 0.4s ease';
           
           // Animate the swipe effect
           setTimeout(() => {
               swipeHighlight.style.left = '0';
           }, 50);

           // Add swipe highlight to the button
           btnElement.appendChild(swipeHighlight);
       }
   });
}

// Apply animation when the page loads initially
window.onload = function() {
   showDiv('div1');
};

document.addEventListener('DOMContentLoaded', (event) => {
   
   // Wait for 1.3 seconds (1300 milliseconds)
   setTimeout(() => {
       // Select all elements with class names swipers and swipers1
       const swipersElements = document.querySelectorAll('.swipers, .swipers1,.swipers2');

       // Add the 'start' class to each selected element
       swipersElements.forEach((element) => {
           element.classList.add('start');
       });
   }, 1300); // Delay in milliseconds
});



// Get elements
const panelIcon = document.getElementById("panelIcon");
const panelIcon2 = document.getElementById("panelIcon2");
const panelpopup = document.getElementById("popup");
const panelclosePopup = document.getElementById("closePopup");

// Open the popup when the panel icon is clicked
panelIcon.onclick = function() {
   panelpopup.style.display = "block";
}
panelIcon1.onclick = function() {
   panelpopup.style.display = "block";
}

// Close the popup when the close button is clicked
panelclosePopup.onclick = function() {
   panelpopup.style.display = "none";
}

// Close the popup when clicking outside of the popup content
window.onclick = function(event) {
   if (event.target == panelpopup) {
       panelpopup.style.display = "none";
   }
}
document.querySelectorAll('button[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetSelector = this.getAttribute('href');
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            // Scroll into view if the target element exists
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            console.log("scrolled scrolled !")
        } 
    });
});
