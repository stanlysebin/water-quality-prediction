document.getElementById('predictionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = document.querySelector('.btn-predict');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const result = document.getElementById('result');
    
    // Disable button and show loader
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    result.style.display = 'none';
    
    // Collect form data
    const formData = {
        ph: document.getElementById('ph').value,
        Hardness: document.getElementById('Hardness').value,
        Solids: document.getElementById('Solids').value,
        Chloramines: document.getElementById('Chloramines').value,
        Sulfate: document.getElementById('Sulfate').value,
        Conductivity: document.getElementById('Conductivity').value,
        Organic_carbon: document.getElementById('Organic_carbon').value,
        Trihalomethanes: document.getElementById('Trihalomethanes').value,
        Turbidity: document.getElementById('Turbidity').value
    };
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResult(data);
        } else {
            alert('Error: ' + (data.error || 'Prediction failed'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        // Re-enable button
        btn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
});

function displayResult(data) {
    const result = document.getElementById('result');
    const resultIcon = document.getElementById('resultIcon');
    const resultText = document.getElementById('resultText');
    const confidenceText = document.getElementById('confidenceText');
    
    // Remove previous classes
    result.classList.remove('potable', 'not-potable');
    
    if (data.potability === 1) {
        result.classList.add('potable');
        resultIcon.textContent = '✓';
        resultText.textContent = 'Water is Potable';
        confidenceText.textContent = `Safe to drink! (Confidence: ${data.confidence.toFixed(1)}%)`;
    } else {
        result.classList.add('not-potable');
        resultIcon.textContent = '✗';
        resultText.textContent = 'Water is Not Potable';
        confidenceText.textContent = `Not safe to drink! (Confidence: ${data.confidence.toFixed(1)}%)`;
    }
    
    result.style.display = 'block';
    
    // Smooth scroll to result
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Sample data button (optional - for testing)
function fillSampleData() {
    document.getElementById('ph').value = '7.0';
    document.getElementById('Hardness').value = '200';
    document.getElementById('Solids').value = '20000';
    document.getElementById('Chloramines').value = '7.0';
    document.getElementById('Sulfate').value = '333';
    document.getElementById('Conductivity').value = '400';
    document.getElementById('Organic_carbon').value = '15';
    document.getElementById('Trihalomethanes').value = '66';
    document.getElementById('Turbidity').value = '3.5';
}