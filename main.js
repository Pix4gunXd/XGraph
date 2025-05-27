let chart = null;
let currentScale = 10;

// Initialize chart
function initChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'f(x)',
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.1,
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    title: {
                        display: true,
                        text: 'Eixo X',
                        color: '#64748b'
                    },
                    grid: {
                        color: '#e2e8f0'
                    },
                    min: -currentScale,
                    max: currentScale
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    title: {
                        display: true,
                        text: 'Eixo Y',
                        color: '#64748b'
                    },
                    grid: {
                        color: '#e2e8f0'
                    },
                    min: -currentScale,
                    max: currentScale
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `f(${context.parsed.x}) = ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}

// Plot the graph based on user input
function plotGraph() {
    const equationInput = document.getElementById('equation').value.trim();
    
    if (!equationInput) {
        alert('Por favor, digite uma função.');
        return;
    }
    
    try {
        // Parse the equation
        const expr = math.compile(equationInput);
        
        // Generate data points
        const step = 0.1;
        const points = [];
        
        for (let x = -currentScale; x <= currentScale; x += step) {
            try {
                const y = expr.evaluate({x: x});
                points.push({x: x, y: y});
            } catch (e) {
                // Skip points where the function is undefined
            }
        }
        
        // Update chart
        chart.data.datasets[0].data = points;
        chart.data.datasets[0].label = `f(x) = ${equationInput}`;
        chart.update();
        
    } catch (e) {
        alert('Erro ao processar a função. Verifique a sintaxe.');
        console.error(e);
    }
}

// Zoom functions
function zoomIn() {
    currentScale = Math.max(2, currentScale - 2);
    updateChartScale();
}

function zoomOut() {
    currentScale = Math.min(20, currentScale + 2);
    updateChartScale();
}

function resetView() {
    currentScale = 10;
    updateChartScale();
}

function updateChartScale() {
    chart.options.scales.x.min = -currentScale;
    chart.options.scales.x.max = currentScale;
    chart.options.scales.y.min = -currentScale;
    chart.options.scales.y.max = currentScale;
    chart.update();
    
    // Re-plot graph with new scale
    if (document.getElementById('equation').value) {
        plotGraph();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    
    // Allow pressing Enter to plot
    document.getElementById('equation').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            plotGraph();
        }
    });
});