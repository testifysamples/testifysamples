
// Global variables for location and demo tracking
let userLocation = null;
let trackingCanvas = null;
let trackingCtx = null;
let animationFrame = null;
let courierProgress = 0;

// Initialize Demo Map Canvas
function initDemoMap() {
    trackingCanvas = document.getElementById('trackingCanvas');
    if (!trackingCanvas) return;

    trackingCtx = trackingCanvas.getContext('2d');

    // Set canvas size
    trackingCanvas.width = trackingCanvas.offsetWidth;
    trackingCanvas.height = trackingCanvas.offsetHeight;

    // Start drawing the map
    drawDemoMap();
}

// Draw the demo tracking map
function drawDemoMap() {
    if (!trackingCtx) return;

    const width = trackingCanvas.width;
    const height = trackingCanvas.height;

    // Clear canvas
    trackingCtx.clearRect(0, 0, width, height);

    // Draw roads (simplified map grid)
    trackingCtx.strokeStyle = '#cbd5e1';
    trackingCtx.lineWidth = 2;

    // Horizontal roads
    for (let i = 1; i < 4; i++) {
        trackingCtx.beginPath();
        trackingCtx.moveTo(0, (height / 4) * i);
        trackingCtx.lineTo(width, (height / 4) * i);
        trackingCtx.stroke();
    }

    // Vertical roads
    for (let i = 1; i < 4; i++) {
        trackingCtx.beginPath();
        trackingCtx.moveTo((width / 4) * i, 0);
        trackingCtx.lineTo((width / 4) * i, height);
        trackingCtx.stroke();
    }

    // Draw main route (from user to lab)
    const startX = width * 0.2;
    const startY = height * 0.7;
    const endX = width * 0.75;
    const endY = height * 0.3;

    // Route line
    trackingCtx.strokeStyle = '#0B6EEF';
    trackingCtx.lineWidth = 4;
    trackingCtx.setLineDash([10, 5]);
    trackingCtx.beginPath();
    trackingCtx.moveTo(startX, startY);
    trackingCtx.lineTo(endX, endY);
    trackingCtx.stroke();
    trackingCtx.setLineDash([]);

    // User location marker (blue)
    drawMarker(startX, startY, '#3b82f6', '📍');
    drawLabel(startX, startY + 25, 'Your Location', '#3b82f6');

    // Lab location marker (green)
    drawMarker(endX, endY, '#22c55e', '🏥');
    drawLabel(endX, endY - 15, 'NCL Pune', '#22c55e');

    // Courier marker (orange) - animated along route
    const courierX = startX + (endX - startX) * courierProgress;
    const courierY = startY + (endY - startY) * courierProgress;
    drawMarker(courierX, courierY, '#FFC43D', '🚚');

    // Add some building icons for context
    drawBuilding(width * 0.15, height * 0.4);
    drawBuilding(width * 0.4, height * 0.2);
    drawBuilding(width * 0.6, height * 0.6);
    drawBuilding(width * 0.85, height * 0.5);
}

function drawMarker(x, y, color, emoji) {
    // Draw marker circle with glow
    trackingCtx.shadowBlur = 15;
    trackingCtx.shadowColor = color;
    trackingCtx.fillStyle = color;
    trackingCtx.beginPath();
    trackingCtx.arc(x, y, 12, 0, Math.PI * 2);
    trackingCtx.fill();
    trackingCtx.shadowBlur = 0;

    // Draw emoji
    trackingCtx.font = '16px Arial';
    trackingCtx.textAlign = 'center';
    trackingCtx.textBaseline = 'middle';
    trackingCtx.fillText(emoji, x, y);
}

function drawLabel(x, y, text, color) {
    trackingCtx.font = 'bold 11px Arial';
    trackingCtx.fillStyle = '#fff';
    trackingCtx.strokeStyle = color;
    trackingCtx.lineWidth = 3;
    trackingCtx.textAlign = 'center';
    trackingCtx.strokeText(text, x, y);
    trackingCtx.fillText(text, x, y);
}

function drawBuilding(x, y) {
    trackingCtx.fillStyle = '#e2e8f0';
    trackingCtx.fillRect(x - 8, y - 8, 16, 16);
    trackingCtx.strokeStyle = '#94a3b8';
    trackingCtx.lineWidth = 1;
    trackingCtx.strokeRect(x - 8, y - 8, 16, 16);
}

// Location services with demo tracking
function enableLocationTracking() {
    const locationStatus = document.getElementById('locationStatus');
    const enableBtn = document.getElementById('enableLocation');

    enableBtn.textContent = 'Activating...';
    enableBtn.disabled = true;

    // Simulate getting location (demo)
    setTimeout(() => {
        userLocation = { lat: 18.5204, lng: 73.8567 }; // Demo location Pune

        locationStatus.innerHTML = '✅ Live tracking enabled';
        enableBtn.textContent = 'Tracking Active';
        enableBtn.classList.remove('btn-primary');
        enableBtn.classList.add('bg-green-500', 'hover:bg-green-600');

        document.getElementById('userLocation').textContent = 'Pune, Maharashtra';

        // Initialize and start demo map
        initDemoMap();
        startCourierAnimation();
    }, 1000);
}

// Animate courier movement on demo map
function startCourierAnimation() {
    let distance = 5.2; // km
    let eta = 12; // minutes

    function animate() {
        courierProgress += 0.005; // Slow movement

        if (courierProgress >= 1) {
            courierProgress = 1;
            document.getElementById('courierStatus').textContent = 'Delivered';
            document.getElementById('routeStatus').textContent = 'Delivered';
            document.getElementById('routeStatus').classList.remove('text-green-600');
            document.getElementById('routeStatus').classList.add('text-blue-600');
            drawDemoMap();
            return;
        }

        // Update distance and ETA
        const remainingDistance = (distance * (1 - courierProgress)).toFixed(1);
        const remainingETA = Math.ceil(eta * (1 - courierProgress));

        document.getElementById('routeDistance').textContent = `${remainingDistance} km`;
        document.getElementById('routeETA').textContent = `${remainingETA} mins`;
        document.getElementById('courierStatus').textContent = `${Math.round(courierProgress * 100)}% to lab`;

        // Redraw map with new courier position
        drawDemoMap();

        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

// Sample order data with requirements
const ordersData = {
    'order1': {
        researcher: 'Dr. Priya Sharma',
        institution: 'IIT Bombay',
        bookingTime: 'Today, 2:30 PM',
        test: 'FTIR Spectroscopy',
        sampleQty: '20 mg',
        requirements: {
            description: 'Polymer powder sample for functional group identification',
            quantity: '20 mg',
            storage: 'Room Temperature',
            urgency: 'Standard (Normal turnaround)',
            specialInstructions: 'Please ensure the sample is completely dry before analysis. Focus on the carbonyl and hydroxyl regions.',
            safetyFlags: {
                hazardous: false,
                flammable: false,
                toxic: false,
                biological: false,
                airSensitive: true
            },
            expectedResults: 'Expecting peaks around 1715 cm⁻¹ (C=O) and 3200-3600 cm⁻¹ (O-H)',
            contactPreference: 'Email'
        }
    },
    'order2': {
        researcher: 'Prof. Rajesh Kumar',
        institution: 'IISC Bangalore',
        bookingTime: 'Today, 11:15 AM',
        test: 'SEM Analysis',
        sampleQty: '30 mg',
        requirements: {
            description: 'Nanoparticle sample for morphology and size distribution analysis',
            quantity: '30 mg',
            storage: 'Desiccated (Moisture-sensitive)',
            urgency: 'Priority (Faster processing - additional charges may apply)',
            specialInstructions: 'Sample is highly moisture sensitive. Please handle in dry environment. Looking for particle size distribution analysis with EDX mapping.',
            safetyFlags: {
                hazardous: false,
                flammable: false,
                toxic: false,
                biological: false,
                airSensitive: true
            },
            expectedResults: 'Expecting uniform spherical particles in the range of 50-200 nm',
            contactPreference: 'WhatsApp'
        }
    }
};

// Show order details modal
function showOrderDetails(orderId) {
    const order = ordersData[orderId];
    if (!order) return;

    const orderDetailsContent = document.getElementById('orderDetailsContent');
    const req = order.requirements;

    // Build safety flags list
    const safetyFlags = [];
    if (req.safetyFlags.hazardous) safetyFlags.push('Hazardous materials');
    if (req.safetyFlags.flammable) safetyFlags.push('Flammable');
    if (req.safetyFlags.toxic) safetyFlags.push('Toxic or corrosive');
    if (req.safetyFlags.biological) safetyFlags.push('Biological/infectious material');
    if (req.safetyFlags.airSensitive) safetyFlags.push('Air/moisture sensitive');

    orderDetailsContent.innerHTML = `
        <!-- Researcher Information -->
        <div class="mb-6">
          <h4 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Researcher Information
          </h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Name</p>
              <p class="font-semibold text-slate-900">${order.researcher}</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Institution</p>
              <p class="font-semibold text-slate-900">${order.institution}</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Booking Time</p>
              <p class="font-semibold text-slate-900">${order.bookingTime}</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Contact Preference</p>
              <p class="font-semibold text-slate-900">${req.contactPreference}</p>
            </div>
          </div>
        </div>

        <!-- Test Information -->
        <div class="mb-6">
          <h4 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            Test Details
          </h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Test Type</p>
              <p class="font-semibold text-slate-900">${order.test}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Sample Quantity</p>
              <p class="font-semibold text-slate-900">${order.sampleQty}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Urgency Level</p>
              <p class="font-semibold text-slate-900">${req.urgency}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-slate-600 mb-1">Storage Conditions</p>
              <p class="font-semibold text-slate-900">${req.storage}</p>
            </div>
          </div>
        </div>

        <!-- Sample Requirements -->
        <div class="mb-6">
          <h4 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Sample Description & Requirements
          </h4>
          <div class="bg-slate-50 p-4 rounded-lg mb-4">
            <p class="text-sm text-slate-600 mb-2 font-semibold">Sample Description</p>
            <p class="text-slate-900">${req.description}</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg mb-4">
            <p class="text-sm text-slate-600 mb-2 font-semibold">Quantity Provided</p>
            <p class="text-slate-900">${req.quantity}</p>
          </div>
          ${req.specialInstructions ? `
          <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p class="text-sm text-slate-600 mb-2 font-semibold flex items-center gap-2">
              <span>⚠️</span> Special Instructions for Technician
            </p>
            <p class="text-slate-900">${req.specialInstructions}</p>
          </div>
          ` : ''}
        </div>

        <!-- Safety Considerations -->
        ${safetyFlags.length > 0 ? `
        <div class="mb-6">
          <h4 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Safety Considerations
          </h4>
          <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
            <ul class="space-y-2">
              ${safetyFlags.map(flag => `
                <li class="flex items-center gap-2 text-slate-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  ${flag}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        <!-- Expected Results -->
        ${req.expectedResults ? `
        <div class="mb-6">
          <h4 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            Expected Results / Hypothesis
          </h4>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-slate-900">${req.expectedResults}</p>
          </div>
        </div>
        ` : ''}

        <!-- Set Time to Perform -->
        <div class="mb-4">
          <h4 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Schedule Test Execution
          </h4>
          <input type="datetime-local" id="testScheduleTime" class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      `;

    // Show modal
    document.getElementById('orderDetailsModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Set up accept/reject handlers with order context
    document.getElementById('acceptOrderBtn').onclick = () => handleOrderAction('accept', order.researcher, order.test, orderId);
    document.getElementById('rejectOrderBtn').onclick = () => handleOrderAction('reject', order.researcher, order.test, orderId);
}

// Close order details modal
document.getElementById('closeOrderDetails')?.addEventListener('click', () => {
    document.getElementById('orderDetailsModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
});

// Order action handler for lab dashboard
function handleOrderAction(action, researcher, test, orderId) {
    const acceptBtn = document.getElementById('acceptOrderBtn');
    const rejectBtn = document.getElementById('rejectOrderBtn');

    // Disable both buttons and show processing state
    acceptBtn.disabled = true;
    rejectBtn.disabled = true;
    acceptBtn.classList.add('processing');
    rejectBtn.classList.add('processing');

    // Show processing feedback
    if (action === 'accept') {
        acceptBtn.innerHTML = '<div class="flex items-center gap-2"><div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>Processing...</div>';
    } else {
        rejectBtn.innerHTML = '<div class="flex items-center gap-2"><div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>Processing...</div>';
    }

    // Simulate processing time
    setTimeout(() => {
        if (action === 'accept') {
            acceptBtn.innerHTML = '✅ Accepted';
            acceptBtn.classList.remove('accept-btn');
            acceptBtn.classList.add('bg-green-600');

            // Move to history
            moveToHistory(researcher, test, 'Accepted');

            // Show success message
            showNotification(`Order from ${researcher} for ${test} has been accepted.`, 'success');
        } else {
            rejectBtn.innerHTML = '❌ Rejected';
            rejectBtn.classList.remove('reject-btn');
            rejectBtn.classList.add('bg-red-600');

            // Move to history
            moveToHistory(researcher, test, 'Rejected');

            // Show rejection message
            showNotification(`Order from ${researcher} for ${test} has been rejected.`, 'error');
        }

        // Close modal and remove order card after a delay
        setTimeout(() => {
            document.getElementById('orderDetailsModal').classList.add('hidden');
            document.body.style.overflow = 'auto';

            // Find and remove the order card
            const orderCards = document.querySelectorAll('.order-card');
            orderCards.forEach(card => {
                if (card.onclick && card.onclick.toString().includes(orderId)) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(-100%)';
                    setTimeout(() => {
                        card.remove();
                    }, 300);
                }
            });
        }, 2000);

    }, 1500);
}

// Move order to history
function moveToHistory(researcher, test, status) {
    const historyContent = document.getElementById('historyContent');
    const statusColor = status === 'Accepted' ? 'green' : 'red';
    const statusIcon = status === 'Accepted' ?
        '<polyline points="20,6 9,17 4,12"/>' :
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';

    const historyItem = document.createElement('div');
    historyItem.className = 'card p-6';
    historyItem.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-${statusColor}-100 grid place-items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#${statusColor === 'green' ? '22c55e' : 'ef4444'}" stroke-width="2">
                ${statusIcon}
              </svg>
            </div>
            <div>
              <p class="font-semibold text-slate-900">${researcher} - ${test}</p>
              <p class="text-sm text-slate-600">${status} • ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <span class="text-xs text-${statusColor}-600 bg-${statusColor}-50 px-2 py-1 rounded">${status}</span>
        </div>
      `;

    historyContent.insertBefore(historyItem, historyContent.firstChild);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Menu
const menuBtn = document.getElementById('menuBtn'); const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Reveal
const revs = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }); }, { threshold: 0.15 });
revs.forEach(r => observer.observe(r));

// Hero progress
setTimeout(() => { document.getElementById('heroBar').style.width = '78%'; }, 450);

// Enable location tracking
document.getElementById('enableLocation')?.addEventListener('click', enableLocationTracking);

// Lab data with pricing
const labsData = {
    'ncl': {
        name: 'National Chemical Laboratory (NCL), Pune',
        address: 'Dr. Homi Bhabha Road, Pune',
        location: { x: 45, y: 40 },
        tests: {
            'Optical Microscope RT': { price: '₹1000/sample', qty: '1 sample', days: '3 days' },
            'Optical Microscope HT': { price: '₹3000/hour', qty: '1 hour', days: '3 days' },
            'Confocal Microscope': { price: '₹10000/sample', qty: '1 sample', days: '5 days' },
            'AFM': { price: '₹5000/hour', qty: '1 hour', days: '7 days' },
            'SEM (FESEM)': { price: '₹7000/sample', qty: '30 mg', days: '10 days' },
            'SEM (SEM+EDX)': { price: '₹9000/sample', qty: '30 mg', days: '10 days' },
            'SEM (SEM+EDX+Mapping)': { price: '₹12000/sample', qty: '30 mg', days: '10 days' },
            'SEM High Vacuum': { price: '₹4000/sample', qty: '30 mg', days: '8 days' },
            'SEM High Vacuum + EDX': { price: '₹6000/sample', qty: '30 mg', days: '8 days' },
            'SEM High Vacuum + Mapping': { price: '₹7000/sample', qty: '30 mg', days: '8 days' },
            'SEM Low Vacuum': { price: '₹5000/sample', qty: '30 mg', days: '8 days' },
            'Gas Chromatography': { price: '₹750/sample', qty: '50 mg', days: '5 days' },
            'GC-MS (30 min run)': { price: '₹3000/sample', qty: '50 mg', days: '8 days' },
            'GC-MS (50 min run)': { price: '₹5000/sample', qty: '50 mg', days: '8 days' },
            'High Temp GPC': { price: '₹20000/sample', qty: '1 g', days: '8 days' },
            'GPC (CHCl3, THF)': { price: '₹9000/sample', qty: '1 g', days: '8 days' },
            'Aqueous GPC': { price: '₹7500/sample', qty: '1 g', days: '8 days' },
            'UPLC': { price: '₹2000/sample', qty: '50 mg', days: '5 days' },
            'HPLC (UV, UV-RI)': { price: '₹1000/sample', qty: '50 mg', days: '5 days' },
            'UV-Vis (Liquid)': { price: '₹1000/sample', qty: '0.5 ml', days: '3 days' },
            'UV-Vis (Solid)': { price: '₹3000/sample', qty: '20 mg', days: '3 days' },
            'UV-Vis-NIR (Liquid)': { price: '₹2500/sample', qty: '0.5 ml', days: '5 days' },
            'UV-Vis-NIR (Solid)': { price: '₹5000/sample', qty: '20 mg', days: '5 days' },
            'FTIR': { price: '₹1000/sample', qty: '20 mg', days: '3 days' },
            'Fluorescence Spectrometer': { price: '���1500/sample', qty: '0.5 ml', days: '5 days' },
            'CD Spectrophotometer': { price: '₹2500/sample', qty: '0.5 ml', days: '7 days' },
            'Raman Spectroscopy (Regular)': { price: '₹2000/sample', qty: '50 mg', days: '7 days' },
            'Raman Spectroscopy (Low Temp/HT)': { price: '₹5000/sample', qty: '50 mg', days: '10 days' }
        }
    },
    'diya': {
        name: 'DIYA Labs',
        address: 'Kopar Khairane, Navi Mumbai & Airoli, Kalwa Industrial Area',
        location: { x: 65, y: 55 },
        tests: {
            'FTIR': { price: '₹400/sample', qty: '20 mg / 0.5 ml', days: '7 days' },
            'Raman Spectroscopy (Regular)': { price: '₹800/sample', qty: '50 mg', days: '7 days' },
            'Mass Spectrometry': { price: '₹800/sample', qty: '15 mg', days: '6 days' },
            'NMR (H¹)': { price: '₹900/sample', qty: '20 mg', days: '6 days' },
            'NMR (C¹³)': { price: '₹1300/sample', qty: '20 mg', days: '6 days' },
            'NMR (P³¹)': { price: '₹2000/sample', qty: '20 mg', days: '6 days' },
            'Zeta Potential': { price: '₹1000/sample', qty: '2 ml', days: '8 days' },
            'Particle Size (Nanoscale)': { price: '₹1000/sample', qty: '100 mg / 2 ml', days: '8 days' },
            'Particle Size (Micron)': { price: '₹2500/sample', qty: '1 g', days: '8 days' },
            'DSC': { price: '₹1500/sample', qty: '20 mg / 0.5 ml', days: '10 days' },
            'TGA': { price: '₹1500/sample', qty: '20 mg', days: '10 days' },
            'Powder XRD': { price: '₹1200/sample', qty: '0.5 g', days: '10 days' },
            'XRF': { price: '₹2500/sample', qty: '1 g', days: '10 days' },
            'SEM (Micron)': { price: '₹1500/sample', qty: '30 mg / 0.5 ml', days: '8-25 days' },
            'SEM-EDX': { price: '₹1700/sample', qty: '30 mg / 0.5 ml', days: '10 days' },
            'FESEM': { price: '₹2000/sample', qty: '30 mg / 0.5 ml', days: '10 days' },
            'FESEM-EDX': { price: '₹2200/sample', qty: '30 mg / 0.5 ml', days: '10 days' },
            'TEM': { price: '₹3500/sample', qty: '30 mg / 0.5 ml', days: '10 days' },
            'AFM': { price: '₹2500/sample', qty: 'thin film 1×1 cm', days: '15 days' },
            'GCMS (Library Search)': { price: '₹4500/sample', qty: '50 mg', days: '8 days' },
            'LCMS': { price: '₹3500/sample', qty: '50 mg', days: '8 days' },
            'CHNS Elemental': { price: '₹4500/sample', qty: '5 g / ml', days: '8 days' },
            'BET Surface (Single Point)': { price: '₹2200/sample', qty: '0.5 g', days: '8 days' },
            'BET Surface (Multipoint)': { price: '₹3000/sample', qty: '0.5 g', days: '8 days' },
            'GPC (Aqueous)': { price: '₹5000/sample', qty: '1 g', days: '8 days' },
            'GPC (Solvent)': { price: '₹6000/sample', qty: '1 g', days: '8 days' },
            'XPS': { price: '₹5000/sample', qty: '20 mg', days: '20 days' },
            'UV-Vis': { price: '₹1500/sample', qty: '20 mg', days: '10 days' },
            'AAS (Per Element)': { price: '₹1500/element', qty: '1 g', days: '8 days' }
        }
    },
    'ari': {
        name: 'Agharkar Research Institute (ARI), Pune',
        address: 'G.G. Agarkar Road, Pune',
        location: { x: 35, y: 50 },
        tests: {
            'HPLC': { price: '₹3000/hour', qty: '1 hour', days: '5 days' },
            'Ion Chromatography (Per Hour)': { price: '₹4500/hour', qty: '1 hour', days: '7 days' },
            'Ion Chromatography (Per Sample)': { price: '��3000-6000/sample', qty: '1 sample', days: '7 days' },
            'GC Gas Analysis': { price: '₹2200/sample', qty: '50 mg', days: '8 days' },
            'GC Solvent & VFA': { price: '₹34000/sample', qty: '50 mg', days: '10 days' },
            'XRD (Regular)': { price: '₹2000/sample', qty: '0.5 g', days: '10 days' },
            'XRD (Slow Scan)': { price: '₹5000/sample', qty: '0.5 g', days: '15 days' },
            'FTIR': { price: '₹1000/sample', qty: '20 mg', days: '5 days' },
            'AAS': { price: '₹2500-5000/sample', qty: '1 g', days: '8 days' },
            'Lyophilization (Fungal/Microbial)': { price: '₹2500-5000/batch', qty: '1 batch', days: '10 days' },
            'AFM Analysis': { price: '₹35000/hour', qty: '1 hour', days: '15 days' },
            'Fluorescence Microscopy': { price: '₹2500-3500/hour', qty: '1 hour', days: '7 days' },
            'SEM Cryo Mode': { price: '₹7000/sample', qty: '30 mg', days: '10 days' },
            'SEM HV Mode': { price: '₹3500/sample', qty: '30 mg', days: '8 days' },
            'SEM LV Mode': { price: '₹2000-4000/sample', qty: '30 mg', days: '8 days' },
            'SEM+EDS': { price: '₹3000-6000/sample', qty: '30 mg', days: '10 days' },
            'EDS Standalone': { price: '₹1500/spot', qty: '1 spot', days: '5 days' },
            'HPTLC Qualitative': { price: '₹4000/sample', qty: '100 mg', days: '10 days' },
            'HPTLC Quantitative': { price: '₹6000/sample', qty: '100 mg', days: '12 days' },
            'Drug Study (Macro/Micro)': { price: '₹4000/sample', qty: '50 mg', days: '8 days' },
            'Phytochemical Qualitative': { price: '₹250/test', qty: '50 mg', days: '5 days' },
            'Phytochemical Quantitative': { price: '₹2500/test', qty: '100 mg', days: '10 days' },
            'TLC Profile': { price: '₹1000/sample', qty: '50 mg', days: '7 days' }
        }
    }
};

// Build categorized tests
const testsByCategory = [
    {
        cat: 'Microscopic Techniques', items: [
            'Optical Microscope RT', 'Optical Microscope HT', 'Confocal Microscope', 'AFM', 'AFM Analysis',
            'SEM (FESEM)', 'SEM (SEM+EDX)', 'SEM (SEM+EDX+Mapping)', 'SEM High Vacuum', 'SEM High Vacuum + EDX',
            'SEM High Vacuum + Mapping', 'SEM Low Vacuum', 'SEM (Micron)', 'SEM-EDX', 'FESEM', 'FESEM-EDX',
            'SEM Cryo Mode', 'SEM HV Mode', 'SEM LV Mode', 'SEM+EDS', 'EDS Standalone', 'TEM',
            'Fluorescence Microscopy'
        ]
    },
    {
        cat: 'Mass Spectrometry & Chromatography', items: [
            'Mass Spectrometry', 'GCMS (Library Search)', 'GC-MS (30 min run)', 'GC-MS (50 min run)',
            'LCMS', 'Gas Chromatography', 'GC Gas Analysis', 'GC Solvent & VFA', 'HPLC (UV, UV-RI)',
            'HPLC', 'UPLC', 'High Temp GPC', 'GPC (CHCl3, THF)', 'Aqueous GPC', 'GPC (Aqueous)',
            'GPC (Solvent)', 'Ion Chromatography (Per Hour)', 'Ion Chromatography (Per Sample)'
        ]
    },
    {
        cat: 'Spectroscopic Techniques', items: [
            'FTIR', 'Raman Spectroscopy (Regular)', 'Raman Spectroscopy (Low Temp/HT)', 'UV-Vis (Liquid)',
            'UV-Vis (Solid)', 'UV-Vis-NIR (Liquid)', 'UV-Vis-NIR (Solid)', 'UV-Vis', 'Fluorescence Spectrometer',
            'CD Spectrophotometer', 'NMR (H¹)', 'NMR (C¹³)', 'NMR (P³¹)', 'XRD (Regular)', 'XRD (Slow Scan)',
            'Powder XRD', 'XRF', 'XPS'
        ]
    },
    {
        cat: 'Thermal & Physical Analysis', items: [
            'DSC', 'TGA', 'Zeta Potential', 'Particle Size (Nanoscale)', 'Particle Size (Micron)',
            'BET Surface (Single Point)', 'BET Surface (Multipoint)', 'CHNS Elemental', 'AAS (Per Element)',
            'AAS', 'Lyophilization (Fungal/Microbial)'
        ]
    },
    {
        cat: 'Biological & Pharmaceutical', items: [
            'HPTLC Qualitative', 'HPTLC Quantitative', 'Drug Study (Macro/Micro)', 'Phytochemical Qualitative',
            'Phytochemical Quantitative', 'TLC Profile'
        ]
    }
];

const testGroupsEl = document.getElementById('testGroups');
const chosenInfo = document.getElementById('chosenInfo');
const chosenName = document.getElementById('chosenName');
const summaryTest = document.getElementById('summaryTest');
let selectedTest = null;
let selectedLabId = null;

function renderGroups(groups) {
    testGroupsEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    groups.forEach(group => {
        const section = document.createElement('div');
        section.innerHTML = `
          <div class="flex items-center justify-between mb-3">
            <div class="cat-label">${group.cat}</div>
            <div class="text-xs text-slate-500">Select lab to see pricing</div>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"></div>
        `;
        const grid = section.querySelector('.grid');
        group.items.forEach(testName => {
            const btn = document.createElement('button');
            btn.className = 'tile rounded-xl p-4 text-left hover:bg-blue-100/70 transition border';

            // Find price from any lab that has this test
            let displayPrice = 'Select lab for price';
            let displayQty = '';
            let displayDays = '';

            for (const labId in labsData) {
                if (labsData[labId].tests[testName]) {
                    displayPrice = labsData[labId].tests[testName].price;
                    displayQty = labsData[labId].tests[testName].qty;
                    displayDays = labsData[labId].tests[testName].days;
                    break;
                }
            }

            btn.innerHTML = `
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold">${testName}</p>
                <p class="text-xs text-slate-500">${group.cat}</p>
                <p class="text-xs text-slate-600 mt-1">${displayQty} • ${displayDays}</p>
              </div>
              <div class="text-right price font-semibold text-sm">${displayPrice}</div>
            </div>
          `;
            btn.addEventListener('click', () => {
                selectedTest = testName;
                chosenName.textContent = testName;
                summaryTest.textContent = testName;
                chosenInfo.classList.remove('hidden');
                document.getElementById('labs').scrollIntoView({ behavior: 'smooth' });
                updateLabPricing();
            });
            grid.appendChild(btn);
        });
        frag.appendChild(section);
    });
    testGroupsEl.appendChild(frag);
}
renderGroups(testsByCategory);

// Search and filter
const searchInput = document.getElementById('searchTest');
document.getElementById('searchBtn').addEventListener('click', doSearch);
searchInput.addEventListener('input', doSearch);
document.getElementById('clearBtn').addEventListener('click', () => { searchInput.value = ''; renderGroups(testsByCategory); });

function doSearch() {
    const q = (searchInput.value || '').toLowerCase().trim();
    if (!q) { renderGroups(testsByCategory); return; }
    const filtered = testsByCategory.map(group => {
        const items = group.items.filter(item => item.toLowerCase().includes(q) || group.cat.toLowerCase().includes(q));
        return { cat: group.cat, items };
    }).filter(g => g.items.length);
    renderGroups(filtered);
}

const allLabsList = document.getElementById('allLabsList');
const labSearch = document.getElementById('labSearch');
const mapPins = document.getElementById('mapPins');

function renderAllLabs(filter = '') {
    allLabsList.innerHTML = '';
    mapPins.innerHTML = '';

    Object.entries(labsData).forEach(([labId, lab]) => {
        if (filter && !lab.name.toLowerCase().includes(filter.toLowerCase()) &&
            !lab.address.toLowerCase().includes(filter.toLowerCase())) return;

        // Create lab card
        const el = document.createElement('button');
        el.className = `w-full text-left bg-white border rounded-xl p-4 hover:border-blue-300 transition ${selectedLabId === labId ? 'active-step' : ''}`;
        el.dataset.id = labId;

        let testPrice = 'Select test first';
        let testQty = '';
        let testDays = '';
        if (selectedTest && lab.tests[selectedTest]) {
            testPrice = lab.tests[selectedTest].price;
            testQty = lab.tests[selectedTest].qty;
            testDays = lab.tests[selectedTest].days;
        }

        const isAuthorized = labId === 'ncl';

        el.innerHTML = `
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold">${lab.name}</p>
                ${isAuthorized ? '<span class="auth-badge">Certified</span>' : ''}
              </div>
              <p class="text-xs text-slate-500">${lab.address}</p>
              ${selectedTest ? `<p class="text-xs text-slate-600 mt-1">${testQty} • ${testDays}</p>` : ''}
            </div>
            <div class="text-right">
              <div class="price font-semibold text-sm">${testPrice}</div>
              ${selectedTest && lab.tests[selectedTest] ? '<div class="text-xs text-green-600">Available</div>' : selectedTest ? '<div class="text-xs text-slate-400">Not available</div>' : ''}
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
            if (selectedTest && !lab.tests[selectedTest]) {
                showNotification(`${selectedTest} is not available at ${lab.name}. Please select a different lab or test.`, 'error');
                return;
            }
            allLabsList.querySelectorAll('button').forEach(b => b.classList.remove('active-step'));
            el.classList.add('active-step');
            selectedLabId = labId;
            updateTestPricing();
        });

        allLabsList.appendChild(el);

        // Add map pin
        const pin = document.createElement('div');
        pin.className = `pin absolute cursor-pointer hover:scale-110 transition-transform ${selectedLabId === labId ? 'ring-2 ring-blue-400' : ''}`;
        pin.style.left = lab.location.x + '%';
        pin.style.top = lab.location.y + '%';
        pin.title = lab.name;
        if (isAuthorized) {
            pin.style.background = '#22c55e';
            pin.style.boxShadow = '0 0 0 6px rgba(34,197,94,0.18)';
        }

        // Add click handler for map pins
        pin.addEventListener('click', () => {
            if (selectedTest && !lab.tests[selectedTest]) {
                showNotification(`${selectedTest} is not available at ${lab.name}. Please select a different lab or test.`, 'error');
                return;
            }
            allLabsList.querySelectorAll('button').forEach(b => b.classList.remove('active-step'));
            const labCard = allLabsList.querySelector(`[data-id="${labId}"]`);
            if (labCard) {
                labCard.classList.add('active-step');
                labCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            selectedLabId = labId;
            updateTestPricing();
            renderAllLabs(labSearch.value);
        });

        mapPins.appendChild(pin);
    });
}

function updateLabPricing() {
    renderAllLabs(labSearch.value);
}

function updateTestPricing() {
    if (selectedTest && selectedLabId && labsData[selectedLabId].tests[selectedTest]) {
        const testData = labsData[selectedLabId].tests[selectedTest];
        document.getElementById('summaryPrice').textContent = testData.price;
        document.getElementById('summaryTAT').textContent = testData.days;
    }
}

labSearch.addEventListener('input', () => renderAllLabs(labSearch.value));
renderAllLabs();

document.getElementById('bookLab').addEventListener('click', () => {
    if (!selectedTest) { showNotification('Please select a test first.', 'error'); return; }
    if (!selectedLabId) { showNotification('Please select a lab.', 'error'); return; }
    if (!labsData[selectedLabId].tests[selectedTest]) {
        showNotification('Selected test is not available at this lab. Please choose a different combination.', 'error');
        return;
    }

    // Update summary in payment section
    document.getElementById('summaryLab').textContent = labsData[selectedLabId].name;
    updateTestPricing();

    // Show requirements section with summary
    const reqSection = document.getElementById('requirements');
    document.getElementById('reqSummaryTest').textContent = selectedTest;
    document.getElementById('reqSummaryLab').textContent = labsData[selectedLabId].name;
    document.getElementById('reqSummaryQty').textContent = labsData[selectedLabId].tests[selectedTest].qty;

    reqSection.classList.remove('hidden');
    reqSection.scrollIntoView({ behavior: 'smooth' });
});

// Back to labs button
document.getElementById('backToLabs')?.addEventListener('click', () => {
    document.getElementById('requirements').classList.add('hidden');
    document.getElementById('labs').scrollIntoView({ behavior: 'smooth' });
});

// Proceed to pickup button with validation
document.getElementById('proceedToPickup')?.addEventListener('click', () => {
    const sampleDescription = document.getElementById('sampleDescription').value.trim();
    const sampleQuantity = document.getElementById('sampleQuantity').value.trim();

    if (!sampleDescription || !sampleQuantity) {
        showNotification('Please fill in required fields: Sample Description and Quantity.', 'error');
        return;
    }

    // Collect all requirements data
    const requirementsData = {
        description: sampleDescription,
        quantity: sampleQuantity,
        storage: document.getElementById('storageConditions').value,
        urgency: document.getElementById('urgencyLevel').value,
        specialInstructions: document.getElementById('specialInstructions').value,
        safetyFlags: {
            hazardous: document.getElementById('hazardous').checked,
            flammable: document.getElementById('flammable').checked,
            toxic: document.getElementById('toxic').checked,
            biological: document.getElementById('biological').checked,
            airSensitive: document.getElementById('airSensitive').checked
        },
        expectedResults: document.getElementById('expectedResults').value,
        contactPreference: document.getElementById('contactPreference').value
    };

    // Store requirements data for later use (could be sent to backend)
    console.log('Sample Requirements:', requirementsData);

    // Show pickup section
    document.getElementById('requirements').classList.add('hidden');
    document.getElementById('pickup').classList.remove('hidden');
    document.getElementById('pickup').scrollIntoView({ behavior: 'smooth' });
    advancePickup();

    showNotification('Requirements submitted successfully! Proceed with sample pickup.', 'success');
});

// Pickup progress
const pickupStages = ['Scheduled', 'Picked Up', 'In Transit', 'Delivered'];
let pickupIndex = 0;
const pickupBar = document.getElementById('pickupBar');
const pickupLabel = document.getElementById('pickupLabel');
function advancePickup() {
    pickupIndex = 0;
    function tick() {
        pickupBar.style.width = ((pickupIndex + 1) / pickupStages.length) * 100 + '%';
        pickupLabel.textContent = pickupStages[pickupIndex];
        pickupIndex++;
        if (pickupIndex < pickupStages.length) { setTimeout(tick, 900); }
    }
    tick();
}



// Payment + gated download
const payBtn = document.getElementById('payBtn');
const payStatus = document.getElementById('payStatus');
const downloadBtn = document.getElementById('downloadBtn');
let paid = false;

payBtn.addEventListener('click', () => {
    const tos = document.getElementById('tos').checked;
    if (!tos) { showNotification('Please agree to the terms.', 'error'); return; }
    payBtn.disabled = true; payBtn.textContent = 'Processing...';
    setTimeout(() => {
        payBtn.textContent = 'Paid ✔'; payStatus.classList.remove('hidden');
        paid = true;
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('btn-soft');
        downloadBtn.classList.add('btn-primary');
        document.getElementById('downloadText').textContent = 'Download AI Report';
    }, 900);
});

function buildReportHTML() {
    const test = document.getElementById('summaryTest').textContent;
    const tat = document.getElementById('summaryTAT').textContent;
    const price = document.getElementById('summaryPrice').textContent;
    const labName = document.getElementById('summaryLab').textContent;
    const labData = selectedLabId ? labsData[selectedLabId] : null;
    const testData = selectedTest && labData ? labData.tests[selectedTest] : null;
    const sampleId = `TS-${Date.now().toString().slice(-6)}`;
    const reportDate = new Date().toLocaleDateString('en-IN');

    return `
<div class="report-container" style="max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="position: relative;">
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 60px; color: rgba(11,110,239,0.05); font-weight: bold; pointer-events: none; z-index: 1;">TESTIFY SAMPLES</div>
    
    <!-- Header with Testify Samples Logo -->
    <div style="background: linear-gradient(135deg, #0B6EEF, #3b82f6); color: white; padding: 40px 30px; text-align: center; position: relative; z-index: 2;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
        <svg width="40" height="40" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
          <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#0B6EEF" stroke-width="2"/>
          <path d="M30 35h40M50 35v30M35 55h30" stroke="#0B6EEF" stroke-width="4" stroke-linecap="round"/>
          <circle cx="50" cy="25" r="3" fill="#FFC43D"/>
        </svg>
        <div style="font-size: 32px; font-weight: bold;">TESTIFY SAMPLES</div>
      </div>
      <div style="font-size: 16px; opacity: 0.9; margin-bottom: 10px;">India's Smart Gateway to Scientific Testing</div>
      <div style="font-size: 14px; opacity: 0.8;">AI-Enhanced Laboratory Analysis Report</div>
    </div>
    
    <!-- Laboratory Information -->
    <div style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); padding: 25px; border-bottom: 3px solid #0B6EEF; position: relative; z-index: 2;">
      <div style="text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">${labName}</div>
        <div style="color: #64748b; font-size: 16px; margin-bottom: 15px;">${labData ? labData.address : 'Laboratory Address'}</div>
        <div style="display: inline-block; background: #0B6EEF; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">CERTIFIED LABORATORY</div>
      </div>
    </div>
    
    <!-- Report Content -->
    <div style="padding: 30px; position: relative; z-index: 2;">
      <!-- Sample Information -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
          <span>📋</span> Sample Information
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0B6EEF;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Sample ID</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${sampleId}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0B6EEF;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Test Performed</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${test}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0B6EEF;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Sample Quantity</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${testData ? testData.qty : '1 sample'}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0B6EEF;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Report Date</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${reportDate}</div>
          </div>
        </div>
      </div>
      
      <!-- AI Analysis Results -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
          <span>🤖</span> AI-Enhanced Analysis Results
        </div>
        <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #0ea5e9; border-radius: 12px; padding: 25px; margin: 15px 0;">
          ${test.includes('FTIR') ? `
            <h4 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">AI-Enhanced FTIR Spectroscopy Results</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div><strong>Resolution:</strong> 4 cm⁻¹</div>
                <div><strong>Scan Range:</strong> 4000–400 cm⁻¹</div>
                <div><strong>AI Confidence:</strong> 97.3%</div>
                <div><strong>Sample State:</strong> Solid/KBr pellet</div>
              </div>
              <div style="margin-top: 15px;">
                <strong>AI-Identified Functional Groups:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>1715 cm⁻¹ - C=O stretch (carbonyl) - High confidence</li>
                  <li>1250 cm⁻¹ - C-O stretch (ether/alcohol) - Medium confidence</li>
                  <li>2900-3000 cm⁻¹ - C-H stretch (alkyl) - High confidence</li>
                  <li>3200-3600 cm⁻¹ - O-H stretch (hydroxyl) - Medium confidence</li>
                </ul>
                <div style="background: #e0f2fe; padding: 10px; border-radius: 6px; margin-top: 10px;">
                  <strong>AI Recommendation:</strong> Structure consistent with organic polymer containing carbonyl and hydroxyl groups. Suggest NMR for structural confirmation.
                </div>
              </div>
            </div>
          ` : test.includes('SEM') ? `
            <h4 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">AI-Enhanced SEM Analysis Results</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div><strong>Magnification:</strong> 100x to 50,000x</div>
                <div><strong>AI Processing:</strong> Deep learning enhanced</div>
                <div><strong>Particle Count:</strong> 1,247 detected</div>
                <div><strong>Size Distribution:</strong> AI calculated</div>
              </div>
              <div style="margin-top: 15px;">
                <strong>AI Morphological Analysis:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Crystalline structure with well-defined facets (AI confidence: 94%)</li>
                  <li>Uniform particle size distribution (CV: 12.3%)</li>
                  <li>Average particle size: 50-200 nm (AI measured)</li>
                  <li>Surface roughness index: 0.23 (AI calculated)</li>
                </ul>
                <div style="background: #e0f2fe; padding: 10px; border-radius: 6px; margin-top: 10px;">
                  <strong>AI Insight:</strong> Particles show excellent uniformity suggesting controlled synthesis conditions. Recommend XRD for crystalline phase identification.
                </div>
              </div>
            </div>
          ` : test.includes('NMR') ? `
            <h4 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">AI-Enhanced NMR Spectroscopy Results</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div><strong>Solvent:</strong> CDCl₃</div>
                <div><strong>AI Peak Detection:</strong> 23 peaks identified</div>
                <div><strong>Structure Prediction:</strong> 89% confidence</div>
                <div><strong>Purity Assessment:</strong> >95% (AI calculated)</div>
              </div>
              <div style="margin-top: 15px;">
                <strong>AI Chemical Shift Analysis:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Chemical shifts match predicted structure (AI confidence: 89%)</li>
                  <li>Integration ratios confirm molecular composition</li>
                  <li>Coupling patterns indicate structural connectivity</li>
                  <li>No significant impurity peaks detected by AI</li>
                </ul>
                <div style="background: #e0f2fe; padding: 10px; border-radius: 6px; margin-top: 10px;">
                  <strong>AI Structural Prediction:</strong> Compound structure matches target molecule with high confidence. Suggest mass spectrometry for molecular weight confirmation.
                </div>
              </div>
            </div>
          ` : `
            <h4 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">AI-Enhanced ${test} Analysis Results</h4>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="margin-bottom: 15px;">
                <strong>AI Analysis Summary:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Analysis completed with AI-enhanced data processing</li>
                  <li>Results verified by machine learning algorithms</li>
                  <li>Data integrity maintained with blockchain verification</li>
                  <li>Quality control parameters within AI-optimized limits</li>
                </ul>
                <div style="background: #e0f2fe; padding: 10px; border-radius: 6px; margin-top: 10px;">
                  <strong>AI Recommendation:</strong> Results show excellent quality metrics. Consider complementary techniques for comprehensive characterization.
                </div>
              </div>
            </div>
          `}
          
          <!-- AI-Enhanced Spectrum Placeholder -->
          <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 40px; text-align: center; color: #64748b; margin: 15px 0;">
            <div style="font-size: 24px; margin-bottom: 10px;">🤖📈</div>
            <div style="font-weight: 600; margin-bottom: 5px;">AI-Enhanced Spectrum/Data Visualization</div>
            <div style="font-size: 14px;">Machine learning processed analytical data with intelligent insights</div>
          </div>
        </div>
      </div>
      
      <!-- Expert Validation -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
          <span>���‍🔬</span> Expert Validation & Quality Assurance
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">AI Analyst</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">DeepChem AI v3.2</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Human Expert</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">Dr. ${Math.random() > 0.5 ? 'Priya Sharma' : 'Rajesh Kumar'}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">AI Confidence</div>
            <div style="font-size: 16px; font-weight: 600; color: #059669;">94.7%</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 5px;">Status</div>
            <div style="font-size: 16px; font-weight: 600; color: #059669;">✓ AI + Expert Approved</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; position: relative; z-index: 2;">
      <div style="font-weight: bold; margin-bottom: 5px;">Testify Samples • India's Smart Gateway to Scientific Testing</div>
      <div>AI-enhanced analysis with expert validation. Empowering Research. Simplifying Testing.</div>
      <div style="margin-top: 10px;">Generated on ${reportDate} • Report ID: ${sampleId} • Turnaround: ${tat} • Cost: ${price}</div>
    </div>
  </div>
</div>`;
}

// Modal functionality
const reportModal = document.getElementById('reportModal');
const reportPreview = document.getElementById('reportPreview');
const closeModal = document.getElementById('closeModal');
const downloadFromModal = document.getElementById('downloadFromModal');

function showReportPreview() {
    const reportHTML = buildReportHTML();
    reportPreview.innerHTML = reportHTML;
    reportModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideReportPreview() {
    reportModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', hideReportPreview);
reportModal.addEventListener('click', (e) => {
    if (e.target === reportModal) hideReportPreview();
});

downloadFromModal.addEventListener('click', () => {
    const reportHTML = buildReportHTML();
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Testify_Samples_AI_Report_${Date.now().toString().slice(-6)}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    downloadFromModal.textContent = 'Downloaded ✓';
    setTimeout(() => {
        downloadFromModal.textContent = 'Download PDF';
        hideReportPreview();
    }, 1500);
});

downloadBtn.addEventListener('click', () => {
    if (!paid) { showNotification('Please complete payment to download your AI-enhanced report.', 'error'); return; }
    showReportPreview();
});

// Login System
const loginBtn = document.getElementById('loginBtn');
const profileBtn = document.getElementById('profileBtn');
const loginDropdown = document.getElementById('loginDropdown');
const profileDropdown = document.getElementById('profileDropdown');
const researcherLogin = document.getElementById('researcherLogin');
const labLogin = document.getElementById('labLogin');
const mobileResearcherLogin = document.getElementById('mobileResearcherLogin');
const mobileLabLogin = document.getElementById('mobileLabLogin');
const logoutBtn = document.getElementById('logoutBtn');

let isLoggedIn = false;
let userType = null;

// Login dropdown toggle
loginBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    loginDropdown.classList.toggle('hidden');
    profileDropdown.classList.add('hidden');
});

// Profile dropdown toggle
profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('hidden');
    loginDropdown.classList.add('hidden');
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    loginDropdown.classList.add('hidden');
    profileDropdown.classList.add('hidden');
});

// Prevent dropdowns from closing when clicking inside
loginDropdown?.addEventListener('click', (e) => {
    e.stopPropagation();
});

profileDropdown?.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Logout functionality
logoutBtn?.addEventListener('click', () => {
    isLoggedIn = false;
    userType = null;
    loginBtn.classList.remove('hidden');
    profileBtn.classList.add('hidden');
    profileDropdown.classList.add('hidden');

    // Close any open dashboards
    hideModal(researcherDashboard);
    hideModal(labDashboard);
});

// Modal functionality
const researcherModal = document.getElementById('researcherModal');
const labModal = document.getElementById('labModal');
const labDashboard = document.getElementById('labDashboard');
const researcherDashboard = document.getElementById('researcherDashboard');

function showModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Login button handlers
researcherLogin?.addEventListener('click', () => {
    loginDropdown.classList.add('hidden');
    showModal(researcherModal);
});

labLogin?.addEventListener('click', () => {
    loginDropdown.classList.add('hidden');
    showModal(labModal);
});

mobileResearcherLogin?.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    showModal(researcherModal);
});

mobileLabLogin?.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    showModal(labModal);
});

// Close modal handlers
document.getElementById('closeResearcherModal')?.addEventListener('click', () => hideModal(researcherModal));
document.getElementById('closeLabModal')?.addEventListener('click', () => hideModal(labModal));
document.getElementById('closeDashboard')?.addEventListener('click', () => hideModal(labDashboard));
document.getElementById('closeResearcherDashboard')?.addEventListener('click', () => hideModal(researcherDashboard));

// Login form handlers
document.getElementById('researcherLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Set logged in state
    isLoggedIn = true;
    userType = 'researcher';

    // Switch to profile view
    loginBtn.classList.add('hidden');
    profileBtn.classList.remove('hidden');

    // Close modal and stay on main page
    hideModal(researcherModal);
});

document.getElementById('labLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    hideModal(labModal);
    showModal(labDashboard);
});

// Dashboard tab switching
const ordersTab = document.getElementById('ordersTab');
const historyTab = document.getElementById('historyTab');
const payoutsTab = document.getElementById('payoutsTab');
const ordersContent = document.getElementById('ordersContent');
const historyContent = document.getElementById('historyContent');
const payoutsContent = document.getElementById('payoutsContent');

function switchTab(activeTab, activeContent) {
    // Reset all tabs
    [ordersTab, historyTab, payoutsTab].forEach(tab => {
        tab.classList.remove('btn-primary');
        tab.classList.add('btn-soft');
    });

    // Reset all content
    [ordersContent, historyContent, payoutsContent].forEach(content => {
        content.classList.add('hidden');
    });

    // Activate selected tab and content
    activeTab.classList.remove('btn-soft');
    activeTab.classList.add('btn-primary');
    activeContent.classList.remove('hidden');
}

ordersTab?.addEventListener('click', () => switchTab(ordersTab, ordersContent));
historyTab?.addEventListener('click', () => switchTab(historyTab, historyContent));
payoutsTab?.addEventListener('click', () => switchTab(payoutsTab, payoutsContent));

// Upload results functionality
document.getElementById('uploadResult1')?.addEventListener('click', function () {
    this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>Uploaded ✓';
    this.classList.remove('btn-primary');
    this.classList.add('bg-green-500', 'hover:bg-green-600');
    this.disabled = true;

    // Show PDF download in researcher dashboard
    setTimeout(() => {
        document.getElementById('pdfDownload1').classList.remove('hidden');
    }, 1000);
});

document.getElementById('uploadResult2')?.addEventListener('click', function () {
    this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>Uploaded ✓';
    this.classList.remove('btn-primary');
    this.classList.add('bg-green-500', 'hover:bg-green-600');
    this.disabled = true;

    // Show PDF download in researcher dashboard
    setTimeout(() => {
        document.getElementById('pdfDownload2').classList.remove('hidden');
    }, 1000);
});

// Close modals when clicking outside
[researcherModal, labModal, labDashboard, researcherDashboard].forEach(modal => {
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize demo map on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        initDemoMap();
    }, 500);
});

// Handle window resize for canvas
window.addEventListener('resize', () => {
    if (trackingCanvas) {
        trackingCanvas.width = trackingCanvas.offsetWidth;
        trackingCanvas.height = trackingCanvas.offsetHeight;
        drawDemoMap();
    }
});

(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'9b200535327c84d1',t:'MTc2NjQxMDcxNC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();