// js/services/i18nService.js

const translations = {
    fa: {
        // General
        home: 'خانه',
        courses: 'درس‌ها',
        grades: 'نمرات',
        schedule: 'برنامه هفتگی',
        tasks: 'وظایف',
        resources: 'منابع',
        settings: 'تنظیمات',
        profile: 'پروفایل',
        logout: 'خروج',
        pageNotFound: 'صفحه پیدا نشد',
        // Dashboard
        welcome: 'خوش آمدید',
        dashboardQuote: 'پیشرفت خود را دنبال کنید و سازماندهی شده بمانید.',
        currentGPA: 'معدل کل',
        coursesInProgress: 'دروس در حال گذراندن',
        upcomingDeadlines: 'ددلاین‌های نزدیک',
        attendanceRate: 'نرخ حضور',
        gradeDistribution: 'توزیع نمرات',
        upcomingTasks: 'وظایف پیش رو',
        taskFinishLab: 'تکمیل گزارش آزمایشگاه',
        taskSubmitAssignment: 'ارسال تمرین',
        taskPrepareForExam: 'آمادگی برای امتحان',
    },
    en: {
        // General
        home: 'Home',
        courses: 'Courses',
        grades: 'Grades',
        schedule: 'Schedule',
        tasks: 'Tasks',
        resources: 'Resources',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout',
        pageNotFound: 'Page Not Found',
        // Dashboard
        welcome: 'Welcome',
        dashboardQuote: 'Track your progress and stay organized.',
        currentGPA: 'Current GPA',
        coursesInProgress: 'Courses In Progress',
        upcomingDeadlines: 'Upcoming Deadlines',
        attendanceRate: 'Attendance Rate',
        gradeDistribution: 'Grade Distribution',
        upcomingTasks: 'Upcoming Tasks',
        taskFinishLab: 'Finish lab report',
        taskSubmitAssignment: 'Submit assignment',
        taskPrepareForExam: 'Prepare for exam',
    }
};

export class I18nService {
    constructor(appState) {
        this.appState = appState;
        this.lang = this.appState.get('language') || 'fa';
    }

    /**
     * Translates a given key into the current language.
     * @param {string} key - The key to translate.
     * @returns {string} The translated string or the key itself if not found.
     */
    translate(key) {
        return translations[this.lang][key] || key;
    }

    /**
     * Formats a number according to the current language.
     * @param {number} num - The number to format.
     * @returns {string} The formatted number string.
     */
    formatNumber(num) {
        if (this.lang === 'fa') {
            const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            return String(num).replace(/[0-9]/g, w => persianDigits[+w]);
        }
        return String(num);
    }

    /**
     * Converts a Gregorian date to a Jalaali date string.
     * @param {Date} date - The date object.
     * @returns {string} The formatted Jalaali date.
     */
    toPersianDate(date) {
        if (typeof jalaali === 'undefined') return date.toLocaleDateString();
        const jd = jalaali.toJalaali(date);
        return `${this.formatNumber(jd.jy)}/${this.formatNumber(jd.jm)}/${this.formatNumber(jd.jd)}`;
    }
}