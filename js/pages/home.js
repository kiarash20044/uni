
// js/pages/home.js
import { renderStatCard } from '../components/StatCard.js';
import { animateElement } from '../utils/animations.js';

export function renderHomePage(appState, i18n) {
    const user = appState.get('user') || { name: 'Guest' };
    const stats = appState.get('dashboardStats') || [
        { value: '4.2', label: 'currentGPA', icon: '&#127891;' }, // 🎓
        { value: '12', label: 'coursesInProgress', icon: '&#128218;' }, // 📚
        { value: '3', label: 'upcomingDeadlines', icon: '&#9203;' }, // ⏳
        { value: '85%', label: 'attendanceRate', icon: '&#128200;' } // 📈
    ];

    const homeHTML = `
        <div class="home-grid">
            <div class="welcome-banner glassmorphism neon-border">
                <h1 class="title is-3">${i18n.translate('welcome')}, ${user.name}!</h1>
                <p class="subtitle is-5">${i18n.translate('dashboardQuote')}</p>
            </div>

            ${stats.map(stat => renderStatCard(stat, i18n)).join('')}

            <div class="chart-container box glassmorphism">
                <h2 class="title is-4">${i18n.translate('gradeDistribution')}</h2>
                <canvas id="gradesChart"></canvas>
            </div>

            <div class="tasks-overview box glassmorphism">
                 <h2 class="title is-4">${i18n.translate('upcomingTasks')}</h2>
                 <ul>
                    <li><span class="is-family-monospace">[CS101]</span> - ${i18n.translate('taskFinishLab')} - <time>2025-06-20</time></li>
                    <li><span class="is-family-monospace">[MA203]</span> - ${i18n.translate('taskSubmitAssignment')} - <time>2025-06-22</time></li>
                    <li><span class="is-family-monospace">[PH150]</span> - ${i18n.translate('taskPrepareForExam')} - <time>2025-06-25</time></li>
                 </ul>
            </div>
        </div>
    `;

    // Post-render actions (like initializing charts or animations)
    setTimeout(() => {
        // Animate elements on screen
        animateElement('.welcome-banner');
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            animateElement(card, { delay: 0.1 * (index + 1) });
        });
        animateElement('.chart-container', { delay: 0.5 });
        animateElement('.tasks-overview', { delay: 0.6 });

        // Initialize Chart.js
        const ctx = document.getElementById('gradesChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['A', 'B', 'C', 'D'],
                    datasets: [{
                        label: 'Grades',
                        data: [12, 19, 5, 2],
                        backgroundColor: ['#34d399', '#818cf8', '#f59e0b', '#ef4444'],
                        borderColor: 'var(--bg-secondary)',
                        borderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                             labels: {
                                color: 'var(--text-secondary)'
                            }
                        }
                    }
                }
            });
        }
    }, 0);

    return homeHTML;
}